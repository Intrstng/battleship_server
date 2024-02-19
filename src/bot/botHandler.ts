import {WebSocketCustom} from '../../index';
import {game, playersShips, rooms, users} from '../data/data';
import {getUser} from '../utils/userAccount';
import {Attack, Commands, Ship} from '../types/types';
import {isThisAttackAlreadyDone, rememberAttack, targetHitCheck} from '../handlers/attackHandler';
import {WebSocket} from 'ws';
import {ShipCollection} from './shipCollection';
import {sendGameResponse, sendGameVsPCResponse} from '../utils/responses';
import {randomInteger} from '../utils/randomInteger';

export const ENEMY_PC = 'Enemy_PC';

export const startGameVsPC = async (ws: WebSocketCustom) => {
    ws.isGameVsPC = true;
    const wsPC: WebSocketCustom = new WebSocket('ws://localhost:3000') as WebSocketCustom;
    wsPC.isAlive = true;
    wsPC.madeAttacks = new Set();
    const id = rooms.size + 1; // const id = Date.now();
    const idxPC = users.length + 1;
    const wsOfAllUsersInRoom: WebSocketCustom[] = [];
    const madeAttacksByPC: Set<string> = new Set();
    const randomShipIdx = randomInteger(0,ShipCollection.length - 1);
    const ships: Ship[] = JSON.parse(ShipCollection[randomShipIdx]).ships;

    wsOfAllUsersInRoom.push(ws);

    await sendGameVsPCResponse(ENEMY_PC, idxPC, wsPC);
    wsOfAllUsersInRoom.push(wsPC);
    const room = {
        id,
        users: wsOfAllUsersInRoom,
    };

    rooms.set(id, room);
    game.set(id, {
        gameCounter: 1,
        idxOfActivePlayer: getUser(ws.id)?.index || 0
    });

    const shipsBoardArrayWithHitsHistory = ships.map((ship: Ship) => {
        return {
            ...ship,
            hitCapacity: ship.length,
        };
    });
    playersShips.set(ENEMY_PC, shipsBoardArrayWithHitsHistory);

    sendGameResponse(Commands.CreateGame, JSON.stringify({
        idGame: id,
        idPlayer: getUser(ws.id)?.index,
    }), ws);

    wsPC.send(
        JSON.stringify({
            type: Commands.CreateGame,
            data: JSON.stringify({
                idGame: id,
                idPlayer: +(getUser(ws.id)?.index) + 1,
            }),
            id: 0,
        }),
    );

    wsPC.send(
        JSON.stringify({
            type: Commands.StartGame,
            data: JSON.stringify({
                ships: shipsBoardArrayWithHitsHistory,
                currentPlayerIndex: getUser(ENEMY_PC)?.index,
            }),
            id: 0,
        }),
    );

    sendGameResponse(Commands.Turn, JSON.stringify({
        currentPlayer: getUser(ws.id)?.index,
    }), ws);

    wsPC.send(
        JSON.stringify({
            type: Commands.Turn,
            data: JSON.stringify({
                currentPlayer: getUser(ws.id)?.index,
            }),
            id: 0,
        }),
    );

    const pcAttack = (wsPC: WebSocketCustom) => {
        if (idxPC === game.get(id)?.idxOfActivePlayer) {
            let x: number = randomInteger(0,9);
            let y: number = randomInteger(0,9);
            if (isThisAttackAlreadyDone(x, y, madeAttacksByPC)) {
                while (isThisAttackAlreadyDone(x, y, madeAttacksByPC)) {
                    x = randomInteger(0,9);
                    y = randomInteger(0,9);
                }
            }
            rememberAttack(x, y, madeAttacksByPC);

            const status: Attack | undefined = targetHitCheck(wsPC, playersShips.get(wsPC.id) as Ship[], x, y, idxPC, wsPC);

            const nextTurnToPlayer: number =
                status === Attack.Shot ? idxPC : (getUser(wsPC.id)?.index as number);

            game.set(id, {
                gameCounter: 2,
                idxOfActivePlayer: nextTurnToPlayer,
            });

            const attackResponseData = {
                position: {
                    x: x,
                    y: y,
                },
                currentPlayer: idxPC,
                status: status,
            }
            sendGameResponse(Commands.Attack, JSON.stringify(attackResponseData), wsPC);
            sendGameResponse(Commands.Turn, JSON.stringify({ currentPlayer: nextTurnToPlayer }), wsPC);
        }
    };
    setInterval(() => pcAttack(ws), 5000);
};