import { PrismaClient } from "@prisma/client"
import { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge"

export const prisma = new PrismaClient()
export const prismaEdge = new PrismaEdgeClient()