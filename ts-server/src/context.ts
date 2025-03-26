import { PrismaClient } from "@prisma/client";
import { MercuriusContext } from "mercurius";

export interface Context extends MercuriusContext {
  prisma: PrismaClient;
  redis: any;
}
