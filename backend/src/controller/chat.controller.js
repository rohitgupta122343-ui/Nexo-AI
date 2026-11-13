
import { genrateResponse,genrateChatTitle } from "../services/ai.services.js"
import chatModel from "../models/chat.model.js"
import messageModel from '../models/message.model.js'


export async function sendMessage(req,res){

    const {message, chat:chatId } = req.body

    
    let title = null , chat =null
    
    if(!chatId){
        title = await genrateChatTitle(message)
        
        chat = await chatModel.create({
            user:req.user,
            title
        })
    }

    const userMessage = await messageModel.create({
        chat:chatId || chat._id,
        content:message,
        role:'user'
    })
    
    const messages = await messageModel.find({chat:chatId || chat._id})
    
    
    const result = await genrateResponse(messages)

    const aiMessage = await messageModel.create({
        chat:chatId || chat._id,
content: typeof result === "string" ? result : JSON.stringify(result),
        role:'ai'
    })



    res.status(201).json({
        aiMessage : result,
        title,
        chat,
        aiMessage,
        userMessage
    })


}



export async function getChats(req,res){

    const user = req.user

    const chats = await chatModel.find({user})

    return res.status(200).json({
        message : 'chat fetch sucessfully',
        chats
    })

}

export async function getMessage(req,res){

    const userId = req.user
    const { chatId } = req.params

    const chat = await chatModel.findOne({
        _id:chatId,
        user:userId
    })

    if(!chat){
        return res.status(404).json({
            message : 'Chat not found'
        })
    }

    const messages = await messageModel.find({
        chat:chatId 
    })

    return res.status(200).json({
        message : 'messages fetch sucessfully',
        messages
    })

}

export async function deleteChat(req,res){

    const { chatId } = req.params

    const chat = await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user
    })

    await messageModel.deleteMany({
        chat:chatId
    })

    res.status(200).json({
        message : 'chat delete sucessfully'
    })

}