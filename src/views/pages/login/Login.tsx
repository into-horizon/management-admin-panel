import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginHandler } from '../../../store/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../../store'

type PropTypes = {
  loginHandler?: (p: { password: string; email: string }) => Promise<void>
}
const Login = ({}: PropTypes) => {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'login' })
  const dispatch = useDispatch()
  const login = useSelector((state: RootState) => state.login)

  const navigate = useNavigate()
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      email: HTMLInputElement
      password: HTMLInputElement
    }
    dispatch(
      loginHandler({
        email: target.email.value,
        password: target.password.value,
      })
    )
  }
  return (
    <div className='bg-light min-vh-100 d-flex flex-row align-items-center'>
      <CContainer>
        <CRow className='justify-content-center'>
          <CCol xs={12} sm={8} md={8} lg={6} xl={4}>
            <CCardGroup>
              <CCard className='p-4'>
                <CCardBody>
                  <CForm onSubmit={submitHandler}>
                    <h1>{t('login')}</h1>
                    <p className='text-medium-emphasis'>{t('signin')}</p>
                    <CInputGroup className='mb-3'>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder={t('email')}
                        autoComplete='email'
                        name='email'
                      />
                    </CInputGroup>
                    <CInputGroup className='mb-4'>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type='password'
                        placeholder={t('password')}
                        autoComplete='current-password'
                        name='password'
                      />
                    </CInputGroup>
                    <CRow className='justify-content-between'>
                      <CCol xs='auto'>
                        <CButton
                          color='primary'
                          className='px-4'
                          type='submit'
                          disabled={login.loading}
                        >
                          {login.loading ? (
                            <CSpinner color='light' size='sm' />
                          ) : (
                            t('login')
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs='auto' className='text-right'>
                        <CButton
                          color='link'
                          className='px-0'
                          onClick={() => navigate('/reference')}
                        >
                          {t('forgotPassword')}
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow className='justify-content-center'>
                      <CCol xs='auto'>
                        <CButton
                          color='link'
                          onClick={() =>
                            i18n.changeLanguage(
                              i18n.language === 'en' ? 'ar' : 'en'
                            )
                          }
                        >
                          {i18n.language === 'en' ? 'عربي' : 'English'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>{t('signup')}</h2>
                    <p>
                      {t('registerText')}
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        {t('registerNow')}
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
