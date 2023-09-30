import { ParamsType } from "src/types";
import ApiService from "./ApiService";

class Notifications extends ApiService {
  private path: string;
  constructor() {
    super(), (this.path = "notifications");
  }
  async getNotifications(params: ParamsType) {
    try {
      return await this.get(this.path, params);
    } catch (error) {
      return error;
    }
  }
}
