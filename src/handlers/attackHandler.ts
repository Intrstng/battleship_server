import {
    Commands,
    Attack,
    AttackType,
    Ship,
    WinsType, AttackResponseType
} from '../types/types';
import {WebSocket} from 'ws';
import {WebSocketCustom, wss} from '../../index';
import {game, hitsOfShips, playersShips, rooms, shipsBoard, users} from '../data/data';
import {getUser} from '../utils/userAccount';
import {sendGameResponse} from '../utils/responses';
import {ENEMY_PC} from '../bot/botHandler';


export const rememberAttack = (x: number, y: number, set: Set<string>) => {
    set.add(`x${x}y${y}`);
}

export const isThisAttackAlreadyDone = (x: number, y: number, set: Set<string>): boolean => {
    console.log(`x${x}y${y}`)
    return set.has(`x${x}y${y}`);
};


export const makeAttack = (type: Commands, data: string, ws: WebSocketCustom) => {
    console.log(type, data);
    const {x, y, gameId, indexPlayer} = JSON.parse(data);
    const players = rooms.get(gameId)?.users;
    const enemy: WebSocketCustom = players && players.filter((player) => player.id !== ws.id)[0];
    // Multiplayer game (the attack of player)
    if (ws.id !== ENEMY_PC && indexPlayer === game.get(gameId)?.idxOfActivePlayer) {
        if (!isThisAttackAlreadyDone(x, y, enemy.madeAttacks)) {
            rememberAttack(x, y, enemy.madeAttacks);
            const status: AttackType | undefined = targetHitCheck(enemy, playersShips.get(enemy.id) as Ship[], x, y, indexPlayer, ws);
            players?.forEach((user) => {
                // Change of turn to another player
                const nextTurnToPlayer: number = (status === Attack.Shot
                    || status === Attack.Killed) ? indexPlayer
                    : (getUser(enemy.id)?.index as number);

                game.set(gameId, {
                    gameCounter: 2,
                    idxOfActivePlayer: nextTurnToPlayer,
                });

                const response = {
                    position: {
                        x: x,
                        y: y,
                    },
                    currentPlayer: indexPlayer,
                    status: status,
                }
                sendGameResponse(type, JSON.stringify(response), user);
                sendGameResponse(Commands.Turn, JSON.stringify({
                    currentPlayer: nextTurnToPlayer,
                }), user);
            });
        }

        // Check the winner or loser (Also when the enemy leaves the room he loses)
        if (enemy && enemy.readyState === WebSocket.CLOSED
            || isLoser(playersShips.get(enemy.id.toString()))) {
            countVictories(ws.id);

            players.forEach((user) => {
                sendGameResponse(Commands.Finish, JSON.stringify({
                    winPlayer: getUser(ws.id)?.index,
                }), user);
            });

            hitsOfShips.clear();
            playersShips.clear();
            game.set(gameId, {
                gameCounter: 0,
                idxOfActivePlayer: 0,
            });
            rooms.clear();

            wss.clients?.forEach((client: WebSocketCustom) => {
                if (client.readyState === WebSocket.OPEN) {
                    const victoryBoardArray: WinsType[] = [];
                    users.forEach((user) =>
                        victoryBoardArray.push({
                            name: user.name,
                            wins: user.victories,
                        }),
                    );
                    sendGameResponse(Commands.UpdateWinners, JSON.stringify(victoryBoardArray), client);
                }
            });
        }
    }
    // Game vs PC - single player (the attack of PC)
    if (ws.id === ENEMY_PC && indexPlayer === game.get(gameId)?.idxOfActivePlayer) {
        const botPC_ID = rooms.get(1).users[1].id;
        const status: AttackType | undefined = targetHitCheck(enemy, playersShips.get(ws.id) as Ship[], x, y, indexPlayer, ws);
        players?.forEach((user) => {
            // Change of turn to another player
            const nextTurnToPlayer: number = (status === Attack.Shot
                || status === Attack.Killed) ? indexPlayer
                : (getUser(enemy.id)?.index as number);

            game.set(gameId, {
                gameCounter: 2,
                idxOfActivePlayer: nextTurnToPlayer,
            });

            const response = {
                position: {
                    x: x,
                    y: y,
                },
                currentPlayer: indexPlayer,
                status: status,
            }
            sendGameResponse(type, JSON.stringify(response), user);
            sendGameResponse(Commands.Turn, JSON.stringify({
                currentPlayer: nextTurnToPlayer,
            }), user);
        });
        // Check the winner or loser (Also when the enemy leaves the room he loses)
        if (enemy && enemy.readyState === WebSocket.CLOSED
            || isLoser(playersShips.get(botPC_ID.toString()))) {
            countVictories(ws.id);
            players.forEach((user) => {
                sendGameResponse(Commands.Finish, JSON.stringify({
                    winPlayer: getUser(ws.id)?.index,
                }), user);
            });
            hitsOfShips.clear();
            playersShips.clear();
            game.set(gameId, {
                gameCounter: 0,
                idxOfActivePlayer: 0,
            });
            rooms.clear();

            wss.clients?.forEach((client: WebSocketCustom) => {
                if (client.readyState === WebSocket.OPEN) {
                    const victoryBoardArray: WinsType[] = [];
                    users.forEach((user) =>
                        victoryBoardArray.push({
                            name: user.name,
                            wins: user.victories,
                        }),
                    );
                    sendGameResponse(Commands.UpdateWinners, JSON.stringify(victoryBoardArray), client);
                }
            });
        }
    }
}

