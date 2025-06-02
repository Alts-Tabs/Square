let socket;

export const connectSocket = () => {
    socket = new WebSocket('ws://localhost:8090');

    return socket;
};

export const sendMessage = (data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
    }
};

export const onMessage = (callback) => {
    if (socket) {
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            callback(data);
        };
    }
};
