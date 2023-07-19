import React, { FormEvent, useState } from "react";
import { connect } from "react-redux";
import { cilCheck } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormSelect,
  CModalFooter,
  CRow,
  CCol,
  CFormTextarea,
} from "@coreui/react";
import {updateProductStatus} from '../../store/product'
import { ProductType } from "src/types";


type PropTypes ={
  product:ProductType,
  updateProductStatus: (p: {status: string, id:string}, status: 'overview'| 'pending') => Promise<void>
}
const StatusModal = ({product,updateProductStatus}:PropTypes) => {
    const [visible, setVisible] =  useState(false)
    const [status, setStatus] = useState(product.status)
    const submitHandler = (e: FormEvent<HTMLFormElement>&{target: {rejection_reason?: HTMLInputElement, status: HTMLSelectElement}}) =>{
        e.preventDefault()
        let data = {id: product.id, status:  e.target.status.value, rejection_reason:''}
        data.rejection_reason =  e.target.rejection_reason?.value ?? ''
        updateProductStatus(data, 'overview').then(()=> setVisible(false))

    }
  return (
    <>
      <CButton onClick={()=> setVisible(true)} color='info'>
        <CIcon icon={cilCheck} />
        Status
      </CButton>
      <CModal visible={visible} alignment='center' onClose={()=> setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update Status</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          <CRow className="justify-content-center align-items-center" xs={{gutter: 3}}>
            <CCol xs='auto'>
              <CFormSelect defaultValue={product.status} id="status" onChange={e=> setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </CFormSelect>
            </CCol>
           { status === 'rejected' && <CCol xs={10}>
              <CFormTextarea placeholder="rejection reason" id="rejection_reason" defaultValue={product.rejection_reason??''} required/>
            </CCol>}
          </CRow>
          <CModalFooter>
            <CButton type="submit">Submit</CButton>
            <CButton color="secondary" onClick={()=> setVisible(false)}>Cancel</CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  );
};


const mapDispatchToProps = {updateProductStatus};

export default connect(null, mapDispatchToProps)(StatusModal);
