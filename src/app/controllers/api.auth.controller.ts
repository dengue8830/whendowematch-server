import { Get, HttpResponseOK, Post, dependency, Context, Config, ValidateBody, Hook, Options } from '@foal/core';
import { UserService, IUser, userService } from '../services/user.service';
import { sign } from 'jsonwebtoken';

export class ApiAuthController {

  @Get('/listusers')
  users() {
    return new HttpResponseOK({ users: userService.users });
  }

  @Post('/register')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      color: { type: 'string' }
    },
    required: ['name', 'color'],
    type: 'object'
  })
  register(ctx: Context) {
    const user = {
      id: new Date().getTime().toString(),
      connectionStatus: 'disconnected',
      name: ctx.request.body.name,
      color: ctx.request.body.color || 'teal',
    } as IUser;
    userService.addUser(user);
    const token = sign(
      {
        id: user.id
      },
      Config.get<string>('settings.jwt.secretOrPublicKey'),
      // { expiresIn: '1h' }
    );
    return new HttpResponseOK({ token, user });
  }

}
