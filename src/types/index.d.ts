export type OrmResult = {
  error: number
  data: any
};

export type ServerHandlerResponse = {
  result: 'error' | 'warning' | 'success'
  message: string
  body: {
    email?: string
    url?: string
    stdErrMessage?: string
    token?: string
    errAuth?: boolean
    user?: User
    offer?: Offer
    campaign?: Campaign
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
  admin: 0 | 1
  email: string
  userAgent: string
  password: string
};

export type Campaign = {
  title: string
  status: 'active' | 'pause' | 'pending' | 'budget'
  link: string
  postback: string
  countries: string[]
  cost: number
  user_id: number
  budget: number
  ip_pattern: string[]
  white_list: string[]
  black_list: string[]
};

export type Offer = {
  id?: number
  status: 'verify' | 'pending' | 'warning'
  warning: string
  user_id: number
  title: string
  comment: string
  icon?: string
  image?: string
};

export interface HeadersMiddleware {
  uid: string
  xxemail: string
  name: string
  host: string
}
