import React, { useState, useEffect, Fragment } from 'react'
import { connect, useSelector } from 'react-redux'
import {
    CWidgetStatsF, CRow, CCol, CSpinner, CAccordionHeader, CAccordionItem, CAccordion, CAccordionBody, CForm, CFormInput, CFormSelect, CButton, CFormLabel, CModal, CTooltip, CModalHeader, CModalTitle, CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilCheck, cilWallet, cilPlus, cilPaperclip, cilTruck, cilExternalLink, cilX, cilFile } from '@coreui/icons';
import { getPendingAmounts, getAmounts } from '../../store/finance'
import { getCashAccount, getAccountsHandler } from 'src/store/bankAccount';
import { getWithdrawalsHandler, addWithdrawalHandler, updateWithdrawalHandler } from 'src/store/withdrawal'
import AccountModal from './components/AccountModal';
import Table from '../../components/Table';

export const Summary = ({ getWithdrawalsHandler, addWithdrawalHandler, getAmounts, updateWithdrawalHandler }) => {
    const { pending, released, refunded, withdrawn, canceledWithdrawn, commission, delivery, transferred } = useSelector(state => state.finance)
    const { account, cashAccount } = useSelector(state => state.bankAccount)
    const { withdrawals: { data: withdrawals, count } } = useSelector(state => state.withdrawals)
    const [params, setParams] = useState({ limit: 10, offset: 0 })
    const [loading, setLoading] = useState(true)
    const [releasedFinal, setReleasedFinal] = useState(0)
    const [active, setActive] = useState(0)
    const [add, setAdd] = useState(false)
    const [progressLoading, setProgressLoading] = useState(false)

    useEffect(() => {
        Promise.all([getAmounts(), getWithdrawalsHandler(params)]).then(() => setLoading(false))
    }, [])

    useEffect(() => {
        setReleasedFinal((released - withdrawn + canceledWithdrawn).toFixed(2))
    }, [released, withdrawn, canceledWithdrawn])

    const submitHandler = (e) => {
        e.preventDefault()
        setProgressLoading(true)
        let obj = { account_id: e.target.account.value, amount: e.target.amount.value }
        Promise.all([addWithdrawalHandler(obj)]).then(() => {
            e.target.reset()
            setProgressLoading(false)
        })

    }
    useEffect(() => {
        setActive(!withdrawals.find(w => w.status === 'requested'))
    }, [withdrawals])
    const UpdateWithdrawalStatus = data => {
        const [visible, setVisible] = useState(false)
        const [type, setType] = useState('')
        const [reason, setReason ] = useState('')
        const updateType = t => {
            setType(t)
            setVisible(true)
        }
        const submitHandler = e => {
            let formData = new FormData()
            let _data = {...data, status: type === 'accept' ? 'transferred' :  'canceled', rejection_reason: reason? reason === 'other' ? e.target.rejection_reason_other.value : e.target.rejection_reason.value : null, document:  e.target.document?.files[0] }
            Object.entries(_data).forEach(([key,value])=>{
                value && formData.append(key, value)
            })
            e.preventDefault()
            Promise.all([updateWithdrawalHandler(formData)]).then(() => {
                return setVisible(false)
            })
        }
        return (
            <Fragment>
                <CTooltip content='accept'>

                    <CButton color='success' onClick={() => updateType('accept')}><CIcon icon={cilCheck} /></CButton>
                </CTooltip>
                <CTooltip content='reject'>

                    <CButton color='danger' onClick={() => updateType('reject')}><CIcon icon={cilX} /></CButton>
                </CTooltip>
                <CModal visible={visible} alignment='center' onClose={() => setVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Update withdrawal</CModalTitle>
                    </CModalHeader>
                            <CForm onSubmit={submitHandler}>
                    <CRow className='justify-content-center align-items-center'>
                        <CCol xs='auto'>
                                {type === 'accept'&& <>
                                <CFormLabel htmlFor='document' className='btn btn-primary'>{' '}
                                    <CIcon icon={cilFile} size='lg'/>
                                    upload document
                                    </CFormLabel>
                                <CFormInput name='document' id='document' type='file' hidden onChange={e=> console.log(e.target.files)}/>
                                </>}
                                {type === 'reject'&& <>
                                <CFormLabel htmlFor='rejection' >rejection reason</CFormLabel>
                                <CFormSelect id='rejection_reason' onChange={e=> setReason(e.target.value)} defaultValue={'invalid amount'}>
                                    <option value="invalid amount">invalid amount</option>
                                    <option value="incorrect bank details">incorrect bank details</option>
                                    <option value="other">other</option>
                                </CFormSelect>
                                { reason === 'other' && <CFormInput placeholder='enter reason' id='rejection_reason_other'  required></CFormInput>}
                                </>}

                        </CCol>
                    </CRow>
                    <CModalFooter>
                        <CButton color='primary' type='submit'>submit</CButton>
                        <CButton color='secondary' onClick={()=> setVisible(false)}>close</CButton>
                    </CModalFooter>
                            </CForm>
                </CModal>
            </Fragment>
        )
    }
    const columns = [
        { header: 'transfer to', field: 'title' },
        { header: 'amount', field: 'amount' },
        { header: 'status', field: 'status' },
        { header: 'created at', body: data => <span>{new Date(data.created_at)?.toLocaleDateString()}</span> },
        { header: 'updated at', body: data => <span>{data.updated ? new Date(data.updated)?.toLocaleDateString() : '-'}</span> },
        { header: 'attachment', body: data => data.document ? <a href={data.document} target="_blank" ><CIcon icon={cilPaperclip} /></a> : '-' },
        { header: 'action', body: data => data.status === 'requested' ? <UpdateWithdrawalStatus {...data} /> : <span>completed</span> }

    ]
    return (
        loading ? <CSpinner /> :
            <>
                <AccountModal account={{}} add={add} onClose={() => setAdd(false)} />
                <CRow>
                    <CCol lg={4} md={4} xs={12} sm={4}>
                        <CWidgetStatsF
                            className="mb-3"
                            color="success"
                            icon={<CIcon icon={cilCheck} height={24} />}
                            padding={false}
                            title="commission"
                            value={commission} />


                    </CCol>
                    <CCol lg={4} md={4} xs={12} sm={4}>
                        <CWidgetStatsF
                            className="mb-3"
                            color="warning"
                            icon={<CIcon icon={cilTruck} height={24} />}
                            padding={false}
                            title="delivery"
                            value={delivery} />


                    </CCol>
                    <CCol lg={4} md={4} xs={12} sm={4}>
                        <CWidgetStatsF
                            className="mb-3"
                            color="info"
                            icon={<CIcon icon={cilExternalLink} height={24} />}
                            padding={false}
                            title="transferred"
                            value={transferred} />


                    </CCol>
                </CRow>
                <CRow className="justify-content-md-center">
                    <CCol xs={12}>
                        {progressLoading ?
                            <CSpinner color="primary" /> :
                            active && releasedFinal > 0 && <CAccordion activeItemKey={0} >
                                <CAccordionItem itemKey={1}>
                                    <CAccordionHeader>
                                        <CRow>
                                            <CCol xs='auto'>
                                                <CIcon icon={cilWallet} size='lg' />

                                            </CCol>
                                            <CCol>
                                                <strong>you have {releasedFinal} withdrawal amount</strong>

                                            </CCol>
                                        </CRow>
                                    </CAccordionHeader>
                                    <CAccordionBody>
                                        <CForm onSubmit={submitHandler}>
                                            <CRow className="justify-content-md-center align-items-end ">
                                                <CCol xs={3}>
                                                    <CFormLabel>requested amount</CFormLabel>
                                                    <CFormInput type="number" step="any" max={releasedFinal} defaultValue={releasedFinal} id="amount" />
                                                </CCol>
                                                <CCol xs={3}>
                                                    <CFormLabel>Transfer To</CFormLabel>
                                                    <CFormSelect id='account'>

                                                        <option value={cashAccount.id}>{cashAccount.title}</option>
                                                        {account.id && <option value={account.id}>{account.title}</option>}

                                                    </CFormSelect>

                                                </CCol>
                                                {!account.id && <CCol xs='auto'>
                                                    <CButton color='secondary' title='add account' onClick={() => setAdd(true)} type='button'>
                                                        <CIcon icon={cilPlus} size='lg' />
                                                    </CButton>
                                                </CCol>}
                                                <CCol xs='auto'>
                                                    <CButton type='submit' >submit</CButton>
                                                </CCol>

                                            </CRow>
                                        </CForm>
                                    </CAccordionBody>
                                </CAccordionItem>

                            </CAccordion>}
                    </CCol>
                </CRow>
                <CRow className="justify-content-md-center mgn-top50">
                    <CCol xs={12} lg={10} xl={8}>
                        <Table columns={columns} data={withdrawals} count={count} changeData={getWithdrawalsHandler} cookieName='withdrawal' params={params} />
                    </CCol>
                </CRow>
            </>

    )
}

const mapStateToProps = (state) => ({
    pending: state.finance.pending
})

const mapDispatchToProps = { getPendingAmounts, getCashAccount, getAccountsHandler, getWithdrawalsHandler, addWithdrawalHandler, getAmounts, updateWithdrawalHandler }

export default connect(mapStateToProps, mapDispatchToProps)(Summary)