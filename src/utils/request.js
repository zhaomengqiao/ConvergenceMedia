import axios from 'axios'
import {
    Message,
    MessageBox
} from 'element-ui'
import store from '@/store'
import {
    getToken
} from '@/utils/auth'
import { timeoutTime } from '@/utils'

// 改变 路由地址base
let base = '/rongmeitiapi'
// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: timeoutTime, // 请求超时时间
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

// request拦截器
service.interceptors.request.use(config => {
    config.headers={
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    }
    // Do something before request is sent
    //config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // if (store.getters.token) {
    //     config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    // }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        // 跳转至登录页
        if (res.code === '00044') {
            MessageBox.confirm('登录超时，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                });
            })
        } else if (res.code === '00045') {
            Message.error({
                message: '用户无权限'
            })
        } else if (res.code !== '00000' && res.code !== '00001' && res.code !== '00005' && res.code !== '201' && res.code !== '200') {
            let msg = res.ret?res.ret:'加载失败'
            Message.error({
                message: msg
            })
        }
        return res
    },
    error => {
        console.log(error) // for debug
        Message({
            message: error.data?error.data.ret:error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    })
// const res = response.data;
// if (res.code !== 20000) {
//     Message({
//         message: res.message,
//         type: 'error',
//         duration: 5 * 1000
//     });
//     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//             confirmButtonText: '重新登录',
//             cancelButtonText: '取消',
//             type: 'warning'
//         }).then(() => {
//             store.dispatch('FedLogOut').then(() => {
//                 location.reload(); // 为了重新实例化vue-router对象 避免bug
//             });
//         })
//     }
//     return Promise.reject('error');
// } else {
//     return response.data;
// }


export default service
