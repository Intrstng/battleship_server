import {WebSocket} from 'ws';
import {WebSocketWithId} from '../../index';

export enum StatusCode {
    HTTP_Error = 0,
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    InternalServerError = 500,
}

export enum Commands {
    Registration = 'reg',
    CreateRoom = 'create_room',
    CreateGame = 'create_game',
    AddUserToRoom = 'add_user_to_room',
    AddShips = 'add_ships',
    Attack = 'attack',
    RandomAttack = 'randomAttack',
    SinglePlay = 'single_play',
    Turn = 'turn',
    Finish = 'finish',
    StartGame = 'start_game',
    UpdateRoom = 'update_room',
    UpdateWinners = 'update_winners'
}

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

export type ResponseDataType = {
    type: Commands
    data: string
    id: number
}

export type RoomData = {
    roomId: number
    roomUsers: WebSocketWithId[]
}

enum ShipSizes {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    Huge = 'huge'
}

export type Ship = {
    type?: ShipSizes.Small
         | ShipSizes.Medium
         | ShipSizes.Large
         | ShipSizes.Huge
    length: number
    hitCapacity?: number
    direction: boolean
    position: { x: number; y: number }
};

export enum Attack {
    Miss = 'miss',
    Killed = 'killed',
    Shot = 'shot'
}

export type AttackType = Attack.Miss
                       | Attack.Killed
                       | Attack.Shot;


export type WinsType = {
    name: string;
    wins: number;
};


export type AttackResponseType = {
    position: {
        x: number
        y: number
    }
    currentPlayer: number
    status: AttackType
}