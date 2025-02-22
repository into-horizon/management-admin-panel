import { AccountType } from '../types'
import ApiService from './ApiService'

class BankAccount extends ApiService {
  private path: string
  constructor() {
    super()
    this.path = 'api/v1/account'
  }
  async addBankAccount(data: AccountType) {
    try {
      let result = await this.post(`${this.path}/store`, data)
      return result
    } catch (error) {
      return error
    }
  }
  async updateBankAccount(data: AccountType | FormData) {
    try {
      let result = await this.put(`${this.path}/update`, data)
      return result
    } catch (error) {
      return error
    }
  }
  async deleteBankAccount(data: { id: string }) {
    try {
      let result = await this.delete(`${this.path}/delete`, data)
      return result
    } catch (error) {
      return error
    }
  }
  async getBankAccount(data: string) {
    try {
      let result = await this.get(`${this.path}/id/${data}`)
      return result
    } catch (error) {
      return error
    }
  }
  async getBankAccounts() {
    try {
      let result = await this.get(`${this.path}/store`)
      return result
    } catch (error) {
      return error
    }
  }
  async cashAccount() {
    try {
      return await this.get(`${this.path}/cash`)
    } catch (error) {
      return error
    }
  }
}

export default new BankAccount()
