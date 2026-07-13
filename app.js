const express = require('express');

const app = express();
app.use(express.json());

const items = [
  { id: 1, name: 'Widget' },
  { id: 2, name: 'Gadget' },
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Parse an optional positive-integer query param.
// Returns { ok: true, value } when valid (value is undefined when the param is absent),
// or { ok: false } when the param is present but malformed.
function parsePositiveIntParam(raw) {
  if (raw === undefined) return { ok: true, value: undefined };
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return { ok: false };
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) return { ok: false };
  return { ok: true, value };
}

// List items — supports an optional ?limit= positive integer.
// Validate before use: reject a malformed limit with a 400, matching the /signup standard.
app.get('/items', (req, res) => {
  const limit = parsePositiveIntParam(req.query.limit);
  if (!limit.ok) {
    return res.status(400).json({ error: 'limit must be a positive integer' });
  }

  const result = limit.value === undefined ? items : items.slice(0, limit.value);
  res.json(result);
});

// Basic email format validation (RFC-5322-lite: local@domain.tld)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(email) {
  return isNonEmptyString(email) && EMAIL_REGEX.test(email);
}

// Signup — validates that name and email are present and well-formed
app.post('/signup', (req, res) => {
  const { name, email } = req.body || {};

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (!isNonEmptyString(email)) {
    return res.status(400).json({ error: 'email is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'email format is invalid' });
  }

  const user = { id: items.length + 1, name: name.trim(), email: email.trim() };
  res.status(201).json(user);
});

// Helper with no test coverage
function formatUser(user) {
  return `${user.name} <${user.email}>`;
}

module.exports = { app, formatUser, parsePositiveIntParam };
