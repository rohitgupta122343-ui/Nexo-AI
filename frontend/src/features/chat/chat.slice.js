
import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chats',

    initialState: {
        chats: {},
        Loading: false,
        error: null,
        currentChatId: null
    },

    reducers: {

        createNewChat: (state, action) => {

            const { chatId, title } = action.payload

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title,
                    messages: [],
                    lastUpdated: new Date().toISOString()
                }
            }

            state.currentChatId = chatId
        },

        addNewMessage: (state, action) => {

            const { chatId, content, role } = action.payload
            state.chats[ chatId ].messages.push({ content, role })
        },
        addMessage: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[ chatId ].messages.push(...messages)
        },

        setChats: (state, action) => {
            state.chats = action.payload
        },

        setLoading: (state, action) => {
            state.Loading = action.payload
        },

        setError: (state, action) => {
            state.error = action.payload
        },

        setcurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        }

    }
})

export const {
    setChats,
    setcurrentChatId,
    setLoading,
    setError,
    createNewChat,
    addNewMessage,
    addMessage
} = chatSlice.actions

export default chatSlice.reducer
