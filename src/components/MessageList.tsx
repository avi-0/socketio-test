import { useEffect, useRef } from "react";
import MessageLine from "./MessageLine";

export type User = {
  name: string;
  id: string;
}

export type Message = {
  text: string;
  user?: User;
}

export interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight);
  }, [messages, ref])

  return (
    <div ref={ref} className="border overflow-auto bg-body flex-fill">
      {messages.map((message, i) =>
        <MessageLine key={i} message={message}></MessageLine>
      )}
    </div>
  );
}
