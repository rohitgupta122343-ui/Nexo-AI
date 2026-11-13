
import { initSocketConnection } from "../service/chat.socket";
import { setChats,setError,setLoading,setcurrentChatId,createNewChat,addNewMessage,addMessage } from "../chat.slice";
import { sendMessage,getChats,getMessage,deleteChat } from "../service/chat.service";
import {useDispatch} from 'react-redux'

export function useChat(){

    const dispatch = useDispatch()


    const handleSendMessage = async({message,chatId})=>{

        dispatch(setLoading(true))
        const data = await sendMessage({message,chatId})

        const { chat,aiMessage,userMessage} = data

         const activeChatId = chatId || chat._id


        if(!chatId)
            dispatch(createNewChat({
                chatId:chat._id,
                title:chat.title
            }))
        

        dispatch(addNewMessage({
            chatId:activeChatId,
            content:message,
            role:"user"
        }))

        dispatch(addNewMessage({
            chatId:activeChatId,
            content:aiMessage.content,
            role:aiMessage.role
        }))

        dispatch(setcurrentChatId(activeChatId))
        dispatch(setLoading(false))
        }


async function handleGetChats() {
    try {
        dispatch(setLoading(true))

        const data = await getChats()

        const chats = Array.isArray(data.chats)
            ? data.chats
            : data.chats
                ? [data.chats]
                : []

        dispatch(setChats(
            chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: chat.messages || [],
                    lastUpdated: chat.updatedAt
                }

                return acc
            }, {})
        ))

    } catch (error) {
        console.log("Get Chats Error:", error)
    } finally {
        dispatch(setLoading(false))
    }
}

async function handleOpenChat(chatId,chats) {

    if(chats[ chatId ]?.messages.length === 0){
        
        const data = await getMessage(chatId)
        
        const {messages} = data
        
        const formattedMessage = messages.map(msg=>({
            content:msg.content,
            role:msg.role
        }))
        
        dispatch(addMessage({
            chatId,
            messages:formattedMessage
        }))
        
    }
        dispatch(setcurrentChatId(chatId))

}

async function handleDeleteChat(chatId){

    dispatch(setLoading(true))
    await deleteChat(chatId)
    dispatch(setLoading(false))

    handleGetChats()

}

       


    return{
        initSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat
    }
}