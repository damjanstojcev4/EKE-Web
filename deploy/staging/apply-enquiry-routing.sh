#!/usr/bin/env bash
# Run from deploy/staging as root on the staging VPS. Does not restart Spring.
set -euo pipefail
test "$(id -u)" = 0
config=/etc/nginx/conf.d/eke-staging.conf
routes=/etc/nginx/snippets/eke-staging-api-routes.conf
test -f "$config" && test ! -L "$config"
test -f "$routes" && test ! -L "$routes"
grep -q 'server_name preview.ekebitola.org;' "$config"
grep -q 'include /etc/nginx/snippets/eke-staging-api-routes.conf;' "$config"
test -f /etc/pki/tls/certs/ca-bundle.crt
# Refuse to overwrite unreviewed changes to the live routes.
if cmp -s "$routes" eke-staging-api-routes.conf; then
    nginx -t
    exit 0
fi
test "$(sha256sum "$routes" | cut -d ' ' -f1)" = 32f8ada087715054940ac8eda25b2a690e80cd9f9f2b727e3af1fa53737c1a48
backup="/var/backups/eke-enquiry-routing-$(date -u +%Y%m%dT%H%M%SZ)"
install -d -m 700 "$backup"
cp -a "$routes" "$backup/routes.conf"
rollback() {
    cp -a "$backup/routes.conf" "$routes"
    nginx -t && systemctl reload nginx
}
trap rollback ERR
install -m 644 eke-staging-api-routes.conf "$routes"
nginx -t
systemctl reload nginx
trap - ERR
echo "Installed staging enquiry relay. Backup: $backup"
