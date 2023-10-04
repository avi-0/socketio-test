export type UserID = string;
export type RoomID = string;
export type FEN = string;

export type User = {
    id: UserID,
    name: string,
}

export type State = {
    fen: FEN,
}

export type Room = {
   users: Map<UserID, User>,
   state: State,
}
