import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

class GenerateRefreshToken {
  async execute (userId: string) {
    const expiresIn = dayjs().add(15, 'days').unix()
    await prisma.refreshToken.deleteMany({
      where: {
        userId
      }
    })
    const generateRefreshToken = await prisma.refreshToken.create({
      data: {
        userId,
        expiresIn
      }
    })
    return generateRefreshToken
  }
}

export default GenerateRefreshToken
