
import {Server} from 'socket.io'

let io;

export function initSocket(httpServer){

    io = new Server(httpServer,{
        cors:{
            origin:'https://nexo69ai.vercel.app',
            credentials:true
        }
    })

    console.log("Socket server is running")

    io.on('connection',(socket)=>{
        console.log('a user was connected '+socket.id)
    })

}

export function getIo(){

    if(!io){
        throw new Error("socket io not initiazation ")
    }

    return io
}