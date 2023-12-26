import axios from "axios";
import cookie from "react-cookies";
import { ParamsType } from "src/types";
let api = process.env.REACT_APP_API;
let managementAPI = process.env.REACT_APP_MANAGEMENT_API;
import { isJwtExpired } from "jwt-check-expiration";
axios.defaults.headers.common.locale = 'en'
export default class ApiService {
  async get(
    path: { management: boolean; endpoint: string } | string,
    params?: ParamsType,
    header?: { [key: string]: any }
  ) {
    let _header: { [key: string]: any } = header ?? {};
    if (header instanceof Error || header === undefined) {
      _header = this.bearer(await this.token()) ?? {};
    }
    try {
      let res = await axios({
        method: "get",
        url:
          typeof path !== "string" && path?.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path ?? ""}`,
        params: this.getPopulatedStore(params),
        headers: _header,
      });
      return res.data;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
  async post(
    path: string | { management: boolean; endpoint: string },
    data?: { [key: string]: any } | null | undefined,
    header?: { [key: string]: any } | Error | undefined,
    params?: ParamsType
  ) {
    try {
      let _header: { [key: string]: any } = header ?? {};
      if (header instanceof Error || header === undefined) {
        _header = this.bearer(await this.token()) ?? {};
      }
      let res = await axios({
        method: "post",
        url:
          typeof path !== "string" && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        data: data,
        headers: _header,
        params: params,
      });
      return res.data;
    } catch (error) {
      return error;
    }
  }

  async update(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any },
    header?: { [key: string]: any },
    params?: ParamsType
  ) {
    try {
      let _header: { [key: string]: any } = header ?? {};
      if (header instanceof Error || header === undefined) {
        _header = this.bearer(await this.token()) ?? {};
      }
      let res = await axios({
        method: "put",
        url:
          typeof path !== "string" && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        params: params,
        data: data,
        headers: _header,
      });
      return res.data;
    } catch (error) {
      return error;
    }
  }

  async patch(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any },
    header?: { [key: string]: any },
    params?: ParamsType
  ) {
    let _header: { [key: string]: any } = header ?? {};
    if (header instanceof Error || header === undefined) {
      _header = this.bearer(await this.token()) ?? {};
    }
    try {
      let res = await axios({
        method: "patch",
        url:
          typeof path !== "string" && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        params: params,
        data: data,
        headers: _header,
      });
      return res.data;
    } catch (error) {
      return error;
    }
  }

  async delete(
    path: string | { management: boolean; endpoint: string },
    data?: { [key: string]: any },
    header?: { [key: string]: any },
    params?: ParamsType
  ) {
    let _header: { [key: string]: any } = header ?? {};
    if (header instanceof Error || header === undefined) {
      _header = this.bearer(await this.token()) ?? {};
    }
    try {
      let res = await axios({
        method: "delete",
        url:
          typeof path !== "string" && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        data: data,
        params: params,
        headers: _header,
      });
      return res.data;
    } catch (error) {
      return error;
    }
  }

  bearer(
    token: string | Error | void
  ): Error | { [key: string]: any } | undefined {
    if (typeof token === "string") {
      return { Authorization: `Bearer ${token}` };
    } else if (token instanceof Error) {
      throw new Error(token.message);
    }
  }

  basic(data: { email: string; password: string }) {
    return { Authorization: `Basic ${btoa(`${data.email}:${data.password}`)}` };
  }
  getPopulatedStore(
    data: { store_id?: string; duration?: string } & ParamsType = {}
  ) {
    const extendedParams = { ...data };
    const store = cookie.load("populated-store");
    const duration = cookie.load("duration");
    if (store) {
      extendedParams.store_id = store.id;
    }
    if (duration) {
      extendedParams.duration = duration;
    }
    return extendedParams;
  }
  async token(): Promise<string | Error | void> {
    let token = cookie.load("access_token");
    if (!token) return;
    if (!isJwtExpired(token)) {
      return token;
    } else {
      try {
        await ApiService.refresh();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
      }
    }
  }
  static async refresh() {
    const api = new ApiService();
    try {
      const { refresh_token, access_token, status, message } = await api.post(
        { endpoint: "refresh", management: true },
        null,
        api.bearer(cookie.load("refresh_token"))
      );
      if (status === 200) {
        cookie.save("access_token", access_token, { path: "/" });
        cookie.save("refresh_token", refresh_token, { path: "/" });
        return access_token;
      } else throw new Error(message);
    } catch (error) {
      cookie.remove("access_token", { path: "/" });
      cookie.remove("refresh_token", { path: "/" });
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
