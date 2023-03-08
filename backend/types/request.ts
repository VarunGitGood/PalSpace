import { Request } from 'express'
// Socket type not working

interface Req extends Request {
  socketId: string
  io: any
}

export { Req }
