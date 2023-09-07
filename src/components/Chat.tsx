import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import MessageList, { Message, User } from "./MessageList";
import InputLine from "./InputLine";
import { useSearchParams } from "react-router-dom";

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

  useEffect(() => {
    socket.on('connect', () => {
      addMessage(`connected with id ${socket.id}`);
    });

    socket.on('message', (message, user?) => {
      addMessage(message, user);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  function sendMessage(message: string): void {
    socket.emit('message', message, user.name);

    addMessage(message, user);
  }

  return <>
    <MessageList messages={messages} />
    <InputLine submit={message => sendMessage(message)} label="Message" submitLabel="Send" />
  </>;
}