export const targetHitCheck = (enemy: WebSocketCustom, ships: Ship[], x: number, y: number, indexPlayer: number, ws: WebSocketCustom): AttackType | undefined => {
    const isGameVsPC = rooms.get(1).users[0].isGameVsPC;
    const botPC_ID = isGameVsPC && rooms.get(1).users[1].id;
    const enemyID: string = isGameVsPC ? botPC_ID : enemy.id;
    let poolS: AttackResponseType[] = [];
    // let poolM: AttackResponseType[] = [];
    // let poolL: AttackResponseType[] = [];
    // let poolH: AttackResponseType[] = [];
    const currentBoard = shipsBoard.get(enemyID);

    let cells: number[][];
    if (x === 0 && y === 0) {
        cells = [[x, y + 1], [x + 1, y], [x + 1, y + 1]];
    } else if (x === 9 && y === 0) {
        cells = [[x - 1, y], [x - 1, y + 1], [x, y + 1]];
    } else if (x === 9 && y === 9) {
        cells = [[x - 1, y], [x, y - 1], [x - 1, y - 1]];
    } else if (x === 0 && y === 9) {
        cells = [[x + 1, y], [x, y - 1], [x + 1, y - 1]];
    } else if (x === 0 && (y !== 0 && y !== 9)) {
        cells = [[x + 1, y], [x, y - 1], [x + 1, y - 1], [x + 1, y + 1], [x, y + 1]];
    } else if (y === 0 && (x !== 0 && x !== 9)) {
        cells = [[x + 1, y], [x + 1, y + 1], [x, y + 1], [x - 1, y + 1], [x - 1, y]];
    } else if (x === 9 && (y !== 0 && y !== 9)) {
        cells = [[x, y - 1], [x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x, y + 1]];
    } else if (y === 9 && (x !== 0 && x !== 9)) {
        cells = [[x - 1, y], [x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x + 1, y]];
    } else {
        cells = [[x, y - 1], [x, y + 1], [x + 1, y], [x + 1, y - 1], [x + 1, y + 1], [x - 1, y], [x - 1, y - 1], [x - 1, y + 1]];
    }
    // Multiplayer
    if (ws.id !== ENEMY_PC && currentBoard) {
        switch (currentBoard[y][x]) {
            case ('S'):
                shipsBoard.get(enemyID)[y][x] = 'K';
                console.log('Killed Small ship')
                cells.forEach(cell => {
                    makeResponsePool(cell[0], cell[1], indexPlayer, poolS)
                    rememberAttack(cell[0], cell[1], enemy.madeAttacks);
                });
                poolS.forEach(p => sendGameResponse(Commands.Attack, JSON.stringify(p), ws));
                poolS.length = 0;
                break;
            case ('M'): {
                shipsBoard.get(enemyID)[y][x] = 'K';
                cells.forEach(cell => {
                    if (shipsBoard.get(enemyID)[cell[1]][cell[0]] === 'K') {
                        console.log('Killed Middle ship')
                    }
                })
                break;
            }
            case ('L'): {
                shipsBoard.get(enemyID)[y][x] = 'K';
                break;
            }
            case ('H'): {
                shipsBoard.get(enemyID)[y][x] = 'K';
                break;
            }
        }
    }

    function hitCheck(ship: Ship) {
        const sizeHorizontal = ship.direction === false ? ship.length - 1 : 0;
        const sizeVertical = ship.direction === true ? ship.length - 1 : 0;
        if (
            x >= ship.position.x
            && x <= ship.position.x + sizeHorizontal
            && y >= ship.position.y
            && y <= ship.position.y + sizeVertical
        ) {
            if (!hitsOfShips?.get(enemyID)?.has(`${x}*${y}`) && ship.hitCapacity) {
                ship.hitCapacity--;
            }
            const madeHits = hitsOfShips.get(enemyID);
            const newHits = madeHits?.add(`${x}*${y}`);
            hitsOfShips.set(enemyID, newHits as Set<string>);
            return true;
        } else {
            return false;
        }
    }
    if (ships) {
        return ships.some(hitCheck) ? Attack.Shot : Attack.Miss;
    }
};

export function makeResponsePool(x: number, y: number, indexPlayer: number, poolArr: AttackResponseType[]): void {
    const response: AttackResponseType = {
        position: {
            x: x,
            y: y
        },
        currentPlayer: indexPlayer,
        status: Attack.Miss,
    }
    poolArr.push(response);
}

export const isLoser = (playersShipsCollection: Ship[] | undefined): boolean => playersShipsCollection && playersShipsCollection.every((ship) => ship.hitCapacity === 0);


export const countVictories = (name: string): void => {
    const idxOfWinner: number = users.findIndex((user) => user.name === name);
    users[idxOfWinner].victories++;
};