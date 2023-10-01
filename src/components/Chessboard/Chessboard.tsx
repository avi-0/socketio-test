import { Chessground as ChessgroundApi } from 'chessground';
import { useEffect, useRef, useState } from 'react';

import "./chessground.base.css";
import "./chessground.brown.css";
import "./Chessboard.css";
import './App.css';
import { ChessState, Move, fenFromPieces } from '../../chesslogic';
import { Color, Key as Square, MoveMetadata } from 'chessground/types';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';

export type ChessboardProps = {
    state: ChessState,
    orientation: Color,
    cheat: boolean,
    moves: Map<Square, Move[]>,

    onMovePlayed: (move: Move) => void,
}

export default function Chessboard({
    state,
    orientation,
    cheat,
    moves,
    onMovePlayed,
}: ChessboardProps) {
    const ref = useRef(null);
    const [api, setApi] = useState<Api | null>(null);

    function onMoved(from: Square, to: Square, _meta: MoveMetadata) {
        // update state to reflect change

        if (api) {
            // find which move this was
            const movePlayed = moves.get(from)?.find(move => move.to == to)

            // pass state up
            if (onMovePlayed && movePlayed) {
                onMovePlayed(movePlayed);
            }

            // undo some of the internal state change until actual new state arrives from prop
            // to fix animations
            api.state.pieces = state.pieces;
        }
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
            // yo dawg we put .map in your .map so you can map inside Map
            const chessgroundMoves = new Map(
                Array.from(moves.entries()).map(([from, moves]) => 
                    [from, moves.map(move => move.to)]
                )
            );

            const config: Config = {
                // actual game position
                fen: fenFromPieces(state.pieces),
                turnColor: state.turnColor,
                lastMove: state.lastMove,

                // visual options and callbacks
                orientation: orientation,

                animation: { enabled: true, duration: 300 },
                draggable: {
                    enabled: true,
                },
                movable: {
                    free: cheat,
                    showDests: true,
                    dests: chessgroundMoves,
                    events: {
                        after: onMoved,
                    },
                }
            }

            api.set(config);
        }
    }, [api, state, orientation, onMoved, cheat]);

    return (
        <div className="chessboard-row-wrapper">
            <div className='chessboard-column-wrapper'>
                <div ref={ref} className='chessboard' />
            </div>
        </div>
    )
}