#!/usr/bin/env bash
set -euo pipefail
# Staging only. Run from this directory on the VPS as root.
config=/etc/nginx/conf.d/eke-staging.conf
test "$(id -u)" = 0
test -f "$config"
test ! -L "$config"
grep -q 'server_name preview.ekebitola.org;' "$config"
if grep -Eq 'server_name[^;]*(ekebitola\.org|www\.ekebitola\.org);' "$config"; then
  # Reject mixed production/staging vhosts; only the exact preview name is valid.
  test "$(grep 'server_name' "$config" | sort -u | xargs)" = 'server_name preview.ekebitola.org;'
fi
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/var/backups/eke-staging-demo-$stamp"
install -d -m 700 "$backup"
cp -a "$config" "$backup/eke-staging.conf"
install -d /etc/nginx/snippets
for file in eke-staging-api-proxy.conf eke-staging-api-routes.conf; do
  if test -e "/etc/nginx/snippets/$file"; then cp -a "/etc/nginx/snippets/$file" "$backup/$file"; fi
  install -m 644 "$file" "/etc/nginx/snippets/$file"
done
python3 - "$config" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
s = p.read_text()
include = '    include /etc/nginx/snippets/eke-staging-api-routes.conf;'
if include not in s:
    # Fail closed unless this is the inspected PR #15 read-only location.
    start = s.index('    location ~ "^/api/(projects/')
    end = s.index('\n    }', start) + len('\n    }')
    old = s[start:end]
    assert 'limit_except GET { deny all; }' in old
    assert 'proxy_pass http://127.0.0.1:18081;' in old
    s = s[:start] + include + s[end:]
    p.write_text(s)
PY
if ! nginx -t; then
  cp -a "$backup/eke-staging.conf" "$config"
  echo "NGINX validation failed; staging vhost restored. Backup: $backup" >&2
  exit 1
fi
override=/etc/systemd/system/eke-staging-backend.service.d/media-directory.conf
install -d /etc/systemd/system/eke-staging-backend.service.d
if test -e "$override"; then cp -a "$override" "$backup/media-directory.conf"; fi
install -m 644 media-directory.conf "$override"
systemctl daemon-reload
systemctl restart eke-staging-backend.service
for attempt in {1..30}; do
  if curl --fail --silent http://127.0.0.1:18081/api/projects/public >/dev/null; then break; fi
  sleep 1
done
curl --fail --silent http://127.0.0.1:18081/api/projects/public >/dev/null
systemctl reload nginx
echo "Staging runtime/routing applied. Backup: $backup"
