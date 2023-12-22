import { RequestHandler } from 'express'
import { HttpStatus } from '@/enums/httpStatus'
import { ICurrencyController, ICurrencyService } from './currency.interfaces'

export default class CurrencyController implements ICurrencyController {
  private readonly currencyService: ICurrencyService

  constructor ({ currencyService }: { currencyService: ICurrencyService }) {
    this.currencyService = currencyService
  }

  getAll: RequestHandler = async (request, response, next) => {
    try {
      const currencies = await this.currencyService.getAll()
      return response.status(HttpStatus.OK).json(currencies)
    } catch (error) {
      next()
    }
  }
}
