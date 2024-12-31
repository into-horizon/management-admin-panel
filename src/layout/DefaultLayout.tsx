import React, { useEffect } from 'react'
import { CContainer } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import { RootState } from 'src/store'
import { ProductType } from 'src/types'
import { notifications, products, socket } from 'src/socket'
import { events } from 'src/App'
import { getNotifications } from 'src/store/notification'
import { updateToast } from 'src/store/globalToasts'
import { DialogResponseTypes } from 'src/enums'
import { DraggableFilter } from 'src/components/DraggableFilter'

const DefaultLayout = () => {
  const { user, loggedIn } = useSelector((state: RootState) => state.login)
  const dispatch = useDispatch()
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
          <DraggableFilter />
          <CContainer lg>
            <Outlet />
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
