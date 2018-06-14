<template>
<div>
    <el-form :inline="true" :model="form">
        <el-form-item label="时间：">
            <el-date-picker v-model="timeCur" type="date" placeholder="选择时间" align="right" :picker-options="pickerOptions" @change="dateChange">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="软件名称：">扬子头条</el-form-item>
        <el-form-item label="渠道ID：" prop="qid">
            <el-select v-model="form.qid" class="select-platform" filterable placeholder="支持中文/拼音搜索" @change="optionChange">
                <el-option v-for="(item,index) in qid" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <section class="echarts">
        <div :class="className" :id="id" :style="{height:height,width:width}"></div>
    </section>
    <el-table ref="singleTable" class="table-total-count" :data="tableDataTotal" border style="width: 100%; margin-top:20px;" :default-sort="{prop: 'date', order: 'descending'}" highlight-current-row @row-click="selectCurrent">
        <el-table-column prop="dt" label="时间" align="center" sortable>
        </el-table-column>
        <el-table-column label="软件名称" align="center" sortable>
            <template slot-scope="scope">
                <el-button @click="totalClick(scope.row)" type="text" size="middle">扬子头条</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="qid" label="渠道名称" align="center" sortable>
        </el-table-column>
        <el-table-column label="省份" align="center" sortable>
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row)" type="text" size="middle">{{ scope.row.provname }}</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="pv" label="pv" align="center" sortable>
        </el-table-column>
        <el-table-column prop="uv" label="uv" align="center" sortable>
        </el-table-column>
        <el-table-column :formatter="toPercent" prop="pu_rate" label="p/u" align="center" sortable>
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
                <el-button @click="handleClick(scope.row)" type="text" size="middle">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-table ref="singleTable" :data="tableData2" border style="width: 100%; margin-top:3%;" :default-sort="{prop: 'date', order: 'descending'}" highlight-current-row @row-click="selectCurrent">
        <el-table-column prop="dt" label="时间" align="center" sortable>
        </el-table-column>
        <el-table-column label="软件名称" align="center" sortable>
            <template slot-scope="scope">
                <el-button @click="ruanClick(scope.row)" type="text" size="middle">扬子头条</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="qid" label="渠道名称" align="center" sortable>
        </el-table-column>
        <el-table-column label="省份" align="center" sortable>
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row)" type="text" size="middle">{{ scope.row.provname }}</el-button>
            </template>
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
                <el-button @click="handleClick(scope.row)" type="text" size="middle">查看</el-button>
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
require('echarts/map/js/china');
import jsonp from 'jsonp';
export default {
    data() {
        return {
            timeCur: '',
            chart: null,
            className: 'echart',
            id: 'echart',
            height: '400px',
            width: '100%',
            chartData: [],
            tableDataTotal: [],
            seriesName: ["PV", "UV", "IP"],
            labelWidth: "120px",
            listLoading: false,
            dateRange: '',
            qid: [],
            total: 0,
            form: {
                ctime: this.getUsefullDate(),
                qid: '汇总',
                city: '',
                province: '',
                apptypeid: ''
            },
            tableData: [],
            tableData2: [],
            chartData: {
                dt: [],
                uv: [],
                pv: [],
                purate: [],
                ip: [],
                appqid: []
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
    created() {
        this.queryCreateList();
    },
    mounted() {
        this.init();
    },
    methods: {
        selectCurrent: function(row) {
            this.$refs.singleTable.setCurrentRow(row)
        },
        handleClick: function(row) {
            this.$emit('dtchange', 'check', row);
        },
        ruanClick: function(row) {
            this.$emit('citychange', 'ruanjian', row);
        },
        totalClick: function(row) {
            this.$emit('citychange', 'totalsoft', row);
        },
        dtClick: function(row) {
            this.$emit('dtchange', 'sBar', row);
        },
        toPercent: function(row, column) {
            return row[column.property] + "%";
        },
        initBar() {
            this.chart = echarts.init(document.getElementById(this.id));
            this.setOptions();
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
        dateChange: function(a) {
            a = a || this.getUsefullDate();
            var dateStr = a.replace(/\-/g, "");
            this.form.ctime = dateStr;
            this.queryCreateList();
        },
        optionChange: function() {
            this.queryCreateList();
        },
        handleQdDet: function(row) {
            this.$emit('qdchange', 'QdDet', row);
        },
        getUsefullDate: function() {
            var date = new Date();
            date.setDate(date.getDate() - 1);
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                monthStr = month > 9 ? month + '' : '0' + month,
                dayStr = day > 9 ? day + '' : '0' + day;
            return year + monthStr + dayStr;
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
            window.diyuqid = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {
                        that.qid.push(item.qid);
                    });
                    that.qid.splice(0, 1);
                } else {}
            }
            jsonp('http://tongji.021.com/datacenterapi/appqidareaspreaddata/getqid?callbackparam=diyuqid', null, function(err, data) {});
        },
        init() {
            this.getQid();
            this.queryCreateList()
        },
        queryCreateList() {
            var _this = this
            window.diyudata = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {})
                    _this.tableData = data.datalist;
                    _this.tableDataTotal = data.totallist;
                    _this.listLoading = false;
                    _this.tableData2 = [];
                    for (var i = _this.tableData.length; i >= _this.tableData.length - 10; i--) {
                        if (_this.tableData[i]) {
                            _this.tableData2.push(_this.tableData[i])
                        }
                    }
                    _this.total = data.datalist.length;
                    _this.listLoading = false;
                    var arr = [];
                    _this.seriesName.forEach(function(item) {
                        var name = item;
                        var dataArr = [];
                        data.datalist.forEach(function(i) {
                            dataArr.push({
                                name: i.provname,
                                value: i[item.toLowerCase()]
                            })
                        })
                        arr.push({
                            name: item,
                            type: 'map',
                            mapType: 'china',
                            showLegendSymbol: false,
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
                    _this.initBar();
                } else {
                    console.log('fail')
                }
            }
            let queryParam = '&startDate=' + this.form.ctime + '&endDate=' + this.form.ctime + '&qid=' + this.form.qid + '&city=' + this.form.city + '&province=' + this.form.province + '&apptypeid=' + this.form.apptypeid + '&callback';
            jsonp('http://tongji.021.com/datacenterapi/appqidareaspreaddata/appqidareaspread?callbackparam=diyudata', {
                'param': queryParam,
                'name': 'callback'
            }, function(err, data) {});
        },
        setOptions() {
            var _this = this;
            this.chart.setOption({
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['PV', 'UV', 'IP']
                },
                visualMap: {
                    min: 0,
                    max: 2500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: this.chartData
            })
        }
    }
}
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
    background-color: #e6f5ff;
}
</style>
