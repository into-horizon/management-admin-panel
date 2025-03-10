import React, { useState, useEffect, FC, FormEvent, ChangeEvent } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { validateTokenHandler, resetPasswordHandler } from '../../../store/auth'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'

type PropTypes = {
  load?: Function
}

const ResetPassword: FC<PropTypes> = ({ load }) => {
  const { token } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { message, loggedIn } = useSelector((state: RootState) => state.login)
  const [msg, setMsg] = useState<string | { title: string; details?: string[] }>('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [validToken, setValidToken] = useState(false)

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.password.value !== form.rPassword.value) {
      setMsg('passwords don`t match, please check again')
      return
    }

    dispatch(resetPasswordHandler(token!, form.password.value))
    form.reset()
  }

  const messageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (password === e.target.value) {
      setMsg('')
    } else {
      setMsg('password does not match')
    }
  }

  // useEffect(() => {
  //   if (message === 'valid') {
  //     setMsg('')
  //     setValidToken(true)
  //   } else if (message?.title) {
  //     setMsg(message)
  //   } else if (message?.includes('invalid')) {
  //     setMsg(`expired has link`)
  //   } else if (message?.includes('expired')) {
  //     setMsg(message)
  //   } else if (message?.includes('reset')) {
  //     setMsg(message)
  //   }
  //   dispatch(deleteMessage())
  //   setLoading(false)
  // }, [message])

  useEffect(() => {
    load?.(true)
    if (loggedIn) {
      navigate('/')
    }
    load?.(false)

    dispatch(validateTokenHandler(token!))
  }, [])

  const ErrorHandler = ({ title, details }: { title: string; details?: string[] }) => {
    return (
      <React.Fragment>
        <h5>{title}</h5>
        <ol>
          {details?.map((value, idx) => (
            <li key={`li${idx}`}>{value}</li>
          ))}
        </ol>
      </React.Fragment>
    )
  }
  return (
    <div className='bg-light min-vh-100 d-flex flex-row align-items-center'>
      {loggedIn ? (
        <CSpinner color='primary' />
      ) : (
        <CContainer>
          <CRow className='justify-content-center'>
            <CCol md={9} lg={7} xl={6}>
              {loading ? (
                <CSpinner color='primary' />
              ) : (
                <CCard className='mx-4'>
                  <CCardBody className='p-4'>
                    <CForm onSubmit={submitHandler}>
                      <h1>{!validToken && typeof msg === 'string' ? msg : 'Reset Password'}</h1>
                      {validToken && (
                        <>
                          <p className='text-medium-emphasis'>Reset Your Password</p>
                          <CInputGroup className='mb-3'>
                            <CInputGroupText>
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                              placeholder='Enter Password'
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              id='password'
                              type='password'
                              required
                            />
                          </CInputGroup>
                          <CInputGroup className='mb-3'>
                            <CInputGroupText>
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                              placeholder='Repeat your password'
                              id='rPassword'
                              type='password'
                              required
                              onChange={messageHandler}
                            />
                            {/* <CButton onClick={sendCode}>Resend code</CButton> */}
                          </CInputGroup>
                          {typeof msg !== 'string' ? (
                            <ErrorHandler title={msg.title} details={msg.details} />
                          ) : (
                            <p style={{ fontWeight: 'bold' }}>{msg}</p>
                          )}
                          <div className='d-grid'>
                            <CButton type='submit' color='info'>
                              Reset Password
                            </CButton>
                          </div>
                        </>
                      )}
                    </CForm>
                    <div className='d-grid'>
                      <CButton color='link' onClick={() => navigate('/login')}>
                        Login
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              )}
            </CCol>
          </CRow>
        </CContainer>
      )}
    </div>
  )
}

export default ResetPassword
