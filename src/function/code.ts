import { HttpStatus, makeHttpRequest, MidwayHttpError } from '@midwayjs/core';
import { Body, Controller, Inject, Post, Provide } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { URL } from 'url';

@Controller('/code')
@Provide()
export class CodeHandler {
  @Inject()
  ctx: Context;

  @Post('/token')
  async getToken(@Body() body: object) {
    const url = new URL('https://qyapi.weixin.qq.com/cgi-bin/gettoken');
    url.searchParams.set('corpid', body['key_1']);
    url.searchParams.set('corpsecret', body['key_2']);
    const { data } = await makeHttpRequest(url.toString(), {
      method: 'GET',
      dataType: 'json',
    });
    if (data.errcode !== 0) {
      throw new MidwayHttpError(data.errmsg, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return { token: data.access_token, expires_in: data.expires_in };
  }
}
