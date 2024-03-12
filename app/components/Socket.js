// socket.js
import {io} from 'socket.io-client';
import configServer from '../../configServer';

const socket = io(configServer.api.host);
export default socket;
