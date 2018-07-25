<template lang="html">
    <section class="auditPatrolList">
        <el-card>
            <el-form :inline="true" :model="form" style="margin-bottom: 0">
                <el-form-item label="巡查时间" style="margin-bottom:0">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.timeQuantum"
                        type="datetimerange"
                        placeholder="选择时间范围"
                        @change="getTopTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="巡查人员" style="margin-bottom:0">
                    <el-select v-model="form.user" class="select-platform"  style="margin-bottom: 0"
                        filterable placeholder="请选择巡查人员">
                        <el-option
                            v-for="(item,index) in auditPeoples"
                            :key="index"
                            :label="item.realName"
                            :value="item.userName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="getList">查询</el-button>
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
            <el-table-column prop="auditUser" label="审核人" min-width="140" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="auditCount" label="巡查总数" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="passCount" label="通过总数" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="refuseCount" label="拒绝总数" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="firstTrialPassRate" label="原审核通过率" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="firstTrialRefuseRate" label="原审核拒绝率" width="100" :show-overflow-tooltip="true">
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
} from '@/utils'
import {
    getAuditPatrolUser,
    getAuditPatrolList,
    exportPatrolListExcel
} from '@/api/audit'
export default {
    data() {
        const startTime = parseTime(new Date().setHours(0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
        const endTime = parseTime(new Date().setHours(23, 59, 59), '{y}-{m}-{d} {h}:{i}:{s}')
        return {
            form: {
                user: '',
                timeQuantum: [startTime,endTime],
                starttime: startTime,
                endtime: endTime,
            },
            auditPeoples: [],
            tableData: [],
            listLoading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            allData: []
        }
    },
    mounted(){
        this.getAuditPatrolUser()
    },
    methods: {
        // 获取巡查人员
        getAuditPatrolUser() {
            getAuditPatrolUser().then(res => {
                if(res.code === '00001'){
                    this.auditPeoples = res.data
                    this.auditPeoples.unshift({
                        userName: '',
                        realName: '全部人员'
                    })
                }
            })
        },
        // 查询
        search() {

        },
        getList() {
            let params = {
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                auditUser: this.form.user
            }
            this.listLoading = true
            getAuditPatrolList(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data
                }
                this.listLoading = false
            })
        },
        getTopTime() {
            this.form.starttime = this.form.timeQuantum[0]
            this.form.endtime = this.form.timeQuantum[1]
        },
        // 分页
        paginationChange(data){
            return data.slice((this.currentPage - 1)*this.pageSize,(this.currentPage - 1)*this.pageSize + this.pageSize)
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.tableData = this.paginationChange(this.allData)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.tableData = this.paginationChange(this.allData)
        },
        exportExcel() {
            var exportUrl = exportPatrolListExcel;
            exportUrl += 'startTime=' + (this.form.starttime ? this.form.starttime : '')
            exportUrl += '&endTime=' + this.form.endtime
            exportUrl += '&auditUser=' + (this.form.user ? this.form.user : '')
            console.log(exportUrl)
            window.location.href = exportUrl
        }
    }
}
</script>

<style lang="css">
</style>
