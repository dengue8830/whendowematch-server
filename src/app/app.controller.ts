import { controller, Options, Context, HttpResponseOK, HttpResponseNoContent, Hook } from '@foal/core';

import { ApiController } from './controllers';
import { ApiAuthController } from './controllers/api.auth.controller';

@Hook((ctx: Context) => response => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
})
export class AppController {
  subControllers = [
    controller('/api/unkown', ApiController),
    controller('/api/auth', ApiAuthController)
  ];

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    return response;
  }
}
