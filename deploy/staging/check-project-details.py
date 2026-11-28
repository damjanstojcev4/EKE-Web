#!/usr/bin/env python3
"""Read-only staging readiness check against the exact generated static export."""
import argparse
import hashlib
import html
import http.client
import json
from pathlib import Path
import re
import socket
import sys
import time
from urllib.parse import quote, unquote, urlsplit
from uuid import uuid4


class NotReady(Exception):
    pass


class UnixConnection(http.client.HTTPConnection):
    def __init__(self, host, filename):
        super().__init__(host, timeout=5)
        self.filename = filename

    def connect(self):
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(self.timeout)
        self.sock.connect(self.filename)


class Probe:
    def __init__(self, base_url, root, unix_socket=None):
        self.url = urlsplit(base_url)
        if (self.url.scheme not in ("http", "https") or not self.url.hostname
                or self.url.username or self.url.password or self.url.path not in ("", "/")
                or self.url.query or self.url.fragment):
            raise ValueError("An HTTP(S) origin is required")
        self.root = Path(root).resolve(strict=True)
        self.unix_socket = unix_socket
        self.checked = []

    def get(self, path):
        # Fresh connections cannot stay pinned to a gracefully draining worker.
        connection = (UnixConnection(self.url.netloc, self.unix_socket) if self.unix_socket
                      else (http.client.HTTPSConnection if self.url.scheme == "https"
                            else http.client.HTTPConnection)(self.url.netloc, timeout=5))
        separator = "&" if "?" in path else "?"
        try:
            connection.request("GET", path + separator + "_eke_check=" + uuid4().hex,
                               headers={"Connection": "close", "Accept-Encoding": "identity",
                                        "Cache-Control": "no-cache"})
            response = connection.getresponse()
            body = response.read()
            if response.status != 200:
                raise NotReady(f"{path}: HTTP {response.status}")
            self.checked.append(path)
            return body
        finally:
            connection.close()

    def static(self, path, filename):
        expected = (self.root / filename).resolve(strict=True)
        expected.relative_to(self.root)
        body = self.get(path)
        if hashlib.sha256(body).digest() != hashlib.sha256(expected.read_bytes()).digest():
            raise NotReady(f"{path}: response does not match {filename} in the selected export")
        return body

    def check(self):
        self.checked = []
        projects = json.loads(self.get("/api/projects/public"))
        if not isinstance(projects, list):
            raise NotReady("Public projects API did not return an array")
        project = next((p for p in projects if isinstance(p, dict)
                        and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", p.get("slug") or "")), None)
        if project is None:
            raise NotReady("No existing public project with a valid slug; no records will be created")
        slug = project["slug"]
        details = json.loads(self.get("/api/projects/slug/" + quote(slug, safe="")))
        if (not isinstance(details, dict) or details.get("slug") != slug
                or details.get("uuid") != project.get("uuid")):
            raise NotReady("Slug API returned a different project")
        shell = "projects/details/index.html"
        self.static(f"/projects/{slug}/", shell)
        self.static(f"/projects/{slug}", shell)
        body = self.static("/projects/details/?slug=" + quote(slug, safe=""), shell)
        self.static("/projects/", "projects/index.html")
        self.static("/projects/index.txt", "projects/index.txt")
        assets = sorted({html.unescape(asset) for asset in re.findall(
            r'(?:src|href)="([^"]+)"', body.decode())
            if asset.startswith("/_next/static/") and urlsplit(asset).path.endswith((".js", ".css"))})
        if not any(urlsplit(asset).path.endswith(".js") for asset in assets) or not any(
                urlsplit(asset).path.endswith(".css") for asset in assets):
            raise NotReady("Exported shell has no JavaScript/CSS assets")
        for asset in assets:
            self.static(asset, unquote(urlsplit(asset).path).lstrip("/"))
        if (self.root / "news/unavailable/index.html").is_file():
            self.static("/news/unavailable/", "news/unavailable/index.html")
        return {"slug": slug, "checked": self.checked}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="https://preview.ekebitola.org")
    parser.add_argument("--export-root", required=True)
    parser.add_argument("--unix-socket", help="Native Nginx regression harness only; no TCP port")
    parser.add_argument("--attempts", type=int, default=15)
    parser.add_argument("--interval", type=float, default=1)
    parser.add_argument("--stable-passes", type=int, default=2)
    args = parser.parse_args()
    if args.attempts < args.stable_passes or args.stable_passes < 1 or args.interval < 0:
        parser.error("Require attempts >= stable-passes >= 1 and interval >= 0")
    probe = Probe(args.base_url, args.export_root, args.unix_socket)
    consecutive = 0
    for attempt in range(1, args.attempts + 1):
        try:
            result = probe.check()
            consecutive += 1
            if consecutive >= args.stable_passes:
                print(json.dumps({"ready": True, "attempts": attempt, **result}), flush=True)
                return 0
        except (NotReady, OSError, ValueError, http.client.HTTPException) as error:
            consecutive = 0
            print(f"Project Details not ready ({attempt}/{args.attempts}): {error}",
                  file=sys.stderr, flush=True)
        if attempt < args.attempts:
            time.sleep(args.interval)
    print("Project Details readiness failed; stop activation and restore the previous release/config.",
          file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
