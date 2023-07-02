import ApiService from "./ApiService";

class Store extends ApiService {
  private path : string
  constructor() {
    super();
    this.path = 'api/admin/store';
}
async getPendingStores(data : ParamsType){
    try {
        let result =  await this.get(`${this.path}/status`, data)
        return result
    } catch (error) {
        return error
    }
  }
  async updateStoreStatus(data : StoreType){
    try {
        let result =  await this.update(`${this.path}/status`, data)
        return result
    } catch (error) {
        return error
    }
  }
  async getStores(data : ParamsType){
    try {
      let result =  await this.get(`${this.path}s`, data)
      return result
    } catch (error) {
      return error
    }
  }
  async updateStore(data : StoreType){
    try {
        let result =  await this.update(`${this.path}/${data.id}`, data)
        return result
    } catch (error) {
        return error
    }
  }
  async updateStoreName(data : StoreType){
    try {
        let result =  await this.update(`${this.path}/name/${data.id}`, data)
        return result
    } catch (error) {
        return error
    }
  }
}

export default new Store();
