import {
    Commands,
    Attack,
    AttackType,
    Ship,
    WinsType, AttackResponseType
} from '../types/types';
import { WebSocket } from 'ws';
import {WebSocketWithId, wss} from '../../index';
import {game, hitsOfShips, playersShips, rooms, shipsBoard, users} from '../data/data';
import {getUser} from '../utils/userAccount';
import {sendGameRoomResponse} from '../utils/responses';


export const rememberAttack = (x: number, y:number, set: Set<string>) => {
    set.add(`x${x}y${y}`);
}

export const isThisAttackAlreadyDone = (x: number, y: number, set: Set<string>): boolean => {
    console.log(`x${x}y${y}`)
    return set.has(`x${x}y${y}`);
};


export const makeAttack = (type: Commands, data: string, ws: WebSocketWithId) => {
    const { x, y, gameId, indexPlayer} = JSON.parse(data);
    const players = rooms.get(gameId)?.users;

// if (!isThisAttackAlreadyDone(x, y, enemy.madeAttacks));
// rememberAttack(x, y, enemy.madeAttacks)

    const enemy: WebSocketWithId = players && players.filter((player) => player.id !== ws.id)[0];

        if (indexPlayer === game.get(gameId)?.idxOfActivePlayer) {
            ////////////////////////////////////////////////////////////////////////////////////////////
            if (!isThisAttackAlreadyDone(x, y, enemy.madeAttacks)) {
                rememberAttack(x, y, enemy.madeAttacks)
////////////////////////////////////////////////////////////////////////////////////////////
            const status: AttackType | undefined = targetHitCheck(enemy, playersShips.get(enemy.id) as Ship[], x, y, indexPlayer, ws);
            players?.forEach((user) => {
// const enemy: WebSocketWithId = players.filter((player) => player.id !== ws.id)[0];
// const status: AttackType | undefined = targetHitCheck(enemy.id, playersShips.get(enemy.id) as Ship[], x, y);

                // change of turn to another player
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
                sendGameRoomResponse(type, JSON.stringify(response), user);
                sendGameRoomResponse(Commands.Turn, JSON.stringify({
                    currentPlayer: nextTurnToPlayer,
                }), user);
            });
        }
        // check the winner or loser (Also when the enemy leaves the room he loses)
        //const enemy = players && players.filter((u) => u.id !== ws.id)[0];
        if (enemy && enemy.readyState === WebSocket.CLOSED
            || isLoser(playersShips.get(enemy.id.toString()))) {
            countVictories(ws.id);

            players.forEach((user) => {
                sendGameRoomResponse(Commands.Finish, JSON.stringify({
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

            wss.clients?.forEach((client: WebSocketWithId) => {
                if (client.readyState === WebSocket.OPEN) {
                    const victoryBoardArray: WinsType[] = [];
                    users.forEach((user) =>
                        victoryBoardArray.push({
                            name: user.name,
                            wins: user.victories,
                        }),
                    );
                    sendGameRoomResponse(Commands.UpdateWinners, JSON.stringify(victoryBoardArray), client);
                }
            });
        }
        }
}

export const targetHitCheck = (enemy: WebSocketWithId, ships: Ship[], x: number, y: number, indexPlayer: number, ws: WebSocketWithId): AttackType | undefined => {
    const enemyID: string = enemy.id;
    let poolS: AttackResponseType[] = [];
    // let poolM: AttackResponseType[] = [];
    // let poolL: AttackResponseType[] = [];
    // let poolH: AttackResponseType[] = [];
    const currenBoard = shipsBoard.get(enemyID);
    // let cellsM: number[][];

    let cells: number[][];
    if (x === 0 && y === 0) {
        cells = [[x,y+1],[x+1,y],[x+1,y+1]];
    } else if (x === 9 && y === 0) {
        cells = [[x-1,y],[x-1,y+1],[x,y+1]];
    } else if (x === 9 && y === 9) {
        cells = [[x-1,y],[x,y-1],[x-1,y-1]];
    } else if (x === 0 && y === 9) {
        cells = [[x+1,y],[x,y-1],[x+1,y-1]];
    } else if (x === 0 && (y !== 0 && y !== 9)) {
        cells = [[x+1,y],[x,y-1],[x+1,y-1],[x+1,y+1],[x,y+1]];
    } else if (y === 0 && (x !== 0 && x !== 9)) {
        cells = [[x+1,y],[x+1,y+1],[x,y+1],[x-1,y+1],[x-1,y]];
    } else if (x === 9 && (y !== 0 && y !== 9)) {
        cells = [[x,y-1],[x-1,y-1],[x-1,y],[x-1,y+1],[x,y+1]];
    } else if (y === 9 && (x !== 0 && x !== 9)) {
        cells = [[x-1,y],[x-1,y-1],[x,y-1],[x+1,y-1],[x+1,y]];
    } else {
        cells = [[x,y-1],[x,y+1],[x+1,y],[x+1,y-1],[x+1,y+1],[x-1, y],[x-1,y-1],[x-1,y+1]];
    }
    switch (currenBoard[y][x]) {
        case ('S'):
                shipsBoard.get(enemyID)[y][x] = 'K';
                console.log('Killed Small ship')
                cells.forEach(cell => {
                    makeResponsePool(cell[0],cell[1], indexPlayer, poolS)
                    rememberAttack(cell[0],cell[1], enemy.madeAttacks);
                });
                poolS.forEach(p => sendGameRoomResponse(Commands.Attack, JSON.stringify(p), ws));
                poolS.length = 0;
            break;
        case ('M'): {
            shipsBoard.get(enemyID)[y][x] = 'K';
            cells.forEach(cell => {
                if (shipsBoard.get(enemyID)[cell[1]][cell[0]] === 'K') {
                    console.log('Killed Middle ship')
                    // cells.forEach(c => {
                    //     if (shipsBoard.get(enemyID)[c[1]][c[0]] === 'K') {
                    //         shipsBoard.get(enemyID).forEach((board, idx) => {
                    //             console.log(board)
                    //         })
                    //        // makeResponsePool(cell[0],cell[1], indexPlayer, poolM);
                    //        // rememberAttack(x, y, enemy.madeAttacks);
                    //     }
                    //     // makeResponsePool(cell[0],cell[1], indexPlayer, poolM)
                    //     // rememberAttack(x, y, enemy.madeAttacks);
                    // });
                    // poolM.forEach(p => sendGameRoomResponse(Commands.Attack, JSON.stringify(p), ws));
                    // poolM.length = 0;
                }
            })
            break;
        }
        case ('L'): {
            shipsBoard.get(enemyID)[y][x] = 'K';
            // ................. //
            break;
        }
        case ('H'): {
            shipsBoard.get(enemyID)[y][x] = 'K';
            // ................. //
            break;
        }
    }

    function hitCheck(ship: Ship) {
        const sizeHorizontal = ship.direction === false ? ship.length - 1 : 0;
        const sizeVertical = ship.direction === true ? ship.length - 1 : 0;
        if (
            x >= ship.position.x &&
            x <= ship.position.x + sizeHorizontal &&
            y >= ship.position.y &&
            y <= ship.position.y + sizeVertical
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


export const isLoser = (
    playersShipsCollection: Ship[] | undefined,
): boolean => playersShipsCollection && playersShipsCollection.every((ship) => ship.hitCapacity === 0);



export const countVictories = (name: string): void => {
    const winnerIndex: number = users.findIndex((user) => user.name === name);
    users[winnerIndex].victories++;
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