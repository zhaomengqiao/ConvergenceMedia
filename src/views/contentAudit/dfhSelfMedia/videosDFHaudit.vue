<template lang="html">
    <section class="imgSelfExam videoSelfaudit">
        <el-card :body-style="{padding:'10px 20px'}" v-if="newExam!==null">
            <el-row :gutter="4">
                <el-col :span="4">
                    <el-button type="primary" size="small" icon="circle-check" @click="showPassDialog">通过</el-button>
                    <el-button type="danger" size="small" icon="circle-cross" @click="showRefuseDialog">拒绝</el-button>
                </el-col>
                <el-col :span="20" class="flex_center">
                    <el-tag type="danger" v-if="newExam.ispartner=='1'">合作媒体</el-tag>
                    <!--原创标记-->
                    <img src="../../../assets/audit_images/original.png"
                         v-if="newExam.isoriginal==1">
                    <!--政务号标记-->
                    <img src="../../../assets/audit_images/government.png"
                         v-if="newExam.dfhtype==3">
                    <!--东方号活动标记-->
                    <el-tag type="success" v-if="newExam.dfhactname" v-html="newExam.dfhactname"></el-tag>
                    <!-- <el-popover
                        ref="popoverTitle"
                        placement="bottom"
                        :value='popShow'
                        width="750"
                        trigger="click">
                        <div class="content_img">
                            <img v-for='(item,index) in newExam.imgmini' :src="item.src" :key="index"
                            style='height:180px;width:240px;'>
                        </div> -->
                        <span v-html="newExam.contenttitle" class="audit-title" style="vertical-align: middle"></span>
                    <!-- </el-popover> -->
                    <el-button type="primary" size="mini" @click="copyContent(newExam.contenttitle,$event)">复制</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top:10px" :body-style="{padding:'10px'}">
            <div class="url-next_page" v-if="newExam!==null">
                <div class="switch_div pull-left">
                    <el-button type="primary" @click="auditBegin = (!auditBegin)" size="small" style="margin-right:10px;">
                        {{ auditBegin?"停止审核(审核中)":"开始审核(停审中)" }}
                    </el-button>
                    <span>审核领域：</span>
                    <el-select v-model="selectAuditType" popper-class='tfmaintypeSelect' placeholder="请选择审核分类" style="width:100px;">
                        <el-option v-for="(item,index) in selectPlatforms" :key="index" :label="item.typeName" :value="item.typePy">
                        </el-option>
                    </el-select>
                </div>
                <div class="url-source">
                    <!--dfhviplv 判断东方号大V-->
                    <span class="source"
                          v-html="newExam.source"
                           :style="newExam.dfhviplv>0?{color: 'red'}:''"></span>
                    <img v-if='newExam.dfhviplv>0' src="../../../assets/audit_images/dfhvip.png" style="vertical-align:-3px;">
                    ：
                    <a :href="newExam.purl" target="_blank" class="url" v-html="newExam.purl"></a>
                    <el-button type="primary" size="mini" @click="copyContent(newExam.purl,$event)">复制</el-button>
                </div>
            </div>
            <el-row :gutter="20" type="flex">
                <el-col :span="4" style="min-width:230px;">
                    <el-card :body-style="{padding:'0px'}">
                        <div class="left-label hasBorderBottom">
                            <span class="title">当前待审：</span>
                            <span class="audit-num" style="color:#ff4949;font-weight:700" v-html="unCheckedNum"></span>
                        </div>
                        <div class="left-select hasBorderBottom" v-if="newExam!==null">
                            <el-select v-model="newExam.urlmaintypeid" placeholder="请选择一级分类" @change="getType(newExam.urlmaintypeid,2)">
                                <el-option
                                  v-for="item in firpy"
                                  :key="item.typeId"
                                  :label="item.typeName"
                                  :value="item.typeId"
                                  :disabled="item.typeId==700000">
                                </el-option>
                            </el-select>
                            <el-select v-model="newExam.tp2ndid" placeholder="请选择二级分类" @change="getType(newExam.tp2ndid,3)">
                                <el-option
                                  v-for="item in secpy"
                                  :key="item.typeId"
                                  :label="item.typeName"
                                  :value="item.typeId">
                                </el-option>
                            </el-select>
                            <el-select v-model="newExam.tp3rdid" placeholder="请选择三级分类">
                                <el-option
                                  v-for="item in thipy"
                                  :key="item.typeId"
                                  :label="item.typeName"
                                  :value="item.typeId">
                                </el-option>
                            </el-select>
                        </div>
                        <el-collapse v-model="activeName">
                            <el-collapse-item name="timeline">
                                <template slot="title">
                                    <div class="collapse-title">
                                        <div class="collapse-title_label">
                                            时效性：
                                        </div>
                                        <div class="collapse-title_content">
                                            {{ timeliness ===''?'暂未选择':timelinessOptions[timeliness].label }}
                                        </div>
                                    </div>
                                </template>
                                <div class="collapse-content">
                                    <el-radio-group v-model="timeliness">
                                        <div v-for="item in timelinessOptions" style="margin-bottom:6px;">
                                            <el-radio :label="item.value">{{ item.label }}</el-radio>
                                        </div>
            					   </el-radio-group>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item name="level">
                                <template slot="title">
                                    <div class="collapse-title">
                                        <div class="collapse-title_label">
                                            评级：
                                            <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                						      	<div slot="content">快捷键：<br/>数字键1~5对应1~5级；</div>
                						      	<img src='../../../assets/audit_images/wen.png' style="width: 14px" class="tip-question"/>
                    						</el-tooltip>
                                        </div>
                                        <div class="collapse-title_content">
                                            {{ imgLevel==''?'暂未选择':levelOptions[imgLevel-1].label }}
                                        </div>
                                    </div>
                                </template>
                                <div class="collapse-content">
                                    <el-radio-group v-model="imgLevel">
                                        <div v-for="item in levelOptions" style="margin-bottom:6px;">
                                            <el-radio :label="item.value">{{ item.label }}</el-radio>
                                        </div>
            					   </el-radio-group>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                        <div class="left-label hasBorderBottom" v-if="newExam!==null">
                            <span class="title" style="font-weight:700">优质：</span>
                            <span>
                                <el-checkbox v-model="isquality">是</el-checkbox>
                            </span>
                        </div>
                    </div>
                    </el-card>
                </el-col>
                <el-col :span="10" style="width:560px;box-sizing:content-box">
                    <el-card :body-style="{padding:'0px'}">
                        <video-player :options="playerOptions" ref="videoPlayer" v-if="playerOptions.sources[0].src!==''"></video-player>
                        <div class="null-video" v-if="playerOptions.sources[0].src===''">
                            暂无视频
                        </div>
                        <div class="left-tag hasBorderBottom">
                            <div class="flex-div" style="align-items:baseline">
                                <div class="left-title">标签：</div>
                                <div class="inline-content">
                                    <el-tag
                                        style="margin: 0 6px 6px 0"
                                        :key="tag"
                                        v-for="tag in dynamicTags"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag)">
                                        {{tag}}
                                    </el-tag>
                                    <el-input
                                        class="input-new-tag"
                                        v-if="inputVisible"
                                        style="width:140px;"
                                        v-model="inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="clearfix">
                            <el-col :span="6" style="padding-bottom:20px;min-width:170px;">
                                <div class="label-title">更新封面</div>
                                <div class="imgUpload_Box" v-if="newExam!==null">
                                    <img v-if="imageUrl" :src="imageUrl" class="small-single__img" id="coverpic">
                                    <!-- <el-upload
                                        class="small-single__uploader"
                                        style="margin:10px 0"
                                        :action="imgUploadUrl"
                                        :show-file-list="false"
                                        :before-upload="beforeUpload"
                                        :on-success="handleSuccess"
                                        :disabled="true">

                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload> -->
                                    <div class="imgUpload_Box_tools" v-if="imageUrl!=''">
                                        <i class="el-icon-zoom-in" @click="toBig"></i>
                                        <!-- <i class="el-icon-delete ml-10" @click="removeImg"></i> -->
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="16" style="padding-bottom:20px">
                                <div class="label-title">视频简介</div>
                                <el-input
                                    type="textarea"
                                    :maxlength='200'
                                    style="margin-top:10px;"
                                    :rows="3"
                                    placeholder="请输入简介内容"
                                    v-model="videoIntro">
                                </el-input>
                            </el-col>
                        </div>
                    </el-card>
                </el-col>
                <el-col style="flex:1">
                    <el-card :body-style="{padding:'10px'}">
                        <el-carousel trigger="click" height="360px" v-if="newExam!==null" :autoplay="false" indicator-position="none" :initial-index="nowIndex" :key="carouselKey">
                            <el-carousel-item v-for="(item,index) in newExam.cmsphoto" :key="index">
                                <div class="carousel_img">
                                    <el-row class="carousel_img-controls">
                                        <el-button type="primary" icon="el-icon-check" @click="setCover(item.src)">设为封面</el-button>
                                    </el-row>
                                    <img :src="item.src" alt="" style="width:auto;height:auto;max-width:100%;max-height:100%;display:block;">
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                        <div class="no_carousel" v-if="newExam===null">暂无图片</div>
                        <el-row class="video_pictures" :gutter="4" v-if="newExam===null">
                            <el-col :span="8" v-for="i in 12" :key="i">
                                <div class="video_pictures-item">
                                    <svg-icon icon-class="noImage" class-name="card-panel-icon" />
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class="video_pictures" :gutter="4" v-if="newExam!==null">
                            <el-col :span="8" v-for="(item,index) in newExam.cmsphoto" :key="index" style="margin-bottom:10px;">
                                <div class="pictureHasImg" @click="changeBigImg(item,index)">
                                    <img :src="item.src" alt="" style="width:auto;height:auto;max-width:100%;max-height:100%;display:block;">
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <!--点击图片显示轮播图-->
        <el-dialog :visible.sync="imgBigBox" top="5%">
            <el-carousel trigger="click" height="500px" :initial-index="nowCarousel" :autoplay="false" v-if="newExam!=null&&imgBigBox">
                <el-carousel-item v-for="(item,index) in newExam.imgs" :key="index">
                    <div class="carousel_img">
                        <el-row class="carousel_img-controls">
                            <el-button type="primary" icon="el-icon-check" @click="setCover">设为封面</el-button>
                        </el-row>
                        <img :src="item.src" alt="" style="width:auto;height:auto;max-width:100%;max-height:100%;display:block;">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
        <el-dialog title="视频审核"
                   :visible.sync="noPassVisible"
                   :close-on-click-modal="false"
                   >
            <span>
                <el-form :model="dialog" ref="dialogr">
                    <el-form-item label="拒绝原因:" prop="reasonSelect" :rules="[{ required: true, message: '必须选择原因'}]">
                        <el-select v-model="dialog.reasonSelect" ref="selectInput" placeholder="请选择拒绝原因" filterable style="width:100%">
                            <el-option-group
                                v-for="(group,index) in noPassedOptions"
                                :key="index"
                                :value="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    ></el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </el-form>
            </span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="refuse">确 定</el-button>
				<el-button @click="noPassVisible = false">取 消</el-button>
			</span>
		</el-dialog>
        <!--图片放大-->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="imageUrl">
        </el-dialog>
        <!--确认通过-->
        <el-dialog
            top="40vh"
            :visible.sync="passDialog"
            width="25%"
            :show-close = 'false'>
            <span style="display:flex;align-items:center"><i class="el-icon-warning" style="margin-right:10px;color:#E6A23C;font-size:30px"></i>是否确认审核通过</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="passDialog = false">取 消</el-button>
            <el-button type="primary" @click="pass">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import clip from '@/utils/clipboard'
