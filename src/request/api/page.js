import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const page = {
  setService(params) {
    return axios.post(`/api/admin/serve/update`, qs.stringify(params))
  },
  getService() {
    return axios.get(`/api/admin/serve/info`)
  },
  setAbout(params) {
    return axios.post(`/api/admin/brandStory/update`, qs.stringify(params))
  },
  getAbout() {
    return axios.get(`/api/admin/brandStory/info`)
  },
  setJoin(params) {
    return axios.post(`/api/admin/join/update`, qs.stringify(params))
  },
  getJoin() {
    return axios.get(`/api/admin/join/info`)
  },
  setConfig(params) {
    return axios.post(`/api/admin/config/update`, qs.stringify(params))
  },
  getConfig() {
    return axios.get(`/api/admin/config/info`)
  }
}

export default page
