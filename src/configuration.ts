import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import * as dotenv from 'dotenv';
import * as faas from '@midwayjs/faas';
import * as orm from '@midwayjs/orm';
import * as validate from '@midwayjs/validate';
import { join } from 'path';

if (process.env.NODE_ENV === 'local') {
  dotenv.config();
}

@Configuration({
  imports: [faas, orm, validate],
  importConfigs: [
    join(__dirname, './config/'),
  ],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {

  @App()
  app: faas.Application

  async onReady() {
    // this.app.useFilter([ErrorFilter])
  }
}
