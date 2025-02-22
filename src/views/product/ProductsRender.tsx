import React, { useEffect, ChangeEvent, FormEvent } from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import {
  CButton,
  CFormLabel,
  CRow,
  CCol,
  CAlert,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
// import {
//   addProductPictureHandler,
//   deleteProductPictureHandler,
//   deleteProductHandler,
//   updateOverviewProductsParams,
//   resetOverviewProductsParams,
// } from '../store/product'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  updateSizeAndQuantity,
  updateDiscount,
  addProductPictureHandler,
  deleteProductHandler,
  deleteProductPictureHandler,
  resetOverviewProductsParams,
  updateOverviewProductsParams,
} from '../../store/product'
import Export from '../../components/Export'

import CIcon from '@coreui/icons-react'
import { cilPencil, cilImagePlus, cilWarning, cilExternalLink } from '@coreui/icons'
import Paginator from '../../components/Paginator'
import DiscountModal from './components/DiscountModal'
import SizeAndColorModal from './components/SizeAndColorModal'
import DeleteProductModal from './components/DeleteProductModal'
import StatusModal from './components/StatusModal'
import FilterCard from '../../components/FilterCard'
import FormButtons from '../../components/FormButtons'
import LoadingSpinner from '../../components/LoadingSpinner'
import { updateParamsHelper } from '../../services/helpers'
import { RootState } from '../../store'
import { ParamsType, QuantityDetailsType } from '../../types'
import ProductService from '../../services/ProductService'
import FormBody from './components/FormBody'
// import Product from '../services/ProductService'
// import FilterCard from '../components/FilterCard'
// import FormButtons from '../components/FormButtons'
// import FormBody from './components/FormBody'
// import { RootState } from '../store'
// import { ParamsType, QuantityDetailsType } from '../types'
// import { updateParamsHelper } from '../services/helpers'
// import LoadingSpinner from '../components/LoadingSpinner'

