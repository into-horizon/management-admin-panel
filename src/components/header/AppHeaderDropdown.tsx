import React, {  } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { NavLink } from 'react-router-dom'

import { logout } from 'src/store/auth'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'

const AppHeaderDropdown = () => {
  const { first_name, last_name } = useSelector((state: RootState) => state.login.user)
  const dispatch = useDispatch()
  return (
    <CDropdown variant='nav-item'>
      <CDropdownToggle className='py-0' caret={false}>
        <CAvatar color='secondary' size='md'>{`${first_name?.charAt(0).toUpperCase()}${last_name
          ?.charAt(0)
          .toUpperCase()}`}</CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className='pt-0'>
        <CDropdownHeader className='bg-light fw-semibold py-2'>Account</CDropdownHeader>
        <NavLink to='/profile' className='dropdown-item'>
          <CIcon icon={cilUser} className='me-2' />
          Profile
        </NavLink>
        <NavLink to='/settings' className='dropdown-item'>
          <CIcon icon={cilSettings} className='me-2' />
          Settings
        </NavLink>
        <CDropdownDivider />
        <CDropdownItem
          as='button'
          onClick={(e) => {
            e.preventDefault()
            dispatch(logout())
          }}
        >
          <CIcon icon={cilLockLocked} className='me-2' />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
