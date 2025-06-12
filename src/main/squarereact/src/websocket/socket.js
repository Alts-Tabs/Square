import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
    socket = io('http://localhost:8090', {
        withCredentials: true
    });

    return socket;
};

export const sendMessage = (event, data) => {
    if (socket) {
        socket.emit(event, data);
    }
};

export const onMessage = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
    }
};