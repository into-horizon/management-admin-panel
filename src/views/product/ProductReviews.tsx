import React, { Children, useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CCard,
  CRow,
  CCol,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CSpinner,
} from '@coreui/react'
import StarRatings from 'react-star-ratings'
import CIcon from '@coreui/icons-react'
import { cilChevronDoubleLeft } from '@coreui/icons'
import Paginator from '../../components/Paginator'
import { RootState } from '../../store'
import { getProductReviews } from '../../store/product'
import { GetFunctionType, ParamsType } from '../../types'
type PropTypes = {
  getProductReviews: GetFunctionType
}
export const ProductReviews = ({ getProductReviews }: PropTypes) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<ParamsType>({ limit: 10, offset: 0 })
  const {
    reviews: { data, count },
  } = useSelector((state: RootState) => state.products)
  const { id } = useParams()
  useEffect(() => {
    getProductReviews({ id: id!, ...params }).then(() => setLoading(false))
  }, [id])
  return loading ? (
    <CSpinner color='primary' />
  ) : (
    <>
      <CRow className='justify-content-end'>
        <CCol xs='auto'>
          <CButton onClick={() => navigate(-1)} color='secondary' size='lg'>
            <CIcon icon={cilChevronDoubleLeft} size='lg' />
            Back
          </CButton>
        </CCol>
      </CRow>
      <CRow className='justify-content-center'>
        {Children.toArray(
          data.map((review) => (
            <CCol xs={12}>
              <CCard className='mb-3' style={{ maxWidth: '540px' }}>
                <CRow className='g-0'>
                  <CCol xs={4}>
                    <CCardImage src={review.profile_picture} />
                  </CCol>
                  <CCol xs={8}>
                    <CCardBody>
                      <CCardTitle>{`${review.first_name} ${review.last_name}`}</CCardTitle>
                      <CCardText>{review.review}</CCardText>
                      <StarRatings
                        rating={review.rate}
                        starDimension='20px'
                        starSpacing='5px'
                        starRatedColor='yellow'
                      />
                      <CCardText>
                        <small className='text-medium-emphasis'>
                          {new Date(review.created_at).toLocaleDateString()}
                        </small>
                      </CCardText>
                    </CCardBody>
                  </CCol>
                </CRow>
              </CCard>
            </CCol>
          )),
        )}
      </CRow>
      <Paginator
        cookieName='reviews'
        count={count}
        changeData={getProductReviews}
        params={params}
        updateParams={setParams}
        updateLoading={setLoading}
      />
    </>
  )
}

const mapDispatchToProps = { getProductReviews }

export default connect(null, mapDispatchToProps)(ProductReviews)
