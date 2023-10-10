import { Draft, Objectish, applyPatches, enableMapSet, enablePatches, produceWithPatches } from "immer";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { useOnSocketEvent } from "./useOnSocketEvent";

enableMapSet();
enablePatches();

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: DraftFunction<S>) => void;

export function useSynchronizedState<S extends Objectish>(initialState: S, socket: Socket, patchesToServerEventName: string, patchesFromServerEventName: string): [S, Updater<S>] {
    const [state, setState] = useState<S>(initialState);

    const updateState: Updater<S> = (recipe) => {
        setState(state => {
            const [nextState, patches, _inversePatches] = produceWithPatches(state, recipe);

            socket.emit(patchesToServerEventName, patches);

            return nextState;
        });
    }

    useOnSocketEvent(socket, patchesFromServerEventName, patches => {
        setState(state => applyPatches<S>(state, patches));
    })

    return [state, updateState];
}