import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import {StatusCode} from '../types/types';

export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(StatusCode.NotFound);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(StatusCode.OK);
        res.end(data);
    });
});



