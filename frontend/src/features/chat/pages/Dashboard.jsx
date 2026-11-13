
import React, { useState, useEffect, useRef } from 'react'

import {
  Search,
  Plus,
  Zap,
  MessageSquare,
  ArrowUp,
  Image,
  Globe,
  Menu,
  X,
  Trash, LogOut 
} from 'lucide-react'

import { useChat } from '../hook/useChat'
import {  useSelector,useDispatch } from 'react-redux'
import { setcurrentChatId } from '../chat.slice'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuth } from '../../auth/hook/useAuth'

const Dashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')

  

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.chat.Loading)

    const chat = useChat();
    const auth = useAuth()


const dispatch = useDispatch()
const { handleSendMessage, handleGetChats,handleDeleteChat } = useChat()

  const currentChat = chats?.[currentChatId]

  useEffect(() => {

    chat.initSocketConnection()
    chat.handleGetChats()

  }, [])

  
   
  // Send Message
  const submitHandler = async (e) => {

    e.preventDefault()

    const trimmedMessage = chatInput.trim()

    if (!trimmedMessage || loading) return

    
    setChatInput('')
    
    await handleSendMessage({
        message: trimmedMessage,
        chatId: currentChatId
      })
  
            console.log(currentChatId)


  }


  const openChat = (chatId)=>{

    chat.handleOpenChat(chatId,chats)
    
  }

  const deleteChat = (chatId)=>{

    chat.handleDeleteChat(chatId)
    console.log("deleted...",chatId)
  }

  const logout = ()=>{
    console.log("logout...")
    auth.handleLogout()
  }


  return (

    <div className="h-[100dvh] w-full flex bg-[#080b19] text-white overflow-hidden">

      {/* Mobile Overlay */}
      {sidebarOpen && (

        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />

      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative top-0 left-0 z-50 h-full
          w-[280px] shrink-0 flex flex-col
          bg-[#0b1020] border-r border-white/10
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >

        {/* Logo */}
        <div className="min-w-[280px] p-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">

              <Zap size={22} className="text-white fill-white" />

            </div>

            <div>

              <h1 className="text-xl font-bold">Nexo AI</h1>

              <p className="text-xs text-slate-500">
                AI Assistant
              </p>

            </div>

          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >

            <X size={19} />

          </button>

        </div>

        {/* Search */}
        <div className="min-w-[280px] px-4 mt-5">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151c30] border border-white/10">

            <Search size={17} className="text-slate-500" />

            <input
              placeholder="Search chats"
              className="bg-transparent outline-none text-sm w-full"
            />

          </div>

        </div>

        {/* New Chat */}
        <div className="min-w-[280px] px-4 mt-3">

          <button
            onClick={()=>{dispatch(setcurrentChatId(null))}}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#151c30] hover:bg-[#202944] transition"
          >

            <Plus size={19} />

            <span className="text-sm">New Chat</span>

          </button>

        </div>

        {/* Recent Chats Heading */}
        <div className="min-w-[280px] px-5 mt-8 mb-3">

          <p className="text-xs text-slate-500 font-semibold">
            RECENT CHATS
          </p>

        </div>

        {/* Recent Chats */}
        <div className="messages min-w-[280px] flex-1 justify-between overflow-y-auto px-3 space-y-1">

          {Object.values(chats || {}).map((chat) => (

            <button
              key={chat.id}
              onClick={() => { openChat(chat.id) }}
              className={`w-full flex items-center  gap-3 p-3 justify-between rounded-lg text-sm text-left transition
                ${currentChatId === chat._id
                  ? 'bg-indigo-500/15 text-indigo-300'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >

             

              <span className="truncate">
                {chat.title}
              </span>
                
         <button onClick={()=>{ deleteChat(chat.id) }}> <Trash size={14} />    </button>          

            </button> 
          

          ))}

          {Object.keys(chats || {}).length === 0 && (

            <p className="text-xs text-slate-600 text-center py-5">
              No chats yet
            </p>

          )}

            

        </div>

        {/* User Profile */}
        <div className="min-w-[280px] p-4 border-t border-white/10">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151c30]">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center font-semibold">
              {user.email[0]}
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold">
                {user.username}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 h-full relative flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-3 sm:px-5 md:px-6 border-b border-white/[0.07]">

          <div className="flex items-center gap-3">

            {/* Mobile Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            >

              <Menu size={22} />

            </button>

            {/* Mobile Logo */}
            <div className="flex items-center gap-2 md:hidden">

              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">

                <Zap size={15} />

              </div>

              <span className="font-semibold">
                Nexo AI
              </span>

            </div>

            {/* Desktop Chat Title */}
            <span className="hidden md:block text-sm text-slate-400 truncate max-w-[350px]">

              {currentChat?.title || 'New Chat'}

            </span>

          </div>

          <div className='flex items-center gap-3'>
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center font-semibold text-sm">

            {user.email[0].toUpperCase()}

          </button>
          <button onClick={()=>{logout()}} className='cursor-pointer text-red-500'><LogOut size={22} /></button>
          </div>
          

        </header>

        {/* Chat Messages */}
        <section className="messages flex-1 min-h-0 overflow-y-auto px-4">

          {!currentChat || currentChat.messages?.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center pb-20">

              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full bg-gradient-to-br from-pink-300 via-blue-400 to-indigo-500 mb-8 sm:mb-10 shadow-[0_0_50px_rgba(99,102,241,0.15)]" />

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-center">

                Welcome, {user.username}!

              </h1>

              <p className="text-slate-400 mt-4 text-base sm:text-lg text-center">

                Can I help you with anything?

              </p>

            </div>

          ) : (

            <div className="max-w-[850px] mx-auto py-6 md:py-8 space-y-4 md:space-y-6">

              {chats[currentChatId].messages?.map((message, index) => (

                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  <div
                    className={`max-w-[90%] md:max-w-[85%] px-3 py-2.5 md:px-4 md:py-3 rounded-2xl text-sm sm:text-base whitespace-pre-wrap break-words ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-[#151c30] text-slate-200 rounded-bl-sm'
                    }`}
                  >

                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
          </ReactMarkdown>

                  </div>

                </div>

              ))}

              {loading && (

                <div className="flex justify-start">

                  <div className="bg-[#151c30] text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm text-sm flex items-center gap-2">

                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />

                    Nexo AI is thinking...

                  </div>

                </div>

              )}

              <div  />

            </div>

          )}

        </section>

        {/* Chat Input */}
        <div className="shrink-0 z-20 px-3 sm:px-5 md:px-8 pb-3 sm:pb-5 pt-3 bg-gradient-to-t from-[#080b19] via-[#080b19]/95 to-transparent">

          <div className="max-w-[900px] mx-auto">

            <form
              onSubmit={submitHandler}
              className="w-full rounded-[22px] bg-[#151629] border border-white/10 focus-within:border-indigo-400/40 transition-all shadow-xl"
            >

              <textarea
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {

                  if (event.key === 'Enter' && !event.shiftKey) {

                    event.preventDefault()

                    event.currentTarget.form.requestSubmit()

                  }

                }}
                placeholder="Ask anything"
                rows={2}
                className="w-full min-h-[65px] max-h-[160px] resize-none bg-transparent outline-none px-4 pt-5 pb-3 text-sm sm:text-base text-white placeholder:text-slate-500"
              />

              <div className="flex items-center justify-between gap-2 px-3 pb-3">

                <div className="flex items-center gap-2 min-w-0">

                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/10 transition"
                  >

                    <Image size={15} />

                    <span className="text-xs sm:text-sm">
                      Create image
                    </span>

                  </button>

                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/10 transition"
                  >

                    <Globe size={15} />

                    <span className="text-xs sm:text-sm">
                      Search web
                    </span>

                  </button>

                </div>

                <button
                  type="submit"
                  disabled={!chatInput.trim() || loading}
                  className="w-10 h-10 shrink-0 rounded-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 flex items-center justify-center transition"
                >

                  {loading ? (

                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  ) : (

                    <ArrowUp size={20} />

                  )}

                </button>

              </div>

            </form>

            <p className="text-center text-[10px] text-slate-600 mt-2">

              Nexo AI can make mistakes. Verify important information.

            </p>

          </div>

        </div>

      </main>

    </div>

  )

}

export default Dashboard
