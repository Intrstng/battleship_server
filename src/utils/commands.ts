import {WebSocketWithId} from '../../index';
import {registerUser} from '../handlers/registerHandler';
import {createGameRoom} from '../handlers/roomHandler';
import {Commands} from '../types/types';

export type CommandsType = Map<string, (type: Commands, data: string, ws: WebSocketWithId) => void>

export const commands: CommandsType = new Map(
    [
        [Commands.Registration, (type, data, ws) => registerUser(type, data, ws)],
        [Commands.CreateRoom, (type, data, ws) => createGameRoom(ws)],
        [Commands.AddUserToRoom, (msg, ws) => console.log('add_user_to_room')],
        [Commands.AddShips, (msg, ws) => console.log('add_ships')],
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
        console.log(error.message);
    }
}