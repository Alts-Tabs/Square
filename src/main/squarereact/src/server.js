const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors'); // CORS 설정

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
    },
});

app.use(express.static(path.join(__dirname, 'public'))); // public 폴더에서 정적 파일 서빙

// 각 수업별 출석 코드 저장 (ex: { "class101": 123 })
let classAttendanceCodes = {};

io.on('connection', (socket) => {
    console.log('✅ 클라이언트 연결됨');

    // 방 참가
    socket.on('join-class', (classId) => {
        socket.join(classId);
        console.log(`📚 ${classId} 방 입장`);
    });

        // 출석 시작
        socket.on('start-attendance', (classId) => {
            const code = Math.floor(100 + Math.random() * 900); // 세 자리 랜덤 숫자
            classAttendanceCodes[classId] = code;

            io.to(classId).emit('start', { code });
            console.log(`🚀 ${classId} 방 출석 시작: ${code}`);
        });

        // 출석 종료
        socket.on('stop-attendance', (classId) => {
            delete classAttendanceCodes[classId];
            io.to(classId).emit('stop');
            console.log(`🛑 ${classId} 방 출석 종료`);
        });

        // 학생이 제출한 출석 숫자가 일치하는지 비교
        socket.on('submit-code', ({ classId, studentName, code }) => {
            const currentCode = classAttendanceCodes[classId];
            const isCorrect = parseInt(code) === currentCode;

            if (isCorrect) {
            io.to(classId).emit('check', { studentName, code });
            console.log(`🎉 ${studentName} 출석 성공 (${classId})`);
            } else {
            console.log(`❌ ${studentName} 출석 실패 (${classId})`);
            }
        });

    socket.on('disconnect', () => {
        console.log('❌ 클라이언트 연결 해제');
    });
});


server.listen(8090, () => {
    console.log('Socket.IO server running on port 8090');
});
