import { ParamsType } from '../types'
import ApiService from './ApiService'

class Notifications extends ApiService {
  private path: string
  constructor() {
    super(), (this.path = 'api/admin/notifications')
  }
  async getNotifications(params?: ParamsType) {
    try {
      return await this.get(this.path, params)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }
  async updateNotificationsAsSeen(data: ParamsType) {
    try {
      return await this.patch(this.path, data)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }
}

export default new Notifications()
