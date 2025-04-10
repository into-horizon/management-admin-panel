import React, { Children, useEffect } from 'react'

import {
  CAvatar,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
  CImage,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilCart,
  cilBarcode,
  cilGift,
} from '@coreui/icons'
import { useTranslation } from 'react-i18next'

import avatar1 from '../../assets/images/avatars/1.jpg'
import avatar2 from '../../assets/images/avatars/2.jpg'
import avatar3 from '../../assets/images/avatars/3.jpg'
import avatar4 from '../../assets/images/avatars/4.jpg'
import avatar5 from '../../assets/images/avatars/5.jpg'
import avatar6 from '../../assets/images/avatars/6.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardData } from '../../store/dashboard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { RootState } from '../../store'
const Dashboard = () => {
  const { products, stores, users, itemsSold, orderPlaced, ratedStores, isDashboardLoading } =
    useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' })
  const dispatch = useDispatch()
  const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // const colorLevel = n => {
  //   if (n >= 80) return 'success'
  //   else if (n >= 60) return ''
  //   else if (n >= 50) return 'warning'
  //   else return 'danger'

  // }
  const progressExample: progressGroupExample3Type[] = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    {
      title: 'Pageviews',
      value: '78.706 Views',
      percent: 60,
      color: 'warning',
    },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    {
      title: 'Bounce Rate',
      value: 'Average Rate',
      percent: 40.15,
      color: 'primary',
    },
  ]

  type progressGroupExample1Type = {
    title: string
    value1: number
    value2: number
  }
  const progressGroupExample1: progressGroupExample1Type[] = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2: progressGroupExample3Type[] = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]
  type progressGroupExample3Type = {
    title: string
    icon?: any[]
    percent?: number
    value: string | number
    color?: string
  }
  const progressGroupExample3: progressGroupExample3Type[] = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  type TableType = {
    avatar: {
      src: string
      status: string
    }
    user: { name: string; new: boolean; registered: string }
    country: { name: string; flag: any[] }
    usage: {
      value: number
      period: string
      color: string
    }
    payment: { name: string; icon: any[] }
    activity: string
  }
  const tableExample: TableType[] = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]
  useEffect(() => {
    dispatch(getDashboardData())
  }, [])

  if (isDashboardLoading) {
    return <LoadingSpinner />
  }
  return (
    <>
      <CCard className='mb-4'>
        <CCardBody>
          <CRow className='justify-content-center'>
            <CCol sm={12} md={6} lg={6} xl={4}>
              <CWidgetStatsF
                className='mb-3'
                title='active users'
                value={users}
                icon={<CIcon icon={cilUser} height={24} />}
                color='info'
              />
            </CCol>
            <CCol sm={12} md={6} lg={6} xl={4}>
              <CWidgetStatsF
                className='mb-3'
                title='stores'
                value={stores}
                icon={<CIcon icon={cilPeople} height={24} />}
                color='secondary'
              />
            </CCol>
            <CCol sm={12} md={6} lg={6} xl={4}>
              <CWidgetStatsF
                className='mb-3'
                title='Orders Placed'
                value={orderPlaced}
                color='dark'
                icon={<CIcon icon={cilCart} height={24} />}
              />
            </CCol>
            <CCol sm={12} md={6} lg={6} xl={4}>
              <CWidgetStatsF
                className='mb-3'
                title='items sold'
                value={itemsSold}
                color='success'
                icon={<CIcon icon={cilBarcode} height={24} />}
              />
            </CCol>
            <CCol sm={12} md={6} lg={6} xl={4}>
              <CWidgetStatsF
                className='mb-3'
                title='active products'
                value={products}
                icon={<CIcon icon={cilGift} height={24} />}
                color='primary'
              />
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <h3 className='m-3'>
            <CBadge color='info' className='p-3'>
              top stores
            </CBadge>
          </h3>
          <CRow>
            {Children.toArray(
              ratedStores.map((store) => (
                <CCol md={{ span: 7, offset: 1 }}>
                  <CWidgetStatsF
                    className='mb-3'
                    title={store.store_name}
                    value={`Rating: ${store.store_rating}`}
                    icon={
                      <CImage
                        rounded
                        src={store.store_picture}
                        alt={store.store_name}
                        height={75}
                        width={75}
                      />
                    }
                    // color='dark'
                  />
                </CCol>
              )),
            )}
          </CRow>
        </CCardFooter>
      </CCard>
      <CRow>
        <CCol xs>
          <CCard className='mb-4'>
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className='border-start border-start-4 border-start-info py-1 px-3'>
                        <div className='text-medium-emphasis small'>New Clients</div>
                        <div className='fs-5 fw-semibold'>9,123</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className='border-start border-start-4 border-start-danger py-1 px-3 mb-3'>
                        <div className='text-medium-emphasis small'>Recurring Clients</div>
                        <div className='fs-5 fw-semibold'>22,643</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className='mt-0' />
                  {progressGroupExample1.map((item, index) => (
                    <div className='progress-group mb-4' key={index}>
                      <div className='progress-group-prepend'>
                        <span className='text-medium-emphasis small'>{item.title}</span>
                      </div>
                      <div className='progress-group-bars'>
                        <CProgress thin color='info' value={item.value1} />
                        <CProgress thin color='danger' value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>

                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className='border-start border-start-4 border-start-warning py-1 px-3 mb-3'>
                        <div className='text-medium-emphasis small'>Pageviews</div>
                        <div className='fs-5 fw-semibold'>78,623</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className='border-start border-start-4 border-start-success py-1 px-3 mb-3'>
                        <div className='text-medium-emphasis small'>Organic</div>
                        <div className='fs-5 fw-semibold'>49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className='mt-0' />

                  {progressGroupExample2.map((item, index) => (
                    <div className='progress-group mb-4' key={index}>
                      <div className='progress-group-header'>
                        <CIcon className='me-2' icon={item.icon} size='lg' />
                        <span>{item.title}</span>
                        <span className='ms-auto fw-semibold'>{item.value}%</span>
                      </div>
                      <div className='progress-group-bars'>
                        <CProgress thin color='warning' value={Number(item.value)} />
                      </div>
                    </div>
                  ))}

                  <div className='mb-5'></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className='progress-group' key={index}>
                      <div className='progress-group-header'>
                        <CIcon className='me-2' icon={item.icon} size='lg' />
                        <span>{item.title}</span>
                        <span className='ms-auto fw-semibold'>
                          {item.value}{' '}
                          <span className='text-medium-emphasis small'>({item.percent}%)</span>
                        </span>
                      </div>
                      <div className='progress-group-bars'>
                        <CProgress thin color='success' value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align='middle' className='mb-0 border' hover responsive>
                <CTableHead color='light'>
                  <CTableRow>
                    <CTableHeaderCell className='text-center'>
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell className='text-center'>Country</CTableHeaderCell>
                    <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className='text-center'>Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for='item in tableItems' key={index}>
                      <CTableDataCell className='text-center'>
                        <CAvatar size='md' src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className='small text-medium-emphasis'>
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className='text-center'>
                        <CIcon size='xl' icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className='clearfix'>
                          <div className='float-start'>
                            <strong>{item.usage.value}%</strong>
                          </div>
                          <div className='float-end'>
                            <small className='text-medium-emphasis'>{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className='text-center'>
                        <CIcon size='xl' icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className='small text-medium-emphasis'>Last login</div>
                        <strong>{item.activity}</strong>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
