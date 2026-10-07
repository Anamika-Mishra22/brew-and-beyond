import { io } from 'socket.io-client';

// Single Socket Instance
const socket = io('http://localhost:5000');

export default socket;