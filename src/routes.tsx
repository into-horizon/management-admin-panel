import React, { lazy } from 'react'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout'
import AuthLayout from './layout/AuthLayout'
import App from './App'
import ResetPassword from './views/pages/password/ResetPassword'
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

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Verify = React.lazy(() => import('./views/pages/verify/verify'))
const Reference = React.lazy(() => import('./views/pages/password/reference'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const routes: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: DefaultLayout,
        children: [
          { index: true, Component: () => <Navigate to='dashboard' /> },
          { path: 'dashboard', Component: Dashboard },
          { path: 'profile', Component: Profile },
          { path: 'settings', Component: Settings },
          {
            path: 'category',
            Component: Outlet,
            children: [
              { path: 'parent', Component: Parent },
              { path: 'child', Component: Child },
              { path: 'grandchild', Component: Grandchild },
            ],
          },
          {
            path: 'product',
            Component: Outlet,
            children: [
              { path: 'add', Component: AddProduct },
              { path: 'products', Component: Products },
              {
                path: 'updateProduct',
                Component: UpdateProduct,
              },
              {
                path: 'pending',
                Component: PendingProducts,
              },
              {
                path: 'reviews/:id',
                Component: ProductReviews,
              },
            ],
          },
          {
            path: 'order',
            Component: Outlet,
            children: [
              {
                path: 'pendingOrders',
                Component: PendingOrders,
              },
              {
                path: 'overview',
                Component: OrdersOverview,
              },
            ],
          },
          {
            path: 'finance',
            Component: Outlet,
            children: [
              { path: 'statement', Component: Statement },
              { path: 'summary', Component: Summary },
            ],
          },
          {
            path: 'users',
            Component: Outlet,
            children: [{ path: 'overview', Component: UsersOverview }],
          },
          {
            path: 'seller',
            Component: Outlet,
            children: [
              {
                path: 'overview',
                Component: SellersOverview,
              },
              { path: 'new', Component: NewSellers },
            ],
          },
          { path: 'promo', Component: PromoCodes },
          { path: 'employees', Component: Employees },
          { path: 'log', Component: Log },
          {
            path: 'system',
            Component: Outlet,
            children: [
              {
                path: 'config',
                Component: Outlet,
                children: [
                  {
                    path: 'types',
                    Component: ConfigurationTypes,
                  },

                  {
                    path: 'values',
                    Component: ConfigurationValues,
                  },
                ],
              },
            ],
          },
          { path: '*', Component: Error404 },
        ],
      },
      {
        path: '/',
        Component: AuthLayout,
        children: [
          { index: true, Component: () => <Navigate to={'login'} /> },
          { path: 'login', Component: Login },
          { path: 'reference', Component: Reference },
          { path: 'resetPassword/:token', Component: ResetPassword },
        ],
      },
    ],
  },
  { path: 'verify', Component: Verify },
  { path: '500', Component: Page500 },
]

export default routes
