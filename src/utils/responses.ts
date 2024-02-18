import {WebSocketWithId} from '../../index';
import {WebSocket} from 'ws';
import {Attack, Commands} from '../types/types';

export function makeResponseKilled(x: number, y: number, indexPlayer: number, ws: WebSocketWithId | WebSocket): void {
    const response = JSON.stringify({
        type: Commands.Attack,
        data: {
            position: {
                x: x,
                y: y
            },
            currentPlayer: indexPlayer,
            status: Attack.Killed,
        },
        id: 0,
    });
    ws.send(response);
}

export const sendGameRoomResponse = (type: Commands, data: string, ws: WebSocketWithId | WebSocket) => {
    const response = JSON.stringify({
        type,
        data,
        id: 0,
    });
    ws.send(response);
}

// export const sendAttackResponse = (type: Attack, x: number, y: number, indexPlayer: number, ws: WebSocketWithId | WebSocket) => {
//     const response = JSON.stringify({
//         type: Commands.Attack,
//         data: {
//             position:
//                 {
//                     x,
//                     y,
//                 },
//             currentPlayer: indexPlayer,
//             status: 'miss',
//         },
//         id: 0,
//     })
//     ws.send(response);
// }