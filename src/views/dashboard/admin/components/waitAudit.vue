<template lang="html">
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
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
            listLoading:false,
            pendingStyle: {
                height:'260px',
                boxSizing:'border-box',
                overflow:'auto',
                padding: '10px'
            },
            pendBoxD:0,
            pendBoxX:0,
            pending:'',
            pendingSpace:'',
            radius:'50%'
        }
    },
    mounted() {
        this.queryPendingData();
        this.setPendingDiv();
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
        setPendingDiv(){
            var _that = this;
            if(1920>window.innerWidth){
                _that.radius = '45%';
                _that.pendingSpace='           ';
            }else{
                _that.radius = '60%';
                _that.pendingSpace='                                 ';
            }
        },
        initChart() {
            var _that = this;
            this.chart = echarts.init(this.$el, 'macarons')
            this.chart.setOption({
                 title : {
                     text: '新媒体('+ _that.pendBoxX+')'+_that.pendingSpace+'东方号('+ _that.pendBoxD+')',
                     subtext: '',
                     textStyle:{
                         fontStyle:'16px'
                     },
                     x:'center'
                 },
                 tooltip : {
                     trigger: 'item',
                     formatter: "{a} <br/>{b} : {c} ({d}%)"
                 },
                 legend: {
                     data:['新闻','视频','图集',],
                     bottom:"0px",
                     align: "auto"
                 },
                 color:['#01b8c0','#8ed5e7',  '#fea928', '#eeff9f','#6e7074', '#546570', '#c4ccd3'],
                 series : [
                     {
                         name: '新媒体',
                         type: 'pie',
                         radius : _that.radius,
                         center: ['25%', '50%'],
                         label: {
                             normal: {
                                 show: true,
                                 formatter: "{b} : {c}"
                             },
                         },
                         labelLine: {
                             normal:{
                                 length:8,
                                 length2:5
                             }
                         },
                         data:[
                             {value:_that.pending.weaudit.weauditnew, name:'新闻'},
                             {value:_that.pending.weaudit.weauditvideo, name:'视频'},
                             {value:_that.pending.weaudit.weauditpic, name:'图集'},
                         ],
                         itemStyle: {
                             normal: {
                                 show: true,
                             },
                             emphasis: {
                                 shadowBlur: 10,
                                 shadowOffsetX: 0,
                                 shadowColor: 'rgba(0, 0, 0, 0.5)'
                             }
                         }
                     },
                     {
                         name: '东方号',
                         type: 'pie',
                         radius : _that.radius,
                         center: ['70%', '50%'],
                         label: {
                             normal: {
                                 show: true,
                                 formatter: "{b} : {c}"
                             },
                         },
                         labelLine: {
                             normal:{
                                 length:8,
                                 length2:5
                             }
                         },
                         data:[
                             {value:_that.pending.dfhaudit.dfhauditnew, name:'新闻'},
                             {value:_that.pending.dfhaudit.dfhauditvideo, name:'视频'},
                             {value:_that.pending.dfhaudit.dfhauditpic, name:'图集'},
                         ],
                         itemStyle: {
                             emphasis: {
                                 shadowBlur: 10,
                                 shadowOffsetX: 0,
                                 shadowColor: 'rgba(0, 0, 0, 0.5)'
                             }
                         }
                     }
                 ]
             })
        },
        queryPendingData() {
            getPendingData().then((res) => {
                if(res.code === '00001'){
                    this.pending = res.data;
                    this.pendBoxX = this.pending.weaudit.weauditnew + this.pending.weaudit.weauditpic + this.pending.weaudit.weauditvideo;
                    this.pendBoxD = this.pending.dfhaudit.dfhauditnew + this.pending.dfhaudit.dfhauditvideo + this.pending.dfhaudit.dfhauditpic;
                    this.initChart()
                }
            });
        }
    }
}
</script>

<style lang="css">
</style>
