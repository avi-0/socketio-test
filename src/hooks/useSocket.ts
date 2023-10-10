import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export function useSocket() {
    const socket = useMemo(() => {
        return io({
            autoConnect: false,
        })
    }, []);

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        }
    }, [socket]);

    return socket;
}