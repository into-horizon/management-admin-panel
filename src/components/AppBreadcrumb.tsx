import React from 'react'
import { RouteObject, useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { flatNav } from '../_nav'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname.slice(1)

  const getRouteName = (pathname: string, routes: RouteObject[]) => {
    const currentRoute =
      flatNav.find((route) => route.to?.replace('/', '') === pathname) ??
      flatNav.find((route) =>
        route.to?.replace('/', '')?.startsWith(pathname)
      ) ??
      flatNav.find((route) => route?.to.replace('/', '') === '*')
    return currentRoute?.name
  }

  const getBreadcrumbs = (location: string) => {
    const breadcrumbs: { pathname: string; name?: string; active: boolean }[] =
      []
    const curr: string[] = []
    location
      .split('/')
      ?.forEach((prev: string, index: number, array: string[]) => {
        const regexExp =
          /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
        if (regexExp.test(prev)) return ''
        curr.push(prev)
        breadcrumbs.push({
          pathname: curr.join('/'),
          name: getRouteName(curr.join('/'), routes),
          active: index + 1 === array.length ? true : false,
        })
      })
    return breadcrumbs.filter(
      (breadcrumb, i, self) =>
        i === self.findIndex((b) => b.name === breadcrumb.name)
    )
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className='m-0 ms-2'>
      <CBreadcrumbItem href='/'>{'Home'}</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active
              ? { active: true }
              : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
