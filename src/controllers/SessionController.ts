import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import GenerateRefreshToken from '../provider/GenerateRefreshToken'
import GenerateToken from '../provider/GenerateToken'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

class SessionController {
  static async store (req: Request, res:Response) : Promise<object> {
    try {
        type sessionStart = {
            nickname: string,
            password: string
          }
        const { nickname, password }:sessionStart = req.body
        const user = await prisma.user.findUnique({
          where: {
            nickname
          }
        })
        if (!user) {
          return res.status(400).json({ error: 'Usuário não encontrado.' })
        }

        if (!await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ error: 'Senha incorreta.' })
        }
        const id:string = user.id
        const role:string = user.role
        const generateToken = new GenerateToken()
        const token = await generateToken.execute(id, role)
        const generateRefreshToken = new GenerateRefreshToken()
        const refreshtoken = await generateRefreshToken.execute(id)
        return res.status(200).json({
          user: { id, nickname, token, refreshtoken }
        })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao gerar a autenticação.',
        stack: JSON.stringify(error.stack),
        local: 'session.store'
      })
    }
  }

  static async refresh (req: Request, res:Response) : Promise<object> {
    try {
      const refreshTokenId:string = req.body.refreshTokenId

      const refreshToken = await prisma.refreshToken.findUnique({
        where: {
          id: refreshTokenId
        },
        include: {
          user: true
        }
      })
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token invalído.' })
      }
      const id:string = refreshToken.user.id
      const role:string = refreshToken.user.role
      const expiresIn:number = refreshToken.expiresIn

      const generateToken = new GenerateToken()
      const token = await generateToken.execute(id, role)

      const refreshTokenExpires = dayjs().isAfter(dayjs.unix(expiresIn))
      if (refreshTokenExpires) {
        const generateRefreshToken = new GenerateRefreshToken()
        const newRefreshToken = await generateRefreshToken.execute(id)
        return res.status(200).json({
          token,
          newRefreshToken
        })
      }

      return res.status(200).json({
        token
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao gerar novo token.',
        stack: JSON.stringify(error.stack),
        local: 'session.refresh'
      })
    }
  }

  static async logout (req: Request, res: Response): Promise<object> {
    try {
      const userId:string = req.user.id
      await prisma.refreshToken.deleteMany({
        where: {
          userId
        }
      })

      return res.status(200).json({
        msg: 'Logout com sucesso.'
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao realizar o logout.',
        stack: JSON.stringify(error.stack),
        local: 'session.logout'
      })
    }
  }
}

export default SessionController
