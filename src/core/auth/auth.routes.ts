import express from 'express'
import authController from './auth.controller'

const router = express.Router()

router.post('/sign-up', authController.signUp)

export default router
