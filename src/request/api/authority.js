import axios from '../http'
import qs from 'qs' // 根据需求是否导入qs模块

const authority = {
  addUser(params) {
    return axios.post(`/api/admin/user/add`, qs.stringify(params))
  },
  updateUser(params) {
    return axios.post(`/api/admin/user/update`, qs.stringify(params))
  },
  delUser(params) {
    return axios.post(`/api/admin/user/del`, qs.stringify(params))
  },
  getUserList(params) {
    return axios.get(`/api/admin/user/list?${qs.stringify(params)}`)
  },
  getUserInfo(params) {
    return axios.get(`/api/admin/user/info?${qs.stringify(params)}`)
  },
  getRuleList(params) {
    return axios.get(`/api/admin/permission/list?${qs.stringify(params)}`)
  },
  getRoleList(params) {
    return axios.get(`/api/admin/role/list?${qs.stringify(params)}`)
  },
  getRoleInfo(params) {
    return axios.get(`/api/admin/role/info?${qs.stringify(params)}`)
  },
  addRole(params) {
    return axios.post(`/api/admin/role/add`, qs.stringify(params))
  },
  updateRole(params) {
    return axios.post(`/api/admin/role/update`, qs.stringify(params))
  },
  delRole(params) {
    return axios.post(`/api/admin/role/del`, qs.stringify(params))
  }
}

export default authority
