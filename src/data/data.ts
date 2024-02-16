import {WebSocketWithId} from '../../index';

export type User = {
    index: number;
    name: string;
    password: string;
    victories: number;
};

export type Room = {
    id: number;
    users: WebSocketWithId[];
};

// Inmemory DB with player data (login and password) storage
export const users: User[] = [];

export const rooms: Map<number, Room> = new Map();

// Example of the response create Room
// {
//     roomId: 0,
//         roomUsers: [
//     {
//         name: '1221212131',
//         index: '189474dc-f3e0-4d69-b82d-b11698bc1ce3'
//     }
// ]
// }
// Example of the response create Room
//[{"roomId":1708073584993,"roomUsers":[{"name":"qwewwqewqe","index":1}]}]

export type RoomUser = {
    name: string | undefined
    index: number | undefined
}


export type RoomsType = {
    roomId: number
    roomUsers: RoomUser[]
}
