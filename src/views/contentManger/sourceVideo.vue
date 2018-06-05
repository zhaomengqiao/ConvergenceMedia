<template lang="html">
    <section class="sourceVideo">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item  style="margin-bottom:0">
                        <el-input v-model="form.username" placeholder="请输入用户名查询"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="getList">查询</el-button>
                    </el-form-item>
                    <el-form-item  style="margin-bottom:0">
                        <el-input v-model="form.rowkey" placeholder="请输入单挑rowkey进行加黑" style="width:240px"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="addblackByRowkey" :loading="rowkeyLoading">加黑</el-button>
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
                    <el-table-column label="用户名" width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ nowUserName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="渠道" prop="key" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column width="160">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="addblack(scope.row,scope.$index)">加黑所有新闻</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <!-- <el-row class="toolbar">
                <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-sizes="[10, 15, 20, 50, 100]"
                  :page-size="pageSize"
                  :current-page="currentPage"
                  :total="total"
                  style="float:right;"
                  >
                </el-pagination>
            </el-row> -->
        </el-card>
    </section>
</template>

<script>
import {
    getSourceVideo,
    addBlackSourceVideo,
    addBlackSourceVideoByRowkey
} from '@/api/contentManage'

export default {
    name: 'sourceVideo',
    data() {
        return {
            tableData: [],
            listLoading: false,
            form: {
                username: '',
                rowkey: ''
            },
            nowUserName: '',
            rowkeyLoading: false
            // pageSize: 10,
            // currentPage: 1,
            // total: 0
        }
    },
    methods: {
        getList() {
            let params = {
                username: this.form.username
            }
            this.listLoading = true
            getSourceVideo(params).then(res => {
                if (res.code == "00001") {
                    this.tableData = res.data
                    this.nowUserName = this.form.username
                }
                this.listLoading = false
            })
        },
        addblack(row, index) {
            this.$prompt('请输入邮箱', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: '邮箱格式不正确'
            }).then(({
                value
            }) => {
                this.tableData.splice(index, 1)
                let params = {
                    userid: row.value,
                    mail: value
                }
                addBlackSourceVideo(params).then(res => {

                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        addblackByRowkey() {
            if (this.form.rowkey === '') {
                this.$message({
                    type: 'warning',
                    message: '请填写rowkey'
                });
                return false
            }
            let params = {
                rowkey: this.form.rowkey
            }
            this.rowkeyLoading = true
            addBlackSourceVideoByRowkey(params).then(res => {
                if (res.code == "00001") {
                    this.form.rowkey = ''
                    this.$notify({
                        title: '成功',
                        message: '加黑成功',
                        type: 'success'
                    });
                }
                this.rowkeyLoading = false
            })
        }
    }
}
</script>

<style lang="css">
</style>
