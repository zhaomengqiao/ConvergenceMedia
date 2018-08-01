<template lang="html">
    <section class="gameBox">
        <el-row :gutter="10">
            <el-col :span="10">
                <el-card>
                    <div class="controlWrap">
                        <el-form :inline="true" :model="classForm" @submit.native.prevent>
                            <el-row>
                                <el-form-item label="应用类型" style="margin-bottom:0">
                                    <el-input v-model.trim="classForm.name" placeholder="请填写应用类型"></el-input>
                                </el-form-item>
                                <el-form-item label="排序" style="margin-bottom:0" v-if="classStatus != 'add'">
                                    <el-input-number v-model="classForm.sortNum" :min="1"></el-input-number>
                                </el-form-item>
                                <el-form-item style="margin-bottom:0">
                                    <el-button type="primary" @click="addGameClass">{{ classStatus=='add' ? '新增':'保存' }}</el-button>
                                </el-form-item>
                                <el-form-item style="margin-bottom:0">
                                    <el-button type="primary" @click="resetClass">清空</el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="tableWrap">
                        <el-table :data="classTableData"
                            highlight-current-row
                            v-loading="classLoading"
                            style="width: 100%;"
                            tooltip-effect="dark"
                            @row-click="getGamesByClass"
                            stripe border>
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column prop="title" label="类型" min-width="100" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column prop="" label="状态" width="84" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-tag :type="scope.row.state == 0 ? 'success' : 'danger'">
                                        {{ scope.row.state | getClassStatus }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="gameCount" label="应用个数" width="80" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="操作" width="196">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="editClass(scope.row)">编辑</el-button>
                                    <el-button type="primary" @click="startClass(scope.row)" v-if="scope.row.state == 0">启用</el-button>
                                    <el-button type="primary" @click="stopClass(scope.row)" v-if="scope.row.state == 1">停用</el-button>
                                    <el-button type="danger" @click="removeClass(scope.row)" v-if="scope.row.state == 0">移除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row class="toolbar">
                            <el-pagination
                                @current-change="handleClassCurrentChange"
                                @size-change="handleClassSizeChange"
                                layout="total, sizes, prev, pager, next, jumper"
                                :page-sizes="[10, 15, 20, 50, 100]"
                                :page-size="classPagination.pageSize"
                                :current-page="classPagination.currentPage"
                                :total="classPagination.total"
                                background
                                style="float:right;">
                            </el-pagination>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-card>
                    <div class="controlWrap">
                        <el-form :inline="true" :model="classForm">
                            <el-row>
                                <el-form-item label="应用名称">
                                    <el-input v-model.trim="gameForm.name" placeholder="请填写应用类型"></el-input>
                                </el-form-item>
                                <el-form-item label="APPID">
                                    <el-input v-model.trim="gameForm.appid" placeholder="APPID"></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row>
                                <el-form-item label="排序">
                                    <el-input-number v-model="gameForm.sortNum" :min="1"></el-input-number>
                                </el-form-item>
                                <el-form-item label="下载数">
                                    <el-input-number v-model="gameForm.download" :min="0"></el-input-number>
                                </el-form-item>
                                <el-form-item label="描述">
                                    <el-input v-model.trim="gameForm.description" placeholder="请填写描述"></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row>
                                <el-form-item label="ICON上传" style="margin-bottom:0">
                                    <el-upload
                                        class="icon-uploader"
                                        :action="fileUpload"
                                        :show-file-list="false"
                                        :on-success="handleIconSuccess"
                                        :before-upload="beforeIconUpload"
                                        v-loading='iconLoading'>
                                        <img v-if="gameForm.icon" :src="gameForm.icon" class="icon-upload">
                                        <i v-else class="el-icon-plus icon-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item label="Banner上传" style="margin-bottom:0">
                                    <el-upload
                                        class="banner-uploader"
                                        :action="fileUpload"
                                        :show-file-list="false"
                                        :on-success="handleBannerSuccess"
                                        :before-upload="beforeBannerUpload"
                                        v-loading='bannerLoading'>
                                        <img v-if="gameForm.banner" :src="gameForm.banner" class="banner-upload">
                                        <i v-else class="el-icon-plus banner-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item style="margin-bottom:0">
                                    <el-button type="primary" @click="addGames">{{ gameStatus=='add' ? '新增':'保存' }}</el-button>
                                </el-form-item>
                                <el-form-item style="margin-bottom:0">
                                    <el-button type="primary" @click="resetGame">清空</el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="tableWrap">
                        <el-table :data="gameTableData"
                            highlight-current-row
                            v-loading="gameLoading"
                            style="width: 100%;"
                            tooltip-effect="dark"
                            empty-text="点击左侧「类型」获取相应游戏"
                            stripe border>
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column prop="title" label="应用" min-width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>({{ scope.row.player }}) {{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="description" label="描述" min-width="120" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column prop="" label="推荐/置顶" width="120" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.state | getGameTopStatus }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="状态" width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.state | getGameStatus }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="图标" width="60" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <img :src="scope.row.icon" v-preview="scope.row.icon" style="width:20px;height:20px;">
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="336">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="editGame(scope.row)">编辑</el-button>
                                    <el-button type="primary" @click="startGame(scope.row)" v-if="scope.row.state == 1">启用</el-button>
                                    <el-button type="primary" @click="stopGame(scope.row)" v-if="scope.row.state !== 1">停用</el-button>
                                    <el-button type="danger" @click="removeGame(scope.row)" v-if="scope.row.state == 1">移除</el-button>
                                    <el-button type="primary" @click="setTop(scope.row)" v-if="scope.row.state !== 1">设为置顶</el-button>
                                    <el-button type="primary" @click="setNew(scope.row)" v-if="scope.row.state !== 1">设为最新</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row class="toolbar">
                            <el-pagination
                                @current-change="handleGameCurrentChange"
                                @size-change="handleGameSizeChange"
                                layout="total, sizes, prev, pager, next, jumper"
                                :page-sizes="[10, 15, 20, 50, 100]"
                                :page-size="gamePagination.pageSize"
                                :current-page="gamePagination.currentPage"
                                :total="gamePagination.total"
                                background
                                style="float:right;">
                            </el-pagination>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import {
    getfileAbsoluteUpload
} from '@/api/operationTools'
import {
    getGameClassList,
    addGameClass,
    removeGameClass,
    updateGameClass,
    getGamesByClass,
    addGame,
    updateGame,
    deleteGame,
    setTopGame,
    setNewsGame
} from '@/api/operationTools'

export default {
    data() {
        return {
            iconLoading: false,
            bannerLoading: false,
            fileUpload: '',
            classStatus: 'add',
            classForm: {
                name: '',
                sortNum: ''
            },
            // 获取游戏
            classId: '',
            // 编辑
            nowClassId: '',
            gameStatus: 'add',
            gameForm: {
                name: '',
                appid: '',
                sortNum: '',
                download: '',
                icon: '',
                banner: '',
                description: ''
            },
            nowGameId: '',
            classTableData: [],
            classLoading: false,
            classPagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            gameTableData: [],
            gameLoading: false,
            gamePagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    mounted(){
        this.fileUpload = getfileAbsoluteUpload;
        this.getClassList()
    },
    filters: {
        getClassStatus(val) {
            switch (Number(val)) {
                case 0:
                    return '启用'
                    break;
                case 1:
                    return '停用'
                    break;
                default:
                    return '停用'
            }
        },
        getGameStatus(val) {
            switch (Number(val)) {
                case 0:
                    return '启用'
                    break;
                case 1:
                    return '停用'
                    break;
                case 2:
                    return '启用'
                    break;
                case 3:
                    return '启用'
                    break;
                default:
                    return '停用'
            }
        },
        getGameTopStatus(val) {
            switch (Number(val)) {
                case 0:
                    return '无操作'
                    break;
                case 1:
                    return '无操作'
                    break;
                case 2:
                    return '置顶'
                    break;
                case 3:
                    return '最新'
                    break;
                default:
                    return '无操作'
            }
        }
    },
    methods: {
        getClassList() {
            let params = {
                pageNum: this.classPagination.currentPage - 1,
                pageSize: this.classPagination.pageSize,
                states: '0,1'
            }
            this.classLoading = true
            getGameClassList(params).then(res => {
                if(res.stat === 200){
                    this.classTableData = res.data.list
                    this.classPagination.total = res.data.total
                }else{
                    this.classTableData = []
                    this.classPagination.total = 0
                }
                this.classLoading = false
            })
        },
        addGameClass(row) {
            if(!this.classForm.name) {
                this.$message({
                    type: 'warning',
                    message: '请填写类型名称'
                })
                return
            }
            if(this.classStatus === 'add') {
                let params = {
                    title: this.classForm.name
                }
                addGameClass(params).then(res => {
                    if(res.stat === 200){
                        this.$notify({
                            title: '成功',
                            message: '新增类型成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.resetClass()
                        this.getClassList()
                    }
                })
            }else{
                let params = {
                    id: this.nowClassId,
                    sort: this.classForm.sortNum,
                    title: this.classForm.name
                }
                updateGameClass(params).then(res => {
                    if(res.stat === 200){
                        this.$notify({
                            title: '成功',
                            message: '修改类型成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.resetClass()
                        this.getClassList()
                    }
                })
            }
        },
        editClass(row) {
            this.classStatus = 'edit'
            this.nowClassId = row.id
            this.classForm.name = row.title
            this.classForm.sortNum = row.sort
        },
        startClass(row) {
            let temp = Object.assign({}, row)
            temp.state = 0
            updateGameClass(temp).then(res => {
                if(res.stat === 200){
                    this.$notify({
                        title: '成功',
                        message: '启用成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getClassList()
                }
            })
        },
        stopClass(row) {
            let temp = Object.assign({}, row)
            temp.state = 1
            updateGameClass(temp).then(res => {
                if(res.stat === 200){
                    this.$notify({
                        title: '成功',
                        message: '停用成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getClassList()
                }
            })
        },
        resetClass(){
            this.nowClassId = ''
            this.classForm.name = ''
            this.classForm.sortNum = ''
            this.classStatus = 'add'
        },
        removeClass(row) {
            this.$confirm('确定要删除这条类型吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let params = {
                    id: row.id
                }
                removeGameClass(params).then(res => {
                    if(res.stat === 200) {
                        this.$notify({
                            title: '成功',
                            message: '删除类型成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getClassList()
                    }
                })
            }).catch(() => {

            })
        },
        handleClassCurrentChange(val) {
            this.classPagination.currentPage = val
            this.getClassList()
        },
        handleClassSizeChange(val) {
            this.classPagination.pageSize = val
            this.getClassList()
        },
        handleGameCurrentChange(val) {
            this.gamePagination.currentPage = val
            this.getGamesByClass()
        },
        handleGameSizeChange(val) {
            this.gamePagination.pageSize = val
            this.getGamesByClass()
        },
        beforeIconUpload(file) {
            let fileType = file.type
            if (fileType != 'image/jpeg' && fileType != 'image/png' && fileType != 'image/gif') {
                this.$message({
                    message: '请上传 jpg/png/gif 图片',
                    type: 'warning'
                });
                return false
            }
            this.iconLoading = true
        },
        beforeBannerUpload(file) {
            let fileType = file.type
            if (fileType != 'image/jpeg' && fileType != 'image/png' && fileType != 'image/gif') {
                this.$message({
                    message: '请上传 jpg/png/gif 图片',
                    type: 'warning'
                });
                return false
            }
            this.bannerLoading = true
        },
        // 上传图片
        handleIconSuccess(res, file) {
            this.gameForm.icon = res.url
            this.iconLoading = false
        },
        handleBannerSuccess(res, file) {
            this.gameForm.banner = res.url
            this.bannerLoading = false
        },
        getGamesByClass(row) {
            if(row){
                this.classId = row.id
            }
            let params = {
                typeId: this.classId,
                pageNum: this.gamePagination.currentPage - 1,
                pageSize: this.gamePagination.pageSize,
                states: '0,1'
            }
            this.gameLoading = false
            getGamesByClass(params).then(res => {
                if(res.stat === 200){
                    if(res.stat === 200){
                        this.gameTableData = res.data.list
                        this.gamePagination.total = res.data.total
                    }else{
                        this.gameTableData = []
                        this.gamePagination.total = 0
                    }
                    this.gameLoading = false
                }
            })
        },
        addGames() {
            if(!this.classId) {
                this.$message({
                    type: 'warning',
                    message: '请选分类'
                })
                return
            }
            if(!this.gameForm.name) {
                this.$message({
                    type: 'warning',
                    message: '请填写游戏名称'
                })
                return
            }
            if(!this.gameForm.appid) {
                this.$message({
                    type: 'warning',
                    message: '请填写appid'
                })
                return
            }
            if(this.gameStatus === 'add'){
                let params = {
                    bannerIcon: this.gameForm.banner,
                    icon: this.gameForm.icon,
                    link: this.gameForm.appid,
                    player: this.gameForm.download?this.gameForm.download:0,
                    priority: this.gameForm.sortNum?this.gameForm.sortNum:0,
                    title: this.gameForm.name,
                    typeId: this.classId,
                    description: this.gameForm.description
                }
                addGame(params).then(res => {
                    if(res.stat === 200) {
                        this.$notify({
                            title: '成功',
                            message: '添加游戏成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.resetGame()
                        this.getGamesByClass()
                    }
                })
            }else {
                let params = {
                    bannerIcon: this.gameForm.banner,
                    icon: this.gameForm.icon,
                    link: this.gameForm.appid,
                    player: this.gameForm.download?this.gameForm.download:0,
                    priority: this.gameForm.sortNum?this.gameForm.sortNum:0,
                    title: this.gameForm.name,
                    typeId: this.classId,
                    id: this.nowGameId,
                    description: this.gameForm.description
                }
                updateGame(params).then(res => {
                    if(res.stat === 200) {
                        this.$notify({
                            title: '成功',
                            message: '编辑游戏成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.resetGame()
                        this.getGamesByClass()
                    }
                })
            }
        },
        resetGame() {
            this.classStatus = 'add'
            this.nowGameId = ''
            this.gameForm.name = ''
            this.gameForm.appid = ''
            this.gameForm.sortNum = ''
            this.gameForm.download = ''
            this.gameForm.icon = ''
            this.gameForm.banner = ''
            this.gameForm.description = ''
        },
        editGame(row) {
            this.gameStatus = 'edit'
            this.nowGameId = row.id
            this.gameForm.name = row.title
            this.gameForm.appid = row.link
            this.gameForm.sortNum = row.priority
            this.gameForm.download = row.player
            this.gameForm.icon = row.icon
            this.gameForm.banner = row.bannerIcon
            this.gameForm.description = row.description
        },
        startGame(row) {
            let temp = Object.assign({}, row)
            temp.state = 0
            updateGame(temp).then(res => {
                if(res.stat === 200){
                    this.$notify({
                        title: '成功',
                        message: '启用成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getGamesByClass()
                }
            })
        },
        stopGame(row) {
            let temp = Object.assign({}, row)
            temp.state = 1
            updateGame(temp).then(res => {
                if(res.stat === 200){
                    this.$notify({
                        title: '成功',
                        message: '停用成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getGamesByClass()
                }
            })
        },
        removeGame(row) {
            this.$confirm('确定要删除这条类型吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let params = {
                    id: row.id
                }
                deleteGame(params).then(res => {
                    if(res.stat === 200) {
                        this.$notify({
                            title: '成功',
                            message: '删除游戏成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getGamesByClass()
                    }
                })
            }).catch(() => {

            })
        },
        setTop(row) {
            let params = {
                id: row.id,
                rank: 1
            }
            setTopGame(params).then(res => {
                if(res.stat === 200) {
                    this.$notify({
                        title: '成功',
                        message: '设为置顶成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getGamesByClass()
                }
            })
        },
        setNew(row) {
            let params = {
                id: row.id,
                rank: 1
            }
            setNewsGame(params).then(res => {
                if(res.stat === 200) {
                    this.$notify({
                        title: '成功',
                        message: '设为最新成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getGamesByClass()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.controlWrap{
    margin-bottom: 20px;
}
</style>
