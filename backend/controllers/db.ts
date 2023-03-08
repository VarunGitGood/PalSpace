import { ErrorResponse } from '../middlewares/errorHandler'
import { client } from '../config/redis'

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
    // if(queueName) {
    // }
    // const queue = await client.lrange(queueName, 0, -1)
    await client.rpush('global', id)
    const matchedUsers = await matchUsers('global', next)
    if (matchedUsers) {
      // *** Emit event to users matched and exchange socket ids
      console.log(matchedUsers)
    } else {
      console.log('Not enough users')
    }
    const queue = await client.lrange('global', 0, -1)
    res.status(200).json({
      status: 'success',
      message: 'User Added to queue successfully',
      queue: queue,
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
    // await client.flushall()
    const io = req.io
    io.emit('flush', 'flush')
    res.status(200).json({
      status: 'success',
      message: 'Queue flushed successfully',
    })
  } catch (error) {
    return next(new ErrorResponse(500, '(Server Error)'))
  }
}
