import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CButton,
  CTooltip,
} from '@coreui/react'
import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEmployee from './components/AddEmployee'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import FilterCard from '../../components/FilterCard'
import FormButtons from '../../components/FormButtons'
import Table, { ColumnType } from '../../components/Table'
import { InputType } from '../../enums'
import { updateParamsHelper } from '../../services/helpers'
import { RootState } from '../../store'
import {
  getEmployees,
  setEmployeesParams,
  resetEmployeesParams,
  deleteEmployee,
  updateEmployee,
} from '../../store/employee'
import { EmployeeType, ParamsType } from '../../types'
import DeleteModal from '../../components/DeleteModal'

export const Overview = () => {
  const { data, count, params, loading } = useSelector((state: RootState) => state.employee)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getEmployees())
  }, [params])
  const Actions = ({ id }: EmployeeType) => {
    const [visible, setVisible] = useState(false)
    return (
      <Fragment>
        <CTooltip content='delete'>
          <CButton color='danger' onClick={(e) => setVisible(true)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </CTooltip>
        <DeleteModal
          visible={visible}
          onClose={() => setVisible(false)}
          onDelete={() => dispatch(deleteHandler(id!))}
        />
      </Fragment>
    )
  }
  const columns: ColumnType[] = [
    {
      header: 'name',
      field: 'name',
      body: (data: EmployeeType) => <span>{data.name}</span>,
    },
    {
      header: 'role',
      field: 'role',
    },
    {
      header: 'email',
      field: 'email',
      edit: {
        inputType: InputType.TEXT,
      },
    },
    {
      header: 'active',
      field: 'active',
      body: (data: EmployeeType) => data.active?.toString(),
      edit: {
        inputType: InputType.DROPDOWN,
        options: [
          { value: 'true', name: 'true' },
          { value: 'false', name: 'false' },
        ],
      },
    },
    {
      header: 'mobile',
      field: 'mobile',
      edit: {
        inputType: InputType.TEXT,
      },
    },
  ]
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const _params: string[] = ['key', 'role', 'active']
    type PType = {
      key?: HTMLInputElement
      role?: HTMLSelectElement
      active?: HTMLOptionElement
    }
    const target = e.target as typeof e.target & {
      key?: HTMLInputElement
      role?: HTMLSelectElement
      active?: HTMLSelectElement
    }
    let data: ParamsType & { key?: string; role?: string; active?: string } = {
      ...params,
    }
    _params.map((param: string) => {
      target[param as keyof PType]?.value &&
        (data[param as keyof PType] = target[param as keyof PType]?.value)
    })
    dispatch(setEmployeesParams(data))
    // dispatch(getEmployees())
  }
  const resetHandler = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & { reset(): void }
    target.reset()
    dispatch(resetEmployeesParams())
  }
  const deleteHandler = async (id: string) => {
    dispatch(deleteEmployee(id))
  }
  return (
    <>
      <AddEmployee />
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetHandler}>
          <CRow className='justify-content-center' xs={{ gutterY: 3 }}>
            <CCol xs={12}>
              <CFormInput placeholder='search by name, email or mobile number' id='key' />
            </CCol>
            <CCol xs='auto'>
              <CFormLabel htmlFor='active'>active</CFormLabel>
              <CFormSelect id='active'>
                <option value='true'>true</option>
                <option value='false'>false</option>
              </CFormSelect>
            </CCol>
            <CCol xs='auto'>
              <CFormLabel htmlFor='role'>role</CFormLabel>
              <CFormSelect id='role'>
                <option value=''>all</option>
                <option value='admin'>admin</option>
                <option value='supervisor'>supervisor</option>
                <option value='moderator'>moderator</option>
                <option value='advisor'>advisor</option>
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
        // updateLoading={setLoading}
        editable
        editFn={updateEmployee}
        Actions={Actions}
        onPageChange={(page) => setEmployeesParams(updateParamsHelper(params, page))}
      />
    </>
  )
}

export default Overview
