import {WebSocketCustom} from '../../index';
import {registerUser} from '../handlers/registerHandler';
import {createGameRoom} from '../handlers/roomHandler';
import {Commands} from '../types/types';
import {addUsersToRoom} from '../handlers/newUserHandler';
import {addShips} from '../handlers/shipsHandler';
import {makeAttack} from '../handlers/attackHandler';
import {randomAttackHandler} from '../handlers/randomAttackHandler';
import {startGameVsPC} from '../bot/botHandler';
import {manageFinish} from '../handlers/finishHandler';

export type CommandsType = Map<string, (type: Commands, data: string, ws: WebSocketCustom) => void>

export const commands: CommandsType = new Map(
    [
        [Commands.Registration, (type, data, ws) => registerUser(type, data, ws)],
        [Commands.CreateRoom, (type, data, ws) => createGameRoom(ws)],
        [Commands.AddUserToRoom, (type, data, ws) => addUsersToRoom(data, ws)],
        [Commands.AddShips, (type, data, ws) => addShips(data, ws)],
        [Commands.Attack, (type, data, ws) => makeAttack(type, data, ws)],
        [Commands.RandomAttack, (type, data, ws) => randomAttackHandler(type, data, ws)],
        [Commands.SinglePlay, (type, data, ws) => startGameVsPC(ws)],
        [Commands.Finish, (type, data, ws) => manageFinish(type, data, ws)],
    ]
)


export const handleInput = async(type: Commands, data: string, ws: WebSocketCustom) => {
    if (!type) return;
    const handler = commands.get(type);
    try {
        if (handler) await handler(type, data, ws);
        else ws.send(JSON.stringify({ error: true, errorText: 'Your request is invalid.' }));
    } catch (error) {
        console.log("ERROR Message: ", error.message);
        console.log("ERROR Description: ", error);
    }
}