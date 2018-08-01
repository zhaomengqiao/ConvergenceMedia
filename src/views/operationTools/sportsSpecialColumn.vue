<template lang="html">
    <section class="sportsSpecialColumn">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="菜单名称" style="margin-bottom: 0">
                        <el-input v-model.trim="form.menuName" placeholder="请输入菜单名称"></el-input>
                    </el-form-item>
                    <el-form-item label="打开方式" style="margin-bottom: 0">
                        <el-select v-model="form.openWay" class="select-platform"
                            filterable placeholder="请选择打开方式">
                            <el-option
                                v-for="(item,index) in openWays"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单图标" style="margin-bottom: 0">
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
                    <el-form-item label="打开参数" style="margin-bottom: 0">
                        <el-input v-model.trim="form.openParam" placeholder="请输入菜单名称" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0">
                        <el-button type="primary" @click="addSpecialColumn" :loading="addLoading">{{ addType == 'add' ? '新增' : '编辑' }}</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0">
                        <el-button type="primary" @click="resetForm">清空</el-button>
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
                <el-table-column label="图标" width="50" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <div class="table_icon">
                            <img :src="scope.row.menuicon" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="菜单名称" prop="menuname" min-width="150" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="当前状态" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.stat | getStatusColor">{{ scope.row.stat | getStatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="打开方式" width="130" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.openmode | getOpenWay }}
                    </template>
                </el-table-column>
                <el-table-column label="打开参数" prop="parameter" min-width="220" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="操作" width="220" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editItem(scope.row)" v-if="scope.row.stat!=-1">编辑</el-button>
                        <el-button type="primary" @click="startItem(scope.row)" v-if="scope.row.stat==0">启用</el-button>
                        <el-button type="primary" @click="stopItem(scope.row)" v-if="scope.row.stat==1">停用</el-button>
                        <el-button type="danger" @click="delItem(scope.row)" v-if="scope.row.stat==0">删除</el-button>
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
    getfileUpload,
    getSportsSpecialColumns,
    addSportsSpecialColumn,
    editSportsSpecialColumn,
    changeSportsSpecialColumn
} from '@/api/operationTools'

export default {
    data() {
        return {
            fileUpload: '',
            addType: 'add',
            logoLoading: false,
            addLoading: false,
            openWays: [
                {
                    label: '应用内打开',
                    value: '1'
                },
                {
                    label: 'H5打开',
                    value: '2'
                },
                {
                    label: '手机H5打开',
                    value: '3'
                }
            ],
            form: {
                menuName: '',
                openWay: '1',
                logo: '',
                openParam: ''
            },
            tableData: [],
            listLoading: false,
            total: 0,
            currentPage: 1,
            pageSize: 10
        }
    },
    filters: {
        getStatusColor(val) {
            switch (Number(val)) {
                case -1:
                    return 'info'
                    break;
                case 0:
                    return 'danger'
                    break;
                case 1:
                    return 'success'
                    break;
                default:
                    return ''
            }
        },
        getStatus(val) {
            switch (Number(val)) {
                case -1:
                    return '已删除'
                    break;
                case 0:
                    return '停用'
                    break;
                case 1:
                    return '生效中'
                    break;
                default:
                    return ''
            }
        },
        getOpenWay(val) {
            switch (Number(val)) {
                case 1:
                    return '应用内打开'
                    break;
                case 2:
                    return 'H5打开'
                    break;
                case 3:
                    return '手机H5打开'
                    break;
                default:
                    return ''
            }
        }
    },
    mounted() {
        this.fileUpload = getfileUpload
        this.getList()
    },
    methods: {
        getList() {
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            this.listLoading = true
            getSportsSpecialColumns(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
                this.listLoading = false
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
            var _this = this
            let width = 40
            let img = new Image()
            img.src = res.url
            let rw, rh, rate
            function loadImgFun() {
                let loadImg = new Promise((resolve, reject) => {
                    img.onload = () => {
                        rw = img.width
                        rh = img.height
                        rate = rw / rh
                        if (rw < width || rate != 1) {
                            _this.$message({
                                type: 'warning',
                                message: '不得小于40 * 40，必须是正方形（长宽比必须是1:1）'
                            })
                        } else {
                            _this.form.logo = res.url
                        }
                        resolve()
                    }
                })
                return loadImg
            }
            loadImgFun()
            loadImgFun().then(() => {
                this.logoLoading = false
            })
        },
        addSpecialColumn() {
            if(this.form.menuName == '') {
                this.$message({
                    message: '请填写菜单名称',
                    type: 'warning'
                });
                return false
            }
            if(this.form.openWay == '') {
                this.$message({
                    message: '请选择打开方式',
                    type: 'warning'
                });
                return false
            }
            if(this.form.logo == '') {
                this.$message({
                    message: '请选择菜单图标',
                    type: 'warning'
                });
                return false
            }
            if(this.form.openParam == '') {
                this.$message({
                    message: '请选择打开参数',
                    type: 'warning'
                });
                return false
            }
            let params = {
                menuname: this.form.menuName,
                parameter: this.form.openParam,
                openmode: this.form.openWay,
                menuicon: this.form.logo
            }
            if(this.addType === 'add') {
                addSportsSpecialColumn(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '新增成功',
                            type: 'success'
                        })
                        this.getList()
                        this.resetForm()
                    }
                })
            }else{
                params.idx = this.form.id
                editSportsSpecialColumn(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '修改 成功',
                            type: 'success'
                        })
                        this.getList()
                        this.resetForm()
                    }
                })
            }
        },
        resetForm() {
            this.addType = 'add'
            this.form.id = ''
            this.form.menuName = ''
            this.form.openParam = ''
            this.form.openWay = '1'
            this.form.logo = ''
        },
        editItem(row) {
            this.addType = 'edit'
            this.form.id = row.idx
            this.form.menuName = row.menuname
            this.form.openParam = row.parameter
            this.form.openWay = row.openmode.toString()
            this.form.logo = row.menuicon
        },
        startItem(row) {
            let params = {
                idx: row.idx,
                stat: 1
            }
            editSportsSpecialColumn(params).then(res => {
                if(res.code === '00001'){
                    this.$notify({
                        title: '成功',
                        message: '启动成功',
                        type: 'success'
                    })
                    this.getList()
                    this.resetForm()
                }
            })
        },
        stopItem(row) {
            let params = {
                idx: row.idx,
                stat: 0
            }
            editSportsSpecialColumn(params).then(res => {
                if(res.code === '00001'){
                    this.$notify({
                        title: '成功',
                        message: '停用成功',
                        type: 'success'
                    })
                    this.getList()
                    this.resetForm()
                }
            })
        },
        delItem(row) {
            this.$confirm('确认删除吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let params = {
                    idx: row.idx,
                    stat: -1
                }
                editSportsSpecialColumn(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '停用成功',
                            type: 'success'
                        })
                        this.getList()
                        this.resetForm()
                    }
                })
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
.table_icon{
    width: 20px;
    height: 20px;
    img{
        width: 100%;
        height: 100%;
    }
}
</style>
