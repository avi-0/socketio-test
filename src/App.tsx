import { useEffect, useState } from "react"
import MessageList from "./components/MessageList";
import InputLine from "./components/InputLine";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  
  function addMessage(message: string): void {
    setMessages((messages) => [...messages, message] );
  }

  useEffect(() => {
    socket.on('connect', () => {
      addMessage(`You connected with id ${socket.id}`)
    });

    socket.on('message', (message) => {
      addMessage(message);
    })

    return () => {
      socket.off('connect');
      socket.off('message');
    }
  }, []);

  function sendMessage(message: string): void {
    socket.emit('message', message);

    addMessage(message);
  }

  return <div className="container mt-5">
    <MessageList messages={messages} />
    <InputLine submit={message => sendMessage(message)} label="Message" submitLabel="Send" />
    <InputLine submit={() => {}} label="Room" submitLabel="Join" />
  </div>
}


