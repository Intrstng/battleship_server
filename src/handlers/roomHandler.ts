import {WebSocketWithId, wss} from '../../index';
import {getUser} from '../utils/userAccount';
import {WebSocket} from 'ws';
import {rooms, RoomsType} from '../data/data';
import {Commands, RoomData, sendGameRoomResponse} from '../types/types';



export const getAllGameRooms = (ws: WebSocketWithId) => {
    if (rooms.size > 0) {
        const roomsArray: RoomData[] = [];
        rooms.forEach((value, key) => {
            const room = {
                roomId: key,
                roomUsers: value.users,
            }
            roomsArray.push(room);
        });
        sendGameRoomResponse(Commands.CreateRoom, JSON.stringify(roomsArray), ws);
    }
};

export const addRoom = (ws: WebSocketWithId): RoomsType => {
    const user = {
        name: getUser(ws.id)?.name,
        index: getUser(ws.id)?.index,
    }
    const id = rooms.size + 1;
    const newRoom = {
        roomId: id,
        roomUsers: [user]
    };

    const wsOfAllUsersInRoom: WebSocketWithId[] = [];
    wsOfAllUsersInRoom.push(ws);

    const room = {
        id,
        users: wsOfAllUsersInRoom,
    };

    rooms.set(id, room);
    return newRoom;
};

export const createGameRoom = (ws: WebSocketWithId) => {
    const roomData = addRoom(ws)

    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            sendGameRoomResponse(Commands.UpdateRoom, JSON.stringify([roomData]), client);
        }
    });
}