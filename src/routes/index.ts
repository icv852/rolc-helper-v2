import Router from "@koa/router"
import { Context } from "koa"
import { handleHttpRequest } from "../utils/effect-runners"
import { z } from "zod"
import { Effect } from "effect";
import { DatabaseError } from "../utils/errors";

const router = new Router()

router.get("/health-check", async (ctx: Context) => await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => Effect.succeed({ status: "OK" })))

router.get("/tasks", async(ctx: Context) => await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => {
    const { time, reward } = ctx.query

    if (time) {
        function getWhere(time: unknown) {
            switch (time) {
                case "day": return ({ day: true })
                case "dayS": return ({ dayS: true })
                case "evening": return ({ evening: true })
                case "eveningS": return ({ eveningS: true })
                case "night": return ({ night: true })
                case "nightS": return ({ nightS: true })
                default: return({})
            }
        }
        return Effect.tryPromise({
            try: () => ctx.db.task.findMany({ where: getWhere(time) }),
            catch: e => new DatabaseError(`Failed to fetch tasks: ${e}`)
        })
    }

    if (reward) {
        return Effect.tryPromise({
            try: () => ctx.db.task.findMany({ where: { itemName: reward as any } }),
            catch: e => new DatabaseError(`Failed to fetch tasks: ${e}`)
        })
    }

    return Effect.tryPromise({
            try: () => ctx.db.task.findMany(),
            catch: e => new DatabaseError(`Failed to fetch tasks: ${e}`)
        })
}))

router.get("/weapons", async(ctx: Context) => await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => {
    return Effect.tryPromise({
        try: () => ctx.db.weapon.findMany(),
        catch: e => new DatabaseError(`Failed to fetch weapons: ${e}`)
    })
}))

export default router