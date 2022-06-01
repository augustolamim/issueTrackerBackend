import { Response, Request, NextFunction } from 'express'

export default async (req:Request, res:Response, next:NextFunction) => {
  if (req.user.role !== 'Scrum master') {
    return res.status(401).json({ error: 'Não autorizado.' })
  }

  next()
}
