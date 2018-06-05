<template lang="html">
    <section class="editMatch">
        <el-row>
            <el-button type="primary" @click="saveMatchData">保存</el-button>
            <el-button type="primary" @click="resetForm">重置</el-button>
            <!-- <el-button type="primary">结束比赛</el-button> -->
        </el-row>
        <el-row :gutter="10" class="mt-10">
            <el-col :span="8">
                <el-card>
                    <el-form :model="form">
                        <el-form-item label="同步平台：">
                            <el-select v-model="form.platform" placeholder="请选择平台" style="width:200px;" filterable>
                                <el-option label="东方体育" value="df"></el-option>
                                <el-option label="五星体育" value="wx"></el-option>
                                <el-option label="猫扑体育" value="mp"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="同步平台：" class="platformCheck">
                            <el-checkbox-group v-model="form.checkList">
                                <el-checkbox label="df">东方体育</el-checkbox>
                                <el-checkbox label="wx">五星体育</el-checkbox>
                                <el-checkbox label="mp">猫扑体育</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item> -->
                        <el-form-item label="赛程分类：" class="mt-10">
                            <el-select v-model="form.agendaClassify" placeholder="请选择赛程分类" style="width:200px;" filterable>
                                <el-option :label="item.typeName" :value="item.typeName" v-for="(item,index) in agendas" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="赛事分类：" class="mt-10">
                            <el-select v-model="form.classify" placeholder="请选择赛事分类：" style="width:200px;" filterable>
                                <el-option :label="item.typeName" :value="item.typeName" v-for="(item,index) in maintypes" :key="index"></el-option>
                            </el-select>
                            <!-- <el-input v-model.trim="form.classify" placeholder="请输入赛程分类" :maxlength="100" style="width:120px;"></el-input> -->
                        </el-form-item>
                        <el-form-item label="重要比赛：">
                            <el-checkbox v-model="form.isImportant">是</el-checkbox>
                        </el-form-item>
                        <el-form-item label="文字直播：">
                            <el-checkbox v-model="form.textLive">显示</el-checkbox>
                        </el-form-item>
                        <el-form-item label="比赛数据：">
                            <el-checkbox v-model="form.matchData">显示</el-checkbox>
                        </el-form-item>
                        <el-form-item label="自定义：" class="mt-10">
                            <el-select v-model="liveStream" placeholder="选择自定义" style="width:200px;" filterable multiple>
                                <el-option
                                    v-for="(item,index) in liveStreams"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开赛时间：" class="mt-10">
                            <el-date-picker
                                v-model="form.starttime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间：" class="mt-10">
                            <el-date-picker
                                v-model="form.endtime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="比赛状态：" class="mt-10">
                            <el-select v-model="form.matchStatus" placeholder="请选择类型" style="width:100px;" filterable>
                                <el-option
                                    v-for="(item,index) in matchStatus"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="比赛方式：">
                            <el-radio-group v-model="form.matchWay">
                                <el-radio :label="1">多人角逐</el-radio>
                                <el-radio :label="0">双方对阵</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="主队：" v-if="form.matchWay=='0'">
                            <el-select v-model="form.hostTeam"
                                       placeholder="请选择主队"
                                       style="width:140px;"
                                       filterable remote
                                       :remote-method="getHostTeam"
                                       :loading="hostTeamLoading"
                                       @change="getHostTeamIcon">
                                <el-option
                                    v-for="(item,index) in hostTeams"
                                    :key="index"
                                    :label="item.teamName"
                                    :value="item.teamName"
                                    >
                                </el-option>
                            </el-select>
                            <div class="teamflag">
                                <img :src="hostTeamIcon" alt="" style="width:100%;height:100%;">
                            </div>
                        </el-form-item>
                        <el-form-item label="客队：" class="mt-10" v-if="form.matchWay=='0'">
                            <el-select v-model="form.guestTeam"
                                       placeholder="请选择客队"
                                       style="width:140px;"
                                       filterable remote
                                       :remote-method="getGuestTeam"
                                       :loading="guestTeamLoading"
                                       @change="getGuestTeamIcon">
                                <el-option
                                    v-for="(item,index) in guestTeams"
                                    :key="index"
                                    :label="item.teamName"
                                    :value="item.teamName"
                                    >
                                </el-option>
                            </el-select>
                            <div class="teamflag">
                                <img :src="guestTeamIcon" alt="" style="width:100%;height:100%;">
                            </div>
                        </el-form-item>
                        <el-form-item label="" class="mt-10">
                            <el-input v-model.trim="form.title" placeholder="请输入比赛标题" :maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="" class="mt-10">
                            <el-input v-model.trim="form.subTitle" placeholder="请输入比赛副标题" :maxlength="100"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card>
                    <el-form :model="form">
                        <el-form-item label="" style="padding-right:100px;position:relative;" class="flex-form__item">
                            <el-input v-model.trim="form.prospectTitle" placeholder="请输入前瞻标题" :maxlength="100" style="width:200px;margin-right:4px"></el-input>
                            <el-input v-model.trim="form.prospectHref" placeholder="请输入前瞻链接" :maxlength="100" style="flex:1"></el-input>
                            <el-checkbox v-model="prospectHrefHidden" style="position:absolute;top:0;right:-60px;">隐藏</el-checkbox>
                        </el-form-item>
                        <el-form-item label="" class="mt-10 flex-form__item" style="padding-right:100px;position:relative">
                            <el-input v-model.trim="form.battlefieldTitle" placeholder="请输入战报标题" :maxlength="100" style="width:200px;margin-right:4px"></el-input>
                            <el-input v-model.trim="form.battlefieldHref" placeholder="请输入战报链接" :maxlength="100" style="flex:1"></el-input>
                            <el-checkbox v-model="battlefieldHrefHidden" style="position:absolute;top:0;right:-60px;">隐藏</el-checkbox>
                        </el-form-item>
                    </el-form>
                    <el-collapse accordion v-model="activeName" class="mt-10">
                        <el-collapse-item name='1'>
                            <template slot="title">
                            直播源：{{ tableData.length }}条
                            </template>
                            <el-table :data="tableData"
                                      style="width: 100%;"
                                      row-key="idx"
                                      stripe border
                                      :key="tablekey"
                                      id="tableSort">
                                <el-table-column>
                                    <template slot-scope="scope">
                                        <div>
                                            <strong>{{ scope.row.title }}：</strong>{{ scope.row.url }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column width="160">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="small" @click="editLiveStream(scope.row,scope.$index)">编辑</el-button>
                                        <el-button type="primary" size="small" @click="delLiveStream(scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--直播流编辑 Begin-->
                            <div class="mt-10 addLiveStream" v-show="addLiveStream">
                                <div style="position:relative">
                                    <!-- <el-checkbox v-model="isUserDefined" style="margin-left:10px;">自定义</el-checkbox> -->
                                    <!-- <el-select v-model="definition" placeholder="选择清晰度" style="width:100px;margin-left:10px;" filterable>
                                        <el-option
                                            v-for="(item,index) in definitions"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"
                                            >
                                        </el-option>
                                    </el-select> -->
                                    <el-select v-model="openWay" placeholder="选择打开方式" style="width:160px;" filterable>
                                        <el-option
                                            v-for="(item,index) in openWays"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"
                                            >
                                        </el-option>
                                    </el-select>
                                    <div style="position:absolute;right:0px;top:0px;">
                                        <el-button type="text" @click="saveLiveStream">保存</el-button>
                                        <el-button type="text" @click="resetLiveStream">取消</el-button>
                                    </div>
                                </div>
                                <div style="display:flex;aligns-item:center" class="mt-10">
                                    <el-select v-model="liveStreamType" placeholder="选择打开方式" style="width:140px;margin-right:10px;" filterable>
                                        <el-option label="链接" value="0"></el-option>
                                        <el-option label="流地址" value="1"></el-option>
                                    </el-select>
                                    <el-input v-model.trim="commentator" placeholder="请输入直播源名称" style="width:140px;"></el-input>
                                    <el-input v-model.trim="definition" placeholder="请输入解说" style="width:140px;margin-left:10px;"></el-input>
                                    <el-input v-model.trim="liveStreamName" placeholder="请输入播放地址" style="flex:1;margin-left:10px;"></el-input>
                                </div>
                            </div>
                            <!--直播流编辑 End-->
                            <el-button type="primary" style="margin-top:10px;" @click="addLiveStream = true"><i class="el-icon-plus"></i></el-button>
                        </el-collapse-item>
                        <el-collapse-item name='2'>
                            <template slot="title">
                            比赛录像：{{ tableVideo.length }}条
                            </template>
                            <el-table
                                :data="tableVideo"
                                :show-header="false"
                                style="width: 100%">
                                <el-table-column>
                                    <template slot-scope="scope">
                                        {{ scope.row.title }}：{{ scope.row.url }}  {{ scope.row.hascopyright=='1'?'有版权':'无版权' }}
                                    </template>
                                </el-table-column>
                                <el-table-column width="160">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="small" @click="editVideo(scope.row,scope.$index)">编辑</el-button>
                                        <el-button type="primary" size="small" @click="delVideo(scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--比赛视频 Begin-->
                            <div class="mt-10 addLiveStream" v-show="videoShow">
                                <div style="position:relative;height:30px;">
                                    <div style="position:absolute;right:0px;top:0px;">
                                        <el-button type="text" @click="saveVideo">保存</el-button>
                                        <el-button type="text" @click="resetVideo">取消</el-button>
                                    </div>
                                </div>
                                <div style="display:flex;aligns-item:center" class="mt-10">
                                    <el-input v-model.trim="videoTitle" placeholder="请输入录像标题" style="width:140px;"></el-input>
                                    <el-input v-model.trim="videoUrl" placeholder="请输入录像链接" style="flex:1;margin-left:10px;"></el-input>
                                    <el-checkbox v-model="videohasCopyright" style="margin-left:10px;">版权</el-checkbox>
                                </div>
                            </div>
                            <!--比赛视频 End-->
                            <el-button type="primary" style="margin-top:10px;" @click="videoShow = true"><i class="el-icon-plus"></i></el-button>
                        </el-collapse-item>
                        <el-collapse-item name='3'>
                            <template slot="title">
                            比赛集锦：{{ tableCollection.length }}条
                            </template>
                            <el-table
                                :data="tableCollection"
                                :show-header="false"
                                style="width: 100%">
                                <el-table-column>
                                    <template slot-scope="scope">
                                        {{ scope.row.title }}：{{ scope.row.url }}  {{ scope.row.hascopyright=='1'?'有版权':'无版权' }}
                                    </template>
                                </el-table-column>
                                <el-table-column width="160">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="small" @click="editCollection(scope.row,scope.$index)">编辑</el-button>
                                        <el-button type="primary" size="small" @click="delCollection(scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--比赛集锦Begin-->
                            <div class="mt-10 addLiveStream" v-show="collectionShow">
                                <div style="position:relative;height:30px;">
                                    <div style="position:absolute;right:0px;top:0px;">
                                        <el-button type="text" @click="saveCollection">保存</el-button>
                                        <el-button type="text" @click="resetCollection">取消</el-button>
                                    </div>
                                </div>
                                <div style="display:flex;aligns-item:center" class="mt-10">
                                    <el-input v-model.trim="collectionTitle" placeholder="请输入录像标题" style="width:140px;"></el-input>
                                    <el-input v-model.trim="collectionUrl" placeholder="请输入录像链接" style="flex:1;margin-left:10px;"></el-input>
                                    <el-checkbox v-model="collectionhasCopyright" style="margin-left:10px;">版权</el-checkbox>
                                </div>
                            </div>
                            <!--比赛集锦 End-->
                            <el-button type="primary" style="margin-top:10px;" @click="collectionShow= true"><i class="el-icon-plus"></i></el-button>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import Sortable from 'sortablejs'
import {
    getTeamName,
    matchBasicAdd,
    matchSingleApi,
    matchEditApi,
    getMatchType
} from '@/api/contentManage'

export default {
    data() {
        return {
            tablekey: 0,
            rowkey: '',
            activeName: '1',
            maintypes: [],
            form: {
                platform: '',
                checkList: [],
                classify: '',
                agendas: '',
                isImportant: false,
                textLive: false,
                starttime: '',
                endtime: '',
                matchStatus: 0,
                matchWay: 1,
                hostTeam: '',
                guestTeam: '',
                title: '',
                subTitle: '',
                prospectHref: '',
                battlefieldHref: '',
                prospectTitle: '',
                battlefieldTitle: '',
                matchData: false,
                agendaClassify: ''
            },
            hostTeamLoading: false,
            guestTeamLoading: false,
            hostTeamIcon: '',
            guestTeamIcon: '',
            hostTeamId: '',
            guestTeamId: '',
            // 直播源条数
            liveStreamSource: 0,
            // 比赛录像数
            matchVideo: 0,
            // 比赛集锦数
            matchCollection: 0,
            prospectHrefHidden: false,
            battlefieldHrefHidden: false,
            matchStatus: [{
                    label: '未比赛',
                    value: 0
                },
                {
                    label: '已结束',
                    value: 1
                },
                {
                    label: '比赛中',
                    value: 2
                }
            ],
            agendas: [{
                    typeName: '足球',
                    typePy: '足球'
                },
                {
                    typeName: '篮球',
                    typePy: '篮球'
                },
                {
                    typeName: '其他',
                    typePy: '其他'
                }
            ],
            // 主队
            hostTeams: [

            ],
            // 客队
            guestTeams: [

            ],
            openWays: [{
                    label: '默认浏览器',
                    value: '0'
                },
                {
                    label: 'app内打开',
                    value: '1'
                }
            ],
            // 直播源
            tableData: [

            ],
            tableVideo: [

            ],
            tableCollection: [

            ],
            liveStream: [],
            isUserDefined: false,
            definition: '',
            openWay: '',
            commentator: '',
            liveStreamName: '',
            oldliveStreamName: '',
            hasCopyright: false,
            liveStreamType: '0',
            liveStreams: [{
                    label: 'CCTV5',
                    value: 'CCTV5'
                },
                {
                    label: 'CCTV5+',
                    value: 'CCTV5+'
                },
                {
                    label: '广东体育',
                    value: '广东体育'
                },
                {
                    label: '五星体育',
                    value: '五星体育'
                }
            ],
            definitions: [{
                    label: '标清',
                    value: '标清'
                },
                {
                    label: '高清',
                    value: '高清'
                }
            ],
            addLiveStream: false,
            editLiveStreamIndex: '',
            // 录像
            videoShow: false,
            videoTitle: '',
            videoUrl: '',
            videohasCopyright: '',
            editVideoIndex: '',
            // 集锦
            collectionShow: false,
            collectionTitle: '',
            collectionUrl: '',
            collectionhasCopyright: '',
            editCollectionIndex: ''
        }
    },
    mounted() {
        this.getMatchType()
        if (this.$route.query.region) {
            this.form.platform = this.$route.query.region
            this.rowkey = this.$route.query.id
            this.searchSingleApi()
        }
        this.$nextTick(() => {
            this.setSort()
        })
    },
    methods: {
        // 分类获取
        getMatchType() {
            getMatchType().then(res => {
                if (res.code === '00001') {
                    this.maintypes = res.data
                }
            })
        },
        // 查询单条
        searchSingleApi() {
            let params = {
                rowkey: this.$route.query.id,
                platform: this.form.platform,
            }
            matchSingleApi(params).then(res => {
                if (res.code == "00001") {
                    this.form.title = res.data.title
                    this.form.subTitle = res.data.title2
                    this.form.starttime = Number(res.data.starttime)
                    this.form.endtime = Number(res.data.endtime)
                    this.form.classify = res.data.saishiId
                    this.form.hostTeam = res.data.home_team
                    this.form.guestTeam = res.data.visit_team
                    this.getHostTeam(this.form.hostTeam)
                    this.getGuestTeam(this.form.guestTeam)
                    this.form.matchStatus = res.data.ismatched
                    this.form.isImportant = res.data.isimp
                    this.form.matchData = res.data.scheduledata
                    this.hostTeamId = res.data.home_team_id
                    this.guestTeamId = res.data.visit_team_id
                    this.form.matchWay = res.data.sport_type
                    this.tableData = res.data.signals
                    this.tableCollection = res.data.collections
                    this.tableVideo = res.data.videos
                    // this.prospect.title = res.data.prospect.title
                    if (res.data.prospect) {
                        this.form.prospectHref = res.data.prospect.url
                        this.form.prospectTitle = res.data.prospect.title
                    }
                    // this.battlelog.title = res.data.battlelog.title
                    this.liveStream = res.data.defines
                    this.form.agendaClassify = res.data.tplv001
                    if (res.data.battlelog) {
                        this.form.battlefieldHref = res.data.battlelog.url
                        this.form.battlefieldTitle = res.data.battlelog.title
                    }
                }
            })
        },
        // 获取主队名
        getHostTeam(val) {
            if (val !== '') {
                let params = {
                    teamname: val
                }
                this.hostTeamLoading = true
                var _this = this
                setTimeout(() => {
                    getTeamName(params).then(res => {
                        if (res.code == "00001") {
                            _this.hostTeams = res.data
                        }
                        _this.hostTeamLoading = false
                    })
                }, 200)
            } else {
                this.hostTeams = []
            }
        },
        // 获取客队队名
        getGuestTeam(val) {
            if (val !== '') {
                let params = {
                    teamname: val
                }
                this.guestTeamLoading = true
                var _this = this
                setTimeout(() => {
                    getTeamName(params).then(res => {
                        if (res.code == "00001") {
                            _this.guestTeams = res.data
                        }
                        _this.guestTeamLoading = false
                    })
                }, 200)
            } else {
                this.guestTeams = []
            }
        },
        // 获得主队图标、Id
        getHostTeamIcon() {
            var _this = this;
            _this.hostTeams.forEach(item => {
                if (item.teamName == _this.form.hostTeam) {
                    _this.hostTeamIcon = item.teamIcon
                    _this.hostTeamId = item.teamId
                }
            })
        },
        // 获得客队图标、Id
        getGuestTeamIcon() {
            var _this = this;
            _this.guestTeams.forEach(item => {
                if (item.teamName == _this.form.guestTeam) {
                    _this.guestTeamIcon = item.teamIcon
                    _this.guestTeamId = item.teamId
                }
            })
        },
        // 保存比赛数据
        saveMatchData() {
            this.tableData.forEach(function(item, index) {
                item.idx = index
            })
            let params = {
                wordlive: this.form.textLive,
                title: this.form.title,
                title2: this.form.subTitle,
                starttime: new Date(this.form.starttime).getTime(),
                endtime: new Date(this.form.endtime).getTime(),
                tplv001: this.form.agendaClassify,
                saishiId: this.form.classify,
                home_team: this.form.hostTeam,
                visit_team: this.form.guestTeam,
                ismatched: this.form.matchStatus,
                isimp: this.form.isImportant,
                scheduledata: this.form.matchData,
                home_team_id: this.hostTeamId,
                visit_team_id: this.guestTeamId,
                sport_type: this.form.matchWay,
                platform: this.form.platform,
                signals: this.tableData,
                collections: this.tableCollection,
                videos: this.tableVideo,
                home_team_url: this.hostTeamIcon,
                visit_team_url: this.guestTeamIcon,
                defines: this.liveStream,
                prospect: {
                    title: this.form.prospectTitle,
                    url: this.form.prospectHref
                },
                battlelog: {
                    title: this.form.battlefieldTitle,
                    url: this.form.battlefieldHref
                }
            }
            if (this.rowkey !== '') {
                params.rowkey = this.rowkey
                matchEditApi(params).then(res => {
                    if (res.code == "00001") {
                        this.resetForm()
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                })
            } else {
                matchBasicAdd(params).then(res => {
                    if (res.code == "00001") {
                        this.resetForm()
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                })
            }

        },
        // 自定义(暂时废弃)
        // addMatchDefined(){
        //     if(this.isUserDefined){
        //         let params =  {
        //             platform: this.form.platform,
        //             rowkey: this.rowkey,
        //             copyrightname: this.liveStream,
        //             hascopyright: this.hasCopyright
        //         }
        //         addMatchDefined(params).then(res => {
        //             if(res.code == "00001"){
        //
        //             }
        //         })
        //     }
        // },
        // 编辑直播流
        editLiveStream(row, index) {
            this.editLiveStreamIndex = index
            this.addLiveStream = true
            if (row.title.indexOf('(') !== -1) {
                this.definition = row.title.split('(')[1].replace(')', '')
            } else {
                this.definition = ''
            }
            if (row.title.indexOf('(') !== -1) {
                this.commentator = row.title.split('(')[0]
            } else {
                this.commentator = row.title
            }
            this.openWay = row.hascopyright

            this.liveStreamName = row.url
            this.liveStreamType = row.iszhiboliu
            // this.hasCopyright = Boolean(Number(row.hascopyright))
            // 如果是编辑赛程需要记录之前的直播流
            if (this.rowkey != '') {
                this.oldliveStreamName = row.url
            }
        },
        // 删除直播流
        delLiveStream(index) {
            this.tableData.splice(index, 1)
        },
        saveLiveStream() {
            if (this.editLiveStreamIndex !== '') {
                let nowData = this.tableData[this.editLiveStreamIndex]
                nowData.title = this.commentator + '(' + this.definition + ')'
                // nowData.definition = this.definition
                nowData.iszhiboliu = this.liveStreamType
                nowData.hascopyright = this.openWay
                nowData.url = this.liveStreamName
                if (this.rowkey != '') {
                    if (nowData.url != this.oldliveStreamName) {
                        this.$message.warning('URL被修改')
                        nowData.zhibolius = []
                        nowData.haszhiboliu = '0'
                    }
                }
            } else {
                this.tableData.push({
                    title: this.commentator + '(' + this.definition + ')',
                    // definition: this.definition,
                    haszhiboliu: '0',
                    hascopyright: this.openWay,
                    url: this.liveStreamName,
                    iszhiboliu: this.liveStreamType,
                    zhibolius: []
                })
            }
            this.resetLiveStream()
        },
        resetLiveStream() {
            this.addLiveStream = false
            this.isUserDefined = false
            this.definition = ''
            this.openWay = ''
            this.commentator = ''
            this.liveStreamName = ''
            this.editLiveStreamIndex = ''
        },
        // 编辑比赛视频
        editVideo(row, index) {
            this.videoTitle = row.title
            this.videoUrl = row.url
            this.videohasCopyright = Boolean(Number(row.hascopyright))
            this.videoShow = true
            this.editVideoIndex = index
        },
        // 删除比赛视频
        delVideo() {
            this.tableVideo.splice(index, 1)
        },
        // 保存比赛集锦
        saveVideo() {
            if (this.editVideoIndex !== '') {
                let nowData = this.tableVideo[this.editVideoIndex]
                nowData.title = this.videoTitle
                nowData.url = this.videoUrl
                nowData.idx = 0
                nowData.blk = 0
                nowData.hascopyright = Number(this.videohasCopyright).toString()
            } else {
                this.tableVideo.push({
                    title: this.videoTitle,
                    url: this.videoUrl,
                    idx: 0,
                    blk: 0,
                    hascopyright: Number(this.videohasCopyright).toString()
                })
            }

            this.resetVideo()
        },
        resetVideo() {
            this.videoShow = false
            this.videoTitle = ''
            this.videoUrl = ''
            this.videohasCopyright = false
            this.editVideoIndex = ''
        },
        // 编辑比赛集锦
        editCollection(row, index) {
            this.collectionTitle = row.title
            this.collectionUrl = row.url
            this.collectionhasCopyright = Boolean(Number(row.hascopyright))
            this.collectionShow = true
            this.editCollectionIndex = index
        },
        // 删除比赛视频
        delCollection() {
            this.tableCollection.splice(index, 1)
        },
        // 保存比赛集锦
        saveCollection() {
            if (this.editCollectionIndex !== '') {
                let nowData = this.tableCollection[this.editCollectionIndex]
                nowData.title = this.collectionTitle
                nowData.url = this.collectionUrl
                nowData.idx = 0
                nowData.blk = 0
                nowData.hascopyright = Number(this.collectionhasCopyright).toString()
            } else {
                this.tableCollection.push({
                    title: this.collectionTitle,
                    url: this.collectionUrl,
                    idx: 0,
                    blk: 0,
                    hascopyright: Number(this.collectionhasCopyright).toString()
                })
            }
            this.resetCollection()
        },
        resetCollection() {
            this.collectionShow = false
            this.collectionTitle = ''
            this.collectionUrl = ''
            this.collectionhasCopyright = false
            this.editCollectionIndex = ''
        },
        // 排序
        setSort() {
            const el = document.querySelectorAll('#tableSort .el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                onEnd: evt => {
                    const tempIndex = this.tableData.splice(evt.oldIndex, 1)[0]
                    let arr = []
                    this.tableData.splice(evt.newIndex, 0, tempIndex)
                    var _this = this
                    this.tablekey += 1
                    setTimeout(function() {
                        _this.setSort()
                    }, 0)

                }
            })
        },
        resetForm() {
            this.form.platform = ''
            this.form.checkList = []
            this.form.classify = ''
            this.form.isImportant = false
            this.form.textLive = false
            this.form.starttime = ''
            this.form.endtime = ''
            this.form.matchStatus = 0
            this.form.matchWay = 1
            this.form.hostTeam = ''
            this.form.guestTeam = ''
            this.form.title = ''
            this.form.subTitle = ''
            this.form.prospectHref = ''
            this.form.battlefieldHref = ''
            this.form.matchData = false
            this.hostTeamIcon = ''
            this.guestTeamIcon = ''
            this.hostTeamId = ''
            this.guestTeamId = ''
            this.tableData = []
            this.tableVideo = []
            this.tableCollection = []
        }
    },
    watch: {
        "hasCopyright": function() {
            if (this.hasCopyright === false) {
                this.openWays = [{
                    label: '默认浏览器',
                    value: '0'
                }]
            } else {
                this.openWays = [{
                        label: '默认浏览器',
                        value: '0'
                    },
                    {
                        label: 'app内打开',
                        value: '1'
                    }
                ]
            }
        },
        "hostTeams": function() {
            this.getHostTeamIcon()
        },
        "guestTeams": function() {
            this.getGuestTeamIcon()
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.teamflag {
    width: 36px;
    height: 36px;
    vertical-align: middle;
    display: inline-block;
    margin-left: 10px;
}
</style>
