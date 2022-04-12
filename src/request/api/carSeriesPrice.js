import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const carSeriesPrice = {
  carSeriesPriceExport(params, config = {}) {
    return axios.post(
      `/api/admin/carSeriesPrice/export`,
      qs.stringify(params),
      config
    )
  },
  carSeriesPriceUpdate(params) {
    return axios.post(`/api/admin/carSeriesPrice/update`, qs.stringify(params))
  },
  getCarSeriesPriceList(params) {
    return axios.get(`/api/admin/carSeriesPrice/list?${qs.stringify(params)}`)
  },
  getCarSeriesPriceInfo(params) {
    return axios.get(`/api/admin/carSeriesPrice/info?${qs.stringify(params)}`)
  },
  carSeriesPriceDel(params) {
    return axios.get(`/api/admin/carSeriesPrice/del?${qs.stringify(params)}`)
  }
}

export default carSeriesPrice
