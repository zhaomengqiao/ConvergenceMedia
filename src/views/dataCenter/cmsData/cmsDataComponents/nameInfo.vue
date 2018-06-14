<template>
<div>
    <el-form :inline="true">
        <!-- <el-form-item label="时间：">
<el-date-picker
v-model="timeCur"
type="date"
placeholder="选择时间"
align="right"
:picker-options="pickerOptions" @change="dateChange">
</el-date-picker>
</el-form-item> -->
        <el-form-item label="账号：">
            {{ formatterName(row.username) }}
        </el-form-item>
        <el-form-item label="软件ID：">扬子头条</el-form-item>
        <template scope="">
            <el-button type="primary" @click="dtClick(null, null, 'logInfo')">返回</el-button>
        </template>
    </el-form>
    <el-table
        :data="tableData"
        border
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
            prop="date"
            label="时间"
            align="center"
            sortable>
        </el-table-column>

        <el-table-column
            label="账号"
            align="center">
            <template slot-scope="scope">
                <span>{{ formatterName(row.username) }}</span>
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
    </el-table>
    <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="form.size"
            layout="sizes, prev, next, slot"
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
            fabu: [],
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
                type: 'name',
                plantform: '',
                title: '',
                url: '',
                news_type: ''
            },
            statusLabel: '请选择',
            realAuthList: {}
        };
    },

    props: {
        row: ''
    },
    methods: {
        dtClick: function(row, col, component) {
            if (row) {
                row.username = this.row.username;
            }
            this.$emit('dtchange', component, row, col);
        },
        formatterName: function(row) {
            if (userMap[row]) {
                return userMap[row];
            } else {
                return row;
            }
        },
        optionChange: function() {
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
            this.form.size = 10;
            this.search();
        },
        getOperateList(res) {
            var _this = this;
            this.total = this.form.page * this.form.size;
            this.form.username = this.row.username;
            $.ajax({
                url: 'http://qqtt.dftoutiao.com/cmsdata/getdetail',
                type: "POST",
                data: _this.form,
                success: function(data) {
                    _this.tableData = [];
                    if (data.data instanceof Array) {
                        _this.tableData = data.data;
                        if (data.data.length == _this.form.size) {
                            _this.total += _this.form.size;
                        }
                    } else {

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
