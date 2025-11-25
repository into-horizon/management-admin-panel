import { CRow, CCol, CSpinner, CContainer } from '@coreui/react'
import { createPortal } from 'react-dom'
function LoadingSpinner({ children }: { children?: React.ReactNode }) {
  return createPortal(
    <CContainer
      fluid
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100dvw',
        height: '100dvh',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 1000000,
      }}
    >
      <CRow className='align-items-center justify-content-center my-3 w-100 h-100'>
        <CCol xs={12} className='text-center d-flex justify-content-center'>
          {children ?? <CSpinner color='primary' className='lg-spinner' />}
        </CCol>
      </CRow>
    </CContainer>,
    document.body
  )
}

export default LoadingSpinner
