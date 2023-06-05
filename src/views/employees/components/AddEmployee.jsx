import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CButton, CCol, CForm, CModal, CModalFooter, CModalHeader, CModalTitle, CRow, CFormInput, CFormSelect, CFormLabel } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { addEmployee } from 'src/store/employee'
import { connect } from 'react-redux'
const AddEmployee = ({addEmployee, onSuccess, params: _params}) => {
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const closeModal = () => {
        setVisible(false)
        setDisabled(false)
    }
    const submitHandler = e => {
        e.preventDefault()
        console.log('right there');
        const params = ['email', 'password', 'first_name', 'last_name', 'role', 'mobile']
        const data = {}
        params.forEach(param => {
            e.target[param].value && (data[param] = e.target[param].value)
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
            <CModal visible={visible} onClose={closeModal}>
                <CModalHeader>
                    <CModalTitle>
                        Add Employee
                    </CModalTitle>
                </CModalHeader>
                <CForm onSubmit={submitHandler}>
                    <CRow xs={{ gutter: 3 }} className='justify-content-center'>
                        <CCol xs={5}>
                            <CFormInput placeholder='first name' id='first_name' required/>
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='last name' id='last_name' required/>
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='email' id='email' required/>
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='password' id='password' required/>
                        </CCol>
                        <CCol xs={5}>
                            <CFormInput placeholder='mobile' type='tel' id='mobile' required/>
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
const mapDispatchToProps = {addEmployee}
export default connect(null, mapDispatchToProps) (AddEmployee)
