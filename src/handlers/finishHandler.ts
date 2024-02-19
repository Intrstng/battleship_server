import {WebSocketCustom} from '../../index';
import {getUser} from '../utils/userAccount';
import {Commands} from '../types/types';
import {WebSocket} from 'ws';
import {sendGameResponse} from '../utils/responses';

// export const manageFinish = (type: Commands, data: string, ws: WebSocketWithId) => {
//     console.log('FINISHED')
//     // sendGameResponse(type, JSON.stringify({
//     //     winPlayer: getUser(ws.id)?.index,
//     // }), ws);
//     ws.send(
//         JSON.stringify({
//             type: 'finish',
//             data: JSON.stringify({
//                 winPlayer: getUser(ws.id)?.index,
//             }),
//             id: 0,
//         }),
//     );
// };


export const handleFinish = (type: Commands, data: string, ws: WebSocketCustom) => {
    ws.send(
        JSON.stringify({
            type: 'finish',
            data: JSON.stringify({
                winPlayer: getUser(ws.id)?.index,
            }),
            id: 0,
        }),
    );
};