import { createContext, useContext, useEffect, useState } from 'react'
import { DialogResponseTypes } from '../enums'
import { products, notifications, socket } from '../socket'
import { updateToast } from '../store/globalToasts'
import { getNotifications } from '../store/notification'
import { ProductType } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import EventEmitter from 'events'

interface SocketContextType {
  events?: EventEmitter
}

const events = new EventEmitter()

export const SocketContext = createContext<SocketContextType>({
  events,
})

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
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
          })
        )
      })
      products.on('products:updateStatus', (data: ProductType) => {
        events.emit('pending')
        return new Notification(
          `${data.entitle} status has been updated to ${data.status}`
        )
      })
    }
  }, [socket, products, notifications, loggedIn, user.id])

  return (
    <SocketContext.Provider value={{ events }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
