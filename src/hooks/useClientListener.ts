import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { addAppListener, useAppStore } from "../store";

export function useClientListeners(socket: Socket) {
    const store = useAppStore();

    useEffect(() => {
        const listener = addAppListener({
            predicate: (_action, _currentState, _previousState) => {
                return true;
            },
            effect: (action, _api) => {
                console.log(action);
            }
        });

        const unsubscribe = store.dispatch(listener);

        return unsubscribe;
    }, [store, socket]);
}