// import React, { useState, useEffect } from 'react'
// import { connect, useSelector } from 'react-redux'
// import { getAccountHandler, deleteAccountHandler, getAccountsHandler, addAccountHandler, updateAccountHandler } from 'src/store/bankAccount'
// import { CCardTitle, CCard, CCardHeader, CCardBody, CButton, CCardText, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput, CFormSelect, CRow, CCol, CSpinner } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilPlus } from '@coreui/icons';
// import DeleteModal from '../../../components/DeleteModal'
// import { useTranslation } from 'react-i18next';
// import AccountModal from './AccountModal'

// type PropsTypes = {
//     deleteAccountHandler: (a: AccountType) => void,
//     getAccountsHandler: () => void,
//     addAccountHandler: (a: AccountType) => void,
//     updateAccountHandler: (a: AccountType) => void
// }

// export const BankAccount = ({ deleteAccountHandler, getAccountsHandler, addAccountHandler, updateAccountHandler }) => {
//     const { t: g } = useTranslation('translation', { keyPrefix: 'globals' })
//     const { t } = useTranslation('translation', { keyPrefix: 'bankAccount' })
//     const { msg, account } = useSelector((state: RootState) => state.bankAccount)
//     const [add, setAdd] = useState(false)
//     const [update, setUpdate] = useState(false)
//     const [loading, setLoading] = useState(true)
//     const [deleteModal, setDeleteModal] = useState(false)
//     const submitHandler = e => {
//         e.preventDefault()
//         let obj = { title: e.target.title.value, type: e.target.type.value, reference: e.target.referenceNumber.value }
//         Promise.all([update ? updateAccountHandler({ ...obj, id: account.id }) : addAccountHandler(obj)]).then(() => { setAdd(false); setUpdate(false) })
//     }
//     useEffect(() => {
//         Promise.all([getAccountsHandler()]).then(() => setLoading(false))
//     }, [])
//     return (
//         <div>
//             <DeleteModal visible={deleteModal} onClose={() => setDeleteModal(false)} onDelete={deleteAccountHandler} id={account?.id} />
//             {loading ?
//                 <CSpinner color="primary" /> :
//                 <>
//                     <AccountModal account={account} add={add} update={update} onClose={() => { setAdd(false); setUpdate(false) }} />
//                     {account.id ? <CCard>
//                         <CCardHeader>{t('transferAccount')}</CCardHeader>
//                         <CCardBody>
//                             <CCardTitle>{account.title} </CCardTitle>
//                             <CCardText>{account.type}</CCardText>
//                             <CCardText>{account.reference}</CCardText>
//                             <CRow>
//                                 <CCol xs='auto'>
//                                     <CButton onClick={() => setUpdate(true)}>{g('update')} </CButton>

//                                 </CCol>
//                                 <CCol xs='auto'>
//                                     <CButton onClick={() => setDeleteModal(true)} color="danger">{g('delete')}</CButton>

//                                 </CCol>
//                             </CRow>
//                         </CCardBody>
//                     </CCard> :
//                         <>
//                             <CIcon icon={cilPlus} size="sm" />
//                             <CButton color="link" onClick={() => setAdd(true)}>{t('addAccount')}</CButton>

//                         </>}
//                 </>
//             }
//         </div>
//     )
// }

// const mapStateToProps = (state) => ({})

// const mapDispatchToProps = { getAccountHandler, deleteAccountHandler, getAccountsHandler, addAccountHandler, updateAccountHandler }

// export default connect(mapStateToProps, mapDispatchToProps)(BankAccount)