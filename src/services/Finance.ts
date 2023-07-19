import ApiService from "./ApiService";


class Finance extends ApiService {
    private path: string
    constructor() {
        super();
        this.path = "api/admin"
    }

    async getAmounts  () {
        try {
            let result = await this.get(`${this.path}/amounts`)
            return result
        } catch (error) {
           return error
        }
    }
    async getTransactions (data : ParamsType) {
        try {
            let result = await this.get(`${this.path}/transactions`, data)
            return result
        } catch (error) {
            return error
        }
    }
    async pendingAmounts (){
        try {
            return await this.get(`${this.path}/pendingAmount`)
        } catch (error) {
            return error
        }
    }
    async releasedAmounts (){
        try {
            return await this.get(`${this.path}/released`)
        } catch (error) {
            return error
        }
    }
    async refundedAmounts (){
        try {
            return await this.get(`${this.path}/refundedAmounts`)
        } catch (error) {
            return error
        }
    }
    async transferredAmount() {
        try {
            return await this.get(`${this.path}/transferred`)
        } catch (error) {
            return error
        }
    }
    async withdrawnAmount() {
        try {
            return await this.get(`${this.path}/withdrawn`)
        } catch (error) {
            return error
        }
    }
    async canceledWithdrawnAmount() {
        try {
            return await this.get(`${this.path}/wCanceled`)
        } catch (error) {
            return error
        }
    }
    
    

}

export default new Finance()