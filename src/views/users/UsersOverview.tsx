import {
  CCol,
  CForm,
  CFormInput,
  CRow,
  CTooltip,
  CButton,
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import { FormEvent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getUsersHandler,
  updateProfileHandler,
  updateUserHandler,
  resetParams,
  updateParams,
} from '../../store/user'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilFilterX } from '@coreui/icons'
import EditableCell from '../../components/EditableCell'
import FilterCard from '../../components/FilterCard'
import Table, { ColumnType } from '../../components/Table'
import { InputType } from '../../enums'
import { RootState } from '../../store'
import { UserType, ParamsType } from '../../types'
import { updateParamsHelper } from '../../services/helpers'

const UsersOverview = () => {
  const { count, data, isLoading, params } = useSelector(
    (state: RootState) => state.user
  )
  const dispatch = useDispatch()

  const columns: ColumnType[] = [
    {
      header: 'first name',
      field: 'first_name',
      body: (data: UserType) => (
        <EditableCell
          data={data.profile}
          field='first_name'
          action={(data: UserType) => dispatch(updateProfileHandler(data))}
        />
      ),
    },
    {
      header: 'last name',
      field: 'last_name',
      body: (data: UserType) => (
        <EditableCell
          data={data.profile}
          field='last_name'
          action={(data: UserType) => dispatch(updateProfileHandler(data))}
        />
      ),
    },
    {
      header: 'email',
      field: 'email',
      edit: {
        inputType: InputType.EMAIL,
      },
    },
    {
      header: 'mobile number',
      field: 'mobile',
      edit: {
        inputType: InputType.PHONE,
      },
    },
    {
      header: 'account status',
      field: 'status',
      edit: {
        inputType: InputType.DROPDOWN,
        options: [
          { name: 'activate', value: 'active' },
          { name: 'ban', value: 'banned' },
        ],
      },
    },
    {
      header: 'verified',
      field: 'verified',
      body: (data: UserType) => data.verified.toString(),
      edit: {
        inputType: InputType.DROPDOWN,
        options: [
          { name: 'unverified', value: 'false' },
          { name: 'verified', value: 'true' },
        ],
      },
    },
  ]

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let data: ParamsType = {}
    type InputTypes = {
      query: HTMLInputElement
      status: HTMLSelectElement
      verified: HTMLSelectElement
    }
    const target = e.target as typeof e.target & InputTypes
    target.query.value && (data['query'] = target.query.value)
    target.status.value !== 'false' && (data['status'] = target.status.value)
    target.verified.value !== '' &&
      (data['verified'] = target.verified.value === 'true' ? true : false)

    dispatch(updateParams({ ...params, ...data }))
  }
  const resetTable = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & { reset(): void }
    target.reset()
    dispatch(resetParams())
  }

  function pageChangeHandler(page: number): void {
    dispatch(updateParams(updateParamsHelper(params, page)))
  }

  useEffect(() => {
    dispatch(getUsersHandler())
  }, [params])

  return (
    <>
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetTable}>
          <CRow xs={{ gutterY: 3 }} className='justify-content-center'>
            <CCol xs={12}>
              <CFormInput
                placeholder='search by first name, last name, mobile or email'
                id='query'
              />
            </CCol>
            <CCol xs='auto'>
              <CFormLabel htmlFor='status'>status</CFormLabel>
              <CFormSelect name='status' id='status'>
                <option value={'false'}>all</option>
                <option value='active'>active</option>
                <option value='banned'>banned</option>
                <option value='deactivated'>deactivated</option>
              </CFormSelect>
            </CCol>
            <CCol xs='auto'>
              <CFormLabel htmlFor='verified' id='verified'>
                verified
              </CFormLabel>
              <CFormSelect name='verified'>
                <option value=''>all</option>
                <option value={'true'}>verified</option>
                <option value={'false'}>unverified</option>
              </CFormSelect>
            </CCol>
            <CCol xs={12}></CCol>
          </CRow>
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
        </CForm>
      </FilterCard>
      <Table
        params={params}
        count={count}
        data={data}
        pageNumber={params.offset}
        pageSize={params.limit}
        onPageChange={pageChangeHandler}
        columns={columns}
        loading={isLoading}
        cookieName='users'
        editable
        editFn={updateUserHandler}
      />
    </>
  )
}
export default UsersOverview
