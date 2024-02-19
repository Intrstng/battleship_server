import {WebSocketCustom} from '../../index';
import {game, playersShips, shipsBoard} from '../data/data';
import {initGameplay} from '../utils/gameplay';
import {buildShipsBoard} from '../utils/buildShipBoard';
import {Ship} from '../types/types';

export const addShips = (data: string, ws: WebSocketCustom) => {
    console.log(data);
    const { indexPlayer, gameId, ships } = JSON.parse(data);
    let count: number | undefined = game.get(gameId)?.gameCounter;
    count ? count++ : count = 1;
    game.set(gameId, {
        gameCounter: count,
        idxOfActivePlayer: 0,
    });
    const shipsBoardArray = [...ships];
    shipsBoard.set(ws.id, buildShipsBoard(ws.id, shipsBoardArray));

    const shipsBoardArrayWithHitsHistory = ships.map((ship: Ship) => {
        return {
            ...ship,
            hitCapacity: ship.length,
        };
    });
    playersShips.set(ws.id, shipsBoardArrayWithHitsHistory);
    initGameplay(gameId, indexPlayer, ws);
}
