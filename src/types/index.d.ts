export type OrmResult = {
  error: number
  data: any
};

export type ServerHandlerResponse = {
  result: 'error' | 'warning' | 'success'
  message: string
  body: {
    email?: string
    stdErrMessage?: string
    token?: string
    errAuth?: boolean
  }
};

export type User = {
  id?: number
  confirm?: 0 | 1
  admin?: 0 | 1
  first_name: string
  last_name: string
  email: string
  password: string
  company: string
  skype: string
  created?: Date
  updated: Date
};


export type JWT = {
  id: number
  email: string
  userAgent: string
  password: string
};

export interface HeadersMiddleware {
  uid: string
  xxemail: string
  name: string
  host: string
}
