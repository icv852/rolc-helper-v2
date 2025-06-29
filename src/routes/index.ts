import Router from "@koa/router"
import { Context } from "koa"
import { handleHttpRequest } from "../utils/effect-runners"
import { z } from "zod"
import { Effect } from "effect/index"

const router = new Router()

router.get("/health-check", async (ctx: Context) => await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => Effect.succeed({ status: "OK" })))

export default router