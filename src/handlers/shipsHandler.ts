import {WebSocketWithId} from '../../index';
import {game, playersShips} from '../data/data';
import {initGameplay} from '../utils/gameplay';

export const addShips = (data: string, ws: WebSocketWithId) => {
    const { indexPlayer, gameId, ships } = JSON.parse(data);
    let count: number | undefined = game.get(gameId)?.gameCounter;
    count ? count++ : count = 1;
    game.set(gameId, {
        gameCounter: count,
        idxOfActivePlayer: 0,
    });

    const shipsWithHitCapacity = [...ships];
    playersShips.set(ws.id, shipsWithHitCapacity);
    initGameplay(gameId, indexPlayer, ws);
}
