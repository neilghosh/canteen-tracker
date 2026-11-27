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
