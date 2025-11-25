import { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useSelectorWithType } from '../../../store'
import { useDispatch } from 'react-redux'
import {
  deleteConfigurationValue,
  getConfigurationValues,
  resetConfigurationValueParams,
  setConfigurationParamsValue,
  updateConfigurationValue,
} from '../../../store/configurationValue.slice'
import { ConfigurationValueType } from '../../../types'
import AddConfigurationValue from './components/AddConfigurationValue'
import { CButton, CCol, CForm, CFormInput, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import DeleteModal from '../../../components/DeleteModal'
import FilterCard from '../../../components/FilterCard'
import FormButtons from '../../../components/FormButtons'
import { InputType } from '../../../enums'
import ConfigurationTypeAutocomplete from './components/ConfigurationTypeAutocomplete'
import ConfigurationValueAutocomplete from './components/ConfigurationValueAutocomplete'
import useKeyGenerator from '../../../hooks/keyGenerator'
import { de } from 'zod/v4/locales'

const ConfigurationValues = () => {
  const { data, loading, count, params } = useSelectorWithType(
    (state) => state.configurationValue
  )
  const [key, refresh] = useKeyGenerator()
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: '' })
  const dispatch = useDispatch()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(getConfigurationValues())
  }
  const resetHandler = () => {
    refresh()
    dispatch(resetConfigurationValueParams())
    dispatch(getConfigurationValues())
  }

  useEffect(() => {
    dispatch(getConfigurationValues())
  }, [dispatch])

  return (
    <div className='d-flex flex-column gap-3'>
      <AddConfigurationValue />
      <FilterCard key={key}>
        <CForm
          onSubmit={onSubmit}
          className='d-flex flex-column gap-3'
          onReset={resetHandler}
        >
          <CRow>
            <CCol>
              <CFormInput
                placeholder='search name'
                onChange={(e) =>
                  dispatch(
                    setConfigurationParamsValue({ search: e.target.value })
                  )
                }
              />
            </CCol>
            <CCol>
              <ConfigurationTypeAutocomplete
                onSelect={(value) =>
                  dispatch(setConfigurationParamsValue({ typeId: value?.id }))
                }
              />
            </CCol>
            <CCol>
              <ConfigurationValueAutocomplete
                onSelect={(value) =>
                  dispatch(setConfigurationParamsValue({ parentId: value?.id }))
                }
              />
            </CCol>
          </CRow>
          <FormButtons />
        </CForm>
      </FilterCard>
      <Table
        data={data}
        columns={[
          { header: 'key', field: 'key' },
          {
            header: 'english title',
            field: 'valueEn',
            edit: {
              inputType: InputType.TEXT,
            },
          },
          {
            header: 'arabic title',
            field: 'valueAr',
            edit: {
              inputType: InputType.TEXT,
            },
          },
          {
            header: 'color code',
            field: 'colorCode',
            edit: (row) => {
              const typedRow = row as ConfigurationValueType
              return typedRow.type.name.includes('color')
                ? {
                    inputType: InputType.COLOR,
                  }
                : undefined
            },
          },
          {
            header: 'Is Active',
            field: 'isActive',
            body: (row: ConfigurationValueType) =>
              row.isActive ? 'Yes' : 'No',
            edit: {
              inputType: InputType.DROPDOWN,
              options: [
                { value: 'true', name: 'Yes' },
                { value: 'false', name: 'No' },
              ],
            },
          },
          {
            header: 'type',
            field: '',
            body: (row: ConfigurationValueType) => row.type.displayName,
          },
          {
            header: 'parent',
            field: '',
            body: (row: ConfigurationValueType) =>
              row.parent ? row.parent.key : '-',
          },
        ]}
        editFn={({
          id,
          key,
          typeId,
          valueAr,
          valueEn,
          colorCode,
          isActive,
        }: ConfigurationValueType) => {
          const data = { key, typeId, valueAr, valueEn, colorCode, isActive }
          data.isActive = data.isActive?.toString() === 'true'

          dispatch(updateConfigurationValue({ id, data }))
        }}
        count={count}
        loading={loading}
        editable
        onPageChange={(page: number) => {
          dispatch(setConfigurationParamsValue({ page }))
          dispatch(getConfigurationValues())
        }}
        pageNumber={params.offset! + 1}
        pageSize={params.limit}
        Actions={({ id }: ConfigurationValueType) => (
          <>
            <CButton
              size='sm'
              color='danger'
              onClick={() => setDeleteModal({ visible: true, id })}
            >
              <CIcon icon={cilTrash} />
            </CButton>
          </>
        )}
      />
      <DeleteModal
        visible={deleteModal.visible}
        onClose={() => setDeleteModal({ visible: false, id: '' })}
        onDelete={(id: string) => dispatch(deleteConfigurationValue(id))}
        id={deleteModal.id}
      />
    </div>
  )
}

export default ConfigurationValues
