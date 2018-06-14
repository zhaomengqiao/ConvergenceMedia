<template>
<div>
    <el-form :inline="true">
        <el-form-item label="时间：">
            <el-date-picker v-model="timeCur" type="date" placeholder="选择时间" align="right" :picker-options="pickerOptions" @change="dateChange">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-input type="primary" v-model="username" placeholder="输入首姓名或全称"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item label="软件ID：">扬子头条</el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="时间" align="center">
        </el-table-column>
        <el-table-column prop="username" label="账号" align="center">
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row, null, 'nameInfo')" type="text" size="middle">{{ formatterName(scope.row.username) }}</el-button>
            </template>
        </el-table-column>
        <el-table-column
            prop="yiyue"
            label="TOP榜已阅"
            align="center">
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row, 'yiyue', 'lstatusInfo')" type="text" size="middle">{{ scope.row.yiyue }}</el-button>
            </template>
        </el-table-column>

        <el-table-column
            prop="yiyue_mingan"
            label="敏感词已阅"
            align="center">
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row, 'yiyue_mingan', 'lstatusInfo')" type="text" size="middle">{{ scope.row.yiyue_mingan }}</el-button>
            </template>
        </el-table-column>

        <el-table-column
            prop="bianji"
            label="编辑"
            align="center">
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row, 'bianji', 'lstatusInfo')" type="text" size="middle">{{ scope.row.bianji }}</el-button>
            </template>
        </el-table-column>

        <el-table-column
            prop="notfound"
            label="404"
            align="center">
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row, 'notfound', 'lstatusInfo')" type="text" size="middle">{{ scope.row.notfound }}</el-button>
            </template>
        </el-table-column>

        <el-table-column
            prop="jiahei"
            label="加黑"
            align="center">
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row, 'jiahei', 'lstatusInfo')" type="text" size="middle">{{ scope.row.jiahei }}</el-button>
            </template>
        </el-table-column>

        <el-table-column
            prop="fabu"
            label="发布"
            align="center">
            <template slot-scope="scope">
                <el-button @click="dtClick(scope.row, 'fabu', 'lstatusInfo')" type="text" size="middle">{{ scope.row.fabu }}</el-button>
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
            <slot>
                <span style="line-height:28px;padding-left:15px;">第{{form.page}}页</span>
            </slot>
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
            timeCur: new Date().getTime(),
            tableData: [],
            labelWidth: "120px",
            listLoading: false,
            total: 10,
            username: '',
            form: {
                sdate: '',
                username: '',
                page: 1,
                size: 10
            },
            statusLabel: '请选择',
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
            realAuthList: {}
        };
    },
    methods: {
        dtClick: function(row, col, component) {
            this.$emit('dtchange', component, row, col);
        },
        formatterName: function(row) {
            if (userMap[row]) {
                return userMap[row];
            } else {
                return row;
            }
        },
        search() {
            this.form.page = 1;
            this.getOperateList();
        },

        convertPinyin: function(str) { // 汉字转拼音
            var strLen = str.length;
            var strTep = "";
            var reg = new RegExp('[a-zA-Z0-9\- ]');
            for (var i = 0; i < strLen; i++) {
                var val = str.substr(i, 1);
                var name = this.arraySearch(val, pinyinMap);
                if (reg.test(val)) {
                    strTep += val;
                } else if (name !== false) {
                    strTep += name;
                }

            }
            strTep = strTep.replace(/ /g, '-');
            while (strTep.indexOf('--') > 0) {
                strTep = strTep.replace('--', '-');
            }
            return strTep;
        },

        arraySearch: function(str, obj) { //在对象中搜索
            for (var name in obj) {
                if (obj[name].indexOf(str) != -1) {
                    return name;
                    break;
                }
            }
            return false;
        },

        getUsefullDate: function() {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                monthStr = month > 9 ? month + '' : '0' + month,
                dayStr = day > 9 ? day + '' : '0' + day;
            return year + '-' + monthStr + '-' + dayStr;
        },
        dateChange: function(date) {
            this.form.sdate = date;
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
        getOperateList() {
            let _this = this;
            let reg = /^[\u4E00-\u9FA3]{1,}$/;
            this.total = this.form.page * this.form.size;
            this.form.username = this.convertPinyin(this.username);
            // console.log(this.form.username);
            $.ajax({
                url: 'http://qqtt.dftoutiao.com/cmsdata/getlist',
                type: "POST",
                data: _this.form,
                success: function(data) {
                    _this.tableData = [];
                    if (data.data instanceof Array) {
                        // console.log(data.data);
                        _this.tableData = data.data.filter(item => {
                            let temp = _this.formatterName(item.username);
                            if (temp.indexOf(_this.username) !== -1 || !reg.test(_this.username)) {
                                return item;
                            } else {
                                // return item;
                            }
                        });
                        // console.log(_this.tableData);
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
    mounted() {
        this.form.sdate = this.getUsefullDate();
        this.getOperateList();
    }
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
