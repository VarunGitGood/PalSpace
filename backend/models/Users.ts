import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  peerId: {
    type: String,
    required: false,
  },
})

export default mongoose.model('User', userSchema)
