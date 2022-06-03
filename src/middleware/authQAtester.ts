import { Response, Request, NextFunction } from 'express'

export default async (req:Request, res:Response, next:NextFunction) => {
  if (!['Scrum master', 'QA Tester'].includes(req.user.role)) {
    return res.status(400).json({ error: 'Não autorizado.' })
  }

  next()
}
