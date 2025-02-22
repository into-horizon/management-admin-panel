import React, { useState, FormEvent } from 'react'
import { useDispatch } from 'react-redux'
// import { createDiscountCode } from '../store/discountCode'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import {
  CButton,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CRow,
  CCol,
  CFormInput,
} from '@coreui/react'
import { DiscountCodeType, GetFunctionType, ParamsType } from '../../types'
import { createDiscountCode } from '../../store/discountCode'
// import { DiscountCodeType, GetFunctionType, ParamsType } from '../types'

type PropTypes = {
  callback: GetFunctionType
  params: ParamsType
}
const CreateCodeModal = ({ callback, params }: PropTypes) => {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState<number>(0)
  const dispatch = useDispatch()
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const _params: string[] = [
      'discount_code',
      'expiry_date',
      'min_order_amount',
      'max_counter',
      'discount',
      'max_discount',
      'number_of_time',
    ]
    type InputTypes = {
      discount_code: HTMLInputElement
      expiry_date: HTMLInputElement
      min_order_amount: HTMLInputElement
      max_counter: HTMLInputElement
      discount: HTMLInputElement
      max_discount: HTMLInputElement
      number_of_time?: HTMLInputElement
    }
    const target = e.target as typeof e.target & InputTypes & { reset(): void }
    type DataType = {
      discount_code?: string
      expiry_date?: string
      min_order_amount?: string
      max_counter?: number | string
      discount?: number | string
      max_discount?: number | string
      number_of_time?: number | string
    }
    let data: Omit<DiscountCodeType, 'active'> = {
      discount_code: '',
      expiry_date: '',
      max_counter: 0,
      discount: 0,
      max_discount: 0,
      number_of_time: 0,
    }
    data.discount = Number(target.discount.value)
    data.discount_code = target.discount_code.value
    data.expiry_date = target.expiry_date.value
    data.max_counter = parseInt(target.max_counter.value)
    data.max_discount = parseInt(target.max_counter.value)
    data.number_of_time = parseInt(target.number_of_time?.value ?? '0')
    data.min_order_amount = parseInt(target.min_order_amount.value)
    // _params.forEach(param => {
    //     if (target[param as keyof InputTypes]?.value && target[param as keyof InputTypes]?.value !== '' ) {
    //         data[param as keyof DiscountCodeType] = target[param as keyof InputTypes]?.value
    //     }
    // })
    dispatch(createDiscountCode(data))
    setVisible(false)
    target.reset()
    callback?.(params)
    setValue(0)
  }

  const onClose = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & { reset(): void }
    target.reset()
    setValue(0)
    setVisible(false)
  }
  return (
    <>
      <CButton onClick={() => setVisible(true)}>
        <CIcon icon={cilPlus} />
        Create Discount Code
      </CButton>
      <CModal visible={visible} alignment='center' onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Create Discount Code</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler} onReset={onClose}>
          <CRow className='justify-content-center align-content-center' xs={{ gutter: 3 }}>
            <CCol xs='auto'>
              <CFormInput placeholder='code title' id='discount_code' />
            </CCol>
            <CCol xs='auto'>
              <CFormInput
                type='date'
                id='expiry_date'
                placeholder='expiry date'
                min={`${new Date().getFullYear()}-${
                  months[new Date().getMonth()]
                }-${new Date().getDate()}`}
              />
            </CCol>
            <CCol xs='auto'>
              <CFormInput type='number' id='min_order_amount' placeholder='min order amount' />
            </CCol>
            <CCol xs='auto'>
              <CFormInput
                type='number'
                id='max_counter'
                step='1'
                min={1}
                placeholder='max counter'
              />
            </CCol>
            <CCol xs={10}>
              <CFormInput
                type='number'
                id='discount'
                step={0.01}
                placeholder='discount amount or percentage'
                min={0}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
              />
            </CCol>
            <CCol xs={10}>
              <CFormInput
                type='number'
                id='max_discount'
                placeholder='max discount amount'
                min={0}
                required={value < 1}
                disabled={value >= 1}
              />
            </CCol>
            <CCol xs='auto'>
              <CFormInput
                type='number'
                id='number_of_time'
                step={1}
                min={1}
                placeholder='usage per user'
              />
            </CCol>
          </CRow>

          <CModalFooter>
            <CButton type='submit'>submit</CButton>
            <CButton color='secondary' type='reset'>
              close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default CreateCodeModal
