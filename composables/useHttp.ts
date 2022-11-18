import type { _AsyncData } from 'nuxt3/dist/app/composables/asyncData'
import { hash } from 'ohash'
// import baseUrl from './baseUrl'
// import { ElMessage } from 'element-plus'

const baseUrl = 'http://www.wdxdd.top/api/'
// 指定后端返回的基本数据类型
export interface ResponseConfig {
  code: number
  status: number
  data: any
  msg: string
}
export interface ValueConfig {
  value: any
}
export const fetchConfig = {
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
}

const fetch = (url: string, options?: any): Promise<any> => {
  const reqUrl = baseUrl + url
  const key = hash(`${JSON.stringify(options)}_${url}`)
  return new Promise((resolve, reject) => {
    useFetch(reqUrl, { ...options, ...fetchConfig, key }).then(({ data, error }: _AsyncData) => {
      if (error.value) {
        reject(error.value)
        return
      }
      const value = data.value
      if (value.status === 1)
        console.log(value)

      resolve(toRaw(value))
    }).catch((err: any) => {
      reject(err)
    })
  })
}

export default new class Http {
  get(url: string, params?: any): Promise<any> {
    return fetch(url, { method: 'get', params })
  }

  post(url: string, params?: any): Promise<any> {
    return fetch(url, { method: 'post', params })
  }

  put(url: string, body?: any): Promise<any> {
    return fetch(url, { method: 'put', body })
  }

  delete(url: string, body?: any): Promise<any> {
    return fetch(url, { method: 'delete', body })
  }
}()
