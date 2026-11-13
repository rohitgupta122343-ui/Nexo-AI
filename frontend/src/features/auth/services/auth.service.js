
import axios from 'axios'

const api = axios.create({
    baseURL:'https://nexo-ai-e7li.onrender.com',
    withCredentials:true
})

export async function login({email,password}){

    const res = await api.post('/api/auth/login',{email,password})

    return res.data

}

export async function register({username,email,password}){

    const res = await api.post('/api/auth/register',{username,email,password})

    return res.data

}

export async function resendVerificationEmail(email){

    const res = await api.post('/api/auth/resend-verification',{email})

    return res.data

}

export async function getMe(){

    const res = await api.get('/api/auth/get-me')

    return res.data

}

export async function logout(){

    const res = await api.get('/api/auth/logout')

    return res.data
}