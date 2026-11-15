import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

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

const server = app.listen(PORT, () => {
  console.log(`[Medora Backend] Server running on port ${PORT}`)
})

// Graceful shutdown handling for Cloud Run / Container environments
process.on('SIGTERM', () => {
  console.log('[Medora Backend] SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('[Medora Backend] HTTP server closed')
  })
})

export default app
