<template>
<div>
    <el-form :inline="true" :model="form">
        <el-form-item label="时间：">
            <el-date-picker v-model="dateRange" @change="dateRangeChange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="软件名称：">扬子头条</el-form-item>
        <el-form-item label="渠道ID：" prop="qid">
            <el-select v-model="form.qid" class="select-platform" filterable placeholder="支持中文/拼音搜索" @change="optionChange">
                <el-option v-for="(item,index) in qid" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <template scope="">
            <el-button type="primary" @click="backClick">返回</el-button>
        </template>
    </el-form>
    <el-row>
        <el-col :span="24">
            <div id="chartContainer" style=""></div>
        </el-col>
    </el-row>
    <el-table :data="tableData2" class="roomList" highlight-current-row tooltip-effect="dark" stripe border align="center" v-loading="listLoading" :default-sort="{prop: 'dt', order: 'descending'}" style="width: 100%">
        <el-table-column prop="dt" label="时间" align="center" sortable>
        </el-table-column>
        <el-table-column label="软件名称" align="center" sortable>
            <template slot-scope="scope">扬子头条</template>
        </el-table-column>
        <el-table-column prop="qid" label="渠道名称" align="center" sortable>
        </el-table-column>
        <el-table-column prop="provname" label="省份" align="center" sortable>
        </el-table-column>
        <el-table-column prop="pv" label="pv" align="center" sortable>
        </el-table-column>
        <el-table-column prop="uv" label="uv" align="center" sortable>
        </el-table-column>
        <el-table-column prop="pu_rate" label="p/u" align="center" sortable>
        </el-table-column>
        <el-table-column prop="ip" label="IP" align="center" sortable>
        </el-table-column>
        <el-table-column :formatter="toPercent" prop="pv_rate" label="PV占比" align="center" sortable>
        </el-table-column>
        <el-table-column :formatter="toPercent" prop="uv_rate" label="UV占比" align="center" sortable>
        </el-table-column>
        <el-table-column :formatter="toPercent" prop="ip_rate" label="IP占比" align="center" sortable>
        </el-table-column>
        <el-table-column label="查看城市" align="center" sortable>
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row)" type="text" size="middle">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next,jumper" :page-sizes=[10] :total="total" style="float:right;">
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
            chart: null,
            series: [{}, {}, {}, {}, {}, {}],
            seriesName: ["PV", "UV", "P/U", "IP", "PV占比", "UV占比"],
            labelWidth: "120px",
            listLoading: false,
            dateRange: '',
            qid: [],
            total: 0,
            form: {
                stime: '',
                etime: '',
                qid: '汇总',
                city: '',
                province: '',
                apptypeid: '扬子头条'
            },
            tableData: [],
            tableData2: [],
            chartData: {
                dt: [],
                pv: [],
                uv: [],
                pu_rate: [],
                ip: [],
                pv_rate: [],
                uv_rate: []
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
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
    props: {
        city: '',
        provname: ''
    },
    methods: {
        dtClick: function(row) {
            this.$emit('dtchange', 'dtdis', row);
        },
        toPercent: function(row, column) {
            return row[column.property] + "%";
        },
        backClick: function() {
            this.$emit('backchange', 'diyu');
        },
        drawGraph(id) {
            // 绘图方法
            this.chart = echarts.init(document.getElementById(id));
            this.chart.showLoading();
            let that = this;
            let chartArr = [];
            let chartSeries = [];
            for (let key in this.chartData) {
                if (this.chartData.hasOwnProperty(key)) {
                    chartArr.push(key);
                }
            }
            chartSeries = this.series.map(function(item, index) {
                return {
                    name: that.seriesName[index],
                    type: 'line',
                    smooth: true,
                    data: that.chartData[chartArr[index + 1]]
                }
            })
            this.chart.setOption({
                title: {},
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}'
                },
                legend: {
                    left: 'center',
                    data: ['PV', 'UV', 'P/U', 'IP', 'PV占比', 'UV占比'],
                    selectedMode: 'single'
                },
                xAxis: {
                    type: 'category',
                    name: 'x',
                    splitLine: {
                        show: false
                    },
                    data: that.chartData.dt
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'log',
                    name: 'y'
                },
                series: chartSeries
            })
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
            if (time.length > 1) {
                timeSecond = time[0] * 60 + time[1];
            } else {
                timeSecond = time[0];
            }
            return timeSecond;
        },
        dateRangeChange: function(val) {
            if (val) {
                var dateArr = val.split(' - ');
                this.form.stime = dateArr[0].split('-').join('');
                this.form.etime = dateArr[1].split('-').join('');
            }
            this.queryCreateList();
        },
        optionChange: function() {
            this.queryCreateList();
        },
        handleCurrentChange(val) {
            this.tableData2 = [];
            for (var i = val * 10 - 10; i < val * 10; i++) {
                if (this.tableData[i]) {
                    this.tableData2.push(this.tableData[i]);
                }
            }
        },
        handleSizeChange(val) {
            this.form.pagesize = val;
            this.queryCreateList();
        },
        getQid: function() {
            // jsonp回调函数
            var that = this;
            window.rqid = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {
                        that.qid.push(item.qid);
                    });
                    that.qid.splice(0, 1);
                } else {
                    console.log('fail')
                }
            }
            jsonp('http://tongji.021.com/datacenterapi/appqidareaspreaddata/getqid?callbackparam=rqid', null, function(err, data) {});
        },
        init() {
            this.form.province = this.provname;
            this.form.city = this.city;
            let timeEnd = new Date();
            let timeStart = new Date();
            timeEnd.setTime(timeEnd.getTime() - 3600 * 1000 * 24 * 1);
            timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 31);
            this.form.stime = timeStart.getFullYear() + '' + (timeStart.getMonth() + 1) + '' + timeStart.getDate();
            this.form.etime = timeEnd.getFullYear() + '' + (timeEnd.getMonth() + 1) + '' + timeEnd.getDate();
            this.queryCreateList();
            this.getQid();
        },
        queryCreateList() {
            let that = this;
            console.log(this.form.province);
            // 参数字符串
            let queryParam = '&startDate=' + this.form.stime + '&endDate=' + this.form.etime + '&qid=' + this.form.qid + '&city=' + this.city + '&province=' + this.provname + '&apptypeid=' + this.form.apptypeid + '&callback';
            // jsonp回调函数
            window.csdata = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {})
                    that.tableData = data.datalist;
                    that.tableData2 = [];
                    for (var i = that.tableData.length; i >= that.tableData.length - 10; i--) {
                        if (that.tableData[i]) {
                            that.tableData2.push(that.tableData[i])
                        }
                    }
                    that.total = data.datalist.length;
                    that.listLoading = false;
                    // echart所需数据清空
                    for (let key in that.chartData) {
                        if (that.chartData.hasOwnProperty(key)) {
                            that.chartData[key] = [];
                        }
                    }
                    // echart所需数据格式转换
                    data.datalist.reverse().forEach(function(item, index) {
                        for (let key in that.chartData) {
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
            jsonp('http://tongji.021.com/datacenterapi/appqidareaspreaddata/appqidareaspread?callbackparam=csdata', {
                'param': queryParam,
                'name': 'callback'
            }, function(err, data) {});
        }
    },
    mounted() {
        this.init()
    },
    activated() {
        this.queryCreateList()
    }
};
</script>
<style scoped>
.disabled {
    cursor: text;
    color: #bfcbd9;
}

a {
    color: #666;
    cursor: pointer;
    text-decoration: none;
}

a.disabled:hover {
    color: #bfcbd9;
}

a:hover {
    color: #0000ee;
}

#chartContainer {
    width: 100%;
    height: 400px;
}
</style>
