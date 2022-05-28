
import { Catch } from '@midwayjs/decorator';
import { MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/faas';

@Catch()
export class ErrorFilter {
    async catch(err: MidwayHttpError, ctx: Context) {
        return err.message;
    }
}