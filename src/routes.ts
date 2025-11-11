import React, { lazy } from 'react'
const Summary = lazy(() => import('./views/finance/Summary'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Profile = React.lazy(() => import('./views/pages/profile/Profile'))
const AddProduct = React.lazy(() => import('./views/product/AddProduct'))
const Products = React.lazy(() => import('./views/product/Products'))
const UpdateProduct = React.lazy(() => import('./views/product/UpdateProducts'))
const Settings = React.lazy(() => import('./views/pages/settings/Settings'))
const PendingOrders = React.lazy(() => import('./views/orders/PendingOrders'))
const OrdersOverview = React.lazy(() => import('./views/orders/OrderOverview'))
const Pdf = React.lazy(() => import('./components/Pdf'))
const Statement = React.lazy(() => import('./views/finance/Statement'))
const Parent = React.lazy(() => import('./views/category/Parent'))
const Child = lazy(() => import('./views/category/Child'))
const Grandchild = lazy(() => import('./views/category/Grandchild'))
const UsersOverview = lazy(() => import('./views/users/UsersOverview'))
const Error404 = lazy(() => import('./views/pages/page404/Page404'))
const NewSellers = lazy(() => import('./views/store/NewStores'))
const SellersOverview = lazy(() => import('./views/store/OverviewStores'))
const PromoCodes = lazy(() => import('./views/promoCodes/PromoCodes'))
const PendingProducts = lazy(() => import('./views/product/PendingProducts'))
const ProductReviews = lazy(() => import('./views/product/ProductReviews'))
const Employees = lazy(() => import('./views/employees/Overview'))
const Log = lazy(() => import('./views/log/Log'))
const ConfigurationTypes = lazy(
  () =>
    import(
      './views/system-configuration/configuration-types/ConfigurationTypes'
    )
)
const ConfigurationValues = lazy(
  () =>
    import(
      './views/system-configuration/configuration-values/ConfigurationValues'
    )
)

const routes: {
  path: string
  exact?: boolean
  name: string
  component?: React.LazyExoticComponent<any>
  role?: string
}[] = [
  { path: '/', exact: true, name: 'Home' },
  { path: 'dashboard', name: 'Dashboard', component: Dashboard },
  { path: 'profile', name: 'Profile', component: Profile },
  { path: 'product', name: 'Products', component: Products, exact: true },
  { path: 'product/add', name: 'addProduct', component: AddProduct },
  { path: 'product/products', name: 'myProducts', component: Products },
  {
    path: 'product/updateProduct',
    name: 'updateProduct',
    component: UpdateProduct,
    role: 'storeOwner',
  },
  {
    path: 'product/pending',
    name: 'Pending Products',
    component: PendingProducts,
  },
  {
    path: 'product/reviews/:id',
    name: 'Products Reviews',
    component: ProductReviews,
  },
  { path: 'settings', name: 'Settings', component: Settings, exact: true },
  { path: 'order', name: 'Order', component: PendingOrders, exact: true },
  {
    path: 'order/pendingOrders',
    name: 'Pending Orders',
    component: PendingOrders,
  },
  {
    path: 'order/overview',
    name: 'Orders Overview',
    component: OrdersOverview,
  },
  { path: 'pdf/:locale/:id', name: 'pdf', component: Pdf },
  { path: 'finance', name: 'Finance', component: Statement },
  { path: 'finance/statement', name: 'Statements', component: Statement },
  { path: 'finance/summary', name: 'Summary', component: Summary },
  { path: 'category', name: 'Category', component: Parent },
  { path: 'category/parent', name: 'Parent', component: Parent },
  { path: 'category/child', name: 'Child', component: Child },
  { path: 'category/grandchild', name: 'Grandchild', component: Grandchild },
  { path: 'users', name: 'Users', component: UsersOverview },
  { path: 'users/overview', name: 'Users Overview', component: UsersOverview },
  {
    path: 'seller/overview',
    name: 'Sellers Overview',
    component: SellersOverview,
  },
  { path: 'seller/new', name: 'Users Overview', component: NewSellers },
  { path: 'seller', name: 'Sellers', component: SellersOverview },
  { path: 'promo', name: 'Promo Codes', component: PromoCodes },
  { path: 'employees', name: 'Employees', component: Employees },
  { path: 'log', name: 'System Log', component: Log },
  {
    path: 'system/config/types',
    name: 'Configuration Types',
    component: ConfigurationTypes,
  },
  {
    path: 'system/config/values',
    name: 'Configuration Values',
    component: ConfigurationValues,
  },
  { path: '*', name: 'Error 404', component: Error404 },
]

export default routes
