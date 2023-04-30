import ApiService from "./ApiService";

export default class Auth extends ApiService {
    constructor() {
        super();
        this.path = "employee";
    }

    async basicAuth(data) {
        try {
            let response = await this.post({management:true,endpoint:`signin`}, null, this.basic(data))
            return response
        } catch (error) {
            return error;
        }
    }
    async getStore() {
        try {
            let response = await this.get({management:true,endpoint:this.path})
            return response

        } catch (error) {
            return error
        }
    }

    async logout() {
        try {
            let response = await this.post({management:true,endpoint:'logout'})

            return response
        } catch (error) {
            return error
        }
    }

    async createStore(data){
        try {
            let response = await this.post(`${this.path}/email`, data, {'Content-Type': 'multipart/form-data'})
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async verifyEmail(data){
        try {
            let response = await this.post(`${this.path}/verifyEmail`, data)
            return response
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateCode(data){
        try {
            let response = await this.post(`${this.path}/updateCode`, data)
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async provideReference(reference){
        try {
            let response = await this.post('auth/user/password/generateToken', {reference: reference})
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async validateToken(token){
        try {
            let response = await this.post('auth/user/password/validateToken', {token: token})
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async resetPassword(token, password){
        try {
            let response = await this.post('auth/user/password/resetByToken', {token: token, password: password})
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async checkAPI(){
        try {
          return await this.get('')
        } catch (error) {
            throw new Error(error)
        }
    }
    async checkManagementAPI (){
        try {
            return await this.get({management: true, endpoint: ''})
          } catch (error) {
              throw new Error(error)
          }
    }
}
