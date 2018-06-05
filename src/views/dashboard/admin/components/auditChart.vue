<template lang="html">
    <div :class="className" :id="id" :style="{height:height}"></div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/theme/macarons');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
import jsonp from 'jsonp';
import {
    debounce,
    parseTime
} from '@/utils'
export default {
    props: [
        "auditCheck",
        "auditWidth"
    ],
    data(){
        return {
            className: 'echart',
            id: 'auditEchart',
            height: '240px',
            width: '100%',
            dongfanghaoList: [

            ],
            selfList: [

            ],
            finalData: [

            ],
            seriesName: ["PV", "UV"]
        }
    },
    watch: {
        "auditCheck": function(){
            var _this = this;
            this.queryCreateList();
        }
    },
    mounted(){
        this.queryCreateList();
        this.__resizeHanlder = debounce(() => {
            if (this.chart) {
                this.chart.resize()
            }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
    },
    methods: {
        initBar() {
            this.setOptions();
        },
        queryCreateList(){
            var _this = this
            _this.$emit("auditLoad", true)
            window.auditData = function(data){
                _this.finalData = [];
                if (data.code === 200) {
                    if(data.datalist[0]){
                        var dongfanghao = data.datalist[0];
                        _this.finalData.push({
                            name: '新闻',
                            type: 'bar',
                            data: [Number(dongfanghao.save_fail),Number(dongfanghao.reject_save),Number(dongfanghao.review_reject),Number(dongfanghao.review_fail),Number(dongfanghao.review_pass),Number(dongfanghao.totalcnt)]
                        })
                    }
                    if(data.datalist[1]){
                        var self = data.datalist[1];
                        _this.finalData.push({
                            name: '视频',
                            type: 'bar',
                            data: [Number(self.save_fail),Number(self.reject_save),Number(self.review_reject),Number(self.review_fail),Number(self.review_pass),Number(self.totalcnt)]
                        })
                    }
                    _this.initBar()
                }
                _this.$emit("auditLoad", false)
            }
            var date = new Date()
            var today = parseTime(date.getTime(),'{y}{m}{d}')
            let url = 'http://tongji.021.com/datacenterapi/checkmonitorgatherdata/checkmonitorgather?callbackparam=auditData'
            let queryParam = '&startDate=' + today + '&type=' + _this.auditCheck + '&callback';
            jsonp(url, {'param': queryParam, 'name': 'callback'}, function (err, data) {

            });
        },
        setOptions(){
            var _this = this;
            this.chart = echarts.init(document.getElementById(this.id),"macarons")
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['新闻','视频']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLabel: {
                        color: "#333"
                    }
                },
                yAxis: {
                    type: 'category',
                    axisLabel: {
                        color: "#333"
                    },
                    data: ['编辑拒绝','驳回编辑','审核驳回','审核拒绝','审核通过','需审稿件']
                },
                series: this.finalData
            })
        }
    }
}
</script>

<style lang="scss">
</style>
