<template lang="html">
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import {
    getPlatformByUrl,
    debounce
} from '@/utils'
import {
    getProduceData
} from '@/api/chartData'

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
        },
        articleType: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            chart: null,
            produceStyle: {
                height:'260px',
                boxSizing:'border-box',
                overflow:'auto',
                padding: '10px'
            },
            prodBoxD:0,
            prodBoxX:0,
            produce:'',
            radius:'50%',
            prodSpace:'',
            listLoading:false,
            platform: 'toutiao'
        }
    },
    created() {
        var url = window.location.href
        this.platform = getPlatformByUrl(url).add;
    },
    mounted() {
        this.setPendingDiv();
        this.queryProduceData();
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
                _that.prodSpace='           ';
            }else{
                _that.radius = '60%';
                _that.prodSpace='                              ';
            }
        },
        queryProduceData(){
            this.listLoading=true;
            let para = {day:1,articleType: this.articleType,platform: this.platform}
            getProduceData(para).then((res)=>{
                this.produce=res.data;
                this.prodBoxD=this.produce.dfh.news+this.produce.dfh.video+this.produce.dfh.picture;
                this.prodBoxX=this.produce.wemedia.news+this.produce.wemedia.video+this.produce.wemedia.picture;
                this.getProduceData();
                this.listLoading=false;
            });
        },
        getProduceData () {
            let  _that = this;
            _that.chart = echarts.init(_that.$el, 'macarons')
           _that.chart.setOption({
                title : {
                    text: '融媒体('+ _that.prodBoxX+')'+_that.prodSpace+'东方号('+ _that.prodBoxD+')',
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
                            {value:_that.produce.wemedia.news, name:'新闻'},
                            {value:_that.produce.wemedia.video, name:'视频'},
                            {value:_that.produce.wemedia.picture, name:'图集'},
                        ],
                        itemStyle: {
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
                            {value:_that.produce.dfh.news, name:'新闻'},
                            {value:_that.produce.dfh.video, name:'视频'},
                            {value:_that.produce.dfh.picture, name:'图集'},
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
            });
        }
    },
    watch: {
        "articleType": function(){
            this.queryProduceData();
        }
    }
}
</script>

<style lang="css">
</style>
