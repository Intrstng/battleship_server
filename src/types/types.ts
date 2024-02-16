import {WebSocketWithId} from '../../index';
import {WebSocket} from 'ws';

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

export type ResponseDataType = {
    type: Commands
    data: string
    id: number
}


export type RoomData = {
    roomId: number,
    roomUsers: WebSocketWithId[],
}






export const sendGameRoomResponse = (type: Commands, data: string, ws: WebSocketWithId | WebSocket) => {
    const response = JSON.stringify({
        type,
        data,
        id: 0,
    });
    ws.send(response);
}