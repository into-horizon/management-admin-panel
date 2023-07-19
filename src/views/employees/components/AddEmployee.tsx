import React, { FormEvent, useState } from 'react'
import PropTypes from 'prop-types'
import { CButton, CCol, CForm, CModal, CModalFooter, CModalHeader, CModalTitle, CRow, CFormInput, CFormSelect, CFormLabel } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { addEmployee } from 'src/store/employee'
import { connect } from 'react-redux'
import { EmployeeType, ParamsType } from 'src/types'
type PropTypes = {
    addEmployee: (e: EmployeeType) => Promise<void>,
    onSuccess: (p: ParamsType) => Promise<void>,
    params: ParamsType
}
const AddEmployee = ({ addEmployee, onSuccess, params: _params }: PropTypes) => {
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const closeModal = () => {
        setVisible(false)
        setDisabled(false)
    }
    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const params: string[] = ['email', 'password', 'first_name', 'last_name', 'role', 'mobile']
        const data: EmployeeType = { email: '', password: '', first_name: '', last_name: '', role: '', mobile: '' }
        type PType = {
            email: HTMLInputElement,
            password: HTMLInputElement,
            first_name: HTMLInputElement,
            last_name: HTMLInputElement,
            role: HTMLSelectElement,
            mobile: HTMLInputElement
        }       
        const target = e.target as typeof e.target & PType
        params.forEach(param => {
            target[param as keyof PType].value && (data[param as keyof PType] = target[param as keyof PType] .value)
        })
        Promise.all([addEmployee(data)]).then(() => {
            onSuccess(_params)
            closeModal()
        })
    }
    return (
        <>
            <CButton onClick={() => setVisible(true)}>
                <CIcon icon={cilPlus} size='lg' />
                Add Employee
            </CButton>
            <CModal visible={visible} onClose={closeModal} alignment='center'>
                <CModalHeader>
                    <CModalTitle>
                        Add Employee
                    </CModalTitle>
                </CModalHeader>
                <CForm onSubmit={submitHandler}>
                    <CRow xs={{ gutter: 3 }} className='justify-content-center m-1'>
                        <CCol xs={5}>
                            <CFormInput placeholder='first name' id='first_name' required />
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='last name' id='last_name' required />
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='email' id='email' required />
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='password' id='password' required />
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='mobile' type='tel' id='mobile' required />
                        </CCol>
                        <CCol xs={5}>
                            <CFormSelect id='role' onClick={() => setDisabled(true)} required>
                                <option value="" disabled={disabled}>select role</option>
                                <option value="supervisor">supervisor</option>
                                <option value="moderator">moderator</option>
                                <option value="advisor">advisor</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CModalFooter>
                        <CButton type='submit' color='primary'>Submit</CButton>
                        <CButton color='secondary' onClick={closeModal}>Close</CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        </>
    )
}

AddEmployee.propTypes = {
    onSuccess: PropTypes.func,
    params: PropTypes.object
}
const mapDispatchToProps = { addEmployee }
export default connect(null, mapDispatchToProps)(AddEmployee)
