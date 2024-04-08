import {WebSocketCustom} from '../../index';
import {WebSocket} from 'ws';
import {Attack, Commands} from '../types/types';
import {getUser} from './userAccount';

export function makeResponseKilled(x: number, y: number, indexPlayer: number, ws: WebSocketCustom | WebSocket): void {
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

export const sendGameResponse = (type: Commands, data: string, ws: WebSocketCustom | WebSocket) => {
    const response = JSON.stringify({
        type,
        data,
        id: 0,
    });
    ws.send(response);
}

export const successRegistrationResponse = (name: string, errMsg: string, ws: WebSocketCustom) => {
    ws.id = name;
    ws.send(
        JSON.stringify({
            type: Commands.Registration,
            data: JSON.stringify({
                name: name,
                index: getUser(name)?.index,
                error: false,
                errorText: errMsg,
            }),
        }),
    );
}

export const unsuccessfulRegistrationResponse = (name: string, errMsg: string, ws: WebSocketCustom) => {
    ws.id = '';
    ws.send(
        JSON.stringify({
            type: Commands.Registration,
            data: JSON.stringify({
                name: '',
                id: '',
                error: true,
                errorText: errMsg,
            }),
        }),
    );
}

export const successPCRegistrationResponse = (name: string, idxPC: number, ws: WebSocketCustom) => {
    ws.id = name;
    ws.send(
        JSON.stringify({
            type: Commands.Registration,
            data: JSON.stringify({
                name: name,
                index: idxPC,
                error: false,
                errorText: '',
            }),
        }),
    );
}

export const sendGameVsPCResponse = async (name: string, idxPC: number, ws: WebSocketCustom) => {
    if (ws.readyState !== ws.OPEN) {
        try {
            await waitForOpenConnection(ws);
            successPCRegistrationResponse(name, idxPC, ws);
        } catch (err) {
            console.error(err);
        }
    } else {
        successPCRegistrationResponse(name, idxPC, ws);
    }
};

export const waitForOpenConnection = async (ws: WebSocketCustom) => {
    return new Promise<void>((resolve, reject) => {
        let attempt = 0;
        const maxAttemptsNumber = 7;
        const intervalID = setInterval(() => {
            if (attempt > maxAttemptsNumber - 1) {
                reject(new Error('You’ve reached the maximum number of attempts.'));
                clearInterval(intervalID);
            } else if (ws.readyState === ws.OPEN) {
                resolve();
                clearInterval(intervalID);
            }
            attempt++;
        }, 500);
    });
};