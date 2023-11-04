import { Action, TypedAddListener, addListener, combineReducers, configureStore, createAction, createListenerMiddleware } from "@reduxjs/toolkit";
import chatSlice, { selectMessages } from "./features/chat/chatSlice";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";

const listenerMiddleware = createListenerMiddleware();

// make main reducer from slices

const mainReducer = combineReducers({
    chat: chatSlice,
})

export type RootState = ReturnType<typeof mainReducer>;

// rootReducer adds setRootState action to it

const setRootState = createAction<RootState>("root/set");

const rootReducer = (state: RootState | undefined, action: Action) => {
    if (setRootState.match(action)) {
        state = action.payload;
    }

    return mainReducer(state, action);
}



// helper for creating stores on backend
export const createAppStore = () => configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

const store = createAppStore();

export default store;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppStore = useStore as () => AppStore;
export const useAppDispatch = useDispatch as () => AppDispatch;
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;
export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

export const selectChatMessages = (state: RootState) => selectMessages(state.chat);
