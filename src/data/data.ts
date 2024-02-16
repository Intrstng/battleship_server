import {WebSocketWithId} from '../../index';
import {Ship} from '../types/types';

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

export type RoomUser = {
    name: string | undefined
    index: number | undefined
}


export type RoomsType = {
    roomId: number
    roomUsers: RoomUser[]
}

export type GameParamsType = {
    gameCounter: number;
    idxOfActivePlayer: number;
};

export const game: Map<number, GameParamsType> = new Map();
export const playersShips: Map<string, Ship[]> = new Map();