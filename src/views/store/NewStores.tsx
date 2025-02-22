import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { getPendingStores } from '../../store/store'

import ActionModal from './ActionModal'
import Table from '../../components/Table'
import { RootState } from '../../store'
import { ParamsType } from '../../types'
type PropTypes = {
  getPendingStores: (p: ParamsType) => Promise<void>
}
const NewStores = ({ getPendingStores }: PropTypes) => {
  const { data, count } = useSelector((state: RootState) => state.stores.pending)
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<ParamsType>({ limit: 10, offset: 0 })
  useEffect(() => {
    Promise.all([getPendingStores(params)]).then(() => setLoading(false))
  }, [])

  const columns = [
    { header: 'store name', field: 'store_name' },
    { header: 'email verified', field: 'verified_email' },
    { header: 'mobile', field: 'mobile' },
    { header: 'status', field: 'status' },
    { header: 'verification code', field: 'verification_code' },
    { header: 'action', field: 'action', body: ActionModal },
  ]
  return (
    <>
      <Table
        data={data}
        count={count}
        loading={loading}
        columns={columns}
        params={params}
        changeData={getPendingStores}
        updateParams={setParams}
        updateLoading={setLoading}
        cookieName={'pending'}
      />
    </>
  )
}

const mapDispatchToProps = { getPendingStores }

export default connect(null, mapDispatchToProps)(NewStores)
