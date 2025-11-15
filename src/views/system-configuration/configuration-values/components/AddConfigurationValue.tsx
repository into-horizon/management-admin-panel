import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import ConfigurationTypeAutocomplete from './ConfigurationTypeAutocomplete'
import ConfigurationValueAutocomplete from './ConfigudationValueAutocomplete'
import { useReducer } from 'react'
import { PostConfigurationValueType } from '../../../../types'
import { useSelectorWithType } from '../../../../store'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import {
  createConfigurationValue,
  toggleModal,
} from '../../../../store/configurationValue.slice'
import { useDispatch } from 'react-redux'
const reducer = (
  state: PostConfigurationValueType,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case 'SET_KEY':
      return { ...state, key: action.payload }
    case 'SET_VALUE_EN':
      return { ...state, valueEn: action.payload }
    case 'SET_VALUE_AR':
      return { ...state, valueAr: action.payload }
    case 'SET_TYPE_ID':
      return { ...state, typeId: action.payload }
    case 'SET_PARENT_ID':
      return { ...state, parentId: action.payload }
    default:
      return state
  }
}

const AddConfigurationValue = () => {
  const { isModalOpen } = useSelectorWithType(
    (state) => state.configurationValue
  )
  const appDispatch = useDispatch()
  const [configurationValue, dispatch] = useReducer(reducer, {
    key: '',
    valueEn: '',
    valueAr: '',
    typeId: '',
    // parentId: '',
  })
  const toggleModelHandler = (value: boolean) => {
    appDispatch(toggleModal(value))
  }
  const onSaveHandler = () => {
    appDispatch(createConfigurationValue(configurationValue))
  }
  return (
    <div>
      <CButton color='primary' onClick={() => toggleModelHandler(true)}>
        <CIcon icon={cilPlus} className='me-2' />
        Add Configuration Value
      </CButton>
      <CModal visible={isModalOpen} onClose={() => toggleModelHandler(false)}>
        <CModalHeader>
          <CModalTitle>Add Configuration Value</CModalTitle>
        </CModalHeader>
        <CModalBody className='d-flex gap-2 flex-wrap'>
          <CFormInput
            placeholder='key'
            value={configurationValue.key}
            onChange={(e) =>
              dispatch({ type: 'SET_KEY', payload: e.target.value })
            }
          />
          <CFormInput
            placeholder='english value'
            value={configurationValue.valueEn}
            onChange={(e) =>
              dispatch({ type: 'SET_VALUE_EN', payload: e.target.value })
            }
          />
          <CFormInput
            placeholder='arabic value'
            value={configurationValue.valueAr}
            onChange={(e) =>
              dispatch({ type: 'SET_VALUE_AR', payload: e.target.value })
            }
          />
          <ConfigurationTypeAutocomplete
            onSelect={(value) =>
              dispatch({ type: 'SET_TYPE_ID', payload: value?.id ?? '' })
            }
          />
          <ConfigurationValueAutocomplete
            onSelect={(value) =>
              dispatch({ type: 'SET_PARENT_ID', payload: value?.id ?? '' })
            }
          />
        </CModalBody>
        <CModalFooter>
          <CButton color='secondary' onClick={() => toggleModelHandler(false)}>
            Close
          </CButton>
          <CButton color='primary' onClick={onSaveHandler}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AddConfigurationValue
