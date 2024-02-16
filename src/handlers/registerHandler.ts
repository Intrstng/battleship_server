import { WebSocketWithId } from '../../index';
import {getUser, isRegistered, addNewUser, unsuccessfulRegistrationResponse } from '../utils/userAccount';
import {getAllGameRooms} from './roomHandler';
import {Commands} from '../types/types';


export const registerUser = (type: Commands, message: string, ws: WebSocketWithId) => {
    const { name, password } = JSON.parse(message);
    if (!getUser(name)) {
        addNewUser(name, password, ws);
        getAllGameRooms(ws);
    } else {
        if (isRegistered(name, password)) {
            unsuccessfulRegistrationResponse(name, 'A user with this login and password is already registered', ws);
            //getAllGameRooms(ws);
        } else {
            unsuccessfulRegistrationResponse(name, 'Sorry, that username already exists', ws);
        }
    }
};