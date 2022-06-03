import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import authConfig from '../config/auth'
// eslint-disable-next-line camelcase
import jwt_decode, { JwtPayload } from 'jwt-decode'

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(400).json({ error: 'Token não recebido.' })
  }

  const [, token] = authHeader.split(' ')

  try {
    jwt.verify(token, authConfig.secret)

    type customPayLoad = JwtPayload & { id: string, role: string };

    const decodedToken = jwt_decode<customPayLoad>(token)

    req.user = decodedToken

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' })
  }
}
