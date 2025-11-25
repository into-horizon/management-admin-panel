import React, { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './scss/style.scss'
import { checkServer } from './store/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Rings } from 'react-loader-spinner'
import 'react-select-search/style.css'
import { notificationsOffers } from './socket'
import GlobalDialog from './components/GlobalDialog'
import Toaster from './components/Toaster'
import { RootState } from './store'
import LoadingSpinner from './components/LoadingSpinner'
import { PopupProvider } from 'react-custom-popup'
import { load, remove, save } from 'react-cookies'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  notificationsOffers.on('welcome', (data) => {
    Notification.requestPermission().then((data) => {})
  })
  const { loading, isServerDown } = useSelector(
    (state: RootState) => state.login
  )
  const { i18n } = useTranslation()

  useEffect(() => {
    dispatch(checkServer())
  }, [dispatch])

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
      <LoadingSpinner>
        <Rings height='35rem' width='150' color='blue' />
      </LoadingSpinner>
    )
  }

  return (
    <Suspense
      fallback={
        <LoadingSpinner>
          <Rings height='35rem' width='150' color='blue' />
        </LoadingSpinner>
      }
    >
      <PopupProvider>
        {loading && (
          <LoadingSpinner>
            <Rings height='35rem' width='150' color='blue' />
          </LoadingSpinner>
        )}
        <React.Suspense fallback={<LoadingSpinner />}>
          <Toaster />
          <GlobalDialog />
          <Outlet />
        </React.Suspense>
      </PopupProvider>
    </Suspense>
  )
}

export default App
