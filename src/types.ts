export type profileType = {
  id: string
  first_name: string
  last_name: string
}

export type UserType = {
  id?: string
  role: string
  active?: boolean
  mobile: string
  created_at?: string
  verified: boolean
  profile: profileType
}
export type AuthStateType = {
  loggedIn: boolean
  user: EmployeeType
  message: string
  loading: boolean
  isServerDown: boolean
}

export type AccountType = {
  id?: string
  title: string
  type: string
  courier_id?: string
  store_id?: string
  reference: string
  display?: boolean
  created_at?: string
}
export type BankAccountStateType = {
  msg: string
  account: AccountType
  cashAccount: AccountType
}

export type ParentCategoriesType = {
  id: string
  entitle: string
  artitle: string
  metatitle?: string
  content?: string
  display: boolean
  created_at: string
  children: ChildAndGrandCategoriesType[]
  products_count: string | number
}
export type ChildAndGrandCategoriesType = ParentCategoriesType & {
  parent_id: string
  p_entitle: string
  p_artitle: string
  parent_category?: ParentCategoriesType
  child_category?: ParentCategoriesType
}
export type CategoriesStateType = {
  parentCategories: { data: ParentCategoriesType[]; count: number }
  childCategories: { data: ChildAndGrandCategoriesType[]; count: number }
  grandChildCategories: { data: ChildAndGrandCategoriesType[]; count: number }
  isLoading: boolean
  isProgressing: boolean
  parentParams: ParamsType
  childParams: ParamsType
  grandchildParams: ParamsType
  categories: ParentCategoriesType[]
}

export type DiscountCodeType = {
  id?: string
  discount_code: string
  expiry_date: string
  min_order_amount?: number
  max_counter: number
  discount: number
  max_discount: number
  number_of_time: number
  created_at?: string
  active: boolean
}

export type DiscountCodeStateType = {
  data: DiscountCodeType[]
  count: number
}

export type EmployeeType = Omit<UserType, 'profile'> & {
  name?: string
  email?: string
  password?: string
  first_name: string
  last_name: string
}

export type EmployeeStateType = {
  data: EmployeeType[]
  count: number
  params: ParamsType
  loading: boolean
}

export type FilterStateType = {
  store?: { title: string; id: string }
  duration: string
}
export type TransactionType = {
  id: string
  store_id: string
  courier_id: string
  amount: number
  order_id?: string
  order_item_id?: string
  status: string
  type: string
  withdrawal_id?: string
  description?: string
  entitle?: string
  artitle?: string
  created_at: string
}
export type FinanceStateType = {
  transactions: { data: TransactionType[]; count: number }
  message: string
  pending: number
  refunded: number
  released: number
  transferred: number
  withdrawn: number
  canceledWithdrawn: number
  commission: number
  delivery: number
}

export type DialogStateType = {
  message: string
  status: number
  type: string
  title: string
}

export type ToastStateType = {
  message: string
  status: number
  type: string
}
export type OrderItemType = {
  id: string
  order_id: string
  profile_id: string
  product_id: string
  store_id: string
  size: string | null
  color: string | null
  price: number
  discount: number
  quantity: number
  price_after: number
  status: string
  cancellation_reason: string | null
  last_update: string | null
  date_after_day: string
  rated: boolean
  created_at: string
  entitle: string
  artitle: string
  p_price: number
  store_name: string
  picture: string
}
export type OrderType = {
  id: string
  customer_order_id: string
  profile_id: string
  address_id: string
  status: string
  tax: number | null
  discount_id: number | null
  sub_total: number
  created_at: string
  payment_method: string
  delivey_date: string | null
  updated: string
  delivery_date: string
  grand_total: number
  shipping: number
  first_name: string
  last_name: string
  address?: {
    id: string
    profile_id: string
    store_id: string
    country: string
    city: string
    first_name: string
    last_name: string
    mobile: '0798257891'
    street_name: string
    building_number: string
    apartment_number: string
    display: boolean
    is_default: boolean
    store_address: boolean
    region: string
    lat: number | string | null
    lng: number | string | null
  }
  items: OrderItemType[]
}
export type OrdersStateType = {
  pendingOrders: { data: OrderType[]; count: number }
  ordersOverview: { data: OrderType[]; count: number }
  messages: string
  statuses: string[]
}

