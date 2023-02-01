import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux'
import { createDiscountCode } from 'src/store/discountCode'
import CIcon from "@coreui/icons-react";
import {cilPlus} from '@coreui/icons'
import { CButton, CModal, CModalFooter, CModalHeader, CModalTitle,CForm, CRow,CCol, CFormInput } from "@coreui/react";


const CreateCodeModal = ({createDiscountCode, callback, params }) => {
    const [visible,setVisible] = useState(false)
    const [value,setValue] = useState('')
    const months = ['01','02','03', '04','05', '06', '07','08','09','10','11','12']
    const submitHandler = e =>{
        e.preventDefault()
        const params =['discount_code','expiry_date', 'min_order_amount','max_counter','discount','max_discount','number_of_time']
        let data = {}
        params.forEach(param =>{
            if(e.target[param].value && e.target[param].value !== '' ){
                data[param] = e.target[param].value
            }
        })
        createDiscountCode(data).then(()=> 
        {
            setVisible(false)
            e.target.reset()
            callback?.(params)
            setValue('')
        
        })
    }

    const onClose = (e) =>{
        e.target.reset()
        setValue('')
        setVisible(false)
    }
  return (
    <>
         <CButton onClick={()=> setVisible(true)}><CIcon icon={cilPlus}/>Create Discount Code</CButton>
         <CModal visible={visible} alignment='center' onClose={()=> setVisible(false )}>
                <CModalHeader>
                    <CModalTitle>
                        Create Discount Code
                    </CModalTitle>
                </CModalHeader>
                <CForm onSubmit={submitHandler} onReset={onClose}>
                    <CRow className='justify-content-center align-content-center'  xs={{gutter: 3}}>
                        <CCol xs='auto' >
                            <CFormInput placeholder='code title' id='discount_code'/>
                        </CCol>
                        <CCol xs='auto'>
                            <CFormInput type='date' id='expiry_date' placeholder='expiry date' min={`${new Date().getFullYear()}-${months[(new Date().getMonth())]}-${new Date().getDate()}`}/>
                        </CCol>
                        <CCol xs='auto'>
                            <CFormInput type='number' id='min_order_amount' placeholder='min order amount' />
                        </CCol>
                        <CCol xs='auto'>
                            <CFormInput type='number' id='max_counter' step='1' min={1} placeholder='max counter'/>
                        </CCol>
                        <CCol xs={10}>
                            <CFormInput type='number' id='discount' step={0.01} placeholder='discount amount or percentage' min={0} value={value} onChange={e=> setValue(e.target.value)}/>
                        </CCol>
                        <CCol xs={10}>
                            <CFormInput type='number' id='max_discount'  placeholder='max discount amount' min={0} required={value < 1} disabled={value>= 1}/> 
                        </CCol>
                        <CCol xs='auto'>
                                <CFormInput type='number' id='number_of_time' step={1} min={1} placeholder='usage per user'/>
                        </CCol>
                    </CRow>

                <CModalFooter>
                    <CButton type='submit'>submit</CButton>
                    <CButton color='secondary' type='reset' >close</CButton>
                </CModalFooter>

                </CForm>
         </CModal>
    </>
  )
}


const mapDispatchToProps = {createDiscountCode}

export default connect(null, mapDispatchToProps)(CreateCodeModal)