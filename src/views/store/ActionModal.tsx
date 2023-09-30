import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalFooter,
  CModalHeader,
  CRow,
  CTooltip,
} from "@coreui/react";
import { updateStoreStatusHandler } from "src/store/store";
import React, { FormEvent, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil } from "@coreui/icons";
import { connect } from "react-redux";
import { StoreType } from "src/types";
const ActionModal = (data : StoreType & {updateStoreStatusHandler:  (s:StoreType, status: 'overview' | 'pending') => Promise<void>}) => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  const onClose = () =>{
    setStatus("");
    setVisible(false);
  };
  const submitHandler = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      status: HTMLSelectElement
      rejected_reason: HTMLInputElement 
    }
    data.updateStoreStatusHandler({...data, status: target.status.value, rejected_reason: target.rejected_reason?.value},'pending')
    onClose()
  };
  
  return (
    <React.Fragment>
      <CTooltip content="update status">
        <CButton onClick={() => setVisible(true)} color="link">
          <CIcon icon={cilPencil} />
        </CButton>
      </CTooltip>
      <CModal
        visible={visible}
        alignment="center"
        onClose={onClose}
      >
        <CModalHeader>{`Update ${data.store_name} Status`}</CModalHeader>
        <CForm onSubmit={submitHandler}>
          <CRow xs={{ gutterY: 3 }} className="justify-content-center padding">
            <CCol xs={7}>
              <CFormSelect id="status" onChange={(e) => setStatus(e.target.value)}>
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </CFormSelect>
            </CCol>
            {status === "rejected" && (
              <CCol xs={9}>
                <CFormInput id="rejected_reason" placeholder="rejected reason" required />
              </CCol>
            )}
          </CRow>
          <CModalFooter>
            <CButton color="primary" type="submit">
              Submit
            </CButton>
            <CButton color="secondary" onClick={onClose}>
              Close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  );
};

const mapDispatchToProps = { updateStoreStatusHandler };

export default connect(null, mapDispatchToProps)(ActionModal);
