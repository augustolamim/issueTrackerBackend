import { NextFunction, Request, Response } from 'express'
import { AnyObjectSchema, object, string, array, number } from 'yup'

export const ValidateYup = (schema: AnyObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        await schema.validate(req.query)
        return next()
      } else {
        await schema.validate(req.body)

        return next()
      }
    } catch {
      return res.status(400).json({ error: 'Requisição inválida.' })
    }
  }
}

export const Schemas = {
  sessionStart: object().shape({
    nickname: string().required(),
    password: string().required()
  }),
  sessionRefreshToken: object().shape({
    refreshTokenId: string().required()
  }),
  userStore: object().shape({
    nickname: string().required(),
    password: string().required(),
    role: string().oneOf(['Scrum master', 'QA Tester', 'Developer']).required()
  }),
  userQuery: object().shape({
    role: string().required()
  }),
  issueDelete: object().shape({
    idsToDelete: array().of(number()).required()
  }),
  issueStore: object().shape({
    title: string().required(),
    version: string().required(),
    description: string().required(),
    issueDeveloperId: string().required(),
    priority: string().oneOf(['Baixa', 'Normal', 'Alta']).required()
  }),
  issueUpdate: object().shape({
    title: string(),
    version: string(),
    description: string(),
    issueDeveloperId: string(),
    priority: string().oneOf(['Baixa', 'Normal', 'Alta']),
    status: string().oneOf(['Aprovado', 'Reprovado', 'Não será Removido', 'Duplicado', 'Não é erro', 'Resolvido'])
  })
}
