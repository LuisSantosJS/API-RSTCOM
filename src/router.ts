import express from 'express';
import UserController from './controllers/UserController'
import ListController from './controllers/ListController'
const routes = express.Router();

const userController = new UserController()
const listController = new ListController()


routes.get('/api/users', userController.index)
routes.post('/api/users', userController.create)
routes.put('/api/users', userController.update)
routes.post('/api/users/login', userController.login)
// routes.delete('/api/users', userController.deleteAll)

routes.get('/api/list/:userID', listController.index)
routes.put('/api/list', listController.update)
routes.post('/api/list', listController.create)
routes.delete('/api/list/:id', listController.delete)

export default routes;