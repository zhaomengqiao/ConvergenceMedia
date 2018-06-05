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
require('echarts/map/js/china');
import jsonp from 'jsonp';
import {
    debounce,
    getPlatformByUrl,
    parseTime
} from '@/utils'
export default {
    props: [
        "mapType",
        "mapWidth"
    ],
    data(){
        return {
            className: 'echart',
            id: 'echart',
            height: '210px',
            width: '100%',
            chartData: [

            ],
            mapdate: '',
            seriesName: ["PV", "UV"],
            isreload: false,
            platform: ''
        }
    },
    created(){
        var url = window.location.href
        this.platform = getPlatformByUrl(url).cnName;
    },
    watch: {
        "mapType": function(){
            this.queryCreateList();
        }
    },
    mounted(){
        this.$nextTick(function(){
            var _this = this;
            setTimeout(function(){
                _this.queryCreateList();
            },0)
        })
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
        initBar() {
           this.setOptions();
        },
        queryCreateList(){
            var _this = this
            _this.$emit("mapDataLoad", true)
            window.mapData = function(data){
                if (data.code === 200) {
                    data.datalist.forEach((item, index) => {
                        item.pv = Number(item.pv)
                        item.uv = Number(item.uv)
                        if(item.provname == "unknown"||item.provname == "unknow"||item.provname == "中国"){
                            data.datalist.splice(index,1)
                        }
                    })
                    _this.$emit('mapTableData',data.datalist)
                    var arr = [];
                    _this.seriesName.forEach(function(item){
                        var name = item;
                        var dataArr = [];
                        data.datalist.forEach(function(i){
                            dataArr.push({name: i.provname, value: i[item.toLowerCase()]})
                        })
                        var today = new Date()
                        _this.mapdate = parseTime(today.getTime() - 1*1000*24*60*60,'{y}{m}{d}')
                        if(dataArr.length == 0){
                            if(!_this.isreload){
                                _this.isreload = true;
                                _this.mapdate = parseTime(today.getTime() - 2*1000*24*60*60,'{y}{m}{d}')
                                _this.queryCreateList();
                            }
                        }
                        arr.push({
                            name: item,
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: dataArr
                        })
                    })
                    _this.chartData = arr
                    _this.$nextTick(function(){
                        setTimeout(function(){
                            _this.initBar()
                        },0)
                    })
                } else {
                    console.log('fail')
                }
                _this.$emit("mapDataLoad", false)
            }
            let url = 'http://tongji.021.com/datacenterapi/dfttareaspreadgatherdata/dfttareaspreadgather?callbackparam=mapData'
            let queryParam = '&startDate=' + _this.mapdate + '&type=' + _this.mapType + '&terminal=' + _this.platform + '&callback';
            jsonp(url, {'param': queryParam, 'name': 'callback'}, function (err, data) {

            });
        },
        setOptions(){
            var _this = this;
            this.chart = echarts.init(document.getElementById(this.id),"macarons");
            _this.chart.setOption({
                title : {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    selectedMode: 'single',
                    selected: {
                        'PV': true,
                        'UV': false
                    },
                    data:['PV','UV']
                },
                visualMap: {
                    min: 0,
                    max: 31000000,
                    left: 'left',
                    top: 'bottom',
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable: true
                },
                series : this.chartData
            })
            var _this = this;
            window.addEventListener('resize', function(){
				_this.chart.resize
			})
        }
    }
}
</script>

<style lang="scss">
</style>
