import { ParamsType, UserType } from "src/types";
import ApiService from "./ApiService";

class User extends ApiService {
  private path: string;
  private _path: string;
  constructor() {
    super();
    this.path = "auth";
    this._path = "api/admin";
  }

  async getUsers(data: ParamsType) {
    try {
      let result = await this.get(`${this.path}/user`, data);
      return result;
    } catch (error) {
      return error;
    }
  }

  async updateUser(data: UserType) {
    try {
      let result = await this.update(`${this._path}/user/${data.id}`, data);
      return result;
    } catch (error) {
      return error;
    }
  }
  async updateProfile(data: UserType) {
    try {
      let result = await this.update(
        `${this._path}/profile/${data.profile_id}`,
        data
      );
      return result;
    } catch (error) {
      return error;
    }
  }
}

export default new User();
