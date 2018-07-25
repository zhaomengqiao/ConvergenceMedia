<template lang="html">
    <section class="noticeList">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-form-item label="标题：" style="margin-bottom:0">
                    <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="发布者：" style="margin-bottom:0">
                    <el-input v-model="form.user" placeholder="请输入发布者"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="search">查询</el-button>
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
                <el-table-column prop="title" label="标题" min-width="220" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="title" label="状态" width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="(Number(scope.row.deadtime) - (new Date().getTime()))>0">生效</el-tag>
                        <el-tag type="info" v-else>已过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createuser" label="发布人" width="120" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="发布时间" width="170" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                    </template>
                </el-table-column>
                <el-table-column label="过期时间" width="170" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deadtime!='9223372036854775807'">
                            {{ scope.row.deadtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                        </span>
                        <span v-else>
                            永久
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="senduser" label="通知用户" width="220" :show-overflow-tooltip="true">
                </el-table-column> -->
                <el-table-column label="操作" width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="setDisable(scope.row)">设置过期</el-button>
                    </template>
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
    getNotifyList,
    setNotifyDisabled
} from '@/api/systemTools'

export default {
    data() {
        return {
            listLoading: false,
            form: {
                title: '',
                user: ''
            },
            currentPage: 1,
            pageSize: 10,
            tableData: [],
            total: 0,
        }
    },
    methods: {
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            let jsonData = {
                deadtime: '',
                title: this.form.title,
                createuser: this.form.user
            }
            let params = {
                json: JSON.stringify(jsonData),
                page: this.currentPage,
                pagesize: this.pageSize
            }
            this.listLoading = true
            getNotifyList(params).then(res => {
                if(res.code === '00000'){
                    this.tableData = res.data.data
                    this.total = res.data.count
                }
                this.listLoading = false
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        setDisable(row){
            let params = {
                noticeid: row.idx,
                s_username: this.$store.getters.name
            }
            setNotifyDisabled(params).then(res => {
                if(res.code === '00000'){
                    this.$notify({
                        title: '成功',
                        message: '设置过期成功',
                        type: 'success',
                        duration: 2 * 1000
                    })
                    this.getList()
                }
            })
        }
    }
}
</script>

<style lang="css">
</style>
