// load when NODE_ENV=production
import { MidwayConfig } from '@midwayjs/core';

export default {
  // test: 'test'
  orm: {
    default: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: false,
      logging: false,
    },
  },
} as MidwayConfig;
