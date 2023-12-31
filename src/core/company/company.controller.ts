import { RequestHandler } from 'express'
import { HttpStatus } from '@/enums/httpStatus'
import { ICompanyController, ICompanyService } from './company.interface'
import { CompanyControllerConstructor } from './company.types'

export default class CompanyController implements ICompanyController {
  private readonly companyService: ICompanyService

  constructor ({ companyService }: CompanyControllerConstructor) {
    this.companyService = companyService
  }

  getAll: RequestHandler = async (request, response, next) => {
    try {
      const companies = await this.companyService.getAll()
      return response.status(HttpStatus.OK).json(companies)
    } catch (error) {
      next(error)
    }
  }
}
