import ApiService from "./ApiService";

class DiscountCode extends ApiService{
    constructor() {
        super();
        this.path = "api/admin/promo";
    }
    async getDiscountCodes(data) {
        try {
            let result = await this.get( this.path, data)
            return result
        } catch (error) {
            return error
        }
    }
    async updateDiscountCode(data) {
        try {
            let result = await this.update( this.path, data)
            return result
        } catch (error) {
            return error
        }
    }
    async createDiscountCode(data) {
        try {
            let result = await this.post( this.path, data)
            return result
        } catch (error) {
            return error
        }
    }
} 

export default new DiscountCode()