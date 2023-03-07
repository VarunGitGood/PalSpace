import { io } from '../index'
import { ErrorResponse } from './errorHandler'

const setSocket = async (req: any, res: any, next: any) => {
  try {
    io.on('connection', (socket: any) => {
      console.log('connected')
      req.socket = socket
      socket.on('disconnect', () => {
        console.log('disconnected')
      })
    })
  } catch (error) {
    return next(new ErrorResponse(500, 'Unable to set socket (Server Error)'))
  }
}

export { setSocket }
