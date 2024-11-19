import ApiService from './ApiService'

class Dashboard extends ApiService {
  private path: string
  constructor() {
    super()
    this.path = 'count'
  }
  setPath(path: string) {
    return `api/admin/${path}/${this.path}`
  }
  async storesCount() {
    return await this.get(this.setPath(`stores`))
  }
  async ordersCount() {
    try {
      return await this.get(this.setPath(`orders`))
    } catch (error) {
      return error
    }
  }
  async productsCount() {
    try {
      return await this.get(this.setPath(`products`))
    } catch (error) {
      return error
    }
  }
  async usersCount() {
    try {
      return await this.get(this.setPath(`users`))
    } catch (error) {
      return error
    }
  }
  async dashboardStatistics() {
    return await this.get('api/admin/dashboard/statistics')
  }
}

export default new Dashboard()
