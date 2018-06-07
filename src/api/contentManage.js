import request from '@/utils/request'
import qs from 'qs'

// 编辑器上传图片正式
export const UEditorBase = `../../../../rongmeitiapi`
// 我的内容查询发布列表
export function queryContentCreateList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/findmynews/queryadd',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 我的内容查询编辑列表
export function queryContentEditList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/findmynews/queryedit',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 发新闻主分类
export function newsPlatType(data) {
    let url = `/api/${data.type}/type/${data.parentId}`
    // 东方体育/五星体育/扬子晚报
    if (data.type == 'dfsportnewsadd' || data.type == 'yzwbnewsadd' || data.type == 'wuxingsportsnewsadd') {
        url = `/api/${data.type}/type`
    }
    return request({
        url: url,
        method: 'get',
    })
}

// 新闻编辑---正文预览
export function newsContentPreview(data) {
    let param = {
        json: JSON.stringify(data.param)
    }
    return request({
        url: `/api/${data.type}/content-preview`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// 搜索新闻详情
export function newsDetail(data) {
    return request({
        url: `api/${data.type}/detail?id=${data.id}&url=${data.id}`,
        method: 'get'
    })
}

// 缩略图预览
export function newsImgPreview(data) {
    let param = {
        json: JSON.stringify(data.param)
    }
    return request({
        url: `/api/${data.type}/mini-preview`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// 保存
export function newsAdd(data) {
    let param = {
        json: JSON.stringify(data.param)
    }
    return request({
        url: `/api/${data.type}/save`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// SEO管理工具 Begin---------------
// 查询现在新闻
export function getSeoList(data) {
    return request({
        url: '/seotools/passnewlog',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询原始新闻详情(通过url)
export function getOriginalDetail(data) {
    return request({
        url: '/seotools/orinewdetail',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新增保存
export function saveSEOData(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/seotools/save',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 查询渠道
export function getSeoChannels(data) {
    return request({
        url: '/seotools/groupchannel',
        method: 'get'
    })
}

// 查询原始新闻详情(通过rowkey)
export function getOriginalDetailByRowkey(data) {
    return request({
        url: '/seotools/queryseonewdetail',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 编辑保存
export function saveEditSeoData(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/seotools/saveeditseonew',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 查询草稿列表
export function queryNewsDraft(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/addnewsdraft/querydraft',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 新增草稿
export function addNewsDraft(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/addnewsdraft/savedraft',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 删除
export function deleteNewsDraft(data) {
    return request({
        url: '/api/addnewsdraft/deldraft',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 获取视频列表
export function getAddVideoList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/newsvideo/videoinfo',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 发布图集---------------
// 获取图集分类
export function newsPictureType(data) {
    return request({
        url: `/api/picturenews/query/${data.platform}`,
        method: 'get'
    })
}
// 新增图集
export function addPicturenews(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/picturenews/addsave',
        method: 'post',
        data: qs.stringify(param)
    })
}
// 编辑图集
export function savePicturenews(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/picturenews/editsave',
        method: 'post',
        data: qs.stringify(param)
    })
}
// 查询图集
export function searchPictures(data) {
    return request({
        url: '/api/picturenews/querydetail',
        method: 'post',
        data: qs.stringify(data)
    })
}

//审核分类
export function examPlatType(data) {
    return request({
        url: `/${data.type}/type/${data.parentpy}`,
        method: 'get'
    })
}

// 查询SEO日志表
export function getSeoLogList(data) {
    return request({
        url: '/seotools/seosavelog',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 日志查询 用户、渠道、分类组
/**
 * [getSeoLogCondition description]
 * @param  {[sign]} createuser [用户]
 * @param  {[sign]} channel [渠道]
 * @param  {[sign]} mtp [分类]
 */
export function getSeoLogCondition(data) {
    return request({
        url: `/seotools/group/${data.sign}`,
        method: 'get'
    })
}

// 删除SEO新闻
export function delSeoNews(data) {
    return request({
        url: '/seotools/dellseonew',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 保存草稿
export function savedraft(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/seotools/savedraft',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 视频权限
// export function newsvideoGetauth(data) {
//     let param = {
//         json: JSON.stringify(data)
//     }
//     let url = '';
//     if (data.type == 'share') {
//         url = `/${data.type}/getauth`
//     } else {
//         url = `/api/${data.type}/getauth`
//     }
//     return request({
//         url: url,
//         method: 'post',
//         data: qs.stringify(param)
//     })
// }

// 内容同步---------------------------
// 同步类别
export function getCategory(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/videocrawlerdetail/type',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 同步接口
export function syncContent(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/videocrawlerdetail/detailsave',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 同步列表
export function getSyncContent(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/videocrawlerdetail/queryinfo',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 源视频维护工具----------------------
// 获取列表
export function getSourceVideo(data) {
    return request({
        url: '/api/newsmanager/queryuserchannel',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 用户名加黑
export function addBlackSourceVideo(data) {
    return request({
        url: '/api/newsmanager/addblackbyuserid',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 通过rowkey加黑
export function addBlackSourceVideoByRowkey(data) {
    return request({
        url: '/api/newsmanager/addblackbyrowkey',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 内容库
// 去重分类 ------------------
export function getRepetitionTypes(data) {
    return request({
        url: '/api/addtoutiaonews/type/0',
        method: 'get'
    })
}

// 去重稿件 ------------------
export function getRepetitionArticle(data) {
    return request({
        url: '/afterlogin/deweightnews/query',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 去重稿件 ------------------
export function delRepetitionArticle(data) {
    return request({
        url: '/afterlogin/deweightnews/update',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 体育赛程编辑
// 获取队名
export function getTeamName(data) {
    return request({
        url: '/api/sportsscheduleadd/getteamname',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 保存
export function matchBasicAdd(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/sportsscheduleadd/saveschedule',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 查询单一赛程
export function matchSingleApi(data) {
    return request({
        url: '/api/sportsscheduleedit/detail',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 赛程编辑
export function matchEditApi(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/sportsscheduleedit/updateschedule',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 赛程分类
export function getMatchType(data) {
    return request({
        url: '/api/sportsscheduleadd/gettype',
        method: 'get'
    })
}

// 赛程管理
// 拉取赛程
export function matchListApi(data) {
    return request({
        url: '/api/sportsscheduleedit/list',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 删除赛程
export function matchDelApi(data) {
    return request({
        url: '/api/sportsscheduleedit/del',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 匹配球队
export function matchTeamApi(data) {
    return request({
        url: '/api/sportsscheduleadd/getteamname',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 优质内容库分类
export function getHqualityClass(data) {
    return request({
        url: `/api/addtoutiaonews/type/0`,
        method: 'get'
    })
}

// 扬子头条敏感新闻管理
export function queryYzMgNews(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/yzwbsensitive/news/query',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 已阅
export function yangAlreadyRead(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/yzwbhotlist/read',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 更改已阅
export function updateNewsRead(data) {
    return request({
        url: '/yzwbsensitive/news/changeread',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 优质内容库--------
// 优质内容库编辑
// 编辑网易滚动新闻
export function neteaseNewsEdit(data) {
    return request({
        url: '/api/crawlernews/checkisexist',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 网易滚动新闻
export function neteaseNewsList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/crawlernews/querynewslist',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 新增至优质库
export function hQualityEditheader(data) {
    data.subheader = JSON.stringify(data.subheader)
    return request({
        url: '/api/highqualitynews/editheader',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 优质内容库新闻分词查询
export function hQualityKeywords(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/highqualitynews/querybykeywords',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 优质新闻url查询
export function hQualityUrl(data) {
    return request({
        url: '/api/highqualitynews/querybyurl',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询中青团新闻列表
export function getCYCNETlist(data) {
    return request({
        url: '/api/highqualitynews/queryzhongqingnews',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询中青网分类
export function getCYCNETtype(data) {
    return request({
        url: '/api/highqualitynews/queryzhongqingtype',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 检测是否被新闻编辑过优质
export function checkQualityIsEdit(data) {
    return request({
        url: '/api/highqualitynews/checkIsEdit',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 优质内容列表
// 副标题点击率
export function hQualityClickRate(data) {
    return request({
        url: '/api/highqualitynews/querysubtitle',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 优质内容操作人员列表
export function hQualityUser(data) {
    return request({
        url: '/api/highqualitynews/queryuser',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 获取表格数据
export function hQualityKeywordsList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/highqualitynews/querynewslist',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 优质内容库删除
export function delhQuality(data) {
    return request({
        url: '/api/highqualitynews/delqualitynews',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 头条榜单
export function getToutiaoTopList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/dftthotlist/querynewslist',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 榜单查询详情
export function yangDetail(data) {
    return request({
        url: `/api/yzwbcontentkeywords/detail?url=${data.url}`,
        method: 'get'
    })
}

// 扬子敏感词
export function yangSensitiveWords(data) {
    return request({
        url: `/api/yzwbcontentkeywords/queryallkeys`,
        method: 'get'
    })
}

// 扬子榜单
export function yangList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/yzwbhotlist/hotlist',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 优质视频列表
// 分类获取
export function newsvideoapiGettypes(data) {
    return request({
        url: `/api/${data.type}/gettypes`,
        method: 'get'
    })
}

// 东方头条-视频-删除优质
export function videoDelQuality(data) {
    return request({
        url: '/api/highqualityvideo/removevideo',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方头条-视频-编辑人
export function videoQuality(data) {
    return request({
        url: '/api/highqualityvideo/queryuser',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 优质视频列表
export function videohQualityList(data) {
    let param = {
        json: JSON.stringify(data)
    }
    return request({
        url: '/api/highqualityvideo/querylist',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 视频编辑
//文件名加密
export function videoAliyun(data) {
    return request({
        url: '/md5filename/encryption',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 发视频
export function newsvideoGetauth(data) {
    let params = {json: JSON.stringify(data)}
    let url = ''
    if(params.type=='share'){
        url=`/${params.type}/getauth`
    }else if(params.type=='sportsvideopublish'){
        url=`/afterlogin/${params.type}/getauth`
    }else{
        url=`/api/${params.type}/getauth`
    }
    return request({
        url: url,
        method: 'post',
        data: qs.stringify(params)
    })
}
