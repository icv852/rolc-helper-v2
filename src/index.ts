import logger from "./utils/logger"
import { PrismaClient } from "../generated/prisma"
import createKoaApp from "./app"
import http, { Server } from "http"
// import config from "./utils/config"
import { formatErrorLog } from "./utils/errors"
// import { PrismaClient } from "@prisma/client"
// import UserRepository from "./repositories/user"
// import AuthService from "./service"
import seed from "./utils/seed"

let server: Server

const PORT = 4000

const exitWithDelay = (exitCode: number): void => {
    setTimeout(() => {
        process.exit(exitCode)
    }, 200)
}

const gracefulShutdown = (): void => {
    if (server) {
        logger.info("Received termination signal. Server is shutting down...")
        server.close(() => {
            logger.info("All connections are ended. Server is shut down.")
            exitWithDelay(0)
        })
        setTimeout(() => {
            logger.error("Failed to close all connections in time. Server is shut down forcefully.")
            exitWithDelay(1)
        }, 10000)
    } else {
        logger.info("Received termination signal.")
        exitWithDelay(0)
    }
}

const main = async (): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        await seed(prisma)

        // const userRepository = new UserRepository(prisma)
        // const authService = new AuthService(userRepository)
        // const app = createKoaApp(authService)
        const app = createKoaApp()
        server = http.createServer(app.callback())

        server.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}.`)
        })
    } catch (e) {
        logger.fatal(formatErrorLog("Failed to start server.", e))
        
    }
}

process.on("uncaughtException", e => {
    logger.error(`Uncaught Exception: ${e}`)
    exitWithDelay(1)
})

process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise} Reason: ${reason}`)
    exitWithDelay(1)
})

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

main()