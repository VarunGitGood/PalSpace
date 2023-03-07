import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config({ path: './config/config.env' })

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
})

const checkRedis = async () => {
  try {
    await client.ping()
    console.log('Redis connected')
  } catch (error) {
    console.log(error)
  }
}

// const initRedis = async () => {
//   try {
//     await client
//   } catch (error) {
//     console.log(error)
//   }
// }
export { client, checkRedis }
