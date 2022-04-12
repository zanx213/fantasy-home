import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const paint = {
  protectiveFilmUpdate(params) {
    return axios.post(`/api/admin/protectiveFilm/update?`, qs.stringify(params))
  },
  getProtectiveFilmList(params) {
    return axios.get(`/api/admin/protectiveFilm/list?${qs.stringify(params)}`)
  },
  protectiveFilmDel(params) {
    return axios.get(`/api/admin/protectiveFilm/del?${qs.stringify(params)}`)
  },
  getProtectiveFilmInfo(params) {
    return axios.get(`/api/admin/protectiveFilm/info?${qs.stringify(params)}`)
  }
}

export default paint
