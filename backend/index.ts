import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({ path: './config/config.env' })
const app = express()

const a = 1

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Test Clear')
})

app.get('/test', (req, res) => {
  res.send('Test Success?')
})

app.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`Server started on port ${process.env.PORT}`)
})
