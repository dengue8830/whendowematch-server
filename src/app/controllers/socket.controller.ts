import { OnConnect, SocketController, ConnectedSocket, OnDisconnect, MessageBody, OnMessage, SocketIO } from 'socket-controllers';
import { dependency } from '@foal/core';
import { eventService } from '../services';

@SocketController()
export class MainSocketController {

  @OnConnect()
  connection(@ConnectedSocket() socket: any) {
    console.log('client connected'); // socket.request._query.foo
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    console.log('client disconnected');
    eventService.removeUser(socket.id);
  }

  @OnMessage('addEvent')
  onNewEvent(@ConnectedSocket() socket: any, @MessageBody() event: any, @SocketIO() io: any) {
    console.log('nuevo evento', event);
    eventService.addEvent(event);
    io.emit('newEvent', event);
  }

  @OnMessage('getEvents')
  onGetEvents(@ConnectedSocket() socket: any) {
    console.log('solicitando eventos');
    socket.emit('currentEvents', eventService.events);
  }

  @OnMessage('addUser')
  onAddUser(@ConnectedSocket() socket: any, @MessageBody() userData: any, @SocketIO() io: any) {
    console.log('nuevo user', event);
    const user = {
      name: userData.name,
      socketId: socket.id
    };
    eventService.addUser(user);
    io.emit('newUser', user);
  }

  @OnMessage('getUsers')
  onGetUsers(@ConnectedSocket() socket: any) {
    socket.emit('currentUsers', eventService.users);
  }
}