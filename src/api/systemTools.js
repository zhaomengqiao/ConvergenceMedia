import request from '@/utils/request'
import qs from 'qs'

// 信源维护
// 查询所有操作人员
export function getUrlfromPeople(data) {
    return request({
        url: '/api/information/querycreateuser',
        method: 'get'
    })
}

// 查询所有作用区域
export function getUrlfromActiveArea(data) {
    return request({
        url: '/api/information/queryusearea',
        method: 'get'
    })
}

// 查询信源列表接口
export function getUrlfromLiveList(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: '/api/information/querylist',
        method: 'post',
        data:  qs.stringify(params)
    })
}

// 更新启用/停用
export function changeUseState(data) {
    return request({
        url: '/api/information/updateisused',
        method: 'post',
        data:  qs.stringify(data)
    })
}

// 信源新增接口
export function addUrlfrom(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: '/api/information/addinfosource',
        method: 'post',
        data:  qs.stringify(params)
    })
}

// 操作日志
// 内容操作日志
export const exportContentExcel = `/rongmeitiapi/api/batchaddkey/exportContentOprationExcelData?`

// 内容操作日志查询
export function getContentLogByParameter(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: '/contentOpLog/getContentOperationLogByParameterV2',
        method: 'post',
        data:  qs.stringify(params)
    })
}
// 内容操作日志查询用户
export function getUserByParameter(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: '/contentOpLog/getUserByParameter',
        method: 'post',
        data:  qs.stringify(params)
    })
}
// 内容操作日志类型
export function getContentLogType(data) {
    return request({
        url: '/contentOpLog/getAllLogType',
        method: 'post',
        data:  qs.stringify(data)
    })
}

export const exportUrlfromExcel = `/rongmeitiapi/api/information/exportdata?`
export const downloadUrlfromExcel = `/rongmeitiapi/api/information/exporttemplate`
export const importExcel = `/rongmeitiapi/api/information/importexl`

// 特殊配置------
// 特殊权限配置
export function checkUser(data) {
    return request({
        url: `/api/specialverification/checkuser/${data}`,
        method: 'get'
    })
}

export function addBigBoss(data) {
    return request({
        url: `/api/specialverification/addset/${data.sign}/${data.userName}`,
        method: 'get'
    })
}

export function addVeriCode(data) {
    return request({
        url: `/api/specialverification/addverification`,
        method: 'post',
        data:  qs.stringify(data)
    })
}

export function searchBigBoss(data) {
    return request({
        url: `/api/specialverification/queryset`,
        method: 'post',
        data:  qs.stringify(data)
    })
}

export function searchVeriCode(data) {
    return request({
        url: `/api/specialverification/queryverification`,
        method: 'post',
        data:  qs.stringify(data)
    })
}

export function delBigBoss(data) {
    return request({
        url: `/api/specialverification/removeset/${data.sign}/${data.userName}`,
        method: 'get'
    })
}

export function delVeriCode(data) {
    return request({
        url: `/api/specialverification/delverification`,
        method: 'post',
        data:  qs.stringify(data)
    })
}

// 免审白名单/按领域查询
export function authWhiteList(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `api/${data.type}/query`,
        method: 'post',
        data:  qs.stringify(params)
    })
}

// 免审白名单编辑
export function authWhiteUpdate(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `api/${data.type}/update`,
        method: 'post',
        data:  qs.stringify(params)
    })
}

// 免审白名单/按领域新增
export function authWhiteAdd(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `api/${data.type}/add`,
        method: 'post',
        data:  qs.stringify(params)
    })
}

// 免审白名单删除
export function authWhiteDelete(data) {
    return request({
        url: `/api/${data.type}/del`,
        method: 'post',
        data:  qs.stringify(data)
    })
}

// 按领域编辑
export function authDomainUpdate(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `api/${data.type}/edit`,
        method: 'post',
        data:  qs.stringify(params)
    })
}

// 按领域删除
export function authDomainDelete(data) {
    let params = {json: JSON.stringify(data.param)}
    return request({
        url: `api/${data.type}/del`,
        method: 'post',
        data:  qs.stringify(params)
    })
}

// 类型查询
export function auditdomainType(data) {
    return request({
        url: `/api/auditdomain/types?newstype=${data.newstype}&&platfrom=${data.platfrom}`,
        method: 'get'
    })
}

// 个人配置 -> 发稿
// 查询
export function getConfigSource(data) {
    return request({
        url: `/afterlogin/newsconfig/query`,
        method: 'post',
        data:  qs.stringify(data)
    })
}

// 新增
export function addConfigSource(data) {
    return request({
        url: `/afterlogin/newsconfig/add`,
        method: 'post',
        data:  qs.stringify(data)
    })
}

// 新增
export function delConfigSource(data) {
    return request({
        url: `/afterlogin/newsconfig/del?id=${data.id}`,
        method: 'get'
    })
}

// 系统公告
// 查询未读
let notifyUrl = 'http://172.18.250.87:3433/notice'
export function getSystemNotify(data) {
    return request({
        url: `${notifyUrl}/notify/findnoticelist`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export function getUnreadNotify(data) {
    return request({
        url: `${notifyUrl}/notify/noticeuser`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export function getNotifyDetail(data) {
    return request({
        url: `${notifyUrl}/notify/setisread`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询部门树
export function getDeptnoTree(data) {
    return request({
        url: `${notifyUrl}/user/depttree`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询部门下的人员
export function getDeptnoUser(data) {
    return request({
        url: `${notifyUrl}/user/userlist`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新增公告
export function addNotice(data) {
    return request({
        url: `${notifyUrl}/notify/addnotice`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询列表
export function getNotifyList(data) {
    return request({
        url: `${notifyUrl}/notify/findnoticelist`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 设置过期
export function setNotifyDisabled(data) {
    return request({
        url: `${notifyUrl}/notify/setovertime`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询全部东方号账号
export function getAllDFHaccount(data) {
    return request({
        url: `/afterlogin/newsconfig/dfhuser`,
        method: 'post',
        data: qs.stringify(data)
    })
}
