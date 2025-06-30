import { Prisma } from "@prisma/client";
import * as Koa from "koa"
import AuthService from "../services/auth-service";
import { PrismaClient } from "../../generated/prisma";

declare module "koa" {
    interface BaseContext {
        db: PrismaClient
    }
}