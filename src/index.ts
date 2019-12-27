import 'reflect-metadata';
import 'source-map-support/register';
// import { createSocketServer, useSocketServer } from 'socket-controllers';
// import { MainSocketController } from './app/controllers/socket.controller';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import { createConnection } from 'typeorm';

// App
import { AppController } from './app/app.controller';
import { socketService } from './app/services/socket.service';

async function main() {
  await createConnection();

  const app = createApp(AppController);
  const httpServer = http.createServer(app);
  const port = Config.get('port', 3001);
  // socketService.init(httpServer);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });

  const httpSocketServer = http.createServer();
  socketService.init(httpSocketServer);
  httpSocketServer.listen(3002, () => {
    console.log(`Socket http server listening on port ${3002}...`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
