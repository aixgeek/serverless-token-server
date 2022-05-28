// load when NODE_ENV=production
import { MidwayConfig } from '@midwayjs/core';

export default {
  // test: 'test'
  orm: {
    default: {
      type: 'mysql',
      host: 'rm-bp15pc6l8re2969us5o.mysql.rds.aliyuncs.com',
      port: 3306,
      username: 'weibanzhushou',
      password: 'qqrda_ZbX6@ALe@',
      database: 'weibanzhushou',
      synchronize: false,
      logging: false,
    },
  },
} as MidwayConfig;
