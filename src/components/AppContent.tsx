import React, { useEffect, Suspense } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import cookie from 'react-cookies'
// routes config
import routes from '../routes'
import { useTranslation } from 'react-i18next'

const AppContent = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('translation', { keyPrefix: 'routes' })
  t('addProduct')
  useEffect(() => {
    let currentPath = cookie.load(`current_path${sessionStorage.tabID}`)
    navigate(currentPath)
    if (window.location.pathname === '/') {
      navigate('/dashboard')
    }
  }, [])
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color='primary' />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.component && <Route key={idx} path={route.path} element={<route.component />} />
            )
          })}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
