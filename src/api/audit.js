import request from '@/utils/request'
import qs from 'qs'

// 短视频获取待审核数据
export function getShortVideoNum(data) {
    return request({
        url: `/audit/uservideo/selectedUncheckedNum`,
        method: 'get'
    })
}
// 短视频审核获取审核列表
export function getShortVideoAuditList(data) {
    return request({
        url: `/audit/uservideo/detail`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 审核通过
export function passShortVideo(data) {
    return request({
        url: `/audit/uservideo/audit-pass`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 审核拒绝
export function refuseShortVideo(data) {
    return request({
        url: `/audit/uservideo/audit-refused`,
        method: 'post',
        data: qs.stringify(data)
    })
}
/**
 * 待审核数量
 * @param type 自媒体/东方号
 * @param subType news/video/picture
 */
export function UncheckedNum(data) {
    return request({
        url: `${data.type}/${data.subType}/selectedUncheckedNum`,
        method: 'get'
    })
}

// 审核内容
export function getNewExam(data) {
    let params = data.param
    return request({
        url: `${data.type}/news/detail`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 新闻审核通过
export function newPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/news/audit-pass`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 新闻审核拒绝
export function newNoPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/news/audit-refused`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 新闻审核驳回
export function newEditPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/news/audit-reject`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 获取图集审核
export function getPictureInfo(data) {
    let params = data.param
    return request({
        url: `${data.type}/picture/detail`,
        method: 'post',
        data: qs.stringify(params)
    })
}
// 图集通过
export function imgPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/picture/audit-pass`,
        method: 'post',
        data: qs.stringify(params)
    })
}
// 图集审拒
export function imgNoPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/picture/audit-refused`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 视频审核
export function getVideoInfo(data) {
    let params = data.param
    return request({
        url: `${data.type}/video/detail`,
        method: 'post',
        data: qs.stringify(params)
    })
}


// 审核分类
export function examPlatType(data) {
    return request({
        url: `${data.type}/type/${data.parentpy}`,
        method: 'get'
    })
}

// 视频审核分类
export function getVideoType(data) {
    return request({
        url: `${data.type}/video/types/${data.pid}/${data.tlevel}`,
        method: 'get'
    })
}

// 视频审核通过
export function videoPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/video/audit-pass`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 视频审核拒绝
export function videoNoPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/video/audit-refused`,
        method: 'post',
        data: qs.stringify(params)
    })
}
// 切换页面回收
// 东方号 | 新媒体
export function removeDoExamData(data) {
    return request({
        url: `share/recoveryqueuenew`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export function removeExamData(data) {
    return request({
        url: `share/recoveryqueue`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方网审核--------------
// 获取审核详情
export function getDfwNewExam(data) {
    return request({
        url: `${data.type}/news/detail/${data.size}`,
        method: 'get'
    })
}

// 编辑审核通过/拒绝
export function editNewPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/news/editaudit-pass`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export function editNewNoPassed(data) {
    let params = data.param
    return request({
        url: `${data.type}/news/editaudit-refused`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export function newType(data) {
    return request({
        url: `${data.type}/news/type/${data.parentId}`,
        method: 'get'
    })
}

// 东方网审核复审/三审
// sign 0二审  1三审
export function getDfwRecheck(data) {
    return request({
        url: `afterlogin/multipartaudit/detail/${data.type}/${data.size}`,
        method: 'get'
    })
}

// 通过
export function passDfwRecheck(data) {
    let params = data.param
    return request({
        url: `afterlogin/multipartaudit/audit-pass/${data.type}`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 拒绝
export function refuseDfwRecheck(data) {
    let params = data.param
    return request({
        url: `afterlogin/multipartaudit/audit-refused/${data.type}`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 编辑通过
export function passEditDfwRecheck(data) {
    let params = data.param
    return request({
        url: `afterlogin/multipartaudit/editaudit-pass/${data.type}`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 编辑拒绝
export function refuseEditDfwRecheck(data) {
    let params = data.param
    return request({
        url: `afterlogin/multipartaudit/editaudit-refused/${data.type}`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 账号审核
// 东方号账号审核列表
export function searchReview(data) {
    return request({
        url: `${data.type}/querybycontent`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方号账号审核查询详情
export function reviewAddQuery(data) {
    return request({
        url: `${data.type}/queryuserinfodetail/${data.id}`,
        method: 'get'
    })
}

// 查询是否已被审核
export function checkReview(data) {
    return request({
        url: `${data.type}/checkapplystatus/${data.userid}`,
        method: 'get'
    })
}

// 提交新增审核
export function submitReview(data) {
    return request({
        url: `${data.type}/auditresults`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 身份认证
export function verifyIdentity(data) {
    return request({
        url: `api/toexamine/verifyIdentity`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 驳回编辑
// 获取分类------
export function getRejectType(data) {
    return request({
        url: `wemedia/newsReject/type/${data.pid}`,
        method: 'get'
    })
}

// 获取驳回内容
export function getNewsReject(data) {
    return request({
        url: `wemedia/newsReject/detail/${data.size}/${data.type}`,
        method: 'get'
    })
}

// 驳回编辑正文预览
export function rejectContentPreview(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: `wemedia/newsReject/contentPreview`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 驳回编辑缩略图预览
export function rejectImgPreview(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: `wemedia/newsReject/pagePreview`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 驳回编辑保存
export function newsRejectSave(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: `wemedia/newsReject/save`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 驳回编辑三步合一保存
export function newsRejectSaveAll(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: `wemedia/newsReject/saveall`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 驳回编辑拒绝
export function newsRejectNoPasse(data) {
    return request({
        url: `wemedia/newsReject/audit-refused`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 内容分拣
// 新闻分拣查询
export function getTagslog(data) {
    return request({
        url: `addnewstag/detail/${data.size}`,
        method: 'get'
    })
}

// 新闻分拣提交
export function addTagslog(data) {
    let params = {
        json: JSON.stringify(data)
    }
    return request({
        url: `addnewstag/saveinfo`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 视频分拣查询
export function getVideoTags(data) {
    return request({
        url: `addvideotag/detail/${data.size}`,
        method: 'get'
    })
}

// 视频分拣保存
export function addVideoTags(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `addvideotag/saveinfo`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 评论审核监控
// 查询
export function getCommentAuditList(data) {
    return request({
        url: `afterlogin/reviewmonitoring/reviewcommentcountlist`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 导出评论审核监控
export const exportCommentAuditAll = `/rongmeitiapi/afterlogin/reviewmonitoring/exportcommentcount?`

// 昵称审核监控
// 查询
export function getNickNameAuditList(data) {
    return request({
        url: `afterlogin/reviewmonitoring/reviewusernamecountlist`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 导出昵称审核监控
export const exportNickNameAuditAll = `/rongmeitiapi/afterlogin/reviewmonitoring/exportusernamecount?`

// 昵称审核监控详情
// 查询
export function getNickNameAuditDetail(data) {
    return request({
        url: `afterlogin/reviewmonitoring/reviewusernamelist`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 导出昵称审核
export const exportNickNameAuditDetail = `/rongmeitiapi/afterlogin/reviewmonitoring/exportusernamelist?`

// 评论审核详情列表
// 查询
export function getCommentAuditDetailList(data) {
    return request({
        url: `afterlogin/reviewmonitoring/reviewcommentlist`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 数据
export function getCommentAuditDetailNum(data) {
    return request({
        url: `afterlogin/reviewmonitoring/reviewcommentcountdetail`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 审核日志编号获取
export function getCommentDetailLog(data) {
    return request({
        url: `afterlogin/reviewmonitoring/logtypesbyplatform?platform=${data.platform}&newstype=${data.newstype}`,
        method: 'get'
    })
}

// 导出
export const exportCommentDetail = `/rongmeitiapi/afterlogin/reviewmonitoring/exportcommentlist?`

// 审核巡查
export function getAuditPatrol(data) {
    return request({
        url: `afterlogin/auditpatrol/getauditpatrols`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 通过/拒绝
export function changePatrolStatus(data) {
    return request({
        url: `afterlogin/auditpatrol/updateall`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 取消巡查
export function cancelPatrol(data) {
    return request({
        url: `afterlogin/auditpatrol/cancelpatrol`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方网骑车新闻审核
// 审核通过
export function newsCarPassed(data) {
    return request({
        url: `api/eastdayqichenewsaudit/audit-pass`,
        method: 'post',
        data: qs.stringify(data.param)
    })
}
// 审核拒绝
export function newsCarNoPassed(data) {
    return request({
        url: `api/eastdayqichenewsaudit/audit-refuse`,
        method: 'post',
        data: qs.stringify(data.param)
    })
}
// 东方网汽车
export function getNewsCarExamList(data) {
    return request({
        url: `api/eastdayqichenewsaudit/unauditnewslist?size=${data.size}`,
        method: 'get',
        data: qs.stringify(data)
    })
}

// 东方网汽车待审数量
export function UncheckedCarNum(data) {
    return request({
        url: `api/eastdayqichenewsaudit/unauditnum`,
        method: 'get'
    })
}

// 审核通过
export function searchExamPass(data) {
    return request({
        url: `searcheAudit/audit-pass`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 审核拒绝
export function searchExamNoPass(data) {
    return request({
        url: `searcheAudit/audit-refuse`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询搜索审核详情
export function searchExamDetail(data) {
    return request({
        url: `searcheAudit/queryDetail`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 搜索审核
export function searchExam(data) {
    return request({
        url: `searcheAudit/search`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 搜索审核校检
export function searchExamVerification(data) {
    return request({
        url: `searcheAudit/checkDataVaild`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 巡查监控
// 获取巡查人员列表
export function getAuditPatrolUser(data) {
    return request({
        url: `afterlogin/reviewmonitoring/getreviewpatroluser`,
        method: 'get'
    })
}
// 巡查监控报表
export function getAuditPatrolList(data) {
    return request({
        url: `afterlogin/reviewmonitoring/reviewauditpatrolcountlist`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 巡查报表导出
export const exportPatrolListExcel = `/rongmeitiapi/afterlogin/reviewmonitoring/exportreviewauditpatrolcountlist?`

// 巡查详情
// 巡查详情列表
export function getAuditPatrolDetail(data) {
    return request({
        url: `afterlogin/reviewmonitoring/reviewauditpatrollist`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 查询新闻详情
export function getPatrolContentDetail(data) {
    return request({
        url: `afterlogin/reviewmonitoring/detail?url=${data.url}`,
        method: 'get'
    })
}
// 巡查详情导出
export const exportPatrolDetailExcel = `/rongmeitiapi/afterlogin/reviewmonitoring/exportreviewauditpatrollist?`

// 分拣日志
export function searchTableData(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `addtagslog/query`,
        method: 'post',
        data: qs.stringify(params)
    })
}

export function searchUserData(data) {
    return request({
        url: `addtagslog/queryuser`,
        method: 'get'
    })
}

export function changeTableData(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `addtagslog/update`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 上传视频
export function uploadVideo(data) {
    let params = {json: JSON.stringify(data)}
    return request({
        url: `api/newsvideo/getauth`,
        method: 'post',
        data: qs.stringify(params)
    })
}
// $.ajax({
//     url: 'http://shshwl.up0.v1.wcsapi.com/file/upload',
//     type: "POST",
//     processData: false,
//     async: true,
//     data: {
//         token: res.data.auth,
//         key: res.data.newFileName,
//         file: file,
//         fileBinaryData: new BinaryFile(file)
//     },
//     headers: {
//         "Accept": "*/*",
//         "token": res.data.auth,
//         "Content-Type": 'multipart/form-data',
//         "Content-Length": fileSize
//     },
//     success: function(response, textStatus, jqXHR) {
//
//     }
// })

// 上传
export function videoUpload(data) {
    return request({
        url: `http://shshwl.up0.v1.wcsapi.com/file/upload`,
        method: 'post',
        data: qs.stringify(data),
        headers: {
            "Accept": "*/*",
            "token": data.auth,
            "Content-Type": 'multipart/form-data'
        }
    })
}
