
import {io} from 'socket.io-client'

export function initSocketConnection(){

    const socket = io("https://nexo-ai-e7li.onrender.com",{
        withCredentials:true
    })

    socket.on('connect',()=>{
        console.log('socket connected to server')
    })
}