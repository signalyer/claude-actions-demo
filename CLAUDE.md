# Coding Standards

These standards apply to all changes in this repository.

- All new routes must validate input before using request data. Reject missing or malformed fields with a 400 response.
- Prefer async/await over callbacks.
- Every exported function must have at least one test.
- Keep dependencies current — flag outdated packages when touching `package.json`.
- Use `const`/`let`, never `var`.
- Return JSON error responses in the shape `{ "error": "message" }`.
