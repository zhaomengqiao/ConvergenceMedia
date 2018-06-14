<template>
<div>
    <el-form :inline="true" :model="form">
        <el-form-item label="时间：">
            <el-date-picker v-model="timeCur" type="date" placeholder="选择时间" align="right" :picker-options="pickerOptions" @change="dateChange">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="软件名称：">扬子头条</el-form-item>
        <el-form-item label="版本名称：" prop="appversion">
            <el-select v-model="form.appversion" class="select-platform" filterable placeholder="支持中文/拼音搜索" @change="optionChange">
                <el-option label="汇总" value="" key=""></el-option>
                <el-option v-for="(item,index) in appversion" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-button @click="handleBack" type="primary">返回</el-button>
    </el-form>
    <el-row>

        <el-radio-group v-model="seriesCurrent" size="small" @change="swtichData">
            <el-radio-button label="openuv">App打开UV数</el-radio-button>
            <el-radio-button label="pv">浏览量(pv)</el-radio-button>
            <el-radio-button label="uv">访问量(uv)</el-radio-button>
            <el-radio-button label="ip">总IP数</el-radio-button>
        </el-radio-group>
        <el-col :span="24">
            <div id="chartContainer2" style="margin-top: 15px;"></div>
        </el-col>
    </el-row>

    <el-table ref="singleTable" :data="tableData" border style="width: 100%; margin-top: 20px;" :default-sort="{prop: 'dt', order: 'descending'}" highlight-current-row @row-click="selectCurrent">
        <el-table-column prop="dt" width="100" label="日期" align="center" sortable>
        </el-table-column>
        <el-table-column label="软件名称" prop="apptype" align="center" width="100">
        </el-table-column>
        <el-table-column label="渠道名称" prop="appqid" align="center" width="100">
        </el-table-column>
        <el-table-column width="100" label="版本名称" align="center">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="middle">{{ scope.row.appversion }}</el-button>
            </template>
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
</div>
</template>

<script>
import jsonp from 'jsonp';
import echarts from 'echarts';
export default {
    data() {
        return {
            seriesCurrent: 'openuv',
            timeCur: new Date().getTime() - 3600 * 1000 * 24 * 1,
            currentRow: null,
            tableData: [],
            tableDataTotal: [],
            labelWidth: "120px",
            listLoading: false,
            total: 0,
            appversion: [],
            seriesData: [],
            seriesName: {
                'openuv': 'APP打开UV数',
                'pv': '浏览量(pv)',
                'uv': '访问量(uv)',
                'ip': '总IP数'
            },
            chartData: {
                openuv: [],
                pv: [],
                uv: [],
                ip: [],
                appversion: []
            },
            chartOption: {
                dataType: 'openuv',
                dataName: 'APP打开UV数'
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
                pagesize: 10,
                ctime: '',
                appversion: ''
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
        //按钮事件处理
        swtichData: function(value) {
            this.chartOption.dataType = value;
            this.chartOption.dataName = this.seriesName[value];
            // console.log(this.seriesName[value]);
            this.drawGraphBar('chartContainer2');
        },

        //选中当前行
        selectCurrent: function(row) {
            this.$refs.singleTable.setCurrentRow(row)
        },

        // 将小数转化为百分比
        formatPercent: function(row, column) {
            return row[column.property] + "%";
        },

        //切换动态组件
        handleClick: function(row) {
            this.$emit('comchange', 'versionDisVerdet', row);
        },

        //切换动态组件-返回
        handleTopClick: function() {
            this.$emit('comchange', 'versionCountIndex');
        },

        handleBack: function() {
            this.$emit('comchange', 'versionCountIndex');
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
        dateChange: function(val) {
            val = val || '';
            var dateArr = val.split(' - ');
            this.form.ctime = dateArr[0].split('-').join('');
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

        //绘图echarts
        drawGraphBar(id) {
            // 绘图方法
            this.chart = echarts.init(document.getElementById(id));
            this.chart.showLoading();
            let that = this;
            let chartArr = [];
            let chartSeriesData = [];
            let length = this.chartData['appversion'].length;
            let i;
            for (i = 0; i < length; i++) {
                chartSeriesData.push({
                    value: this.chartData[this.chartOption.dataType][i],
                    name: this.chartData['appversion'][i]
                })
            }
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    left: 'left',
                    orient: 'vertical',
                    data: this.chartData['appversion'],
                },
                series: [{
                    name: this.chartOption.dataName,
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: chartSeriesData
                }]
            };

            this.chart.setOption(option);
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
            let queryParam = 'pagesize=' + this.form.pagesize + '&page=' + this.form.page + '&startDate=' + this.form.ctime + '&endDate=' + this.form.ctime + '&appversion=' + this.form.appversion + '&callback';

            // jsonp回调函数
            window.appdayqdtotalfb = function(data) {
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

                    // console.log(that.tableData);

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


                    // 回调成功绘图
                    that.drawGraphBar('chartContainer2')

                } else {
                    console.log('fail')
                }
            }
            this.listLoading = true;

            jsonp('http://tongji.021.com/datacenterapi/appdayqd/appdayqdtotalfb?callbackparam=appdayqdtotalfb', {
                'param': queryParam,
                'name': 'callback'
            }, function(err, data) {

            });
        },
        init() {
            this.getAppVersion();
            this.queryCreateList()
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

#chartContainer2 {
    width: 1000px;
    height: 400px;
    margin: 0 auto;
}

.table-total-count th,
.table-total-count td {
    background-color: #eef1f6;
}

.small-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #d8dce5;
    border-color: #d8dce5;
    color: #5a5e66;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-right: 10px;
}

.small-button:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
}

.small-button.active {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
}
</style>
