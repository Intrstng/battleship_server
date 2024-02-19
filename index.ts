import {httpServer} from './src/http_server';
import {WebSocketServer} from "ws";
import dotenv from 'dotenv';
import {handleInput} from './src/utils/commands';
import {WebSocket} from 'ws';
import {Commands} from './src/types/types';
dotenv.config();

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8181');
const WSS_PORT = parseInt(process.env.WSS_PORT || '3000');

export interface Message {
    type: Commands;
    data: string;
    id: number;
}

export type WebSocketCustom = WebSocket & {
    id: string
    madeAttacks: Set<string>
    isAlive?: boolean
    isGameVsPC?: boolean
};


console.log(`Run static HTTP server on PORT: ${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);
console.log(`Run WebSocket server on PORT: ${WSS_PORT}`);

export const wss = new WebSocketServer({port: WSS_PORT});

const interval: NodeJS.Timeout = setInterval(function ping() {
    const clients = wss.clients;
    clients.forEach((ws: WebSocketCustom) => {
        if (ws.hasOwnProperty('isAlive') && !ws.isAlive) {
            ws.isAlive = false;
            return ws.terminate();
        }
        ws.ping();
    });
}, 1000);

wss.on('connection', (ws: WebSocketCustom) => {
    console.log('Client connected to WebSocket server');
    ws.isAlive = true;
    ws.on('error', console.error);
    ws.on('message', (rawData: string) => {
        const message = JSON.parse(rawData.toString()) as Message;
        const { type, data } = message;
        console.log(`Received action: ${type}. With data: ${data}`);
        handleInput(type, data, ws);
    });

    // ws.on('close', (code: number, reason: string) => {
    //     console.log(`Client left WebSocket server. Close code: ${code}`);
    //     ws.close();
    // });
});


process.on('SIGINT', () => {
    clearInterval(interval);
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


