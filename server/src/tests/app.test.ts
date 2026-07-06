import request from 'supertest';
import app from '../app';

describe('App Base Route', () => {
  it('should return 200 OK and a welcome message', async () => {
    // Supertest allows us to send simulated HTTP requests to our Express app
    const response = await request(app).get('/');
    
    // Jest expectations
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Welcome to the LRT Church Management Platform API');
  });
});
