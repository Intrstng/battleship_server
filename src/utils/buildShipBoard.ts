import {Ship} from '../types/types';

export const buildShipsBoard = (id: string, shipsArray: Ship[]) => {
    const fieldSize = 10;
    const field = [];
    // Initialize the field with empty cells
    for (let i = 0; i < fieldSize; i++) {
        field[i] = new Array(fieldSize).fill('.');
    }
    shipsArray.forEach((ship) => {
        const { position, direction, type, length } = ship;
        const { x, y } = position;
        if (direction) {
            for (let i = y; i < y + length; i++) {
                if (i >= 0 && i < fieldSize && x >= 0 && x < fieldSize) {
                    field[i][x] = type[0].toUpperCase();
                }
            }
        } else {
            for (let i = x; i < x + length; i++) {
                if (y >= 0 && y < fieldSize && i >= 0 && i < fieldSize) {
                    field[y][i] = type[0].toUpperCase();
                }
            }
        }
    });
    // // Draw the field in the console
    // for (let i = 0; i < fieldSize; i++) {
    //     console.log(field[i].join(' '));
    // }
    return field;
}