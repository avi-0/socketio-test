import { useParams, useSearchParams } from "react-router-dom";
import { Chat } from "../components/Chat";
import JoinRoom from "./JoinRoom";
import { useState } from "react";
import CopyLinkButton from "../components/CopyLinkButton";
import { useOnSocketEvent } from "../hooks/useOnSocketEvent";
import { Square, flipColor, getChessjsDests, makeChessjsMove } from "../common/chesslogic";
import Chessboard from "../components/Chessboard/Chessboard";
import { State, initialState } from "../common/types";
import { useSynchronizedState } from "../hooks/useSynchronizedState";
import { Color, MoveMetadata } from "chessground/types";
import { DrawShape } from "chessground/draw";
import { useAudio } from "../hooks/useAudio";
import { useSocket } from "../hooks/useSocket";

export default function Room() {
    const [searchParams, _] = useSearchParams();
    const params = useParams();

    const username = searchParams.get("name");

    if (username == null) {
        return <JoinRoom id={params.id || ""} />
    }

    const roomId = params.id;

    const socket = useSocket();

    useOnSocketEvent(socket, "connect", () => {
        socket.emit("join-room", roomId, username);
    });

    const [state, updateState] = useSynchronizedState<State>(initialState, socket, "state-patches", "state-patches");

    const moveSound = useAudio("/sounds/move.mp3", { volume: 0.4 });
    const captureSound  = useAudio("/sounds/capture.mp3", { volume: 0.4 });

    function onMoved(from: Square, to: Square, meta: MoveMetadata) {
        updateState(draft => {
            draft.fen = makeChessjsMove(draft.fen, from, to);
            draft.lastMove = [from, to];

            // clear shapes
            draft.shapes = [];
        })

        if (meta.captured) {
            captureSound.play();
        } else {
            moveSound.play();
        }
    }

    function onShapesChanged(shapes: DrawShape[]) {
        updateState(draft => {
            draft.shapes = structuredClone(shapes);
        })
    }

    function reset() {
        updateState(_ => initialState);
    }

    const [orientation, setOrientation] = useState<Color>("white");

    function flip() {
        setOrientation(orientation => flipColor(orientation));
    }

    const cheat = false;
    const dests = getChessjsDests(state.fen);

    return <div className="container-xl d-flex flex-row gap-3 vh-100 overflow-hidden py-4">
        <div className="" style={{
            aspectRatio: "1 / 1",
        }}>
            <Chessboard
                fen={state.fen}
                lastMove={state.lastMove as [Square, Square]}
                orientation={orientation}
                cheat={cheat}
                dests={dests}
                shapes={structuredClone(state.shapes)}
                onMoved={onMoved}
                onShapesChanged={onShapesChanged} />
        </div>

        <div className="d-flex flex-column gap-3 flex-grow-1" style={{
            flexBasis: 0,
        }}>
            <div className="d-flex flex-row gap-3 flex-wrap">
                <CopyLinkButton />
                <button className="btn btn-primary" onClick={() => reset()}>
                    Reset
                </button>
                <button className="btn btn-primary" onClick={() => flip()}>
                    Flip
                </button>
            </div>
            <Chat socket={socket} />
        </div>
    </div>
}
