<template lang="html">
    <section class="auditData_comment_all">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-form-item label="审核时间" style="margin-bottom:0">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.timeQuantum"
                        type="datetimerange"
                        placeholder="选择时间范围"
                        @change="getTopTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人员" style="margin-bottom:0">
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
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="exportExcel">导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-table :data="tableData"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border>
                <el-table-column label="审核人员" min-width="170" prop="audituser" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="审核总数" width="100" prop="auditcount" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="通过总数" width="100" prop="auditpasscount" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="评论加黑" width="100" prop="auditrefusecount" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="昵称加黑" width="100" prop="usernameblackcount" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="用户加黑" width="100" prop="userblackcount" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="通过率" width="100" prop="passrate" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="加黑率" width="100" prop="refuserate" :show-overflow-tooltip="true">
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
        </el-card>
    </section>
</template>

<script>
import {
    parseTime,
    getDateDiffDays
} from '@/utils'
import {
    getNickNameAuditList,
    exportNickNameAuditAll
} from '@/api/audit'
import {
    getAllAuditUser
} from '@/api/dataCenter'

export default {
    data(){
        const startTime = new Date(new Date().setHours(0, 0, 0))
        const endTime = new Date(new Date().setHours(23, 59, 59))
        return {
            form: {
                timeQuantum: [startTime, endTime],
                starttime: startTime,
                endtime: endTime,
                user: ''
            },
            users: [],
            tableData: [],
            listLoading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            allData: []
        }
    },
    mounted(){
        this.getAllAuditUser()
    },
    methods: {
        search(){
            this.currentPage = 1
            this.getList()
        },
        getList(){
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
                auditUser: this.form.user
            }
            this.listLoading = true
            getNickNameAuditList(params).then(res => {
                if(res.code === '00001'){
                    this.allData = res.data
                    this.tableData = this.paginationChange(this.allData)
                    this.total = res.data.length
                }
                this.listLoading = false
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
        // 分页
        paginationChange(data){
            return data.slice(this.currentPage - 1,this.pageSize)
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.paginationChange(this.allData)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.paginationChange(this.allData)
        },
        exportExcel(){
            var exportUrl = exportNickNameAuditAll;
            exportUrl += 'json={"startTime":' + (this.form.starttime ? '"' + this.form.starttime + '"' : '')
            exportUrl += ',"endTime":' + '"' + this.form.endtime + '"'
            exportUrl += ',"auditUser":' + (this.form.user ? '"' + this.form.user + '"' + '"' : '""') + '}'
            console.log(exportUrl)
            window.location.href = exportUrl
        }
    }
}
</script>

<style lang="css">
</style>
