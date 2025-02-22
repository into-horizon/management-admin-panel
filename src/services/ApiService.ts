import axios, { AxiosError, AxiosRequestHeaders } from 'axios'
import cookie from 'react-cookies'
import { ParamsType } from '../types'
import { isJwtExpired } from 'jwt-check-expiration'
import { apiURL, managementApiURL } from '../environment'

axios.defaults.headers.common.locale = 'en'
axios.defaults.timeout = 20000
export default class ApiService {
  constructor() {
    axios.interceptors.request.use(async (config) => {
      config.headers ??= {}
      const locale = localStorage.getItem('i18nextLng') || 'en'
      config.headers.locale = locale
      const token = await this.token()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }
  async get<T = any>(
    path: { management: boolean; endpoint: string } | string,
    params?: ParamsType,
  ) {
    try {
      let res = await axios.get<T>(
        typeof path !== 'string' && path?.management
          ? `${managementApiURL}/${path.endpoint}`
          : `${apiURL}/${path ?? ''}`,
        { params: this.getPopulatedStore(params) },
      )

      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }
  async post<T = any>(
    path: string | { management: boolean; endpoint: string },
    data?: Record<string, any> | undefined | null,
    header?: AxiosRequestHeaders,
    params?: ParamsType,
  ) {
    try {
      let res = await axios.post<T>(
        typeof path !== 'string' && path.management
          ? `${managementApiURL}/${path.endpoint}`
          : `${apiURL}/${path}`,
        data,
        { headers: header, params: this.getPopulatedStore(params) },
      )
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  async put<T = any>(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any },
    headers?: AxiosRequestHeaders,
  ) {
    try {
      const res = await axios.put<T>(
        typeof path !== 'string' && path.management
          ? `${managementApiURL}/${path.endpoint}`
          : `${apiURL}/${path}`,
        data,
        { headers },
      )
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  async patch<T = any>(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any },
  ) {
    try {
      const res = await axios.patch<T>(
        typeof path !== 'string' && path.management
          ? `${managementApiURL}/${path.endpoint}`
          : `${apiURL}/${path}`,
        data,
      )
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  async delete<T = any>(
    path: string | { management: boolean; endpoint: string },
    data?: { [key: string]: any },
  ) {
    try {
      let res = await axios.delete<T>(
        typeof path !== 'string' && path.management
          ? `${managementApiURL}/${path.endpoint}`
          : `${apiURL}/${path}`,
        { data },
      )
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  bearer(token?: string): AxiosRequestHeaders {
    if (!!token && typeof token === 'string') {
      return { Authorization: `Bearer ${token}` }
    } else return {}
  }

  basic(data: { email: string; password: string }) {
    return { Authorization: `Basic ${btoa(`${data.email}:${data.password}`)}` }
  }
  getPopulatedStore(data: { store_id?: string; duration?: string } & ParamsType = {}) {
    const extendedParams = { ...data }
    const store = cookie.load('populated-store')
    const duration = cookie.load('duration')
    if (store) {
      extendedParams.store_id = store.id
    }
    if (duration) {
      extendedParams.duration = duration
    }
    return extendedParams
  }
  async token(): Promise<string | undefined> {
    let token = cookie.load('access_token')
    if (!token) return
    if (!isJwtExpired(token)) {
      return token
    } else {
      return await ApiService.refresh()
    }
  }
  static async refresh() {
    const api = new ApiService()
    try {
      const { refresh_token, access_token, status, message } = await api.post(
        { endpoint: 'refresh', management: true },
        null,
        api.bearer(cookie.load('refresh_token')),
      )
      if (status === 200) {
        cookie.save('access_token', access_token, { path: '/' })
        cookie.save('refresh_token', refresh_token, { path: '/' })
        return access_token
      } else throw new Error(message)
    } catch (error) {
      cookie.remove('access_token', { path: '/' })
      cookie.remove('refresh_token', { path: '/' })
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }
}
