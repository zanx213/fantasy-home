import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const brand = {
  brandUpdate(params) {
    return axios.post('/api/admin/brand/update', qs.stringify(params))
  },
  getBrandList(params) {
    return axios.get(`/api/admin/brand/list?${qs.stringify(params)}`)
  },
  getBrandInfo(params) {
    return axios.get(`/api/admin/brand/info?${qs.stringify(params)}`)
  },
  delBrand(params) {
    return axios.get(`/api/admin/brand/del?${qs.stringify(params)}`)
  }
}

export default brand
