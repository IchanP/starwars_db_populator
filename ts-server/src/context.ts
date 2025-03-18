import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
}

const prisma: PrismaClient = new PrismaClient();

export const context: Context = {
  prisma,
};
