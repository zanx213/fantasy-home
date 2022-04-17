import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const client = {
  exportClient(params) {
    return axios.post(`/api/admin/client/export`, qs.stringify(params))
  },
  clientUpdate(params) {
    return axios.post(`/api/admin/client/update`, qs.stringify(params))
  },
  getClientList(params) {
    return axios.get(`/api/admin/client/list?${qs.stringify(params)}`)
  },
  getClientInfo(params) {
    return axios.get(`/api/admin/client/info?${qs.stringify(params)}`)
  },
  clientDel(params) {
    return axios.get(`/api/admin/client/del?${qs.stringify(params)}`)
  }
}

export default client
