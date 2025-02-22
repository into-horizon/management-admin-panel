import { ParamsType, UserResponse, UserType } from '../types'
import ApiService from './ApiService'

class User extends ApiService {
  private path: string
  private _path: string
  constructor() {
    super()
    this.path = 'auth'
    this._path = 'api/admin'
  }

  async getUsers(data: ParamsType) {
    let result = await this.post<UserResponse>(`${this.path}/user`, data)
    return result
  }

  async updateUser(data: UserType) {
    try {
      let result = await this.put(`${this._path}/user/${data.id}`, data)
      return result
    } catch (error) {
      return error
    }
  }
  async updateProfile(data: UserType) {
    try {
      let result = await this.put(`${this._path}/profile/${data.profile.id}`, data)
      return result
    } catch (error) {
      return error
    }
  }
}

export default new User()
