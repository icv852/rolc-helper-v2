import Koa from "koa"
import bodyParser from "koa-bodyparser"
import router from "./routes"
import cors from "@koa/cors"

const createKoaApp = (): Koa => {
    const app = new Koa()

    app
        .use(cors())
        // .use(async (ctx, next) => {
        //     ctx.authService = authService
        //     await next()
        // })
        .use(bodyParser())
        .use(router.routes())
        .use(router.allowedMethods())

    return app
}

export default createKoaApp