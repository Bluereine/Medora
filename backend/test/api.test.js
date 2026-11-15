import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../src/app.js'

describe('Medora Backend API Endpoints', () => {
  it('GET / should return 200 with API status information', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.equal(response.body.message, 'Medora API is running')
    assert.equal(response.body.version, '1.0.0')
    assert.equal(response.body.docs, '/api/health')
  })

  it('GET /api/health should return 200 with service health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.equal(response.body.status, 'healthy')
    assert.equal(response.body.service, 'medora-backend')
    assert.ok(typeof response.body.timestamp === 'string')
    assert.ok(response.body.uptime.endsWith('s'))
  })

  it('GET /non-existent-route should return 404', async () => {
    await request(app)
      .get('/non-existent-route')
      .expect(404)
  })
})
