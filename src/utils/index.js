// 超时时间
export const timeoutTime = 50000

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 获取日期相差的天数
 * compareDateString大于dateString，返回正数，相差的天数；
 * 等于返回0；
 * compareDateString小于dateString，返回负数，相差的天数
 * @param dateString 日期
 * @param compareDateString 比较的日期
 */
export function getDateDiffDays(compareDateString, dateString) {
    if (dateString == '') {
        return
    }
    if (compareDateString == '') {
        return
    }
    var dateTime = dateString.getTime()
    var compareDateTime = compareDateString.getTime()
    var compareResult = compareDateString - dateString
    var diffDays = parseInt(Math.abs(compareResult) / 3600 / 24000)
    if (compareResult > 0) {
        return diffDays
    } else {
        return -diffDays
    }
}

// 将秒数换成时分秒格式
export function formatSeconds(value) {
    var theTime = parseInt(value / 1000) // 秒
    var theTime1 = 0 // 分
    var theTime2 = 0 // 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60)
            theTime1 = parseInt(theTime1 % 60)
        }
    }
    var result = '' + parseInt(theTime) + '秒'
    if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
    }
    if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
    }
    return result
}

export function formatTime(time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) {
            len += 1
        } else {
            len += 0.5
        }
    }
    return Math.floor(len)
}

export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}

export function param(json) {
    if (!json) return ''
    return cleanArray(Object.keys(json).map(key => {
        if (json[key] === undefined) return ''
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
    })).join('&')
}

export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

export function objectMerge(target, source) {
    /* Merges two  objects,
       giving the last one precedence */

    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    for (const property in source) {
        if (source.hasOwnProperty(property)) {
            const sourceProperty = source[property]
            if (typeof sourceProperty === 'object') {
                target[property] = objectMerge(target[property], sourceProperty)
                continue
            }
            target[property] = sourceProperty
        }
    }
    return target
}

export function scrollTo(element, to, duration) {
    if (duration <= 0) return
    const difference = to - element.scrollTop
    const perTick = difference / duration * 10
    setTimeout(() => {
        console.log(new Date())
        element.scrollTop = element.scrollTop + perTick
        if (element.scrollTop === to) return
        scrollTo(element, to, duration - 10)
    }, 10)
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
        classString += '' + className
    } else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
    }
    element.className = classString
}

export const pickerOptions = [{
    text: '今天',
    onClick(picker) {
        const end = new Date()
        const start = new Date(new Date().toDateString())
        end.setTime(start.getTime())
        picker.$emit('pick', [start, end])
    }
}, {
    text: '最近一周',
    onClick(picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
    }
}, {
    text: '最近一个月',
    onClick(picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
    }
}, {
    text: '最近三个月',
    onClick(picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
    }
}]

export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function(...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    for (const keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {}
                targetObj[keys] = deepClone(source[keys])
            } else {
                targetObj[keys] = source[keys]
            }
        }
    }
    return targetObj
}

