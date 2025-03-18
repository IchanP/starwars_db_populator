import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// TODO test shis
export const context = async () => {
    return { prisma };
};