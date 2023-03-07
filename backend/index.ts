import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { checkRedis } from './config/redis'
import routes from './routes/db'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { setSocket } from './middlewares/socket'
dotenv.config({ path: './config/config.env' })
const app = express()

// Mounting Socket.io
const socketServer = createServer(app)

const io = new Server(socketServer, {
  cors: {
    origin: '*',
  },
})

// Check Redis Server
checkRedis()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(setSocket)
app.use('/api/v1/', routes)

app.get('/', (req, res) => {
  res.send('API is running :)')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`)
})

export { io }
