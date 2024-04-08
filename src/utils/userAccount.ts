import {users} from '../data/data';
import {WebSocketCustom} from '../../index';
import {User} from '../types/types';
import {successRegistrationResponse} from './responses';

export const getUser = (name: string): User | undefined =>
    users.find((user) => user.name === name);

export const addNewUser = (name: string, password: string, ws: WebSocketCustom) => {
    if (getUser(name)) return;
    const id = users.length + 1;
    const user = {
        index: id,
        name,
        password,
        victories: 0
    };
    users.push(user);
    ws.madeAttacks = new Set();
    successRegistrationResponse(name, '', ws);
};

export const isRegistered = (name: string, password: string): boolean =>
    users.some((user) => user.name === name && user.password === password);

export const victoryCounter = (name: string): void => {
    const user = users.find(user => user.name === name);
    user && user.victories++;
};