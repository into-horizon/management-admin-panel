import {
  ConfigurationType,
  ListResponse,
  ParamsType,
  PostConfigurationType,
} from '../types'
import ApiService from './ApiService'

class ConfigurationTypesService extends ApiService {
  private path: string
  constructor() {
    super()
    this.path = 'api/admin/configuration-type'
  }
  async getConfigurationTypes(params?: ParamsType) {
    return this.get<ListResponse<ConfigurationType>>(this.path, params)
  }
  async createConfigurationType(data: PostConfigurationType) {
    return this.post<{
      message: string
    }>(this.path, data)
  }
  async updateConfigurationType(id: string, data: ConfigurationType) {
    return this.put<{ message: string }>(`${this.path}/${id}`, data)
  }
  async deleteConfigurationType(id: string) {
    return this.delete<{ message: string }>(`${this.path}/${id}`)
  }
  async getConfigurationTypeById(id: string) {
    return this.get<ConfigurationType>(`${this.path}/${id}`)
  }
}

const configurationTypesService = new ConfigurationTypesService()
export default configurationTypesService
