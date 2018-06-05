import { isNull } from './'

/**
 * [contentToHtml description]
 * @param  {[type]} pagewap [整条内容详情]
 * @param  {[type]} arr     [标红敏感词数组]
 * @param  {[type]} type    [内容类型]
 * @return {[type]}         [description]
 */
export function contentToHtml(pagewap, arr, type) {
    var html = ''
    var isabroad = 0
    //			var purl = pagewap.purl;
    if (pagewap === undefined) {
        return
    }
    // 判断是否境外新闻
    if (pagewap.isabroad) {
        if (pagewap.isabroad == 1) {
            isabroad = 1;
        }
    }

    var content = pagewap.content;
    // 修改
    //
    if (type == 'dongfanghao' && pagewap.contentadd != '') {
        content = pagewap.contentadd;
    }
    if (content.indexOf("<span class='keyword_red'>") != -1 || content.indexOf("<img") != -1) {
        return content
    }
    // 匹配不需要替换的----------------
    var notReplaceADArr = [];
    var notReplaceImgArr = [];
    var notReplaceVideoArr = [];
    var indexStr = "@#@";
    function numRegHighLightMatch(str, reg) {
        var regStr = reg;
        var regObject = new RegExp(regStr, "g");
        var source = str.match(regObject);
        if (source != undefined && source != null && source.length != 0) {
            //n为hash表，r为临时数组
            var n = {}, r = [];
            //遍历当前数组
            for (var i = 0; i < source.length; i++) {
                //如果hash表中没有当前项
                if (!n[source[i]]) {
                    //存入hash表
                    n[source[i]] = true;
                    //把当前数组的当前项push到临时数组里面
                    r.push(source[i]);
                }
            }
            source = r
        }
        return source;
    }
    // 匹配广告
    notReplaceADArr = numRegHighLightMatch(content, "[$][#][advidx]+[=]\\d+[#][$]");
    // 匹配图片
    notReplaceImgArr = numRegHighLightMatch(content, "[$][#][imgidx]+[=]\\d+[#][$]");
    // 匹配视频
    notReplaceVideoArr = numRegHighLightMatch(content, "[$][#][videoidx]+[=]\\d+[#][$]");
    if (notReplaceADArr) {
        for (var i = 0; i < notReplaceADArr.length; i++) {
            content = content.replace(notReplaceADArr[i], indexStr + i + "ad@");
        }
    }
    if (notReplaceImgArr) {
        for (var i = 0; i < notReplaceImgArr.length; i++) {
            content = content.replace(notReplaceImgArr[i], indexStr + i + "m@");
        }
    }
    if (notReplaceVideoArr) {
        for (var i = 0; i < notReplaceVideoArr.length; i++) {
            content = content.replace(notReplaceVideoArr[i], indexStr + i + "vd@");
        }
    }

    // 匹配nbsp
    content = content.replace(/[&]nbsp[;]/g, "@#@n@");
    // 连续四位英文/数字标红
    var reg = new RegExp(/([0-9]|[A-z]){4}(?!>)/, "g");
    content = content.replace(reg, function (word) {
        return "<span class='keyword_red'>" + word + "</span>"
    })
    // 匹配符号添加转义符
    function escapeMetacharacterOfStr(input) {
        return input.replace(/[-$^()*+.\[\]|\\?{}]/gm, "\\$&");
    }
    // 敏感词标红
    if (arr && arr.length != 0) {
        for (var i = 0; i < arr.length; i++) {
            var pattern = new RegExp(escapeMetacharacterOfStr(arr[i]), "g");
            content = content.replace(pattern, "<span class='keyword_red'>" + arr[i] + "</span>")
        }
    }
    //有被标红的转义图片去掉span
    var redArr = [];
    redArr = numRegHighLightMatch(content, "[@][#][@][#][a-zA-Z]+[=]\\d+[#][$]");
    //恢复转移字符
    var nbspReg = new RegExp("@#@n@", "g");
    content = content.replace(nbspReg, "&nbsp;");
    //恢复标签
    if (notReplaceADArr) {
        for (var i = 0; i < notReplaceADArr.length; i++) {
            content = content.replace(indexStr + i + "ad@", notReplaceADArr[i]);
        }
    }
    if (notReplaceImgArr) {
        for (var i = 0; i < notReplaceImgArr.length; i++) {
            content = content.replace(indexStr + i + "m@", notReplaceImgArr[i]);
        }
    }
    if (notReplaceVideoArr) {
        for (var i = 0; i < notReplaceVideoArr.length; i++) {
            content = content.replace(indexStr + i + "vd@", notReplaceVideoArr[i]);
        }
    }
    if (pagewap.isadv == 1) {
        var ads = pagewap.advslist;
        ads.forEach(function (item, index) {
            var idx = parseInt(item.idx);
            var adidx = "" + idx;
            var idxtmp = "";
            for (var y = 1; y <= 4 - adidx.length; y++) {
                idxtmp += "0";
            }
            adidx = idxtmp + adidx
            adidx = "$#advidx=" + adidx + "#$";
            var advStr = '';
            advStr += '<a href="' + item.itemurl + '" target="_blank">';
            advStr += '<div class="adv_box">';
            advStr += '<div class="adv_box-left">';
            advStr += '<img src="' + item.itempicurl + '">'
            advStr += '</div>';
            advStr += '<div class="adv_box-right">';
            advStr += '<div class="adv_box-title">' + item.itemname + '</div>';
            advStr += '<div class="adv_box-price">价格：' + item.finalprice + '</div>';
            advStr += '</div>';
            advStr += '</div>';
            advStr += '</a>'
            content = content.replace(adidx, advStr);
        })
    }
    if (pagewap.imgs != null) {
        console.log("一个")
        var imgs = pagewap.imgs;
        //修改
        for (var x = 0; x < imgs.length; x++) {
            var idx = parseInt(imgs[x].idx);
            var imgidx = "" + idx;
            var idxtmp = "";
            for (var y = 1; y <= 4 - imgidx.length; y++) {
                idxtmp += "0";
            }
            imgidx = idxtmp + imgidx;
            imgidx = "$#imgidx=" + imgidx + "#$";
            // 境外使用原始图片路径
            if (isabroad == 1) {
                content = content.replace(imgidx, "<img src='"
                    + imgs[x].imgorisrc + "' style='max-width:100%'>");
            } else {
                content = content.replace(imgidx, "<img src='"
                    + imgs[x].src + "' style='max-width:100%'>");
            }

            //				var imgStr = "<img ";
            //				imgStr +='src="'+pagewap.imgs[x].src+'"';
            //				imgStr += 'alt="'+pagewap.imgs[x].alt+'"';
            //				imgStr += 'describe="'+pagewap.imgs[x].describe+'"';
            //				imgStr += 'width="'+pagewap.imgs[x].imgwidth+'"';
            //				imgStr += 'height="'+pagewap.imgs[x].imgheight+'"';
            //				imgStr += 'imgmd5="'+pagewap.imgs[x].imgmd5+'"';
            //				imgStr +="/>";
            //				content = content.replace(imgidx,imgStr);
        }
    }
    if (pagewap.imgjs != null && pagewap.imgs == null) {
        console.log("俩个")
        let imgjs = eval("(" + pagewap.imgjs + ")");
        //修改
        for (var x = 0; x < imgjs.length; x++) {
            var idx = parseInt(imgjs[x].idx);
            var imgidx = "" + idx;
            var idxtmp = "";
            for (var y = 1; y <= 4 - imgidx.length; y++) {
                idxtmp += "0";
            }
            imgidx = idxtmp + imgidx;
            imgidx = "$#imgidx=" + imgidx + "#$";
            //					content = content.replace(imgidx, "<img src='"
            //							+ pagewap.imgs[x].src + "' width='100%'>");
            var imgStr = "<img ";
            if (isabroad == 1) {
                imgStr += 'src="' + imgjs[x].imgorisrc + '"';
            } else {
                imgStr += 'src="' + imgjs[x].src + '"';
            }
            imgStr += 'alt="' + imgjs[x].alt + '"';
            imgStr += 'describe="' + imgjs[x].describe + '"';
            //					imgStr += 'width="'+imgjs[x].imgwidth+'"';
            //					imgStr += 'height="'+imgjs[x].imgheight+'"';
            imgStr += 'imgmd5="' + imgjs[x].imgmd5 + '"';
            imgStr += "/>";
            content = content.replace(imgidx, imgStr);

        }
    }
    if (pagewap.videojs != null) {//视频解析
        var video = JSON.parse(pagewap.videojs);
        for (var x = 0; x < video.length; x++) {
            var idx = parseInt(video[x].idx);
            var videoidx = "" + idx;
            var idxtmp = "";
            for (var y = 1; y <= 4 - videoidx.length; y++) {
                idxtmp += "0";
            }
            videoidx = idxtmp + videoidx;
            videoidx = "$#videoidx=" + videoidx + "#$";
            var videoStr = "<p><video ";
            videoStr += ' src="' + video[x].src + '"';
            //					videoStr += ' alt="'+video[x].alt+'"';
            //					videoStr += ' describe="'+video[x].describe+'"';
            videoStr += ' width="100%"';
            //					videoStr += ' height="'+video[x].height+'"';
            videoStr += ' controls="controls"'
            videoStr += "></video></p>";
            content = content.replace(videoidx, videoStr);
        }

    }
    var contentpage = content.split("@$paging$@");//分页替换
    if (contentpage.length > 0) {
        var p = 0;
        for (var i = 0; i < contentpage.length; i++) {
            if (contentpage[i].indexOf("@$paging$@") != -1) {
                continue;
            }
            content = content.replace('@$paging$@', '');
        }
    }
    var contenttext = content.split("!@#!@");
    if (contenttext.length > 0) {
        var j = 0;
        for (var i = 0; i < contenttext.length; i++) {
            if (contenttext[i].length != 0) {
                if (contenttext[i].indexOf("$#imgidx=") != -1) {
                    continue;
                }
                html = html + contenttext[i] + "<br><br>";
            }
        }
    }
    return html
}

