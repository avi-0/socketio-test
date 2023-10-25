import { TypedAddListener, addListener, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import chatSlice, { selectMessages } from "./features/chat/chatSlice";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";

const listenerMiddleware = createListenerMiddleware();

const store = configureStore({
    reducer: {
        chat: chatSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppStore = useStore as () => AppStore;
export const useAppDispatch = useDispatch as () => AppDispatch;
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;
export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

export const selectChatMessages = (state: RootState) => selectMessages(state.chat);
