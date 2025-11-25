import React from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilReload } from '@coreui/icons'

const ErrorBoundaryPage: React.FC = () => {
  return (
    <div className='bg-light min-vh-100 d-flex flex-row align-items-center'>
      <CContainer>
        <CRow className='justify-content-center'>
          <CCol md={6}>
            <h1>Something went wrong!</h1>
            <p className='text-medium-emphasis'>
              The page you are looking for is temporarily unavailable, try
              reload the page, if the issue persists please contact the
              administrator.
            </p>
            <CButton color='info' onClick={() => window.location.reload()}>
              Reload
              <CIcon icon={cilReload} className='ms-2' />
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
export default ErrorBoundaryPage
