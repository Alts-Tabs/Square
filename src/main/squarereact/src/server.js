const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let connections = [];

wss.on('connection', function connection(ws) {
    connections.push(ws);

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        
        // 강사 출석 시작
        if (data.type === 'start') {
            connections.forEach(conn => conn.send(JSON.stringify({ type: 'start' })));
        }

        // 학생이 번호 제출
        if (data.type === 'submit') {
            connections.forEach(conn => conn.send(JSON.stringify({
                type: 'check',
                studentName: data.studentName,
                code: data.code,
            })));
        }
    });

    ws.on('close', () => {
        connections = connections.filter(conn => conn !== ws);
    });
});
