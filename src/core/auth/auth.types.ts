import { ILogIn, ISignUp, ITenant } from './auth.interfaces'

export type TAuthModelCreate = (signUpData: ISignUp) => Promise<ITenant>

export type TAuthServiceSignUp = (signUpData: ISignUp) => Promise<ITenant>
export type TAuthServiceLogIn = (logInData: ILogIn) => Promise<boolean>
