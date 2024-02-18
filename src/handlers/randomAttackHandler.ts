import {Commands} from '../types/types';
import {WebSocketWithId} from '../../index';
import {makeAttack} from './attackHandler';
import {generateRandomAttackMove, randomInteger} from '../utils/randomInteger';
export const randomAttackHandler = (type: Commands, data: string, ws: WebSocketWithId) => {
    const { gameId, indexPlayer} = JSON.parse(data);
    const randomAttackData_JSON = generateRandomAttackMove(gameId, indexPlayer, ws);
    makeAttack(Commands.Attack, randomAttackData_JSON, ws);
}