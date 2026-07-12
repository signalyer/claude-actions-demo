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

// List items
app.get('/items', (req, res) => {
  res.json(items);
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

module.exports = { app, formatUser };
