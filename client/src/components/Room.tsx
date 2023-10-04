import { useParams, useSearchParams } from "react-router-dom";
import { Chat } from "./Chat";
import { io } from "socket.io-client";
import JoinRoom from "./JoinRoom";
import { useEffect, useState } from "react";
import CopyLinkButton from "./CopyLinkButton";
import { useOnSocketEvent } from "../hooks/useOnSocketEvent";
import { Move, getMoves, startingPosition } from "../chesslogic";
import Chessboard from "./Chessboard/Chessboard";
// import Chip from "./Chip";
import { State } from "@app/common";
import { produce } from "immer";

const socket = io({ autoConnect: false });

const initialState: State = {
    chess: startingPosition,
}

export default function Room() {
    const [searchParams, _] = useSearchParams();
    const params = useParams();

    const username = searchParams.get("name");

    if (username == null) {
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
        socket.emit("join-room", roomId, username);
    });

    const [state, setState] = useState(initialState);

    const [moveSound, _setMoveSound] = useState(new Audio("/sounds/move.mp3"));
    const [captureSound, _setCaptureSound] = useState(new Audio("/sounds/capture.mp3"));
    useEffect(() => {
        moveSound.volume = 0.4;
        captureSound.volume = 0.4;
    }, [moveSound, captureSound]);

    function onMovePlayed(move: Move) {
        setState(produce(draft => {
            draft.chess = move.result;
        }));

        if (move.result.justCaptured) {
            captureSound.play();
        } else {
            moveSound.play();
        }
    }

    const cheat = false;
    const moves = getMoves(state.chess, cheat);

    return <div className="container-xl d-flex flex-row gap-3 vh-100 overflow-hidden py-4">
        <div className="" style={{
            aspectRatio: "1 / 1",
        }}>
            <Chessboard state={state.chess} orientation="white" cheat={cheat} moves={moves} onMovePlayed={onMovePlayed} />
        </div>

        <div className="d-flex flex-column gap-3 flex-grow-1" style={{
            flexBasis: 0,
        }}>
            <CopyLinkButton />
            {/* <div className="d-flex flex-row flex-wrap justify-content-center gap-2">
                <Chip>avi</Chip>
                <Chip>sqlc</Chip>
                <Chip>DarnedLight</Chip>
                <Chip>avondale</Chip>
                <Chip>sqlc</Chip>
                <Chip>sqlc</Chip>
            </div> */}
            <Chat socket={socket} />
        </div>
    </div>
}
