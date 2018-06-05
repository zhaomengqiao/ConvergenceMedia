<template lang="html">
    <div :class="className" :id="id" :style="{height:height}"></div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/theme/macarons');
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/dataZoom');
import { getTopNum } from '@/api/chartData'
import {
    debounce,
    getPlatformByUrl,
    parseTime
} from '@/utils'
export default {
    data(){
        return {
            className: 'echart',
            id: 'topCount',
            height: '240px',
            chartData: [

            ],
            livetonews: [],
            livetovideo: [],
            news: [],
            newstovideo: [],
            video: [],
            videotonews: [],
            series: [],
            platform: 'DFTT'
        }
    },
    created(){
        var url = window.location.href
        this.platform = getPlatformByUrl(url).top;
    },
    mounted(){
        var _this = this;
        _this.getTopNumChart();
        this.__resizeHanlder = debounce(() => {
            if (this.chart) {
                this.chart.resize()
            }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
    },
    methods: {
        getTopNumChart(){
            this.$emit("topCountLoad", true)
            var param = {
                platform: this.platform
            }
            getTopNum(param).then(res => {
                if(res.code == "00001"){
                    this.livetonews = []
                    this.livetovideo = []
                    this.news = []
                    this.videotonews = []
                    this.video = []
                    for(var i in res.data.livetonews){
                        this.livetonews.push(res.data.livetonews[i])
                    }

                    for(var i in res.data.livetovideo){
                        this.livetovideo.push(res.data.livetovideo[i])
                    }

                    for(var i in res.data.news){
                        this.news.push(res.data.news[i])
                    }

                    for(var i in res.data.videotonews){
                        this.videotonews.push(res.data.videotonews[i])
                    }

                    for(var i in res.data.video){
                        this.video.push(res.data.video[i])
                    }
                    this.series.push({
                        name: '新闻置顶',
                        type: 'line',
                        data: this.news
                    },{
                        name: '视频置顶到新闻',
                        type: 'line',
                        data: this.videotonews
                    },{
                        name: '视频置顶到视频',
                        type: 'line',
                        data: this.video
                    },{
                        name: '直播置顶到新闻',
                        type: 'line',
                        data: this.livetonews
                    },{
                        name: '直播置顶到视频',
                        type: 'line',
                        data: this.livetovideo
                    })
                    this.setOptions()
                }
                this.$emit("topCountLoad", false)
            })
        },
        setOptions(){
            var _this = this;
            this.chart = echarts.init(document.getElementById(this.id),"macarons")
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['新闻置顶','视频置顶到新闻','视频置顶到视频','直播置顶到新闻','直播置顶到视频']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        color: "#333"
                    },
                    data: ['00:00','04:00','08:00','12:00','16:00','20:00','24:00']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: "#333"
                    }
                },
                series: this.series
            })
        }
    }
}
</script>

<style lang="scss">
</style>
