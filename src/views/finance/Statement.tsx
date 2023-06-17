import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { getTransactions } from '../../store/finance'
import Table from '../../components/Table'
import FilterCard from '../../components/FilterCard'
import FormButtons from '../../components/FormButtons'
import { CCol, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { RootState } from 'src/store'


export const Statement = ({ getTransactions }) => {
    const { transactions: { data, count } } = useSelector((state : RootState) => state.finance)
    let initialParams = { limit: 20, offset: 0 }
    const [params, setParams] = useState(initialParams)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        Promise.all([getTransactions(params)]).then(() => setLoading(false))
    }, [])
    const columns = [
        { header: 'id', field: 'id', body: (data: TransactionType) => <span>{data.id.substring(24)}</span> },
        { header: 'order number', field: 'customer_order_id' },
        { header: 'product', field: 'entitle' },
        { header: 'description', field: 'description' },
        { header: 'amount', field: 'amount', body: (data: TransactionType) => <span>{data.amount.toFixed(2)}</span> },
        { header: 'status', field: 'status' },
        { header: 'type', field: 'type' },
        { header: 'created at', field: 'created_at', body: (data: TransactionType) => <span>{new Date(data.created_at).toLocaleDateString()}</span> },

    ]
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const _params = ['type', 'description', 'status', 'customer_order_id']
        let _data = {}
        _params.forEach((param) => {
            if (e.target[param]?.value && e.target[param]?.value !== '') _data[param] = e.target[param].value
        })
        setParams(() => {
            let newData = { ...initialParams, ..._data }
            getTransactions(newData)
            return newData
        })
    }
    const resetHandler = (e: React.FormEvent<HTMLFormElement>) => {
        const target = e.target as typeof e.target & {
            reset: () => void
        };
        target.reset()
        setParams(() => {
            getTransactions(initialParams)
            return initialParams
        })
    }
    
    return (
        <>
            <FilterCard >
                <CForm onSubmit={submitHandler} onReset={resetHandler}>
                    <CRow className='justify-content-center align-items-end' xs={{ gutterY: 3 }}>


                        <CCol xs='auto'>
                        <CFormLabel >
                            order number
                        </CFormLabel>
                            <CFormInput placeholder='enter order number' id='customer_order_id' />
                        </CCol>
                        <CCol xs='auto'>
                            <CFormLabel>
                                status
                            </CFormLabel>
                            <CFormSelect id='status'>
                                <option value="">select</option>
                                <option value="pending">pending</option>
                                <option value="released">released</option>
                                <option value="canceled">canceled</option>
                            </CFormSelect>
                        </CCol>
                        <CCol xs='auto'>
                            <CFormLabel>
                                type
                            </CFormLabel>
                            <CFormSelect id='type'>
                                <option value="">select</option>

                                <option value="debit">debit</option>
                                <option value="credit">credit</option>

                            </CFormSelect>
                        </CCol>
                        <CCol xs='auto'>
                            <CFormLabel>
                                description
                            </CFormLabel>
                            <CFormSelect id='description'>
                                <option value="">select</option>

                                <option value="delivery">delivery</option>
                                <option value="commission">commission</option>

                            </CFormSelect>
                        </CCol>
                        <CCol xs='auto'></CCol>

                        <CCol xs={12} className='padding'>

                            <FormButtons />
                        </CCol>
                    </CRow>
                </CForm>
            </FilterCard>
            <Table columns={columns} data={data} count={count} changeData={getTransactions} params={params} cookieName='transactions' loading={loading} updateParams={setParams}  updateLoading={setLoading}/>

        </>
    )
}


const mapDispatchToProps = { getTransactions }

export default connect(null, mapDispatchToProps)(Statement)