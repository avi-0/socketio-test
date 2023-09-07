import { useEffect, useRef } from "react";

export default function MessageList({ messages }: { messages: string[]; }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight);
  }, [messages, ref])

  return (
    <div ref={ref} className="border mb-3 overflow-auto" style={{ height: "50vh" }}>
      {messages.map(message =>
        <div className="m-2 font-monospace">
          {message}
        </div>)}
    </div>
  );
}
