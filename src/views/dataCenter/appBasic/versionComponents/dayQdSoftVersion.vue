<template>
<div>
    <el-form :inline="true" :model="form">
        <el-form-item label="时间：">
            <el-date-picker v-model="dateRange" @change="dateRangeChange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-button @click="handleBack" type="primary">返回</el-button>
    </el-form>
    <el-row>
        <el-col :span="24">
            <div id="chartContainer" style=""></div>
        </el-col>
    </el-row>
    <el-table ref="singleTable" :data="tableData" border v-loading="listLoading" style="width: 100%; margin-top: 20px;" :default-sort="{prop: 'dt', order: 'descending'}" highlight-current-row @row-click="selectCurrent">
        <el-table-column prop="dt" width="100" label="日期" align="center" sortable>
        </el-table-column>
        <el-table-column label="软件名称" prop="apptype" align="center" width="100">
        </el-table-column>
        <el-table-column prop="openuv" width="140" label="APP打开UV数(IMEI)" align="center" sortable>
        </el-table-column>
        <el-table-column prop="pv" label="总浏览量pv" width="120" align="center" sortable>
        </el-table-column>
        <el-table-column prop="uv" width="120" label="总访客数uv" align="center" sortable>
        </el-table-column>
        <el-table-column prop="purate" label="P/U比" width="120" align="center" sortable>
        </el-table-column>
        <el-table-column prop="ip" label="IP数" width="100" align="center" sortable>
        </el-table-column>
        <el-table-column prop="onlineavg" label="日均总在线(APP)" align="center" width="160" sortable :formatter="formatterTime">
        </el-table-column>
        <el-table-column prop="timeavg" label="日均总在线(新闻、视频、图片)" align="center" width="160" sortable :formatter="formatterTime">
        </el-table-column>
        <el-table-column prop="news_onlinetime" label="新闻人均时长" width="140" align="center" sortable :formatter="formatterTime">
        </el-table-column>
        <el-table-column prop="video_onlinetime" label="视频人均时长" width="140" align="center" sortable :formatter="formatterTime">
        </el-table-column>
        <el-table-column prop="picture_onlinetime" label="图片人均时长" width="140" align="center" sortable :formatter="formatterTime">
        </el-table-column>
        <el-table-column label="新闻" align="center">
            <el-table-column prop="news_pv" label="pv" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="news_pvrate" label="pvrate" width="100" align="center" sortable :formatter="formatPercent">
            </el-table-column>
            <el-table-column prop="news_uv" label="uv" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="news_uvrate" label="uvrate" width="100" align="center" sortable :formatter="formatPercent">
            </el-table-column>
        </el-table-column>
        <el-table-column label="图集" align="center">
            <el-table-column prop="image_pv" label="pv" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="image_pvrate" label="pvrate" width="100" align="center" sortable :formatter="formatPercent">
            </el-table-column>
            <el-table-column prop="image_uv" label="uv" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="image_uvrate" label="uvrate" width="100" align="center" sortable :formatter="formatPercent">
            </el-table-column>
        </el-table-column>
        <el-table-column label="视频" align="center">
            <el-table-column prop="video_pv" label="pv" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="video_pvrate" label="pvrate" width="100" align="center" sortable :formatter="formatPercent">
            </el-table-column>
            <el-table-column prop="video_uv" label="uv" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="video_uvrate" label="uvrate" width="100" align="center" sortable :formatter="formatPercent">
            </el-table-column>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next,jumper" :page-sizes=[10,15,20,50,100] :current-page="form.page" :page-size="form.pagesize" :total="total" style="float:right;">
        </el-pagination>
    </div>
</div>
</template>

