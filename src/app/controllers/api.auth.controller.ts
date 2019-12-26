import { Get, HttpResponseOK, Post, dependency, Context, Config, ValidateBody, Hook, Options } from '@foal/core';
import { UserService, IUser, userService } from '../services/user.service';
import { sign } from 'jsonwebtoken';

// @Hook(() => (ctx, services, response) => {
//   // Every response of this controller and its sub-controllers will be added this header.
//   response.setHeader('Access-Control-Allow-Origin', '*');
// })
export class ApiAuthController {

  @Get('/listusers')
  users() {
    return new HttpResponseOK({ users: userService.users });
  }

  @Post('/register')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      name: { type: 'string' }
    },
    required: ['name'],
    type: 'object'
  })
  register(ctx: Context) {
    const user = {
      id: new Date().getTime().toString(),
      color: 'teal',
      connectionStatus: 'disconnected',
      name: ctx.request.body.name
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
