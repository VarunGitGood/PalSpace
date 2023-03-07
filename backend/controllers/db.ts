import { ErrorResponse } from '../middlewares/errorHandler'
import { client } from '../config/redis'

// *** Later automate making queues for each user

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
    const queue = await client.lrange('global', 0, -1)
    if (queue.includes(id)) {
      return next(new ErrorResponse(500, 'Not Allowed to join'))
    }
    await client.rpush('global', id)
    res.status(200).json({
      status: 'success',
      message: 'User Added to queue successfully',
      queue: queue,
    })
  } catch (error) {
    return next(new ErrorResponse(500, 'Unable to join queue (Server Error)'))
  }
}

// Flush Queue
// GET /api/v1/queues/flush
// Private
export const flushQueue = async (req: any, res: any, next: any) => {
  try {
    await client.flushall()
    res.status(200).json({
      status: 'success',
      message: 'Queue flushed successfully',
    })
  } catch (error) {
    return next(new ErrorResponse(500, '(Server Error)'))
  }
}
