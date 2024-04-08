import {GameParamsType, Room, Ship, User} from '../types/types';

// In memory DB with player data (login and password) storage
export const users: User[] = [];
export const rooms: Map<number, Room> = new Map();
export const game: Map<number, GameParamsType> = new Map();
export const playersShips: Map<string, Ship[]> = new Map();
export const shipsBoard: Map<string, Ship[]> = new Map();
export const hitsOfShips: Map<string, Set<string>> = new Map();