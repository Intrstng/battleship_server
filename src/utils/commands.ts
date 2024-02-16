import {WebSocketWithId} from '../../index';
import {registerUser} from '../handlers/registerHandler';
import {createGameRoom} from '../handlers/roomHandler';
import {Commands} from '../types/types';
import {addUsersToRoom} from '../handlers/newUserHandler';
import {addShips} from '../handlers/shipsHandler';

export type CommandsType = Map<string, (type: Commands, data: string, ws: WebSocketWithId) => void>

export const commands: CommandsType = new Map(
    [
        [Commands.Registration, (type, data, ws) => registerUser(type, data, ws)],
        [Commands.CreateRoom, (type, data, ws) => createGameRoom(ws)],
        [Commands.AddUserToRoom, (type, data, ws) => addUsersToRoom(data, ws)],
        [Commands.AddShips, (type, data, ws) => addShips(data, ws)],
        [Commands.Attack, (msg, ws) => console.log('attack')],
        [Commands.RandomAttack, (msg, ws) => console.log('randomAttack')],
        [Commands.SinglePlay, (msg, ws) => console.log('single_play')],
        [Commands.Turn, (msg, ws) => console.log('turn')],
        [Commands.Finish, (msg, ws) => console.log('finish')],
    ]
)


export const handleInput = async(type: Commands, data: string, ws: WebSocketWithId) => {
    if (!type) return;
    const handler = commands.get(type);
    try {
        if (handler) await handler(type, data, ws);
        else ws.send(JSON.stringify({ error: true, errorText: 'Your request is invalid.' }));
    } catch (error) {
        console.log("ERROR 000", error.message);
        console.log("ERROR 111", error);
    }
}