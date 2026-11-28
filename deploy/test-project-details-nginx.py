#!/usr/bin/env python3
"""Test a real static export and graceful reload with native Nginx on a Unix socket."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import pwd
import shutil
import signal
import subprocess
import sys
import tempfile
import time

repository = Path(__file__).resolve().parent.parent
checker = repository / "deploy/staging/check-project-details.py"
spec = importlib.util.spec_from_file_location("project_readiness", checker)
readiness = importlib.util.module_from_spec(spec)
spec.loader.exec_module(readiness)


def quoted(value):
    return '"' + str(value).replace("\\", "\\\\").replace('"', '\\"').replace("$", "\\$") + '"'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--export-root", type=Path,
                        default=repository / "Frontend/ece-website/out")
    parser.add_argument("--nginx", default=shutil.which("nginx"))
    parser.add_argument("--api-origin", help="Optional existing loopback API; GET requests only")
    parser.add_argument("--evidence-dir", type=Path)
    args = parser.parse_args()
    if not args.nginx:
        parser.error("A native Nginx binary is required; this test never installs or starts a service")
    root = args.export_root.resolve(strict=True)
    assert (root / "projects/details/index.html").is_file(), "Build the static export first"
    if args.api_origin:
        url = readiness.urlsplit(args.api_origin)
        assert url.scheme == "http" and url.hostname in ("127.0.0.1", "localhost", "::1")
        assert not url.username and not url.password and url.path in ("", "/")
        assert not url.query and not url.fragment
    work = Path(tempfile.mkdtemp(prefix="eke-nginx-"))
    work.chmod(0o755)
    sock = work / "http.sock"
    config_path = work / "nginx.conf"
    # CI uses public GET fixtures in this same Nginx, with no database or extra listener.
    project = {"uuid": "existing-project", "slug": "existing-project", "title": "Existing project"}
    api = (f"location /api/ {{ proxy_buffering off; proxy_pass {args.api_origin.rstrip('/')}; }}"
           if args.api_origin else "\n".join(
               f"location = {path} {{ default_type application/json; return 200 '{body}'; }}"
               for path, body in [("/api/projects/public", json.dumps([project])),
                                  ("/api/projects/slug/existing-project", json.dumps(project))]))
    snippet = (repository / "deploy/staging/eke-staging-project-details.conf").read_text()
    user = ""
    if os.geteuid() == 0:
        for candidate in ("nginx", "www-data", "nobody"):
            try:
                pwd.getpwnam(candidate)
                user = f"user {candidate};"
                break
            except KeyError:
                pass

    def configure(fallback):
        config_path.write_text(f"""{user}
worker_processes 2;
pid {quoted(work / 'nginx.pid')};
error_log {quoted(work / 'error.log')} notice;
events {{ worker_connections 128; }}
http {{
    types {{ text/html html; application/javascript js; text/css css; text/plain txt; }}
    default_type application/octet-stream;
    client_body_temp_path {quoted(work / 'body')};
    proxy_temp_path {quoted(work / 'proxy')};
    fastcgi_temp_path {quoted(work / 'fastcgi')};
    uwsgi_temp_path {quoted(work / 'uwsgi')};
    scgi_temp_path {quoted(work / 'scgi')};
    log_format forensic '$msec pid=$pid status=$status uri=$request_uri final=$uri upstream=$upstream_status';
    access_log {quoted(work / 'access.log')} forensic;
    server {{
        listen unix:{sock};
        server_name preview.ekebitola.org;
        root {quoted(root)};
        index index.html;
        {api}
        {snippet if fallback else ''}
        location / {{ try_files $uri $uri/ =404; }}
        error_page 404 /404.html;
        location = /404.html {{ internal; }}
    }}
}}
""")

    def command(*extra):
        return [args.nginx, "-e", str(work / "bootstrap.log"), "-p", str(work) + "/",
                "-c", str(config_path), *extra]

    process = checking = None
    paused = False
    log = open(work / "process.log", "w")
    check_out = open(work / "readiness.json", "w")
    check_error = open(work / "readiness.log", "w")
    try:
        configure(False)
        subprocess.run(command("-t"), check=True, stdout=log, stderr=log)
        process = subprocess.Popen(command("-g", "daemon off;"), stdout=log, stderr=log)
        for _ in range(100):
            if sock.exists():
                break
            assert process.poll() is None, (work / "process.log").read_text()
            time.sleep(.02)
        probe = readiness.Probe("http://preview.ekebitola.org", root, str(sock))
        records = json.loads(probe.get("/api/projects/public"))
        slug = next(p["slug"] for p in records if readiness.re.fullmatch(
            r"[a-z0-9]+(?:-[a-z0-9]+)*", p.get("slug") or ""))
        # Query access works before the clean-URL location exists.
        probe.static("/projects/details/?slug=" + slug, "projects/details/index.html")
        try:
            probe.static("/projects/" + slug + "/", "projects/details/index.html")
            raise AssertionError("Legacy routing unexpectedly accepts an unexported slug")
        except readiness.NotReady as error:
            assert "HTTP 404" in str(error), str(error)

        configure(True)
        subprocess.run(command("-t"), check=True, stdout=log, stderr=log)
        # Deterministically retain the old generation after reload signals success.
        # Only this disposable master is paused; live Nginx is never signalled.
        os.kill(process.pid, signal.SIGSTOP)
        paused = True
        subprocess.run(command("-s", "reload"), check=True, stdout=log, stderr=log)
        checking = subprocess.Popen([sys.executable, str(checker), "--export-root", str(root),
                                     "--base-url", "http://preview.ekebitola.org",
                                     "--unix-socket", str(sock), "--attempts", "60",
                                     "--interval", "0.05"], stdout=check_out, stderr=check_error)
        for _ in range(100):
            if "HTTP 404" in (work / "readiness.log").read_text():
                break
            assert checking.poll() is None, "Checker failed before the reload transition settled"
            time.sleep(.02)
        else:
            raise AssertionError("Did not reproduce the old-worker 404")
        os.kill(process.pid, signal.SIGCONT)
        paused = False
        assert checking.wait(timeout=20) == 0, (work / "readiness.log").read_text()
        result = json.loads((work / "readiness.json").read_text())
        assert result["attempts"] > 1, "Regression did not exercise readiness retry"
        print(json.dumps({"nativeNginx": subprocess.check_output(
            [args.nginx, "-v"], stderr=subprocess.STDOUT, text=True).strip(),
            "queryBeforeFallback": 200, "cleanBeforeFallback": 404,
            "oldWorker404Observed": True, **result}, indent=2))
        if args.evidence_dir:
            args.evidence_dir.mkdir(parents=True, exist_ok=True)
            for name in ("readiness.json", "readiness.log", "access.log", "error.log", "nginx.conf"):
                shutil.copyfile(work / name, args.evidence_dir / name)
    finally:
        if process is not None and process.poll() is None:
            if paused:
                os.kill(process.pid, signal.SIGCONT)
            process.send_signal(signal.SIGQUIT)
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
        if checking is not None and checking.poll() is None:
            checking.terminate()
            checking.wait(timeout=10)
        log.close()
        check_out.close()
        check_error.close()
        shutil.rmtree(work)


if __name__ == "__main__":
    main()
