import React, { FC } from 'react'
import { RequestLog } from '../../../types'
import { isValidJSON } from '../../../services/helpers'
import { CButton, CModal, CModalBody } from '@coreui/react'
import DisplayObject from '../../../components/DisplayObject'

const ResponseModal: FC<RequestLog> = (row) => {
  const [open, setIsOpen] = React.useState(false)
  return (
    isValidJSON(row?.response_body) && (
      <>
        <CButton size='sm' onClick={() => setIsOpen(true)}>
          show Details
        </CButton>
        <CModal alignment='center' visible={open} onClose={() => setIsOpen(false)} size='xl'>
          <CModalBody>
            <DisplayObject data={JSON.parse(row?.response_body)} />,
          </CModalBody>
        </CModal>
      </>
    )
  )
}

export default ResponseModal