import {
    imgContentToHtml
} from '@/utils/contentTransform'
import {
    getfileUpload
} from '@/api/operationTools'
import {
    removeDoExamData
} from '@/api/audit'
import {
    UncheckedNum,
    getVideoType,
    getVideoInfo,
    videoPassed,
    videoNoPassed
} from '@/api/audit'

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
            passDialog: false,
            dialog:{
  				reason:'',
  				reasonSelect:'',
  			},
            auditBegin: true,
            selectAuditType: '',
            selectPlatforms: [],
            unCheckedNum: 0,
            refuseForm: {},
            nowIndex: 0,
            carouselKey: 0,
            activeName: ['timeline', 'level'],
            auditType: 'selfmedia',
            imgUploadUrl: '',
            dialogVisible: false,
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
            imageUrl: '',
            oldImageUrl: '',
            popShow: false,
            imgBigBox: false,
            nowCarousel: 0,
            fold: {
                tag: true,
                level: true
            },
            dataList: [],
            newExam: null,
            // 分类
            firpy: [],
            secpy: [],
            thipy: [],
            // 标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            isquality: false,
            timeliness: 1,
            videoIntro: '',
            timelinessOptions: [{
                    label: '非时效性',
                    value: 0
                },
                {
                    label: '时效性',
                    value: 1
                },
                {
                    label: '未知',
                    value: 2
                }
            ],
            levelOptions: [{
                    label: '1级(普通级)',
                    value: 1
                },
                {
                    label: '2级(暴力血腥)',
                    value: 2
                },
                {
                    label: '3级(情色诱惑)',
                    value: 3
                },
                {
                    label: '4级(政治敏感)',
                    value: 4
                },
                {
                    label: '5级(内容低质)',
                    value: 5
                }
            ],
            imgLevel: '',
            selfInterva: '',
            // 拒审理由
            noPassVisible: false,
            noPassedOptions: [
				{
					label: '一 政治类',
					options: [
						{
							label: '101 发布内容涉及政治或敏感信息，违背相关现行政策与法律法规',
							value: '101 发布内容涉及政治或敏感信息，违背相关现行政策与法律法规'
						}
					]
				},
				{
					label: '二 色情淫秽、低俗类',
					options: [
						{
							label: '201 发布内容涉及色情、淫秽信息',
							value: '201 发布内容涉及色情、淫秽信息'
						},
						{
							label: '202 发布内容包含低俗内容',
							value: '202 发布内容包含低俗内容'
						}
					]
				},
				{
					label: '三 广告类',
					options: [
						{
							label: '321 视频内容中含有违规推广内容，请重新编辑后再次提交（视频内禁止手机、QQ、二维码、微信等广告）',
							value: '321 视频内容中含有违规推广内容，请重新编辑后再次提交（视频内禁止手机、QQ、二维码、微信等广告）'
						},
						{
							label: '322 内容涉嫌语音广告',
							value: '322 内容涉嫌语音广告'
						}
					]
				},
				{
					label: '四 旧闻、虚假信息',
					options: [
						{
							label: '401 文章内容描述违背科学常理',
							value: '401 文章内容描述违背科学常理'
						},
						{
							label: '402 文中描述涉嫌无中生有或捏造谣言',
							value: '402 文中描述涉嫌无中生有或捏造谣言'
						},
						{
							label: '403 发布内容包含未被证实或与客观事实相左内容',
							value: '403 发布内容包含未被证实或与客观事实相左内容'
						},
						{
							label: '404 发布内容为过时旧闻',
							value: '404 发布内容为过时旧闻'
						}
					]
				},
				{
					label: '五 标题类',
					options: [
						{
							label: '501 发布内容涉嫌标题党',
							value: '501 发布内容涉嫌标题党'
						},
						{
							label: '502 标题不完整或内容格式错误（含有特殊符号或句号、含有繁体字等）',
							value: '502 标题不完整或内容格式错误（含有特殊符号或句号、含有繁体字等）'
						},
						{
							label: '503 标题含错别字',
							value: '503 标题含错别字'
						},
						{
							label: '504 发布内容题文不符',
							value: '504 发布内容题文不符'
						},
						{
							label: '521 标题含不相关违规推广文字或ID',
							value: '521 标题含不相关违规推广文字或ID'
						}
					]
				},
				{
					label: '六 内容格式类',
					options: [
						{
							label: '609 正文含敏感词汇或图片敏感',
							value: '609 正文含敏感词汇或图片敏感'
						},
						{
							label: '610 内容部分涉嫌侵权',
							value: '610 内容部分涉嫌侵权'
						},
						{
							label: '612 文章内容与投稿征文活动主题无关',
							value: '612 文章内容与投稿征文活动主题无关'
						},
						{
							label: '621 视频内容不适合收录（无主题、无实质内容）',
							value: '621 视频内容不适合收录（无主题、无实质内容）'
						},
						{
							label: '622 封面不合规（存在封面模糊、水印、封面二维码或封面人物不完整等问题）',
							value: '622 封面不合规（存在封面模糊、水印、封面二维码或封面人物不完整等问题）'
						},
						{
							label: '623 封面与标题或内容不符',
							value: '623 封面与标题或内容不符'
						},
						{
							label: '624 视频画质模糊',
							value: '624 视频画质模糊'
						},
						{
							label: '625视频含其他平台水印',
							value: '625视频含其他平台水印'
						},
						{
							label: '626 视频压缩Pc端处理失败导致格式有误（视频反字幕、画面过小、视频翻转、没声音或不清晰、画面黑屏或不完整……）',
							value: '626 视频压缩Pc端处理失败导致格式有误（视频反字幕、画面过小、视频翻转、没声音或不清晰、画面黑屏或不完整……）'
						},
						{
							label: '627 视频内容为外文且无翻译',
							value: '627 视频内容为外文且无翻译'
						}
					]
				}
			]
        }
    },
    mounted() {
        this.imgUploadUrl = getfileUpload
        // 获取一级分类
        this.getType('-1', 1)
        this.mountedGetData()
        this.loadKey()
    },
    activated() { //keep-alive 组件激活
        this.loadKey(); //组件激活时重新监控键盘
    },
    methods: {
        checkedNum(subType) {
            let para = {
                type: this.auditType,
                subType: subType
            }
            UncheckedNum(para).then((res) => {
                if(res.code === '00001'){
                    this.unCheckedNum = res.data
                }
            })
        },
        mountedGetData() {
            this.checkedNum('video')
            let localData = localStorage.getItem('selfmedia_video')
            if (localData && JSON.parse(localData).length <= 3) {
                this.dataList = JSON.parse(localData)
                this.getDataList()
                console.log('获取 本地数据+接口数据')
            } else if (localData && JSON.parse(localData).length > 3) {
                this.getLocalData()
                console.log('获取 本地数据')
            } else {
                this.getDataList()
                console.log('获取 接口数据')
            }
        },
        // 获取审核分类
        getType(pid, level) {
            let params = {
                type: this.auditType,
                pid: pid,
                tlevel: level == 1 ? 1 : 0
            }
            if (pid == '') {
                return
            }
            getVideoType(params).then(res => {
                if (res.code === '00001') {
                    if (level == 1) {
                        this.firpy = res.data;
                        this.firpy.push({
							typeName: '请选择',
							typeId: '700000'
						})
                        this.selectPlatforms = res.data.slice();
                        this.selectPlatforms.unshift({
                            'typeName': '全部',
                            'typePy': ''
                        })
                    } else if (level == 2) {
                        this.secpy = res.data;
                        if (this.secpy.length == 0) {
                            this.newExam.tp2ndid = ''
                            this.newExam.tp3rdid = ''
                            return
                        }
                        this.thipy = []
                        let tp2nd = this.secpy.find((value) => {
                            if (this.newExam.tp2ndid != null && this.newExam.tp2ndid != '' && value.typeName.indexOf(this.newExam.tp2ndid) != -1) {
                                return true
                            }
                            return value.typeName.indexOf('其他') != -1
                        })
                        if (tp2nd == undefined) {
                            this.newExam.tp2ndid = this.secpy[0].typeId
                            this.newExam.tp3rdid = ''
                        } else {
                            this.newExam.tp2ndid = tp2nd.typeId
                            this.newExam.tp3rdid = ''
                        }
                    } else {
                        this.thipy = res.data
                        if (this.thipy.length == 0) {
                            this.newExam.tp3rdid = ''
                            return
                        }
                        let tp3rd = this.thipy.find((value) => {
                            if (this.newExam.tp3rdid != null && this.newExam.tp3rdid != '' && value.typeName.indexOf(this.newExam.tp3rdid) != -1) {
                                return true
                            }
                            return value.typeName.indexOf('其他') != -1
                        })

                        if (tp3rd == undefined) {
                            this.newExam.tp3rdid = this.thipy[0].typeId
                        } else {
                            this.newExam.tp3rdid = tp3rd.typeId
                        }
                    }
                }
            })
        },
        getDataList(type) {
            let params = {
                type: this.auditType,
                param: {
                    field: this.selectAuditType,
                    size: 3
                }
            }
            if (this.auditBegin) {
                getVideoInfo(params).then(res => {
                    let _this = this
                    if (res.data) {
                        this.dataList = this.dataList.concat(res.data.Beans)
                    }
                    if (this.dataList.length === 0) {
                        this.newExam = null
                        this.dynamicTags = []
                        this.playerOptions.sources[0].src = ''
                        this.playerOptions.poster = ''
                        this.videoIntro = ''
                        this.imageUrl = ''
                        if (type !== 'interval') {
                            if (this.dataList.length === 0) {
                                this.selfInterva = window.setInterval(() => {
                                    _this.getDataList('interval')
                                }, 30000)
                            }
                        }
                    } else {
                        clearInterval(this.selfInterva)
                        this.newExam = this.dataList[0]
                        // 视频信息
                        try {
                            this.playerOptions.sources[0].src = this.newExam.videominia[0].src
                            this.playerOptions.poster = this.newExam.imgminia[0].src
                        }catch(err) {
                            console.log(err)
                        }
                        this.imageUrl = ''
                        if (this.newExam.imgminia[0].src) {
                            this.imageUrl = this.newExam.imgminia[0].src
                            this.oldImageUrl = this.newExam.imgminia[0].src
                        }
                        // 简介
                        this.videoIntro = this.newExam.content
                        // 关键词
                        this.dynamicTags = this.newExam.tags ? this.newExam.tags.split(',') : []
                        localStorage.setItem('selfmedia_video', JSON.stringify(this.dataList))
                    }
                })
            }
        },
        // 给每个图绑定展示轮播图的事件
        getSlide() {
            let _this = this
            let imgsArr = []
        },
        // 获取本地数据
        getLocalData() {
            let localData = JSON.parse(localStorage.getItem('selfmedia_video'))
            this.dataList = localData
            this.newExam = this.dataList[0]
            try {
                this.playerOptions.sources[0].src = this.newExam.videominia[0].src
                this.playerOptions.poster = this.newExam.imgminia[0].src
            }catch(err) {
                console.log(err)
            }
            this.imageUrl = ''
            if (this.newExam.imgminia[0].src) {
                this.imageUrl = this.newExam.imgminia[0].src
                this.oldImageUrl = this.newExam.imgminia[0].src
            }
            // 简介
            this.videoIntro = this.newExam.content
            // 关键词
            this.dynamicTags = this.newExam.tags ? this.newExam.tags.split(',') : []
        },
        showPassDialog(){
            if (this.imgLevel === '') {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                })
                return
            }
            if(this.videoInfo){
                if (this.videoInfo.urlmaintypeid == '' || this.videoInfo.urlmaintypeid == null || this.videoInfo.urlmaintypeid == 700000) {
                    this.$message({
                        type: 'warning',
                        message: '请选择相应的分类再进行相关操作'
                    })
                    return
                }
            }
            this.passDialog = true
        },
        pass() {

            // 封面和原始一样就传空
            // if(this.oldImageUrl === this.imageUrl){
            //     coverpic = ''
            // }else{
            //     coverpic = this.imageUrl
            // }
            let params = {
                type: this.auditType,
                param: {
                    rowkey: this.newExam.rowkey,
                    keyword: this.dynamicTags.join(','),
                    gradelv: this.imgLevel,
                    tp1st:this.newExam.urlmaintypeid,
                    tp2nd:this.newExam.tp2ndid,
                    tp3rd:this.newExam.tp3rdid,
                    timeliness:this.timeliness,
                    isquality: Number(this.isquality)
                }
            }

            videoPassed(params).then((res) => {})
            this.dataList.shift()
            localStorage.setItem('selfmedia_video', JSON.stringify(this.dataList))
            this.mountedGetData()
            this.isquality = false
            this.passDialog = false
        },
        showRefuseDialog() {
            this.noPassVisible = true
        },
        refuse() {
            this.$refs.dialogr.validate((valid) => {
                if (valid) {
                    let params = {
                        type: this.auditType,
                        param: {
                            rowkey: this.newExam.rowkey,
                            reason: this.dialog.reasonSelect
                        }
                    }
                    videoNoPassed(params).then((res) => {})
                    this.dataList.shift()
                    localStorage.setItem('selfmedia_video', JSON.stringify(this.dataList))
                    this.mountedGetData()
                    this.isquality = false
                    this.noPassVisible = false
                }
            })
        },
        // 标签
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 权限控制
        getAuth() {
            let authorList = localStorage.getItem('authorList');
            // 通过
            if (authorList.indexOf('selfmedia/news/audit-pass') > -1) {
                this.isAuth.imgPassed = true;
            }
            // 拒绝
            if (authorList.indexOf('selfmedia/news/audit-refused') > -1) {
                this.isAuth.imgNoPassed = true;
            }
        },
        // 复制URL按钮
        copyContent(text, event) {
            clip(text, event)
        },
        // 上传封面
        beforeUpload(file) {

        },
        // 放大
        toBig() {
            this.dialogVisible = true
        },
        removeImg() {
            if(this.newExam.nocovermodify == 1){
                this.$message({
		            type: 'warning',
		            message: '该视频不允许修改封面'
			    })
                return false
            }
            this.imageUrl = ''
        },
        // 设置封面
        setCover(pic){
            if(this.newExam.nocovermodify == '1'){
                this.$message({
                    type: 'warning',
                    message: '该视频不允许修改封面'
                });
                return false
            }
            this.imageUrl = pic
            this.$notify({
                  title: '成功',
                  message: '设置封面成功',
                  type: 'success'
            })
        },
        // 切换轮播当前显示图
        changeBigImg(item, index) {
            this.nowIndex = index
            this.carouselKey += 1
        },
        handleSuccess(res, file) {
            let _this = this
            let width = 545
            let scaleMin = 1.75
            let scaleMax = 1.80
            let img = new Image()
            img.src = res.url
            let rw, rh, rate
            img.onload = () => {
                rw = img.width
                rh = img.height
                rate = rw / rh
                if (rw < width || rate > scaleMax || rate < scaleMin) {
                    _this.$message({
                        type: 'warning',
                        message: '上传图片尺寸不能宽不能小于550，标准比例为16:9'
                    })
                } else {
                    this.imageUrl = res.url
                }
            }
        },
        loadKey(){
            let _that = this;
            document.onkeydown = function(ev){
                if(ev.keyCode==49){
                    _that.imgLevel=1;
                }else if(ev.keyCode==50){
                    _that.imgLevel=2;
                }else if(ev.keyCode==51){
                    _that.imgLevel=3;
                }else if(ev.keyCode==52){
                    _that.imgLevel=4;
                }else if(ev.keyCode==53){
                    _that.imgLevel=5;
                }else if(ev.shiftKey==1&&ev.keyCode==13){
                    _that.showPassDialog();
                }else if(ev.shiftKey==1&&ev.keyCode==220){
                    _that.showRefuseDialog();
                }else if(ev.shiftKey==1&&ev.keyCode==90){
                    if(_that.popShow){
                        _that.popShow=false;
                    }else{
                        _that.popShow=true;
                    }
                }
            }
        }
    },
    watch: {
        "newExam": function(){
            if(this.newExam !== null){
                this.getType(this.newExam.urlmaintypeid,2)
                this.getType(this.newExam.tp2ndid,3)
            }
            // let _this = this
            // _this.$nextTick(() => {
            //     if(this.newExam){
            //         _this.popShow = true
            //     }
            // })
        },
        "noPassVisible": function() {
            var _this = this
            if (!this.noPassVisible) {
                document.onkeydown = null;
                this.loadKey()
            } else {
                // 移除键盘事件
                document.onkeydown = null;
                document.onkeydown = function(ev){
                    if(_this.noPassVisible&&ev.keyCode==13){
                        _this.refuse();
                    }
                }
                setTimeout(function() {
                    _this.$refs.selectInput.focus()
                }, 0)
            }
        },
        'passDialog': function(){
            if(this.passDialog){
                var _that = this
                document.onkeydown = null
                document.onkeydown = function(ev) {
                    if (ev.keyCode == 13) {
                        _that.pass();
                    }
                }
            }else{
                this.loadKey()
            }
        }
    },
    destroyed() {
        clearInterval(this.selfInterva)
        localStorage.removeItem("selfmedia_video")
        let params = {
            queue: 'selfmedia_video'
        }
        removeDoExamData(params).then((res) => {});
    }
}
</script>

