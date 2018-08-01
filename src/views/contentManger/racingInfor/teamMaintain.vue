<template lang="html">
    <section class="teamMaintain">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="队伍全称" style="margin-bottom: 0">
                        <el-input v-model.trim="form.teamFullname" placeholder="请输入队伍全称"></el-input>
                    </el-form-item>
                    <el-form-item label="队伍简称" style="margin-bottom: 0">
                        <el-input v-model.trim="form.teamNickname" placeholder="请输入队伍简称"></el-input>
                    </el-form-item>
                    <el-form-item label="赛事类型" style="margin-bottom: 0">
                        <el-cascader
                            v-model="form.type"
                            :options="racingType"
                            :props="props">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="赛事LOGO" style="margin-bottom: 0">
                        <el-upload
                            class="icon-uploader"
                            :action="fileUpload"
                            :show-file-list="false"
                            :on-success="handleIconSuccess"
                            :before-upload="beforeIconUpload"
                            v-loading='logoLoading'>
                            <img v-if="form.logo" :src="form.logo" class="icon-upload">
                            <i v-else class="el-icon-plus icon-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0">
                        <el-button type="primary" @click="addTeam" :loading="addLoading">{{ addType == 'add' ? '新增' : '编辑' }}</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0">
                        <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-table :data="tableData"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border>
                  <el-table-column prop="teamfullname" label="队伍全名" min-width="220" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column prop="teamsimplename" label="队伍简称" min-width="220" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column label="类型" width="170" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <span>{{ scope.row.teammaintype }} / {{ scope.row.teamsubtype }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="teammember" label="人员信息" width="100" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column label="操作" width="120" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <el-button type="primary" @click="editTeam(scope.row)">编辑</el-button>
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
    getfileUpload
} from '@/api/operationTools'
import {
    getRacingType,
    getTeamList,
    teamAdd,
    teamEdit
} from '@/api/contentManage'
export default {
    data() {
        return {
            addType: 'add',
            addLoading: false,
            logoLoading: false,
            fileUpload: '',
            form: {
                teamFullname: '',
                teamNickname: '',
                logo: '',
                id: ''
            },
            racingType: [],
            props: {
                value: 'typeName',
                label: 'typeName'
            },
            tableData: [],
            total: 0,
            listLoading: false,
            currentPage: 1,
            pageSize: 10,
        }
    },
    mounted() {
        this.fileUpload = getfileUpload
        this.getType()
    },
    methods: {
        getType() {
            getRacingType().then(res => {
                let data = res.data
                // level 1
                let level1Arr = data.filter(item => {
                    return item.level == 1
                })
                // level 2
                let level2Arr = data.filter(item => {
                    return item.level == 2
                })
                level1Arr.forEach(item => {
                    item.children = []
                })
                level2Arr.forEach(lv2 => {
                    level1Arr.forEach(lv1 => {
                        if(lv2.parentId === lv1.typeId) {
                            lv1.children.push(lv2)
                        }
                    })
                })
                this.racingType = level1Arr
            })
        },
        beforeIconUpload(file) {
            let fileType = file.type
            if (fileType != 'image/jpeg' && fileType != 'image/png') {
                this.$message({
                    message: '请上传 jpg/png 图片',
                    type: 'warning'
                });
                return false
            }
            this.logoLoading = true
        },
        handleIconSuccess(res, file) {
            this.form.logo = res.url
            this.logoLoading = false
        },
        addTeam() {
            let params = {
                teamfullname: this.form.teamFullname,
                teamsimplename: this.form.teamNickname,
                teammember: 0,
                teammaintype: this.form.type[0],
                teamsubtype: this.form.type[1],
                teamlogpic: this.form.logo
            }
            this.addLoading = true
            if(this.addType === 'add') {
                teamAdd(params).then(res => {
                    if(res.code === '00001') {
                        this.$notify({
                            title: '成功',
                            message: '新增成功',
                            type: 'success'
                        })
                        this.getList()
                        this.resetForm()
                    }
                    this.addLoading = false
                })
            }else{
                params.id = this.form.id
                teamEdit(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
                        })
                        this.getList()
                        this.resetForm()
                    }
                    this.addLoading = false
                })
            }

        },
        resetForm() {
            this.addType = 'add'
            this.form.teamFullname = ''
            this.form.teamNickname = ''
            this.form.type = []
            this.form.logo = ''
            this.form.id = ''
        },
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            let params = {
                teamfullname: this.form.teamFullname,
                teamsimplename: this.form.teamNickname,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            this.listLoading = true
            getTeamList(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
                this.listLoading = false
            })
        },
        editTeam(row) {
            this.addType = 'edit'
            this.form.teamFullname = row.teamfullname
            this.form.teamNickname = row.teamsimplename
            this.form.type = []
            this.form.type.push(row.teammaintype)
            this.form.type.push(row.teamsubtype)
            this.form.logo = row.teamlogpic
            this.form.id = row.id
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

<style lang="css">
</style>
