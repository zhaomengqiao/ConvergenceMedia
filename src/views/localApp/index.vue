<template lang="html">
    <div v-if="isShow">
        <div id='view'>
        <div id='background'></div>
        <div id='page'>
        <div class='page' id='page_download'>
        <div class='img' id='page_download_hand'>
        <div id="J_act_users" class="act-users">
        <h3 class="act-users-title">月度活跃用户</h3>
        <p class="act-users-num">
        <span><i class="an an0">2</i></span>
        <span><i class="an an0">8</i></span>
        <span><i class="an an0">9</i></span>
        <span class="comma-wrap"><i class="comma">,</i></span>
        <span><i class="an an0">3</i></span>
        <span><i class="an an0">9</i></span>
        <span><i class="an an0">6</i></span>
        <span class="comma-wrap"><i class="comma">,</i></span>
        <span><i class="an an0">6</i></span>
        <span><i class="an an0">9</i></span>
        <span><i class="an an0">8</i></span>
        </p>
        </div>
        <div class="bar-map-wrap">
        <div class="prov-bar-wrap">
    <!--     <div class="prov-bar">
        <span class="txt"></span><span class="bar-wrap"><span class="bar"><em></em></span><i></i></span>
        </div> -->
        <!-- <p>用户城市分布（单位：万）</p> -->
        </div>
        <div class="map-wrap">
        <div id="J_map" class="map">
        <div class="dot dot1">
        <span class="dot-center"></span><em>{{cityMap.a}}</em>
        <div class="hover">{{cityMap.a}}：--</div>
        </div>
        <div class="dot dot2">
        <span class="dot-center"></span><em>{{cityMap.b}}</em>
        <div class="hover">{{cityMap.b}}：--</div>
        </div>
        <div class="dot dot3">
        <span class="dot-center"></span><em>{{cityMap.c}}</em>
        <div class="hover">{{cityMap.c}}：--</div>
        </div>
        <div class="dot dot4">
        <span class="dot-center"></span><em>{{cityMap.d}}</em>
        <div class="hover">{{cityMap.d}}：--</div>
        </div>
        <div class="dot dot5">
        <span class="dot-center"></span><em>{{cityMap.e}}</em>
        <div class="hover">{{cityMap.e}}：--</div>
        </div>
        </div>
        </div>
        </div>
        </div>
        <div id='page_download_show'>
        <div id='page_download_show_top'>
        <div id='page_download_text'>
        </div>
        </div>
        </div>
        <a href="#" id='page_download_button'>
        <div id='page_download_button_top'>
        <div id='page_download_mobile_iPhone'></div>
        <div id='page_download_mobile_android'></div>
        </div>
        </a>
        <div id="page_download_pc_button">

        </div>
        </div>
        <div class='page' id='page_function1'>
        <div id='page_function1_text'>
        <h1 id='page_function1_text_title'>多源内容产出</h1>
        <h2 id='page_function1_text_sub'>{{ appName }}是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。</h2>
        </div>
        <div id='page_function1_show'>
        <div id='page_function1_show_top'>
        <div id='page_function1_book'>
        <div id='page_function1_book_page3'></div>
        <div id='page_function1_book_page2'></div>
        <div id='page_function1_book_page1'></div>
        </div>
        <div id='page_function1_skin'>
        视频直播&nbsp;&nbsp;&nbsp;海量资讯&nbsp;&nbsp;&nbsp;精彩视频
        </div>
        <div id='page_function1_font'>
        </div>
        </div>
        </div>
        </div>
        <div class='page' id='page_function2'>
        <div id='page_function2_text'>
        <h1 id='page_function2_text_title'>多端同步发布</h1>
        <h2 id='page_function2_text_sub'>依靠先进的后端内容同步协议，实现一次编辑，多终端同步发布，在极短时间内使内容获得较之以前数倍的推荐与阅读。</h2>
        </div>
        <div id='page_function2_show'>
        <div id='page_function2_show_top'>
        <div id='page_function2_face'>
        <div id='page_function2_face_left'></div>
        <div id='page_function2_face_right'></div>
        <div id='page_function2_face_main'></div>
        <div id='page_function2_face_text'></div>
        </div>
        <div id='page_function2_book'>
        <div id='page_function2_book_07'></div>
        <div id='page_function2_book_06'></div>
        <div id='page_function2_book_05'></div>
        <div id='page_function2_book_04'></div>
        <div id='page_function2_book_03'></div>
        <div id='page_function2_book_02'></div>
        <div id='page_function2_book_01'></div>
        </div>
        </div>
        </div>
        </div>
        <div class='page' id='page_function3'>
        <div id='page_function3_text'>
        <h1 id='page_function3_text_title'>个性化内容分发</h1>
        <h2 id='page_function3_text_sub'>借助强大的推荐引擎技术，基于大数据算法5秒即可计算出新用户兴趣，完成内容智能推荐，实现用户多维度的个性化推荐。</h2>
        </div>
        <div id='page_function3_show'>
        <div id='page_function3_show_top'>
        <div id='page_function3_talk'>
        <div id='page_function3_talk_01'></div>
        <div id='page_function3_talk_02'></div>
        <div id='page_function3_talk_03'></div>
        <div id='page_function3_talk_04'></div>
        <div id='page_function3_talk_05'></div>
        <div id='page_function3_talk_06'></div>
        <div id='page_function3_book'></div>
        </div>
        </div>
        </div>
        </div>
        <div class='page' id='page_function4'>
        <div id='page_function4_text'>
        <h1 id='page_function4_text_title'>智能大数据分析</h1>
        <h2 id='page_function4_text_sub'>运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成{{ appName }}特有的大数据分析报表。</h2>
        </div>
        <div id='page_function4_table'>
        <div id='page_function4_table_top'>
        <div id='page_function4_table_background'></div>
        <div id='page_function4_table_face_01'></div>
        <div id='page_function4_table_face_02'></div>
        <div id='page_function4_table_face_03'></div>
        <div id='page_function4_table_face_04'></div>
        <div id='page_function4_table_face_05'></div>
        <div id='page_function4_table_column_01'></div>
        <div id='page_function4_table_column_02'></div>
        <div id='page_function4_table_column_03'></div>
        <div id='page_function4_table_column_04'></div>
        <div id='page_function4_table_column_05'></div>
        <div id='page_function4_table_time_01'></div>
        <div id='page_function4_table_time_02'></div>
        <div id='page_function4_table_time_03'></div>
        <div id='page_function4_table_time_04'></div>
        <div id='page_function4_table_time_05'></div>
        </div>
        </div>
        </div>
        </div>
        <div id='pageControl'>
        <div class='pageControl' id='pageControl_button1'></div>
        <div class='pageControl' id='pageControl_button2'></div>
        <div class='pageControl' id='pageControl_button3'></div>
        <div class='pageControl' id='pageControl_button4'></div>
        <div class='pageControl' id='pageControl_button5'></div>
        </div>
        </div>
        <div id='logo'></div>
        <div id='arrow_right'>
        <div id='arrow_right_height'></div>
        </div>
        <div id='arrow_left'>
        <div id='arrow_left_height'></div>
        </div>
        <div class='animateArrowDown' id='arrow_down'></div>
        <div id='nav'>
        <a href='' id='nav_iPhone'>
        </a>
        <a href='' id='nav_android'>
        </a>
        <a href='/login' id='nav_QRCode'>
        登录
        </a>
        <a href="javascript:;" id="qrcode"></a>
        </div>
        <div id='load'>
        <div class='load' id='load_function'></div>
        <div class='load' id='load_function1_page1'></div>
        <div class='load' id='load_function1_page2'></div>
        <div class='load' id='load_function2_book1'></div>
        <div class='load' id='load_function2_book2'></div>
        <div class='load' id='load_function2_book3'></div>
        <div class='load' id='load_function2_book4'></div>
        <div class='load' id='load_function2_book5'></div>
        <div class='load' id='load_function2_book6'></div>
        <div class='load' id='load_function2_book7'></div>
        <div class='load' id='load_function3_book'></div>
        <div class='load' id='load_function4_background'></div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    data(){
        return {
            isShow: false,
            cityMap:{a:'',b:'',c:'',d:'',e:''},
            appName: ''
        }
    },
    created(){
            var _this = this;
            if (screen.height > 1900)
            {
            window.location.href='touchScreen.html';
            }
            function loadjscssfile(filename,filetype){
	            if(filetype == "js"){
	            var fileref = document.createElement('script');
	            fileref.setAttribute("type","text/javascript");
	            fileref.setAttribute("src",filename);
	            }else if(filetype == "css"){
	            var fileref = document.createElement('link');
	            fileref.setAttribute("rel","stylesheet");
	            fileref.setAttribute("type","text/css");
	            fileref.setAttribute("href",filename);
	            }
	            if(typeof fileref != "undefined"){
	            document.getElementsByTagName("body")[0].appendChild(fileref);
	            }
            }
            $(document).ready(function(){
            if(window.location.href=='http://rong.jiangsutoutiao.com/'){
	            loadjscssfile("static/jstoutiao/css/index_page1.css","css");
	            loadjscssfile("static/jstoutiao/css/index.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile.css","css");
				_this.cityMap={a:'南京',b:'扬州',c:'南通',d:'无锡',e:'苏州'};
                _this.appName = "江苏头条融媒体"
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1.js","js");
	            },500)
	            $("#page_download_text").text("江苏头条融媒体");
	            $("#page_function1_text_sub")
	            .text("江苏头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成江苏头条融媒体特有的大数据分析报表。");
	        }else if(window.location.href=='http://rong.yzwb.net/'){
               window.location.href='http://rong.yzwb.net/login'; //跳转扬子头条登录页

            }else if(window.location.href=='http://rong.headlinehk.com/'){
               window.location.href='http://rong.headlinehk.com/login'; //跳转香港头条登录页

            }else if(window.location.href=='http://rong.hinews.cn/'){
               window.location.href='http://rong.hinews.cn/login'; //跳转海南头条登录页

            }else if(window.location.href=='http://rong.gscn.com.cn/'){
	            loadjscssfile("static/jstoutiao/css/index_gs.css","css");
	            loadjscssfile("static/jstoutiao/css/index_page1_gs.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile_gs.css","css");
				_this.cityMap={a:'兰州',b:'武威',c:'白银',d:'天水',e:'张掖'};
                _this.appName = "甘肃头条融媒体"
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1_gs.js","js");
	            },500)
	            $("#page_download_text").text("甘肃头条融媒体");
	            $("#page_function1_text_sub")
	            .text("甘肃头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成甘肃头条融媒体特有的大数据分析报表。");
	        }else if(window.location.href=='http://172.18.5.108:8081/'){
                loadjscssfile("static/jstoutiao/css/index_page1.css","css");
	            loadjscssfile("static/jstoutiao/css/index.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile.css","css");
				_this.cityMap={a:'南京',b:'扬州',c:'南通',d:'无锡',e:'苏州'};
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1.js","js");
	            },500)
	            $("#page_download_text").text("江苏头条融媒体");
	            $("#page_function1_text_sub")
	            .text("江苏头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成江苏头条融媒体特有的大数据分析报表。");
        	}else if(window.location.href=='http://172.20.7.44:8081/'){
                loadjscssfile("static/jstoutiao/css/index_page1_hn.css","css");
                loadjscssfile("static/jstoutiao/css/index_hn.css","css");
                loadjscssfile("static/jstoutiao/css/index-mobile_hn.css","css");
                _this.cityMap={a:'海口',b:'三亚',c:'琼海',d:'儋州',e:'五指山'};
                _this.appName = "海南头条融媒体"
                setTimeout(function(){
                    _this.isShow = true;
                    loadjscssfile("static/jstoutiao/js/index_hn.js","js");
                    loadjscssfile("static/jstoutiao/js/index_page1_hn.js","js");
                },500)
                $("#page_download_text").text("海南头条融媒体");
                $("#page_function1_text_sub")
                .text("海南头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
                $("#page_function4_text_sub")
                .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成江苏头条融媒体特有的大数据分析报表。");
            }else if(window.location.href=='http://rong.gog.cn/'){
	            loadjscssfile("static/jstoutiao/css/index_gz.css","css");
	            loadjscssfile("static/jstoutiao/css/index_page1_gz.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile_gz.css","css");
				_this.cityMap={a:'贵阳',b:'遵义',c:'黔东南州',d:'铜仁地区',e:'六盘水'};
                _this.appName = "贵州头条融媒体"
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1_gz.js","js");
	            },500)
	            $("#page_download_text").text("贵州头条融媒体");
	            $("#page_function1_text_sub")
	            .text("贵州头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成贵州头条融媒体特有的大数据分析报表。");
	        }else if(window.location.href=='http://rong.dbw.cn/'){
	            loadjscssfile("static/jstoutiao/css/index_hlj.css","css");
	            loadjscssfile("static/jstoutiao/css/index_page1_hlj.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile_hlj.css","css");
				_this.cityMap={a:'双鸭山',b:'齐齐哈尔',c:'哈尔滨',d:'牡丹江',e:'大庆'};
                _this.appName = "东北头条融媒体"
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1_hlj.js","js");
	            },500)
	            $("#page_download_text").text("东北头条融媒体");
	            $("#page_function1_text_sub")
	            .text("东北头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成东北头条融媒体特有的大数据分析报表。");
	        }else if(window.location.href=='http://rong.ncnews.com.cn/'){
	            loadjscssfile("static/jstoutiao/css/index_jx.css","css");
	            loadjscssfile("static/jstoutiao/css/index_page1_jx.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile_jx.css","css");
				_this.cityMap={a:'南昌',b:'赣州',c:'上饶',d:'抚州',e:'九江'};
                _this.appName = "南昌头条融媒体"
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1_jx.js","js");
	            },500)
	            $("#page_download_text").text("南昌头条融媒体");
	            $("#page_function1_text_sub")
	            .text("南昌头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成南昌头条融媒体特有的大数据分析报表。");
	        }else if(window.location.href=='http://rong.yunnan.cn/'){
	            loadjscssfile("static/jstoutiao/css/index_yn.css","css");
	            loadjscssfile("static/jstoutiao/css/index_page1_yn.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile_yn.css","css");
				_this.cityMap={a:'昆明',b:'曲靖',c:'昭通',d:'文山州',e:'楚雄州'};
                _this.appName = "云南头条融媒体"
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1_yn.js","js");
	            },500)
	            $("#page_download_text").text("云南头条融媒体");
	            $("#page_function1_text_sub")
	            .text("云南头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成云南头条融媒体特有的大数据分析报表。");
	            }else if(window.location.href=='http://rong.hebei.com.cn/'){
	            loadjscssfile("static/jstoutiao/css/index_hb.css","css");
	            loadjscssfile("static/jstoutiao/css/index_page1_hb.css","css");
	            loadjscssfile("static/jstoutiao/css/index-mobile_hb.css","css");
				_this.cityMap={a:'石家庄',b:'廊坊',c:'保定',d:'邯郸',e:'邢台'};
                _this.appName = "河北头条融媒体"
	            setTimeout(function(){
	                _this.isShow = true;
	                loadjscssfile("static/jstoutiao/js/index.js","js");
	                loadjscssfile("static/jstoutiao/js/index_page1_hb.js","js");
	            },500)
	            $("#page_download_text").text("河北头条融媒体");
	            $("#page_function1_text_sub")
	            .text("河北头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
	            $("#page_function4_text_sub")
	            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成河北头条融媒体特有的大数据分析报表。");
	            }else if(window.location.href=='http://rong.xkb.com.cn/'){
		            loadjscssfile("static/jstoutiao/css/index_gd.css","css");
		            loadjscssfile("static/jstoutiao/css/index_page1_gd.css","css");
		            loadjscssfile("static/jstoutiao/css/index-mobile_gd.css","css");
					_this.cityMap={a:'广州',b:'深圳',c:'东莞',d:'佛山',e:'惠州'};
                    _this.appName = "广东头条融媒体"
		            setTimeout(function(){
		                _this.isShow = true;
		                loadjscssfile("static/jstoutiao/js/index.js","js");
		                loadjscssfile("static/jstoutiao/js/index_page1_gd.js","js");
		            },500)
		            $("#page_download_text").text("广东头条融媒体");
		            $("#page_function1_text_sub")
		            .text("广东头条融媒体是一款基于海量大数据统计及汇集地方性新闻内容的融媒体平台，内容产出多元化，不断挖掘适合您的资讯传播形式。");
		            $("#page_function4_text_sub")
		            .text("运用大数据技术实时对用户阅读数据汇总分析，并对信息进行机器分类、摘要抽取，信息质量识别等处理，形成广东头条融媒体特有的大数据分析报表。");
		            }
            })
    },
}
</script>

<style lang="css">
</style>