export type ProductPictureType = {
  id?: string
  product_id?: string
  product_picture: string
}
export type ProductType = {
  id: string
  store_id: string
  entitle: string
  artitle: string
  metatitle?: string
  sku?: string
  parent_category_id: string
  child_category_id: string
  grandchild_category_id: string | null
  discount: boolean
  discount_rate: number
  price: number
  currency: string
  brand_name: string | null
  endescription: string
  ardescription: string
  quantity: number
  status: string
  age: string | null
  size_and_color: string | null
  display: boolean
  created_at: string
  rejection_reason?: string | null
  commission: number
  is_commission_included: boolean
  store_name: string
  p_entitle: string
  p_artitle: string
  c_entitle: string
  c_artitle: string
  g_entitle: string | null
  g_artitle: string | null
  rate: number | null
  pictures: ProductPictureType[]
}

export type ReviewType = {
  id: string
  review: string
  rate: number
  order_item_id: string
  created_at: string
  first_name: string
  last_name: string
  profile_picture?: string
}
export type ProductStateType = {
  pending: { data: ProductType[]; count: number }
  overview: { data: ProductType[]; count: number }
  searched: ProductType
  reviews: { data: ReviewType[]; count: number }
  isLoading: boolean
  isUpdating: boolean
  pendingParams: ParamsType
  overviewParams: ParamsType & { status: 'approved' | 'pending' | 'rejected' }
}

export type StoreType = {
  id: string
  profile_id: string
  store_name: string
  name_is_changed: boolean
  city: string
  caption: string
  about: string
  mobile: string
  store_picture: string
  status: string
  rejected_reason: string | null
  verified_email: boolean
  performance_rate: number
  sales_rate: number
  created_at: string
  store_rating: number
  verification_code: string | null
}

export type StoreStateType = {
  pending: { data: StoreType[]; count: number }
  overview: { data: StoreType[]; count: number }
  searched: []
  populatedStore: { title?: string; id?: string }
}

export type CustomerType = {
  id: string
  email: string
  mobile: string
  verified: boolean
  status: string
  created_at: string
  profile_id: string
  first_name: string
  last_name: string
  city: string
  country: string
}

export type UserStateType = {
  data: CustomerType[]
  count: number
}

export type WithdrawalType = {
  id: string
  account_id: string
  courier_id: string | null
  store_id: string
  amount: number
  type: string
  status: string
  updated: string | null
  document: string | null
  created_at: string
  account_type?: string
  rejection_reason?: string | null
  title?: string
  reference?: string
}

export type WithdrawalStateType = {
  data: WithdrawalType[]
  count: number
}

export type ParamsType = {
  limit?: number
  offset?: number
} & Record<string, any>

export type GetFunctionType = (p: ParamsType) => Promise<void>

export type QuantityDetailsType = {
  color: string | null
  size: string | null
  quantity: number
  id: number | string
  idx?: number
}

export type DashboardStateType = {
  stores: number
  products: number
  itemsSold: number
  orderPlaced: number
  users: number
  ratedStores: {
    id: string
    store_name: string
    store_rating: number
    store_picture: string
  }[]
  isDashboardLoading: boolean
}

export type NotificationType = {
  id: string
  text: string
  seen: boolean
  seen_by: string
  item_id: string
  created_at: string
  product_title?: string
  order_number?: string
  store_name?: string
  order_item_title?: string
  role: string
  type: string
}

export interface UserResponse {
  data: UserType[]
  count: number
}

export type RequestLog = {
  id: string
  method: string
  request_body: string
  response_body: string
  status: number
  created_at: string
  url: string
  profile: profileType
  employee: EmployeeType
  query: ParamsType
}

export type ListResponse<T> = {
  data: T[]
  count: number
}

export interface ConfigurationType {
  id: string
  name: string
  displayName?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type PostConfigurationType = Omit<
  ConfigurationType,
  'id' | 'createdAt' | 'updateAt' | 'isActive'
>
