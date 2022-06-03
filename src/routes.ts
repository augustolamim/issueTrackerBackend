
import { Router } from 'express'
import cors from 'cors'
import SessionController from './controllers/SessionController'
import UserController from './controllers/UserController'
import IssueController from './controllers/IssueController'

import { Schemas, ValidateYup } from './middleware/yup'
import authMiddleware from './middleware/auth'
import authScrumMasterMiddleware from './middleware/authScrumMaster'
import authQAtesterMiddleware from './middleware/authQAtester'

// swagger api documentation
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger.json'

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Authorization'
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'https://6299f1ce24c5bb61e8d2ac87--dapper-strudel-501778.netlify.app/',
  preflightContinue: false
}

const routes = Router()

routes.use(cors(options))
// Api documentation
routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// routes with no authorization required
routes.post('/session', ValidateYup(Schemas.sessionStart), SessionController.store)
routes.post('/users', ValidateYup(Schemas.userStore), UserController.store)
routes.post('/session/refresh', ValidateYup(Schemas.sessionRefreshToken), SessionController.refresh)

routes.use(authMiddleware)
// routes for roles Scrum master || QA tester || Developer
routes.delete('/session', SessionController.logout)
routes.get('/users', ValidateYup(Schemas.userQuery), UserController.getByRole)
routes.get('/issues', IssueController.getAll)
routes.put('/issues/:issueId', ValidateYup(Schemas.issueUpdate), IssueController.update)

routes.use(authQAtesterMiddleware)
// routes for roles Scrum master || QA tester

routes.post('/issues', ValidateYup(Schemas.issueStore), IssueController.store)

routes.use(authScrumMasterMiddleware)
// routes for role Scrum master
routes.post('/issues/delete', ValidateYup(Schemas.issueDelete), IssueController.delete)
routes.options('*', cors(options))

export default routes
