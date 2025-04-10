import React, { ForwardRefExoticComponent, ReactElement } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { CBadge } from '@coreui/react'
import { RootState } from '../store'

type ItemType = {
  name: string
  component: ForwardRefExoticComponent<any>
  to?: string
  icon?: ReactElement<any, any>
  badge?: { color: string; text?: string }
  items?: ItemType[]
}
export const AppSidebarNav = ({ items }: { items: ItemType[] }) => {
  const location = useLocation()
  const pendingProductsCount = useSelector((state: RootState) => state.products.pending.count)
  const pendingOrdersCount = useSelector((state: RootState) => state.orders.pendingOrders.count)
  const navLink = (
    name: string,
    icon?: ReactElement<any, any>,
    badge?: { color: string; text?: string },
  ) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && name === 'Pending Orders' && pendingOrdersCount > 0 && (
          <CBadge color={badge.color} className='ms-auto'>
            {pendingOrdersCount}
          </CBadge>
        )}
        {badge && name === 'Pending Products' && pendingProductsCount > 0 && (
          <CBadge color={badge.color} className='ms-auto'>
            {pendingProductsCount}
          </CBadge>
        )}
        {badge && badge.text && (
          <CBadge color={badge.color} className='ms-auto'>
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: ItemType, index: number) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
            // className: 'active',
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }
  const navGroup = (item: ItemType, index: number) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={to && location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
