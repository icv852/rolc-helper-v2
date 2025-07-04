import Koa from "koa"
import bodyParser from "koa-bodyparser"
import router from "./routes"
import cors from "@koa/cors"
import { PrismaClient } from "../generated/prisma"

const createKoaApp = (prisma: PrismaClient): Koa => {
    const app = new Koa()

    app
        .use(cors())
        .use(async (ctx, next) => {
            ctx.db = prisma
            await next()
        })
        .use(bodyParser())
        .use(router.routes())
        .use(router.allowedMethods())

    return app
}

export default createKoaApp