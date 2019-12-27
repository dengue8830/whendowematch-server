import * as SocketIO from 'socket.io';
import { Server } from 'http';
import { verify } from 'jsonwebtoken';
import { Config } from '@foal/core';
import { eventService } from './events.service';
import { userService, IUser } from './user.service';
// import logger from '../../common/logger';
// import server from '../../server';
// var MemcachedStore = require('socket.io-store-memcached');

interface SocketWithSession extends SocketIO.Socket {
  request: {
    session: {
      id: string
    }
  }
}

const logger = {
  info(text, text2?) {
    console.log(text, text2);
  }
}

// function extractToken(req) {
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     return req.headers.authorization.split(' ')[1];
//   } else if (req.query && req.query.token) {
//     return req.query.token;
//   }
//   return null;
// }

class SocketService {
  private io: SocketIO.Server;

  /**
   * Creates the necesary stuffs to get a working socket connection.
   *
   * @param server If not specified a new server will be created
   * to be binded by the socket.
   */
  init(server: Server) {
    this.io = SocketIO(server);
    // logger.info(`socket server binded to existing server on port ${server.address().port}`);
    this.io.use((socket, next) => {
      try {
        const decoded = verify(socket.handshake.query.token, Config.get('settings.jwt.secretOrPublicKey'));
        socket.request.session = decoded;
        console.log('parece estar todo en orden...');
        next();
      } catch (error) {
        console.log('error auth', error.message);
        next(new Error('Authentication error dx'));
      }
    });
    this.io.on('connect', this.onConnect);
  }

  onConnect = (socket: SocketWithSession) => {
    logger.info('onconnection', socket.request.session);
    userService.changeConnectionStatus(socket.request.session.id, 'connected');
    this.io.emit('userConnected', userService.findUserById(socket.request.session.id));
    socket.on('getSchedules', () => this.onGetSchedules(socket));
    socket.on('disconnect', () => this.onDisconnect(socket));
    socket.on('addSchedule', this.onAddSchedule);
    socket.on('getUsers', () => this.onGetUsers(socket));
  }

  onDisconnect = (socket: SocketWithSession) => {
    const userId = socket.request.session.id;
    userService.changeConnectionStatus(userId, 'disconnected');
    const user = userService.findUserById(userId);
    if (!user) {
      console.warn('wtf no existe el ' + userId);
    } else {
      this.io.emit('userDisconnected', user);
      logger.info(`disconnected ${user.name}`);
    }
  }

  onGetSchedules = (socket: SocketWithSession) => {
    socket.emit('getSchedules', eventService.events);
    // this.io.emit('getSchedules', process.env.NODE_APP_INSTANCE);
    // callback(eventService.events);
  }

  onAddSchedule = (event) => {
    eventService.addEvent(event);
    this.io.emit('addSchedule', event);
  }

  // users

  onGetUsers = (socket) => {
    socket.emit('getUsers', userService.users);
  }

}

export const socketService = new SocketService();