type PropTypes = {
  addProductPictureHandler: (p: FormData) => Promise<void>
  deleteProductPictureHandler: (id: { picture_id: string }) => Promise<void>
  updateSizeAndQuantity: (p: {
    id: string
    quantity: number
    size_and_color: string | null
  }) => Promise<void>
  updateDiscount: (p: { id: string; discount: boolean; discount_rate: number }) => Promise<void>
  deleteProductHandler: (id: { id: string }) => Promise<void>
  status: 'approved' | 'pending' | 'rejected'
}
const ProductsRender = ({
  addProductPictureHandler,
  deleteProductPictureHandler,
  updateSizeAndQuantity,
  updateDiscount,
  deleteProductHandler,
  status,
}: PropTypes) => {
  const navigate = useNavigate()
  const {
    overview: { count, data: products },
    overviewParams,
    isLoading,
  } = useSelector((state: RootState) => state.products)
  const dispatch = useDispatch()

  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'addProduct',
  })

  const completeArray = (x: number) => {
    let arr: { product_picture: string | null; id: string }[] = []
    for (let i = 0; i < 5 - x; i++) {
      arr.push({ id: 'i' + 1, product_picture: null })
    }
    return arr
  }
  const addProductPicture = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    let formData = new FormData()
    formData.append('image', e.target.files?.[0]!)
    formData.append('id', id)
    addProductPictureHandler(formData)
  }
  const changeBtnAlign = () => {
    let deleteBtn = document.querySelectorAll('.deleteBtn')
    if (i18n.language === 'ar' && deleteBtn.length > 0) {
      let className = deleteBtn[0].className.split(' ').slice(0, 3).join(' ')
      deleteBtn.forEach((button) => button.setAttribute('class', `${className} deleteBtnAr`))
    } else if (i18n.language === 'en' && deleteBtn.length > 0) {
      let className = deleteBtn[0].className.split(' ').slice(0, 3).join(' ')
      deleteBtn.forEach((button) => button.setAttribute('class', `${className} deleteBtnEn`))
    }
  }
  const reverseTitles = () => {
    if (i18n.language === 'ar' && document.querySelectorAll('.productTitles').length > 0) {
      let div = Array.from(
        document.getElementsByClassName('productTitles') as HTMLCollectionOf<HTMLElement>,
      )

      // let div = document.querySelectorAll(".productTitles") as HTMLCollectionOf<HTMLElement>;
      div.forEach((item) => (item.style.flexDirection = 'row-reverse'))
    } else if (i18n.language === 'en' && document.querySelectorAll('.productTitles').length > 0) {
      let div = Array.from(
        document.getElementsByClassName('productTitles') as HTMLCollectionOf<HTMLElement>,
      )
      div.forEach((item) => (item.style.flexDirection = ''))
    }
  }

  useEffect(() => {
    reverseTitles()
    changeBtnAlign()
  }, [i18n.language])

  useEffect(() => {
    changeBtnAlign()
    reverseTitles()
  }, [document.querySelectorAll('.deleteBtn')])

  const getProducts = async (params?: ParamsType) => {
    let {
      data: { data },
    } = await ProductService.getProducts(params)
    return data
  }
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    type QueriesType = {
      key: HTMLInputElement
      parent_category_id: HTMLSelectElement
      child_category_id: HTMLSelectElement
      grandchild_category_id: HTMLSelectElement
      discount: HTMLSelectElement
    }
    const target = e.target as typeof e.target & QueriesType
    let queries: string[] = [
      'key',
      'parent_category_id',
      'child_category_id',
      'grandchild_category_id',
      'discount',
    ]
    const data = { ...overviewParams }
    queries.forEach((query) => {
      if (
        target[query as keyof QueriesType].value &&
        target[query as keyof QueriesType].value !== ''
      ) {
        data[query] = target[query as keyof QueriesType].value
      }
    })
    dispatch(updateOverviewProductsParams(data))
  }
  const onReset = (e: FormEvent<HTMLFormElement>) => {
    e.currentTarget.reset()
    dispatch(resetOverviewProductsParams())
  }

  const onPageChange = (n: number) => {
    dispatch(updateParamsHelper(overviewParams, n))
  }

  return (
    <>
      <CRow xs={{ gutterY: 10 }} className='justify-content-end'>
        <CCol xs='auto'>
          <Export
            data={getProducts}
            params={{ status: status }}
            title='download products'
            fileName='products'
          />
        </CCol>
        <CCol xs={12}>
          <FilterCard>
            <CForm onSubmit={submitHandler} onReset={onReset}>
              <CRow className='justify-content-center align-items-center' xs={{ gutterY: 5 }}>
                <CCol xs='auto'>
                  <CFormInput placeholder='product name' id='key' />
                </CCol>
                <FormBody />
                <CCol xs='auto'>
                  <CFormLabel htmlFor='discount'>discount</CFormLabel>
                  <CFormSelect name='discount' id='discount'>
                    <option value=''>All</option>
                    <option value={'true'}>true</option>
                    <option value={'false'}>false</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12}></CCol>
                <FormButtons />
              </CRow>
            </CForm>
          </FilterCard>
        </CCol>
        {isLoading && (
          <CCol xs={12}>
            <LoadingSpinner />
          </CCol>
        )}
        {!isLoading && products.length === 0 && (
          <h4 className='productStatusHead'>{t(`no${status}`)}</h4>
        )}
        {!isLoading &&
          products?.map((product, idx) => (
            <CRow className='productRender' xs={{ gutterY: 2 }} key={product.entitle + idx}>
              <div className='productTitles'>
                <h3 className='productTitle'>{`${t('englishTitle')}: ${product.entitle}`}</h3>
                <h3 className='productTitle'>{`${t('arabicTitle')}: ${product.artitle}`}</h3>
              </div>
              <div className='productPictures'>
                {React.Children.toArray(
                  product.pictures.length > 0 || status !== 'pending' ? (
                    [...product.pictures, ...completeArray(product.pictures.length)]?.map(
                      (picture, i) => (
                        <div style={{ position: 'relative', width: 'fit-content' }}>
                          {picture.product_picture ? (
                            <>
                              <CButton
                                color='light'
                                className='deleteBtn'
                                onClick={() =>
                                  deleteProductPictureHandler({
                                    picture_id: picture.id!,
                                  })
                                }
                                style={{
                                  visibility: status === 'pending' ? 'hidden' : 'visible',
                                }}
                              >
                                X
                              </CButton>
                              <img
                                key={`pic${picture.id}`}
                                src={picture.product_picture}
                                alt='vbdf'
                              />
                            </>
                          ) : (
                            <>
                              <input
                                type='file'
                                id={product.id}
                                hidden
                                onChange={(e) => addProductPicture(e, product.id)}
                                accept='image/png,image/jpeg'
                              />
                              <label
                                htmlFor={product.id}
                                className='uploadLabel'
                                style={{
                                  visibility: status === 'pending' ? 'hidden' : 'visible',
                                }}
                              >
                                <CIcon icon={cilImagePlus}></CIcon>
                                {t('choosePhoto')}
                              </label>
                            </>
                          )}
                        </div>
                      ),
                    )
                  ) : (
                    <h2>{t('noPictures')}</h2>
                  ),
                )}
              </div>
              <CAlert
                color='danger'
                className='d-flex align-items-center'
                visible={!!product.rejection_reason}
                style={{ marginTop: '1rem' }}
              >
                <CIcon icon={cilWarning} className='flex-shrink-0 me-2' width={24} height={24} />
                <div>
                  <strong>Rejection reason: </strong>
                  {`${product.rejection_reason}`}
                </div>
              </CAlert>
              <div className='productTitles'>
                <div>
                  <h4>{t('englishDescrition')}</h4>
                  <p style={{ textAlign: 'left' }}>{product.endescription}</p>
                </div>
                <div>
                  <h4>{t('arabicDescription')}</h4>
                  <p style={{ textAlign: 'right' }}>{product.ardescription}</p>
                </div>
              </div>
              {product.store_name && (
                <h5>
                  <strong>Store: </strong>
                  {product.store_name}
                </h5>
              )}
              {product.metatitle && (
                <h5>
                  <strong>{t('metatitle')}: </strong>
                  {product.metatitle}
                </h5>
              )}
              {product.sku &&
                ((i18n.language === 'en' && (
                  <h5>
                    <strong>{t('SKU')}:</strong>
                    {product.sku}
                  </h5>
                )) ||
                  (i18n.language === 'ar' && (
                    <h5>
                      {product.sku}
                      <strong> :{t('SKU')}</strong>
                    </h5>
                  )))}
              {!product.size_and_color ? (
                <h5>
                  <strong>{t('quantity')}: </strong>
                  {product.quantity}
                </h5>
              ) : null}
              <h6>
                <strong>{`${t('parentCategory')}: `}</strong>
                {product.p_entitle}
              </h6>
              <h6>
                <strong>{`${t('childCategory')}:`}</strong> {product.c_entitle}
              </h6>
              {product.grandchild_category_id && (
                <h6>
                  <strong>{`${t('grandChildCategory')}:`}</strong> {product.g_entitle}
                </h6>
              )}
              <h6>
                <strong>{`${t('price')}:`}</strong> {product.price + ' ' + t(`${product.currency}`)}
              </h6>
              <h6>
                <strong>Commission per sold item</strong>{' '}
                {(product.price * product.commission).toFixed(2) + ' ' + t(`${product.currency}`)}
              </h6>
              {product.brand_name ? (
                <h6>
                  <strong>{`${t('brandName')}: `}</strong>
                  {product.brand_name}
                </h6>
              ) : null}
              {product.rate ? (
                <h6>
                  <strong>{`Rate: `}</strong>
                  {(+product.rate).toFixed(2)}
                  <CButton color='link' onClick={() => navigate(`/product/reviews/${product.id}`)}>
                    <CIcon icon={cilExternalLink} />
                    Reviews
                  </CButton>
                </h6>
              ) : null}
              <h6>
                <strong>{t('hasDiscount')}: </strong>
                {product.discount ? t('yes') : t('no')}
              </h6>
              {product.discount ? (
                <h6>
                  <strong>{t('discountRate')}: </strong>
                  {product.discount_rate * 100}%
                </h6>
              ) : null}
              {product.size_and_color ? (
                <div>
                  <h6>
                    <strong>{t('sizes')}:</strong>
                  </h6>
                  <table className='sizesTable'>
                    <thead>
                      <tr>
                        {JSON.parse(product.size_and_color)
                          .map((val: QuantityDetailsType) => val.color)
                          .filter((val: QuantityDetailsType) => val).length > 0 && <th>Color</th>}
                        {JSON.parse(product.size_and_color)
                          .map((val: QuantityDetailsType) => val.size)
                          .filter((val: QuantityDetailsType) => val).length > 0 && (
                          <th>{t('size')}</th>
                        )}
                        <th>{t('quantity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {React.Children.toArray(
                        JSON.parse(product.size_and_color).map((val: QuantityDetailsType) => (
                          <tr key={Math.random()}>
                            {val.color && <td>{val.color}</td>}
                            {val.size && <td>{val.size}</td>}
                            <td>{val.quantity}</td>
                          </tr>
                        )),
                      )}
                    </tbody>
                    <thead>
                      <tr>
                        <th>{t('totalQuantity')}</th>
                        <th>{product.quantity}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              ) : null}
              {status !== 'pending' && (
                <CRow className='justify-content-between'>
                  <CCol xs='auto'>
                    <DiscountModal data={product} updateDiscount={updateDiscount} />
                  </CCol>
                  <CCol xs='auto'>
                    <DeleteProductModal
                      deleteHandler={() => deleteProductHandler({ id: product.id })}
                      product={product}
                    />
                  </CCol>

                  <CCol xs='auto'>
                    <SizeAndColorModal
                      product={product}
                      updateSizeAndQuantity={updateSizeAndQuantity}
                    />
                  </CCol>
                  <CCol xs='auto'>
                    <StatusModal product={product} />
                  </CCol>
                  <CCol xs='auto'>
                    <CButton
                      color='primary'
                      onClick={() => {
                        navigate(`/product/updateProduct?id=${product.id}`)
                      }}
                    >
                      <CIcon icon={cilPencil}></CIcon>
                      {t('editProduct')}
                    </CButton>
                  </CCol>
                </CRow>
              )}
            </CRow>
          ))}
        <Paginator
          count={count}
          params={overviewParams}
          pageNumber={overviewParams.offset! + 1}
          pageSize={overviewParams.limit}
          onPageChange={onPageChange}
          cookieName={status}
        />
      </CRow>
    </>
  )
}

const mapDispatchToProps = {
  addProductPictureHandler,
  deleteProductPictureHandler,
  updateSizeAndQuantity,
  updateDiscount,
  deleteProductHandler,
}
export default connect(null, mapDispatchToProps)(ProductsRender)
