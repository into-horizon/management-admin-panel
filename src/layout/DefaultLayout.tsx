import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTooltip,
} from '@coreui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import Draggable from 'react-draggable'
import { cilFilterSquare, cilCursorMove, cilFilter, cilFilterX } from '@coreui/icons'
import SearchDropdown from 'src/components/SearchDropdown'
import { searchForStore } from '../store/store'
import { populateStore } from 'src/store/filter'
import { RootState } from 'src/store'
import { ProductType, StoreType } from 'src/types'
import { setDate as _setDate } from '../services/helpers'
import { notifications, products, socket } from 'src/socket'
import { events } from 'src/App'
import { getNotifications } from 'src/store/notification'
import { updateToast } from 'src/store/globalToasts'
import { DialogResponseTypes } from 'src/enums'
type PropTypes = {
  searchForStore(q: { query: string }): Promise<void>
  populateStore: (p?: { store: { id?: string; title?: string }; duration: string }) => void
}
const DefaultLayout = ({ searchForStore, populateStore }: PropTypes) => {
  const [filterVisible, setVisibleFilter] = useState(false)
  const [selectedStore, setSelectedStore] = useState({})
  const { searched } = useSelector((state: RootState) => state.stores)
  const { duration } = useSelector((state: RootState) => state.filter)
  const { user, loggedIn } = useSelector((state: RootState) => state.login)
  const dispatch = useDispatch()
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.currentTarget
    populateStore({
      store: selectedStore,
      duration: `${target.from.value}&${target.to.value}`,
    })
  }
  const resetHandler = (e: FormEvent<HTMLFormElement>) => {
    const target = e.currentTarget
    target.reset()
    populateStore()
  }
  useEffect(() => {
    if (socket && loggedIn && !!user && products) {
      socket.emit('role', user.role)
      products.on('connect', () => {
        console.log('user connected')
      })
      notifications.on('connect', () => {
        console.log('user connected')
      })
      products.emit('products:role', user.role)
      notifications.emit('notifications:role', user.role)
      notifications.on('admin:notifications', () => {
        console.log('notification received')
        dispatch(getNotifications({ limit: 5, offset: 0 }))
        dispatch(
          updateToast({
            message: 'you have new notifications',
            type: DialogResponseTypes.INFO,
          }),
        )
      })
      products.on('products:updateStatus', (data: ProductType) => {
        events.emit('pending')
        return new Notification(`${data.entitle} status has been updated to ${data.status}`)
      })
    }
  }, [socket, products, notifications, loggedIn, user.id])

  if (!loggedIn) {
    return <Navigate to={'/login'} />
  }
  return (
    <div>
      <AppSidebar />
      <div className='wrapper d-flex flex-column min-vh-100 bg-light'>
        <AppHeader />
        <div className='body flex-grow-1 px-3'>
          <Draggable handle='strong' axis='y'>
            <div className='filter'>
              <CRow className='justify-content-center' xs={{ gutterY: 3 }}>
                <CCol xs={12}>
                  <CTooltip content='move'>
                    <strong style={{ margin: 'auto', textAlign: 'center' }} className='cursor move'>
                      <div>
                        <CIcon style={{ margin: 'auto' }} icon={cilCursorMove} size='lg' />
                      </div>
                    </strong>
                  </CTooltip>
                </CCol>
                <CCol xs={12} style={{ justifyContent: 'center', display: 'flex' }}>
                  <CTooltip content='select seller'>
                    <CButton color='info' size='lg' onClick={() => setVisibleFilter((x) => !x)}>
                      <CIcon icon={cilFilterSquare} size='xl' />
                    </CButton>
                  </CTooltip>
                </CCol>
                {filterVisible && (
                  <CForm onSubmit={submitHandler} onReset={resetHandler}>
                    <CRow className='justify-content-center' xs={{ gutterY: 3 }}>
                      <CCol xs={10}>
                        <SearchDropdown
                          options={searched.map((store: StoreType) => {
                            return { id: store.id, title: store.store_name }
                          })}
                          placeholder='search for store by store name, email or mobile number'
                          onChange={(e) => searchForStore({ query: e })}
                          onSelect={(e) => setSelectedStore(e)}
                          loading={false}
                        />
                      </CCol>
                      <CRow className='justify-content-center'>
                        <CCol xs='auto'>
                          <CFormLabel htmlFor='from'>from</CFormLabel>
                          <CFormInput
                            name='from'
                            type='date'
                            defaultValue={duration?.split('&')[0]}
                            max={_setDate()}
                          />
                        </CCol>
                        <CCol xs='auto'>
                          <CFormLabel htmlFor='to'>to</CFormLabel>
                          <CFormInput
                            name='to'
                            type='date'
                            defaultValue={duration?.split('&')[1]}
                            max={_setDate()}
                          />
                        </CCol>
                      </CRow>
                      <CCol xs='auto'>
                        <CTooltip content='apply filter'>
                          <CButton type='submit'>
                            <CIcon icon={cilFilter} />
                          </CButton>
                        </CTooltip>
                      </CCol>
                      <CCol xs='auto'>
                        <CTooltip content='clear filter'>
                          <CButton color='secondary' type='reset'>
                            <CIcon icon={cilFilterX} />
                          </CButton>
                        </CTooltip>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </CRow>
            </div>
          </Draggable>
          <CContainer lg>
            <Outlet />
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default connect(null, { searchForStore, populateStore })(DefaultLayout)
