<template lang="html">
    <section class="auditData_All">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="审核平台：">
                        <el-select v-model="form.platform" class="select-platform"
                            filterable placeholder="选择审核平台">
                            <el-option
                                v-for="(item,index) in platforms"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核类型：">
                        <el-select v-model="form.type" class="select-platform"
                            filterable placeholder="选择审核类型">
                            <el-option
                                v-for="(item,index) in types"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核团队：">
                        <el-select v-model="form.team" style="width:210px;"
                            filterable placeholder="选择审核团队" @change="getAllAuditUser">
                            <el-option
                                v-for="(item,index) in teams"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核人员：">
                        <el-select v-model="form.user" class="select-platform"
                            filterable placeholder="选择人员">
                            <el-option
                                v-for="(item,index) in users"
                                :key="index"
                                :label="item.realName"
                                :value="item.userName"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item  style="margin-bottom:0">
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.timeQuantum" type="datetimerange" placeholder="选择时间范围" @change="getTopTime">
                        </el-date-picker>
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
                <!--发布列表Begin-->
                <el-table :data="tableData"
                          highlight-current-row
                          v-loading="listLoading"
                          style="width: 100%;"
                          tooltip-effect="dark"
                          stripe border>
                    <el-table-column prop="auditUser" label="审核人" min-width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="auditCount" label="审核总数" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="auditPassCount" label="通过总数" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="auditRefuseCount" label="拒绝总数" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="rejectCount" label="驳回总数" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="rejectPassCount" label="驳回通过总数" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="rejectRefuseCount" label="驳回拒绝总数" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="rejectEditCount" label="驳回编辑总数" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="passingRate" label="通过率" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.passingRate }}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="rejectRate" label="驳回率" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.rejectRate }}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="refusingRate" label="拒绝率" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.refusingRate }}%
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
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
                  style="float:right;"
                  >
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
    getAllAuditUser,
    getAllAuditDataList,
    exportExcalAuditAll
} from '@/api/dataCenter'
import {
    mapGetters
} from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data(){
        const startTime = new Date(new Date().setHours(0, 0, 0))
        const endTime = new Date(new Date().setHours(23, 59, 59))
        return {
            form: {
                timeQuantum: [startTime, endTime],
                starttime: startTime.getTime(),
                endtime: endTime.getTime(),
                platform: '',
                type: '',
                team: '',
                user: ''
            },
            platforms: [
                {
                    label: '全部平台',
                    value: ''
                },
                {
                    label: '自媒体',
                    value: 'wemedia'
                },
                {
                    label: '东方号',
                    value: 'selfmedia'
                },
                {
                    label: '东方网',
                    value: 'dongfangwang'
                }
            ],
            types: [
                {
                    label: '全部类型',
                    value: ''
                },
                {
                    label: '新闻',
                    value: 'news'
                },
                {
                    label: '图集',
                    value: 'picture'
                },
                {
                    label: '视频',
                    value: 'video'
                },
                {
                    label: '小视频',
                    value: 'minivideo'
                }
            ],
            teams: [
                {
                    label: '全部团队',
                    value: ''
                },
                {
                    label: '胡丽团队',
                    value: '审核'
                },
                {
                    label: '漫山网络',
                    value: '福州审核'
                },
                {
                    label: '神熊互娱',
                    value: '外包-神熊互娱'
                }
            ],
            users: [],
            tableData: [],
            allData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1,
            listLoading: false
        }
    },
    mounted(){
        this.pageSize = this.personalConfig.tableRowShow
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
                auditType: this.form.platform,
                newsType: this.form.type,
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                auditUser: this.form.user,
                userType: this.form.team
            }
            this.listLoading = true
            getAllAuditDataList(params).then(res => {
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
                type: this.form.team
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
                this.form.starttime = new Date(this.form.timeQuantum[0]).getTime()
                this.form.endtime = new Date(this.form.timeQuantum[1]).getTime()
            }
        },
        paginationChange(data){
            return data.slice((this.currentPage - 1)*this.pageSize,(this.currentPage - 1)*this.pageSize + this.pageSize)
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.tableData = this.paginationChange(this.allData)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.tableData = this.paginationChange(this.allData)
        },
        exportExcel(){
            var exportUrl = exportExcalAuditAll;
            exportUrl += 'startTime=' + (this.form.starttime ? this.form.starttime : '')
            exportUrl += '&endTime=' + this.form.endtime
            exportUrl += '&auditUser=' + (this.form.user ? this.form.user : '')
            exportUrl += '&userType=' + (this.form.team ? this.form.team : '')
            exportUrl += '&auditType=' + (this.form.platform ? this.form.platform : '')
            exportUrl += '&newsType=' + (this.form.type ? this.form.type : '')
            console.log(exportUrl)
            window.location.href = exportUrl
        }
    }
}
</script>

<style lang="css">
</style>