// 根据不同的url区别不同平台
export function getPlatformByUrl(url) {
    var obj = {}
    if (url.indexOf('rong.ncnews.com.cn') != -1) {
        obj.add = 'nanchang';
        obj.top = 'NCJTT'
        obj.cnName = '南昌头条'
        return obj // 南昌头条
    } else if (url.indexOf('rong.hebei.com.cn') != -1) {
        obj.add = 'hebei';
        obj.top = 'HBJTT'
        obj.cnName = '河北头条'
        return obj // 河北头条
    } else if (url.indexOf('rong.jiangsutoutiao.com') != -1) {
        obj.add = 'jiangsu';
        obj.top = 'JSSTT'
        obj.cnName = '江苏头条'
        return obj // 江苏头条
    } else if (url.indexOf('rong.xkb.com.cn') != -1) {
        obj.add = 'guangdong';
        obj.top = 'GDYTT'
        obj.cnName = '广东头条'
        return obj // 广东头条
    } else if (url.indexOf('rong.gscn.com.cn') != -1) {
        obj.add = 'gansu';
        obj.top = 'GSGTT'
        obj.cnName = '甘肃头条'
        return obj // 甘肃头条
    } else if (url.indexOf('rong.gog.cn') != -1) {
        obj.add = 'guizhou';
        obj.top = 'GZGTT'
        obj.cnName = '贵州头条'
        return obj // 贵州头条
    } else if (url.indexOf('rong.dbw.cn') != -1) {
        obj.add = 'heilongjiang';
        obj.top = 'DBHTT'
        obj.cnName = '东北头条'
        return obj // 东北头条
    } else if (url.indexOf('rong.uschinapress.com') != -1) {
        obj.add = 'america';
        obj.top = 'USATT'
        obj.cnName = '美国头条'
        return obj // 美国头条
    } else if (url.indexOf('rong.headlinehk.com') != -1) {
        obj.add = 'xianggang';
        obj.top = 'XGGTT'
        obj.cnName = '香港头条'
        return obj // 香港头条
    } else if (url.indexOf('rong.yzwb.net') != -1) {
        obj.add = 'yangzi';
        obj.top = 'YZSTT'
        obj.cnName = '扬子头条'
        return obj // 扬子头条
    } else if (url.indexOf('rong.hinews.cn') != -1) {
        obj.add = 'hainan';
        obj.top = 'HNQTT'
        obj.cnName = '海南头条'
        return obj // 海南头条
    } else {
        obj.add = 'toutiao';
        obj.top = 'DFTT'
        obj.cnName = '东方头条'
        return obj // 其他默认头条
    }
}

// 将「String」中的src的空图片删除
export function delImgHasNullSrc(content) {
    // 正则匹配正文中的图片
    let imgReg = /<img.*?(?:>|\/>)/gi
    // 匹配src属性
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
    content = content.replace(imgReg, function(match) {
        if (match.match(srcReg) != null) {
            // 不存在src的img、src为空的img、src为占位图的img都删掉
            if (match.match(srcReg)[1] == '' || match.indexOf('src') == -1 || match.match(srcReg)[1].indexOf('themes/default/images/spacer.gif') != -1) {
                return ''
            } else {
                return match
            }
        } else {
            return ''
        }
    })
    return content
}

export function isNull(item, type) {
    if (item === null || item === '' || item.length === 0 || item === 'null' || item === '[]') {
        return false
    } else {
        return true
    }
}

// 判断一个对象是否包含在一个数组
export function arrContainsObj(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i].value === obj) {
            return true;
        }
    }
    return false;
}

export const contentRecommend = [{
        text: '7:30-10:00',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setHours(7, 30, 0, 0)
            end.setHours(10, 0, 0, 0)
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '10:00-12:00',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setHours(10, 0, 0, 0)
            end.setHours(12, 0, 0, 0)
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '14:00-16:00',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setHours(14, 0, 0, 0)
            end.setHours(16, 0, 0, 0)
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '16:00-18:00',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setHours(16, 0, 0, 0)
            end.setHours(18, 0, 0, 0)
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '18:00-20:00',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setHours(18, 0, 0, 0)
            end.setHours(20, 0, 0, 0)
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '20:00-22:00',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setHours(20, 0, 0, 0)
            end.setHours(22, 0, 0, 0)
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '当前半小时',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 / 2);
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '当前1小时',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000);
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '当前2小时',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 2);
            picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '当前4小时',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 4);
            picker.$emit('pick', [start, end]);
        }
    }
]

// 数字转汉字
export function NumberToChineseCharacter(section) {
    const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
    const chnUnitChar = ['', '十', '百', '千']
    var strIns = '',
        chnStr = '';
    var unitPos = 0;
    var zero = true;
    debugger
    while (section > 0) {
        var v = section % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        } else {
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    if(chnStr === '一十'){
        chnStr = '十'
    }
    return chnStr;
}

// 审核团队
export const auditTeam = [
    {
        label: '全部团队',
        value: ''
    },
    {
        label: '胡丽团队',
        value: '审核'
    },
    {
        label: '漫山网络',
        value: '福州审核'
    },
    {
        label: '神熊互娱',
        value: '外包-神熊互娱'
    }
]
