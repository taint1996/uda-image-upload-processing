import supertest from 'supertest';
import express from 'express';

const app = express();
const request = supertest(app);

describe('Test /imgs endpoint responses', () => {
  it('GET /imgs expected to be 404', async () => {
    const response = await request.get('/imgs');
    expect(response.status).toBe(404);
  });
});
