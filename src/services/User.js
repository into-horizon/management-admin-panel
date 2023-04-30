import ApiService from "./ApiService";

class User extends ApiService{
    constructor(){
        super()
        this.path = 'auth'
        this._path= 'api/admin'
    }

    async getUsers(data){
        try {
            let result =  await this.get(`${this.path}/user`, data)
            return result
        } catch (error) {
            return error
        }
    }

    async updateUser (data){
        try {
            let result =  await this.update(`${this._path}/user/${data.id}`, data)
            return result
        } catch (error) {
            return error
        }
    }
    async updateProfile(data) {
        try {
            let result =  await this.update(`${this._path}/profile/${data.profile_id}`, data)
            return result
        } catch (error) {
            return error
        }
    }
}

export default new User() 