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

// 直播黑名单列表
export function queryBlackList(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/queryBlackList',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 撤销直播黑名单
export function removeBlack(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/removeBlack',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 直播举报查询房间id
export function queryRoomReportList(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/queryreport',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 关闭直播房间
export function finishRoom(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/finishRoom',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 直播举报查询主播id
export function queryUserReportList(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/queryreportpeople',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 查询我的直播
export function queryLiveList(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/queryAll',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 截取直播回看
export function updateLookBack(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/videoCut',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 关闭直播房间服务器
export function finishRoomTwo(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/finishRoomTwo',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 更新直播观看人数
export function updateLiveCount(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/updateCount',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 删除直播房间
export function deleteRoom(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/deleteroom',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 查询主播历史
export function queryLiveListHistory(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/liveroommanager/history',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 流名管理
// 直播流名列表
export function streamNameList(data) {
    return request({
        url: '/api/livecode/querylivecode',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 修改直播流状态
export function changeStreamStatus(data) {
    return request({
        url: '/api/livecode/updatelivecode',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新增直播流名
export function addStreamName(data) {
    return request({
        url: '/api/livecode/addlivecode',
        method: 'post',
        data: qs.stringify(data)
    })
}
