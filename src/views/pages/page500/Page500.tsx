import React from 'react'
import { CButton, CCol, CContainer, CInputGroup, CRow } from '@coreui/react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../../store'

const Page500 = () => {
  const { isServerDown } = useSelector((state: RootState) => state.login)
  if (!isServerDown) {
    return <Navigate to={'/'} />
  }
  return (
    <div className='bg-light min-vh-100 d-flex flex-row align-items-center'>
      <CContainer>
        <CRow className='justify-content-center'>
          <CCol md={6}>
            <span className='clearfix'>
              <h1 className='float-start display-3 me-4'>500</h1>
              <h4 className='pt-3'>Internal Service Error!</h4>
              <p className='text-medium-emphasis float-start'>
                The page you are looking for is temporarily unavailable, try reload the page, if the
                issue persists please contact the administrator.
              </p>
            </span>
            <CInputGroup className='input-prepend'>
              <CButton color='info' onClick={() => window.location.reload()}>
                Reload
              </CButton>
              {/* <CInputGroupText>
                <CIcon icon={cilMagnifyingGlass} />
              </CInputGroupText>
              <CFormInput type="text" placeholder="What are you looking for?" /> */}
            </CInputGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page500
