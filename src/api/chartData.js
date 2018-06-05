import request from '@/utils/request'
import qs from 'qs'

// 待审稿件数据
export function getPendingData(data) {
    return request({
        url: '/api/homepagedatacenter/getunauditnum',
        method: 'get'
    })
}

// 昨日稿件产出
export function getProduceData(data) {
    return request({
        url: `api/homepagedatacenter/getaddnewsnum/${data.day}/${data.articleType}?platform=${data.platform}`,
        method: 'get'
    })
}

// 昨日稿件产出
export function getTopNum(data) {
    return request({
        url: `api/homepagedatacenter/getonlinecoutnewstop/${data.platform}/0`,
        method: 'get'
    })
}
