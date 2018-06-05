import request from '@/utils/request'

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
