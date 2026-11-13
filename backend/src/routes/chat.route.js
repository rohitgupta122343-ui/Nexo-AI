
import {Router} from 'express'
import { sendMessage,getChats,getMessage,deleteChat } from '../controller/chat.controller.js'
import { AuthUser } from '../middleware/auth.middleware.js'


const chatRouter = Router()

chatRouter.post("/message",AuthUser,sendMessage)

chatRouter.get('/',AuthUser,getChats)

chatRouter.get('/:chatId/messages',AuthUser,getMessage)

chatRouter.delete('/delete/:chatId',AuthUser,deleteChat)

export default chatRouter