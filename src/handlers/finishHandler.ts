import {WebSocketCustom} from '../../index';
import {getUser} from '../utils/userAccount';
import {Commands} from '../types/types';
import {sendGameResponse} from '../utils/responses';

export const manageFinish = (type: Commands, data: string, ws: WebSocketCustom) => {
    sendGameResponse(type, JSON.stringify({
        winPlayer: getUser(ws.id)?.index,
    }), ws);
};