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

// Signup — NOTE: intentionally missing input validation on email/name
app.post('/signup', (req, res) => {
  const { name, email } = req.body;
  const user = { id: items.length + 1, name, email };
  res.status(201).json(user);
});

// Helper with no test coverage
function formatUser(user) {
  return `${user.name} <${user.email}>`;
}

module.exports = { app, formatUser };
