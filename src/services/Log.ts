import { ListResponse, ParamsType, RequestLog } from '../types'
import ApiService from './ApiService'

class Log extends ApiService {
  private path: string
  constructor() {
    super()
    this.path = 'api/admin/logs'
  }

  async getLogs(params: ParamsType) {
    return await this.get<ListResponse<RequestLog>>(`${this.path}`, params)
  }
}

const LogService = new Log()
export default LogService
