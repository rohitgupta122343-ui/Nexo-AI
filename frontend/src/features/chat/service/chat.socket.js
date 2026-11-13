
import {io} from 'socket.io-client'

export function initSocketConnection(){

    const socket = io("http://localhost:3000",{
        withCredentials:true
    })

    socket.on('connect',()=>{
        console.log('socket connected to server')
    })
}