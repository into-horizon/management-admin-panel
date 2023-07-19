import ApiService from "./ApiService";

export default class Auth extends ApiService {
    private path: string
    constructor() {
        super();
        this.path = "employee";
    }

    async basicAuth(data: { email: string, password: string }) {
        try {
            let response = await this.post({ management: true, endpoint: `signin` }, null, this.basic(data))
            return response
        } catch (error) {
            return error;
        }
    }
    async getStore() {
        try {
            let response = await this.get({ management: true, endpoint: this.path })
            return response

        } catch (error) {
            return error
        }
    }

    async logout() {
        try {
            let response = await this.post({ management: true, endpoint: 'logout' })

            return response
        } catch (error) {
            return error
        }
    }

    async createStore(data: any) {
        try {
            let response = await this.post(`${this.path}/email`, data, { 'Content-Type': 'multipart/form-data' })
            return response
        } catch (error) {
            return error
        }
    }

    // async verifyEmail(data){
    //     try {
    //         let response = await this.post(`${this.path}/verifyEmail`, data)
    //         return response

    //     } catch (error) {
    //         return error
    //     }
    // }

    // async updateCode(data) {
    //     try {
    //         let response = await this.post(`${this.path}/updateCode`, data)
    //         return response
    //     } catch (error) {
    //         return error
    //     }
    // }
    async provideReference(reference: string) {
        try {
            let response = await this.post('auth/user/password/generateToken', { reference: reference })
            return response
        } catch (error) {
            return error
        }
    }
    async validateToken(token: string) {
        try {
            let response = await this.post('auth/user/password/validateToken', { token: token })
            return response
        } catch (error) {
            return error
        }
    }
    async resetPassword(token: string, password: string) {
        try {
            let response = await this.post('auth/user/password/resetByToken', { token: token, password: password })
            return response
        } catch (error) {
            return error
        }
    }
    async checkAPI() {
        try {
            let rest = await this.get('')
            return rest
        } catch (error) {
            if(error instanceof Error) throw new Error(error.message)
        }
    }
    async checkManagementAPI() {
        try {
            return await this.get({ management: true, endpoint: '' })
        } catch (error) {
         if(error instanceof Error) throw new Error(error.message)
        }
    }
}
