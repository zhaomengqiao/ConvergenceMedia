<template>
    <div>
        <el-form :inline="true" :model="form">
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
            <el-form-item label="分類：">
                <el-radio label="匯總"></el-radio>
                <el-radio label="新聞："></el-radio>
                <el-select class="select-platform"
                           filterable placeholder="新聞匯總" @change="">
                    <el-option
                        label="新聞匯總"
                        value=""
                    >
                    </el-option>
                </el-select>
                <el-radio label="視頻："></el-radio>
                <el-select class="select-platform"
                           filterable placeholder="視頻匯總" @change="">
                    <el-option
                        label="視頻匯總"
                        value=""
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二級分類：">
                <el-select class="select-platform"
                           filterable placeholder="匯總" @change="">
                    <el-option
                        label="匯總"
                        value=""
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" class="table-total-count" highlight-current-row tooltip-effect="dark" stripe border align="center" v-loading="listLoading" :default-sort = "{prop: 'dt', order: 'descending'}" style="width: 100%;" max-height="300">
            <el-table-column
                prop="ranking"
                label="排名"
                width="150"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="apptype"
                label="app類型"
                width="250"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="sort"
                label="分類"
                width="150"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="second_sort"
                label="二級分類"
                width="250"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="title"
                label="標題"
                width="700"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="reading"
                label="閱讀量"
                width="180"
                align="center"
                sortable>
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
                            item.openuv = parseInt(item.openuv);
                            item.uv = parseInt(item.uv);
                            item.pv = parseInt(item.pv);
                            item.timeavg = that.toSecond(item.timeavg);
                            item.onlineavg = that.toSecond(item.onlineavg);
                        })
                        that.tableData = data.datalist;
                        that.total = data.pagecount
                        that.listLoading = false;
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
