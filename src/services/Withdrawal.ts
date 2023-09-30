import { ParamsType, WithdrawalType } from "src/types";
import ApiService from "./ApiService";

class Withdrawal extends ApiService {
  private path: string;
  constructor() {
    super();
    this.path = "api/admin/withdrawal";
  }

  async getWithdrawals(payload: ParamsType) {
    try {
      let result = await this.get(this.path, payload);
      return result;
    } catch (error) {
      return error;
    }
  }
  async addWithdrawal(data: WithdrawalType) {
    try {
      let result = await this.post(this.path, data);
      return result;
    } catch (error) {
      return error;
    }
  }
  async updateWithdrawal(data: WithdrawalType | FormData) {
    try {
      let result = await this.update(this.path, data);
      return result;
    } catch (error) {
      return error;
    }
  }
}

export default new Withdrawal();
