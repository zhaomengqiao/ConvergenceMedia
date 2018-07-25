import request from '@/utils/request'
import qs from 'qs'

// 查询审核状态
export function searchAuditStatus(data) {
    return request({
        url: '/api/newsmanager/queryisaudit',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方头条-视频-添加优质
export function videoAddQuality(data) {
    return request({
        url: '/api/highqualityvideo/addvideo',
        method: 'post',
        data: qs.stringify(data)
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

// 东方头条-视频-修改封面
export function videoCover(data) {
    return request({
        url: '/api/videomanager/insertcover',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 内容管理-操作轨迹（香港头条 暂不显示）
export function queryOperlist(data) {
    return request({
        url: '/api/newsmanager/queryoperlist',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 标红敏感词获取（除扬子头条）
export function getRedKeyWords() {
    return request({
        url: '/share/keys',
        method: 'get'
    })
}

// 标红敏感词获取（扬子头条）
export function yangSensitiveWords() {
    return request({
        url: '/api/yzwbcontentkeywords/queryallkeys',
        method: 'get'
    })
}

// 查询最新操作人
export function searchNewEditor(data) {
    return request({
        url: '/api/newsmanager/queryuser',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询是否置顶
export function searchIsTop(data) {
    return request({
        url: '/api/newsmanager/querytop',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方头条-新闻-修改标签
export function changeTimeliness(data) {
    return request({
        url: '/api/newsmanager/changetimeliness',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方头条-新闻-修改时效性
export function changeCustomTag(data) {
    return request({
        url: '/api/newsmanager/changecustomtag',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方头条-视频-修改标签
export function changeVideoCustomTag(data) {
    return request({
        url: '/api/videomanager/changecustomtag',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方头条-视频-修改时效性
export function changeVideoTimeliness(data) {
    return request({
        url: '/api/videomanager/changetimeliness',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 东方头条-优质内容库分类
export function getHqualityClass() {
    return request({
        url: '/api/addtoutiaonews/type/0',
        method: 'get'
    })
}

// 东方头条-优质内容列表
export function hQualityKeywords() {
    let param = {json: JSON.stringify(data)}
    return request({
        url: '/api/highqualitynews/querybykeywords',
        method: 'post',
        data: qs.stringify(param)
    })
}

// 查询具体新闻信息
export function blackSearch(data) {
    let type ='';
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '猫扑体育':
            return request({
                url: `/api/sportsnewsmanager/query/mpsport?url=${data.url}`,
                method: 'get'
            })
            break;
        case '猎奇新闻':
            return request({
                url: `/api/lieqinewsmanage/query?url=${data.url}`,
                method: 'get'
            })
            break;
        default:
            return request({
                url: `/api/${data.platform}/query?url=${data.url}`,
                method: 'get'
            })
	}
}

// 加黑
export function addblack(data) {
    let type ='';
    let param = data.param
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '猫扑体育':
            return request({
                url: `/api/sportsnewsmanager/addblack/mpsport/${type}`,
                method: 'post',
                data: qs.stringify(param)
            })
            break;
        case '猎奇新闻':
            return request({
                url: `/api/lieqinewsmanage/addblack?rowkey=${param.rowkey}&&reason=${param.reason}`,
                method: 'get'
            })
            break;
        default:
            return request({
                url: `/api/${data.platform}/addblack`,
                method: 'post',
                data: qs.stringify(param)
            })
	}
}

// 撤销
export function removeblack(data) {
    let type ='';
    let param = data.param
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '猫扑体育':
            return request({
                url: `/api/sportsnewsmanager/removeblack/mpsport/${type}`,
                method: 'post',
                data: qs.stringify(param)
            })
            break;
        case '猎奇新闻':
            return request({
                url: `/api/lieqinewsmanage/removeblack?rowkey=${param.rowkey}`,
                method: 'get'
            })
            break;
        default:
            return request({
                url: `/api/${data.platform}/removeblack`,
                method: 'post',
                data: qs.stringify(param)
            })
	}
}

// 东方头条-新闻-稿件替换 / 其他-稿件删除
export function add404(data) {
    let type ='';
    let param = data.param
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '猫扑体育':
            return request({
                url: `/api/sportsnewsmanager/add404/mpsport/${type}`,
                method: 'post',
                data: qs.stringify(param)
            })
            break;
        case '猎奇新闻':
            return request({
                url: `/api/lieqinewsmanage/add404?json=${param}&&reason=${reason}`,
                method: 'get'
            })
            break;
        default:
            return request({
                url: `/api/lieqinewsmanage/add404?json=${param}&&reason=${reason}`,
                method: 'post',
                data: qs.stringify(param)
            })
	}
}

// 东方头条-新闻-稿件删除
export function delete404(data) {
    let type ='';
    let param = data.param
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    return request({
        url: `/api/${data.platform}/delete404`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// 允许/禁止 评论
export function addcommentban(data) {
    let type ='';
    let param = data.param
    let isban = data.isban;
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '东方体育':
            return request({
                url: `/api/sportsnewsmanager/commentsop/dfsport/${type}/isban/${isban}`,
                method: 'post',
                data: qs.stringify(param)
            })
            break;
        default:
            return request({
                url: `/api/${data.platform}/addcommentban`,
                method: 'post',
                data: qs.stringify(param)
            })
	}
}

// 评论显示/隐藏
export function addcommentblk(data) {
    let type ='';
    let param = data.param
    let isblk = data.isblk;
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '东方体育':
            return request({
                url: `/api/sportsnewsmanager/commentsop/dfsport/${type}/isblk/${isblk}`,
                method: 'post',
                data: qs.stringify(param)
            })
            break;
        default:
            return request({
                url: `/api/${data.platform}/addcommentblk`,
                method: 'post',
                data: qs.stringify(param)
            })
	}
}

// 禁止/允许 内容赞
export function praiseContent(data) {
    let type ='';
    let param = data.param
    let iszan = params.iszan;
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '东方体育':
            return request({
                url: `/api/sportsnewsmanager/commentsop/dfsport/${type}/iszan/${iszan}`,
                method: 'post',
                data: qs.stringify(param)
            })
            break;
        default:
            return request({
                url: `/api/${data.platform}/addcommentzan`,
                method: 'post',
                data: qs.stringify(param)
            })
	}
}

// 禁止/允许 内容踩
export function trampleContent(data) {
    let type ='';
    let param = data.param
    let iscai = params.iscai;
    switch (data.type) {
		case '文章':
			type = 'news'
			break;
		case '图集':
			type = 'picture'
			break;
		case '视频':
			type = 'video'
			break;
	}
    switch (data.nowPlat) {
        case '东方体育':
            return request({
                url: `/api/sportsnewsmanager/commentsop/dfsport/${type}/iscai/${iscai}`,
                method: 'post',
                data: qs.stringify(param)
            })
            break;
        default:
            return request({
                url: `/api/${data.platform}/addcommentcai`,
                method: 'post',
                data: qs.stringify(param)
            })
	}
}

// 编辑标题
export function edittitle(data) {
    let param = data.param
    return request({
        url: `/api/${data.platform}/edittitle`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// 编辑来源
export function editsource(data) {
    let param = data.param
    return request({
        url: `/api/${data.platform}/editsource`,
        method: 'post',
        data: qs.stringify(param)
    })
}

//----- 允许/禁止广告
export function allowAd(data) {
    let type ='';
    let param = data.param
    switch (data.type) {
        case '文章':
            type = 'newsmanager'
            break;
        case '图集':
            type = 'picturemanager'
            break;
        case '视频':
            type = 'videomanager'
            break;
	}
    return request({
        url: `/api/${type}/addadvcontrol`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// APP分类管理
// APP分类管理 ----- 新增
export function addAppClassify(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/channel/addchannel`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// APP分类管理 ----- 查询
export function searchAppClassify(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/channel/querychannel`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// APP分类管理 ----- 编辑
export function editAppClassify(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/channel/updatechannel`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// APP分类管理 ----- 排序
export function sortAppClassify(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/channel/sortchannel`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// APP分类管理 ----- 校检
export function judgeAppClassify(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/channel/checkchannel`,
        method: 'post',
        data: qs.stringify(param)
    })
}

export const getfileUpload = `/rongmeitiapi/api/fileUpload/file`// getVideoUpload 新闻图片上传

// 评论管理-----------------
// 评论白名单列表
export function getCommentWhiteList(data) {
    return request({
        url: `/api/commentaudit/querynews`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 新增评论审核新闻
export function addCommentWhiteList(data) {
    return request({
        url: `/api/commentaudit/addnews`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 删除评论审核新闻
export function delCommentWhiteList(data) {
    return request({
        url: `/api/commentaudit/delnews`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 活动配置
// 答题分享配置
// 查询模板
export function getAnswerTemplate(data) {
    return request({
        url: `/api/answertemplate/queryall`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新增模板
export function addAnswerTemplate(data) {
    return request({
        url: `/api/answertemplate/add`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询单个
export function getSingleAnswerTemplate(data) {
    return request({
        url: `/api/answertemplate/queryone`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 修改
export function editAnswerTemplate(data) {
    return request({
        url: `/api/answertemplate/update`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 删除
export function delAnswerTemplate(data) {
    return request({
        url: `/api/answertemplate/del`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 测试工具
// MP4列表
export function getTestMp4List(data) {
    return request({
        url: `/api/videomanager/findrecommendvideo`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻预览加黑
// 香港新闻预览加黑(瀑布、现在都用这个)
export function getXianggangList(data) {
    return request({
        url: `/api/newslocaladdblack/querylocalnews`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 新闻预览加黑/取消
export function changestate(data) {
    return request({
        url: `/api/newslocaladdblack/changestate`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export function getNewbytype(data) {
    return request({
        url: `/api/newslocaladdblack/newbytype`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export function platformSearch(data) {
    return request({
        url: `/api/newslocaladdblack/query/${data.area}`,
        method: 'get'
    })
}

// 文件上传
// txt上传批量修改
export function uploadTaskAdd(data) {
    return request({
        url: `/task/add`,
        method: 'post',
        data: qs.stringify(data)
    })
}

//文本上传地址
export const UploadTaskUrl = `/rongmeitiapi/task/upload`;
export const uploadFilmEditing = `/rongmeitiapi/task/upload`

// 关键词管理
// 获取关键词管理
export function getKeyWordList(data) {
    let params = ''
    if(data.url=='api/invalidkeys/query'||data.url=='api/blockadskeys/query'||data.url=='api/commonkeywords/query'){
        params = { json: JSON.stringify(data),url:data.url }
    }else{
        params = data
    }
    return request({
        url: `/${data.url}`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 添加关键字管理
export function addAuditKey(data) {
    if(data.url=='api/commonkeywords/add'){
        let data = { json: JSON.stringify(data),url:data.url }
    }else{
        let data = data
    }
    return request({
        url: `/${data.url}`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 修改关键词管理
export function updateAuditKey(data) {
    let url = data.url
    if(data.url == 'api/commonkeywords/update'){
        data = {json: JSON.stringify(data)}
    }
    if(data.url == 'api/commonkeywords/del'){
        data = {json: JSON.stringify(data)}
    }
    return request({
        url: `/${url}`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export const UploadXlsxUrl = `/rongmeitiapi/api/batchaddkey/importexl`
export const exportExlData = `/rongmeitiapi/api/batchaddkey/exportexl`
export const getTemplateshow = `/rongmeitiapi/api/batchaddkey/templateshow`

// 扬子敏感词查询
// 敏感词查询
export function yzLexiconList(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/yzwbsensitivewords/query`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// 扬子敏感词添加
export function yzLexiconAdd(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/yzwbsensitivewords/add`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// 扬子敏感词编辑
export function yzLexiconEdit(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/yzwbsensitivewords/edit`,
        method: 'post',
        data: qs.stringify(param)
    })
}

// 地方站关键词
export function localLexiconList(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/localstationkeywords/query`,
        method: 'post',
        data: qs.stringify(param)
    })
}

export function localLexiconAdd(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/localstationkeywords/add`,
        method: 'post',
        data: qs.stringify(param)
    })
}

export function localLexiconEdit(data) {
    let param = {json: JSON.stringify(data)}
    return request({
        url: `/api/localstationkeywords/update`,
        method: 'post',
        data: qs.stringify(param)
    })
}

export function localLexiconDel(data) {
    return request({
        url: `/api/localstationkeywords/del`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 小视频维护工具
// 通过rowkey查询视频
export function getShortVideoByRowkey(data) {
    return request({
        url: `/api/newsmanager/querydetailbyrowkey`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 通过username查询视频
export function getShortVideoByUsername(data) {
    return request({
        url: `/api/newsmanager/querylistbyname`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 通过用户id查询视频
export function getShortVideoByUserId(data) {
    return request({
        url: `/api/newsmanager/querylistbyuserid`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 根据rowkey加黑视频
export function addBlackShortVideoByRowkey(data) {
    return request({
        url: `/api/newsmanager/addblackbyrowkey`,
        method: 'post',
        data: qs.stringify(data)
    })
}
