---
name: cloud-run-debug
description: >-
  Monitor and debug build, deployment, and runtime errors for canteen-tracker
  across GitHub Actions, Cloud Build, and Cloud Run logs (project: demoneil).
---

# Cloud Run Monitoring & Error Debugging Runbook

Target environment:
- **GCP Project**: `demoneil`
- **Service**: `canteen-tracker`
- **Default Region**: `us-central1`

## 1. Triage Order

Determine which stage failed:
1. **GitHub Actions CI/CD failed** -> inspect workflow run logs with `gh`.
2. **Cloud Build / container build failed** -> inspect Cloud Build logs with `gcloud` / `gcloud` MCP.
3. **Cloud Run startup or runtime error** -> query Cloud Logging with `observability` MCP or `gcloud logging read`.

## 2. Check GitHub Actions Failures

```powershell
gh run list --workflow=deploy-cloud-run.yml --limit 5
gh run view <run-id> --log-failed
```

## 3. Check Cloud Build Failures

```powershell
gcloud builds list --project demoneil --limit 5
gcloud builds log <build-id> --project demoneil
```

## 4. Check Cloud Run Runtime & Startup Errors

Prefer the `observability` MCP server when available, or run:

```powershell
gcloud logging read `
  'resource.type="cloud_run_revision" AND resource.labels.service_name="canteen-tracker" AND severity>=ERROR' `
  --project demoneil `
  --limit 30 `
  --format="table(timestamp,severity,textPayload,jsonPayload.message)"
```

To inspect HTTP 5xx request logs:

```powershell
gcloud logging read `
  'resource.type="cloud_run_revision" AND resource.labels.service_name="canteen-tracker" AND httpRequest.status>=500' `
  --project demoneil `
  --limit 20
```

## 5. Correlate to Code & Verify

- Map stack traces or failing routes back to `server.js`.
- Common Cloud Run pitfalls:
  - Container failed to start: verify `server.js` binds to `process.env.PORT` and `package.json` has `"start": "node server.js"`.
  - 500 errors on `/api/expenses`: check request parsing and error handling in `server.js`.
- Add or update a regression test in `server.test.js` and run `npm test` before redeploying.
