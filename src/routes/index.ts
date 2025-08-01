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
            try: () => ctx.db.task.findMany({ 
                where: getWhere(time),
                include: {
                    map: {
                        select: {
                            rank: true,
                            maxLv: true
                        }
                    }
                }
            }),
            catch: e => new DatabaseError(`Failed to fetch tasks: ${e}`)
        })
    }

    if (reward) {
        return Effect.tryPromise({
            try: () => ctx.db.task.findMany({ 
                where: { itemName: reward as any },
                include: {
                    map: {
                        select: {
                            rank: true,
                            maxLv: true
                        }
                    }
                }
            }),
            catch: e => new DatabaseError(`Failed to fetch tasks: ${e}`)
        })
    }

    return Effect.tryPromise({
            try: () => ctx.db.task.findMany({
                include: {
                    map: {
                        select: {
                            rank: true,
                            maxLv: true
                        }
                    }
                }
            }),
            catch: e => new DatabaseError(`Failed to fetch tasks: ${e}`)
        })
}))

router.get("/weapons", async(ctx: Context) => await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => {
    return Effect.tryPromise({
        try: () => ctx.db.weapon.findMany(),
        catch: e => new DatabaseError(`Failed to fetch weapons: ${e}`)
    })
}))

router.get("/rings", async(ctx: Context) => await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => {
    return Effect.tryPromise({
        try: () => ctx.db.ring.findMany(),
        catch: e => new DatabaseError(`Failed to fetch rings: ${e}`)
    })
}))

router.get("/items", async(ctx: Context) =>
  await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => {
    return Effect.tryPromise({
      try: () => ctx.db.item.findMany(),
      catch: e => new DatabaseError(`Failed to fetch items: ${e}`)
    })
  })
)

router.get("/equipments", async(ctx: Context) =>
  await handleHttpRequest(ctx, ctx.request.body, z.object({}), () => {
    return Effect.tryPromise({
      try: () => ctx.db.equipment.findMany(),
      catch: e => new DatabaseError(`Failed to fetch equipments: ${e}`)
    })
  })
)

export default router