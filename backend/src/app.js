
import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import authRouter from './routes/auth.route.js'
import chatRouter from './routes/chat.route.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(morgan("dev"))

app.use(cors({
    origin:'https://nexo69ai.vercel.app',
    credentials:true
}))

app.use('/api/auth',authRouter)
app.use('/api/chats',chatRouter)


export default app