import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const common = {
  login(params) {
    return axios.post('/api/admin/auth/login', qs.stringify(params))
  },
  uploadImage() {
    return '/api/admin/images'
  },
  uploadImages() {
    return '/api/admin/manyImage'
  },
  getBrandList() {
    return axios.get('/api/admin/carSeriesPrice/brandList')
  },
  getUser() {
    return axios.get('/api/admin/info')
  },
  getProtectiveFilmList() {
    return axios.get('/api/admin/carSeriesPrice/protectiveFilmList')
  },
  getCarSeryListList(params) {
    return axios.get(
      `/api/admin/carSeriesPrice/carSeryList?${qs.stringify(params)}`
    )
  },
  getAuthMenu(params) {
    return axios.get(`/api/admin/auth/menu?${qs.stringify(params)}`)
  }
}

export default common
