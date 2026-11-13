import React from 'react'
import { RouterProvider } from 'react-router'
import { Approuter } from './app.route'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'

const App = () => {

  const auth = useAuth()

  useEffect(()=>{
    auth.HandlegetMe()
  },[])

  return (
    <>
      <RouterProvider router={Approuter}>
        
      </RouterProvider>
    </>
   
  )
}

export default App