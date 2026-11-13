
import userModel from '../models/user.model.js'
import { sendEmail } from '../services/mail.services.js'
import jwt from 'jsonwebtoken'

export async function register(req,res) {

    const {username,email,password} = req.body

    const isUserExtist = await userModel.findOne({email})

    if(isUserExtist){
        return res.status(409).json({
            message : 'user already extist with same email',
        })
    }

    const user = await userModel.create({
        username,email,password
    })

    
    const token = jwt.sign({email:user.email},process.env.JWT_SECRECT,{expiresIn:'7d'})

    await sendEmail({
        to : email,
         subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <a href='https://nexo-ai-e7li.onrender.com/api/auth/verify-email?token=${token}'>Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>`
    })

        res.status(201).json({
            message : 'user register sucessfully',
            success : true,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })

}


export async function resendVerificationEmail(req,res){

    const {email} = req.body

    const user = await userModel.findOne({email})

    if(user && !user.verify){

         const token = jwt.sign({email:user.email},process.env.JWT_SECRECT,{expiresIn:'7d'})

        
        await sendEmail({
           to : user.email,
         subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${user.username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <a href='https://nexo-ai-e7li.onrender.com/api/auth/verify-email?token=${token}'>Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>`
    })
    }

    return res.status(200).json({
        message:"Verify Your Email...",
        sucess:true
    })

}


export async function verifyEmail(req,res){

    const {token} = req.query

    const decoded = jwt.verify(token,process.env.JWT_SECRECT)

    const email = decoded.email

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).josn({
            message : 'user not found'
        })
    }

    user.verify = true

    await user.save()

    
        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="https://nexo69ai.vercel.app/login">Go to Login</a>`

        return res.send(html)

}

export async function login(req,res) {

    const { email,password } = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message : 'user not found..'
        })
    }

    const isPassValid = await user.comparePassword(password)

    if(!isPassValid){
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        
        })
    }

    if(!user.verify){
        return res.status(400).json({
            message : 'Please Verify Your Email',
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRECT,{expiresIn:'7d'})

    res.cookie("token",token)

    res.status(200).json({
        message : 'user Logged In..',
        sucess:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

export async function getMe(req,res){

    const user = await userModel.findById(req.user)

    return res.status(200).json({
        message : 'user fetch successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

export async function logout(req,res){


    res.clearCookie('token')

    res.status(200).json({
        message : "user Logout sucessfully"
    })

}