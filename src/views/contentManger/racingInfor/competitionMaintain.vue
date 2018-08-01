<template lang="html">
    <section class="competitionMaintain">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="赛事名称" style="margin-bottom: 0">
                        <el-input v-model.trim="form.racingName" placeholder="请输入赛事名称"></el-input>
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
                </el-row>
                <el-row>
                    <el-form-item label="二级标题" style="margin-bottom: 0">
                        <el-input v-model.trim="form.subtitle" placeholder="请输入二级标题"></el-input>
                    </el-form-item>
                    <el-form-item label="起止时间" style="margin-bottom: 0">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="form.time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0">
                        <el-button type="primary" @click="addRacing" :loading="addLoading">新增</el-button>
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
                  <el-table-column prop="name" label="赛事名称" min-width="220" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column prop="subtitle" label="二级标题" min-width="220" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column label="起止时间" width="300" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <span>{{ scope.row.starttime }} - {{ scope.row.endtime }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="类型" width="170" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <span>{{ scope.row.maintype }} / {{ scope.row.subtype }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="场次" width="120" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <span>
                              <span :class="scope.row.roundend == scope.row.roundtotal ? 'round_red':'round_green'">{{ scope.row.roundend }}</span> / {{ scope.row.roundtotal }}
                          </span>
                      </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <el-button type="primary"
                                     v-if="new Date(scope.row.endtime).getTime() > new Date().getTime()"
                                     @click="addAgenda(scope.row)">新增赛程</el-button>
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
    getRacingList,
    getRacingType,
    addRacing
} from '@/api/contentManage'

export default {
    data() {
        return {
            addLoading: false,
            logoLoading: false,
            fileUpload: '',
            racingType: [],
            form: {
                racingName: '',
                logo: '',
                time: '',
                type: [],
                subtitle: ''
            },
            tableData: [],
            listLoading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            props: {
                value: 'typeName',
                label: 'typeName'
            }
        }
    },
    mounted() {
        this.fileUpload = getfileUpload
        this.getType()
    },
    methods: {
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            if(this.form.time === ''){
                this.$message({
                    message: '请选择赛事起止时间',
                    type: 'warning'
                })
                return
            }
            let params = {
                name: this.form.racingName,
                startTime: this.form.time[0],
                endTime: this.form.time[1],
                createuser: '',
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            this.listLoading = true
            getRacingList(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
                this.listLoading = false
            })
        },
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
        addRacing() {
            if(this.form.racingName === ''){
                this.$message({
                    message: '请填写赛事名称',
                    type: 'warning'
                })
                return
            }
            if(this.form.time === ''){
                this.$message({
                    message: '请选择赛事起止时间',
                    type: 'warning'
                })
                return
            }
            if(this.form.type === []){
                this.$message({
                    message: '请选择赛事分类',
                    type: 'warning'
                })
                return
            }
            if(this.form.logo === ''){
                this.$message({
                    message: '请上传赛事logo',
                    type: 'warning'
                })
                return
            }
            let params = {
                name: this.form.racingName,
                maintype: this.form.type[0],
                subtype: this.form.type[1],
                logo: this.form.logo,
                starttime: this.form.time[0],
                endtime: this.form.time[1],
                subtitle: this.form.subtitle
            }
            this.addLoading = true
            addRacing(params).then(res => {
                if(res.code === '00001'){
                    this.$notify({
                        title: '成功',
                        message: '新增成功',
                        type: 'success'
                    })
                    this.resetForm()
                    this.getList()
                }
                this.addLoading = false
            })
        },
        resetForm() {
            this.form.racingName = ''
            this.form.logo = ''
        },
        beforeIconUpload(file) {
            let fileType = file.type
            let fileSize = file.size
            const isLt500K = file.size / 1024 < 500;
            if (fileType != 'image/jpeg' && fileType != 'image/png') {
                this.$message({
                    message: '请上传 jpg/png 图片',
                    type: 'warning'
                });
                return false
            }
            if (!isLt500K) {
                this.$message.error('上传icon大小不能超过 500KB!')
                return false
            }
            this.logoLoading = true
        },
        handleIconSuccess(res, file) {
            this.form.logo = res.url
            this.logoLoading = false
        },
        addAgenda(row) {
            this.$router.push({
                path: '/contentManage/racingInfor/agendaAdd',
                query: {
                    maintype: row.maintype,
                    subtype: row.subtype,
                    raceId: row.id
                }
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
.round_red{
    color: #F56C6C
}
.round_green{
    color: #67C23A
}
</style>
