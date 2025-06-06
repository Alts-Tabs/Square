const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connections = [];
let currentCode = null;

app.use(express.static(path.join(__dirname, 'public'))); // public 폴더에서 정적 파일 서빙

wss.on('connection', (ws) => {
    connections.push(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // 출석 시작
        if (data.type === 'start') {
            const code = Math.floor(100 + Math.random() * 900); // 세 자리 출석 랜덤 숫자
            currentCode = code;

            connections.forEach(conn => conn.send(JSON.stringify({
                type: 'start',
                code: code
            })));
        }

        // 출석 종료
        if (data.type === 'stop') {
            currentCode = null;

            connections.forEach(conn => conn.send(JSON.stringify({
                type: 'stop'
            })));
        }

        // 학생이 제출한 출석 숫자가 일치하는지 비교
        if (data.type === 'submit') {
            const isCorrect = parseInt(data.code) === currentCode;

            if (isCorrect) {
                connections.forEach(conn => conn.send(JSON.stringify({
                    type: 'check',
                    studentName: data.studentName,
                    code: data.code
                })));
            }
        }
    });

    ws.on('close', () => {
        connections = connections.filter(conn => conn !== ws);
    });
});

server.listen(8090, () => {
    console.log('서버 실행 중: http://localhost:8090');
});
