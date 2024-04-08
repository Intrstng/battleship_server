import {WebSocketCustom, wss} from '../../index';
import {getUser} from '../utils/userAccount';
import {WebSocket} from 'ws';
import {rooms} from '../data/data';
import {Commands, RoomData, RoomsType} from '../types/types';
import {sendGameResponse} from '../utils/responses';


export const getAllGameRooms = (ws: WebSocketCustom) => {
    if (rooms.size > 0) {
        const allAvailableRooms: RoomData[] = [];
        rooms.forEach((room, roomId) => {
            const roomData = {
                roomId,
                roomUsers: room.users,
            }
            allAvailableRooms.push(roomData);
        });
        sendGameResponse(Commands.UpdateRoom, JSON.stringify(allAvailableRooms), ws);
        //sendGameResponse(Commands.CreateRoom, JSON.stringify(allAvailableRooms), ws);
    }
};

export const addRoom = (ws: WebSocketCustom): RoomsType => {
    const user = {
        name: getUser(ws.id)?.name,
        index: getUser(ws.id)?.index,
    }
    //const id = Date.now();
    const id = rooms.size + 1;
    const newRoom = {
        roomId: id,
        roomUsers: [user]
    };

    const wsOfAllUsersInRoom: WebSocketCustom[] = [];
    ws.isGameVsPC = false;
    wsOfAllUsersInRoom.push(ws);

    const room = {
        id,
        users: wsOfAllUsersInRoom,
    };

    rooms.set(id, room);
    return newRoom;
};

export const createGameRoom = (ws: WebSocketCustom) => {
    const roomData = addRoom(ws);
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            sendGameResponse(Commands.UpdateRoom, JSON.stringify([roomData]), client);
        }
    });
}