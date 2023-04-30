import React, { useState, Children } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilCheck, cilX } from "@coreui/icons";
import {
  CButton,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTooltip,
} from "@coreui/react";

const EditableCell = ({ data, action, field, type='text', options=[] }) => {
  const [edit, setEdit] = useState(false);
  const [cell, setCell] = useState(data[field]?? '');
  const onChange = (e) => setCell(e.target.value);
  const submit = () => {
    let _data = { ...data };
    _data[field] = cell;
    action?.(_data);
    setEdit(false);
  };
  const  onClose = ()=>{
    setEdit(false)
    setCell(data[field])
  }
  return (
    <React.Fragment>
      {edit ? (
        <CRow className="align-items-center justify-content-center">
          <CCol xs="auto">
           {type === 'dropdown'&& <CFormSelect value={cell} onChange={onChange} > 
           {
            Children.toArray(options.map(option=> <option value={option.value}>{option.name}</option>))
           }
            </CFormSelect>}
            {type === 'text' && <CFormInput  value={cell} onChange={onChange} />}
            {type === 'date' && <CFormInput type="date" value={cell} onChange={onChange} />}
          </CCol>
          <CCol xs="auto">
            <CTooltip content="Submit">
              <CButton size="sm" color="success" onClick={submit}>
                <CIcon icon={cilCheck} />
              </CButton>
            </CTooltip>
          </CCol>
          <CCol xs="auto">
            <CTooltip content="Cancel">
              <CButton onClick={onClose} size="sm" color="danger">
                <CIcon icon={cilX} />
              </CButton>
            </CTooltip>
          </CCol>
        </CRow>
      ) : (
        <CRow className="align-items-center">
          <CCol xs="auto">
           {type === 'date'? <span>{new Date(cell).toLocaleDateString()}</span> :  <span>{String(cell?? "-") }</span>}
          </CCol>

          <CCol xs="auto">
            <CTooltip content="Edit">
              <CButton
                onClick={() => setEdit(true)}
                size="sm"
                color="info"
              >
                <CIcon icon={cilPencil} size='sm'/>
              </CButton>
            </CTooltip>
          </CCol>
        </CRow>
      )}
    </React.Fragment>
  );
};

export default EditableCell;


