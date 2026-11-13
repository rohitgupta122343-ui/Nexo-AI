
import {Router} from 'express'
import { register, resendVerificationEmail, verifyEmail,login,getMe,logout } from '../controller/auth.controller.js'
import registerValidator from '../validator/auth.validation.js'
import { loginValidator } from '../validator/auth.validation.js'
import { AuthUser } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register',registerValidator,register)

authRouter.post('/resend-verification',resendVerificationEmail)

authRouter.get('/verify-email',verifyEmail)

authRouter.post('/login',loginValidator,login)

authRouter.get('/get-me',AuthUser,getMe)

authRouter.get('/logout',AuthUser,logout)

export default authRouter