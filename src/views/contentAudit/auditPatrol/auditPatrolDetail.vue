<template lang="html">
    <section class="auditPatrolDetail">
        <el-card>
            <el-form :inline="true" :model="form" style="margin-bottom: 0">
                <el-form-item label="巡查时间" style="margin-bottom:0">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.timeQuantum"
                        type="datetimerange"
                        placeholder="选择时间范围"
                        @change="getTopTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="巡查人员" style="margin-bottom:0">
                    <el-select v-model="form.user" class="select-platform"  style="margin-bottom: 0"
                        filterable placeholder="请选择巡查人员">
                        <el-option
                            v-for="(item,index) in auditPeoples"
                            :key="index"
                            :label="item.realName"
                            :value="item.userName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="getList">查询</el-button>
                    <el-button type="primary" @click="exportExcel">导出</el-button>
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
            <el-table-column label="审核人" width="140" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.modifyuser ? scope.row.modifyuser : scope.row.createuser }}
                </template>
            </el-table-column>
            <el-table-column prop="audituser" label="原审核人" width="140" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="title" label="新闻标题" min-width="220" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="aclick" @click="showDialog(scope.row.url)">{{ scope.row.title }} </span>
                </template>
            </el-table-column>
            <el-table-column prop="audittime" label="审核时间" width="170" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="logtype" label="原审结果" width="170" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="巡查结果" width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.auditstatus | auditstatus }}
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
import {
    parseTime,
} from '@/utils'
import {
    getAuditPatrolUser,
    getAuditPatrolDetail,
    getPatrolContentDetail,
    exportPatrolDetailExcel
} from '@/api/audit'
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import { contentToHtml } from '@/utils/contentTransform'
export default {
    components: {
        videoPlayer
    },
    data() {
        const startTime = parseTime(new Date().setHours(0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
        const endTime = parseTime(new Date().setHours(23, 59, 59), '{y}-{m}-{d} {h}:{i}:{s}')
        return {
            contentType: '',
            replyFormVisible: false,
            contentPreview: '',
            pictureInfo: '',
            videoOptions: '',
            form: {
                user: '',
                timeQuantum: [startTime,endTime],
                starttime: startTime,
                endtime: endTime,
                title: '',
                url: ''
            },
            auditPeoples: [],
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            listLoading: false
        }
    },
    mounted(){
        this.getAuditPatrolUser()
    },
    filters: {
        auditstatus(val){
            switch (Number(val)) {
                case 0:
                    return '待审'
                    break;
                case 1:
                    return '通过'
                    break;
                case 2:
                    return '拒绝'
                    break;
            }
        }
    },
    methods: {
        // 获取巡查人员
        getAuditPatrolUser() {
            getAuditPatrolUser().then(res => {
                if(res.code === '00001'){
                    this.auditPeoples = res.data
                    this.auditPeoples.unshift({
                        userName: '',
                        realName: '全部人员'
                    })
                }
            })
        },
        // 查询
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            let params = {
                startTime: this.form.starttime,
                endTime: this.form.endtime,
                auditUser: this.form.user,
                title: this.form.title,
                url: this.form.url,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                auditUser: this.form.user
            }
            this.listLoading = true
            getAuditPatrolDetail(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
                this.listLoading = false
            })
        },
        getTopTime() {
            this.form.starttime = this.form.timeQuantum[0]
            this.form.endtime = this.form.timeQuantum[1]
        },
        exportExcel() {
            var exportUrl = exportPatrolDetailExcel;
            exportUrl += 'startTime=' + (this.form.starttime ? this.form.starttime : '')
            exportUrl += '&endTime=' + this.form.endtime
            exportUrl += '&title=' + this.form.title
            exportUrl += '&url=' + this.form.url
            exportUrl += '&auditUser=' + (this.form.user ? this.form.user : '')
            console.log(exportUrl)
            window.location.href = exportUrl
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
            getPatrolContentDetail(params).then(res => {
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
