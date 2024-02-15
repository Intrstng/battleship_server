import {httpServer} from './src/http_server';
import {WebSocketServer} from "ws";
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import {v4} from 'uuid/index';
import {commands, handleInput} from './src/utils/commands';
import {WebSocket} from 'ws';
dotenv.config();

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8181');
const WSS_PORT = parseInt(process.env.WSS_PORT || '3000');


export type WebSocketWithId = WebSocket & {
    id: string;
};

console.log(`Start static http server on the ${HTTP_PORT} port.`);
httpServer.listen(HTTP_PORT);
console.log('WS server starts');

export const wss = new WebSocketServer({port: WSS_PORT});

wss.on('connection', (ws: WebSocketWithId) => {
    ws.on('error', console.error);
    ws.on('message', (message: string) => {
    });
});

process.on('SIGINT', () => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.close();
        }
    });
    httpServer.close();
    wss.close();
    process.exit();
});


