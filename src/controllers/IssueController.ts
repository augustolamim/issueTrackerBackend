import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

class IssueController {
  static async getAll (req: Request, res: Response): Promise<object> {
    try {
      const issues = await prisma.issue.findMany()

      return res.status(200).json({
        issues
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao carregar os dados.',
        stack: JSON.stringify(error.stack),
        local: 'issue.getAll'
      })
    }
  }

  static async store (req: Request, res: Response): Promise<object> {
    try {
      type issueStore = {
        title: string,
        version: string,
        description: string,
        issueDeveloperId: string,
        priority: string
      }
      const { title, version, description, issueDeveloperId, priority }:issueStore = req.body
      const userId:string = req.user.id
      const issue = await prisma.issue.create({
        data: {
          title,
          version,
          description,
          issueDeveloperId,
          priority,
          issueCreatorId: userId
        }
      })
      return res.status(200).json({
        issue
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao carregar os dados.',
        stack: JSON.stringify(error.stack),
        local: 'issue.store'
      })
    }
  }

  static async update (req: Request, res: Response): Promise<object> {
    try {
      type issueUpdate = {
        title?: string,
        version?: string,
        description?: string,
        issueDeveloperId?: string,
        priority?: string,
        status?: string
      }
      const userId:string = req.user.id
      const role:string = req.user.role
      const { title, version, description, issueDeveloperId, priority, status }:issueUpdate = req.body
      // Value passed through url becomes a string and needs to be casted as number
      const issueId:number = Number(req.params.issueId)
      const issue = await prisma.issue.findFirst({
        where: {
          id: issueId
        }
      })
      if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Requisição vazia é invalida.' })
      }
      if (!issue) {
        return res.status(400).json({ error: 'Problema não encontrado.' })
      }
      // only issuecreator can change fields other than status in a issue
      if (issue.issueCreatorId !== userId && (title || version || description || issueDeveloperId || priority)) {
        return res.status(403).json({ error: 'Não é autorizado.' })
      }
      // only the developer responsible for the issue can change its status to one of the allowed values, !=Aprovado && Reprovado
      if (role === 'Developer' && (issue.issueDeveloperId !== userId || ['Aprovado', 'Reprovado'].includes(status))) {
        return res.status(403).json({ error: 'Não é autorizado.' })
      }
      // scrum master and qa tester cant change status to the following fields unless they are the issueCreator
      if (['Scrum master', 'QA Tester'].includes(role) && (issue.issueCreatorId !== userId || ['Não será Removido', 'Duplicado', 'Não é erro', 'Resolvido'].includes(status))) {
        return res.status(403).json({ error: 'Não é autorizado.' })
      }

      const issueUpdated = await prisma.issue.update({
        where: {
          id: issue.id
        },
        data: {
          title,
          version,
          description,
          issueDeveloperId,
          priority,
          status
        }
      })
      return res.status(200).json({
        issueUpdated
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao atualizar os dados.',
        stack: JSON.stringify(error.stack),
        local: 'issue.update'
      })
    }
  }

  static async delete (req: Request, res: Response): Promise<object> {
    try {
      const idsToDelete:number[] = req.body.idsToDelete
      await prisma.issue.deleteMany({
        where: {
          id: {
            in: idsToDelete
          }
        }
      })

      return res.status(200).json({
        msg: 'Problemas Deletados com sucesso.'
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Ocorreu um erro ao deletar os dados.',
        stack: JSON.stringify(error.stack),
        local: 'issue.delete'
      })
    }
  }
}
export default IssueController
