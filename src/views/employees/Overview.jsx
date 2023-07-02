import { CForm, CRow, CCol, CFormInput, CFormSelect, CFormLabel, CButton, CTooltip } from '@coreui/react'
import PropTypes from 'prop-types'
import React, { Fragment, useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import FilterCard from 'src/components/FilterCard'
import FormButtons from 'src/components/FormButtons'
import Table from 'src/components/Table'
import { deleteEmployee, getEmployees, updateEmployee } from 'src/store/employee'
import AddEmployee from './components/AddEmployee'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import DeleteModal from 'src/components/DeleteModal'

export const Overview = ({ getEmployees, updateEmployee, deleteEmployee }) => {
  const { data, count } = useSelector(state => state.employee)
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({ offset: 0, limit: 10 })
  useEffect(() => {
    getEmployees(params)
    setLoading(false)
  }, [])
  const Actions = ({ id }) => {
    const [visible, setVisible] = useState(false)
    return (
      <Fragment>
        <CTooltip content='delete'>
          <CButton color="danger" onClick={(e) => setVisible(true)} >
            <CIcon icon={cilTrash} />
          </CButton>
        </CTooltip>
        <DeleteModal visible={visible} onClose={() => setVisible(false)} onDelete={() => deleteHandler(id)} />
      </Fragment>
    )
  }
  const columns = [{
    header: 'name',
    field: 'name',
    body: data => <span>{data.name}</span>
  },
  {
    header: 'role',
    field: 'role'
  },
  {
    header: 'email',
    field: 'email',
    edit: {
      inputType: 'text'
    }
  },
  {
    header: 'active',
    field: 'active',
    body: data => data.active?.toString(),
    edit: {
      inputType: 'dropdown',
      options: [{ value: true, name: 'true' }, { value: false, name: 'false' }]
    }
  },
  {
    header: 'mobile',
    field: 'mobile',
    edit: {
      inputType: 'text',
    }
  },
  ]
  const submitHandler = e => {
    e.preventDefault()
    const _params = ['key', 'role', 'active']
    let data = { ...params }
    setLoading(true)
    _params.map(param => {
      e.target[param].value && (data[param] = e.target[param].value)
    })
    setParams(data)
    Promise.all([getEmployees(data)]).then(() => setLoading(false))

  }
  const resetHandler = e => {
    e.target.reset()
    setParams({ offset: 0, limit: 10 })
  }
  const deleteHandler = async (id) => {
    await deleteEmployee(id)
    await getEmployees(params)
  }
  return (
    <>
      <AddEmployee onSuccess={getEmployees} params={params} />
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetHandler}>
          <CRow className='justify-content-center' xs={{ gutterY: 3 }}>
            <CCol xs={12}>
              <CFormInput placeholder='search by name, email or mobile number' id='key' />
            </CCol>
            <CCol xs='auto'>
              <CFormLabel htmlFor='active'>
                active
              </CFormLabel>
              <CFormSelect id='active'>
                <option value="true">true</option>
                <option value="false">false</option>
              </CFormSelect>

            </CCol>
            <CCol xs='auto'>
              <CFormLabel htmlFor='role'>
                role
              </CFormLabel>
              <CFormSelect id='role'>
                <option value="admin">admin</option>
                <option value="supervisor">supervisor</option>
                <option value="moderator">moderator</option>
                <option value="advisor">advisor</option>
              </CFormSelect>

            </CCol>
            <CCol xs={12}>
              <FormButtons />
            </CCol>
          </CRow>
        </CForm>
      </FilterCard>
      <Table
        data={data}
        columns={columns}
        cookieName='employees'
        count={count}
        loading={loading}
        updateLoading={setLoading}
        params={params}
        updateParams={setParams}
        changeData={getEmployees}
        editable
        editFn={updateEmployee}
        Actions={Actions}
      />
    </>
  )
}

Overview.propTypes = {
  getEmployees: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = { getEmployees, updateEmployee, deleteEmployee }

export default connect(mapStateToProps, mapDispatchToProps)(Overview)