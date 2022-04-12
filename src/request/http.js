import axios from 'axios'
import router from '@/router'
import { useStore } from '@/store'
import { message } from 'ant-design-vue'

const store = useStore()

axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL

// 创建axios实例
var instance = axios.create({
  timeout: 1000 * 12
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

const tip = msg => {
  message.error({
    content: msg,
    duration: 1
  })
}

const toLogin = () => {
  console.log('[ 123 ] >', 123)
  router.replace({ name: 'Login' })
}

const errorHandle = (status, msg) => {
  // 状态码判断
  switch (status) {
    case 401:
      toLogin()
      break
    case 403:
      tip('登录过期，请重新登录')
      break
    case 404:
      tip('请求的资源不存在')
      break
    case 500:
      tip('系统错误')
      break
    default:
      tip(msg)
  }
}

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = `Bearer ${token}`)
    store.$patch({ loading: true })

    return Promise.resolve(config)
  },
  error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    store.$patch({ loading: false })
    if (res.status === 200) {
      if (res.data.code === 401) {
        toLogin()
      }
    }
    return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)
  },
  // 请求失败
  error => {
    store.$patch({ loading: false })
    const { response } = error

    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.msg)
      return Promise.reject(response)
    } else {
      return Promise.reject(error)
    }
  }
)

export default instance
