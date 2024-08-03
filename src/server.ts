import app from './app'
// import { initializeSocket } from './services/socket'

const PORT: number = parseInt(process.env.PORT || '3000', 10)
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// initializeSocket(server)
