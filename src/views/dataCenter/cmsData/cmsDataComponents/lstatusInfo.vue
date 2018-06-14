<template>
<div>
    <el-form :inline="true" :model="form">
        <!-- <el-form-item label="时间：">
<el-date-picker
v-model="timeCur"
type="date"
placeholder="选择时间"
align="right"
:picker-options="pickerOptions" @change="dateChange">
</el-date-picker>
</el-form-item> -->
        <el-form-item>
            <el-input type="primary" v-model.trim="form.title" placeholder="输入标题"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="primary" v-model.trim="form.url" placeholder="输入URL"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item label="类别：">
            <el-select v-model="form.news_type" class="select-platform" @change="optionChange">
                <el-option label="新闻" value="1">
                </el-option>
                <el-option label="图集" value="2">
                </el-option>
                <el-option v-if="col != 'bianji'" label="视频" value="3">
                </el-option>
                <el-option label="所有" value="999">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="软件ID：">扬子头条</el-form-item>
            <template scope="">
                <el-button type="primary" @click="dtClick(null, null, 'logInfo')">返回</el-button>
            </template>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="编辑时间" align="center" width="120">
        </el-table-column>
        <el-table-column prop="username" label="账号" width="120" align="center">
            <template slot-scope="scope">
                <span>{{ formatterName(scope.row.username) }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            align="center">
        </el-table-column>
        <el-table-column
            prop="type"
            label="类别"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            prop="url"
            label="操作"
            align="center">
            <template slot-scope="scope">
                <el-button @click="goHref(scope.row.url)" type="text" size="middle">{{ scope.row.url }}</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="form.size"
            layout="sizes, prev, next, slot"
            :current-page.sync="form.page"
            :total="total"
            style="float:right">
            <slot><span style="line-height:28px;padding-left:15px;">第{{form.page}}页</span></slot>
        </el-pagination>
        <span class="yz-cmback" v-if="form.page > 1" @click="search">回到首页</span>
    </div>
</div>
</template>
<script>
import $ from 'jquery'
import userMap from '@/utils/localUtils/userMap';
import pinyinMap from '@/utils/localUtils/pinyinMap';
export default {
    data() {
        return {
            timeCur: '',
            sdate: [],
            tableData: [],
            labelWidth: "120px",
            listLoading: false,
            total: 0,
            newsRef: {
                '1': '新闻',
                '2': '图集',
                '3': '视频',
                '999': '所有'
            },
            statusRef: {
                'bianji': '编辑',
                'notfound': '404',
                'yiyue': 'TOP榜已阅',
                'yiyue_mingan': '敏感词已阅',
                'fabu': '发布',
                'jiahei': '加黑'
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
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
                sdate: '',
                username: '',
                page: 1,
                size: 10,
                type: '',
                plantform: '',
                title: '',
                url: '',
                news_type: '999'
            },
            statusLabel: '请选择',
            realAuthList: {}
        };
    },
    props: {
        row: '',
        col: ''
    },
    methods: {
        dtClick: function(row, col, component) {
            this.$emit('dtchange', component, row, col);
            this.form.url = '';
            this.form.title = '';
            this.form.page = 1;
            this.form.page = 10;
            this.form.news_type = '999';
        },
        formatterName: function(row) {
            if (userMap[row]) {
                return userMap[row];
            } else {
                return row;
            }
        },
        goHref: function(src) {
            window.open(src);
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
        dateChange: function(a) {
            a = a || this.getUsefullDate();
            var dateStr = a.replace(/\-/g, "");
            this.form.date = dateStr;
            this.getOperateList();
        },
        optionChange: function() {
            this.form.page = 1;
            this.getOperateList();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.getOperateList();
        },
        handleSizeChange(val) {
            this.form.size = val;
            this.form.page = 1;
            this.getOperateList();
        },
        search() {
            this.form.page = 1;
            this.getOperateList();
        },
        init() {
            this.getOperateList();
        },
        getOperateList() {
            let _this = this;
            this.form.type = this.col;
            this.form.sdate = this.row.date;
            this.form.username = this.row.username;
            this.total = this.form.page * this.form.size;
            $.ajax({
                url: 'http://qqtt.dftoutiao.com/cmsdata/getdetail',
                type: "POST",
                data: _this.form,
                success: function(data) {
                    _this.tableData = [];
                    // _this.total = 0;
                    if (data.data instanceof Array) {
                        _this.tableData = data.data.map(function(item) {
                            item.type = _this.newsRef[item.type];
                            item.status = _this.statusRef[item.status];
                            return item;
                        });
                        if (data.data.length == _this.form.size) {
                            _this.total += _this.form.size;
                        }
                    } else {
                        // console.log(data);
                    }
                }
            });
            return true;
        }
    },
    mounted(){
      this.init();
    },
    // activated() {
    //     this.init();
    // }
};
</script>
<style>
.yz-cmback {
    margin-top: 18px;
    margin-right: 15px;
    float: right;
    color: #20a0ff;
    line-height: 28px;
    cursor: pointer;
}
</style>
