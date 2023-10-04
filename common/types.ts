export type UserID = string;
export type RoomID = string;
export type FEN = string;

export type User = {
    id: UserID,
    name: string,
}

export type State = {
    chess: any, // FIXME: lazy
    fen: FEN,
}

export type Room = {
   users: Map<UserID, User>,
   state: State,
}
