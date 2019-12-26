export interface IUser {
  id: string
  color: string
  // avatarUrl: string
  name: string
  // socketId?: string
  connectionStatus: 'connected' | 'disconnected'
}

export class UserService {
  users: IUser[] = []

  addUser(user: IUser) {
    this.users.push(user);
  }

  // removeUser(id) {
  //   if (!this.users.length) {
  //     return;
  //   }
  //   this.users.splice(this.users.findIndex(user => user.socketId === id), 1);
  // }

  // findUserBySocketId(id) {
  //   return this.users.find(u => u.socketId === id);
  // }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  changeConnectionStatus(userId: string, status: 'connected' | 'disconnected') {
    const user = this.findUserById(userId);
    if (!user) {
      return;
    }
    user.connectionStatus = status;
    // this.users = [...this.users, user];
  }
  
}

export const userService = new UserService();