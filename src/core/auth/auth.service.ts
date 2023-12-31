import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { GlobalEnv } from '@/constants'
import { JwtExpireTime } from '@/enums/expireTime'
import { ErrorServerMessages } from '@/enums/errors'
import { WrongCredentialsError } from '@/errors/WrongCredentials'
import { MissingCredentialsError } from '@/errors/MissingCredentials'
import { getMissingCredentials } from '@/utils/getMissingsCredentials'
import { IAuthModel, IAuthService } from './auth.interfaces'
import { AuthServiceConstructor, AuthServiceGetUserTokens, AuthServiceLogIn, AuthServiceRefreshTokens, AuthServiceSignUp } from './auth.types'
import { IUsersModel } from '../users/users.interfaces'

type JwtPayload = {
  id: string
  username: string
}

export default class AuthService implements IAuthService {
  private readonly authModel: IAuthModel
  private readonly usersModel: IUsersModel

  constructor ({ authModel, usersModel }: AuthServiceConstructor) {
    this.authModel = authModel
    this.usersModel = usersModel
  }

  signUp: AuthServiceSignUp = async (signUpData) => {
    const credentials: string[] = ['tenantName', 'username', 'firstname', 'lastname', 'password']
    const missingCredentials = getMissingCredentials(credentials, signUpData)

    if (missingCredentials.length > 0) {
      throw new MissingCredentialsError(ErrorServerMessages.MissingCredentials, missingCredentials)
    }

    const rounds = 10
    const hashedPassword = await bcrypt.hash(signUpData.password, rounds)

    const tenant = await this.authModel.create({
      ...signUpData,
      password: hashedPassword
    })

    return tenant
  }

  logIn: AuthServiceLogIn = async (logInData) => {
    const credentials: string[] = ['username', 'password']
    const missingCredentials = getMissingCredentials(credentials, logInData)

    if (missingCredentials.length > 0) {
      throw new MissingCredentialsError(ErrorServerMessages.MissingCredentials, missingCredentials)
    }

    const foundUser = await this.usersModel.getOneByUsername(logInData.username)
    if (!foundUser) throw new WrongCredentialsError(ErrorServerMessages.WrongCredentials)

    const validPassword: boolean = await bcrypt.compare(logInData.password, foundUser.password)
    if (!validPassword) throw new WrongCredentialsError(ErrorServerMessages.WrongCredentials)

    const tokens = await this.getUserTokens(foundUser)

    return tokens
  }

  getRefreshTokens: AuthServiceRefreshTokens = async (oldRefreshToken) => {
    const decodedToken = jwt.verify(oldRefreshToken, GlobalEnv.REFRESH_TOKEN_SECRET)
    const userId = (decodedToken as JwtPayload).id
    const foundUser = this.usersModel.getOneById(userId)
    const tokens = await this.getUserTokens(foundUser)

    return tokens
  }

  getUserTokens: AuthServiceGetUserTokens = async (user) => {
    const userForToken = {
      id: user.id,
      username: user.username
    }

    const accessToken = jwt.sign(userForToken, GlobalEnv.ACCESS_TOKEN_SECRET, { expiresIn: JwtExpireTime.AccessToken })
    const refreshToken = jwt.sign(userForToken, GlobalEnv.REFRESH_TOKEN_SECRET, { expiresIn: JwtExpireTime.RefreshToken })

    return {
      accessToken,
      refreshToken
    }
  }
}
