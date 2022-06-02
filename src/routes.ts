
import { Router } from 'express'
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

const routes = Router()

// Api documentation
routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// routes with no authorization required
routes.post('/session', ValidateYup(Schemas.sessionStart), SessionController.store)
routes.post('/users', ValidateYup(Schemas.userStore), UserController.store)
routes.post('/session/refresh', ValidateYup(Schemas.sessionRefreshToken), SessionController.refresh)

routes.use(authMiddleware)
// routes for roles Scrum master || QA tester || Developer
routes.delete('/session', SessionController.logout)
routes.get('/issues', IssueController.getAll)
routes.put('/issues/:issueId', ValidateYup(Schemas.issueUpdate), IssueController.update)

routes.use(authQAtesterMiddleware)
// routes for roles Scrum master || QA tester
routes.get('/users', ValidateYup(Schemas.userQuery), UserController.getByRole)
routes.post('/issues', ValidateYup(Schemas.issueStore), IssueController.store)

routes.use(authScrumMasterMiddleware)
// routes for role Scrum master
routes.post('/issues/delete', ValidateYup(Schemas.issueDelete), IssueController.delete)

export default routes
