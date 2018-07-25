!(function(){
    var page1 = function(dc){
        var $usersNumSpan = $('.act-users-num').children('span');
        var $last = $('.act-users-num').children('span:not(.comma-wrap)'),
            isFirstRequest=true,
            MonthActiveUserNum,
            MonthActiveUserNumRandom,
            url='../rongmeitiapi/api/convergencemediadata/provinemediadata';
            // url='http://rong.jiangsutoutiao.com/rongmeitiapi/api/convergencemediadata/provinemediadata';
        var $J_map=$('#J_map'),
            $dot=$J_map.children('.dot')
        var p1 = {
            init: function(){
                $('#J_map').find('.dot').hover(function(){
                    $(this).children('.hover').show();
                }, function(){
                    $(this).children('.hover').hide();
                });
                this.getDistrictData();//获取市级行政区月活跃量数据
            },
            /**
             * 开始随机变化
             */
            startRandom: function(){
                var _this = this;
                setInterval(function(){
                    MonthActiveUserNumRandom=MonthActiveUserNum+Math.floor(Math.random()*200+1);
                    _this.setRandomNum();
                },1000 * 30)
            },
            /**
             * 将随机数设置到月度活跃用户中
             */
            setRandomNum: function() {
                var numStrArr=(MonthActiveUserNumRandom+'').split(''),
                    enArr = this.numToEn(numStrArr),
                    usersNumLen=numStrArr.length,
                    numIconLen=$last.length,
                    diff=numIconLen-usersNumLen;
                if(diff !== 0){
                    for(var i=0;i<diff;i++){
                        $last.eq(i).hide();
                    }
                }
                for(var i=numIconLen;i>-1;i--){
                    var showNum=i-diff;
                    if(showNum < 0){
                        break;
                    }
                    $last.eq(i).find('i').attr('class', '').addClass('an ' + enArr[showNum]).text(numStrArr[showNum]);
                }
            },

            /**
             * 数字转英文
             */
            numToEn: function(arr) {
                var enArr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
                var newArr = [];
                $.each(arr, function(i, v) {
                    newArr.push(enArr[v]);
                });
                return newArr;
            },

            /**
             * 获取n位数随机数
             * @param  {Number} n
             */
            getRandomNumStr: function(n){
                var ranstr = '';
                for (var i = 0; i < n; i++) {
                    ranstr += Math.floor(Math.random() * 10);
                }
                return ranstr.split('');
            },
            getUsefullDate:function(){
                var date=new Date();
                date.setDate(date.getDate()-1);
                var year=date.getFullYear(),
                month=date.getMonth()+1,
                day=date.getDate(),
                monthStr=month>9 ? month+'':'0'+month,
                dayStr=day>9 ? day+'':'0'+day;
                return year+monthStr+dayStr;
            },
            getDistrictData:function(){
                var scope=this;
                $.ajax({
                    url:url,
                    data:{
                        varprov:'河北',
                        // vardt:'20170813'
                        vardt:scope.getUsefullDate() //前一天
                    },
                    type:'post',
                    success:function(data){
                            if(data.code === '200'){
                            var arr=data.data.data,
                                cityBarIndex=0,//左侧地方月活跃量的索引
                                skipNum=0;//去掉脏数据的次数
                            MonthActiveUserNum=data.data.totaluv;
                            MonthActiveUserNumRandom=MonthActiveUserNum;
                            // if(!isFirstRequest){
                            //     scope.setRandomNum();
                            //     return;
                            // }else{
                            //     isFirstRequest=false;
                            // }
                            scope.setRandomNum();
                            scope.startRandom();
                            arr.sort(function(a,b){
                                return b.uv-a.uv;
                            });


                            for(var i=0,len=arr.length;i<len;i++){
                                if(arr[i].cityname === '河北'){
                                    skipNum=skipNum+1;
                                    continue;
                                }
                                cityBarIndex=i-skipNum;
                                var uvStr=Number(arr[i].uv).toLocaleString(),
                                    uvWan=parseInt(arr[i].uv/10000),
                                    widthPer=arr[i].uv/arr[0].uv*66,
                                    offsetStyle='';
                                if(arr[i].cityname.length === 3){
                                    offsetStyle='threeWord';
                                }
                                else if(arr[i].cityname.length === 4){
                                    offsetStyle='fourWord';
                                }
                                else if(arr[i].cityname.length === 5){
                                    offsetStyle='fiveWord';
                                }
                                 else if(arr[i].cityname.length === 6){
                                    offsetStyle='sixWord';
                                }
                                if(i < 12){
                                    var newDom = $('<div class="prov-bar"><span class="txt"></span><span class="bar-wrap"><span class="bar"><em></em></span><i></i></span></div>')
                                    newDom.appendTo($('.prov-bar-wrap'))
                                    var $provBarList=$('.prov-bar-wrap').find('.prov-bar');
                                    $provBarList.eq(cityBarIndex).children(".txt").addClass(offsetStyle).text(arr[i].cityname).siblings(".bar-wrap").children('.bar').css('width',widthPer+'%').next().text(uvWan);
                                }
                                if(arr[i].cityname === '石家庄'){
                                    $dot.eq(0).find('.hover').text(arr[i].cityname+':'+uvStr);
                                }else if(arr[i].cityname === '廊坊'){
                                    $dot.eq(1).find('.hover').text(arr[i].cityname+':'+uvStr);
                                }else if(arr[i].cityname === '保定'){
                                    $dot.eq(2).find('.hover').text(arr[i].cityname+':'+uvStr);
                                }else if(arr[i].cityname === '邯郸'){
                                    $dot.eq(3).find('.hover').text(arr[i].cityname+':'+uvStr);
                                }else if(arr[i].cityname === '邢台'){
                                    $dot.eq(4).find('.hover').text(arr[i].cityname+':'+uvStr);
                                }
                            }
                            $('<p>用户城市分布（单位：万）</p>').appendTo($('.prov-bar-wrap'))
                        }
                    }
                })
            },
        };
        return p1;
    }(document);
    page1.init();
}());
