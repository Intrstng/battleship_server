import { WebSocketWithId } from '../../index';
import {getUser, isRegistered, addNewUser, successRegistrationResponse, unsuccessfulRegistrationResponse } from '../utils/userAccount';
import {getAllRooms} from './roomHandler';
import {users} from '../data/data';


export const registerUser = (type: string, message: string, ws: WebSocketWithId) => {
    const { name, password } = JSON.parse(message);
    console.log("users", users)
    if (!getUser(name)) {
        addNewUser(name, password, ws);
        console.log("users_005", users)
        getAllRooms(ws);
    } else {
        if (isRegistered(name, password)) {
            console.log("users_010", users)
            unsuccessfulRegistrationResponse(name, 'A user with this login and password is already registered', ws);
            getAllRooms(ws);
        } else {
            unsuccessfulRegistrationResponse(name, 'Sorry, that username already exists', ws);
        }
    }
};