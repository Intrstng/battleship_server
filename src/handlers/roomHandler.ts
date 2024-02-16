import {WebSocketWithId, wss} from '../../index';
import {getUser} from '../utils/userAccount';
import {WebSocket} from 'ws';
import {Room, rooms, RoomsType} from '../data/data';
import {Commands, RoomData, sendGameRoomResponse} from '../types/types';


export const getAllGameRooms = (ws: WebSocketWithId) => {
    if (rooms.size > 0) {
        const allAvailableRooms: RoomData[] = [];
        rooms.forEach((room, roomId) => {
            const roomData = {
                roomId,
                roomUsers: room.users,
            }
            allAvailableRooms.push(roomData);
        });
        sendGameRoomResponse(Commands.UpdateRoom, JSON.stringify(allAvailableRooms), ws);
        //sendGameRoomResponse(Commands.CreateRoom, JSON.stringify(allAvailableRooms), ws);
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
    const roomData = addRoom(ws);
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            sendGameRoomResponse(Commands.UpdateRoom, JSON.stringify([roomData]), client);
        }
    });
}

export const addUsersToRoom = (data: string, ws: WebSocketWithId) => {
    const idxRoom = JSON.parse(data).indexRoom;
    const adminOfRoom = rooms.get(idxRoom).users[0];
    if (adminOfRoom.id !== ws.id) {
        const room = {
            id: idxRoom,
            users: [adminOfRoom, ws]
        };
        rooms.set(idxRoom, room);
    }
    const currentPlayers = rooms.get(idxRoom).users;
    currentPlayers.forEach((user: WebSocketWithId) => {
        const player = {
            idGame: idxRoom,
            idPlayer: getUser(user.id).index,
        }
        sendGameRoomResponse(Commands.CreateGame, JSON.stringify(player), user)
    });
};