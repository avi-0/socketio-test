import { Chessground as ChessgroundApi } from 'chessground';
import { useEffect, useRef, useState } from 'react';

import "./chessground.base.css";
import "./chessground.brown.css";
import "./Chessboard.css";
import './App.css';
import { Color, Key as Square, MoveMetadata, FEN } from 'chessground/types';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';

export type ChessboardProps = {
    orientation: Color,
    cheat: boolean,
    dests: Map<Square, Square[]>,
    fen: FEN,

    onMoved: (from: Square, to: Square, meta: MoveMetadata) => void,
}

export default function Chessboard({
    fen,
    dests,
    orientation,
    cheat,
    onMoved,
}: ChessboardProps) {
    const ref = useRef(null);
    const [api, setApi] = useState<Api | null>(null);

    function move(from: Square, to: Square, meta: MoveMetadata) {
        onMoved(from, to, meta);
    }

    // first time setup
    useEffect(() => {
        if (ref.current && !api) {
            const chessgroundApi = ChessgroundApi(ref.current);
            setApi(chessgroundApi);
        }
    }, [ref]);

    // update inner state
    useEffect(() => {
        if (api) {
            const config: Config = {
                // actual game position
                fen: fen,

                // visual options and callbacks
                orientation: orientation,

                animation: { enabled: true, duration: 300 },
                draggable: {
                    enabled: true,
                },
                movable: {
                    free: cheat,
                    showDests: true,
                    dests: dests,
                    events: {
                        after: move,
                    },
                }
            }

            api.set(config);
        }
    }, [api, orientation, move, cheat]);

    return (
        <div className="chessboard-row-wrapper">
            <div className='chessboard-column-wrapper'>
                <div ref={ref} className='chessboard' />
            </div>
        </div>
    )
}