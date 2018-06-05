<template lang="html">
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import jsonp from 'jsonp'
import {
    debounce,
    parseTime
} from '@/utils'
import {
    getPendingData
} from '@/api/chartData';

export default {
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '225px'
        }
    },
    data() {
        return {
            chart: null,
            winHeight: '',
            winWidth: '',
            collectionStyle: {
                height: '260px',
                boxSizing: 'border-box',
                overflow: 'auto',
                padding: '10px'
            },
            listLoading: false,
            collNews: '',
            collPicture: '',
            collVideo: '',
            startDate: parseTime(new Date(), '{y}{m}{d}')
        }
    },
    mounted() {
        this.queryCollectionData('news');
        this.__resizeHanlder = debounce(() => {
            if (this.chart) {
                this.chart.resize()
            }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        window.removeEventListener('resize', this.__resizeHanlder)
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        queryCollectionData(type){
          let that = this;
            // 参数字符串
            that.listLoading = true;
            let queryParam = '&startDate=' + that.startDate + '&type='+type+ '&callback';
            // jsonp回调函数
            window.collection = function(data) {
                  if (data.code === 200) {
                    if(type=='news'){
                        if(data.datalist.length>0){
                            that.collNews=data.datalist[0];
                        }else{
                            that.collNews= {
                                createhtmlcnt:0,
                                downloadcnt:0,
                                dt:0,
                                pushhtmlcnt:0
                            }
                        }
                        that.queryCollectionData('picture');
                    }else if(type=='picture'){
                        if(data.datalist.length>0){
                            that.collPicture=data.datalist[0];
                        }else{
                            that.collPicture= {
                                createhtmlcnt:0,
                                downloadcnt:0,
                                dt:0,
                                pushhtmlcnt:0
                            }
                        }
                        that.collPicture=data.datalist[0];
                        that.queryCollectionData('video');
                    }else if(type=='video'){
                        if(data.datalist.length>0){
                            that.collPicture=data.datalist[0];
                        }else{
                            that.collPicture= {
                                createhtmlcnt:0,
                                downloadcnt:0,
                                dt:0,
                                pushhtmlcnt:0
                            }
                        }
                        that.collVideo=data.datalist[0];
                        that.getCollectionData();
                    }
                  } else {
                    console.log('fail')
                  }
            }

            jsonp('http://tongji.021.com/datacenterapi/crawlermonitorgatherdata/crawlermonitorgather?callbackparam=collection', {'param': queryParam, 'name': 'callback'}, function (err, data) {

            });
        },
        getCollectionData () {
            let _that = this;
            _that.chart = echarts.init(_that.$el, 'macarons')
            _that.chart.setOption({
                tooltip : {
                    trigger: 'axis',
                },
                legend: {
                    data:['总采集量','生成页面的量','已进入列表的量']
                },
                barWidth:30,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['新闻','视频','图集']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                color:['#01b8c0','#8ed5e7',  '#fea928', '#eeff9f','#6e7074', '#546570', '#c4ccd3'],
                series : [
                    {
                        name:'总采集量',
                        type:'bar',
                        stack: '新闻',
                        data:[_that.collNews.downloadcnt, _that.collVideo.downloadcnt, _that.collPicture.downloadcnt]
                    },
                    {
                        name:'生成页面的量',
                        type:'bar',
                        stack: '新闻',
                        data:[_that.collNews.createhtmlcnt, _that.collVideo.createhtmlcnt,  _that.collPicture.createhtmlcnt]
                    },
                    {
                        name:'已进入列表的量',
                        type:'bar',
                        stack: '新闻',
                        data:[_that.collNews.pushhtmlcnt,_that.collVideo.pushhtmlcnt, _that.collPicture.pushhtmlcnt]
                    },

            ],
            });
        }
    }
}
</script>

<style lang="css">
</style>
