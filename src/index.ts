import 'reflect-metadata';
import 'source-map-support/register';
import { createSocketServer, useSocketServer } from 'socket-controllers';
import { MainSocketController } from './app/controllers/socket.controller';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import { createConnection } from 'typeorm';

// App
import { AppController } from './app/app.controller';

async function main() {
  await createConnection();

  const app = createApp(AppController);

  const httpServer = http.createServer(app);
  const port = Config.get('port', 3001);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
  createSocketServer(3002, {
    controllers: [MainSocketController]
  });
  // https://github.com/typestack/socket-controllers#using-exist-server-instead-of-creating-a-new-one
  // useSocketServer(port, {
  //   controllers: [MainSocketController]
  // });
}

main()
  .catch(err => { console.error(err); process.exit(1); });
