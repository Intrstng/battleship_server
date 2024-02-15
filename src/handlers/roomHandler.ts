import {WebSocketWithId} from '../../index';
import {rooms} from '../data/data';

export type RoomData = {
    roomId: number,
    roomUsers: WebSocketWithId[],
}

export const getAllRooms = (ws: WebSocketWithId) => {
    if (rooms.size > 0) {
        const roomsArray: RoomData[] = [];
        rooms.forEach((value, key) => {
            roomsArray.push({
                roomId: key,
                roomUsers: value.users,
            });
        });
        const roomsData = JSON.stringify({
            type: 'update_room',
            data: JSON.stringify(roomsArray),
            id: 0,
        });
        ws.send(roomsData);
    }
};