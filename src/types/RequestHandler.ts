import { Request, Response, NextFunction } from 'express'

export type RequestHandler = (request: Request, response: Response, next: NextFunction) => void
