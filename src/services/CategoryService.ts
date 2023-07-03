import ApiService from "./ApiService";

class CategoryService extends ApiService {
    private path : string
    constructor() {
        super();
        this.path = "api/admin/category";
    }
   
    async getAllParentCategoires(data? : ParamsType & {}) {

        try {
            let res = await this.get(`${this.path}/parent`, data);
            return res;
        } catch (error) {
           return error
        }
    }
    async getAllChildCategoires(data? : ParamsType &{}) {

        try {
            let res = await this.get(`${this.path}/child`, data);
            return res;
        } catch (error) {
           return error
        }
    }
    async getAllGrandChildCategoires(data? : ParamsType &{}) {

        try {
            let res = await this.get(`${this.path}/grandchild`, data);
            return res;
        } catch (error) {
            return error
        }
    }
    async updateGrandChildCategory(data :ChildAndGrandCategoriesType) {
        try {
            let res = this.update(`${this.path}/grandchild`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async updateParentCategory(data : ParentCategoriesType) {
        try {
            let res = this.update(`${this.path}/parent`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async updateChildCategory(data : ChildAndGrandCategoriesType) {
        try {
            let res = this.update(`${this.path}/child`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async addGrandChildCategory(data : ChildAndGrandCategoriesType) {
        try {
            let res = this.post(`${this.path}/grandchild`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async addChildCategory(data : ChildAndGrandCategoriesType) {
        try {
            let res = this.post(`${this.path}/child`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async addParentCategory(data : ParentCategoriesType) {
        try {
            let res = this.post(`${this.path}/parent`, data)
            return res
        } catch (error) {
            return error
        }
    }
    async deleteGrandChildCategory(id : string) {
        try {
            let res = this.delete(`${this.path}/grandchild/${id}`)
            return res
        } catch (error) {
            return error
        }
    }
    async deleteChildCategory(id : string) {
        try {
            let res = this.delete(`${this.path}/child/${id}`)
            return res
        } catch (error) {
            return error
        }
    }
    async deleteParentCategory(id: string) {
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