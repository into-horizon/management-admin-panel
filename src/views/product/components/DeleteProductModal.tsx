import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import DeleteModal from '../../../components/DeleteModal'
import { ProductType } from '../../../types'
type PropTypes = {
  deleteHandler: (id: { id: string }) => Promise<void>
  product: ProductType
}

const DeleteProductModal = ({ deleteHandler, product }: PropTypes) => {
  const [visible, setVisible] = useState(false)
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'addProduct',
  })
  return (
    <>
      <CButton color='danger' onClick={() => setVisible(true)}>
        <CIcon icon={cilTrash}></CIcon>
        {t('delete')}
      </CButton>
      <DeleteModal
        visible={visible}
        onDelete={deleteHandler}
        id={product.id}
        onClose={() => setVisible(false)}
      />
    </>
  )
}

export default DeleteProductModal
