import express from 'express'
import AuthController from './auth.controller'
import AuthService from './auth.service'
import { TAuthCreateRoutes } from './auth.types'

export const createAuthRoutes: TAuthCreateRoutes = ({ authModel }) => {
  const router = express.Router()
  const authService = new AuthService({ authModel })
  const authController = new AuthController({ authService })

  router.post('/sign-up', authController.signUp)
  router.post('/log-in', authController.logIn)

  return router
}
