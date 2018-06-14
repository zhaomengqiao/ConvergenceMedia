<template>
<div class="hainanUserData">
    <el-form :inline="true" :model="form">
        <el-form-item label="时间：">
            <el-date-picker v-model="dateRange" @change="dateRangeChange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="软件名称：">海南头条</el-form-item>
    </el-form>
    <el-table :data="tableData2" class="roomList" highlight-current-row tooltip-effect="dark" stripe border align="center" v-loading="listLoading" :default-sort="{prop: 'dt', order: 'descending'}" style="width: 100%">
        <el-table-column prop="dt" label="日期" align="center" sortable>
        </el-table-column>
        <el-table-column prop="provname" label="名称" align="center" sortable>
        </el-table-column>
        <el-table-column prop="pc_pv" label="PC端PV" align="center" sortable>
        </el-table-column>
        <el-table-column prop="pc_uv" label="PC端UV" align="center" sortable>
        </el-table-column>
        <!-- <el-table-column
        prop="pc_ip"
        label="PC端IP"
        align="center"
        sortable>
      </el-table-column> -->
        <el-table-column prop="mt_pv" label="移动端PV" align="center" sortable>
        </el-table-column>
        <el-table-column prop="mt_uv" label="移动端UV" align="center" sortable>
        </el-table-column>
        <!-- <el-table-column
        prop="mt_ip"
        label="移动端IP"
        align="center"
        sortable>
      </el-table-column> -->
    </el-table>
    <div class="block">
        <el-pagination @current-change="handleCurrentChange" layout="total,sizes, prev, pager, next,jumper" :page-sizes=[10] :total="total" :current-page.sync="currentPage" style="float:right;">
        </el-pagination>
    </div>
</div>
</template>
<script>
import jsonp from 'jsonp';

export default {
    data() {
        return {
            labelWidth: "120px",
            listLoading: false,
            dateRange: '',
            total: 0,
            currentPage: 1,
            form: {
                stime: '',
                etime: ''
            },
            tableData: [],
            tableData2: [],
            chartData: {
                dt: [],
                pc_pv: [],
                pc_uv: [],
                pc_ip: [],
                mt_pv: [],
                mt_uv: [],
                mt_ip: []
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
    methods: {
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
            this.currentPage = 1;
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
        init() {
            this.queryCreateList();
        },
        queryCreateList() {
            let that = this;

            // 参数字符串
            let queryParam = '&startDate=' + this.form.stime + '&endDate=' + this.form.etime + '&callback';

            // jsonp回调函数
            window.hndata = function(data) {
                if (data.code === 200) {
                    that.tableData = data.datalist.reverse();
                    data.datalist.forEach(function(item, index) {
                        item.provname = "海南头条";
                    })
                    that.tableData2 = [];
                    for (var i = 0; i < 10; i++) {
                        if (that.tableData[i]) {
                            that.tableData2.push(that.tableData[i])
                        }
                    }
                    that.total = data.datalist.length;
                    that.listLoading = false;
                } else {
                    console.log('fail')
                }
            }
            this.listLoading = true;

            // jsonp('http://tongji.021.com/datacenterapi/nanchangdata/datalist?callbackparam=hndata', {'param': queryParam, 'name': 'callback'}, function (err, data) {
            //   http://123.59.85.60/datacenterapi/
            // });
            jsonp('http://tongji.021.com/datacenterapi/hntoutiaodata/hntoutiao?callbackparam=hndata', {
                'param': queryParam,
                'name': 'callback'
            }, function(err, data) {

            });
        }
    },
    mounted() {
        this.init();
    },
    activated() {
        this.queryCreateList();
    }
};
</script>
<style scoped>
.hainanUserData{
    padding: 20px;
}
</style>
