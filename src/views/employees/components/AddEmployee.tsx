import React, { FormEvent, useState } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { addEmployee } from 'src/store/employee'
import { EmployeeType } from 'src/types'

const AddEmployee = () => {
  const [visible, setVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const closeModal = () => {
    setVisible(false)
    setDisabled(false)
  }
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params: string[] = ['email', 'password', 'first_name', 'last_name', 'role', 'mobile']
    const data: Omit<EmployeeType, 'verified'> = {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: '',
      mobile: '',
    }
    type PType = {
      email: HTMLInputElement
      password: HTMLInputElement
      first_name: HTMLInputElement
      last_name: HTMLInputElement
      role: HTMLSelectElement
      mobile: HTMLInputElement
    }
    const target = e.target as typeof e.target & PType
    params.forEach((param) => {
      target[param as keyof PType].value &&
        (data[param as keyof PType] = target[param as keyof PType].value)
    })
    addEmployee(data)
    closeModal()
  }
  return (
    <>
      <CButton onClick={() => setVisible(true)}>
        <CIcon icon={cilPlus} size="lg" />
        Add Employee
      </CButton>
      <CModal visible={visible} onClose={closeModal} alignment="center">
        <CModalHeader>
          <CModalTitle>Add Employee</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          <CRow xs={{ gutter: 3 }} className="justify-content-center m-1">
            <CCol xs={5}>
              <CFormInput placeholder="first name" id="first_name" required />
            </CCol>
            <CCol xs={5}>
              <CFormInput placeholder="last name" id="last_name" required />
            </CCol>
            <CCol xs={5}>
              <CFormInput placeholder="email" id="email" required />
            </CCol>
            <CCol xs={5}>
              <CFormInput placeholder="password" id="password" required />
            </CCol>
            <CCol xs={5}>
              <CFormInput placeholder="mobile" type="tel" id="mobile" required />
            </CCol>
            <CCol xs={5}>
              <CFormSelect id="role" onClick={() => setDisabled(true)} required>
                <option value="" disabled={disabled}>
                  select role
                </option>
                <option value="supervisor">supervisor</option>
                <option value="moderator">moderator</option>
                <option value="advisor">advisor</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CModalFooter>
            <CButton type="submit" color="primary">
              Submit
            </CButton>
            <CButton color="secondary" onClick={closeModal}>
              Close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default AddEmployee
