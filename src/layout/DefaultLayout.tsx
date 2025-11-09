import { CContainer } from '@coreui/react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import { RootState } from '../store'
import { DraggableFilter } from '../components/DraggableFilter'
import { SocketProvider } from '../context/SocketContext'

const DefaultLayout = () => {
  const { loggedIn } = useSelector((state: RootState) => state.login)

  if (!loggedIn) {
    return <Navigate to={'/login'} />
  }
  return (
    <SocketProvider>
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
    </SocketProvider>
  )
}

export default DefaultLayout
