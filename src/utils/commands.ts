import {WebSocketWithId} from '../../index';
import {registerUser} from '../handlers/registerHandler';

export type CommandsType = Map<string, (type: string, data: string, ws: WebSocketWithId) => void>

export const commands: CommandsType = new Map(
    [
        ['reg', (type, data, ws) => {
            registerUser(type, data, ws);
        }],
        ['create_room', (msg, ws) => {
            console.log('create_room')
        }],
        ['add_user_to_room', (msg, ws) => {
            console.log('add_user_to_room')
        }],
        ['add_ships', (msg, ws) => {
            console.log('add_ships')
        }],
        ['attack', (msg, ws) => {
            console.log('attack')
        }],

        ['randomAttack', (msg, ws) => {
            console.log('randomAttack')
        }],

        ['single_play', (msg, ws) => {
            console.log('single_play')
        }],
        ['turn', (msg, ws) => {
            console.log('turn')
        }],
        ['finish', (msg, ws) => {
            console.log('finish')
        }],

    ]
)


export const handleInput = async(type: string, data: string, ws: WebSocketWithId) => {
    if (!type) return;
    const handler = commands.get(type);
    try {
        if (handler) await handler(type, data, ws);
        else ws.send(JSON.stringify({ error: true, errorText: 'Your request is invalid.' }));
    } catch (error) {
        console.log(error.message);
    }
}