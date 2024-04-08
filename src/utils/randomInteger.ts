import {WebSocketCustom} from '../../index';
import {game, rooms} from '../data/data';
import {isThisAttackAlreadyDone} from '../handlers/attackHandler';

export const randomInteger = (min: number, max: number) => {
    let random = min + Math.random() * (max + 1 - min);
    return Math.floor(random);
}


export const generateRandomAttackMove = (gameId: number, indexPlayer: number, ws: WebSocketCustom) => {
    const players = rooms.get(gameId)?.users;
    let randomAttackData_JSON: string;
    const enemy: WebSocketCustom = players && players.filter((player) => player.id !== ws.id)[0];
    const random_X = randomInteger(0,9);
    const random_Y = randomInteger(0,9);
    if (indexPlayer === game.get(gameId)?.idxOfActivePlayer) {
        if (isThisAttackAlreadyDone(random_X, random_Y, enemy.madeAttacks) && enemy.madeAttacks.size < 100) {
            generateRandomAttackMove(gameId, indexPlayer, ws);
            return;
        }
        randomAttackData_JSON = JSON.stringify({
            x: random_X,
            y: random_Y,
            gameId,
            indexPlayer
        })
    }
    return randomAttackData_JSON;
}