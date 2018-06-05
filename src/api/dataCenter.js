import request from '@/utils/request'
import qs from 'qs'

// 东方网审核数据
export function getDfwLogList(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: '/afterlogin/eastdayauditlist/getlist',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 获取审核人信息
export function getDfwPeople(data) {
    return request({
        url: `/afterlogin/eastdayauditlist/getaudituser?json={"starttime":${data.starttime},"endtime":${data.endtime}}`,
        method: 'get'
    })
}

// 获取审核数据统计
export function getDfwAuditNum(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: '/afterlogin/eastdayauditlist/countauditnews',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 审核数据All
// 审核人---------------
export function getAllAuditUser(data) {
    return request({
        url: '/afterlogin/reviewmonitoring/getaudituser',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 获取审核数据列表----------
export function getAllAuditDataList(data) {
    return request({
        url: '/afterlogin/reviewmonitoring/reviewcountlist',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 审核详情All
// 审核详情All列表---------------
export function getAllAuditDetailList(data) {
    return request({
        url: '/afterlogin/reviewmonitoring/reviewlist',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 详情审核类型
export function getAllAuditDetailType(data) {
    return request({
        url: '/afterlogin/reviewmonitoring/logtypes',
        method: 'get'
    })
}
// 获取数据
export function getAllAuditDetailNum(data) {
    return request({
        url: '/afterlogin/reviewmonitoring/reviewcountdetail',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询详情
export function getContentDetail(data) {
    return request({
        url: `/afterlogin/reviewmonitoring/detail?url=${data.url}`,
        method: 'get'
    })
}

// 导出
export const exportExcalAuditDfw = `/rongmeitiapi/afterlogin/eastdayauditlist/exportauditlog?`

// 导出审核监控
export const exportExcalAuditAll = `/rongmeitiapi/afterlogin/reviewmonitoring/exportcount?`

// 导出详情
export const exportExcalAuditDetail = `/rongmeitiapi/afterlogin/reviewmonitoring/exportlist?`
