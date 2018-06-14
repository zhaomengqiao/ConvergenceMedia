import request from '@/utils/request'
import qs from 'qs'

export function verifySSOLogin(data) {
    return request({
        url: '/login/checklogin',
        method: 'post',
    })
}

export function requestLogin(data) {
    return request({
        url: '/login/user',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'get'
    })
}

export function getUserInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: {
            token
        }
    })
}

export function getAuthList(data) {
    return request({
        url: '/login/authorities_v4_view',
        method: 'get',
        data
    })
}

// 获取验证码
export function getVerCode(data) {
    return request({
        url: '/login/verify-code-send',
        method: 'post',
        data
    })
}

// 验证是否需要验证码
export function isNeedVerifycode(data) {
    return request({
        url: `/login/isneedverifycode?userName=${data.userName}`,
        method: 'get'
    })
}
