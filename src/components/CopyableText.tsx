import { cilCopy } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CRow, CBadge, CTooltip } from '@coreui/react'
import React, { useState } from 'react'

type PropTypes ={
    data: {[key: string]: any}
    field : string
}
const CopyableText = ({ data, field }:PropTypes) => {
    const [status, setStatus] = useState(false)
    const copyHandler = (text: string) => {
        navigator.clipboard.writeText(text)
        setStatus(true)
        setTimeout(() => setStatus(false), 1000)
    }
    return (
        <>
            <CRow className='align-items-center'>
                <CCol xs='auto'>{data[field as keyof typeof data]}</CCol>
                <CCol xs='auto'>
                    <CTooltip content='copy'>
                        <CButton color='secondary' onClick={() => copyHandler(data[field as keyof typeof data])}>
                            {status ? <CBadge color="info">Copied!</CBadge> :
                                <CIcon icon={cilCopy} />
                            }
                        </CButton>

                    </CTooltip>
                </CCol>
            </CRow>
        </>
    )
}

export default CopyableText