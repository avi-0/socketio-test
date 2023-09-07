import { colorFromId } from "../color";
import { Message } from "./MessageList";

interface MessageProps {
    message: Message;
}

export default function MessageLine({ message }: MessageProps) {
    const username = message.user ?
        <b style={{ color: colorFromId(message.user.id) }}>
            {message.user.name}:
        </b>
        : "";

    return <div className="m-2 font-monospace">
        {username} {message.text}
    </div>
}