
import ApiService from "./ApiService";

class Employees extends ApiService {
        constructor(){
            super()
            this.management= true
            this.path = 'employee'
        }
        async getEmployees(data){
            try {
                return await this.get({management: this.management, endpoint:`${this.path}s`}, data)
            } catch (error) {
                throw new Error(error)
            }
        }
        async updateEmployee(data){
            try {
                return await this.update({management: this.management, endpoint:this.path}, data)
            } catch (error) {
                throw  new Error(error)
            }
        }
        async addEmployee(data){
            try {
                return await this.post({management: this.management, endpoint:this.path}, data)
            } catch (error) {
                throw new Error(error)
            }
        }
        async deleteEmployee(data) {
            console.log("🚀 ~ file: Employee.js:32 ~ Employees ~ deleteEmployee ~ data:", data)
            try {
                return await this.delete({management: this.management, endpoint:`${this.path}/${data}`})
            } catch (error) {
                throw new Error(error)
            }
        }
}

export default new Employees()