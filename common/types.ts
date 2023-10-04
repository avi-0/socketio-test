export type UserID = string;
export type RoomID = string;
export type FEN = string;

export type User = {
    id: UserID,
    name: string,
}

export type State = {
    fen: FEN,
    lastMove?: [string, string],
}

export const startingPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const initialState: State = {
    fen: startingPosition,
}