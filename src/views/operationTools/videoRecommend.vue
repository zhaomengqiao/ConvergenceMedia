<template lang="html">
    <section class="videoRecommend">
        <el-row :gutter="20" v-loading="listLoading">
            <el-col :span="18">
                <el-card class="box-card">
                    <el-row class="mb-10">
                        <el-checkbox-group v-model="tableConfigCheck" class="pull-right">
                            <el-checkbox :label="item" v-for="(item,index) in tableConfig" :key="index">{{ item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </el-row>
                    <el-table :data="tableData" height="215" border highlight-current-row row-key="id" :key="key">
                        <el-table-column prop="title" label="标题" min-width="400" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column prop="newstype" label="栏目" width="120" :show-overflow-tooltip="true">
                        </el-table-column>
                        <!--新闻状态 Begin-->
                        <el-table-column v-for="(item,index) in tableConfigCheck" :key="index" :prop="item.prop" :label="item.label" width="100" v-if="item.prop == 'newsstatus'">
                        </el-table-column>
                        <!--新闻状态 End-->
                        <el-table-column prop="cTitle" label="独占状态" width="110">
                            <template slot-scope="scope">
        							<span v-if="scope.row.isoneself==0">非独占</span>
        							<span v-if="scope.row.isoneself==1">独占</span>
    						</template>
                        </el-table-column>
                        <el-table-column prop="createUser" label="操作人" width="120" :show-overflow-tooltip="true">
                        </el-table-column>
                        <!--分屏 Begin-->
                        <el-table-column v-for="(item,index) in tableConfigCheck" :key="index" :prop="item.prop" :label="item.label" width="70" align="center" v-if="item.prop == 'pagenum'">
                            <template slot-scope="scope">
        							<span v-if="scope.row.pagenum == -1">所有屏幕</span>
        							<span v-else>{{scope.row.pagenum}}</span>
        						</template>
                        </el-table-column>
                        <!--分屏 End-->
                        <!--位置 Begin-->
                        <el-table-column v-for="(item,index) in tableConfigCheck" :key="index" :prop="item.prop" :label="item.label" width="70" align="center" v-if="item.prop == 'idx'">
                        </el-table-column>
                        <!--位置 End-->
                        <!--区域 Begin-->
                        <el-table-column v-for="(item,index) in tableConfigCheck" :key="index" :prop="item.prop" :label="item.label" width="150" :show-overflow-tooltip="true" v-if="item.prop == 'provid'">
                        </el-table-column>
                        <!--区域 End-->
                        <!--开始时间 Begin-->
                        <el-table-column v-for="(item,index) in tableConfigCheck" :key="index" :prop="item.prop" :label="item.label" width="170" v-if="item.prop == 'startTime'">
                        </el-table-column>
                        <!--开始时间 End-->
                        <!--结束时间 Begin-->
                        <el-table-column v-for="(item,index) in tableConfigCheck" :key="index" :prop="item.prop" :label="item.label" width="170" v-if="item.prop == 'endTime'">
                        </el-table-column>
                        <!--结束时间 End-->
                    </el-table>
                </el-card>
                <el-card class="mt-10">
                    <div class="video-box" v-if="playerOptions.sources[0].src!==''">
                        <video-player :options="playerOptions" ref="videoPlayer"></video-player>
                    </div>
                    <div class="null-video" v-if="playerOptions.sources[0].src===''">
                        暂无视频
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card :body-style="{padding: '0px'}">
                    <div class="right_top_box">
                        <el-row class="mb-10">
                            <el-radio-group v-model="topType" size="medium" @change="changeToptype">
                                <el-radio-button label="news">置顶到新闻</el-radio-button>
                                <el-radio-button label="video">置顶到视频</el-radio-button>
                            </el-radio-group>
                        </el-row>
                        <el-row style="padding-bottom: 0px;margin-bottom:10px;" prop="searchUrl">
                            <el-col :span="18">
                                <el-input v-model.trim="form.searchUrl" placeholder="新闻ID或者URL"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="primary" icon="el-icon-search" @click="getNewsTopInfo"></el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-row style="margin-bottom:6px;">
                                <div style="display:inline-block">
                                    <span style="font-weight:700;margin-right:10px;">状态:</span>
                                    <span>{{ form.status }}</span>
                                    <el-button size="small" :loading="load.removeblack" @click="removeblack" style="margin-left:10px;" type="primary" v-if="form.status == '加黑'&&form.appfrom=='toutiao'">撤销加黑</el-button>
                                </div>
                                <div style="display:inline-block;margin-left:20px;">
                                    <span style="font-weight:700;margin-right:10px;">分类:</span>
                                    <span>{{ maintype }}</span>
                                </div>
                            </el-row>
                            <el-row :gutter="10" style="margin-bottom:10px;">
                                <div :span="8" v-if="form.imgList.length!=0" class="pull-left" style="overflow:hidden;height:80px;margin-right:10px;width:80px;background-color:#e5e5e5;position:relative" v-for="item in form.imgList">
                                    <img @click="imgShow=true" :src="item.src" alt="" style="cursor:pointer;width:100%;position:absolute;top:50%;transform:translateY(-50%)">
                                </div>
                                <el-col v-if="form.imgList.length==0" :span="24" style="height:60px;line-height:60px;color:#666;text-align:center">
                                    暂无封面
                                </el-col>
                            </el-row>
                        </el-row>
                    </div>
                    <!--右侧工具栏 Begin-->
                    <div style="padding: 0px 20px 20px 20px" class="el_all_width">
                        <el-form :inline="true" :model="form" ref="ruleForm" :rules="rules" label-position="left" label-width="85px" >
        					<el-form-item prop="appfrom" label-width="80px" label="操作平台">
        						<el-select v-model="form.appfrom" @change='changePlatform'>
        							<el-option v-for="(app,index) in newsAppList" :key="index" :label="app.label" :value="app.value"></el-option>
        						</el-select>
        					</el-form-item>
                            <el-form-item class="top-select__input" @click.native='dialogHandleOpen(0)' prop="newstype" style="width:100%">
                                <el-input v-model="form.newstype" size="small" placeholder="请点击选择栏目" :disabled="true" class="disable-click"></el-input>
                            </el-form-item>
                            <el-form-item class="top-select__input" @click.native='dialogHandleOpen(2)' prop="provid" style="width:100%">
                                <el-input v-model="form.provid" size="small" placeholder="请点击选择区域" :disabled="true" class="disable-click" style="width:100%"></el-input>
                            </el-form-item>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item prop="pagenum" style="width:100%">
                                        <el-select placeholder="请点击选择集合幕" size="small" v-model="form.pagenum" @change='getNewsTopList'>
                                            <el-option v-for="(item,index) in selectOptions.idxOptions" :key='index' :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="idx" style="width:100%">
                                        <el-select placeholder="请点击选择位置" size="small" v-model="form.idx" @change='getNewsTopList'>
                                            <el-option v-for="(item,index) in selectOptions.areasOptions" :key='index' :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item prop="timeQuantum" style="width:100%">
                                <el-date-picker size="small" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" v-model="form.timeQuantum" type="datetimerange" placeholder="选择时间范围" @change="getTopTime">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item prop="sourcetype" style="width:100%">
                                <el-select v-model="form.sourcetype" style="width:100%" size="small">
                                    <el-option v-for="(item,index) in selectOptions.typeOptions" :label="item.label" :key='index' :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="isoneself" label="独占" class="radio-el-form">
                                <el-radio-group v-model="form.isoneself" size="small">
                                    <el-radio v-for="(item,index) in selectOptions.dzOptions" :label="item.value" :key="index">{{ item.label }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item prop="issuper" label="强制置顶" class="radio-el-form">
                                <el-radio-group v-model="form.issuper" size="small">
                                    <el-radio v-for="(item,index) in selectOptions.qzOptions" :label="item.value" :key="index">{{ item.label }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-row>
                                <el-button type="primary" @click="handleSave" :disabled="form.status=='审核中'||form.status=='404'">置顶</el-button>
                            </el-row>
        				</el-form>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!--选择栏目Dialog Begin-->
        <el-dialog title="选择栏目" :visible.sync="typeVisible" size='small' :before-close="handleCloseType" :close-on-click-modal="false">
            <div>
                <el-checkbox-group v-model="newstype" >
                    <el-row :gutter="10">
                        <div v-for="(type,index) in newsTypeList" style="float: left;padding: 5px;width: 100px;" :id="type.typePy">
                            <el-checkbox v-if="type.children==null" :label="type.typeName" :key="type.typeId">{{type.typeName}}</el-checkbox>
                            <el-checkbox v-else v-model="type.checkAll" :indeterminate="type.indeterminate" :label="type.typeName" @change="handleCheckAllChange($event,type,index)">{{type.typeName}}</el-checkbox>
                            <div v-if='type.checkedCities.length!=0||type.checkAll' >
                                <el-checkbox-group v-model="type.checkedCities" @change="handleCheckedCitiesChange(type.checkedCities,type,index)">
                                    <el-checkbox v-for="(typec,indexc) in type.children"  :label="typec.typeName" :key="typec.typeId">{{typec.typeName}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-row>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCloseType">取 消</el-button>
                <el-button type="primary" @click="dialogHandleClose(0)">确定</el-button>
            </div>
        </el-dialog>
        <!--选择栏目Dialog End-->
        <!--选择地区Dialog Begin-->
        <el-dialog title="选择地区" :visible.sync="providVisible" :before-close="handleClosePro" :close-on-click-modal="false">
            <div style="height:250px">
                <el-checkbox-group v-model="provid">
                    <template v-for="areas in newsAreasList">
                        <el-col :span="4" style='padding: 5px 0;'> <el-checkbox :label="areas" :key="areas">{{areas}}</el-checkbox></el-col>
                    </template>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClosePro">取 消</el-button>
                <el-button type="primary" @click="dialogHandleClose(2)">确定</el-button>
            </div>
        </el-dialog>
        <!--选择地区Dialog End-->
        <!--封面dialog Begin-->
        <el-dialog :visible.sync="imgShow" :close-on-click-modal="false">
			<el-carousel height="450px">
				<el-carousel-item v-for="(item,index) in form.imgList" :key="index">
					<img :src="item.src" alt="" style="height:100%;display:block;margin: 0 auto">
				</el-carousel-item>
		    </el-carousel>
		</el-dialog>
        <!--封面dialog End-->
    </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import {
    getOperPlatform
} from '@/api/commonApi'
import {
    parseTime,
    contentRecommend
} from '@/utils'
import {
    newsType,
    newsAreas,
    vRecommendToVideoType,
    newsTopList,
    queryPlatDetail,
    searchVideoDetail,
    getVideoInfo,
    newsTopSave,
    checkStickIsConflict
} from '@/api/contentRecommend'

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
        return {
            imgShow: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
                shortcuts: contentRecommend
            },
            listLoading: false,
            tableConfigCheck: [],
            tableConfig: [{
                    prop: "pagenum",
                    label: "分屏"
                },
                {
                    prop: "idx",
                    label: "位置"
                },
                {
                    prop: "provid",
                    label: "区域"
                },
                {
                    prop: "startTime",
                    label: "开始时间"
                },
                {
                    prop: "endTime",
                    label: "结束时间"
                },
                {
                    prop: "newsstatus",
                    label: "新闻状态"
                }
            ],
            tableData: [],
            key: 0,
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
                    src: ''
                }]
            },
            form: {
                appfrom: '',
                newstype: '',
                status: '',
                provid: '',
                imgList: [],
                pagenum: '1',
                idx: '1',
                startTime: '',
                endTime: '',
                timeQuantum: [],
                sourcetype: '',
                channel: 1,
                sendAppfrom: '',
                apptypeid: '',
                issuper: '',
                sourcetype: '',
                isoneself: '0',
                searchUrl: '',
                rowkey: ''
            },
            selectOptions: {
                idxOptions: [{
                        value: '1',
                        label: '第一集合'
                    },
                    {
                        value: '2',
                        label: '第二集合'
                    },
                    {
                        value: '3',
                        label: '第三集合'
                    },
                    {
                        value: '4',
                        label: '第四集合'
                    },
                    {
                        value: '5',
                        label: '第五集合'
                    },
                    {
                        value: '6',
                        label: '第六集合'
                    },
                    {
                        value: '7',
                        label: '第七集合'
                    },
                    {
                        value: '8',
                        label: '第八集合'
                    },
                    {
                        value: '9',
                        label: '第九集合'
                    },
                    {
                        value: '10',
                        label: '第十集合'
                    },
                    {
                        value: '11',
                        label: '第十一集合'
                    },
                    {
                        value: '12',
                        label: '第十二集合'
                    },
                    {
                        value: '13',
                        label: '第十三集合'
                    },
                    {
                        value: '14',
                        label: '第十四集合'
                    },
                    {
                        value: '15',
                        label: '第十五集合'
                    },
                    {
                        value: '16',
                        label: '第十六集合'
                    },
                    {
                        value: '17',
                        label: '第十七集合'
                    },
                    {
                        value: '18',
                        label: '第十八集合'
                    },
                    {
                        value: '19',
                        label: '第十九集合'
                    },
                    {
                        value: '20',
                        label: '第二十集合'
                    },
                ],
                areasOptions: [{
                        value: '1',
                        label: '第一项'
                    },
                    {
                        value: '2',
                        label: '第二项'
                    },
                    {
                        value: '3',
                        label: '第三项'
                    },
                    {
                        value: '4',
                        label: '第四项'
                    },
                    {
                        value: '5',
                        label: '第五项'
                    },
                    {
                        value: '6',
                        label: '第六项'
                    }
                ],
                typeOptions: [{
                        value: 'news',
                        label: '新闻'
                    },
                    {
                        value: 'topic',
                        label: '专题'
                    }
                ],
                dzOptions: [{
                        value: '0',
                        label: '否'
                    },
                    {
                        value: '1',
                        label: '是'
                    },
                ],
                qzOptions: [{
                        value: '0',
                        label: '否'
                    },
                    {
                        value: '1',
                        label: '是'
                    },
                ]
            },
            topType: 'news',
            newsAppList: [],
            newsTypeList: [],
            newsAreasList: [],
            newstype: [],
            provid: [],
            maintype: '',
            typeVisible: false,
            providVisible: false,
            rules: {
                appfrom: [{
                    required: true,
                    message: '请选择操作平台',
                    trigger: 'blur'
                }, ],
                pagenum: [{
                    required: true,
                    message: '请选择集合幕',
                    trigger: 'blur'
                }, ],
                idx: [{
                    required: true,
                    message: '请选择位置',
                    trigger: 'blur'
                }, ],
                sourcetype: [{
                    required: true,
                    message: '请选择来源类型',
                    trigger: 'blur'
                }, ],
                isoneself: [{
                    required: true,
                    message: '请选择是否独占',
                    trigger: 'blur'
                }, ],
                issuper: [{
                    required: true,
                    message: '请选择是否强制置顶',
                    trigger: 'blur'
                }, ]
            },
            load: {
                removeblack: false
            }
        }
    },
    mounted() {
        this.newsTopInfo()
        let query = this.$route.query;
        if (query.data && query.data.rowkey) {
            this.$refs.ruleForm.resetFields();
            this.form.searchUrl = query.data.rowkey;
            this.form.appfrom = query.data.platfrom;
            this.getNewsTopInfo();
        }
    },
    methods: {
        newsTopInfo() {
            let user = this.$store.state.user
            let params
            // 平台暂时一样
            if (this.topType == "news") {
                // 视频置顶到新闻
                params = {
                    userName: user.name,
                    url: 'videoRecommendTools'
                }
            } else {
                // 视频置顶到视频
                params = {
                    userName: user.name,
                    url: 'videoRecommendTools'
                }
            }
            getOperPlatform(params).then((res) => {
                if (res.code === '00001') {
                    this.newsAppList = res.data;
                    this.form.appfrom = this.newsAppList[0].value
                    this.getClassify()
                    this.newsAreas()
                    this.queryPlatDetail()
                }
            })
        },
        queryPlatDetail() {
            var _that = this;
            let para = '';
            if (this.form.channel == 1) {
                para = 'area=' + this.form.appfrom + '_video';
            } else {
                para = 'area=' + this.form.appfrom + '_video_to_video';
            }
            queryPlatDetail(para).then((res) => {
                if (res.code === '00001') {
                    _that.loadOptions = false;
                    if (res.data) {
                        if (res.data.issuper) {
                            let issuper = res.data.issuper,
                                sourcetype = res.data.sourcetype;
                            let issuperArr = issuper.split(','),
                                sourcetypeArr = sourcetype.split(',');
                            this.selectOptions.qzOptions = [];
                            this.selectOptions.typeOptions = [];
                            this.form.sendAppfrom = res.data.appfrom;
                            this.form.apptypeid = res.data.apptypeid;
                            for (let i = 0, len = issuperArr.length; i < len; i++) {
                                this.selectOptions.qzOptions.push({
                                    value: issuperArr[i],
                                    label: issuperArr[i] === '0' ? '否' : '是'
                                })
                            }
                            this.form.issuper = this.selectOptions.qzOptions[0].value
                            for (let j = 0, leng = sourcetypeArr.length; j < leng; j++) {
                                if (sourcetypeArr[j] === 'news') {
                                    this.selectOptions.typeOptions.push({
                                        value: sourcetypeArr[j],
                                        label: '新闻'
                                    })
                                } else if (sourcetypeArr[j] === 'topic') {
                                    this.selectOptions.typeOptions.push({
                                        value: sourcetypeArr[j],
                                        label: '专题'
                                    })
                                } else if (sourcetypeArr[j] === 'otherlink') {
                                    this.selectOptions.typeOptions.push({
                                        value: sourcetypeArr[j],
                                        label: '外链'
                                    })
                                } else if (sourcetypeArr[j] === 'vote') {
                                    this.selectOptions.typeOptions.push({
                                        value: sourcetypeArr[j],
                                        label: '投票'
                                    })
                                } else if (sourcetypeArr[j] === 'adv') {
                                    this.selectOptions.typeOptions.push({
                                        value: sourcetypeArr[j],
                                        label: '广告'
                                    })
                                } else if (sourcetypeArr[j] === 'adv_h5') {
                                    this.selectOptions.typeOptions.push({
                                        value: sourcetypeArr[j],
                                        label: 'h5广告'
                                    })
                                } else if (sourcetypeArr[j] === 'video') {
                                    this.selectOptions.typeOptions.push({
                                        value: sourcetypeArr[j],
                                        label: '视频'
                                    })
                                }
                            }
                            this.form.sourcetype = this.selectOptions.typeOptions[0].value;
                        }
                    }
                    this.getNewsTopList()
                }
            });
        },
        newsAreas() {
            newsAreas('').then((res) => {
                this.newsAreasList = res.data
                this.provid = this.newsAreasList
                this.form.provid = this.newsAreasList.join(',')
            });
        },
        getNewsTopInfo() {
            if (this.form.searchUrl == '') {
                this.$message({
                    message: 'URL不能为空',
                    type: 'warning'
                })
                return
            }
            let para = 'url=' + this.form.searchUrl
            this.listLoading = true
            searchVideoDetail(para).then((res) => {
                if (res.code == '00001' && res.data) {
                    this.form.searchUrl = res.data.url;
                    this.maintype = res.data.urlmaintype
                    this.playerOptions.sources[0].src = JSON.parse(res.data.videominiajs)[0].src;
                    this.playerOptions.poster = eval(res.data.minijs)[0].src
                    if (res.data.pushtypeid) {
                        let newstypeStr = res.data.pushtypeid,
                            newstypeArr = newstypeStr.split(',');
                        this.newstype = newstypeArr;
                        var newsTypeList = [];
                        for (var i = 0; i < this.newsTypeList.length; i++) {
                            newsTypeList.push(this.newsTypeList[i].typeName)
                        }
                        var newstypeShowStr = this.arrayIntersection(newstypeArr, newsTypeList);
                    } else {
                        this.form.newstype = ''
                        this.newstype = []
                    }
                    this.form.title = res.data.contenttitle
                    // 封面回显
                    console.log('即将执行eval封面回显')
                    if (res.data.minijs) {
                        this.form.imgList = eval(res.data.minijs)
                    }
                    console.log('eval执行完毕')
                    // 状态
                    if (res.data.isupload == '-1') {
                        this.form.status = '审核中'
                    } else if (res.data.isban == '1') {
                        this.form.status = '404'
                    } else if (res.data.isblack == '1') {
                        this.form.status = '加黑'
                    } else {
                        this.form.status = '正常'
                    }

                    this.form.rowkey = res.data.rowkey
                }
                this.listLoading = false
            })
        },
        // 获取栏目
        getClassify() {
            if (this.topType === "news") {
                this.newsType()
            } else {
                this.vRecommendToVideoType()
            }
        },
        // 获取左侧列表
        getNewsTopList() {
            Array.prototype.indexOf = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) {
                        return i;
                    }
                }
                return -1;
            }
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            }
            let para = {
                apptype: this.form.apptypeid,
                content: this.form.searchUrl,
                endtime: this.form.endTime == '' ? '' : parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                index: this.form.idx,
                isoneself: this.form.isoneself,
                pagenum: this.form.pagenum,
                sourcetype: this.form.sourcetype,
                sttime: this.form.startTime == '' ? '' : parseTime(this.form.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                showpagenum: '1',
                channel: this.form.channel,
                showpagesize: '20',
                id: '',
                appfrom: this.form.sendAppfrom
            }
            newsTopList(para).then((res) => {
                if (res.code === '00001') {
                    for (var i = 0; i < res.data.list.length; i++) {
                        var arr = res.data.list[i].provid.split(',');
                        arr.remove('checkall');
                        arr.remove('notall');
                        res.data.list[i].provid = arr.join(',');
                    }
                    var urlids = ''
                    var urlidArr = []
                    res.data.list.forEach(item => {
                        if (item.urlId != '') {
                            urlidArr.push(item.urlId)
                        }
                    })
                    urlids = urlidArr.slice(0, 4).join(",")
                    this.getNewsInfo(urlids, res.data.list)
                    // this.tableData = res.data.list
                }
            })
        },
        // 置顶到新闻时获取栏目
        newsType() {
            var params = {
                parentId: '',
                area: this.form.appfrom
            };

            function compare(property) {
                return function(a, b) {
                    var value1 = a[property] == null ? 0 : 1;
                    var value2 = b[property] == null ? 0 : 1;
                    return value2 - value1;
                }
            }
            newsType(params).then(res => {
                if (res.data) {
                    this.newsTypeList = res.data;
                    for (var i = 0; i < this.newsTypeList.length; i++) {
                        this.newsTypeList[i].indeterminate = false;
                        this.newsTypeList[i].checkedCities = [];
                        this.newsTypeList[i].checkAll = false;
                    }
                    this.newsTypeList.sort(compare('children'));
                    var _this = this;
                    this.newsTypeList.forEach((item, index) => {
                        if (item.typeName == '头条' && _this.topType == 'news' && this.form.appfrom == 'toutiao') {
                            _this.newsTypeList.splice(index, 1)
                        }
                    })
                }
            });
        },
        // 视频置顶到视频的栏目
        vRecommendToVideoType() {
            let params = {
                area: this.form.appfrom
            }

            function compare(property) {
                return function(a, b) {
                    var value1 = a[property] == null ? 0 : 1
                    var value2 = b[property] == null ? 0 : 1
                    return value2 - value1
                }
            }
            vRecommendToVideoType(params).then((res) => {
                this.newsTypeList = res.data
                for (var i = 0; i < this.newsTypeList.length; i++) {
                    this.newsTypeList[i].indeterminate = false
                    this.newsTypeList[i].checkedCities = []
                    this.newsTypeList[i].checkAll = false
                }
                this.newsTypeList.sort(compare('children'))
            })
        },
        // 切换置顶到新闻/视频
        changeToptype(item) {
            this.getClassify()
            switch (this.topType) {
                case 'news':
                    this.form.channel = 1
                    break
                case 'video':
                    this.form.channel = 2
                    break
                default:
                    this.form.channel = 1
            }
            this.queryPlatDetail()
        },
        removeblack() {

        },
        changePlatform() {
            this.getClassify()
            this.queryPlatDetail()
        },
        getTopTime() {
            if (this.form.timeQuantum.length != 0) {
                this.form.startTime = this.form.timeQuantum[0]
                this.form.endTime = this.form.timeQuantum[1]
            }
        },
        dialogHandleOpen(index) {
            if (index === 0) {
                this.typeVisible = true
            } else if (index === 2) {
                this.provid = this.newsAreasList
                this.form.provid = this.provid.join(',')
                this.providVisible = true
            }
        },
        dialogHandleClose(index) {
            if (index == 0) {
                // this.form.newstype=this.newstype;
                let checkedCities = [];
                this.newsTypeList.map(function(item) {
                    if (item.checkedCities.length == 0) {
                        return null
                    } else {
                        checkedCities.push(item.checkedCities);
                    }
                    return item.checkedCities
                });
                let newstype = [];
                this.newstype.map(function(item) {
                    if (item == undefined) {
                        return null
                    } else {
                        newstype.push(item);
                    }
                    return item
                });

                this.form.newstype = [...newstype, ...checkedCities].join(',');
                this.typeVisible = false;
            } else {
                // this.form.provid=this.provid;
                this.form.provid = this.provid.join(',');
                this.providVisible = false;
            }
        },
        // 栏目关闭
        handleCloseType(done) {
            this.form.newstype = this.newstype.join(',');
            this.typeVisible = false;
        },
        // 地域关闭
        handleClosePro(done) {
            this.form.provid = this.provid.join(',');
            this.providVisible = false;
        },
        // 取出数组中相同的元素
        arrayIntersection(a, b) {
            var result = new Array();
            var c = b.toString();
            for (var i = 0; i < a.length; i++) {
                if (c.indexOf(a[i].toString()) > -1) {
                    result.push(a[i]);
                }
            }
            return result;
        },
        // 查询多条新闻信息
        getNewsInfo(urlids, listData) {
            let params = {
                urlids: urlids
            }
            if (urlids != '') {
                getVideoInfo(params).then(res => {
                    if (res.code == "00001") {
                        var data = res.data
                        listData.forEach(item => {
                            if (item.sourcetype == 'news') {
                                item.isblack = data[item.urlId] ? data[item.urlId].isblack : ''
                                item.isban = data[item.urlId] ? data[item.urlId].isban : ''
                                // 判断状态
                                if (item.isban == 1) {
                                    item.newsstatus = "404"
                                } else if (item.isblack == 1) {
                                    item.newsstatus = "加黑"
                                } else if (item.isblack == '' && item.isban == '') {
                                    item.newsstatus = "未知"
                                } else {
                                    item.newsstatus = "正常"
                                }
                            }
                        })
                    }
                })
            } else {
                listData.forEach(item => {
                    item.newsstatus = "--"
                })
            }
            this.tableData = listData
        },
        // 置顶操作
        handleSave() {
            this.$refs.ruleForm.validate((valid) => {
                let providPrefix = 'notall,'
                if (this.newsAreasList.length === this.form.provid.split(',').length) {
                    providPrefix = 'checkall,'
                }
                if (valid) {
                    let params = {
                        content: this.form.searchUrl,
                        endTime: this.form.endTime == '' ? '' : parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                        idx: this.form.idx,
                        isoneself: this.form.isoneself,
                        newstype: this.form.newstype,
                        provid: providPrefix + this.form.provid,
                        pagenum: this.form.pagenum,
                        sourcetype: this.form.sourcetype,
                        startTime: this.form.startTime == '' ? '' : parseTime(this.form.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                        channel: this.form.channel,
                        apptypeid: this.form.apptypeid,
                        issuper: this.form.issuper,
                        islocal: 0,
                        appfrom: this.form.sendAppfrom,
                        title: this.form.title,
                        source: this.form.source,
                        imgs: ''
                    }
                    let paramVertify = [
                        'content',
                        'endTime',
                        'startTime',
                        'title',
                        'appfrom',
                        'apptypeid',
                        'issuper',
                        'isoneself',
                        'newstype',
                        'provid',
                        'sourcetype',
                        'pagenum',
                        'idx'
                    ]
                    for (var i = 0; i < paramVertify.length; i++) {
                        var key = paramVertify[i]
                        if (params[key] == '') {
                            this.$alert('有数据为空，请完善数据', '提示', {
                                confirmButtonText: '确定'
                            })
                            return
                        }
                    }
                    checkStickIsConflict(params).then(res => {
                        if (res.code === '00001') {
                            newsTopSave(params).then(res => {
                                if (res.code === '00001') {
                                    this.$notify({
                                        title: '成功',
                                        message: '保存置顶成功',
                                        type: 'success'
                                    })
                                } else if (res.code === '00100') {
                                    this.$alert('该位置已经存在强制置顶记录', '提示', {
                                        confirmButtonText: '确定'
                                    })
                                    return
                                } else if (res.code === '00101') {
                                    this.$confirm('该位置已经存在独占置顶记录,是否继续？', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        newsTopSave(params).then((res) => {
                                            if (res.code === '00001') {
                                                this.$notify({
                                                    title: '成功',
                                                    message: '保存置顶成功',
                                                    type: 'success'
                                                })
                                            }
                                        })
                                    })
                                }
                                this.resetForm()
                            })
                        }
                    })
                }
            })
        },
        handleCheckedCitiesChange(value, typeOptions, index) {
            let checkedCount = value.length;
            typeOptions.checkedCities = value;
            typeOptions.checkAll = checkedCount === typeOptions.children.length;
            typeOptions.indeterminate = checkedCount > 0 && checkedCount < typeOptions.children.length;
            this.newsTypeList.splice(index, 1, typeOptions);
        },
        handleCheckAllChange(event, typeOptions, index) {
            if (typeOptions.children != null) {
                var cities = typeOptions.children.map(item => item.typeName);
                typeOptions.checkedCities = event ? cities : [];
                typeOptions.indeterminate = false;
                this.newsTypeList.splice(index, 1, typeOptions);
            }
            if (typeOptions.checkedCities.length != 0) {
                var div = document.getElementById(typeOptions.typePy);
                div.style = "float: left;padding: 5px;width:100%";
            } else {
                var div = document.getElementById(typeOptions.typePy);
                div.style = "float: left;padding: 5px;width: 100px;";
            }
        },
        resetForm() {
            this.playerOptions.sources[0].src = ''
            this.playerOptions.poster = ''
            this.form.status = ''
            this.maintype = ''
            this.form.imgList = []
            this.$refs.ruleForm.clearValidate()
        }
    }
}
</script>

<style  lang="scss" scoped>
.el-form-item {
    margin-bottom: 5px;
}

.box_div {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
}

.box_img {
    padding: 10px 0;
    box-sizing: border-box;
}

@media screen and (max-width:1369px) {
    .box_div {
        height: 210px;
    }
    .box_img {
        height: 200px;
    }
    .list-group {
        display: none;
    }
}

@media screen and (min-width:1367px) {
    .box_div {
        height: 300px;
    }
    .box_img {
        height: 290px;
    }
    .list-group {
        display: block;
    }
}

.box_toolbar {
    width: 90%;
    display: flex;
    flex-flow: row nowrap;
}

.box_radio {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
}

.cTag {
    margin: 0 5px;
}

.box_img img {
    width: auto;
}

.news_title {
    font-size: 20px;
}

.top-select__input {}

.right_top_box {
    position: relative;
    padding: 20px 20px 10px;
    margin-bottom: 10px;
}

.right_top_box:after {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #ccc;
}
.video-box {
    width: 560px;
    height: 400px;
    margin: 0 auto;
}
.null-video {
    width: 100%;
    height: 300px;
    line-height: 300px;
    font-size: 42px;
    color: #999;
    letter-spacing: 2px;
    text-align: center;
}
</style>
