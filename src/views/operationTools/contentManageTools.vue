<template lang="html">
    <section class="content-manage">
        <el-row :gutter="10">
            <!--左侧区域 Begin-->
            <el-col :span="12">
                <el-card>
                    <el-row>
                        <!--工具条-->
                        <el-row class="toolbar" style="padding-bottom: 0px;">
                            <el-form :inline="true" :model="formData">
                                <el-row>
                                    <el-form-item label="平台">
                                        <el-select v-model="formData.platform" class="select-platform"
                                            filterable placeholder="选择平台" @change="getTypeList">
                                            <el-option
                                                v-for="(item,index) in platformOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="分类">
                                        <el-select v-model="formData.type" class="select-platform"
                                            filterable placeholder="选择分类" @change="hasBtnAuth">
                                            <el-option
                                                v-for="(item,index) in typeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="时间" v-if="formData.platformEnName=='toutiao'">
                                        <el-select v-model="timestamp" class="select-platform"
                                            filterable placeholder="选择时间">
                                            <el-option
                                                v-for="(item,index) in qualityTimestamp"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="领域" v-if="formData.platformEnName=='toutiao'">
                                        <el-select v-model="classify" class="select-platform"
                                            filterable placeholder="选择领域">
                                            <el-option
                                                v-for="(item,index) in qualityClassifyHasAll"
                                                :key="item.typeId"
                                                :label="item.typeName"
                                                :value="item.typePy"
                                                >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-row>
                                <!-- <el-row>
                                    <el-form-item label="信源">
                                        <el-input v-model="urlfrom" placeholder="输入信源网站地址进行查询" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="来源">
                                        <el-input v-model="source" placeholder="输入来源进行查询" :disabled="true"></el-input>
                                    </el-form-item>
                                </el-row> -->
                                <el-row>
                                    <el-form-item label="关键词" v-if="formData.platformEnName=='toutiao'">
                                        <el-input v-model="searchKeywords" placeholder="输入标题关键词进行查询"></el-input>
                                    </el-form-item>
                                    <el-form-item label="URL">
                                        <div class="input-error content-black-tool" style="display:inline-block">
                                            <el-input class="urlId-input" v-model="formData.urlId" placeholder="请输入url或者urlId进行查询" @blur="judgeUrl"></el-input>
                                            <p v-if="urlError">系统如无法判断该URL的类型，请手动选择</p>
                                        </div>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="demand">查询</el-button>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                            <el-row style="margin-top: 4px;">
                                <el-table
                                    ref="multipleTable"
                                    :data="tableData"
                                    border
                                    tooltip-effect="dark"
                                    height="400"
                                    style="width: 100%"
                                    v-loading="load.tableLoading"
                                    @selection-change="handleSelectionChange"
                                    @row-click="rowClick">
                                        <el-table-column
                                            type="selection"
                                            width="40">
                                        </el-table-column>
                                        <el-table-column
                                            label="标题"
                                            show-overflow-tooltip>
                                            <template slot-scope="scope">
                                              <el-button slot="reference"
                                                    class="dialog-span title-button"
                                                    style="width:100%;padding:0;line-height:24px;text-align:left;overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ scope.row.title }}</el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="source"
                                            label="来源"
                                            width="120">
                                        </el-table-column>
                                        <el-table-column
                                            prop="urlpv"
                                            label="阅读量"
                                            width="80"
                                            align="center"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column
                                            prop="ts"
                                            label="发布时间"
                                            width="152"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                </el-table>
                            </el-row>
                        </el-row>
                    </el-row>
                </el-card>
            </el-col>
            <!--左侧区域 End-->
            <!--右侧区域 Begin-->
            <el-col :span="12" v-loading="load.rightLoading">
                <el-card>
                    <el-row>
                        <label for="" class="contentTools_label clearfix">
                            <span class="contentTools_title pull-left">源地址：</span>
                            <span class="contentTools_content">{{ formData.address }}</span>
                        </label>
                    </el-row>
                    <el-row>
                        <label for="" class="contentTools_label clearfix">
                            <span class="contentTools_title pull-left">URL：</span>
                            <span class="contentTools_content">{{ formData.url }}</span>
                        </label>
                    </el-row>
                    <el-row>
                        <label for="" class="contentTools_label clearfix" style="width:160px">
                            <span class="contentTools_title pull-left">新闻状态：</span>
                            <span class="contentTools_content">{{ formData.newsStatus }}</span>
                        </label>
                        <label for="" class="contentTools_label clearfix" style="width:160px">
                            <span class="contentTools_title pull-left">去重状态：</span>
                            <span class="contentTools_content">{{ formData.repeatStatus }}</span>
                        </label>
                        <label for="" class="contentTools_label clearfix" style="width:200px">
                            <span class="contentTools_title pull-left">编辑人：</span>
                            <span class="contentTools_content">
                                <span v-if="!load.searchNewEditor">{{ formData.author }}</span>
                                <i class="el-icon-loading" v-if="load.searchNewEditor"></i>
                            </span>
                        </label>
                    </el-row>
                    <el-row>
                        <label for="" class="contentTools_label clearfix" style="width:160px">
                            <span class="contentTools_title pull-left">东方号：</span>
                            <span class="contentTools_content">{{ formData.dongfanghao }}</span>
                        </label>
                        <label for="" class="contentTools_label clearfix" style="width:160px">
                            <span class="contentTools_title pull-left">优质：</span>
                            <span class="contentTools_content">{{ formData.quality }}</span>
                        </label>
                        <label for="" class="contentTools_label clearfix" style="width:160px">
                            <span class="contentTools_title pull-left">置顶：</span>
                            <span class="contentTools_content">
                                <span v-if="!load.searchIsTop">{{ formData.isTop }}</span>
                                <i class="el-icon-loading" v-if="load.searchIsTop"></i>
                            </span>
                        </label>
                    </el-row>
                    <el-row>
                        <label for="" class="contentTools_label clearfix" style="width:270px">
                            <span class="contentTools_title pull-left">ROWKEY：</span>
                            <span class="contentTools_content">{{ formData.rowkey }}</span>
                        </label>
                        <label for="" class="contentTools_label clearfix" style="width:240px">
                            <span class="contentTools_title pull-left">分类：</span>
                            <span class="contentTools_content">{{ formData.classification }}</span>
                        </label>
                    </el-row>
                    <el-row class="manage-btn-group">
                        <!--香港-->
                        <!-- <el-button size="small"
                                   @click="addblack"
                                   :loading="load.addblack"
                                   >加黑(可重复调用)</el-button> -->
                        <!--加黑 按钮-->
                        <el-button size="small"
                                   v-if="blackBtnShow"
                                   @click="addBlackDialog = true"
                                   :loading="load.addblack"
                                   :disabled="!btnStatus.addblack||!btnAuth.addblack">加黑</el-button>
                        <!--撤销 按钮-->
                        <el-button size="small"
                                    v-if="!blackBtnShow"
                                    @click="removeblack"
                                    :loading="load.removeblack"
                                   :disabled="!btnStatus.removeblack||!btnAuth.removeblack">撤销</el-button>
                        <!--稿件替换按钮-->
                        <el-button size="small"
                                   @click="add404Dialog = true"
                                   :loading="load.add404"
                                   v-if="formData.platformEnName != 'xianggang'"
                                   :disabled="blackBtnShow||!btnStatus.add404||!btnAuth.add404">{{ (formData.platformEnName == 'toutiao'&& nowType=='文章')?'稿件替换':'稿件删除' }}</el-button>
                        <!--稿件删除按钮-->
                        <el-button size="small"
                                  @click="delete404Dialog = true"
                                  :loading="load.delete404"
                                  :disabled="blackBtnShow||!btnStatus.delete404||!btnAuth.delete404" v-if="(formData.platformEnName == 'toutiao'&& nowType=='文章')||(formData.platformEnName == 'xianggang')">稿件删除</el-button>
                        <!--允许评论-->
                        <el-button size="small"
                                   @click="addcommentban"
                                   :loading="load.addcommentban"
                                   :disabled="!btnStatus.addcommentban||!btnAuth.addcommentban">{{btnName.addcommentban}}</el-button>
                        <!--显示评论-->
                        <el-button size="small"
                                   @click="addcommentblk"
                                   :loading="load.addcommentblk"
                                   :disabled="!btnStatus.addcommentblk||!btnAuth.addcommentblk">{{btnName.addcommentblk}}</el-button>
                        <!--允许赞-->
                        <el-button size="small"
                                    @click="praiseContent"
                                    :loading="load.addcommentzan"
                                   :disabled="!btnStatus.addcommentzan||!btnAuth.addcommentzan">{{btnName.addcommentzan}}</el-button>
                        <!--允许踩-->
                        <el-button size="small"
                                    @click="trampleContent"
                                    :loading="load.addcommentcai"
                                   :disabled="!btnStatus.addcommentcai||!btnAuth.addcommentcai">{{btnName.addcommentcai}}</el-button>
                        <!--允许广告-->
                        <el-button size="small"
                                   @click="allowAd"
                                   :loading="load.addadvcontrol"
                                  :disabled="!btnStatus.addadvcontrol||!btnAuth.addadvcontrol">{{btnName.addadvcontrol}}</el-button>
                        <!--添加优质-->
                        <el-button size="small"
                                   v-if="formData.platformEnName == 'toutiao'&& nowType=='视频'"
                                   @click="addQuality"
                                   :loading="load.addquality"
                                  :disabled="!btnStatus.addquality||!btnAuth.addquality">{{btnName.addquality}}</el-button>
                    </el-row>
                    <el-row class="manage-btn-group" v-if="editRowShow">
                        <!--编辑-->
                        <el-button
                            size="small"
                            :disabled="nowType=='视频' || formData.rowkey == '' || formData.platform=='军事站' || formData.platform=='猫扑体育'"
                            @click="modify"
                        >编辑</el-button>
                        <!--置顶-->
                        <el-button
                            size="small"
                            :disabled="formData.newsStatus=='404'||formData.newsStatus=='加黑'||formData.platform!='东方头条'||nowType=='图集'|| formData.rowkey == ''"
                            @click="toTop"
                        >置顶</el-button>
                        <!--添加优质-->
                        <el-button
                            size="small"
                            :disabled="true"
                        >添加优质</el-button>
                        <!--审核通过-->
                        <el-button
                            size="small"
                            :disabled="true"
                        >审核通过</el-button>
                        <!--审核拒绝-->
                        <el-button
                            size="small"
                            :disabled="true"
                        >审核拒绝</el-button>
                        <!--预览正文-->
                        <el-button
                            size="small"
                            :disabled="formData.rowkey == ''"
                            @click="replyFormVisible=true"
                        >预览正文</el-button>
                    </el-row>
                </el-card>
                <el-card style="margin-top:10px;">
                    <!--标题、来源、标签等-->
                    <el-row style="margin:14px 0">
                        <el-row>
                            <label for="" class="contentTools_label clearfix" style="width:500px">
                                <span class="contentTools_title pull-left">标题：</span>
                                <template>
                                    <el-input v-model.trim="formData.title"
                                              v-if="formData.platform=='东方头条'&&formData.type!='图集'"
                                              size="small" placeholder="请输入标题" class="pull-left" style="width:80%">
                                        <el-button slot="append" @click="editTitle" type="primary">修改</el-button>
                                    </el-input>
                                    <span class="contentTools_content" v-else>{{ formData.title }}</span>
                                </template>
                            </label>
                        </el-row>
                        <el-row style="margin-top:10px;">
                            <label for="" class="contentTools_label clearfix" style="width:340px;">
                                <span class="contentTools_title pull-left">来源：</span>
                                <template>
                                    <el-input v-model.trim="formData.source"
                                              v-if="formData.platform=='东方头条'&&formData.type!='图集'"
                                              size="small" placeholder="请输入来源"
                                              class="pull-left" style="width:auto">
                                        <el-button slot="append" @click="editSource" type="primary">修改</el-button>
                                    </el-input>
                                    <span class="contentTools_content" v-else>{{ formData.source }}</span>
                                </template>
                            </label>
                        </el-row>
                        <el-row style="margin-top:10px;">
                            <label for="" class="contentTools_label clearfix" style="width:600px;line-height:30px">
                                <span class="contentTools_title pull-left">标签：</span>
                                <template>
            						<el-tag style='margin-right: 10px;'
            							  :key="tag"
            							  v-for="tag in formData.customtag"
            							  :closable="true"
            							  :close-transition="false"
            							  @close="handleClose(tag)"
            							>
            							{{tag}}
        							</el-tag>
                                    <span v-if="tagType!=''" style="display:inline-block">（{{ tagType }}）</span>
        							<el-input style="width: 100px;"
        							  class="input-new-tag"
        							  v-if="inputVisible"
        							  v-model.trim="inputValue"
        							  ref="saveTagInput"
        							  :maxlength='keywordsMax'
        							  size="mini"
        							  @keyup.enter.native="handleInputConfirm"
        							  @blur="handleInputConfirm"
        							>
        							</el-input>
        							<el-button class="button-new-tag" :disabled="formData.platformEnName!='toutiao' || nowType == '图集'" size="small" @click="showInput">添加关键词</el-button>
                                </template>
        					</label>
                        </el-row>
                        <el-row style="margin-top:10px;">
                            <label for="" class="contentTools_label clearfix" style="width:500px">
                                <span class="contentTools_title pull-left">时效性：</span>
                                <template>
                                    <el-radio-group :disabled="formData.platformEnName!='toutiao' || nowType == '图集'" v-model="formData.timeliness" @change="timelinessChange" style="height:30px;line-height:40px;">
                                        <el-radio :label="1">时效性</el-radio>
                                        <el-radio :label="0">非时效性</el-radio>
                                        <el-radio :label="2">未知</el-radio>
                                    </el-radio-group>
                                </template>
                            </label>
                        </el-row>
                        <el-row v-if="nowType=='视频'">
                            <el-upload
                                class="small-single__uploader"
                                style="margin:10px 0"
                                :action="imgUploadUrl"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess">
                                <img v-if="imageUrl" :src="imageUrl" class="small-single__img" id="coverpic">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" class="dialog-width">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                            <el-button type="primary" size="small" @click="videoCover" :loading="videoCoverLoading">修改封面</el-button>
                            <el-button type="primary" size="small" @click="dialogVisible = true">放大缩略图</el-button>
                        </el-row>
                    </el-row>
                    <!--封面替换-->
                    <!-- <el-row>
                        <label for="" class="contentTools_label clearfix" style="width:500px">
                            <span class="contentTools_title pull-left"></span>
                            <template>
                                <el-upload
                                    :action="fileUpload"
                                    accept='.jpg,.png'
                                    list-type="picture-card"
                                    :file-list="fileListShow"
                                    :on-preview="handlePictureCardPreview"
                                    :on-success="handleSuccess"
                                    :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog v-model="dialogVisible" :close-on-click-modal="false">
                                <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </template>
                        </label>
                    </el-row> -->
                </el-card>
            </el-col>
            <!--右侧区域 End-->
            <!--操作轨迹-->
            <div class="operationTrack" :class="operationTrackShow?'':'openOperationTrack'" v-if="formData.platform!='香港头条'">
                <el-tooltip effect="dark" content="操作轨迹" placement="top">
                    <div class="operationTrackBtn" @click="openQueryOperlist" style="cursor:pointer" v-show="!operationTrackShow">
                         <svg-icon icon-class="track" class-name="card-panel-icon" />
                    </div>
                </el-tooltip>
                <div>
                    <i class="el-icon-d-arrow-right" @click="operationTrackShow=false" style="cursor:pointer"></i>
                    <h2>{{ formData.title }}</h2>
                    <el-table
                        :data="operationTrackData"
                        highlight-current-row
                        tooltip-effect="dark"
                        stripe border
                        height="500"
                        style="width: 100%">
                        <el-table-column
                            prop="username"
                            label="用户"
                            width="90"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column
                            prop="logtype"
                            label="操作"
                            width="150"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column
                            prop="dateline"
                            :show-overflow-tooltip="true"
                            label="时间">
                            <template slot-scope="scope">
                                {{ format(parseInt(scope.row.dateline), 'yyyy-MM-dd HH:mm') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-row>
        <!--正文预览dialog-->
        <el-dialog title="页面预览" :visible.sync="replyFormVisible" top="5%" :close-on-click-modal="false">
			<div v-html="contentPreview" class="title-content-box" v-if="formData.type=='文章'">

			</div>
            <el-row :gutter="10" v-if="formData.type=='图集'">
                <el-col :span="6" :key="index" v-for='(item,index) in pictureInfo' style="height:310px;overflow:hidden;margin-bottom:10px;">
                    <div class="height:290px;overflow:hidden"><img class="box_img" style="height: 290px;" :src="item.src"/> </div>
                    <p style="text-align:center;margin:0;margin-bottom:10px">{{ item.text }}</p>
                </el-col>
            </el-row>
            <video-player :options="playerOptions" ref="videoPlayer" style="width:auto" v-if="formData.type=='视频'"></video-player>
		</el-dialog>
        <!--加黑理由dialog-->
        <el-dialog title="加黑理由" :visible.sync="addBlackDialog">
            <el-input v-model.trim="addBlackReason" auto-complete="off" placeholder="请输入加黑理由"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBlackDialog = false">取 消</el-button>
                <el-button type="primary" @click="addblack">确 定</el-button>
            </div>
        </el-dialog>
        <!--404理由dialog-->
        <el-dialog title="404理由" :visible.sync="add404Dialog">
            <el-input v-model.trim="add404Reason" auto-complete="off" :placeholder="(formData.platformEnName == 'toutiao'&& nowType=='文章')?'请输入稿件替换理由':'请输入稿件删除理由'"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="add404Reason = false">取 消</el-button>
                <el-button type="primary" @click="add404">确 定</el-button>
            </div>
        </el-dialog>
        <!--delete404理由dialog-->
        <el-dialog title="404理由" :visible.sync="delete404Dialog">
            <el-input v-model.trim="delete404Reason" auto-complete="off" placeholder="请输入稿件删除理由"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="delete404Reason = false">取 消</el-button>
                <el-button type="primary" @click="delete404">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import { contentToHtml } from '@/utils/contentTransform'
import {
    searchAuditStatus,
    videoDelQuality,
    videoAddQuality,
    getfileUpload,
    videoCover,
    changeVideoCustomTag,
    changeVideoTimeliness,
    queryOperlist,
    getRedKeyWords,
    yangSensitiveWords,
    searchNewEditor,
    searchIsTop,
    changeTimeliness,
    changeCustomTag,
    getHqualityClass,
    hQualityKeywords,
    blackSearch,
    addblack,
    removeblack,
    add404,
    delete404,
    addcommentban,
    addcommentblk,
    praiseContent,
    trampleContent,
    edittitle,
    editsource,
    allowAd
} from '@/api/operationTools';
export default {
    name: 'contentManageTool',
    components: {
        videoPlayer
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    data(){
        return {
            videoCoverLoading: false,
            dialogImageUrl: '',
            dialogVisible: false,
            imgUploadUrl: '',
            oldimageUrl: '',
            imageUrl: '',
            urlfrom: '',
            source: '',
            editRowShow: true,
            operationTrackShow: false,
            replyFormVisible: false,
            contentPreview: '',
            timestamp: new Date(new Date().toLocaleDateString()).getTime()-3*24*60*60*1000,
            // 标签参数
            inputVisible: false,
            inputValue: '',
            keywordsMax: 10,
            addTag: 0,
            formData: {
                urlId: '',
                timeliness: -1,
                oldTimeliness: -1,
                dongfanghao: '',
                quality: '',
                customtag: [],
                oldCustomtag: [],
                platform: '',
                platformEnName: '',
                type: '',
                title: '',
                source: '',
                urlfrom_input: '',
                source_input: '',
                keywords_input: '',
                nowApi: '',
                address: '',
                url: '',
                rowkey: '',
                newsStatus: '',
                repeatStatus: '',
                author: '',
                isTop: '',
                classification: '',
                cts: '',
                rdts: '',
                newstype: '',
                crawlerts: '',
                tpid: ''
            },
            nowType: '文章',
            newsInfo: '',
            pictureInfo: '',
            listLoading: false,
            urlError: false,
            // 加黑/撤销
            blackBtnShow: true,
            platformOptions: [],
            typeOptions: [],
            btnName: {
                addcommentban: '禁止评论',
                addcommentblk: '隐藏评论',
                addcommentzan: '禁止赞',
                addcommentcai: '禁止踩',
                addadvcontrol: '禁止广告',
                addquality: '添加优质'
            },
            // 按钮权限初始化
            btnAuth: {
                addblack: false,
                removeblack: false,
                add404: false,
                delete404: false,
                addcommentban: false,
                addcommentblk: false,
                addcommentzan: false,
                addcommentcai: false,
                addadvcontrol: false,
                addquality: false
            },
            // 按钮状态
            btnStatus: {
                addblack: false,
                removeblack: false,
                add404: false,
                delete404: false,
                addcommentban: false,
                addcommentblk: false,
                addcommentzan: false,
                addcommentcai: false,
                addadvcontrol: false,
                addquality: false
            },
            box_width:'',
            cont_width:'',
            tableData: [],
            operationTrackData: [],
            qualityTimestamp: [
                {
                    label: '不限',
                    value: ''
                },
                {
                    label: '1天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime()-24*60*60*1000
                },
                {
                    label: '3天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime()-3*24*60*60*1000
                },
                {
                    label: '7天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime()-7*24*60*60*1000
                },
                {
                    label: '30天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime()-30*24*60*60*1000
                }
            ],
            // 左侧分页
            searchKeywords: '',
            stkey_zixun: '',
            lastcol_zixun: '',
            splitwordsarr: '',
            currentPage: 1,
            total:0,
            classify: '',
            qualityClassifyHasAll: [],
            page_total:0,
            page_num:1,
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
            load: {
                searchNewEditor: false,
                searchIsTop: false,
                rightLoading: false,
                tableLoading: false,
                addblack: false,
                removeblack: false,
                add404: false,
                delete404: false,
                addcommentban: false,
                addcommentblk: false,
                addcommentzan: false,
                addcommentcai: false,
                addadvcontrol: false,
                addquality: false
            },
            redKeyWords: [],
            multipleSelection: [],
            isEnd: false,
            tagType: '',
            // 原因dialog
            addBlackDialog: false,
            add404Dialog: false,
            delete404Dialog: false,
            addBlackReason: '',
            add404Reason: '',
            delete404Reason: ''
        }
    },
    mounted(){
        this.imgUploadUrl = getfileUpload
        this.getOperPlatform();
        this.getHqualityClass();
        this.scrollLoadMore();
        // 管理跳转
        if(this.$route.query.url){
            this.formData.urlId = this.$route.query.url
            this.judgeUrl();
        }
    },
    methods: {
        videoCover(){
            var param = {
                rowkey: this.formData.rowkey,
                newurl: this.imageUrl
            }
            this.videoCoverLoading = true;
            videoCover(param).then(res => {
                if(res.code == '00001'){
                    this.demand();
                    this.$notify({
                        title: '成功',
                        message: '修改封面成功',
                        type: 'success'
                    });
                }
                this.videoCoverLoading = false;
            })
        },
        // 从本地权限列表获取
        getOperPlatform(){
            var authList = JSON.parse(localStorage.getItem('authorList'));
            var _this = this;
            //获取有权限的加黑平台
            if(authList.v4blank29){
                // 内容管理工具
                let contentManage = authList.v4blank29;
                if(contentManage.subItems==null||contentManage.subItems==''){ return false }
                contentManage.subItems.forEach(function(manage_item){
                    if(manage_item.cname == "内容管理工具"){
                        // 内容管理工具
                        if(manage_item.subItems==null||manage_item.subItems==''){ return false }
                        manage_item.subItems.forEach(function(manageTools_item){
                            // 内容管理工具 addblack
                            if(manageTools_item.subItems==null||manageTools_item.subItems==''){ return false }
                            if(manageTools_item.cname == "内容管理工具"){
                                manageTools_item.subItems.forEach(function(platform_item){
                                    // 获取平台下有权限的分类（新闻/视频图集）
                                    let typeArr = []
                                    if(platform_item.subItems==null||platform_item.subItems==''){ return false }
                                    platform_item.subItems.forEach(function(type_item){
                                        var label =  type_item.cname.split("-")[1];
                                        if(type_item.subItems==null||type_item.subItems==''){ return false }
                                        // 按钮权限
                                        let btnAuthArr = []
                                        // url api
                                        let apiUrl = '';
                                        type_item.subItems.forEach(function(btnAuth_item){
                                            // 按钮权限
                                            btnAuthArr.push(btnAuth_item.redirect.split("/")[2])
                                            // api
                                            apiUrl = type_item.subItems[0].redirect.split("/")[1]
                                        })
                                        typeArr.push({'label': label,'value': label, 'btnAuth': btnAuthArr, 'api': apiUrl});
                                    })
                                    // 获取平台-分类-按钮权限-api
                                    _this.platformOptions.push({'label': platform_item.cname,'value': platform_item.cname,'type': typeArr})
                                })
                            }
                        })
                    }
                })
            }
            _this.formData.platform = _this.platformOptions[0].value;
            // 将拼音匹配进去
            _this.platformOptions.forEach(item => {
                switch (item.label) {
                    case '东方头条':
                        item.enName = 'toutiao'
                        break;
                    case '东方体育':
                        item.enName = 'dfsport'
                        break;
                    case '军事站':
                        item.enName = 'junshi'
                        break;
                    case '扬子头条':
                        item.enName = 'yangzi'
                        break;
                    case '五星体育':
                        item.enName = 'wxsport'
                        break;
                    case '猫扑体育':
                        item.enName = 'maopu'
                        break;
                    case '香港头条':
                        item.enName = 'xianggang'
                        break;
                    case '猎奇新闻':
                        item.enName = 'lieqi'
                        break;
                }
            })
            _this.getTypeList();
        },
        // 类型赋值
        getTypeList(){
            // 分类有选时
            this.resetAuth();
            this.resetForm()
            if(this.formData.type!=''){
                this.hasBtnAuth();
            }
            var _this = this;
            _this.platformOptions.forEach(function(item){
                if(item.value == _this.formData.platform){
                    // 权限列表赋值
                    _this.typeOptions = item.type;
                }
            })
            _this.formData.type = _this.typeOptions[0].value;
            _this.getPlatformEnName()
            // 重新赋值
            //_this.tableData = [];
            //_this.formData.urlId = '';
        },
        // 按钮权限判断
        hasBtnAuth(){
            this.resetAuth();
            this.resetForm()
            var _this = this;
            // 重新赋值
            //_this.tableData = [];
            // _this.formData.urlId = '';
            _this.btnAuth = {
                addblack: false,
                removeblack: false,
                add404: false,
                delete404: false,
                addcommentban: false,
                addcommentblk: false,
                addcommentzan: false,
                addcommentcai: false,
                addadvcontrol: false,
                addquality: false
            }
            _this.platformOptions.forEach(function(platform_item){
                // 找到相对应平台
                if(platform_item.value == _this.formData.platform){
                    platform_item.type.forEach(function(type_item){
                        // 找到相应的类型
                        if(type_item.value == _this.formData.type){
                            type_item.btnAuth.forEach(function(auth_item){
                                // 寻找权限数组是否有相应的权限
                                for(var i in _this.btnAuth){
                                    if(auth_item == i){
                                        _this.btnAuth[i] = true
                                    }
                                }
                            })
                            // nowApi
                            _this.formData.nowApi = type_item.api;
                        }
                    })
                }
            })
            this.nowType = this.formData.type
        },
        // 判断URL
        judgeUrl(){
            // 判断是否含有 http://或者 https://
            var _this = this
            function hasUrlItem(word){
                return _this.formData.urlId.indexOf(word) != -1
            }
            function commonJS(platform){
                _this.formData.platform = platform;
                _this.urlError = false;
            }
            function judgeType(url){
                if(hasUrlItem(url + '/mobile')||hasUrlItem(url + '/a')){
                    _this.formData.type = '文章'
                    _this.nowType = "文章"
                }else if(hasUrlItem(url + '/pictures')||hasUrlItem('miniimg.eastday.com')){
                    _this.formData.type = '图集'
                    _this.nowType = "图集"
                }else if(hasUrlItem(url + '/video')||hasUrlItem('video.eastday.com')){
                    _this.formData.type = '视频'
                    _this.nowType = "视频"
                }
            }
            if(hasUrlItem('http://') || hasUrlItem('https://')){
                // 识别平台
                if(hasUrlItem('mini.eastday.com') || hasUrlItem('miniimg.eastday.com') || hasUrlItem('video.eastday.com')){
                    // 东方头条
                    // mini.eastday.com / miniimg.eastday.com / video.eastday.com
                    commonJS('东方头条');
                    judgeType('mini.eastday.com')
                }else if(hasUrlItem('sports.eastday.com')){
                    // 东方体育
                    // sports.eastday.com
                    commonJS('东方体育');
                }else if(hasUrlItem('mil.eastday.com')){
                    // 军事站
                    // mil.eastday.com
                    commonJS('军事站');
                }else if(hasUrlItem('yzwb.net')){
                    // 扬子头条
                    // yzwb.net
                    commonJS('扬子头条');
                    judgeType('yzwb.net')
                }else if(hasUrlItem('wa5.com')){
                    // 五星体育
                    // wa5.com
                    commonJS('五星体育');
                }else if(hasUrlItem('sports.mop.com')){
                    // 猫扑体育
                    // sports.mop.com
                    commonJS('猫扑体育');
                }else{
                    this.urlError = true;
                }
            }
        },
        // 搜索
        search(type){
            this.urlError = false;
            this.hasBtnAuth();
            let params = {
                url: this.formData.urlId,
                platform: this.formData.nowApi,
                nowPlat: this.formData.platform,
                type: this.formData.type
            }
            this.load.rightLoading = true;
            blackSearch(params).then(res => {
                if(res.code == "00001"){
                    if(res.data){
                        // 测试数据
                        // res.data = {
                        //     purl: "http://danzhou.hinews.cn/system/2017/12/21/031367006.shtml",
                        //     contenttitle: "张耕：抢抓新机遇 实现儋州新作为新发展新跨越",
                        //     source: "南海网",
                        //     url: "http://mini.eastday.com/mobile/171221104335245.html",
                        //     rowkey: "9223370523030560666",
                        //     content: '奥巴马习近平川普',
                        //     isblack: '0',
                        //     isupload: "1",
                        //     isban: "0",
                        //     kw: "机器",
                        //     keywords: "爬虫",
                        //     customtag: "人工",
                        //     timeliness: 0
                        // }
                        this.formData.address = res.data.purl;
                        this.formData.title = res.data.contenttitle;
                        this.formData.source = res.data.source;
                        this.formData.url = res.data.url;
                        this.formData.rowkey = res.data.rowkey;
                        if(this.formData.platformEnName == 'lieqi'){
                            this.formData.crawlerts = res.data.crawlerts;
                            this.formData.tpid = res.data.urlmaintypeid
                        }
                        // 选中优质列表的单行，不会刷新表格
                        if(type != "rowClick"){
                            this.tableData = [];
                            this.tableData.push({
                                title: (this.formData.platformEnName == 'xianggang'?((res.data.titlegbk!=''&&res.data.titlegbk!=null)?res.data.titlegbk:res.data.contenttitle):res.data.contenttitle),
                                source: (this.formData.platformEnName == 'xianggang'?((res.data.sourcegbk!=''&&res.data.sourcegbk!=null)?res.data.sourcegbk:res.data.source):res.data.source),
                                urlpv: '',
                                url: res.data.url,
                                ts: this.format(parseInt(res.data.crawlerts), 'yyyy-MM-dd HH:mm')
                            })
                            this.total = 1;
                        }

                        // 类型
                        if(res.data.newstype!=null&&res.data.newstype!=''){
                            switch (res.data.newstype) {
                                case 'video':
                                    this.formData.type = "视频"
                                    this.nowType = "视频"
                                    if(res.data.videominiajs){
                                        this.playerOptions.sources[0].src=JSON.parse(res.data.videominiajs)[0].src;
                                    }else{
                                        this.playerOptions.sources[0].src=JSON.parse(res.data.videoajs)[0].src;
                                    }
                                    break;
                                case 'picture':
                                    this.formData.type = "图集"
                                    this.nowType = "图集"
                                    break;
                                case 'news':
                                    this.formData.type = "文章"
                                    this.nowType = "文章"
                                    break;
                            }
                        }else{
                            if(this.formData.type == "视频"){
                                if(res.data.videominiajs){
                                    this.playerOptions.sources[0].src=JSON.parse(res.data.videominiajs)[0].src;
                                }else{
                                    this.playerOptions.sources[0].src=JSON.parse(res.data.videoajs)[0].src;
                                }
                            }
                        }
                        // 文章内容
                        this.newsInfo = res.data;
                        if(res.data.content!=null&&this.nowType == "文章"){
                        	this.newsInfo.content = contentToHtml(this.newsInfo);
                        }
                        // 图集内容
                        if(this.nowType == "图集"){
                            this.pictureInfo = JSON.parse(res.data.imgjs);
                            var imgText = res.data.content.split("!@#!@");
                            var _this = this;
                            imgText.forEach(function(item){
                                _this.pictureInfo.forEach(function(i){
                                    i.text = item;
                                })
                            })

                        }
                        // 视频封面
                        if(this.nowType == "视频"){
                            this.imageUrl = JSON.parse(res.data.miniajs)[0].src  + '?time=' + new Date().getTime();
                            this.oldimageUrl = JSON.parse(res.data.miniajs)[0].src  + '?time=' + new Date().getTime();
                            this.dialogImageUrl = JSON.parse(res.data.miniajs)[0].src  + '?time=' + new Date().getTime();
                        }
                        // 禁止/允许评论
                        if(res.data.nocomment == 0){
                            this.btnName.addcommentban = '禁止评论'
                        }else{
                            this.btnName.addcommentban = '允许评论'
                        }
                        // 隐藏/展示评论
                        if(res.data.hidcomment == 0){
                            this.btnName.addcommentblk = '隐藏评论'
                        }else{
                            this.btnName.addcommentblk = '展示评论'
                        }
                        // 允许/禁止 赞
                        if(res.data.noupvote == 0){
                            this.btnName.addcommentzan = '禁止赞'
                        }else{
                            this.btnName.addcommentzan = '允许赞'
                        }
                        // 允许/禁止 赞
                        if(res.data.nodownvote == 0){
                            this.btnName.addcommentcai = '禁止踩'
                        }else{
                            this.btnName.addcommentcai = '允许踩'
                        }
                        // 允许/禁止 广告
                        if(res.data.noadvs == 0||res.data.noadvs == ''||res.data.noadvs == null){
                            this.btnName.addadvcontrol = '禁止广告'
                        }else{
                            this.btnName.addadvcontrol = '允许广告'
                        }

                        // 添加/删除 优质
                        if(res.data.quality == 0||res.data.quality == ''||res.data.quality == null){
                            this.btnName.addquality = '添加优质'
                        }else{
                            this.btnName.addquality = '删除优质'
                        }

                        var isban,isblack,isupload;
                        // 加黑/404(扬子使用扬子字段)
                        switch (this.formData.platform) {
                            case 'yangzi':
                            isban = res.data.yzwbisban;
                            isblack = res.data.yzwbisblack;
                            isupload = res.data.isupload
                                break;
                            default:
                            isban = res.data.isban;
                            isblack = res.data.isblack;
                            isupload = res.data.isupload
                        }
                        switch (this.formData.type) {
                            case "文章":
                                this.contentPreview = contentToHtml(res.data,this.redKeyWords);
                                this.formData.newstype = 'news'
                            break;
                            case "图集":
                                this.formData.rdts = res.data.waprkey;
                                this.formData.newstype = 'picture'
                            break;
                            case "视频":
                                this.formData.rdts = res.data.randomts;
                                this.formData.newstype = 'video'
                            break;
                        }
                        this.formData.cts = res.data.crawlerts
                        // 香港免审 isupload=1
                        if(this.formData.platformEnName == 'xianggang'){
                            isupload = 1;
                        }
                        if(~~isupload == 0){
                            this.searchAuditStatus()
                            //this.formData.newsStatus = "审核中"
                        }else if(~~isban == 1){
                            this.formData.newsStatus = "404"
                            this.blackBtnShow = false;
                        }else if(~~isblack == 1 && ~~isban == 0){
                            this.formData.newsStatus = "加黑"
                            this.blackBtnShow = false;
                        }else if(~~isblack == 0 && ~~isban == 0){
                            this.formData.newsStatus = "正常"
                            this.blackBtnShow = true;
                        }else{
                            this.formData.newsStatus = ""
                            this.blackBtnShow = true;
                        }
                        this.btnShow();
                        // 去重状态
                        if(res.data.rmdupl == '1' && res.data.isdupl == '1'){
                            this.formData.repeatStatus = '被去重';
                        }else if(res.data.rmdupl == '0'){
                            this.formData.repeatStatus = '异常';
                        }else{
                            this.formData.repeatStatus = '正常';
                        }
                        // 分类
                        if(this.formData.platform == '东方体育'||this.formData.platform == '五星体育'){
                            this.formData.classification = res.data.tplv001;
                        }else if(this.formData.platform == '扬子头条'){
                            this.formData.classification = res.data.tp1st;
                        }else{
                            this.formData.classification = res.data.urlmaintype;
                        }
                        // 是否东方号
                        this.formData.dongfanghao = ((res.data.urlfrom == 'dongfanghao')?'东方号':'非东方号')
                        // 是否优质
                        if(res.data.quality){
                            this.formData.quality = ((~~res.data.quality == '0')?'非优质':'优质')
                        }
                        // 关键词
                        // 扬子专有字段
                        var kw,keywords,customtag;// 机器/爬虫/人工
                        switch (this.formData.platform) {
                            case '扬子头条':
                                kw = res.data.yzwbkw;
                                keywords = res.data.yzwbkeywords;
                                if(this.formData.type == '文章'){
                                    customtag = res.data.yzwbcustomtag;
                                }else{
                                    customtag = res.data.yzwbtags;
                                }
                                break;
                            default:
                                kw = res.data.kw;
                                keywords = (this.formData.platformEnName == 'xianggang'?((res.data.keywordsgbk!=''&&res.data.keywordsgbk!=null)?res.data.keywordsgbk:res.data.keywords):res.data.keywords);
                                if(this.formData.type == '文章'){
                                    customtag = res.data.customtag;
                                }else{
                                    customtag = res.data.tags;
                                }
                        }
                        if(customtag){
                            this.tagType = '人工标签'
                            this.formData.customtag = customtag ? customtag.split(','):[];
                            this.formData.oldCustomtag = JSON.parse(JSON.stringify(this.formData.customtag))
                        }else if(keywords){
                            this.tagType = '爬虫标签'
                            this.formData.customtag = keywords ? keywords.split(','):[];
                            this.formData.oldCustomtag = JSON.parse(JSON.stringify(this.formData.customtag))
                        }else if(kw){
                            this.tagType = '机器标签'
                            this.formData.customtag = kw ? kw.split(','):[];
                            this.formData.oldCustomtag = JSON.parse(JSON.stringify(this.formData.customtag))
                        }
                        // 时效性
                        if(res.data.timeliness){
                            this.formData.timeliness = Number(res.data.timeliness)
                            this.formData.oldTimeliness = JSON.parse(JSON.stringify(this.formData.timeliness))
                        }
                        // 回显编辑人
                        this.searchNewEditor(res.data.url)
                        // 回显是否置顶
                        this.searchIsTop(res.data.url)
                        // 正文预览(关键词区分，扬子用扬子词库)
                        if(this.formData.platform == "扬子头条"){
                            this.yangSensitiveWords()
                        }else{
                            this.getRedKeyWords()
                        }
                        // 操作轨迹(香港头条隐藏操作轨迹)
                        if(this.formData.platform != '香港头条'){
                            this.queryOperlist();
                        }
                    }else{
                        this.$message({
                            showClose: true,
                            message: '请选择与URL匹配的平台和类型',
                            type: 'warning'
                        });
                        this.resetAuth();
                    }
                }
                this.load.rightLoading = false;
            })
        },
        // 搜索后按钮状态
        btnShow(){
            var _this = this;
            switch (this.formData.newsStatus) {
                case '加黑':
                    // 在此添加加黑状态下不显示的按钮（默认所有按钮显示）
                    for(var key in _this.btnStatus){
                        switch (key) {
                            case 'addblack':
                                _this.btnStatus[key] = false;
                                break;
                            default:
                                _this.btnStatus[key] = true;
                        }
                    }
                    break;
                case '404':
                    for(var key in _this.btnStatus){
                        // 在此添加404状态下可显示的按钮（默认所有按钮不显示）
                        switch(key){
                            case 'add404':
                                _this.btnStatus[key] = true;
                                break;
                            case 'delete404':
                                _this.btnStatus[key] = true;
                                break;
                            case 'addquality':
                                _this.btnStatus[key] = true;
                                break;
                            default:
                                _this.btnStatus[key] = false;
                        }
                    }
                    break;
                case '审核中':
                    for(var key in _this.btnStatus){
                        _this.btnStatus[key] = false;
                    }
                    break;
                default:
                    for(var key in _this.btnStatus){
                        _this.btnStatus[key] = true;
                    }
            }
        },
        // 编辑标题
        editTitle(){
            var params={
                    param:{rowkey: this.formData.rowkey,title: this.formData.title},
                    platform: this.formData.nowApi
                }
             edittitle(params).then(res => {
                 if(res.code == "00001"){
                     this.$notify({
                         title: '成功',
                         message: '修改标题成功',
                         type: 'success'
                     });
                 }
            })
        },
        // 修改来源
        editSource(){
            var params={
                    param:{rowkey: this.formData.rowkey,source: this.formData.source},
                    platform: this.formData.nowApi
                }
            editsource(params).then(res => {
                if(res.code == "00001"){
                    this.$notify({
                        title: '成功',
                        message: '修改来源成功',
                        type: 'success'
                    });
                }
            })
        },
        // 加黑
        addblack(){
            if(this.addBlackReason == ''){
                this.$message({
                    type: 'warning',
                    message: '请填写相应的理由'
                });
                return false
            }
            var params={
                    param: {rowkey: this.formData.rowkey,reason: this.addBlackReason},
                    platform: this.formData.nowApi,
                    nowPlat: this.formData.platform,
                    type: this.formData.type,
                }
            this.addBlackDialog = false;
            this.load.addblack = true;
            addblack(params).then(res => {
                if(res.code=='00001'){
                    this.blackBtnShow = false;
                    this.$notify({
                        title: '成功',
                        message: '加黑成功',
                        type: 'success'
                    });
                    this.search();
                }
                this.load.addblack = false;
            })
        },
        // 撤销
        removeblack(){
            var params={
                    param: {rowkey: this.formData.rowkey},
                    platform: this.formData.nowApi,
                    nowPlat: this.formData.platform,
                    type: this.formData.type
                }
            this.load.removeblack = true;
            removeblack(params).then(res => {
                if(res.code=='00001'){
                    this.$notify({
                        title: '成功',
                        message: '撤销成功',
                        type: 'success'
                    });
                    this.search();
                }
                this.load.removeblack = false;
            })
        },
        // 404
        add404(){
            if(this.add404Reason == ''){
                this.$message({
                    type: 'warning',
                    message: '请填写相应的理由'
                });
                return false
            }
            var params={
                    param: {
                        rowkey: this.formData.rowkey,
                        reason: this.add404Reason,
                        crawlerts: this.formData.crawlerts,
                        tpid: this.formData.crawlerts
                    },
                    platform: this.formData.nowApi,
                    nowPlat: this.formData.platform,
                    type: this.formData.type,
                }
            this.add404Dialog = false;
            this.load.add404 = true;
            add404(params).then(res => {
                this.isAdd404 = true;
                if(res.code=='00001'){
                    this.$notify({
                        title: '成功',
                        message: '替换稿件成功',
                        type: 'success'
                    });
                    this.search();
                }
                this.load.add404 = false;
            })
        },
        // 删除稿件（东方头条）
        delete404(){
            if(this.delete404Reason == ''){
                this.$message({
                    type: 'warning',
                    message: '请填写相应的理由'
                });
                return false
            }
            var params={
                    param: {rowkey: this.formData.rowkey,reason: this.delete404Reason},
                    platform: this.formData.nowApi,
                    nowPlat: this.formData.platform,
                    type: this.formData.type,
                }
            this.delete404Dialog = false;
            this.load.delete404 = true;
            delete404(params).then(res => {
                if(res.code=='00001'){
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search();
                }
                this.load.delete404 = false;
            })
        },
        // 禁止/允许评论
        addcommentban(){
            let isban = 0;
            if(this.btnName.addcommentban == '允许评论'){
                isban = 0
            }else{
                isban = 2
            }
            var params={
                    param:{rowkey: this.formData.rowkey,isban: isban},
                    platform: this.formData.nowApi,
                    isban: isban
                }
            this.load.addcommentban = true;
            addcommentban(params).then(res => {
                if(res.code=='00001'){
                    let msg = res.ret;
                    this.$notify({
                        title: '成功',
                        message: msg,
                        type: 'success'
                    });
                    this.search();
                    this.load.addcommentban = false;
                }
            })
        },
        // 隐藏/显示 评论
        addcommentblk(status){
            let isblk = 0;
            if(this.btnName.addcommentblk == '展示评论'){
                isblk = 0
            }else{
                isblk = 1
            }
            var params={
                    param:{rowkey: this.formData.rowkey,isblk: isblk},
                    platform: this.formData.nowApi,
                    isblk: isblk,
                    type: this.formData.type
                }
            this.load.addcommentblk = true;
            addcommentblk(params).then(res => {
               if(res.code=='00001'){
                   let msg = res.ret;
                   this.$notify({
                       title: '成功',
                       message: msg,
                       type: 'success'
                   });
                    this.search();
                    this.load.addcommentblk = false;
                }
            })
        },
        // 赞
        praiseContent(status){
            let iszan = 0;
            if(this.btnName.addcommentzan == '允许赞'){
                iszan = 0
            }else{
                iszan = 1
            }
            var params={
                    param:{rowkey: this.formData.rowkey,iszan: iszan},
                    platform: this.formData.nowApi,
                    iszan: iszan,
                    type: this.formData.type
                }
            this.load.addcommentzan = true;
            praiseContent(params).then(res => {
                if(res.code=='00001'){
                    let msg = res.ret;
                    this.$notify({
                        title: '成功',
                        message: msg,
                        type: 'success'
                    });
                    this.search();
                }
                this.load.addcommentzan = false;
            })
        },
        // 踩
        trampleContent(status){
            let iscai = 0;
            if(this.btnName.addcommentcai == '允许踩'){
                iscai = 0
            }else{
                iscai = 1
            }
            var params={
                    param:{rowkey: this.formData.rowkey,iscai: iscai},
                    platform: this.formData.nowApi,
                    iscai: iscai,
                    type: this.formData.type
                }
            this.load.addcommentcai = true;
            trampleContent(params).then(res => {
                if(res.code=='00001'){
                    let msg = res.ret;
                    this.$notify({
                        title: '成功',
                        message: msg,
                        type: 'success'
                    });
                    this.search();
                }
                this.load.addcommentcai = false;
            })
        },
        // 允许/禁止广告
        allowAd(){
            let isad = 0;
            if(this.btnName.addadvcontrol == '允许广告'){
                isad = 0
            }else{
                isad = 1
            }
            var params={
                    param:{rowkey: this.formData.rowkey,isadvs: isad},
                    platform: this.formData.nowApi,
                    isad: isad,
                    type: this.formData.type
                }
            this.load.addadvcontrol = true;
            allowAd(params).then(res => {
                if(res.code=='00001'){
                    let msg = res.ret;
                    this.$notify({
                        title: '成功',
                        message: msg,
                        type: 'success'
                    });
                    this.search();
                }
                this.load.addadvcontrol = false;
            })
        },
        // 添加/删除优质
        addQuality(){
            this.load.addquality = true;
            var params = {
                rowkey: this.formData.rowkey
            }
            if(this.btnName.addquality == '添加优质'){
                videoAddQuality(params).then(res => {
                    if(res.code == "00001"){
                        this.$notify({
                            title: '成功',
                            message: '添加优质成功',
                            type: 'success'
                        });
                        this.search();
                    }
                    this.load.addquality = false;
                })
            }else{
                videoDelQuality(params).then(res => {
                    if(res.code == "00001"){
                        this.$notify({
                            title: '成功',
                            message: '删除优质成功',
                            type: 'success'
                        });
                        this.search();
                    }
                    this.load.addquality = false;
                })
            }
        },
        // 初始化权限
        resetAuth(){
            this.btnAuth = {
                addblack: false,
                removeblack: false,
                add404: false,
                delete404: false,
                addcommentban: false,
                addcommentblk: false,
                addcommentzan: false,
                addcommentcai: false,
                addadvcontrol: false,
                addquality: false
            }
            this.btnStatus = {
                addblack: false,
                removeblack: false,
                add404: false,
                delete404: false,
                addcommentban: false,
                addcommentblk: false,
                addcommentzan: false,
                addcommentcai: false,
                addadvcontrol: false,
                addquality: false
            }
            this.newsInfo = '';
            this.pictureInfo = '';
        },
        demand(){
            if(this.formData.platform == '东方头条' && this.formData.urlId == ""){
                this.hQualityKeywords("搜索")
            }else{
                this.search()
            }
        },
        // 表格选择
        handleSelectionChange(val){
            console.log(val)
            this.multipleSelection = val;
            if(this.multipleSelection.length == 1){
                this.resetAuth();
                this.hasBtnAuth();
                this.formData.urlId = this.multipleSelection[0].url;
                this.search("rowClick");
                this.editRowShow = true;
            }else if(this.multipleSelection.length >= 2){
                this.editRowShow = false;
                this.resetAuth();
                this.resetForm()
            }else{
                this.editRowShow = true;
                this.resetAuth();
                this.resetForm()
            }
        },
        // 单行点击
        rowClick(row,event,column){
            if(row){
                this.$refs.multipleTable.toggleRowSelection(row);
            }
        },
        // 领域
        getHqualityClass(){
            getHqualityClass().then(res => {
                if(res.code == "00001"){
                    this.qualityClassifyHasAll = res.data;
                    this.qualityClassifyHasAll.unshift({
                        'typeName': '全部领域',
                        'typePy': ''
                    })
                    this.classify = this.qualityClassifyHasAll[0].typePy
                }
            });
        },
        // 优质内容列表
        hQualityKeywords(type){
            this.resetForm();
            this.resetAuth();
            this.hasBtnAuth();
            if(type == "搜索"){
                this.stkey_zixun = '';
                this.lastcol_zixun = '';
                this.splitwordsarr = '';
            }
            let params = {
                keywords: this.searchKeywords,
                maintype: this.classify,
                stkey_zixun: this.stkey_zixun,
                lastcol_zixun: this.lastcol_zixun,
                splitwordsarr: this.splitwordsarr,
                timelimit: this.timestamp,
                newsnum: 10
            }
            this.load.tableLoading = true
            hQualityKeywords(params).then(res => {
                if(res.code == "00001"){
                    if(type == '搜索'){
                        var data;
                        if(this.searchKeywords!=''){
                            data = res.data.zixun.data;
                            data.forEach(item => {
                                item.ts = this.format(parseInt(item.ts), 'yyyy-MM-dd HH:mm')
                            })
                        }else{
                            data = res.data.data;
                            data.forEach(item => {
                                item.title = item.topic;
                                item.ts = item.date
                            })
                        }
                        this.tableData = data;
                    }else{
                        var data;
                        if(this.searchKeywords!=''){
                            data = res.data.zixun.data;
                            if(data){
                                data.forEach(item => {
                                    item.ts = this.format(parseInt(item.ts), 'yyyy-MM-dd HH:mm')
                                })
                            }
                        }else{
                            data = res.data.data;
                            if(data){
                                data.forEach(item => {
                                    item.title = item.topic;
                                    item.ts = item.date
                                })
                            }
                        }
                        var _this = this;
                        if(data&&data!=''&&data!=null&&data.length!=0){
                            data.forEach(item => {
                                _this.tableData.push(item)
                            })
                        }
                        // this.tableData = this.tableData.concat(data);
                    }
                    if(this.searchKeywords==''){
                        this.stkey_zixun = res.data.endkey;
                    }else{
                        if(res.data.zixunsize == 0){
                            this.isEnd = true
                        }else{
                            this.stkey_zixun = res.data.zixun.stkey;
                            this.lastcol_zixun = res.data.zixun.lastcol;
                            this.splitwordsarr = res.data.splitwordsarr;
                            this.isEnd = false
                        }
                    }
                }
                this.load.tableLoading = false
            });
        },
        //时间戳转换
        format(time, format){
            var t = new Date(time);
            var tf = function(i){return (i < 10 ? '0' : '') + i};
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                switch(a){
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                }
            })
        },
        // 删除标签
        handleClose(tag) {
            this.formData.oldCustomtag = JSON.parse(JSON.stringify(this.formData.customtag))
            this.formData.customtag.splice(this.formData.customtag.indexOf(tag), 1);
            this.addTag = this.formData.customtag.length;
            // 修改标签
            this.changeCustomTag();
        },
        // 新增标签
        handleInputConfirm() {
            this.formData.oldCustomtag = JSON.parse(JSON.stringify(this.formData.customtag))
            let inputValue = this.inputValue;
            if(inputValue) {
                this.formData.customtag.push(inputValue);
            }
            this.addTag = this.formData.customtag.length;
            this.inputVisible = false;
            this.inputValue = '';
            // 修改标签
            this.changeCustomTag();
        },
        // 显示出新增标签的input
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //下拉加载
        scrollLoadMore(){
            // 获取element-ui定义好的scroll盒子
            const SELECTWRAP_DOM = document.querySelector('.el-table__body-wrapper');
            var _this = this;
            SELECTWRAP_DOM.onscroll = function(){
                if(SELECTWRAP_DOM.scrollHeight <= SELECTWRAP_DOM.clientHeight + SELECTWRAP_DOM.scrollTop){
                    if(this.isEnd){
                        return false
                    }
                    _this.hQualityKeywords();
                }
            }
        },
        // 获取当前平台英文
        getPlatformEnName(){
            var _this = this;
            _this.platformOptions.forEach(item => {
                if(item.label == _this.formData.platform){
                    _this.formData.platformEnName = item.enName
                }
            })
        },
        // 查询最新操作人
        searchNewEditor(url){
            let param = {
                url: url,
                platform: this.formData.platformEnName
            }
            this.load.searchNewEditor = true
            searchNewEditor(param).then(res => {
                // 状态码不为 00001 均显示loading状态
                if(res.code == "00001"){
                    this.formData.author = res.data
                    this.load.searchNewEditor = false
                }
            })
        },
        // 查询是否置顶
        searchIsTop(url){
            if(this.nowType == '图集'){ return }
            var newstype = (this.nowType == '文章')?'news':'video'
            let param = {
                url: url,
                platform: this.formData.platformEnName,
                newstype: newstype
            }
            this.load.searchIsTop = true
            searchIsTop(param).then(res => {
                if(res.code == "00001"){
                    this.formData.isTop = res.data?'置顶':'未置顶'
                    this.load.searchIsTop = false
                }
            })
        },
        // 修改时效性
        changeTimeliness(){
            if(this.formData.platformEnName != 'toutiao'){ return }
            let param = {
                rowkey: this.formData.rowkey,
                timeliness: this.formData.timeliness,
                oldtimeliness: this.formData.oldTimeliness
            }
            if(this.nowType == '文章'){
                changeTimeliness(param).then(res => {
                    if(res.code == "00001"){
                        this.formData.oldTimeliness = JSON.parse(JSON.stringify(this.formData.timeliness))
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }
                })
            }else if(this.nowType == '视频'){
                changeVideoTimeliness(param).then(res => {
                    if(res.code == "00001"){
                        this.formData.oldTimeliness = JSON.parse(JSON.stringify(this.formData.timeliness))
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }
                })
            }
        },
        // 修改关键词
        changeCustomTag(){
            // 避免回车 和 失去焦点触发两次请求
            if(this.formData.customtag.join(',')==this.formData.oldCustomtag.join(',')){
                return
            }
            if(this.formData.platformEnName!='toutiao' || this.nowType == '图集'){
                return
            }
            let param = {
                rowkey: this.formData.rowkey,
                customtag: this.formData.customtag.join(','),
                oldcustomtag: this.formData.oldCustomtag.join(',')
            }
            if(this.nowType == '文章'){
                changeCustomTag(param).then(res => {
                    if(res.code == "00001"){

                    }
                })
            }else if(this.nowType == '视频'){
                changeVideoCustomTag(param).then(res => {
                    if(res.code == "00001"){

                    }
                })
            }
        },
        // 修改时效性触发
        timelinessChange(){
            if(this.formData.timeliness == this.formData.oldTimeliness){ return }
            if(this.formData.rowkey == ''){ return }
            this.$confirm('是否修改该条信息的时效性?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.changeTimeliness()
            }).catch(() => {
                this.formData.timeliness = this.formData.oldTimeliness
            });
        },
        // 编辑
        modify() {
            this.$router.push({path:'/contentEdit',query:{rowkey:this.formData.url,type:'newsEdit',platfrom:this.formData.platformEnName}});
        },
        // 置顶
        toTop() {
            var type = ''
            switch (this.nowType) {
                case '文章':
                    type = 'newsTop'
                    break;
                case '视频':
                    type = 'videoTop'
                    break;
            }
            this.$router.push({path:'/content/recommend',query:{data: {rowkey:this.formData.url, platfrom:this.formData.platformEnName} ,type: type,redirectType: 'contentManage'}});
        },
        // 扬子敏感词
        yangSensitiveWords(){
            yangSensitiveWords().then(res => {
                if(res.code == "00001"){
                    this.redKeyWords = res.data;
                }
            })
        },
        // 其他敏感词
        getRedKeyWords(){
            getRedKeyWords().then(res => {
                if(res.code == "00001"){
                    this.redKeyWords = res.data
                }
            })
        },
        // 展开操作轨迹列表
        openQueryOperlist(){
            this.operationTrackShow = true;
        },
        // 操作轨迹列表
        queryOperlist(){
            let param = {
                url: this.formData.url,
                platform: this.formData.platformEnName
            }
            queryOperlist(param).then(res => {
                if(res.code == "00001"){
                    this.operationTrackData = res.data
                }
            })
        },
        // 初始化右侧
        resetForm(){
            this.formData.address = '';
            this.formData.url = '';
            this.formData.newsStatus = '';
            this.formData.repeatStatus = '';
            this.formData.author = '';
            this.formData.dongfanghao = '';
            this.formData.quality = '';
            this.formData.isTop = '';
            this.formData.rowkey = '';
            this.formData.classification = '';
            this.formData.title = '';
            this.formData.source = '';
            this.formData.customtag = [];
            this.formData.timeliness = -1;
            this.operationTrackData = [];
            this.tagType = '';
            this.imageUrl = '';
        },
        // 视频封面
        handleAvatarSuccess(res, file){
            this.imageUrl = res.url
            this.dialogImageUrl = res.url
            var _that = this;
            setTimeout(function () {
                var myimage = document.getElementById("coverpic");
                var rw = myimage.naturalWidth; // 真实图片宽度
                var rh = myimage.naturalHeight; //真是图片高度
                var rate = rw/rh
                if(rw<545 || rate>1.80 || rate<1.75){
                    _that.imageUrl = '';
                    _that.$message({
                        type: 'warning',
                        message: '上传图片尺寸不能宽不能小于550，标准比例为16:9'
                    });
                }
            },500);
        },
        // 查询审核状态
        // -1 查不到数据
        // 0 未审核
        // 1 审核通过
        // 2 审核拒绝
        // 3 审核驳回
        // 4 审核驳回保存
        // 5 审核驳回保存审核通过
        // 6 审核驳回保存拒绝
        // 7 驳回编辑时，审核拒绝
        searchAuditStatus(){
            let params = {
                cts: this.formData.cts,
                rdts: this.formData.rdts,
                newstype: this.formData.newstype
            }
            searchAuditStatus(params).then(res => {
                if(res.code == "00001"){
                    switch (Number(res.data)) {
                        case "null":
                            this.formData.newsStatus = '--'
                            break;
                        case -1:
                            this.formData.newsStatus = '查不到数据'
                            break;
                        case 0:
                            this.formData.newsStatus = '未审核'
                            break;
                        case 1:
                            this.formData.newsStatus = '审核通过'
                            break;
                        case 2:
                            this.formData.newsStatus = '审核拒绝'
                            break;
                        case 3:
                            this.formData.newsStatus = '审核驳回'
                            break;
                        case 4:
                            this.formData.newsStatus = '审核驳回保存'
                            break;
                        case 5:
                            this.formData.newsStatus = '审核驳回保存审核通过'
                            break;
                        case 6:
                            this.formData.newsStatus = '审核驳回保存拒绝'
                            break;
                        case 7:
                            this.formData.newsStatus = '驳回编辑时，审核拒绝'
                            break;
                        default:
                            this.formData.newsStatus = '--'
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.contentTools_label{
    display: inline-block;
    .contentTools_title{
        display: block;
        height: 30px;
        line-height: 30px;
        font-weight: 700;
        margin-right: 0px;
        font-size: 14px;
    }
    .contentTools_content{
        display: block;
        float: left;
        height: 30px;
        line-height: 30px;
        color: #666;
        font-size: 14px;
        padding:0 10px;
    }
}
.input-error{
    position: relative;
}
.input-error p{
    color: red;
    position: absolute;
    font-size: 12px;
    bottom: -20px;
    margin: 0;
    line-height: normal;
}
.title-content-box{
    height: 600px;
    overflow: auto;
    font-size: 16px;
}
.title-content-box img{
    display: block;
    margin: 0 auto;
    width: auto;
    height: auto;
    max-width: 100%;
}
.operationTrack{
    width: 450px;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    position: fixed;
    right: 0;
    border: 1px solid #e5e5e5;
    top: 0px;
    z-index: 2001;
    transform:translateX(0px);
    box-shadow:0 2px 4px #e5e5e5, /*左边阴影*/
    0 0 0 #000, /*右边阴影*/
    0 0 0 #000, /*顶部阴影*/
    0 2px 4px #e5e5e5; /*底边阴影*/
    &.openOperationTrack{
        transform: translateX(490px);

    }
    transition: transform 0.3s
}
.operationTrackBtn{
    position: absolute;
    right: 520px;
    bottom: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 50px;
    text-align: center;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #666;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
    transition: all 0.1s;
    font-size: 20px;
    &:hover{
        color: #409EFF;
        background-color: rgba(0,0,0,.05);
    }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
