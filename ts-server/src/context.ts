import { Prisma, PrismaClient } from "@prisma/client";
import { MercuriusContext } from "mercurius";
import { Redis } from "ioredis"

export interface Context extends MercuriusContext {
  prisma: PrismaClient;
  redis: Redis;
}