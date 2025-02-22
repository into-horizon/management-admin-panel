import React, { useState, useEffect } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import cookie from 'react-cookies'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { updateOverviewProductsParams, getProductsByStatus } from '../../store/product'
import ProductsRender from './ProductsRender'

const Products = () => {
  const [activeKey, setActiveKey] = useState<'approved' | 'pending' | 'rejected'>(
    cookie.load('status') || 'approved',
  )
  const { t } = useTranslation('translation', { keyPrefix: 'addProduct' })
  const { overviewParams } = useSelector((state: RootState) => state.products)
  const dispatch = useDispatch()

  const changeStatus = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
    status: 'approved' | 'pending' | 'rejected',
  ) => {
    e.preventDefault()
    setActiveKey(status)
    cookie.save('status', status, { path: '/' })
  }
  useEffect(() => {
    dispatch(updateOverviewProductsParams({ ...overviewParams, status: activeKey }))
  }, [activeKey])

  useEffect(() => {
    dispatch(getProductsByStatus())
  }, [overviewParams])

  return (
    <div className='products'>
      <h2>{t('yourProducts')}</h2>
      <hr />
      <CNav variant='pills' role='tablist'>
        <CNavItem>
          <CNavLink
            href=''
            active={activeKey === 'approved'}
            onClick={(e) => changeStatus(e, 'approved')}
          >
            {t('approved')}
          </CNavLink>
        </CNavItem>

        <CNavItem>
          <CNavLink
            href=''
            active={activeKey === 'rejected'}
            onClick={(e) => changeStatus(e, 'rejected')}
          >
            {t('rejected')}
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane role='tabpanel' aria-labelledby='home-tab' visible={activeKey === 'approved'}>
          {activeKey === 'approved' && <ProductsRender status={activeKey} />}
        </CTabPane>

        <CTabPane role='tabpanel' aria-labelledby='contact-tab' visible={activeKey === 'rejected'}>
          {activeKey === 'rejected' && <ProductsRender status={activeKey} />}
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default Products
