import ApiService from "./ApiService";


class Orders extends ApiService {
    private path : string
    private path2: string
    constructor() {
        super();
        this.path = "api/admin/order";
        this.path2 = "api/v1/update/order_item"
    }

    async getStorePendingOrders(data: ParamsType){
        try {
            let result = await this.get(`${this.path}/pending`, data )
            return result;
        } catch (error) {
            return error
        }
    }
    async getStoreNotPendingOrders(data : ParamsType){
        try {
            let result =  await this.get(`${this.path}/notPending`, data )
            return result;
        } catch (error) {
            return error
        }
    }
    async updateOrderItem(data : OrderItemType){
        try {
            let result = await this.patch(`${this.path}/item`, data)
            return result
        } catch (error) {
            return error
        }
    }
    async getStatues() {
        try {
            let result = await this.get(`${this.path}/statues`)
            return result
        } catch (error) {
            return error
        }
    }
    async bulkStatusUpdate(data : {status: string , id: string}){
        try {
            let result = await this.patch(`${this.path}/bulk`, data)
            return result
        } catch (error) {
            return error
        }
    }
}

const NewOrders = new Orders();

export default NewOrders;