import { ParamsType } from '../types'

export const setDate = (days: number = 0): string => {
  let date = new Date(Date.now() - 1000 * 60 * 60 * 24 * days)
  const formattedDate = Intl.DateTimeFormat('en', {
    month: '2-digit',
    year: 'numeric',
    day: '2-digit',
  }).format(date)
  return formattedDate
}

export const updateParamsHelper = (currentParams: ParamsType, currentPage: number): ParamsType => {
  return { ...currentParams, offset: currentParams.limit! * (currentPage - 1) }
}

export function isValidJSON(value: string) {
  try {
    if (typeof value !== 'string') {
      value = JSON.stringify(value) // Optional: convert if it's already an object
    }
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}
