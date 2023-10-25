import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Message } from "../../components/MessageList"

type ChatState = {
    messages: Message[];
}

const initialState: ChatState = {
    messages: [],
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        post: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        }
    }
})

export const { post } = chatSlice.actions;

export const selectMessages = (state: ChatState) => state.messages;

export default chatSlice.reducer