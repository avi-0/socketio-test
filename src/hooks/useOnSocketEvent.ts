import { useEffect } from "react";
import { Socket } from "socket.io-client";

export function useOnSocketEvent(socket: Socket, eventName: string, listener: (...args: any) => void) {
    useEffect(() => {
        socket.on(eventName, listener);

        return () => {
            socket.off(eventName, listener);
        }
    }, [])
}