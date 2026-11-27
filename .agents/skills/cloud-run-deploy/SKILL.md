---
name: cloud-run-deploy
description: >-
  Deploy canteen-tracker to Google Cloud Run (project: demoneil) either
  directly from the terminal for quick demos or via GitHub Actions CI/CD.
---

# Cloud Run Deployment Runbook

Target environment:
- **GCP Project**: `demoneil`
- **Service**: `canteen-tracker`
- **Default Region**: `us-central1`

## 1. Pre-Deploy Checks (Always)

1. Run `npm test` and confirm all tests pass.
2. Verify `server.js` listens on `Number(process.env.PORT) || 3000`.
3. Confirm with the user before triggering a deployment.

## 2. Option A: Direct Terminal Deploy (Fastest for Demos)

Use `gcloud` (or the `gcloud` MCP server) directly from the repo root:

```powershell
gcloud config set project demoneil
gcloud run deploy canteen-tracker `
  --source . `
  --region us-central1 `
  --allow-unauthenticated
```

If prompted to enable required APIs (`run.googleapis.com`, `cloudbuild.googleapis.com`, `artifactregistry.googleapis.com`), confirm or run:

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project demoneil
```

## 3. Option B: GitHub Actions CI/CD Deploy

The workflow `.github/workflows/deploy-cloud-run.yml` runs `npm test` and deploys to Cloud Run on pushes to `main` or manual dispatch.

Trigger manually and watch progress:

```powershell
gh workflow run deploy-cloud-run.yml
gh run watch
```

## 4. Post-Deploy Verification

1. Get the live service URL:
   ```powershell
   gcloud run services describe canteen-tracker --region us-central1 --project demoneil --format="value(status.url)"
   ```
2. Smoke-test `GET /` and `GET /api/expenses` against that URL.
