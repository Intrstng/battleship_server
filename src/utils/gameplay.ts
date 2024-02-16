import {game, playersShips, rooms} from '../data/data';
import {Commands, sendGameRoomResponse} from '../types/types';
import {WebSocketWithId} from '../../index';

export const initGameplay = (gameID: number, playerIdx: number, ws: WebSocketWithId) => {
    // Wait for connection of second player
    if (game.get(gameID)?.gameCounter < 2) {
        setTimeout((gameID: number, playerIdx: number, ws: WebSocketWithId) => initGameplay(gameID, playerIdx, ws), 1000);
    } else {
        const players = rooms.get(gameID)?.users;
        players?.forEach((user) => {
            sendGameRoomResponse(Commands.StartGame, JSON.stringify({
                ships: playersShips.get(user.id),
                currentPlayerIndex: playerIdx,
            }), user);

            const gameData = game.get(gameID) || {
                gameCounter: 0,
                idxOfActivePlayer: 0,
            };
            gameData && (gameData.idxOfActivePlayer = playerIdx);
            game.set(gameID, gameData);

            sendGameRoomResponse(Commands.Turn, JSON.stringify({
                currentPlayer: playerIdx,
            }), ws);
        });
    }
}