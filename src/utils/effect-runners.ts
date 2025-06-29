import { Effect, pipe } from "effect";
import { Context } from "koa";
import HttpStatusCode from "../constants/http-status-code";
import { CustomError } from "./errors";
import { ZodObject } from "zod";
import logger from "./logger";
import { validateByZodSchema } from "./validator";

export const handleHttpRequest = async (
    ctx: Context,
    requestBody: unknown,
    schema: ZodObject<any>,
    handler: (validatedData: any) => Effect.Effect<any, any>
) => {
    (await pipe(
        Effect.succeed(requestBody),
        Effect.flatMap(validateByZodSchema(schema)),
        Effect.flatMap(handler),
        Effect.map(data => () => {
            ctx.status = HttpStatusCode.OK
            ctx.body = { ...data }
            logger.info(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. ${JSON.stringify(ctx.body)}`)
        }),
        Effect.mapError(e => () => {
            if (e instanceof CustomError) {
                ctx.status = e.statusCode
                ctx.body = { error: { error_code: e.errorCode, message: e.clientMessage ?? e.message } }
                logger.error(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. ${e.errorCode}: ${e.message}`)
            } else {
                ctx.status = HttpStatusCode.INTERNAL_SERVER_ERROR
                ctx.body = { error: { error_code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occured. Please try again later." } }
                logger.error(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. UNKNOWN_ERROR: ${JSON.stringify(e)}`)
            }
        }),
        Effect.merge,
        Effect.runPromise
    ))()
}