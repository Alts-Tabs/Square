let socket;

export const connectSocket = () => {
    // https 배포 시 wss://가 됨.
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname;
    const port = 8090; // server.js에서 정한 포트를 여기서도 명시 필요

    socket = new WebSocket(`${protocol}://${host}:${port}`);

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