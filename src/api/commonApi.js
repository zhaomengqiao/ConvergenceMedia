import request from '@/utils/request'
import qs from 'qs'

// 登录请求1
export function Login1(data) {
    return request({
        url: '/login/proxylogin',
        method: 'get'
    })
}

// 查询系统公告列表
export function getSystemNotificationByTime() {
    return request({
        url: '/systemNotification/getSystemNotificationByTime',
        method: 'get'
    })
}

// 标红敏感词获取（除扬子头条）
export function getRedKeyWords() {
    return request({
        url: '/share/keys',
        method: 'get'
    })
}

// 权限平台统一接口
export function getOperPlatform(data) {
    return request({
        url: '/login/getOperPlatform',
        method: 'post',
        data: qs.stringify(data)
    })
}

var localHref = window.location.href; //判断正式测试参数
let live, alibucket, bucketXg, bucketTy;
if (localHref.indexOf('http://localhost:8081/') > -1 || localHref.indexOf('http://172.18.250.87:8800/') > -1 || localHref.indexOf('http://106.75.6.212/') > -1 || localHref.indexOf('http://localhost:9527/') > -1) {
    alibucket = 'gxtest00';
    bucketXg = 'gxtest';
    bucketTy = 'gxtest';
    live = 1;
} else {
    alibucket = 'gaoxinmv';
    bucketXg = 'gaoxinmv';
    bucketTy = 'gaoxinmv';
    live = 0;
}
//测试用gxtest      正式gaoxinmv
export const BUCKETS = 'gxtest'
//都用gxtest      体育gaoxinmv
export const BUCKETY = bucketTy
//测试用gxtest      香港gaoxinmv
export const BUCKEXG = bucketXg
//测试用gxtest00      正式gaoxinmv
export const BUCKETALIY = alibucket
//测试用 1 正式用0
export const LIVECLASS = live
// 退出后不删除的localStorage
export const cantDelLocal = ["auditFontSize", "auditLineHeight", "tableColumn", "tableRow", "tree"]
