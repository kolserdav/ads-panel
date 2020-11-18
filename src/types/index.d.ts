export type OrmResult = {
  error: number
  data: any
};

export type ServerHandlerResponse = {
  result: 'error' | 'warning' | 'success'
  message: string
  body: {
    require?: any
    received?: any
    email?: string
    url?: string
    stdErrMessage?: string
    token?: string
    errAuth?: boolean
    errRole?: boolean
    user?: User
    offer?: Offer
    campaign?: Campaign
    campaigns?: Campaign[]
    count?: number
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

export type CampaignStatus = 'active' | 'pause' | 'pending' | 'budget';

export type Campaign = {
  title: string
  status: CampaignStatus
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

export type OfferStatus = 'verified' | 'pending' | 'warning';

export type Offer = {
  id?: number
  status: OfferStatus
  warning: string
  user_id: number
  title: string
  description: string
  icon?: string
  image?: string
};

export interface HeadersMiddleware {
  uid: string
  xxemail: string
  name: string
  host: string
}
