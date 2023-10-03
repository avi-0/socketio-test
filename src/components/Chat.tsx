import { useState } from "react";
import { Socket } from "socket.io-client";
import MessageList, { Message, User } from "./MessageList";
import InputLine from "./InputLine";
import { useSearchParams } from "react-router-dom";
import { useOnSocketEvent } from "../hooks/useOnSocketEvent";

interface Props {
    socket: Socket;
}

export function Chat({ socket }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchParams, _] = useSearchParams();

    const user: User = {
        name: searchParams.get("name") || "anonymous",
        id: socket.id,
    }

    function addMessage(text: string, user?: User): void {
        const message = {
            text: text,
            user: user,
        };
        setMessages((messages) => [...messages, message]);
    }

    useOnSocketEvent(socket, 'connect', () => {
        addMessage(`connected with id ${socket.id}`);
    });

    useOnSocketEvent(socket, 'message', (message, user?) => {
        addMessage(message, user);
    });

    function sendMessage(message: string): void {
        socket.emit('message', message, user.name);

        addMessage(message, user);
    }

    return <>
        <MessageList messages={messages} />
        <InputLine submit={message => sendMessage(message)} submitLabel="Send" />
    </>;
}