<style lang="scss" scoped>
.audit-title {
    font-size: 20px;
    text-align: center;
    margin: 0 10px;
    color: #20a0ff;
    cursor: pointer;
}
.flex_center {
    display: flex;
    align-items: center;
    justify-content: center;
}
.url-next_page {
    position: relative;
    text-align: center;
    padding: 8px 5px;
    .url-source {
        text-align: center;
        font-size: 18px;
        .url {
            text-decoration: none;
            color: #20a0ff;
            &:hover {
                color: #4db3ff;
            }
        }
    }
    .next_btn-group {
        position: absolute;
        right: 10px;
        top: 5px;
    }
}
.left-label {
    font-size: 16px;
    padding: 10px 0;
    line-height: 36px;
    .title {
        font-weight: 700;
    }
}
.hasBorderBottom {
    border-bottom: 1px solid #ccc;
    padding: 10px;
    &:last-child {
        border: none;
    }
}
.left-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 6px;
}
.audit_img_item {
    height: 200px;
    display: flex;
    align-items: center;
    background-color: #ccc;
    text-align: center;
    img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        margin: 0 auto;
    }
}
.audit_content-box {
    min-height: 620px;
}
.null-data-content {
    color: #999;
    font-size: 40px;
    text-align: center;
    line-height: 620px;
}
.demo-block-control {
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    color: #d3dce6;
    cursor: pointer;
    transition: 0.2s;
    position: relative;
    &:hover {
        color: #20a0ff;
        background-color: #f9fafc;
    }
}
/**taobao**/
.taobao_price {
    background-color: #999;
    color: #fff;
    position: absolute;
    padding-right: 4px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.taobao_price:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: -9px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid #999;
    border-bottom: 10px solid transparent;
}
.null-keyword {
    padding: 20px 10px;
    font-size: 16px;
    color: #999;
    letter-spacing: 4px;
}
.collapse-title {
    padding: 0 10px 0 5px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.collapse-content {
    padding: 0 5px;
}
.null-video {
    width: 100%;
    height: 400px;
    line-height: 400px;
    font-size: 42px;
    color: #999;
    letter-spacing: 2px;
    text-align: center;
}
.flex-div {
    display: flex;
    align-items: center;
    .inline-label {
        font-size: 12px;
        display: inline-block;
        font-weight: bold;
    }
    .inline-content {
        flex: 1;
    }
}
.label-title {
    font-weight: 700;
    padding: 12px 0;
    font-size: 16px;
}
.imgUpload_Box {
    position: relative;
    width: 160px;
    height: 90px;
    text-align: center;
    line-height: 90px;
    font-size: 20px;
    cursor: pointer;
    &:hover .imgUpload_Box_tools {
        visibility: visible;
    }
}
.imgUpload_Box_tools {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    color: #fff;
    visibility: hidden;
}
.no_carousel {
    color: #999;
    height: 360px;
    line-height: 360px;
    font-size: 40px;
    text-align: center;
    letter-spacing: 4px;
}
.video_pictures {
    margin-top: 10px;
}
.video_pictures-item {
    height: 90px;
    margin-bottom: 10px;
    border: 1px solid #e4e4e4;
    font-size: 32px;
    color: #666;
    text-align: center;
    line-height: 90px;
}
.pictureHasImg {
    height: 90px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f3f3;
    cursor: pointer;
}
.carousel_img{
    margin:0 auto;
    display:flex;
    align-items:center;
    justify-content:center;
    height:100%;
    position: relative;
    &:hover .carousel_img-controls{
        visibility: visible
    }
}
.carousel_img-controls{
    visibility: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
</style>
