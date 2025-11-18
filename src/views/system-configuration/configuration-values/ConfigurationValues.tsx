import { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useSelectorWithType } from '../../../store'
import { useDispatch } from 'react-redux'
import {
  deleteConfigurationValue,
  getConfigurationValues,
  setConfigurationParamsValue,
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

const ConfigurationValues = () => {
  const { data, loading, count } = useSelectorWithType(
    (state) => state.configurationValue
  )
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: '' })
  const dispatch = useDispatch()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(getConfigurationValues())
  }

  useEffect(() => {
    dispatch(getConfigurationValues())
  }, [dispatch])

  return (
    <div className='d-flex flex-column gap-3'>
      <AddConfigurationValue />
      <FilterCard>
        <CForm onSubmit={onSubmit} className='d-flex flex-column gap-3'>
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
            header: 'name',
            field: 'name',
            body: (row: ConfigurationValueType) =>
              `${row.valueEn} - ${row.valueAr}`,
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
        count={count}
        loading={loading}
        editable
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
