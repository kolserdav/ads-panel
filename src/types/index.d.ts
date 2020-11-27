/**
 * Заметка для новичка в Typescript
 * 
 * Файл глобальных типов, этот файл только для удобства разработки, в 
 * бандл из него ничего не попадает, так как тут нет значений. Только типы
 * перед использованием одних типов данных в разных файлах,
 * описываем тут их типы, чтобы Visual Studio подсказывал и подсвечивал.
 * 
 * Не особо заморачиватся с описанием типов, так как цель использование типов
 * это получение дополнительных возможностей, а не желание в них затеряться) типы типами, но
 * значения часто важнее, в плане, тех же подсказок.
 * 
 * И аннотации перед методами желательно везде писать, чтобы в любом месте, при наведении на
 * метод, разворачивалась информация с того места. И были Дополнительные подсказки при
 * его использовании.
 */

// Единая форма результатов запросов к базе, нужно проверять не равен ли error 1
export type OrmResult = {
  error: number
  data: any
  message: string
};

export type GraphStatisticParams = {
  self: 1 | 0
  time: Time
  customTime: Date[]
};

export type TableStatisticParams = {
  limit: number
  current: number
  group: GroupBy
  time: Time
  customTime: Date[]
  self: 1 | 0
  sort: OrderByVariants
  desc: boolean
  campaign: number | undefined
};

// Объект статистики, используется и для таблицы и для графика
export type TableStatistic = {
  date: Date
  campaign: number
  subid: string
  country: string
  requests: number
  impressions: number
  clicks: number
  cost: number
  win_ratio?: number
  ctr?: number
};

// Возможные варианты временного шаблона
export type Time = 'today' | 'yesterday' | 'last-3-days' | 'last-7-days' | 'this-month' | 'last-30-days' | 'last-month' | 'this-quarter' | 'this-year' | 'last-year' | 'custom';

// Возвращаемое значение функции lib.calculateTime
export type TimeCalculator = {
  time: Date
  range: string
};

// Объект возвращаемый на клиента
export type ServerHandlerResponse = {
  result: 'error' | 'warning' | 'success'
  message: string
  body: {
    table?: TableStatistic[]
    graph?: TableStatistic[]
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
    offers?: Offer[]
    campaign?: Campaign
    campaigns?: Campaign[]
    count?: number
    all?: any
    insertId?: number
    transactions?: Transaction[]
    group?: GroupBy
    desc?: boolean
    sort?: any
    limit?: number
    current?: number
  }
};

// Тип пользователя
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

// Возможные варианты группировок
export type GroupBy = 'date' | 'user' | 'campaign' | 'subid' | 'country';

// Тип объекта вебтокена
export type JWT = {
  id: number
  admin: 0 | 1
  email: string
  userAgent: string
  password: string
};

// Тип  статусов кампаний 
export type CampaignStatus = 'active' | 'pause' | 'pending' | 'budget';

// Тип модели кампания
export type Campaign = {
  id?: number
  title: string
  status: CampaignStatus
  link: string
  countries: string[]
  price: number
  user_id: number
  budget: number
  offer_id: number
  ip_pattern: string[]
  white_list: string[]
  black_list: string[]
};

// Статусы офферов
export type OfferStatus = 'verified' | 'pending' | 'warning';

// Тим модели оффер
export type Offer = {
  id?: number
  status: OfferStatus
  warning: string
  user_id: number
  title: string
  description: string
  icon?: string
  image?: string
  count?: number
};

export type OrderByVariants = 'id' | 'date' | 'campaign' | 'subid' | 'country' | 'requests' | 'impressions' | 'clicks' | 'cost';

export type Email = {
  from: string
  to: string
  subject: string
  text: string
  html: string
};

// Заголовки посредника, не реализованы, просто описаны тут для понимания
interface HeadersMiddleware {
  uid: string
  xxemail: string
  name: string
  host: string
  admin: '0' | '1'
}


export type Transaction = {
  amount: number
  user_id?: number
  date?: date
  comment: string
};

export type TransactionFilter = 'date' | 'user';
