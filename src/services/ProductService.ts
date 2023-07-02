import ApiService from "./ApiService";


class ProductService extends ApiService {
    private path : string
    constructor() {
        super();
        this.path = "api/admin/product";
    }

    async addProduct(data : ProductType) {
        try {
            let res = await this.post(this.path, data);
            return res;
        } catch (error) {
           return error
        }
    }
    async getProducts(data : ParamsType) {
        try {
            let res = await this.get(this.path, data)
            return res
        } catch (error) {
           return error
        }
    }

    async updateProductStatus(data : ProductType){
        try {
            let result =  await this.patch( this.path, data)
            return result
        } catch (error) {
            return error
        }
    }

    async addProductPicture(data: FormData ) {
        try {
            let res = await this.post(`${this.path}/picture`, data, { 'Content-Type': 'multipart/form-data', ...this.bearer(await this.token()) })
            return res
        } catch (error) {
           return error
        }
    }
    async deleteProductPicture(data : { picture_id: string }) {
        try {
            let res = await this.delete(`${this.path}/picture`, data)
            return res
        } catch (error) {
           return error
        }
    }

    async updateSizeAndQuantity(data : ProductType) {
        try {
            let res = await this.patch(`${this.path}/quantityandsize`, data)
            return res;
        } catch (error) {
           return error
        }
    }
    async updateDiscount(data : ProductType) {
        try {
            let res = await this.patch(`${this.path}/discount`, data)
            return res;
        } catch (error) {
           return error
        }
    }
    async getSearchData(data : ProductType){
      try {
          let res = await this.get(`${this.path}/searchData/${JSON.stringify(data)}`, null);
          return res;
      } catch (error) {
         return error
      }
    }
    async getProduct(data: string){
        try {
            let res = await this.get(`${this.path}/${data}`);
            return res
        } catch (error) {
           return error
        }
    }

    async updateProduct(data : ProductType){
        try {
            let res = await this.update(`${this.path}`, data);
            return res 
        } catch (error) {
           return error
        }
    }
    async deleteProduct(data :{id: string} ) {
        try {
            let res = await this.delete(`${this.path}`, data)
            return res
        } catch (error) {
           return error
        }
    }
    async getProductReviews (data : ParamsType){
        try {
            let res = await this.get(`${this.path}/reviews/${data.id}`, data)
            return res
        } catch (error) {
            return error
        }
    }
    

}

export default new ProductService();