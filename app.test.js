const request = require('supertest');
const { app, formatUser } = require('./app');

describe('routes', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /items returns a list', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('POST /signup creates a user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: 'Ada', email: 'ada@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Ada');
    expect(res.body.email).toBe('ada@example.com');
  });

  test('POST /signup rejects a missing name', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ email: 'ada@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
  });

  test('POST /signup rejects a missing email', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: 'Ada' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'email is required' });
  });

  test('POST /signup rejects a malformed email', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: 'Ada', email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'email format is invalid' });
  });

  test('POST /signup rejects an email missing a TLD', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: 'Ada', email: 'ada@example' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'email format is invalid' });
  });

  test('POST /signup rejects a blank (whitespace-only) name', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: '   ', email: 'ada@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
  });
});

describe('formatUser', () => {
  test('formats a user as "name <email>"', () => {
    expect(formatUser({ name: 'Ada', email: 'ada@example.com' })).toBe(
      'Ada <ada@example.com>'
    );
  });
});
