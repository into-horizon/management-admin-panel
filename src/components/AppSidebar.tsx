import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CImage, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { RootState } from 'src/store'
import { logo } from 'src/enviroment'

const AppSidebar = () => {
  const dispatch = useDispatch()
  // const unfoldable = useSelector((state: RootState) => state?.sidebarUnfoldable)
  const sidebarShow = useSelector((state: RootState) => state.changeState.sidebarShow)

  return (
    <CSidebar
      position='fixed'
      // unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className='d-none d-md-flex'>
        <CImage className='sidebar-brand-full' src={logo} height={35} />
        <CIcon className='sidebar-brand-narrow' icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className='d-none d-lg-flex' onClick={() => dispatch({ type: 'set' })} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
