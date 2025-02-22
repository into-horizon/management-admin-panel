import React, { Children, FC } from 'react'

import { CCol, CFormInput, CFormSelect, CRow } from '@coreui/react'
import { InputType } from '../enums'

type PropTypes = {
  type: InputType
  options?: { name: string; value: string }[]
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  value: string
  id: string
}
const TableEditCell: FC<PropTypes> = ({ type = 'text', options = [], onChange, value, id }) => {
  return (
    <React.Fragment>
      <CRow className='align-items-center justify-content-center'>
        <CCol xs='auto'>
          {type === 'dropdown' ? (
            <CFormSelect value={value} onChange={onChange} id={id}>
              {Children.toArray(
                options.map((option) => <option value={option.value}>{option.name}</option>),
              )}
            </CFormSelect>
          ) : (
            <CFormInput value={value} type={type} onChange={onChange} id={id} />
          )}
        </CCol>
      </CRow>
    </React.Fragment>
  )
}

export default TableEditCell
