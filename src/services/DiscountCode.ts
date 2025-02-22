import { DiscountCodeType, ParamsType } from '../types'
import ApiService from './ApiService'

class DiscountCode extends ApiService {
  private path: string
  constructor() {
    super()
    this.path = 'api/admin/promo'
  }
  async getDiscountCodes(data: ParamsType) {
    try {
      let result = await this.get(this.path, data)
      return result
    } catch (error) {
      return error
    }
  }
  async updateDiscountCode(data: DiscountCodeType) {
    try {
      let result = await this.put(this.path, data)
      return result
    } catch (error) {
      return error
    }
  }
  async createDiscountCode(data: Omit<DiscountCodeType, 'active'>) {
    try {
      let result = await this.post(this.path, data)
      return result
    } catch (error) {
      return error
    }
  }
}

export default new DiscountCode()
