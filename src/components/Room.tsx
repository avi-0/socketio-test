import { useParams, useSearchParams } from "react-router-dom";
import { Chat } from "./Chat";
import { io } from "socket.io-client";
import JoinRoom from "./JoinRoom";
import { useEffect, useState } from "react";
import CopyLinkButton from "./CopyLinkButton";
import { useOnSocketEvent } from "../hooks/useOnSocketEvent";
import { getMoves, startingPosition } from "../chesslogic";
import Chessboard from "./Chessboard/Chessboard";

const socket = io({ autoConnect: false });

export default function Room() {
    const [searchParams, _] = useSearchParams();
    const params = useParams();

    const [state, _setState] = useState(startingPosition);

    if (searchParams.get("name") == null) {
        return <JoinRoom id={params.id || ""} />
    }

    const roomId = params.id;

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        }
    }, []);

    useOnSocketEvent(socket, "connect", () => {
        socket.emit("join-room", roomId);
    });

    const cheat = false;
    const moves = getMoves(state, cheat);

    return <div className="container d-flex flex-row gap-3 vh-100 overflow-hidden py-4">
        <div className="" style={{
            aspectRatio: "1 / 1",
        }}>
            <Chessboard state={state} orientation="white" cheat={cheat} moves={moves} onMovePlayed={() => { }} />
        </div>

        <div className="d-flex flex-column gap-3 flex-grow-1" style={{
            flexBasis: 0,
        }}>
            <CopyLinkButton />
            <Chat socket={socket} />
        </div>
    </div>
}
