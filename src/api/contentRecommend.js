import request from '@/utils/request'
import qs from 'qs'

// 查询多条新闻信息
export function getNewsInfo(data) {
    return request({
        url: '/newsstick/queryUrlidDataForNews',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 查询多条视频信息
export function getVideoInfo(data) {
    return request({
        url: '/newsstick/queryUrlidDataForVideo',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻置顶地区
export function newsAreas(data) {
    return request({
        url: '/NewsTopUtils/areas',
        method: 'get'
    })
}

// 新闻类型 视频置顶到新闻
export function newsType(data) {
    return request({
        url: `/NewsTopUtils/type?area=${data.area}`,
        method: 'get'
    })
}

// 视频置顶到视频
export function vRecommendToVideoType(data) {
    return request({
        url: `/NewsTopUtils/videotype?area=${data.area}`,
        method: 'get'
    })
}

// 新闻置顶保存
export function newsTopSave(data) {
    return request({
        url: `/newsstick/insertStick`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻置顶 获取置顶左侧列表
export function newsTopList(data) {
    return request({
        url: `/newsstick/getStickList`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻置顶搜索
export function newsSearchTop(data) {
    return request({
        url: `/newsstick/detail`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// toutiao_video_to_video
export function queryPlatDetail(data) {
    return request({
        url: `authDetail/queryPlatDetail?${data}`,
        method: 'get'
    })
}

// 检查是否冲突
export function checkStickIsConflict(data) {
    return request({
        url: `/newsstick/checkStickIsConflict`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻置顶--用户真名
export function getNewsTopUser(data) {
    return request({
        url: `/newsstick/names`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻列表-列表数据
export function getNewsTopList(data) {
    return request({
        url: `/newsstick/getstickinfolist`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻置顶管理删除
export function newsTopManagerDel(data) {
    return request({
        url: `/newsstick/deleteStick`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻置顶管理删除
export function newsTopManagerUpdate(data) {
    return request({
        url: `/newsstick/updateStick`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 推荐至新闻时获取推荐栏目接口
export function NewsTopUtilsType(data) {
    return request({
        url: `NewsTopUtils/type?area=${data.area}`,
        method: 'get'
    })
}

// 推荐地域选择接口
export function NewsTopUtilsArea(data) {
    return request({
        url: `/NewsTopUtils/areas`,
        method: 'get'
    })
}

// 置顶到视频
export function searchVideoDetail(data) {
    return request({
        url: `/api/videomanager/query?${data}`,
        method: 'get'
    })
}
