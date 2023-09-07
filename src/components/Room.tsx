import { useParams, useSearchParams } from "react-router-dom";
import { Chat } from "./Chat";
import { io } from "socket.io-client";
import JoinRoom from "./JoinRoom";
import { useEffect } from "react";

const socket = io(':3000', {autoConnect: true});

export default function Room() {
    const [searchParams, _] = useSearchParams();
    const params = useParams();

    if (searchParams.get("name") == null) {
        return <JoinRoom id={params.id || ""} />
    }

    const roomId = params.id;

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            socket.emit("join-room", roomId);
        })

        return () => {
            socket.off('connect');
            socket.disconnect();
        }
    }, [])

    function copyLink() {
        if (navigator.clipboard) {
            const url = location.origin + location.pathname;
            navigator.clipboard.writeText(url);
        }
    }

    return <div className="container pt-5">
        <button className="btn btn-primary btn-sm mb-3" onClick={() => copyLink()}>
            <i className="bi bi-clipboard"></i> Copy link
        </button>
        <Chat socket={socket}/>
    </div>
}
