import React, { ForwardRefExoticComponent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CBadge } from '@coreui/react'
import { RootState } from 'src/store';

type ItemType = {
  name: string,
  component: ForwardRefExoticComponent<any>,
  to: string,
  icon?: ForwardRefExoticComponent<any>
  badge?: { color: string, text: string }
  items?: ItemType[]
}
export const AppSidebarNav = ({ items }: { items: ItemType[] }) => {
  const location = useLocation()
  const navLink = (name:string,icon?: ForwardRefExoticComponent<any>, badge?: { color: string, text: string }) => {
    return (
      <>
        {icon && icon}
        {name&& name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
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
          className: 'active',
        })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }
  const navGroup = (item :ItemType, index: number) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name,icon)}
        visible={location.pathname.startsWith(to)}
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
