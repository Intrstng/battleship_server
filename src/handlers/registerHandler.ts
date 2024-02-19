import {WebSocketCustom} from '../../index';
import {getUser, isRegistered, addNewUser } from '../utils/userAccount';
import {getAllGameRooms} from './roomHandler';
import {Commands} from '../types/types';
import {unsuccessfulRegistrationResponse} from '../utils/responses';


export const registerUser = (type: Commands, data: string, ws: WebSocketCustom) => {
    const { name, password } = JSON.parse(data);
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