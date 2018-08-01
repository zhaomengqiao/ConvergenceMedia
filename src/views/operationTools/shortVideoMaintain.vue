<template lang="html">
    <section class="shortVideoMaintain">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-form-item style="margin-bottom:0">
                    <el-input placeholder="请输入内容" v-model="form.text" class="input-with-select">
                        <el-select v-model="form.select" slot="prepend" placeholder="请选择" style="width:100px;">
                            <el-option label="用户名" value="username"></el-option>
                            <el-option label="小视频rowkey" value="rowkey"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row :gutter="10" class="mt-10">
            <el-col :span="12">
                <el-card>
                    <el-table :data="tableData"
                        highlight-current-row
                        v-loading="listLoading"
                        style="width: 100%;"
                        tooltip-effect="dark"
                        stripe border
                        v-loadmore="getUserList"
                        :key="tableKey"
                        :height="tableHeight">
                        <el-table-column label="用户名" width="140" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ JSON.parse(scope.row.value).username }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="用户ID" width="140" prop="userid" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ JSON.parse(scope.row.value).userid }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="渠道" min-width="140" prop="userid" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ JSON.parse(scope.row.value).ufr }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" @click="getVideoByUserid(scope.row,'search')">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <el-table :data="videoTableData"
                        highlight-current-row
                        v-loading="videoLoading"
                        style="width: 100%;"
                        tooltip-effect="dark"
                        stripe border
                        v-loadmore="getVideoByUserid"
                        :key="tableKey"
                        :height="tableHeight">
                        <el-table-column label="视频名称" min-width="200" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.title }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="时长" width="140" prop="userid" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.videoalltime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="addblack(scope.row)">加黑</el-button>
                                <el-button type="primary" @click="previewVideo(scope.row)">预览</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="视频展示" :visible.sync="replyFormVisible" :close-on-click-modal="false">
            <video-player :options="playerOptions" ref="videoPlayer"></video-player>
		</el-dialog>
    </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import {
    getShortVideoByRowkey,
    getShortVideoByUsername,
    getShortVideoByUserId,
    addBlackShortVideoByRowkey
} from '@/api/operationTools'
import loadmore from '@/directive/loadMore'

export default {
    components: {
        videoPlayer
    },
    directives: {
        loadmore
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    data() {
        return {
            nowKey: '',
            form: {
                text: '',
                select: 'username'
            },
            tableData: [],
            videoTableData: [],
            videoLoading: false,
            tableHeight: 400,
            tableKey: 0,
            listLoading: false,
            userPage: 1,
            videoPage: 1,
            replyFormVisible: false,
            playerOptions: {
                width: '600',
                height: '450',
                autoplay: false,
                language: 'zh-CN',
                controls: true, //播放控制条是否显示
                preload: true, //是否预加载
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    // mp4
                    src: ""
                }]
            }
        }
    },
    mounted() {
        if(document.body.clientHeight>700){
            this.tableHeight = 700
            this.tableKey += 1
        }else if(document.body.clientHeight > 500 && document.body.clientHeight < 700){
            this.tableHeight = 380
            this.tableKey += 1
        }else{
            this.tableHeight = 400
            this.tableKey += 1
        }
    },
    methods: {
        search() {
            if(this.form.select === 'username'){
                this.getUserList('search')
            }else if(this.form.select === 'rowkey'){
                this.getShortVideoByRowkey()
            }
        },
        getUserList(type) {
            if(type === 'search') {
                this.userPage = 1
                this.tableData = []
            }
            let params = {
                username: this.form.text,
                page: this.userPage
            }
            this.listLoading = true
            getShortVideoByUsername(params).then(res => {
                if(res.code === '00001'){
                    if(!res.data){
                        this.$message({
                            showClose: true,
                            message: '暂无更多数据',
                            type: 'warning'
                        })
                    }else{
                        this.userPage += 1
                        this.tableData = this.tableData.concat(res.data);
                    }
                }
                this.listLoading = false
            })
        },
        // 通过rowkey查视频
        getShortVideoByRowkey() {
            let params = {
                rowkey: this.form.text
            }
            getShortVideoByRowkey(params).then(res => {
                if(res.code === '00001') {
                    this.videoTableData = [res.data]
                }
            })
        },
        getVideoByUserid(row,type) {
            if(type === 'search'){
                if(row){
                    this.nowKey = row.key
                }
                this.videoPage = 0
                this.videoTableData = []
            }
            if(this.form.select === 'username'){
                let params = {
                    userid: row ? row.key : this.nowKey,
                    page: this.videoPage
                }
                getShortVideoByUserId(params).then(res => {
                    if(res.code === '00001'){
                        if(!res.data){
                            this.$message({
                                showClose: true,
                                message: '暂无更多数据',
                                type: 'warning'
                            })
                        }else{
                            this.videoPage += 1
                            this.videoTableData = this.videoTableData.concat(res.data);
                        }
                    }
                })
            }
        },
        addblack(row) {
            let params = {
                rowkey: row.rowkey
            }
            this.$confirm('确认要加黑这条视频吗?', '提示', {
                type: 'warning'
            }).then(() => {
                addBlackShortVideoByRowkey(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '加黑成功',
                            type: 'success'
                        })
                        this.getVideoByUserid('','search')
                    }
                })
            })
        },
        previewVideo(row) {
            this.playerOptions.sources[0].src = ''
            this.playerOptions.sources[0].src = JSON.parse(row.videojs)[0].src
            this.replyFormVisible = true
        }
    }
}
</script>

<style lang="css">
</style>
