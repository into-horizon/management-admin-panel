import ApiService from "./ApiService";


export default class Update extends ApiService {
    private path : string

    constructor(){
        super();
        this.path = "api/v1/store";
    }

    async updateInfo(info : StoreType){
        try {
            let response = await this.update(this.path, info )
            return response
        } catch (error) {
            return error
        }
    }
    async updateStoreName(name: {store_name: string}){
        try {
            let response = await this.update(`${this.path}/name`,name)
            return response
            
        } catch (error) {
            return error
        }

    }

    async updateStorePicture(data: FormData){
        try {
            let response = await this.update(`${this.path}/picture`,data, {'Content-Type': 'multipart/form-data', ...this.bearer( await this.token())} )
            return response
        } catch (error) {
            return error
        }
    }
}