import React, { useState, useEffect, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  CWidgetStatsF,
  CRow,
  CCol,
  CSpinner,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CFormLabel,
  CModal,
  CTooltip,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilPaperclip, cilTruck, cilExternalLink, cilX, cilFile } from '@coreui/icons'
import { getPendingAmounts, getAmounts } from '../../store/finance'
import { getCashAccount, getAccountsHandler } from 'src/store/bankAccount'
import { getWithdrawalsHandler, updateWithdrawalHandler } from 'src/store/withdrawal'
import AccountModal from './components/AccountModal'
import Table from '../../components/Table'
import { RootState } from 'src/store'
import { WithdrawalType } from 'src/types'

type PropTypes = {
  getAmounts: () => Promise<void>
}
const Summary = ({ getAmounts }: PropTypes) => {
  const {
    pending,
    released,
    refunded,
    withdrawn,
    canceledWithdrawn,
    commission,
    delivery,
    transferred,
  } = useSelector((state: RootState) => state.finance)
  const { account, cashAccount } = useSelector((state: RootState) => state.bankAccount)
  const { data: withdrawals, count } = useSelector((state: RootState) => state.withdrawals)

  const [params, setParams] = useState({ limit: 10, offset: 0 })
  const [loading, setLoading] = useState(true)
  const [releasedFinal, setReleasedFinal] = useState<number>(0)
  const [active, setActive] = useState<number | boolean>(0)
  const [add, setAdd] = useState(false)
  const [progressLoading, setProgressLoading] = useState(false)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getWithdrawalsHandler())
    Promise.all([getAmounts()]).then(() => setLoading(false))
  }, [])

  useEffect(() => {
    let newValue: number = released - withdrawn + canceledWithdrawn
    setReleasedFinal(Number(newValue.toFixed(2)))
  }, [released, withdrawn, canceledWithdrawn])

  // const submitFormHandler = async (e: React.FormEvent): Promise<void> => {
  //   const target = e.target as typeof e.target & {
  //     account: { value: string }
  //     amount: { value: string }
  //     reset: () => void
  //   }
  //   e.preventDefault()
  //   setProgressLoading(true)
  //   let obj: WithdrawalType = {
  //     account_id: target.account.value,
  //     amount: Number(target.amount.value),
  //     id: '',
  //     courier_id: null,
  //     store_id: '',
  //     type: '',
  //     status: '',
  //     updated: null,
  //     document: null,
  //     created_at: '',
  //   }
  //   try {
  //     await addWithdrawalHandler(obj)
  //     target.reset()
  //     setProgressLoading(false)
  //     // await getWithdrawalsHandler(params)
  //   } catch (e) {
  //     return
  //   }
  // }
  useEffect(() => {
    setActive(!withdrawals.find((w: WithdrawalType) => w.status === 'requested'))
  }, [withdrawals])
  const UpdateWithdrawalStatus = (data: WithdrawalType) => {
    const [visible, setVisible] = useState(false)
    const [type, setType] = useState<string | null>('')
    const [reason, setReason] = useState<string | null>('')
    const [file, setFile] = useState<File | null>(null)
    const updateType = (t: string) => {
      setType(t)
      setVisible(true)
    }
    useEffect(() => {
      console.log({ file })
    }, [file])
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      const target = e.target as typeof e.target & {
        rejection_reason_other: { value: string }
        rejection_reason: { value: string }
        document: { files: Blob[] }
        reset: () => void
      }
      let formData = new FormData()
      let _data = {
        ...data,
        status: type === 'accept' ? 'transferred' : 'canceled',
        rejection_reason: reason
          ? reason === 'other'
            ? target.rejection_reason_other.value
            : target.rejection_reason.value
          : null,
        document: target.document?.files[0],
      }
      Object.entries(_data).forEach(([key, value]) => {
        if (typeof value === 'number') {
          value = String(value)
        }
        value && formData.append(key, value)
      })
      e.preventDefault()
      dispatch(updateWithdrawalHandler(formData))
      // Promise.all([]).then(() => {
      //   return setVisible(false)
      // })
    }
    return (
      <Fragment>
        <CTooltip content='accept'>
          <CButton color='success' onClick={() => updateType('accept')}>
            <CIcon icon={cilCheck} />
          </CButton>
        </CTooltip>
        <CTooltip content='reject'>
          <CButton color='danger' onClick={() => updateType('reject')}>
            <CIcon icon={cilX} />
          </CButton>
        </CTooltip>
        <CModal visible={visible} alignment='center' onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Update withdrawal</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={submitHandler}>
            <CRow className='justify-content-center align-items-center'>
              <CCol xs='auto ' className='file-label'>
                {type === 'accept' && (
                  <>
                    <CFormLabel
                      style={{ margin: 'auto' }}
                      htmlFor='document'
                      className='btn btn-primary'
                    >
                      {' '}
                      <CIcon icon={cilFile} size='lg' />
                      upload document
                    </CFormLabel>
                    <CFormInput
                      name='document'
                      id='document'
                      type='file'
                      hidden
                      accept='.jpeg, .png, .pdf'
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    />

                    <CFormInput
                      value={file?.name ? file?.name : ''}
                      readOnly
                      placeholder='file name'
                    />
                  </>
                )}
                {type === 'reject' && (
                  <>
                    <CFormLabel htmlFor='rejection'>rejection reason</CFormLabel>
                    <CFormSelect
                      id='rejection_reason'
                      onChange={(e) => setReason(e.target.value)}
                      defaultValue={'invalid amount'}
                    >
                      <option value='invalid amount'>invalid amount</option>
                      <option value='incorrect bank details'>incorrect bank details</option>
                      <option value='other'>other</option>
                    </CFormSelect>
                    {reason === 'other' && (
                      <CFormInput
                        placeholder='enter reason'
                        id='rejection_reason_other'
                        required
                      ></CFormInput>
                    )}
                  </>
                )}
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton color='primary' type='submit'>
                submit
              </CButton>
              <CButton color='secondary' onClick={() => setVisible(false)}>
                close
              </CButton>
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
    {
      header: 'created at',
      body: (data: WithdrawalType) => (
        <span>{new Date(data.created_at)?.toLocaleDateString()}</span>
      ),
    },
    {
      header: 'updated at',
      body: (data: WithdrawalType) => (
        <span>{data.updated ? new Date(data.updated)?.toLocaleDateString() : '-'}</span>
      ),
    },
    {
      header: 'attachment',
      body: (data: WithdrawalType) =>
        data.document ? (
          <a href={data.document} target='_blank'>
            <CIcon icon={cilPaperclip} />
          </a>
        ) : (
          '-'
        ),
    },
    {
      header: 'action',
      body: (data: WithdrawalType) =>
        data.status === 'requested' ? <UpdateWithdrawalStatus {...data} /> : <span>completed</span>,
    },
  ]
  return loading ? (
    <CSpinner />
  ) : (
    <>
      <AccountModal add={add} onClose={() => setAdd(false)} />
      <CRow>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className='mb-3'
            color='success'
            icon={<CIcon icon={cilCheck} height={24} />}
            padding={false}
            title='commission'
            value={commission}
          />
        </CCol>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className='mb-3'
            color='warning'
            icon={<CIcon icon={cilTruck} height={24} />}
            padding={false}
            title='delivery'
            value={delivery}
          />
        </CCol>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className='mb-3'
            color='info'
            icon={<CIcon icon={cilExternalLink} height={24} />}
            padding={false}
            title='transferred'
            value={transferred}
          />
        </CCol>
      </CRow>
      {/* <CRow className='justify-content-md-center'>
        <CCol xs={12}>
          {progressLoading ? (
            <CSpinner color='primary' />
          ) : (
            active &&
            releasedFinal > 0 && (
              <CAccordion activeItemKey={0}>
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
                    <CForm onSubmit={submitFormHandler}>
                      <CRow className='justify-content-md-center align-items-end '>
                        <CCol xs={3}>
                          <CFormLabel>requested amount</CFormLabel>
                          <CFormInput
                            type='number'
                            step='any'
                            max={releasedFinal}
                            defaultValue={releasedFinal}
                            id='amount'
                          />
                        </CCol>
                        <CCol xs={3}>
                          <CFormLabel>Transfer To</CFormLabel>
                          <CFormSelect id='account'>
                            <option value={cashAccount.id}>{cashAccount.title}</option>
                            {account.id && <option value={account.id}>{account.title}</option>}
                          </CFormSelect>
                        </CCol>
                        {!account.id && (
                          <CCol xs='auto'>
                            <CButton
                              color='secondary'
                              title='add account'
                              onClick={() => setAdd(true)}
                              type='button'
                            >
                              <CIcon icon={cilPlus} size='lg' />
                            </CButton>
                          </CCol>
                        )}
                        <CCol xs='auto'>
                          <CButton type='submit'>submit</CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>
            )
          )}
        </CCol>
      </CRow> */}
      <CRow className='justify-content-md-center mgn-top50'>
        <CCol xs={12} lg={10} xl={8}>
          <Table
            columns={columns}
            data={withdrawals}
            count={count}
            changeData={getWithdrawalsHandler}
            cookieName='withdrawal'
            params={params}
            updateLoading={setLoading}
          />
        </CCol>
      </CRow>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  pending: state.finance.pending,
})

const mapDispatchToProps = {
  getPendingAmounts,
  getCashAccount,
  getAccountsHandler,
  getAmounts,
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary)
