import { EmployeeType, ParamsType } from '../types'
import ApiService from './ApiService'

class Employees extends ApiService {
  private management: boolean
  private path: string
  constructor() {
    super()
    this.management = true
    this.path = 'employee'
  }
  async getEmployees(data: ParamsType) {
    try {
      return await this.get({ management: this.management, endpoint: `${this.path}s` }, data)
    } catch (error) {
      return error
    }
  }
  async updateEmployee(data: EmployeeType) {
    try {
      return await this.put({ management: this.management, endpoint: this.path }, data)
    } catch (error) {
      return error
    }
  }
  async addEmployee(data: Omit<EmployeeType, 'verified'>) {
    try {
      return await this.post({ management: this.management, endpoint: this.path }, data)
    } catch (error) {
      return error
    }
  }
  async deleteEmployee(data: string) {
    try {
      return await this.delete({
        management: this.management,
        endpoint: `${this.path}/${data}`,
      })
    } catch (error) {
      return error
    }
  }
}

export default new Employees()
