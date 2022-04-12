import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const carSery = {
  carSeryUpdate(params) {
    return axios.post(`/api/admin/carSery/update?${qs.stringify(params)}`)
  },
  getCarSeryList(params) {
    return axios.get(`/api/admin/carSery/list?${qs.stringify(params)}`)
  },
  carSeryDel(params) {
    return axios.get(`/api/admin/carSery/del?${qs.stringify(params)}`)
  }
}

export default carSery
