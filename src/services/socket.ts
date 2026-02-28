import { io } from 'socket.io-client';

const SOCKET_URL = window.location.origin;

export const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
