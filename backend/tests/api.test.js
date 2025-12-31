const request = require('supertest');
const app = require('./server');

describe('API Tests', () => {
  it('should return health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });
});