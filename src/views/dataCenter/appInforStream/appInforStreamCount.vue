<template>
<div>
    <el-form :inline="true" :model="form">
        <el-form-item label="时间：">
            <el-date-picker v-model="timeCur" type="date" placeholder="选择时间" align="right" :picker-options="pickerOptions" @change="dateChange">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="软件名称：">扬子头条</el-form-item>
        <el-form-item label="信息流位置：" prop="place">
            <el-select v-model="form.place" class="select-platform" filterable placeholder="支持中文/拼音搜索" @change="optionChange">
                <el-option label="新闻" value="news">
                </el-option>
                <el-option label="视频" value="video">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="信息流：" prop="urlfrom">
            <el-select v-model="form.urlfrom" class="select-platform" filterable placeholder="支持中文/拼音搜索" @change="optionChange">
                <el-option label="汇总" value="">
                </el-option>
                <el-option v-for="(item,index) in urlfrom" :key="item" :label="item" :value="item">
                </el-option>
                <el-option label="pushhistory" value="pushhistory">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="渠道：" prop="qid">
            <el-select v-model="form.qid" class="select-platform" filterable placeholder="支持中文/拼音搜索" @change="optionChange">
                <el-option label="total" value="total">
                </el-option>
                <el-option v-for="(item,index) in qid" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column prop="dt" width="120" label="时间" align="center" sortable>
        </el-table-column>
        <el-table-column prop="apptype" label="软件名称" align="center" width="160" sortable>
        </el-table-column>
        <el-table-column prop="qid" width="100" label="渠道" align="center" sortable>
        </el-table-column>
        <el-table-column prop="place" label="信息流位置" width="160" align="center" sortable>
        </el-table-column>
        <el-table-column prop="urlfrom" label="信息流" align="center" width="120" sortable>
        </el-table-column>
        <el-table-column prop="pv" width="120" label="pv" align="center" sortable>
        </el-table-column>
        <el-table-column prop="uv" label="uv" width="120" align="center" sortable>
        </el-table-column>
        <el-table-column prop="p_u_rate" width="120" label="p/u" align="center" sortable>
        </el-table-column>
        <el-table-column prop="show_pv" label="show" width="120" align="center" sortable>
        </el-table-column>
        <el-table-column prop="p_s_rate" label="点击率P/S" width="160" align="center" sortable>
        </el-table-column>
        <el-table-column prop="pv_rate" label="pv占比" align="center" width="160" sortable>
        </el-table-column>
        <el-table-column prop="uv_rate" label="uv占比
              align=" center "" sortable>
        </el-table-column>
        <el-table-column prop="avgidx" label="平均加载idx" width="160" align="center" sortable>
        </el-table-column>
        <el-table-column prop="avgidx_neg" label="平均叠加idx" width="160" align="center" sortable>
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
export default {
    data() {
        return {
            timeCur: '',
            tableData: [],
            labelWidth: "120px",
            listLoading: false,
            total: 0,
            place: ['新闻', '视频'],
            urlfrom: [],
            qid: [],
            placeRef: {
                'news': '新闻',
                '视频': '视频'
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
                place: 'news',
                urlfrom: '',
                qid: ''
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
        dateChange: function(val) {
            var dateArr = val.split(' - ');
            this.form.ctime = dateArr[0].split('-').join('');
            this.search();
        },
        optionChange: function() {
            this.search();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.search();
            // this.queryCreateList();
        },
        handleSizeChange(val) {
            this.form.pagesize = val;
            // this.queryCreateList();
            this.search();
        },
        search: function() {
            this.queryCreateList()
        },
        getUrlfrom: function() {
            // jsonp回调函数
            var that = this;
            window.urlfrom = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {
                        that.urlfrom.push(item.urlfrom);
                    });
                } else {
                    console.log('fail')
                }
            }

            jsonp('http://tongji.021.com/datacenterapi/appinfostream/getstream?callbackparam=urlfrom', null, function(err, data) {

            });
        },
        getQid: function() {
            // jsonp回调函数
            var that = this;
            window.qid = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {
                        that.qid.push(item.qid);
                    });
                } else {
                    console.log('fail')
                }
            }

            jsonp('http://tongji.021.com/datacenterapi/appinfostream/getqid?callbackparam=qid', null, function(err, data) {

            });
        },
        init() {
            this.getUrlfrom();
            this.getQid();
            this.search();
        },
        queryCreateList() {
            let that = this;

            // 参数字符串
            let queryParam = 'pagesize=' + this.form.pagesize + '&page=' + this.form.page + '&startDate=' + this.form.ctime + '&endDate=' + this.form.ctime + '&place=' + this.form.place + '&qid=' + this.form.qid + '&urlfrom=' + this.form.urlfrom +
                '&callback';

            // jsonp回调函数
            window.jsonpdata = function(data) {
                if (data.code === 200) {
                    data.datalist.forEach(function(item, index) {
                        item.place = that.placeRef[item.place];
                    })
                    that.tableData = data.datalist;
                    that.total = data.pagecount;
                    that.listLoading = false;

                } else {
                    console.log('fail')
                }
            }
            this.listLoading = true;

            jsonp('http://tongji.021.com/datacenterapi/appinfostream/infostream?callbackparam=jsonpdata', {
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
        this.search();
    }
};
</script>
<style scoped>
/*.block{
        margin-top: 20px;
    }*/

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
}
</style>
