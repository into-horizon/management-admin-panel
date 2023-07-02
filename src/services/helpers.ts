export const setDate = (days: number = 0) : string => {
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  let date = new Date(Date.now() - 1000 * 60 * 60 * 24 * days)
  return `${date.getFullYear()}-${months[date.getMonth()]}-${date.getDate()}`
}