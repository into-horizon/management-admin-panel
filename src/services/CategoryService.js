import ApiService from "./ApiService";

 class CategoryService extends ApiService {
    constructor() {
        super();
        this.path = "api/admin/category";
    }
    params(data) {
        return {limit:10, offset: 0, ...data}
    }

    async getAllParentCategoires(data) {

        try {
            let res = await this.get(`${this.path}/parent`, data);
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllChildCategoires(data) {

        try {
            let res = await this.get(`${this.path}/child`, data);
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllGrandChildCategoires(data) {

        try {
            let res = await this.get(`${this.path}/grandchild`, data);
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async updateGrandChildCategory(data) {
        try {
            let res = this.update( `${this.path}/grandchild`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async updateParentCategory(data) {
        try {
            let res = this.update( `${this.path}/parent`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async updateChildCategory(data) {
        try {
            let res = this.update( `${this.path}/child`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async addGrandChildCategory(data) {
        try {
            let res = this.post(`${this.path}/grandchild`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async addChildCategory(data) {
        try {
            let res = this.post(`${this.path}/child`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async addParentCategory(data) {
        try {
            let res = this.post(`${this.path}/parent`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async deleteGrandChildCategory({id}) {
        try {
            let res = this.delete(`${this.path}/grandchild/${id}`)
            return res
        } catch (error) {
            return error
        }
    }
    async deleteChildCategory({id}) {
        try {
            let res = this.delete(`${this.path}/child/${id}`)
            return res
        } catch (error) {
            return error
        }
    }
    async deleteParentCategory({id}) {
        try {
            let res = this.delete(`${this.path}/parent/${id}`)
            return res
        } catch (error) {
            return error
        }
    }
}

const Category = new CategoryService()
export default Category;