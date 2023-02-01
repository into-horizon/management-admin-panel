import ApiService from "./ApiService";

class Store extends ApiService {
  constructor() {
    super();
    this.path = 'api/admin/store';
}
async getPendingStores(data){
    try {
        let result =  await this.get(`${this.path}/status`, data)
        return result
    } catch (error) {
        return error
    }
  }
  async updateStoreStatus(data){
    try {
        let result =  await this.update(`${this.path}/status`, data)
        return result
    } catch (error) {
        return error
    }
  }
  async getStores(data){
    try {
      let result =  await this.get(`${this.path}s`, data)
      return result
    } catch (error) {
      return error
    }
  }
  async updateStore(data){
    try {
        let result =  await this.update(`${this.path}/${data.id}`, data)
        return result
    } catch (error) {
        return error
    }
  }
  async updateStoreName(data){
    try {
        let result =  await this.update(`${this.path}/name/${data.id}`, data)
        return result
    } catch (error) {
        return error
    }
  }
}

export default new Store();
