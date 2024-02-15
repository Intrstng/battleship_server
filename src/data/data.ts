import {WebSocketWithId} from '../../index';

export type User = {
    index: number;
    name: string;
    password: string;
    victories: number;
};

// export type RegistrationDataType = {
//     name: string,
//     password: string
// }

export type Room = {
    id: number;
    users: WebSocketWithId[];
};


export const users: User[] = [];

export const rooms: Map<number, Room> = new Map();