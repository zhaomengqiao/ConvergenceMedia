/**
 * ueditor完整配置项
 * 可以在这里配置整个编辑器的特性
 */
/** ************************提示********************************
 * 所有被注释的配置项均为UEditor默认值。
 * 修改默认配置请首先确保已经完全明确该参数的真实用途。
 * 主要有两种修改方案，一种是取消此处注释，然后修改成对应参数；另一种是在实例化编辑器时传入对应参数。
 * 当升级编辑器时，可直接使用旧版配置文件替换新版配置文件,不用担心旧版配置文件中因缺少新功能所需的参数而导致脚本报错。
 **************************提示********************************/

(function () {
    /**
     * 编辑器资源文件根路径。它所表示的含义是：以编辑器实例化页面为当前路径，指向编辑器资源文件（即dialog等文件夹）的路径。
     * 鉴于很多同学在使用编辑器的时候出现的种种路径问题，此处强烈建议大家使用"相对于网站根目录的相对路径"进行配置。
     * "相对于网站根目录的相对路径"也就是以斜杠开头的形如"/myProject/ueditor/"这样的路径。
     * 如果站点中有多个不在同一层级的页面需要实例化编辑器，且引用了同一UEditor的时候，此处的URL可能不适用于每个页面的编辑器。
     * 因此，UEditor提供了针对不同页面的编辑器可单独配置的根路径，具体来说，在需要实例化编辑器的页面最顶部写上如下代码即可。当然，需要令此处的URL等于对应的配置。
     * window.UEDITOR_HOME_URL = "/xxxx/xxxx/";
     */
  var URL = '/static/ueditor1_4_3_3/' || getUEBasePath();

    /**
     * 配置项主体。注意，此处所有涉及到路径的配置别遗漏URL变量。
     */
  window.UEDITOR_CONFIG = {

        // 为编辑器实例添加一个路径，这个不能被注释
     	 UEDITOR_HOME_URL: URL,
        // 服务器统一请求接口路径
         serverUrl: '/rongmeitiapi/api/fileUpload/img',
        toolbars: [[
          'fullscreen', 'source', '|', 'undo', 'redo','bold','pagebreak','removeformat','insertimage'
        ]],
//      toolbars: [['pagebreak',
//        'fullscreen', 'source', '|', 'undo', 'redo', '|',
//        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
//        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
//        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
//        'directionalityltr', 'directionalityrtl', 'indent', '|',
//        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
//        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
//        'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
//        'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
//        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
//        'print', 'preview', 'searchreplace', 'drafts', 'help'
//      ]],

        //语言配置项,默认是zh-cn。有需要的话也可以使用如下这样的方式来自动多语言切换，当然，前提条件是lang文件夹下存在对应的语言文件：
        //lang值也可以通过自动获取 (navigator.language||navigator.browserLanguage ||navigator.userLanguage).toLowerCase()
		lang:"zh-cn",
		langPath:URL +"lang/",
		//打开右键菜单功能
		enableContextMenu: false,
		// 是否自动长高,默认true
		autoHeightEnabled:false,
		//浮动时工具栏距离浏览器顶部的高度，用于某些具有固定头部的页面
        topOffset:0,
        //编辑器底部距离工具栏高度(如果参数大于等于编辑器高度，则设置无效)
        toolbarTopOffset:400,
        //粘贴只保留标签，去除标签所有属性
        retainOnlyLabelPasted: true,
        //阻止div标签自动转换为p标签
        allowDivTransToP:true,
        pasteplain:true,  //是否默认为纯文本粘贴。false为不使用纯文本粘贴，true为使用纯文本粘贴
        //纯文本粘贴模式下的过滤规则
	    'filterTxtRules' : function(){
	          function transP(node){
	              node.attrs['class']='';//清除class属性，此处不能使用node.attrs.class=''，在ie8下报错，因为class是关键字
	              node.attrs['style']='';//清除style属性
	              node.tagName = 'p';
	              node.setStyle();
	          }
	          return {
	              //直接删除及其字节点内容
	              '-' : 'script style object iframe embed input select ',
                  'p': {$:{}},
	              'br':{$:{}},
	              'strong':{'$':{}},
	              'img':function(node){
              		 node.attrs['id']='';//清除class属性
	                 node.attrs['class']='';//清除class属性
	                 node.attrs['style']='';//清除style属性
	                 node.setStyle();
                  },
	              'a':transP,
                  'li':{$:{}},
                  'ul':{$:{}},
                  'hr':{$:{}},
	              'caption':transP,
	              'th':transP,
	              'tr':transP,
	              'h1':transP,
	              'h2':transP,
	              'h3':transP,
	              'h4':transP,
	              'h5':transP,
	              'h6':transP,
	              'td':function(node){
	                  //没有内容的td直接删掉
	                  var txt = !!node.innerText();
	                  if(txt){
	                      node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
	                  }
	                  node.parentNode.removeChild(node,node.innerText())
	              }
	          }
	      }(),
		// xss 过滤是否开启,inserthtml等操作
		 xssFilterRules: true,
		//input xss过滤
		 inputXssFilter: true,
		//output xss过滤
		 outputXssFilter: true,
		// xss过滤白名单 名单来源: https://raw.githubusercontent.com/leizongmin/js-xss/master/lib/default.js
		 whiteList: {
 				strong: ['class', 'style'],
 				b: ['class', 'style'],
                br: [],
                hr: [],
                ul: [],
                ol: [],
                li: [],
 				img: ['src', 'alt', 'title', 'width', 'height', 'id', '_src', 'loadingclass', 'class', 'data-latex'],
			    p: ['class', 'style'],
			    video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width', 'class', 'style'],
			    a: ['target', 'href', 'title', 'class', 'style'],
      			span: ['class', 'style'],
    			sup: ['class', 'style']
//			  abbr: ['title', 'class', 'style'],
//			  address: ['class', 'style'],
//			  area: ['shape', 'coords', 'href', 'alt'],
//			  article: [],
//			  aside: [],
//			  audio: ['autoplay', 'controls', 'loop', 'preload', 'src', 'class', 'style'],
//			  bdi: ['dir'],
//			  bdo: ['dir'],
//			  big: [],
//			  blockquote: ['cite', 'class', 'style'],
//			  caption: ['class', 'style'],
//			  center: [],
//			  cite: [],
//			  code: ['class', 'style'],
//			  col: ['align', 'valign', 'span', 'width', 'class', 'style'],
//			  colgroup: ['align', 'valign', 'span', 'width', 'class', 'style'],
//			  dd: ['class', 'style'],
//			  del: ['datetime'],
//			  details: ['open'],
//			  div: ['class', 'style'],
//			  dl: ['class', 'style'],
//			  dt: ['class', 'style'],
//			  em: ['class', 'style'],
//			  font: ['color', 'size', 'face'],
//			  footer: [],
//			  h1: ['class', 'style'],
//			  h2: ['class', 'style'],
//			  h3: ['class', 'style'],
//			  h4: ['class', 'style'],
//			  h5: ['class', 'style'],
//			  h6: ['class', 'style'],
//			  header: [],
//			  hr: [],
//			  i: ['class', 'style'],
//			  ins: ['datetime'],
//			  li: ['class', 'style'],
//			  mark: [],
//			  nav: [],
//			  ol: ['class', 'style'],
//			  pre: ['class', 'style'],
//			  s: [],
//			  section: [],
//			  small: [],
//			  span: ['class', 'style'],
//			  sub: ['class', 'style'],
//			  sup: ['class', 'style'],
//			  table: ['width', 'border', 'align', 'valign', 'class', 'style'],
//			  tbody: ['align', 'valign', 'class', 'style'],
//			  td: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
//			  tfoot: ['align', 'valign', 'class', 'style'],
//			  th: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
//			  thead: ['align', 'valign', 'class', 'style'],
//			  tr: ['rowspan', 'align', 'valign', 'class', 'style'],
//			  tt: [],
//			  u: [],
//			  ul: ['class', 'style'],
			}
    };

  function getUEBasePath (docUrl, confUrl) {
      return getBasePath(docUrl || self.document.URL || self.location.href, confUrl || getConfigFilePath());
    }

  function getConfigFilePath () {
      var configPath = document.getElementsByTagName('script');

      return configPath[ configPath.length - 1 ].src;
    }

  function getBasePath (docUrl, confUrl) {
      var basePath = confUrl;

      if (/^(\/|\\\\)/.test(confUrl)) {
          basePath = /^.+?\w(\/|\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\/|\\\\)/, '');
        } else if (!/^[a-z]+:/i.test(confUrl)) {
          docUrl = docUrl.split('#')[0].split('?')[0].replace(/[^\\\/]+$/, '');

          basePath = docUrl + '' + confUrl;
        }

      return optimizationPath(basePath);
    }

  function optimizationPath (path) {
      var protocol = /^[a-z]+:\/\//.exec(path)[ 0 ],
            tmp = null,
            res = [];

      path = path.replace(protocol, '').split('?')[0].split('#')[0];

      path = path.replace(/\\/g, '/').split(/\//);

      path[ path.length - 1 ] = '';

      while (path.length) {
          if ((tmp = path.shift()) === '..') {
              res.pop();
            } else if (tmp !== '.') {
              res.push(tmp);
            }
        }

      return protocol + res.join('/');
    }

  window.UE = {
      getUEBasePath: getUEBasePath
    };
})();
