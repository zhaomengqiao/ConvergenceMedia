<template lang="html">
    <section class="auditData_comment_all">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="审核类型">
                        <el-select v-model="form.type" style="width:200px;"
                            filterable placeholder="选择审核类型">
                            <el-option
                                v-for="(item,index) in types"
                                :key="index"
                                :label="item.mean"
                                :value="item.logtype"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核时间">
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="form.timeQuantum"
                            type="datetimerange"
                            placeholder="选择时间范围"
                            @change="getTopTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核人员">
                        <el-select v-model="form.user" style="width:200px;"
                            filterable placeholder="请选择审核人员">
                            <el-option
                                v-for="(item,index) in users"
                                :key="index"
                                :label="item.realName"
                                :value="item.userName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="form.title" placeholder="请输入新闻标题"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="form.url" placeholder="请输入新闻链接"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="exportExcel">导出</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-row>
                <span class="mr-10">总数：{{ auditNum.auditcount }}</span>
                <span class="mr-10">通过：{{ auditNum.auditpasscount }}</span>
                <span class="mr-10">加黑：{{ auditNum.auditrefusecount }}</span>
            </el-row>
            <el-row class="mt-10">
                <el-table :data="tableData"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;"
                      tooltip-effect="dark"
                      stripe border>
                    <el-table-column label="审核时间" width="180" prop="createtime" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="审核人" width="140" prop="createuser" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="新闻标题" min-width="220">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" class="aclick" target="_blank">{{ scope.row.title }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="评论内容" min-width="220" prop="content" :show-overflow-tooltip="true">
                    </el-table-column>
                </el-table>
                <el-row class="toolbar">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :page-sizes="[10, 15, 20, 50, 100]"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        :total="total"
                        background
                        style="float:right;">
                    </el-pagination>
                </el-row>
            </el-row>
        </el-card>
    </section>
</template>

<script>
import {
    parseTime,
    getDateDiffDays
} from '@/utils'
import {
    getCommentAuditDetailList,
    getCommentAuditDetailNum,
    exportCommentDetail,
    getCommentDetailLog
} from '@/api/audit'
import {
    getAllAuditUser
} from '@/api/dataCenter'

export default {
    data(){
        const startTime = parseTime(new Date(new Date().setHours(0, 0, 0)), '{y}-{m}-{d} {h}:{i}:{s}')
        const endTime = parseTime(new Date(new Date().setHours(23, 59, 59)), '{y}-{m}-{d} {h}:{i}:{s}')
        return {
            form: {
                timeQuantum: [startTime, endTime],
                starttime: startTime,
                endtime: endTime,
                user: '',
                type: '',
                username: '',
                title: '',
                url: ''
            },
            types: [],
            users: [],
            tableData: [],
            listLoading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            auditNum: '',
            allData: []
        }
    },
    mounted(){
        this.getAllAuditUser()
        this.getCommentDetailLog()
    },
    methods: {
        search(){
            this.currentPage = 1
            this.getList()
        },
        getCommentDetailLog(){
            let params = {
                platform: 'comment',
                newstype: 'comment'
            }
            getCommentDetailLog(params).then(res => {
                if(res.code === '00001'){
                    this.types = res.data
                    this.types.unshift({
                        mean: '全部类型',
                        logtype: ''
                    })
                }
            })
        },
        getList(){
            this.getNum()
            if(getDateDiffDays(new Date(this.form.endtime), new Date(this.form.starttime)) > 31){
                this.$message({
                    message: '选择最大区间不能超过31天',
                    type: 'warning'
                })
                return false
            }
            let params = {
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                auditUser: this.form.user,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                auditType: this.form.type,
                userName: this.form.username,
                url: this.form.url,
                title: this.form.title
            }
            this.listLoading = true
            getCommentAuditDetailList(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
                this.listLoading = false
            })
        },
        getNum() {
            let params = {
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                auditUser: this.form.user,
                auditType: this.form.type
            }
            getCommentAuditDetailNum(params).then(res => {
                if(res.code === '00001'){
                    this.auditNum = res.data[0]
                }
            })
        },
        // 获取审核人员
        getAllAuditUser(){
            let params = {
                type: ''
            }
            getAllAuditUser(params).then(res => {
                if(res.code === '00001'){
                    this.users = res.data
                    this.users.unshift({
                        realName: '全部人员',
                        userName: ''
                    })
                }
            })
        },
        getTopTime(){
            if (this.form.timeQuantum.length != 0) {
                this.form.starttime = this.form.timeQuantum[0]
                this.form.endtime = this.form.timeQuantum[1]
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        },
        exportExcel(){
            var exportUrl = exportCommentDetail;
            exportUrl += 'startTime=' + (this.form.starttime ? this.form.starttime : '')
            exportUrl += '&endTime=' + this.form.endtime
            exportUrl += '&auditType=' + this.form.type
            exportUrl += '&auditUser=' + (this.form.user ? this.form.user  : '')
            console.log(exportUrl)
            window.location.href = exportUrl
        }
    }
}
</script>

<style lang="css">
</style>
