Contact enquiries
=================

The static frontend posts multipart form data to `/api/enquiries` on its own
origin. nginx relays the unchanged body (including the multipart boundary and
documentation) to `https://n8n.myceliumagency.cloud/webhook/eke-mail`. This avoids
browser CORS requirements on n8n. There is no Spring Contact entity, storage,
message administration, or SMTP service.

On staging, install `deploy/staging/eke-staging-api-routes.conf` using
`apply-enquiry-routing.sh` from that directory as root. The installer checks the
existing routing revision, backs it up, validates nginx, and reloads it, with
rollback on failure. This routing installation is separate from the static
frontend deployment. It does not restart the backend.

The exact relay location only accepts POST, limits the request to 6 MB (the form
allows one document up to 5 MB), verifies the upstream TLS certificate, strips
website authentication headers, and disables upstream retries and caching.
Other hosting environments must install the same exact relay location in their
HTTPS server and use their system CA bundle path before deploying this frontend.
