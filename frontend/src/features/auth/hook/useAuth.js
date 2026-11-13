
import { useDispatch } from "react-redux";
import { login,register,resendVerificationEmail,getMe,logout } from "../services/auth.service";
import { setError,setLoading,setUser } from "../auth.slice";

export function useAuth(){

    const dispatch = useDispatch()

    async function handleRegister({username,email,password}) {

        try {

            dispatch(setLoading(true))
            const data = await register({username,email,password})

        } catch (err) {
            dispatch(setError(err.response?.data))
            throw err
        }finally{
            dispatch(setLoading(false))
        }

    }

    async function handleResendVerificationEmail(email) {
        dispatch(setLoading(true))
        try {
            return await resendVerificationEmail(email)
        } catch (err) {
            dispatch(setError(err.response?.data))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email,password}) {

        try {
            dispatch(setLoading(true))
        const data = await login({email,password})
        dispatch(setUser(data.user))
        } catch (err) {
           dispatch(setError(err.respones))
        }
        finally{
            dispatch(setLoading(false))
        }
    }

    async function HandlegetMe() {
        
        try {
            dispatch(setLoading(false))
           const data = await getMe()  
           dispatch(setUser(data.user))
            
        } catch (err) {
             dispatch(setError(err.respones))
        }finally{
            dispatch(setLoading(false))
        }

    }

    async function handleLogout(){
        try {
            dispatch(setLoading(true))
            await logout()
           dispatch(setUser(null))
        } catch (err) {
        dispatch(setError(err.respones))

        }finally{
            dispatch(setLoading(false))
        }
    }

    return{
        handleLogin,
        handleRegister,
        handleResendVerificationEmail,
        HandlegetMe,
        handleLogout
    }

}