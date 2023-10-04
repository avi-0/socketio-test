import { useParams, useSearchParams } from "react-router-dom";
import { Chat } from "./Chat";
import { io } from "socket.io-client";
import JoinRoom from "./JoinRoom";
import { useEffect, useState } from "react";
import CopyLinkButton from "./CopyLinkButton";
import { useOnSocketEvent } from "../hooks/useOnSocketEvent";
import { Square, getChessjsDests, makeChessjsMove, startingPosition } from "../chesslogic";
import Chessboard from "./Chessboard/Chessboard";
// import Chip from "./Chip";
import { State } from "@app/common";
import { useSynchronizedState } from "../hooks/useSynchronizedState";

const socket = io({ autoConnect: false });

const initialState: State = {
    chess: startingPosition,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
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

    const [state, updateState] = useSynchronizedState(initialState, socket, "state-patches", "state-patches");

    const [moveSound, _setMoveSound] = useState(new Audio("/sounds/move.mp3"));
    const [captureSound, _setCaptureSound] = useState(new Audio("/sounds/capture.mp3"));
    useEffect(() => {
        moveSound.volume = 0.4;
        captureSound.volume = 0.4;
    }, [moveSound, captureSound]);

    function onMoved(from: Square, to: Square) {
        updateState(draft => {
            draft.fen = makeChessjsMove(draft.fen, from, to);
        })
    }

    function reset() {
        updateState(draft => {
            draft.chess = startingPosition;
        })
    }

    const cheat = false;
    const dests = getChessjsDests(state.fen);

    return <div className="container-xl d-flex flex-row gap-3 vh-100 overflow-hidden py-4">
        <div className="" style={{
            aspectRatio: "1 / 1",
        }}>
            <Chessboard fen={state.fen} orientation="white" cheat={cheat} dests={dests} onMoved={onMoved} />
        </div>

        <div className="d-flex flex-column gap-3 flex-grow-1" style={{
            flexBasis: 0,
        }}>
            <div className="d-flex flex-row gap-3">
                <CopyLinkButton />
                <button className="btn btn-primary" onClick={() => reset()}>
                    Reset
                </button>
            </div>
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
