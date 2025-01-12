import React, { Children, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch, connect } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CAlert,
  CListGroupItem,
  CListGroup,
  CCol,
  CRow,
  CBadge,
  CSpinner,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
// import { logo } from 'src/assets/brand/logo'
import { populateStore } from 'src/store/filter'
import { RootState } from 'src/store'
import _ from 'lodash'
import { getNotifications, updateNotificationsAsSeen } from 'src/store/notification'
import { logo } from 'src/enviroment'

type PropTypes = {
  populateStore: () => void
}
const AppHeader = ({ populateStore }: PropTypes) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState<boolean>(false)
  const {
    data: notifications,
    count,
    loading,
    types: notificationTypes,
  } = useSelector((state: RootState) => state.notifications)
  const dropdown = useRef<HTMLDivElement>(null)
  const sidebarShow = useSelector((state: RootState) => state.changeState.sidebarShow)
  const { store } = useSelector((state: RootState) => state.filter)
  const onClose = () => {
    populateStore()
  }

  const notificationActions = {
    [notificationTypes?.PRODUCT]: (id: string) => `/product/products?id=${id}`,
    [notificationTypes?.ORDER]: (id: string) => `/order/overview?id=${id}`,
    [notificationTypes?.ORDER_ITEM]: (id: string) => `/order/overview?id=${id}`,
    [notificationTypes?.STORE]: (id: string) => `/seller/overview?id=${id}`,
  } as const

  const notificationsPaths = {
    [notificationTypes?.OVERALL_PENDING_ORDERS]: '/order/pendingOrders',
    [notificationTypes?.OVERALL_PENDING_PRODUCTS]: '/product/pending',
  }
  useEffect(() => {
    if (visible) {
      document.addEventListener('click', (e) => {
        if (!dropdown?.current?.contains(e.target as Node)) {
          setVisible(false)
        }
      })
    } else {
      document.removeEventListener('click', (e) => {
        if (!dropdown?.current?.contains(e.target as Node)) {
          setVisible(false)
        }
      })
    }
  }, [visible])

  useEffect(() => {
    if (visible) {
      updateNotificationsAsSeen()
    }
  }, [notifications])
  useEffect(() => {
    dispatch(getNotifications({ offset: 0, limit: 10 }))
  }, [])
  const notificationButtonClickHandler = () => {
    setVisible(!visible)
    dispatch(updateNotificationsAsSeen())
  }
  return (
    <CHeader position='sticky' className='mb-4'>
      <CContainer fluid>
        <CHeaderToggler
          className='ps-1'
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size='lg' />
        </CHeaderToggler>
        <CHeaderBrand className='mx-auto d-md-none'>
          <CImage src={logo} height={48} />
        </CHeaderBrand>
        <CHeaderNav className='d-none d-md-flex me-auto'>
          <CNavItem>
            <CNavLink to='/dashboard' component={NavLink} className='active'>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CAlert color='info' dismissible className='m-auto' visible={!!store?.id} onClose={onClose}>
          {`Populated store: ${store?.title ?? 'store'}`}
        </CAlert>
        <CHeaderNav>
          <CNavItem className='position-relative'>
            <div ref={dropdown}>
              <CNavLink
                component='button'
                className=' border-0 bg-transparent p-1'
                onClick={() => notificationButtonClickHandler()}
              >
                {count > 0 && (
                  <CBadge color='danger' position='top-end' shape='rounded-pill'>
                    {count}
                    <span className='visually-hidden'>unread messages</span>
                  </CBadge>
                )}
                <CIcon icon={cilBell} size='lg' />
              </CNavLink>
              {visible && (
                <CListGroup className='position-absolute end-0 notification-list'>
                  {Children.toArray(
                    notifications.map((notification) => (
                      <Link
                        to={
                          notification.item_id
                            ? notificationActions[
                                notification.type as keyof typeof notificationActions
                              ](notification.item_id)
                            : notificationsPaths[
                                notification.type as keyof typeof notificationsPaths
                              ]
                        }
                        className='w-15 list-group-item list-group-item-action'
                        onClick={() => setVisible(false)}
                      >
                        <CRow className='justify-content-between'>
                          <CCol xs={12}>
                            <p className='text-align-left m-0'>
                              <span>{notification.text}</span>
                            </p>
                          </CCol>
                          <CCol xs={12}>
                            <p className='m-0 text-align-right'>
                              <sub>
                                {Intl.DateTimeFormat('en', {
                                  minute: '2-digit',
                                  hourCycle: 'h12',
                                  hour: '2-digit',
                                }).format(new Date(notification.created_at))}
                              </sub>
                            </p>
                          </CCol>
                        </CRow>
                      </Link>
                    )),
                  )}
                  <CListGroupItem
                    component='button'
                    className='text-align-center'
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(
                        getNotifications({
                          offset: notifications.length,
                          limit: 10,
                        }),
                      )
                    }}
                    disabled={loading}
                  >
                    {loading ? <CSpinner color='primary' /> : 'show more'}
                  </CListGroupItem>
                </CListGroup>
              )}
            </div>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className='ms-3'>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default connect(null, { populateStore })(AppHeader)
