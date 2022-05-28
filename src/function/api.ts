import {
  HttpStatus,
  ILogger,
  makeHttpRequest,
  MidwayHttpError,
} from '@midwayjs/core';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Equal, Like, Repository } from 'typeorm';
import { URL } from 'url';
import { Realm } from '../model/realm';
import { Secret } from '../model/secret';
import { CodeHandler } from './code';

const MIN_TTL = 3600000;
let reqId = 0;

@Controller('/api')
export class ApiHandler {
  @Inject()
  ctx: Context;

  @Inject()
  logger: ILogger;

  @InjectEntityModel(Realm)
  realmRepo: Repository<Realm>;

  @InjectEntityModel(Secret)
  secretRepo: Repository<Secret>;

  @Inject()
  codeHandler: CodeHandler;

  @Validate()
  @Get('/realm')
  async listRealm(
    @Query() query: { page: number; pageSize: number; keyword?: string }
  ) {
    const { page = 1, pageSize = 10, keyword } = query;
    const res = await this.realmRepo.findAndCount({
      where: keyword && { comment: Like(`%${keyword}%`) },
      order: { updated_at: 'DESC', created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data: { list: res[0], total: res[1] }, success: 'ok' };
  }

  @Post('/realm')
  async createOrUpdateRealm(@Body() body: Realm) {
    // 业务参数校验
    // 重名判断
    const entity = await this.realmRepo.save(body);
    return entity;
  }

  @Get('/realm/:id')
  async getRealm(@Param('id') id: string) {
    const entity = await this.realmRepo.findOne({ where: { id: Equal(id) } });
    if (!entity) {
      throw new MidwayHttpError('realm 不存在', HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  @Post('/secret')
  async createOrUpdateSecret(@Body() body: Secret) {
    const entity = await this.secretRepo.save(body);
    return entity;
  }

  @Validate()
  @Get('/secret')
  async listSecret(
    @Query() query: { page: number; pageSize: number; realm?: string }
  ) {
    const { page = 1, pageSize = 10, realm } = query;

    const db_query = this.secretRepo.createQueryBuilder('secret');

    if (realm) {
      db_query.where('secret.realm = :realm', { realm });
    }

    db_query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy({
        updated_at: 'DESC',
        created_at: 'DESC',
      });

    const list = await db_query.getMany();
    const total = await db_query.getCount();
    return { data: { list, total }, success: 'ok' };
  }

  @Get('/secret/:id')
  async getSecret(@Param('key') key: string) {
    const entity = await this.secretRepo.findOne({
      where: { key: Equal(key) },
    });
    if (!entity) {
      throw new MidwayHttpError('secret 不存在', HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  /**
   * 从数据库存活数据、上游服务商（支持自定义FaaS和配置查询，优先选择配置查询），依次查询 token，存在即返回。
   * 注意需要设置正确的 expires_in
   */
  @Get('/token')
  async getToken(
    @Query() query: { key: string; realm: string; flush?: boolean }
  ) {
    const secret = await this.secretRepo.findOne({
      where: { key: query.key, realm: query.realm },
    });
    if (!secret) {
      throw new MidwayHttpError(
        '该 key 指定的 secret 不存在',
        HttpStatus.BAD_REQUEST
      );
    }
    if (!query.flush && secret.token && secret.expires_at) {
      const token = secret.token;
      const expires_in = secret.expires_at - new Date().getTime();
      if (expires_in > MIN_TTL) {
        return { token, expires_in, source: 'database' };
      }
    }

    const realm = await this.realmRepo.findOne({
      select: ['id', 'config', 'logic_code'],
      where: { id: query.realm },
    });
    if (!realm.config && !realm.logic_code) {
      throw new MidwayHttpError(
        '固定 token 模式不支持上游服务商',
        HttpStatus.EXPECTATION_FAILED
      );
    }
    // 优先使用配置模式
    let token: string, expires_in: number;
    if (realm.config) {
      const config = realm.config as {
        url: string;
        method: 'GET' | 'POST';
        content_type: 'json' | 'text';
        arguments: {
          place: 'url' | 'header' | 'body';
          name: string;
          value: string;
        }[];
        token_path: string;
        expires_in_path: string;
      };
      const header = {};
      const content = {};
      const params = {};
      const conv = (v: string) => {
        if (v.startsWith('$')) {
          return secret[v.slice(1)];
        } else {
          return v;
        }
      };
      for (const arg of config.arguments) {
        if (arg.place === 'header') {
          header[arg.name] = conv(arg.value);
        } else if (arg.place === 'body') {
          content[arg.name] = conv(arg.value);
        } else if (arg.place === 'url') {
          params[arg.name] = conv(arg.value);
        }
      }
      const url = new URL(config.url);
      for (const key of Object.keys(params)) {
        url.searchParams.set(key, params[key]);
      }
      const { data } = await makeHttpRequest(url.toString(), {
        method: config.method,
        data: content,
        contentType: config.content_type,
        dataType: 'json',
        headers: header,
      });
      token = data[config.token_path];
      expires_in = data[config.expires_in_path] * 1000;
    } else {
      const { data } = await makeHttpRequest(realm.logic_code, {
        method: 'POST',
        data: secret,
        contentType: 'json',
        dataType: 'json',
      });
      token = data.token;
      expires_in = data.expires_in * 1000;
    }
    reqId++;
    this.logger.info(
      `reqId: ${reqId}; token： ${token}; expires_in: ${expires_in}`
    );

    if (!token) {
      throw new MidwayHttpError(
        '无法从上游服务获取 token',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    secret.realm = realm.id;
    secret.token = token;
    secret.expires_at = new Date().getTime() + expires_in;
    this.secretRepo.save(secret);

    return { token, expires_in, source: 'upstream' };
  }
}
