import React from 'react'
import { CTooltip, CButton, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilFilterX } from '@coreui/icons'

const FormButtons = () => {
  return (
    <CRow className='justify-content-center'>
      <CCol xs='auto'>
        <CTooltip content='search'>
          <CButton type='submit'>
            <CIcon icon={cilSearch} />
          </CButton>
        </CTooltip>
      </CCol>
      <CCol xs='auto'>
        <CTooltip content='clear filter'>
          <CButton color='secondary' type='reset'>
            <CIcon icon={cilFilterX} />
          </CButton>
        </CTooltip>
      </CCol>
    </CRow>
  )
}

export default FormButtons
