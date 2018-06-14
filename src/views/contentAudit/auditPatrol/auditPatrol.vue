<template lang="html">
    <section class="auditPatrol">
    <el-card>
       <el-form :inline="true" :model="form">
            <el-row>
                <el-form-item label="审核时间">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.timeQuantum"
                        type="datetimerange"
                        placeholder="选择时间范围"
                        @change="getTopTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="巡查内容">
                    <el-select
                        v-model="form.type"
                        class="select-platform"
                        filterable
                        placeholder="placeholder">
                        <el-option
                            v-for="(item,index) in patrols"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="巡查条数">
                    <el-input-number v-model="form.num" :min="1" label="巡查条数"></el-input-number>
                </el-form-item>
            </el-row>
            <el-row class="mt-10">
                <el-form-item label="审核团队" style="margin-bottom:0">
                    <el-select
                        v-model="form.team"
                        class="select-platform"
                        filterable
                        @change="getAllAuditUser"
                        placeholder="审核团队">
                        <el-option
                            v-for="(item,index) in teams"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核人员：" style="margin-bottom:0">
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
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click="cancelPatrol">取消巡查</el-button>
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
            <el-table-column label="新闻类型" width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.newstype | newstype }}
                </template>
            </el-table-column>
            <el-table-column label="审核人" width="140" :show-overflow-tooltip="true" prop="audituser">
            </el-table-column>
            <el-table-column label="新闻标题" min-width="220">
                <template slot-scope="scope">
                    <span class="aclick" @click="showDialog(scope.row.url)">{{ scope.row.title }} </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                    <el-button type="primary" @click="pass(scope.row)" v-if="scope.row.auditstatus==0">通过</el-button>
                    <el-button type="danger" @click="refuse(scope.row)" v-if="scope.row.auditstatus==0">拒绝</el-button>
                    <span v-if="scope.row.auditstatus==1">已通过</span>
                    <span v-if="scope.row.auditstatus==2">已拒绝</span>
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
    <!--正文预览dialog-->
    <el-dialog title="页面预览" :visible.sync="replyFormVisible" top="5%" :close-on-click-modal="false">
        <div v-html="contentPreview" class="title-content-box" v-if="form.type==0">

        </div>
        <el-row :gutter="10" v-if="form.type==1">
            <el-col :span="6" :key="index" v-for='(item,index) in pictureInfo' style="height:310px;overflow:hidden;margin-bottom:10px;">
                <div class="height:290px;overflow:hidden"><img class="box_img" style="height: 290px;" :src="item.src"/> </div>
                <p style="text-align:center;margin:0;margin-bottom:10px">{{ item.text }}</p>
            </el-col>
        </el-row>
        <video-player :options="playerOptions" ref="videoPlayer" style="width:auto" v-if="form.type==2"></video-player>
    </el-dialog>
    </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import {
    getAllAuditUser,
    getContentDetail
} from '@/api/dataCenter'
import {
    parseTime,
} from '@/utils'
import {
    getAuditPatrol,
    changePatrolStatus,
    cancelPatrol
} from '@/api/audit'
import {
    auditTeam
} from '@/utils'
import { contentToHtml } from '@/utils/contentTransform'

export default {
    components: {
        videoPlayer
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    data() {
        const startTime = parseTime(new Date().setHours(0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
        const endTime = parseTime(new Date().setHours(23, 59, 59), '{y}-{m}-{d} {h}:{i}:{s}')
        return {
            replyFormVisible: false,
            contentPreview: '',
            pictureInfo: '',
            playerOptions: {
                height: '400',
                width: '560',
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
            },
            // 以上是标题点击所需数据
            form: {
                timeQuantum: [],
                starttime: startTime,
                endtime: endTime,
                type: 0,
                team: '',
                num: 100,
                user: ''
            },
            patrols: [
                {
                    label: '新闻',
                    value: 0
                },
                {
                    label: '图集',
                    value: 1
                },
                {
                    label: '视频',
                    value: 2
                }
            ],
            teams: auditTeam,
            users: [],
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            listLoading: false
        }
    },
    filters: {
        newstype(val){
            switch (Number(val)) {
                case 0:
                    return '新闻'
                    break;
                case 1:
                    return '视频'
                    break;
                case 2:
                    return '图集'
                    break;
                default:
                    return '新闻'
            }
        }
    },
    mounted(){
        this.getAllAuditUser()
    },
    methods: {
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            this.getTopTime()
            let params = {
                title: '',
                url: '',
                newstype: this.form.type,
                audituser: this.form.user,
                auditstatus: '',
                classify: '',
                source: '',
                usertype: this.form.team,
                limit: 100,
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            this.listLoading = true
            getAuditPatrol(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.total
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
        pass(row) {
            let params = {
                ids: row.id,
                auditstatus: 1
            }
            changePatrolStatus(params).then(res => {
                if(res.code === '00001'){
                    this.$notify({
                        title: '成功',
                        message: '通过成功',
                        type: 'success',
                        duration: 2 *1000
                    })
                    this.getList()
                }
            })
        },
        refuse(row) {
            let params = {
                ids: row.id,
                auditstatus: 2
            }
            changePatrolStatus(params).then(res => {
                if(res.code === '00001'){
                    this.$notify({
                        title: '成功',
                        message: '拒绝成功',
                        type: 'success',
                        duration: 2 *1000
                    })
                    this.getList()
                }
            })
        },
        cancelPatrol() {
            cancelPatrol().then(res => {
                if(res.code === '00001'){
                    this.$notify({
                        title: '成功',
                        message: '取消巡查成功',
                        type: 'success',
                        duration: 2 *1000
                    })
                }
            })
        },
        getTopTime() {
            this.form.starttime = this.form.timeQuantum[0]
            this.form.endtime = this.form.timeQuantum[1]
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        showDialog(url) {
            this.replyFormVisible = true
            let params = {
                url: url
            }
            getContentDetail(params).then(res => {
                if (res.code === '00001') {
                    switch (this.form.type) {
                        case 0:
                            this.contentPreview = contentToHtml(res.data)
                            break;
                        case 1:
                            this.pictureInfo = JSON.parse(res.data.imgjs);
                            var imgText = res.data.content.split("!@#!@");
                            var _this = this;
                            imgText.forEach(function(item) {
                                _this.pictureInfo.forEach(function(i) {
                                    i.text = item;
                                })
                            })
                            break;
                        case 2:
                            if (res.data.videominiajs) {
                                this.playerOptions.sources[0].src = JSON.parse(res.data.videominiajs)[0].src;
                            } else {
                                this.playerOptions.sources[0].src = JSON.parse(res.data.videoajs)[0].src;
                            }
                            break;
                        default:

                    }

                }
            })
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.auditPatrol{
    padding: 20px;
}
</style>