// SEO isrobot
export function contentEditorHtml(pagewap,type,isrobot) {
    var html = "";
//			var purl = pagewap.purl;
    if(pagewap == undefined){
        return;
    }
    var content = pagewap.contentadd;
    if(content == undefined || content == null || content == ''){
        content = pagewap.content;
    }
    if(isrobot == 'robotzw'){
        content = pagewap.robotzw
    }
    if(type=='gbk'){
        if(pagewap.contentgbk!=''&&pagewap.contentgbk!=null){
            content = pagewap.contentgbk
        }else{
            content = pagewap.contentadd;
            if(content == undefined || content == null || content == ''){
                content = pagewap.content;
            }
        }
    }
    if (pagewap.imgs!=null) {
//				var imgs =JSON.parse(pagewap.imgs);
        var imgs =pagewap.imgs;
        for (var x = 0; x < imgs.length; x++) {
            var idx = parseInt(imgs[x].idx);
            var imgidx = "" + idx;
            var idxtmp = "";
            for (var y = 1; y <= 4 - imgidx.length; y++) {
                idxtmp += "0";
            }
            imgidx = idxtmp + imgidx;
            imgidx = "$#imgidx=" + imgidx + "#$";
//					content = content.replace(imgidx, "<img src='"
//							+ imgs[x].src + "' width='100%'>");
                var imgStr = "<img ";
                imgStr +='src="'+pagewap.imgs[x].src+'"';
                imgStr += 'alt="'+pagewap.imgs[x].alt+'"';
                imgStr += 'describe="'+pagewap.imgs[x].describe+'"';
                imgStr += 'width="'+pagewap.imgs[x].imgwidth+'"';
                imgStr += 'height="'+pagewap.imgs[x].imgheight+'"';
                imgStr += 'imgmd5="'+pagewap.imgs[x].imgmd5+'"';
                imgStr +="/>";
                content = content.replace(imgidx,imgStr);
        }
    }
    if (pagewap.videojs!=null) {//视频解析
        var video =JSON.parse(pagewap.videojs);
        for (var x = 0; x < video.length; x++) {
            var idx = parseInt(video[x].idx);
            var videoidx = "" + idx;
            var idxtmp = "";
            for (var y = 1; y <= 4 - videoidx.length; y++) {
                idxtmp += "0";
            }
            videoidx = idxtmp + videoidx;
            videoidx = "$#videoidx=" + videoidx + "#$";
            var videoStr = "<p><video ";
            videoStr +=' src="'+video[x].src+'"';
//					videoStr += ' alt="'+video[x].alt+'"';
//					videoStr += ' describe="'+video[x].describe+'"';
//					videoStr += ' width="'+video[x].width+'"';
//					videoStr += ' height="'+video[x].height+'"';
            videoStr += ' controls="controls"'
            videoStr +="></video></p>";
            content = content.replace(videoidx,videoStr);
        }

    }

    if (pagewap.imgjs!=null&&pagewap.imgs==null) {
        let imgjs=eval("("+pagewap.imgjs+")");
        for (var x = 0; x < imgjs.length; x++) {
            var idx = parseInt(imgjs[x].idx);
            var imgidx = "" + idx;
            var idxtmp = "";
            for (var y = 1; y <= 4 - imgidx.length; y++) {
                idxtmp += "0";
            }
            imgidx = idxtmp + imgidx;
            imgidx = "$#imgidx=" + imgidx + "#$";
//					content = content.replace(imgidx, "<img src='"
//							+ pagewap.imgs[x].src + "' width='100%'>");
                var imgStr = "<img ";
                imgStr +='src="'+imgjs[x].src+'"';
                imgStr += 'alt="'+imgjs[x].alt+'"';
                imgStr += 'describe="'+imgjs[x].describe+'"';
                imgStr += 'width="'+imgjs[x].imgwidth+'"';
                imgStr += 'height="'+imgjs[x].imgheight+'"';
                imgStr += 'imgmd5="'+imgjs[x].imgmd5+'"';
                imgStr +="/>";
                content = content.replace(imgidx,imgStr);
        }
    }
    var contentpage = content.split("@$paging$@");
    if (contentpage.length > 0) {
        var p = 0;
        for (var i = 0; i < contentpage.length; i++) {
            if (contentpage[i].indexOf("@$paging$@") != -1) {
                continue;
            }
            // content = content.replace('@$paging$@','<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>');
            content = content.replace('@$paging$@','<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>');
        }
    }
    var contenttext = content.split("!@#!@");
    if (contenttext.length > 0) {
        var j = 0;
        for (var i = 0; i < contenttext.length; i++) {
            if (contenttext[i].length != 0) {
                if (contenttext[i].indexOf("$#imgidx=") != -1) {
                    continue;
                }
                html = html + contenttext[i] + "<br><br>";
            }
        }
    }
    return html
}

// 图集审核内容解析
export function imgContentToHtml(entity) {
    if(entity == undefined){
        return;
    }
    var imgArr = entity.imgs;
    //拿出其他索引
    var content = entity.content;
    if (imgArr.length > 0&&content!=null) {
        var contenttext = content.split("!@#!@");
        var j = 0;
        for (var i = 0; i < imgArr.length; i++) {
            if (contenttext[i].length != 0) {
                if (isNull(contenttext[i])) {
                    imgArr[i].des_img=contenttext[i]
                }
            }
        }
    }
}

//把字符str中的f替换成e
export function myReplace(str, f, e) {
    return str.replace(new RegExp(f, "gm"), e);
}