<script>
import jsonp from 'jsonp';
import echarts from 'echarts';
export default {
    props: ['appVersion', 'appType', 'appQid'],
    data() {
        return {
            seriesCurrent: 'openuv',
            timeCur: '',
            dateRange: [new Date().getTime() - 3600 * 1000 * 24 * 31, new Date().getTime() - 3600 * 1000 * 24 * 1],
            currentRow: null,
            tableData: [],
            tableDataTotal: [],
            labelWidth: "120px",
            listLoading: false,
            total: 0,
            appversion: [],
            series: [{}, {}, {}, {}, {}],
            seriesName: ["APP打开UV数", "浏览量(pv)", "访问量(uv)", "总P/U", "总IP数"],
            chartData: {
                dt: [],
                openuv: [],
                pv: [],
                uv: [],
                purate: [],
                ip: []
            },
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            form: {
                page: 1,
                pagesize: 100,
                stime: '',
                etime: '',
                appversion: this.appVersion,
                appqid: this.appQid
            },
            statusLabel: '请选择',
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
            },
            realAuthList: {}
        };
    },
    methods: {

        //选中当前行
        selectCurrent: function(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },

        // 将小数转化为百分比
        formatPercent: function(row, column) {
            return row[column.property] + "%";
        },

        //切换动态组件
        handleClick: function(row) {
            this.$emit('comchange', 'versionCountChild', row);
        },

        //切换动态组件-返回
        handleTopClick: function() {
            this.$emit('comchange', 'versionCountIndex');
        },

        handleBack: function() {
            this.$emit('comchange', 'countByVersion');
        },

        //将秒数转为“x分x秒”格式
        formatterTime: function(row, column) {
            return parseInt(row[column.property] / 60) + '分' + row[column.property] % 60 + '秒'
        },

        //将“x分x秒”格式转为秒数
        toSecond: function(data) {
            if (data) {
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
            } else {
                return 0;
            }
        },

        //时间控件触发
        dateRangeChange: function(val) {
            val = val || '';
            var dateArr = val.split(' - ');
            this.form.stime = dateArr[0].split('-').join('');
            this.form.etime = dateArr[1].split('-').join('');
            this.listLoading = false;
            this.queryCreateList();
        },

        //下拉框触发
        optionChange: function() {
            this.queryCreateList();
        },

        //分页选择页数触发
        handleCurrentChange(val) {
            this.form.page = val;
            this.queryCreateList();
        },

        //分页选择条数触发
        handleSizeChange(val) {
            this.form.pagesize = val;
            this.queryCreateList();
        },

        //jsonp获取appversion
        getAppVersion: function() {
            // jsonp回调函数
            var that = this;
            window.appversion = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {
                        that.appversion.push(item.appversion);
                    });
                    // console.log(that.qid);
                } else {
                    console.log('fail')
                }
            }

            jsonp('http://tongji.021.com/datacenterapi/appdayqd/getappversion?callbackparam=appversion', null, function(err, data) {

            });
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

            // console.log(chartSeries);

            this.chart.setOption({
                title: {

                },
                tooltip: {
                    trigger: 'axis',

                    formatter: '{a} <br/>{b} : {c}'
                },
                legend: {
                    left: 'left',
                    data: that.seriesName,
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
                    top: '25%',
                    left: '3%',
                    right: '4%',
                    bottom: '4%',
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

        //查询数据
        queryCreateList() {
            let that = this;

            // 参数字符串
            let queryParam = 'pagesize=' + this.form.pagesize + '&page=' + this.form.page + '&startDate=' + this.form.stime + '&endDate=' + this.form.etime + '&appversion=' + this.form.appversion + '&appqid=' + this.form.appqid + '&callback';

            // jsonp回调函数
            window.appdayqdsoftversion = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {
                        item.openuv = parseInt(item.openuv) ? parseInt(item.openuv) : 0;
                        item.pv = parseInt(item.pv) ? parseInt(item.pv) : 0;
                        item.uv = parseInt(item.uv) ? parseInt(item.uv) : 0;
                        item.purate = parseFloat(item.purate) ? parseFloat(item.purate) : 0;
                        item.ip = parseInt(item.ip) ? parseInt(item.ip) : 0;
                        item.onlineavg = that.toSecond(item.onlineavg);
                        item.timeavg = that.toSecond(item.timeavg);
                        item.news_onlinetime = that.toSecond(item.news_onlinetime);
                        item.video_onlinetime = that.toSecond(item.video_onlinetime);
                        item.picture_onlinetime = that.toSecond(item.picture_onlinetime);
                        item.id = index;
                    });
                    that.tableData = data.datalist;
                    that.total = data.pagecount;
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
                    // console.log(that.chartData);

                    that.drawGraph('chartContainer');


                } else {
                    console.log('fail')
                }
            }
            this.listLoading = true;

            jsonp('http://tongji.021.com/datacenterapi/appdayqd/appdayqdsoftversion?callbackparam=appdayqdsoftversion', {
                'param': queryParam,
                'name': 'callback'
            }, function(err, data) {

            });
        },
        init() {
            let timeEnd = new Date();
            let timeStart = new Date();
            timeEnd.setTime(timeEnd.getTime() - 3600 * 1000 * 24 * 1);
            timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 31);

            this.form.stime = timeStart.getFullYear() + '' + (timeStart.getMonth() + 1) + '' + timeStart.getDate();
            this.form.etime = timeEnd.getFullYear() + '' + (timeEnd.getMonth() + 1) + '' + timeEnd.getDate();

            this.getAppVersion();
            this.queryCreateList()
        }
    },
    mounted() {
        this.init()
    },
    activated() {
        this.form.appversion = this.appVersion;
        if (this.appQid === '汇总') {
            this.form.appqid = '';
        } else {
            this.form.appqid = this.appQid;
        }
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
    width: 1000px;
    height: 400px;
    margin: 0 auto;
}

.table-total-count th,
.table-total-count td {
    background-color: #eef1f6;
}
</style>
