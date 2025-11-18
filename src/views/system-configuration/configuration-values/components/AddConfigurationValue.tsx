import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import ConfigurationTypeAutocomplete from './ConfigurationTypeAutocomplete'
import ConfigurationValueAutocomplete from './ConfigurationValueAutocomplete'
import { PostConfigurationValueType } from '../../../../types'
import { useSelectorWithType } from '../../../../store'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import {
  createConfigurationValue,
  toggleModal,
} from '../../../../store/configurationValue.slice'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const validationSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  valueEn: z.string().min(1, 'Value En is required'),
  valueAr: z.string().min(1, 'Value Ar is required'),
  typeId: z.string().min(1, 'Type is required'),
  parentId: z.uuidv4().optional(),
  colorCode: z.string().optional(),
  orderIndex: z.number().optional(),
})
const AddConfigurationValue = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      key: '',
      valueEn: '',
      valueAr: '',
      typeId: '',
    },
  })
  const { isModalOpen } = useSelectorWithType(
    (state) => state.configurationValue
  )
  const appDispatch = useDispatch()
  const toggleModelHandler = (value: boolean) => {
    appDispatch(toggleModal(value))
    reset()
  }

  const onSubmit = async (data: PostConfigurationValueType) => {
    appDispatch(createConfigurationValue(data))
  }

  // const onError = (errors: any) => {
  //   console.log('Validation errors:', errors)
  // }

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
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CModalBody className='d-flex gap-2 flex-wrap'>
            <CFormInput
              placeholder='key'
              {...register('key')}
              invalid={!!errors.key}
              feedbackInvalid={errors.key?.message}
            />
            <CFormInput
              placeholder='english value'
              {...register('valueEn')}
              invalid={!!errors.valueEn}
              feedbackInvalid={errors.valueEn?.message}
            />
            <CFormInput
              placeholder='arabic value'
              {...register('valueAr')}
              invalid={!!errors.valueAr}
              feedbackInvalid={errors.valueAr?.message}
            />
            <div className='d-flex gap-2 flex-column border-1 border w-100 border-black py-4 px-1 rounded-1'>
              {
                <ConfigurationTypeAutocomplete
                  onSelect={(value) => {
                    setValue('typeId', value?.id ?? '')
                  }}
                  invalid={!!errors.typeId}
                  feedbackInvalid={errors.typeId?.message}
                  disabled={!!watch('parentId')}
                />
              }
              <div className='d-flex align-items-center flex-column position-relative'>
                <hr className='w-100' />
                <span className='text-center position-absolute bg-white py-1 px-2'>
                  OR
                </span>
              </div>
              <ConfigurationValueAutocomplete
                onSelect={(value) => {
                  setValue('parentId', value?.id)
                  setValue('typeId', value?.typeId ?? '')
                }}
                invalid={!!errors.parentId}
                feedbackInvalid={errors.parentId?.message}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton
              color='secondary'
              type='button'
              onClick={() => toggleModelHandler(false)}
            >
              Close
            </CButton>
            <CButton type='submit' color='primary'>
              Save
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default AddConfigurationValue
