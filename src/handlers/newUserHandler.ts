import {WebSocketWithId} from '../../index';
import {rooms} from '../data/data';
import {getUser} from '../utils/userAccount';
import {Commands} from '../types/types';
import {sendGameRoomResponse} from '../utils/responses';

export const addUsersToRoom = (data: string, ws: WebSocketWithId) => {
    const idxRoom = JSON.parse(data).indexRoom;
    const adminOfRoom = rooms.get(idxRoom)?.users[0];
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