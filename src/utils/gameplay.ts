import {game, playersShips, rooms} from '../data/data';
import {Commands} from '../types/types';
import {WebSocketCustom} from '../../index';
import {sendGameResponse} from './responses';

export const initGameplay = (gameID: number, playerIdx: number, ws: WebSocketCustom) => {
    // Wait for connection of second player
    if (game.get(gameID)?.gameCounter < 2) {
        // Pulse
        setTimeout((gameID: number, playerIdx: number, ws: WebSocketCustom) => initGameplay(gameID, playerIdx, ws), 1000);
    } else {
        const players = rooms.get(gameID)?.users;
        players?.forEach((user) => {
            sendGameResponse(Commands.StartGame, JSON.stringify({
                ships: playersShips.get(user.id),
                currentPlayerIndex: playerIdx,
            }), user);

            const gameData = game.get(gameID) || {
                gameCounter: 0,
                idxOfActivePlayer: 0,
            };
            gameData && (gameData.idxOfActivePlayer = playerIdx);
            game.set(gameID, gameData);

            sendGameResponse(Commands.Turn, JSON.stringify({
                currentPlayer: playerIdx,
            }), ws);
        });
    }
}