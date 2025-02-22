import { StoreType } from '../types'
import ApiService from './ApiService'

export default class Update extends ApiService {
  private path: string

  constructor() {
    super()
    this.path = 'api/v1/store'
  }

  async updateInfo(info: StoreType) {
    try {
      let response = await this.put(this.path, info)
      return response
    } catch (error) {
      return error
    }
  }
  async updateStoreName(name: { store_name: string }) {
    try {
      let response = await this.put(`${this.path}/name`, name)
      return response
    } catch (error) {
      return error
    }
  }

  async updateStorePicture(data: FormData) {
    try {
      let response = await this.put(`${this.path}/picture`, data, {
        'Content-Type': 'multipart/form-data',
      })
      return response
    } catch (error) {
      return error
    }
  }
}
