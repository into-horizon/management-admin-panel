import cookie from 'react-cookies'
import { isJwtExpired } from 'jwt-check-expiration'
import { ParamsType } from 'src/types'

export const setDate = (days: number = 0): string => {
  let date = new Date(Date.now() - 1000 * 60 * 60 * 24 * days)
  const formattedDate = Intl.DateTimeFormat('en', {
    month: '2-digit',
    year: 'numeric',
    day: '2-digit',
  }).format(date)
  return formattedDate
}

export const isTokenValid = (): boolean => {
  let token = cookie.load('access_token')
  return isJwtExpired(token)
}

export const updateParamsHelper = (currentParams: ParamsType, currentPage: number): ParamsType => {
  return { offset: currentParams.limit! * (currentPage - 1) }
}
