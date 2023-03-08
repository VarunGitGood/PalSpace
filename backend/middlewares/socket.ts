import { io } from '../index'
import { ErrorResponse } from './errorHandler'

const setSocket = async (req: any, res: any, next: any) => {
  try {
    req.io = io
    next()
  } catch (error) {
    return next(new ErrorResponse(500, 'Unable to set socket (Server Error)'))
  }
}

export { setSocket }

// import { Server } from 'socket.io'
// import { Response, NextFunction } from 'express'
// import { Req } from '../types/request'
// let io: any

// function init(server: any, app: any) {
//   io = new Server(server, {
//     cors: {
//       origin: '*',
//     },
//   })
//   console.log('Initializing socket.io')
//   io.on('connection', (socket: any) => {
//     console.log(`New socket connection: ${socket.id}`)

//     app.use((req: Req, res: Response, next: NextFunction) => {
//       req.socketId = socket.id
//       next()
//     })
//   })
// }

// export { init, io }
