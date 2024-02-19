import {WebSocketCustom} from '../../index';
import {game, playersShips, shipsBoard} from '../data/data';
import {initGameplay} from '../utils/gameplay';
import {buildShipsBoard} from '../utils/buildShipBoard';

export const addShips = (data: string, ws: WebSocketCustom) => {
    const { indexPlayer, gameId, ships } = JSON.parse(data);
    let count: number | undefined = game.get(gameId)?.gameCounter;
    count ? count++ : count = 1;
    game.set(gameId, {
        gameCounter: count,
        idxOfActivePlayer: 0,
    });

    const shipsBoardArray = [...ships];
    playersShips.set(ws.id, shipsBoardArray);
    shipsBoard.set(ws.id, buildShipsBoard(ws.id, shipsBoardArray));
    initGameplay(gameId, indexPlayer, ws);
}
