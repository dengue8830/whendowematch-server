interface IEvent {
  title: string
  start: Date
  end: Date
}

interface IUser {
  socketId: string
  // avatarUrl: string
  name: string
}

export class EventService {
  events: IEvent[] = []
  users: IUser[]

  addEvent(event: IEvent) {
    this.events.push(event);
  }

  addUser(user: IUser) {
    this.users.push(user);
  }

  removeUser(id) {
    if (!this.users.length) {
      return;
    }
    this.users.splice(this.users.findIndex(user => user.socketId === id), 1);
  }
}

export const eventService = new EventService();