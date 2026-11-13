
import axios from 'axios'

const api = axios.create({
    baseURL:'https://nexo-ai-e7li.onrender.com',
    withCredentials:true
})

export async function sendMessage({message,chatId}){

    const res = await api.post('/api/chats/message',{message,chat:chatId})

    return res.data

}

export async function getChats(){

    const res = await api.get('/api/chats/')

    return res.data

}

export async function getMessage(chatId){

    const res = await api.get(`/api/chats/${chatId}/messages`)

    return res.data

}

export async function deleteChat(chatId){

    const res = await api.delete(`/api/chats/delete/${chatId}`)

    return res.data

}