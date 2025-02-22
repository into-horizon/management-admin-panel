import React, { useRef, useState } from 'react'
import Logo from '../assets/images/h.png'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  CButton,
  CCol,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CButtonGroup,
  CFormCheck,
  CTooltip,
} from '@coreui/react'
import Table from './Table'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilDescription } from '@coreui/icons'
import { OrderType, OrderItemType, ParamsType } from '../types'

const Pdf = ({ order }: { order: OrderType }) => {
  const template = useRef<HTMLDivElement>(null)
  const [locale, setLocale] = useState<'en' | 'ar'>('en')
  const [visible, setVisible] = useState<boolean>(false)

  type DetailedLocType = {
    [key: string]: string
  }
  const localization: { en: DetailedLocType; ar: DetailedLocType } = {
    en: {
      orderNumber: 'Order#',
      customerName: 'Customer Name',
      grandTotal: 'Grand Total',
      orderDate: 'Order Date',
      shipping: 'Delivery fees',
      productName: 'product name',
      productPrice: 'price',
      productQuantity: 'quantity',
      productColor: 'color',
      productSize: 'size',
      totalPrice: 'total price',
    },
    ar: {
      orderNumber: 'رقم الطلب',
      customerName: 'اسم الزبون',
      grandTotal: 'المجموع الإجمالي',
      orderDate: 'تاريخ الطلب',
      shipping: 'رسوم التوصيل',
      productName: 'اسم المنتج',
      productPrice: 'السعر',
      productQuantity: 'الكمية',
      productColor: 'اللون',
      productSize: 'المقاس',
      totalPrice: 'السعر الكلي',
    },
  }
  const columns = [
    { header: localization[locale].productName, field: `${locale}title` },
    { header: localization[locale].productPrice, field: `price` },
    { header: localization[locale].productQuantity, field: `quantity` },
    { header: localization[locale].productSize, field: `size` },
    { header: localization[locale].productColor, field: `color` },
    {
      header: localization[locale].totalPrice,
      body: (data: OrderItemType) => <span>{data.quantity * data.price}</span>,
    },
  ]
  const printDocument = (count: number) => {
    html2canvas(template!.current!).then((canvas) => {
      const imgData = canvas.toDataURL(Logo)
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'px',
      })
      pdf.addImage(imgData, 'PNG', 0, 0, 650, 200 + 40 * count)
      pdf.save(`${order.customer_order_id}.pdf`)
    })
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)} color='secondary'>
        <CIcon icon={cilDescription} /> Receipt
      </CButton>
      <CModal size='xl' visible={visible} onClose={() => setVisible(false)} scrollable>
        <CModalHeader>
          <CTooltip content='download receipt'>
            <CButton onClick={() => printDocument(order.items.length)} color='secondary'>
              <CIcon icon={cilCloudDownload} size='lg' />
            </CButton>
          </CTooltip>
        </CModalHeader>
        <CButtonGroup
          role='group'
          aria-label='Basic checkbox toggle button group'
          className='m-2-1rem'
        >
          <input
            type='radio'
            className='btn-check'
            name='check'
            id='English'
            onChange={() => setLocale('en')}
            checked={locale === 'en'}
          />
          <label htmlFor='English' className='btn btn-outline-primary'>
            English
          </label>
          <input
            type='radio'
            className='btn-check'
            name='check'
            id='Arabic'
            onChange={() => setLocale('ar')}
            checked={locale === 'ar'}
          />
          <label htmlFor='Arabic' className='btn btn-outline-primary'>
            Arabic
          </label>
        </CButtonGroup>
        <CRow ref={template} className='justify-content-right padding' style={{ margin: 'auto 0' }}>
          <CCol
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            style={{ direction: locale === 'en' ? 'ltr' : 'rtl' }}
          >
            <CRow className='justify-content-between' xs={{ gutterY: 5 }}>
              <CCol xs='auto'>
                <img src={Logo} alt='logo' style={{ width: '5rem' }} /> <br />
                <h5 style={{ textAlign: 'center', margin: '0 auto' }}>Horizon</h5>
              </CCol>
              <CCol xs='auto'>
                <h6>
                  {localization[locale]['orderNumber']}:{order?.customer_order_id}
                </h6>
                <h6>
                  {localization[locale]['customerName']}:
                  {`${order?.first_name} ${order?.last_name}`}
                </h6>
                <h6>
                  {localization[locale]['grandTotal']}: {order?.grand_total}
                </h6>
                <h6>
                  {localization[locale]['shipping']}: {order?.shipping}
                </h6>
              </CCol>
              <CCol xs={12}>
                <Table
                  pagination={false}
                  columns={columns}
                  data={order.items}
                  updateLoading={function (value: React.SetStateAction<boolean>): void {
                    throw new Error('Function not implemented.')
                  }}
                  params={{
                    limit: undefined,
                    offset: undefined,
                  }}
                  count={0}
                  changeData={function (p: ParamsType): Promise<void> {
                    throw new Error('Function not implemented.')
                  }}
                  cookieName={''}
                />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CModal>
    </>
  )
}

export default Pdf
