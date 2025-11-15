import { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useSelectorWithType } from '../../../store'
import {
  deleteConfigurationType,
  getConfigurationTypesState,
  setConfigurationParamsTypes,
  updateConfigurationType,
} from '../../../store/configurationTypes.slice'
import { useDispatch } from 'react-redux'
import ConfigurationTypeModal from './components/ConfigurationTypeModal'
import { CButton, CForm, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash } from '@coreui/icons'
import { ConfigurationType } from '../../../types'
import { InputType } from '../../../enums'
import DeleteModal from '../../../components/DeleteModal'
import FilterCard from '../../../components/FilterCard'
import FormButtons from '../../../components/FormButtons'

const ConfigurationTypes = () => {
  const { data, count, loading } = useSelectorWithType(
    (state) => state.configureTypes
  )
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: '' })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getConfigurationTypesState())
  }, [dispatch])

  return (
    <div className='d-flex gap-3 flex-column'>
      <div>
        <ConfigurationTypeModal
          triggerButton={(props) => (
            <CButton {...props}>
              <CIcon icon={cilPlus} className='me-2' />
              Add New
            </CButton>
          )}
        />
      </div>
      <FilterCard>
        <CForm
          onSubmit={(e) => {
            e.preventDefault()
            dispatch(getConfigurationTypesState())
          }}
          className='d-flex flex-column gap-3'
        >
          <CFormInput
            placeholder='name'
            onChange={(e) =>
              dispatch(setConfigurationParamsTypes({ search: e.target.value }))
            }
            delay={500}
          />
          <FormButtons />
        </CForm>
      </FilterCard>
      <Table
        editable
        data={data}
        editFn={(data: ConfigurationType) => {
          data.isActive = data.isActive.toString() === 'true' ? true : false
          dispatch(updateConfigurationType(data))
        }}
        columns={[
          {
            header: 'name',
            field: 'name',
            edit: { inputType: InputType.TEXT },
          },
          {
            header: 'displayName',
            field: 'displayName',
            edit: { inputType: InputType.TEXT },
          },
          {
            header: 'is Active',
            field: 'isActive',
            body: (row: ConfigurationType) => (row.isActive ? 'Yes' : 'No'),
            edit: {
              inputType: InputType.DROPDOWN,
              options: [
                { value: 'true', name: 'Yes' },
                { value: 'false', name: 'No' },
              ],
            },
          },
        ]}
        count={count}
        onPageChange={(page) => dispatch(setConfigurationParamsTypes({ page }))}
        loading={loading}
        Actions={({ id }) => (
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
        onDelete={() => dispatch(deleteConfigurationType(deleteModal.id))}
      />
    </div>
  )
}

export default ConfigurationTypes
