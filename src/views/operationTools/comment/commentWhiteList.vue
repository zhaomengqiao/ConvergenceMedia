<template lang="html">
    <section class="comment_whiteList">
        <el-card>
            <!--当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 <el-form> 标签上添加 @submit.native.prevent-->
            <el-form :inline="true" :model="formData" @submit.native.prevent>
                <el-row>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="formData.url" placeholder="请输入文章URL" @keyup.enter.native="getList" style="width:340px;"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="addData" :loading="btnLoading.add">添加</el-button>
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
                    <el-table-column label="新闻标题" min-width="220">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" class="aclick" target="_blank">{{ scope.row.title }} </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="添加时间" width="170" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>
                                {{ parseInt(scope.row.dateline) | parseTime('{y}-{m}-{d} {h}:{i}') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="adduser" label="添加人" width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注信息" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small"
                                       @click="delData(scope.row)">移除</el-button>
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
    mapGetters
} from 'vuex';
import {
    getCommentWhiteList,
    addCommentWhiteList,
    delCommentWhiteList
} from '@/api/operationTools'

export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            formData: {
                url: ''
            },
            tableData: [],
            total: 0,
            listLoading: false,
            currentPage: 1,
            pageSize: 10,
            btnLoading: {
                add: false
            }
        }
    },
    mounted(){
        this.pageSize = this.personalConfig.tableRowShow
    },
    methods: {
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList(){
            let params = {
                url: this.formData.url,
                page: this.currentPage,
                pagesize: this.pageSize
            }
            this.listLoading = true
            getCommentWhiteList(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.count
                }
                this.listLoading = false
            })
        },
        delData(){
            this.$confirm('是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    url: this.formData.url
                }
                delCommentWhiteList(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getList()
                    }
                })
            }).catch(() => {

            })
        },
        addData() {
            this.$prompt('请输入备注（选填）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                let params = {
                    url: this.formData.url,
                    remark: value
                }
                this.btnLoading.add = true
                let time = setTimeout(() => {
                    this.btnLoading.add = false
                },3000)
                addCommentWhiteList(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '新增成功',
                            type: 'success'
                        })
                        this.getList()
                        this.formData.url = ''
                    }
                    this.btnLoading.add = false
                    clearTimeout(time)
                })
            }).catch(() => {

            })
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    &:hover {
        color: #58B7FF;
    }
}
</style>
