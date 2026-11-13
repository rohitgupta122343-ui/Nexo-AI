
import 'dotenv/config'
import app from './src/app.js'
import { initSocket } from './socket/server.socket.js'
import http from 'http'
import { connectToDb } from './src/config/database.js'


await connectToDb()

const httpServer = http.createServer(app)

initSocket(httpServer)

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000')


})