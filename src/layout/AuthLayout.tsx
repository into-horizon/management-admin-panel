import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../store'

const AuthLayout = () => {
  const { loggedIn } = useSelector((state: RootState) => state.login)
  if (loggedIn) {
    return <Navigate to={'/'} />
  }
  return <Outlet />
}

export default AuthLayout
