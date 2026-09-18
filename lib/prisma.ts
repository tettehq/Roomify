import * as PrismaClientPackage from "@prisma/client"

const PrismaClient = (PrismaClientPackage as typeof PrismaClientPackage & {
    PrismaClient: new (options?: { datasourceUrl?: string }) => PrismaClientInstance
}).PrismaClient

type PrismaClientInstance = InstanceType<
    typeof PrismaClientPackage extends { PrismaClient: infer T }
        ? T extends new (...args: any[]) => infer I
            ? new (...args: any[]) => I
            : never
        : never
>

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
})

export { prisma }