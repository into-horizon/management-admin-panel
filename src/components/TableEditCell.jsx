import React, { useState, Children } from "react";

import {
    CCol,
    CFormInput,
    CFormSelect,
    CRow,
} from "@coreui/react";

const TableEditCell = ({ type = 'text', options = [], onChange, value, id }) => {

    return (
        <React.Fragment>

            <CRow className="align-items-center justify-content-center">
                <CCol xs="auto">
                    {type === 'dropdown' && <CFormSelect value={value} onChange={onChange} id={id} >
                        {
                            Children.toArray(options.map(option => <option value={option.value}>{option.name}</option>))
                        }
                    </CFormSelect>}
                    {type === 'text' && <CFormInput value={value} onChange={onChange} id={id}/>}
                    {type === 'date' && <CFormInput type="date" value={value} onChange={onChange} id={id}/>}
                </CCol>

            </CRow>


        </React.Fragment>
    );
};

export default TableEditCell;


