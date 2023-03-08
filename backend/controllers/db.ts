import { ErrorResponse } from '../middlewares/errorHandler'
import { client } from '../config/redis'
import { socketId } from '../index'

// *** Later automate making queues for each user

const matchUsers = async (queue: any, next: any) => {
  try {
    if (queue.length >= 2) {
      const user1 = await client.lpop('global')
      const user2 = await client.lpop('global')
      return [user1, user2]
    } else {
      return 0
    }
  } catch (error) {
    return next(new ErrorResponse(500, 'Unable to match users (Server Error)'))
  }
}

// Join Queue
// POST /api/v1/queues/join
// Public
export const joinQueue = async (req: any, res: any, next: any) => {
  try {
    // const { queueName } = req.body
    // *** change below body to user
    const { id } = req.body
    const io = req.io
    // const id = socketId
    // if(queueName) {
    // }
    await client.rpush('global', id)
    const queue = await client.lrange('global', 0, -1)
    const matchedUsers = await matchUsers(queue, next)
    let peerId = ''
    let Qstatus: string
    if (matchedUsers) {
      peerId = matchedUsers.find((user: any) => user !== id)
      matchedUsers.forEach((user: any) => {
        io.to(user).emit('match', peerId)
      })
      Qstatus = 'matched'
    } else {
      console.log('Not enough users')
      Qstatus = 'waiting'
    }
    res.status(200).json({
      status: 'success',
      message: 'User Added to queue successfully',
      data: {
        Qstatus,
        peerId,
      },
    })
  } catch (error) {
    return next(new ErrorResponse(500, 'Unable to join queue (Server Error)'))
  }
}

// Match users
// GET /api/v1/queues/match
// Private
// export const matchUsers = async (req: any, res: any, next: any) => {}

// Flush Queue
// GET /api/v1/queues/flush
// Private
export const flushQueue = async (req: any, res: any, next: any) => {
  try {
    await client.flushall()
    // const io = req.io
    // io.emit('flush', 'flush')
    res.status(200).json({
      status: 'success',
      message: 'Queue flushed successfully',
    })
  } catch (error) {
    return next(new ErrorResponse(500, '(Server Error)'))
  }
}
