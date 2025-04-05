import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './scss/style.scss'
import { checkServer } from './store/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Rings } from 'react-loader-spinner'
import 'react-select-search/style.css'
import { notificationsOffers } from './socket'
import GlobalDialog from './components/GlobalDialog'
import Toaster from './components/Toaster'
import { CCol, CContainer, CRow } from '@coreui/react'
import { RootState } from './store'
import { EventEmitter } from 'events'
import LoadingSpinner from './components/LoadingSpinner'
import { PopupProvider } from 'react-custom-popup'
import routes from './routes'
import AuthLayout from './layout/AuthLayout'
import { load, remove, save } from 'react-cookies'
export const events = new EventEmitter()

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Verify = React.lazy(() => import('./views/pages/verify/verify'))
const Reference = React.lazy(() => import('./views/pages/password/reference'))
const ResetPassword = React.lazy(() => import('./views/pages/password/ResetPassword'))

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  notificationsOffers.on('welcome', (data) => {
    Notification.requestPermission().then((data) => {
      // console.log({ data });
      // new Notification(data)
    })
  })
  const { loading, isServerDown } = useSelector((state: RootState) => state.login)
  const { i18n } = useTranslation()

  useEffect(() => {
    dispatch(checkServer())
  }, [])

  useEffect(() => {
    if (i18n.language === 'en') {
      document.documentElement.setAttribute('lang', 'en')
      document.documentElement.setAttribute('dir', 'ltl')
    } else if (i18n.language === 'ar') {
      document.documentElement.setAttribute('lang', 'ar')
      document.documentElement.setAttribute('dir', 'rtl')
    }
  }, [i18n.language])

  useEffect(() => {
    if (isServerDown) {
      if (pathname !== '/500') {
        save('redirect', pathname, { path: '/' })
      }
      navigate('/500')
    } else if (!isServerDown && load('redirect')) {
      navigate(load('redirect'))
      remove('redirect', { path: '/' })
    }
  }, [isServerDown])

  if (loading) {
    return (
      <div className='bg-light min-vh-100 d-flex flex-row align-items-center'>
        <CContainer>
          <CRow className='justify-content-center'>
            <CCol xs='auto'>
              <Rings height='35rem' width='150' color='blue' />
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
  return (
    <PopupProvider>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Toaster />
        <GlobalDialog />
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Navigate to={'login'} />} />
            <Route path='login' element={<Login />} />
            <Route path='reference' element={<Reference />} />
            <Route path='resetPassword/:token' element={<ResetPassword />} />
          </Route>
          <Route path='/' element={<DefaultLayout />}>
            <Route index element={<Navigate to={'dashboard'} />} />
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route key={idx} path={route.path} element={<route.component />} />
                )
              )
            })}
          </Route>
          <Route path='/verify' element={<Verify />} />
          <Route path='/500' element={<Page500 />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </React.Suspense>
    </PopupProvider>
  )
}

export default App
