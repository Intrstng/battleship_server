import {WebSocketCustom} from '../../index';
import {rooms} from '../data/data';
import {getUser} from '../utils/userAccount';
import {Commands} from '../types/types';
import {sendGameResponse} from '../utils/responses';

export const addUsersToRoom = (data: string, ws: WebSocketCustom) => {
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
    currentPlayers.forEach((user: WebSocketCustom) => {
        const player = {
            idGame: idxRoom,
            idPlayer: getUser(user.id).index,
        }
        sendGameResponse(Commands.CreateGame, JSON.stringify(player), user);
    });
};