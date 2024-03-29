import { Chessground as ChessgroundApi } from 'chessground';
import { useEffect, useRef, useState } from 'react';

import "./chessground.base.css";
import "./chessground.brown.css";
import "./Chessboard.css";
import './App.css';
import { Color, Key as Square, MoveMetadata, FEN } from 'chessground/types';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { DrawShape } from 'chessground/draw';

export type ChessboardProps = {
    orientation: Color,
    cheat: boolean,
    dests: Map<Square, Square[]>,
    fen: FEN,
    lastMove?: [Square, Square],
    shapes?: DrawShape[],

    onMoved?: (from: Square, to: Square, meta: MoveMetadata) => void,
    onShapesChanged?: (shapes: DrawShape[]) => void,
}

export default function Chessboard({
    fen,
    lastMove,
    dests,
    orientation,
    cheat,
    shapes,
    onMoved,
    onShapesChanged,
}: ChessboardProps) {
    const ref = useRef(null);
    const [api, setApi] = useState<Api | null>(null);

    function move(from: Square, to: Square, meta: MoveMetadata) {
        onMoved?.(from, to, meta);
    }

    // first time setup
    useEffect(() => {
        if (ref.current && !api) {
            const chessgroundApi = ChessgroundApi(ref.current);
            setApi(chessgroundApi);
        }
    }, [ref]);

    function onInnerShapesChanged(newShapes: DrawShape[]) {
        // prevent left clicks from clearing shapes

        if (api?.state.drawable.current) {
            onShapesChanged?.(newShapes);
        } else {
            // force previous shapes
            api!.state.drawable.shapes = shapes || [];
        }
    }

    // update inner state
    useEffect(() => {
        if (api) {
            const config: Config = {
                // actual game position
                fen: fen,
                lastMove: lastMove,

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
                },
                drawable: {
                    onChange: (shapes) => onInnerShapesChanged(shapes),
                    shapes: shapes,
                    eraseOnClick: false,
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