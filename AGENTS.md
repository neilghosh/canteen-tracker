# Canteen Tracker

## Commands

- Start: `npm start` (http://localhost:3000)
- Test: `npm test`

## Repository roles

- `README.md`: project overview and links
- `requirements.md`: feature and acceptance requirements
- `server.js`: zero-dependency app and API implementation
- `server.test.js`: Node test suite
- `.agents/prompts/`: focused workflow kickoffs
- `.agents/skills/`: reusable agent skills

## Working guidance

- Use `requirements.md` as the source of truth for requested changes.
- Keep implementations in `server.js` and focused tests in `server.test.js`.
- Use the Node test suite for API behavior; directly verify status codes, bodies, and mutations.
- Start the app before browser verification and test the complete UI workflow.

## Cloud Run & Observability

- **GCP Project**: `demoneil`
- **Cloud Run Service**: `canteen-tracker` (default region: `us-central1`)
- **Runtime**: `server.js` listens on `process.env.PORT || 3000` (Cloud Run injects `PORT`).
- **Deploy**: Follow `.agents/skills/cloud-run-deploy/SKILL.md` (supports both direct `gcloud run deploy` for quick demos and GitHub Actions CI/CD).
- **Monitor & Debug Errors**: Follow `.agents/skills/cloud-run-debug/SKILL.md` to inspect GitHub Actions, Cloud Build, and Cloud Run logs.
- **Guardrail**: Always run `npm test` before deploying and confirm with the user before mutating cloud resources.
