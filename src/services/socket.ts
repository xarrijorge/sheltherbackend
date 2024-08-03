import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'

let io: Server

export function initializeSocket(server: HttpServer): void {
  io = new Server(server)

  io.on('connection', (socket: Socket) => {
    console.log('New client connected')

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
}

export function getIo(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized!')
  }
  return io
}
