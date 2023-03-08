// connect mongodb function
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: './config/config.env' })

const uri: string = process.env.MONGO_URI || ''

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
