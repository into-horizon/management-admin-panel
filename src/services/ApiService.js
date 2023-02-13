import axios from 'axios';
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';
import { endSession } from '../store/auth'
import { isJwtExpired } from 'jwt-check-expiration';
let api = process.env.REACT_APP_API;
let managementAPI= process.env.REACT_APP_MANAGEMENT_API
export default class ApiService {

  async get(path, params, headers) {
    let res = await axios({
      method: 'get',
      url:path.management?`${managementAPI}/${path.endpoint}`: `${api}/${path??''}`,
      params: this.getPopulatedStore(params),
      headers: headers|| this.bearer(await this.token())
    })

    return res.data
  }
  async post(path, data, header, params = null) {
    let res = await axios({
      method: 'post',
      url: path.management?`${managementAPI}/${path.endpoint}`: `${api}/${path}`, 
      data: data,
      headers: header|| this.bearer(await this.token()),
      params: params,

    });
    return res.data
  }

  async update(path, data, header, params = null) {
    let res = await axios({
      method: 'put',
      url: path.management?`${managementAPI}/${path.endpoint}`: `${api}/${path}`,
      params: params,
      data: data,
      headers: header|| this.bearer(await this.token())
    });
    return res.data
  }
  
  async patch(path, data, header, params = null) {
    let res = await axios({
      method: 'patch',
      url: path.management?`${managementAPI}/${path.endpoint}`: `${api}/${path}`,
      params: params,
      data: data,
      headers: header|| this.bearer(await this.token())
    });
    return res.data
  }

  async delete(path, data, header, params = null) {
    let res = await axios({
      method: 'delete',
      url: path.management?`${managementAPI}/${path.endpoint}`: `${api}/${path}`,
      data: data,
      params: params,
      headers: header|| this.bearer(await this.token())
    });
    return res.data
  }

  bearer(token) {
    return { Authorization: ` Bearer ${token}` }
  }

  basic(data) {
    return { Authorization: ` Basic ${btoa(`${data.email}:${data.password}`)}` }
  }
  getPopulatedStore(data){
    const store =cookie.load('populated-store', {path: '/'})
    if(store){
      return data? {...data, store_id:JSON.parse(store).id}:{ store_id:JSON.parse(store).id}
    } else return data
  }
  async token() {
    let token = cookie.load('access_token', { path: '/' })

    if (!token) return 
    else if (!isJwtExpired(token)) {
      return token
    }
    else {

      let { refresh_token, access_token, status } = await this.post({endpoint:'refresh', management: true}, null, this.bearer(cookie.load('refresh_token',{ path: '/' }) ))
      if (status === 200) {
        // cookie.remove('access_token', { path: '/' })
        // cookie.remove('refresh_token', { path: '/' })
        cookie.save('access_token', access_token, { path: '/' })
        cookie.save('refresh_token', refresh_token, { path: '/' })

        return access_token
      } else return endSession()
    }
  }
  // token(){
  //   return 
  // }

}

