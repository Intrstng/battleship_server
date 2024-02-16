import {httpServer} from './src/http_server';
import {WebSocketServer} from "ws";
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import {v4} from 'uuid/index';
import {commands, handleInput} from './src/utils/commands';
import {WebSocket} from 'ws';
import {Commands} from './src/types/types';
dotenv.config();

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8181');
const WSS_PORT = parseInt(process.env.WSS_PORT || '3000');


export type WebSocketWithId = WebSocket & {
    id: string
    roomId: number
};

export interface Message {
    type: Commands;
    data: string;
    id: number;
}

console.log(`Run static HTTP server on PORT: ${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);
console.log(`Run WebSocket server on PORT: ${WSS_PORT}`);

export const wss = new WebSocketServer({port: WSS_PORT});

wss.on('connection', (ws: WebSocketWithId) => {
    console.log('Client connected to WebSocket server');
    ws.on('error', console.error);
    ws.on('message', (rawData: string) => {
        const message = JSON.parse(rawData.toString()) as Message;
        const { type, data } = message;
        console.log(`Received action: ${type}. With data: ${data}`);
        handleInput(type, data, ws);
    });
});

process.on('SIGINT', () => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            console.log('Client disconnected from WebSocket server');
            client.close();
        }
    });
    httpServer.close();
    wss.close();
    process.exit();
});


