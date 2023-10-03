export type UserID = string;

export type User = {
    id: UserID,
    name: string,
}

export type Room = {
   users: Map<UserID, User>, 
}
