import { Router } from 'express'
const routes = Router()
import { joinQueue, flushQueue } from '../controllers/db'

routes.post('/queues/join', joinQueue)
routes.get('/queues/flush', flushQueue)

export default routes
