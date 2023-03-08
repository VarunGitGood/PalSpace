import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { checkRedis } from './config/redis'
import routes from './routes/db'
import { createServer } from 'http'
import { setSocket } from './middlewares/socket'
import { Server } from 'socket.io'
dotenv.config({ path: './config/config.env' })
const app = express()

const socketServer = createServer(app)

// ** Fix this
// init(socketServer, app)

const io = new Server(socketServer, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log(`New socket connection: ${socket.id}`)
  io.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

// Check Redis Server
checkRedis()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(setSocket)
app.use('/api/v1/', routes)

app.get('/', (req, res) => {
  res.send('API is running :)')
})

socketServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`)
})

export { io }
