<template lang="html">
    <section class="auditData_Detail">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="审核类型：">
                        <el-select v-model="form.type" style="width:200px;"
                            filterable placeholder="选择审核类型">
                            <el-option
                                v-for="(item,index) in types"
                                :key="index"
                                :label="item.mean"
                                :value="item.logtype"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.timeQuantum" type="datetimerange" placeholder="选择时间范围" @change="getTopTime">
                        </el-date-picker>
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
                    <el-form-item style="margin-bottom:0">
                        <el-input type="primary" v-model="form.keywords" placeholder="请输入关键词"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-input type="primary" v-model="form.url" placeholder="请输入URL"></el-input>
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
                <div class="pull-left">
                    <span class="mr-10">总数：{{ auditNum.auditCount }}</span>
                    <span class="mr-10">通过：{{ auditNum.auditPassCount }}</span>
                    <span class="mr-10">拒绝：{{ auditNum.auditRefuseCount }}</span>
                    <span class="mr-10">驳回：{{ auditNum.rejectCount }}</span>
                    <span class="mr-10">通过率：{{ auditNum.passingRate }}%</span>
                    <span class="mr-10">拒绝率：{{ auditNum.rejectRate }}%</span>
                    <span class="mr-10">驳回率：{{ auditNum.refusingRate }}%</span>
                </div>
                <el-checkbox-group v-model="tableConfigCheck" class="pull-right">
                    <el-checkbox :label="item" v-for="(item,index) in tableConfig" :key="index">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
            </el-row>
            <el-row class="mt-10">
                <!--发布列表Begin-->
                <el-table :data="tableData"
                          highlight-current-row
                          v-loading="listLoading"
                          style="width: 100%;"
                          tooltip-effect="dark"
                          stripe border>
                    <el-table-column v-for="(item,index) in tableConfigCheck"
                                     :key="index"
                                     :prop="item.prop"
                                     :label="item.label"
                                     v-if="item.prop=='newsTime'"
                                     width="170"
                                     :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>
                                {{ parseInt(scope.row.newsTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  v-for="(item,index) in tableConfigCheck"
                                      :key="index"
                                      :prop="item.prop"
                                      :label="item.label"
                                      v-if="item.prop=='auditTime'"
                                      width="170"
                                      :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>
                                {{ parseInt(scope.row.auditTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column width="130"
                                     :show-overflow-tooltip="true"
                                     v-for="(item,index) in tableConfigCheck"
                                     :key="index"
                                     :prop="item.prop"
                                     :label="item.label"
                                     v-if="item.prop=='tags'">
                    </el-table-column>
                    <el-table-column prop="auditUser"
                                     width="100"
                                     :show-overflow-tooltip="true"
                                     v-for="(item,index) in tableConfigCheck"
                                     :key="index"
                                     :prop="item.prop"
                                     :label="item.label"
                                     v-if="item.prop=='auditUser'">

                    </el-table-column>
                    <el-table-column label="稿件标题" min-width="220">
                        <template slot-scope="scope">
                            <span class="aclick" @click="showDialog(scope.row.url)">{{ scope.row.newsTitle }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="newsSource" label="新闻来源" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="newsType" label="新闻类型" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="auditType" label="审核操作" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="copyURL(scope.row.url,$event)">复制URL</el-button>
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
        <!--正文预览dialog-->
        <el-dialog title="页面预览" :visible.sync="replyFormVisible" top="5%" :close-on-click-modal="false">
			<div v-html="contentPreview" class="title-content-box" v-if="contentType=='news'">

			</div>
            <el-row :gutter="10" v-if="contentType=='picture'">
                <el-col :span="6" :key="index" v-for='(item,index) in pictureInfo' style="height:310px;overflow:hidden;margin-bottom:10px;">
                    <div class="height:290px;overflow:hidden"><img class="box_img" style="height: 290px;" :src="item.src"/> </div>
                    <p style="text-align:center;margin:0;margin-bottom:10px">{{ item.text }}</p>
                </el-col>
            </el-row>
            <video-player :options="playerOptions" ref="videoPlayer" style="width:auto" v-if="contentType=='video'"></video-player>
		</el-dialog>
    </section>
</template>

<script>
import clip from '@/utils/clipboard'
import {
    mapGetters
} from 'vuex';
import {
    parseTime,
    getDateDiffDays
} from '@/utils'
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import {
    getAllAuditUser,
    getAllAuditDetailType,
    getAllAuditDetailList,
    exportExcalAuditDetail,
    getAllAuditDetailNum,
    getContentDetail
} from '@/api/dataCenter'
import { contentToHtml } from '@/utils/contentTransform'

export default {
    components: {
        videoPlayer
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        },
        ...mapGetters([
            'personalConfig'
        ])
    },
    data(){
        const startTime = new Date(new Date().setHours(0, 0, 0))
        const endTime = new Date(new Date().setHours(23, 59, 59))
        return {
            contentType: '',
            replyFormVisible: false,
            contentPreview: '',
            pictureInfo: '',
            videoOptions: '',
            form: {
                timeQuantum: [startTime, endTime],
                starttime: startTime,
                endtime: endTime,
                platform: '',
                type: '',
                team: '',
                user: '',
                keywords: '',
                url: ''
            },
            playerOptions: {
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
            },
            auditNum: {
                auditCount: 0,
                auditPassCount: 0,
                auditRefuseCount: 0,
                rejectCount: 0,
                passingRate: 0,
                rejectRate: 0,
                refusingRate: 0
            },
            types: [],
            users: [],
            tableData: [],
            total: 0,
            pageSize: 10,
            currentPage: 1,
            listLoading: false,
            tableConfigCheck: [],
            tableConfig: [{
                    prop: "newsTime",
                    label: "新闻时间"
                },
                {
                    prop: "auditTime",
                    label: "新闻审核时间"
                },
                {
                    prop: "tags",
                    label: "标签"
                },
                {
                    prop: "auditUser",
                    label: "审核人"
                }
            ]
        }
    },
    mounted(){
        this.pageSize = this.personalConfig.tableRowShow
        this.getAllAuditUser()
        this.getType()
    },
    methods: {
        copyURL(text,event){
             clip(text, event)
        },
        search(){
            this.currentPage = 1
            this.getList()
        },
        getNum(){
            let params = {
                auditType: this.form.type,
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                auditUser: this.form.user,
                userType: ''
            }
            getAllAuditDetailNum(params).then(res => {
                if(res.code === '00001'){
                    this.auditNum = res.data[0]
                    if(res.data.length == 0){
                        this.auditCount = 0
                        this.auditPassCount = 0
                        this.auditRefuseCount = 0
                        this.rejectCount = 0
                        this.passingRate = 0
                        this.rejectRate = 0
                        this.refusingRate = 0
                    }
                }else{
                    this.auditCount = 0
                    this.auditPassCount = 0
                    this.auditRefuseCount = 0
                    this.rejectCount = 0
                    this.passingRate = 0
                    this.rejectRate = 0
                    this.refusingRate = 0
                }
            })
        },
        getType(){
            getAllAuditDetailType().then(res => {
                if(res.code === '00001'){
                    this.types = res.data
                    this.types.unshift({
                        mean: '全部类型',
                        logtype: ''
                    })
                }
            })
        },
        getList(){
            this.getNum()
            if(getDateDiffDays(new Date(this.form.endtime), new Date(this.form.starttime)) > 31){
                this.$message({
                    message: '选择最大区间不能超过31天',
                    type: 'warning'
                })
                return false
            }
            let params = {
                auditType: this.form.type,
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                auditUser: this.form.user,
                userType: '',
                url: this.form.url,
                title: this.form.keywords
            }
            this.listLoading = true
            getAllAuditDetailList(params).then(res => {
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
        getTopTime(){
            if (this.form.timeQuantum.length != 0) {
                this.form.starttime = new Date(this.form.timeQuantum[0]).getTime()
                this.form.endtime = new Date(this.form.timeQuantum[1]).getTime()
            }
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        },
        exportExcel(){
            var exportUrl = exportExcalAuditDetail;
            exportUrl += 'json={"starttime":' + (this.form.starttime ? '"' + this.form.starttime + '"' : '')
            exportUrl += ',"endtime":' + '"' + this.form.endtime + '"'
            exportUrl += ',"auditUser":' + (this.form.auditPeople ? '"' + this.form.user + '"' + '"' : '""')
            exportUrl += ',"userType":' + (this.form.team ? '"' + this.form.team + '"' + '"' : '""')
            exportUrl += ',"auditType":' + (this.form.type ? '"' + this.form.type + '"' + '"' : '""') + '}'
            console.log(exportUrl)
            window.location.href = exportUrl
        },
        showDialog(url) {
            this.replyFormVisible = true
            let params = {
                url: url
            }
            getContentDetail(params).then(res => {
                if(res.code === '00001'){
                    this.contentType = res.data.newstype
                    switch (this.contentType) {
                        case 'news':
                            this.contentPreview = contentToHtml(res.data)
                            break;
                        case 'picture':
                            this.pictureInfo = JSON.parse(res.data.imgjs);
                            var imgText = res.data.content.split("!@#!@");
                            var _this = this;
                            imgText.forEach(function(item){
                                _this.pictureInfo.forEach(function(i){
                                    i.text = item;
                                })
                            })
                            break;
                        case 'video':
                            if(res.data.videominiajs){
                                this.playerOptions.sources[0].src=JSON.parse(res.data.videominiajs)[0].src;
                            }else{
                                this.playerOptions.sources[0].src=JSON.parse(res.data.videoajs)[0].src;
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
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    &:hover {
        color: #58B7FF;
    }
}
</style>
