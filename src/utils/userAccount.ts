import {users, User} from '../data/data';
import {WebSocketWithId} from '../../index';
import {Commands} from '../types/types';

export const getUser = (name: string): User | undefined =>
    users.find((user) => user.name === name);

export const addNewUser = (name: string, password: string, ws: WebSocketWithId) => {
    if (getUser(name)) return;
    const id = users.length + 1;
    const user = {
        index: id,
        name,
        password,
        victories: 0
    };
    users.push(user);
    successRegistrationResponse(name, '', ws);
};

export const successRegistrationResponse = (name: string, errMsg: string, ws: WebSocketWithId) => {
    ws.id = name;
    ws.send(
        JSON.stringify({
            type: Commands.Registration,
            data: JSON.stringify({
                name: name,
                index: getUser(name)?.index,
                error: false,
                errorText: errMsg,
            }),
        }),
    );
}

export const unsuccessfulRegistrationResponse = (name: string, errMsg: string, ws: WebSocketWithId) => {
    ws.id = '';
    ws.send(
        JSON.stringify({
            type: Commands.Registration,
            data: JSON.stringify({
                name: '',
                id: '',
                error: true,
                errorText: errMsg,
            }),
        }),
    );
}

export const isRegistered = (name: string, password: string): boolean =>
    users.some((user) => user.name === name && user.password === password);

export const victoryCounter = (name: string): void => {
    const user = users.find(user => user.name === name);
    user && user.victories++;
};