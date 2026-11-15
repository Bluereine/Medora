import express from 'express'
import cors from 'cors'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Medora API is running',
    version: '1.0.0',
    docs: '/api/health'
  })
})

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'medora-backend',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  })
})

export default app
