import ApiService from './ApiService'
import { ConfigurationValueType, ListResponse } from '../types'

class ConfigurationValueService extends ApiService {
  private path: string
  constructor() {
    super()
    this.path = 'api/admin/configuration-value'
  }
  async getConfigurationValues(params?: any) {
    return this.get<ListResponse<ConfigurationValueType>>(this.path, params)
  }
  async createConfigurationValue(data: any) {
    return this.post<{ message: string }>(this.path, data)
  }
  async updateConfigurationValue(id: string, data: any) {
    return this.put<{ message: string }>(`${this.path}/${id}`, data)
  }
  async deleteConfigurationValue(id: string) {
    return this.delete<{ message: string }>(`${this.path}/${id}`)
  }
  async getConfigurationValueById(id: string) {
    return this.get<ConfigurationValueType>(`${this.path}/${id}`)
  }
}

const configurationValueService = new ConfigurationValueService()
export default configurationValueService
