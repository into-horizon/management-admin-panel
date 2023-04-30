import ApiService from "./ApiService";


class Orders extends ApiService {
    constructor() {
        super();
        this.path = "api/admin/order";
        this.path2 = "api/v1/update/order_item"
    }

    async getStorePendingOrders(data){
        try {
            let result = await this.get(`${this.path}/pending`, data )
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getStoreNotPendingOrders(data){
        try {
            let result =  await this.get(`${this.path}/notPending`, data )
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async updateOrderItem(data){
        try {
            let result = await this.patch(`${this.path}/item`, data)
            return result
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getStatues() {
        try {
            let result = await this.get(`${this.path}/statues`)
            return result
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async bulkStatusUpdate(data){
        try {
            let result = await this.patch(`${this.path}/bulk`, data)
            return result
        } catch (error) {
            throw new Error(error)
        }
    }
}

const NewOrders = new Orders();

export default NewOrders;