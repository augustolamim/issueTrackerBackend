import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import GenerateRefreshToken from '../provider/GenerateRefreshToken'
import GenerateToken from '../provider/GenerateToken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

class UserController {
  static async store (req: Request, res: Response): Promise<object> {
    try {
        type userStore = {
            nickname: string,
            password: string,
            role: string
          }
        const { nickname, password, role }:userStore = req.body

        const user = await prisma.user.findUnique({
          where: {
            nickname
          }
        })
        if (user) {
          return res.status(400).json({ error: 'Usuário já existe.' })
        }
        const passwordHash:string = await bcrypt.hash(password, 8)

        const newUser = await prisma.user.create({
          data: {
            nickname,
            password: passwordHash,
            role
          }
        })
        const id:string = newUser.id

        const generateToken = new GenerateToken()
        const token = await generateToken.execute(id, role)
        const generateRefreshToken = new GenerateRefreshToken()
        const refreshtoken = await generateRefreshToken.execute(id)

        return res.status(200).json({
          user: { id, nickname, role, token, refreshtoken }
        })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao salvar os dados.',
        stack: JSON.stringify(error.stack),
        local: 'users.store'
      })
    }
  }

  static async getByRole (req: Request, res: Response): Promise<object> {
    try {
      const role:string = req.query.role as string
      const users = await prisma.user.findMany({
        where: {
          role
        },
        select: {
          id: true,
          nickname: true,
          role: true
        }
      })

      return res.status(200).json({
        users
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao carregar os dados.',
        stack: JSON.stringify(error.stack),
        local: 'users.getByRole'
      })
    }
  }
}
export default UserController
