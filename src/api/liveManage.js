import request from '@/utils/request'
import qs from 'qs'

// 创建直播房间校验直播流
export function createLiveVerify(data) {
    return request({
        url: '/api/livecode/getlivecodestatus',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 直播分类
// 直播分类列表查询
export function getLiveClassList(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/roomstylelist',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 保存直播信息
export function submitLiveInfo(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/save',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 获取直播平台权限
export function getLivePlatform(data) {
    return request({
        url: '/login/getOperPlatform',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 添加直播管理
export function addManager(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/addAdmin',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 更新直播信息
export function updateLiveInfo(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/updateTitleAndPic',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 查询管理员
export function queryAdmin(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/queryAdminList',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 查询直播详细
export function queryRoomInfo(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/getRoomTopicDetail',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const roomfileUpload = `/rongmeitiapi/api/liveroommanager/loadPicFile`// 直播上传封面api/liveroommanager/loadPicFile

// 直播id有效检测
export function itExist(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/itExist',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 拉转推生成推流url
export function setCreateUrl(data) {
    return request({
        url: '/api/liveroommanager/createurl',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 直播白名单管理
// 白名单上传图片
export function whiteUploadImg(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/uploadpic',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 主播白名单修改
export function addwhiteuser(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/editwhiteuser',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 主播白名单删除
export function removewhiteuser(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/delwhiteuser',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 主播白名单新增
export function setUserLiveState(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/setUserLiveState',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 主播白名单加黑或撤销
export function anchorChangeBlk(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/dfhwhitelist/changeblkstatus',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 主播白名单查询
export function anchorQueryList(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/querywhiteuserlist',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function anchorQueryUser(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/querywhiteuser',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 直播分类管理
// 直播新增分类
export function addClassify(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/roomstylecreate',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 直播禁用
export function forbiddenLiveClass(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/roomstyleopenorclose',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 直播修改
export function editLiveClass(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/roomstylechange',
        method: 'post',
        data: qs.stringify(params)
    })
}
