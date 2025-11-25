import axios, { AxiosInstance, AxiosError, AxiosRequestHeaders } from 'axios'
import cookie from 'react-cookies'
import { ParamsType } from '../types'
import { isJwtExpired } from 'jwt-check-expiration'
import { apiURL, managementApiURL } from '../environment'

export default class ApiService {
  private static refreshAxiosInstance: AxiosInstance | null = null
  private static isRefreshing = false
  private static refreshPromise: Promise<string | undefined> | null = null

  constructor() {
    // Only setup interceptors once
    if (!ApiService.refreshAxiosInstance) {
      ApiService.refreshAxiosInstance = axios.create()
      this.setupInterceptors()
    }
  }

  private setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      async (config) => {
        config.headers ??= {}

        // Add locale
        const locale = localStorage.getItem('i18nextLng') || 'en'
        config.headers.locale = locale

        // Add auth token (avoid calling this.token() to prevent loop)
        const token = await this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for handling 401 errors
    axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await ApiService.refresh()
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return axios(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, clear cookies
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private async getToken(): Promise<string | undefined> {
    const token = cookie.load('access_token')
    if (!token) return undefined

    if (!isJwtExpired(token)) {
      return token
    }

    // Token expired, refresh it
    return await ApiService.refresh()
  }

  private handleAuthFailure() {
    cookie.remove('access_token', { path: '/' })
    cookie.remove('refresh_token', { path: '/' })
    // Optionally redirect to login
    // window.location.href = '/login'
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      throw new Error(message)
    }
    throw error
  }

  private buildUrl(
    path: string | { management: boolean; endpoint: string }
  ): string {
    if (typeof path === 'string') {
      return `${apiURL}/${path}`
    }
    return path.management
      ? `${managementApiURL}/${path.endpoint}`
      : `${apiURL}/${path.endpoint}`
  }

  async get<T = any>(
    path: { management: boolean; endpoint: string } | string,
    params?: ParamsType
  ): Promise<T> {
    try {
      const res = await axios.get<T>(this.buildUrl(path), {
        params: this.getPopulatedStore(params),
      })
      return res.data
    } catch (error: AxiosError | any) {
      this.handleError(error)
    }
  }

  async post<T = any>(
    path: string | { management: boolean; endpoint: string },
    data?: Record<string, any> | undefined | null,
    header?: AxiosRequestHeaders,
    params?: ParamsType
  ): Promise<T> {
    try {
      const res = await axios.post<T>(this.buildUrl(path), data, {
        headers: header,
        params: this.getPopulatedStore(params),
      })
      return res.data
    } catch (error: AxiosError | any) {
      this.handleError(error)
    }
  }

  async put<T = any>(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any },
    headers?: AxiosRequestHeaders
  ): Promise<T> {
    try {
      const res = await axios.put<T>(this.buildUrl(path), data, { headers })
      return res.data
    } catch (error: AxiosError | any) {
      this.handleError(error)
    }
  }

  async patch<T = any>(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any }
  ): Promise<T> {
    try {
      const res = await axios.patch<T>(this.buildUrl(path), data)
      return res.data
    } catch (error: AxiosError | any) {
      this.handleError(error)
    }
  }

  async delete<T = any>(
    path: string | { management: boolean; endpoint: string },
    data?: { [key: string]: any }
  ): Promise<T> {
    try {
      const res = await axios.delete<T>(this.buildUrl(path), { data })
      return res.data
    } catch (error: AxiosError | any) {
      this.handleError(error)
    }
  }

  bearer(token?: string): AxiosRequestHeaders {
    if (token && typeof token === 'string') {
      return { Authorization: `Bearer ${token}` }
    }
    return {}
  }

  basic(data: { email: string; password: string }): AxiosRequestHeaders {
    return { Authorization: `Basic ${btoa(`${data.email}:${data.password}`)}` }
  }

  getPopulatedStore(
    data: { store_id?: string; duration?: string } & ParamsType = {}
  ): ParamsType {
    const extendedParams = { ...data }
    const store = cookie.load('populated-store')
    const duration = cookie.load('duration')

    if (store?.id) {
      extendedParams.store_id = store.id
    }
    if (duration) {
      extendedParams.duration = duration
    }

    return extendedParams
  }

  async token(): Promise<string | undefined> {
    return this.getToken()
  }

  static async refresh(): Promise<string | undefined> {
    if (ApiService.isRefreshing && ApiService.refreshPromise) {
      return ApiService.refreshPromise
    }

    ApiService.isRefreshing = true
    ApiService.refreshPromise = ApiService.performRefresh()

    try {
      const token = await ApiService.refreshPromise
      return token
    } finally {
      ApiService.isRefreshing = false
      ApiService.refreshPromise = null
    }
  }

  private static async performRefresh(): Promise<string | undefined> {
    const refreshToken = cookie.load('refresh_token')

    if (!refreshToken) {
      cookie.remove('access_token', { path: '/' })
      cookie.remove('refresh_token', { path: '/' })
      return undefined
    }

    try {
      const response = await ApiService.refreshAxiosInstance!.post(
        `${managementApiURL}/refresh`,
        null,
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        }
      )

      const {
        refreshToken: refresh_token,
        accessToken: access_token,
        status,
        message,
      } = response.data

      if (status === 200 && access_token) {
        cookie.save('access_token', access_token, { path: '/' })
        if (refresh_token) {
          cookie.save('refresh_token', refresh_token, { path: '/' })
        }
        return access_token
      } else {
        throw new Error(message || 'Token refresh failed')
      }
    } catch (error) {
      cookie.remove('access_token', { path: '/' })
      cookie.remove('refresh_token', { path: '/' })

      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw error
    }
  }
}
