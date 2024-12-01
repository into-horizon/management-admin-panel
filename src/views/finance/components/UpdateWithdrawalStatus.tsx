import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateWithdrawalHandler } from 'src/store/withdrawal'
import { WithdrawalType } from 'src/types'
import {
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CFormLabel,
  CModal,
  CTooltip,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilX, cilFile } from '@coreui/icons'

const UpdateWithdrawalStatus = (data: WithdrawalType) => {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState<string | null>('')
  const [reason, setReason] = useState<string | null>('')
  const [file, setFile] = useState<File | null>(null)
  const dispatch = useDispatch()
  const updateType = (t: string) => {
    setType(t)
    setVisible(true)
  }
  useEffect(() => {
    console.log({ file })
  }, [file])
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      rejection_reason_other: { value: string }
      rejection_reason: { value: string }
      document: { files: Blob[] }
      reset: () => void
    }

    let formData = new FormData()
    let _data = {
      ...data,
      status: type === 'accept' ? 'transferred' : 'rejected',
      rejection_reason: reason
        ? reason === 'other'
          ? target.rejection_reason_other.value
          : target.rejection_reason.value
        : null,
      document: target.document?.files[0],
    }
    Object.entries(_data).forEach(([key, value]) => {
      if (typeof value === 'number') {
        value = String(value)
      }
      value && formData.append(key, value)
    })
    e.preventDefault()
    dispatch(updateWithdrawalHandler(formData))
  }
  return (
    <>
      <CTooltip content='accept'>
        <CButton color='success' onClick={() => updateType('accept')}>
          <CIcon icon={cilCheck} />
        </CButton>
      </CTooltip>
      <CTooltip content='reject'>
        <CButton color='danger' onClick={() => updateType('reject')}>
          <CIcon icon={cilX} />
        </CButton>
      </CTooltip>
      <CModal visible={visible} alignment='center' onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update withdrawal</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          <CRow className='justify-content-center align-items-center'>
            <CCol xs='auto ' className='file-label'>
              {type === 'accept' && (
                <>
                  <CFormLabel
                    style={{ margin: 'auto' }}
                    htmlFor='document'
                    className='btn btn-primary'
                  >
                    {' '}
                    <CIcon icon={cilFile} size='lg' />
                    upload document
                  </CFormLabel>
                  <CFormInput
                    name='document'
                    id='document'
                    type='file'
                    hidden
                    accept='.jpeg, .png, .pdf'
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  />

                  <CFormInput
                    value={file?.name ? file?.name : ''}
                    readOnly
                    placeholder='file name'
                  />
                </>
              )}
              {type === 'reject' && (
                <>
                  <CFormLabel htmlFor='rejection'>rejection reason</CFormLabel>
                  <CFormSelect
                    id='rejection_reason'
                    onChange={(e) => setReason(e.target.value)}
                    defaultValue={'invalid amount'}
                  >
                    <option value='invalid amount'>invalid amount</option>
                    <option value='incorrect bank details'>incorrect bank details</option>
                    <option value='other'>other</option>
                  </CFormSelect>
                  {reason === 'other' && (
                    <CFormInput
                      placeholder='enter reason'
                      id='rejection_reason_other'
                      required
                    ></CFormInput>
                  )}
                </>
              )}
            </CCol>
          </CRow>
          <CModalFooter>
            <CButton color='primary' type='submit'>
              submit
            </CButton>
            <CButton color='secondary' onClick={() => setVisible(false)}>
              close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default UpdateWithdrawalStatus
