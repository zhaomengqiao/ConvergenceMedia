<template>
    <div>
        <el-form :inline="true" :model="form">
            <el-button type="primary">全部</el-button>
            <el-button  @click="">篩選</el-button>
            <el-form-item label="時間：">
                <el-date-picker
                    v-model="dateRange"
                    @change="dateRangeChange"
                    type="daterange"
                    align="right"
                    placeholder="選擇日期範圍"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="軟件名稱：">香港頭條</el-form-item>
            <el-form-item label="系統：">
                <el-select v-model="systemName" class="select-platform"
                           filterable placeholder="匯總" @change="">
                    <el-option
                        label="匯總"
                        value="a"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="版本：">
                <el-select v-model="versionName" class="select-platform"
                           filterable placeholder="匯總" @change="">
                    <el-option
                        label="匯總"
                        value=""
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="按鈕id：">
                <el-select v-model="buttonId" class="select-platform"
                           filterable placeholder="匯總" @change="">
                    <el-option
                        label="匯總"
                        value=""
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="按鈕名稱：">
                <el-select v-model="buttonName" class="select-platform"
                           filterable placeholder="匯總" @change="">
                    <el-option
                        label="匯總"
                        value=""
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-button type="primary">全部</el-button>
        <el-button  @click="">已註冊</el-button>
        <el-button  @click="">未註冊</el-button>
        <el-row>
            <el-col :span="24">
                <div id="chartContainer" style=""></div>
            </el-col>
        </el-row>
        <el-table :data="tableData" class="table-total-count" highlight-current-row tooltip-effect="dark" stripe border align="center" v-loading="listLoading" :default-sort = "{prop: 'dt', order: 'descending'}" style="width: 100%;" max-height="300">
            <el-table-column
                prop="dt"
                label="日期"
                width="100"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="apptype"
                label="軟件名稱"
                width="100"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="version"
                label="版本"
                width="100"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="system_name"
                label="系統"
                width="100"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="buttonid"
                label="按鈕id"
                width="100"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="button_name"
                label="按鈕名稱"
                width="100"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column label="全部" align="center">
                <el-table-column
                    prop="all_click"
                    label="click"
                    width="100"
                    align="center"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="all_uv"
                    label="UV"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    prop="all_uv_percent"
                    label="UV占日活"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    prop="all_click_uv"
                    label="click/UV"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
            </el-table-column>
            <el-table-column label="未註冊" align="center">
                <el-table-column
                    prop="no_click"
                    label="click"
                    width="100"
                    align="center"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="no_uv"
                    label="UV"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    prop="no_uv_percent"
                    label="UV占日活"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    prop="no_click_uv"
                    label="click/UV"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
            </el-table-column>
            <el-table-column label="已註冊" align="center">
                <el-table-column
                    prop="yes_click"
                    label="click"
                    width="100"
                    align="center"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="yes_uv"
                    label="UV"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    prop="yes_uv_percent"
                    label="UV占日活"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    prop="yes_click_uv"
                    label="click/UV"
                    width="100"
                    align="center"
                    sortable
                >
                </el-table-column>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="total,sizes, prev, pager, next,jumper"
                :page-sizes=[10,15,20,50,100]
                :current-page="form.page"
                :page-size="form.pagesize"
                :total="total"
                style="float:right;"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import jsonp from 'jsonp';

    export default {
        data() {
            return {
                systemName: '',
                versionName: '',
                buttonId: '',
                buttonName: '',
                chart: null,
                series: [{}, {}, {}, {}],
                seriesName: ["click", "UV", "UV占日活", "click/UV"],
                labelWidth:"120px",
                listLoading:false,
                dateRange:'',
                total:0,
                form:{
                    stime:'',
                    etime:'',
                    page:1,
                    pagesize:100
                },
                tableData:[],
                chartData:{
                    click: [],
                    uv: [],
                    uv_percent: [],
                    click_uv: [],
                    buttonid: []
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近壹周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近壹個月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三個月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            };
        },
        methods: {
            drawGraph(id) {
                // 绘图方法
                if(this.chart) {
                    this.chart.clear();
                    this.chart.dispose();
                }
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                let chartArr = [];
                let chartSeries = [];
                for(let key in this.chartData) {
                    if (this.chartData.hasOwnProperty(key)) {
                        chartArr.push(key);
                    }
                }
                chartSeries = this.series.map(function(item, index) {
                    return {
                        name: that.seriesName[index],
                        type: 'bar',
                        barWidth: '60%',
                        data: that.chartData[chartArr[index]]
                    }
                })
                // console.log(chartArr);
                // console.log(chartSeries);
                let option = {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        center: 'center',
                        data: this.seriesName,
                        selectedMode: 'single'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : this.chartData.buttonid,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : chartSeries
                };

                this.chart.setOption(option);
                this.chart.hideLoading();

                // 表格resize
                setTimeout(function() {
                    that.chart.resize();
                }, 0)
            },
            formatterTime: function(row, column) {
                return parseInt(row.timeavg / 60) + '分' + row.timeavg % 60 + '秒'
            },
            formatterTimeonline: function(row, column) {
                return parseInt(row.onlineavg / 60) + '分' + row.onlineavg % 60 + '秒'
            },
            toSecond: function(data) {
                let time = data.split('分').map(function(item) {
                    return parseInt(item);
                });
                let timeSecond = 0;
                if(time.length > 1) {
                    timeSecond = time[0]*60 + time[1];
                } else {
                    timeSecond = time[0];
                }
                return timeSecond;
            },
            dateRangeChange:function(val){
                var dateArr=val.split(' - ');
                this.form.stime=dateArr[0].split('-').join('');
                this.form.etime=dateArr[1].split('-').join('');
                // this.search();
            },
            handleCurrentChange(val) {
                this.form.page=val;
                this.search();
                // this.queryCreateList();
            },
            handleSizeChange(val){
                this.form.pagesize=val;
                // this.queryCreateList();
                this.search();
            },
            search:function(){
                this.queryCreateList()
            },
            init() {
                this.search();
            },
            queryCreateList() {
                let that = this;

                // 参数字符串
                let queryParam = 'pagesize=' + this.form.pagesize + '&page=' + this.form.page + '&startDate=' + this.form.stime + '&endDate=' + this.form.etime +'&callback';

                // jsonp回调函数
                window.jsonpdata = function(data) {
                    if (data.code === 200) {
                        data.datalist.forEach(function(item, index) {
                            // item.apptype = parseInt(item.apptype);
                            // item.uv = parseInt(item.uv);
                            // item.pv = parseInt(item.pv);
                            // item.timeavg = that.toSecond(item.timeavg);
                            // item.onlineavg = that.toSecond(item.onlineavg);
                        })
                        that.tableData = data.datalist;
                        that.total = data.pagecount
                        that.listLoading = false;

                        // echart所需数据清空
                        for(let key in that.chartData) {
                            if (that.chartData.hasOwnProperty(key)) {
                                that.chartData[key] = [];
                            }
                        }
                        // echart所需数据格式转换
                        data.datalist.reverse().forEach(function(item, index) {
                            for(let key in that.chartData) {
                                if (that.chartData.hasOwnProperty(key)) {
                                    that.chartData[key].push(item[key]);
                                }
                            }
                        });

                        // 回调成功绘图
                        that.drawGraph('chartContainer')
                    } else {
                        console.log('fail')
                    }
                }
                this.listLoading = true;

                jsonp('http://tongji.021.com/datacenterapi/appbasedata/appdata?callbackparam=jsonpdata', {'param': queryParam, 'name': 'callback'}, function (err, data) {

                });
            }
        },
        mounted() {
            this.init();
        },
        activated() {
            this.search();
        }
    };
</script>
<style scoped>
    /*.block{
        margin-top: 20px;
    }*/
    .disabled{
        cursor:text;
        color:#bfcbd9;
    }
    a{
        color:#666;
        cursor:pointer;
        text-decoration:none;
    }
    a.disabled:hover{
        color:#bfcbd9;
    }
    a:hover{
        color:#0000ee;
    }
    #chartContainer {
        width: 100%;
        height: 400px;
    }
</style>
