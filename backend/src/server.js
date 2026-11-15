import app from './app.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5000

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
