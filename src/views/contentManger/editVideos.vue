<template lang="html">
    <section class="editVideos">
        <el-row class="mb-10">
            <el-button type="primary"
                       @click="coverPreview('form')"
                       :loading="loading.coverPreview"
                       :disabled="fileList.length==0">封面预览</el-button>
            <el-button type="primary"
                       :loading="loading.save"
                       @click="contentAdd('form')"
                       :disabled="btnDisabled.save">保存</el-button>
            <el-button @click="resetForm('form')">清空</el-button>
        </el-row>
        <el-row :gutter="10">
            <el-form ref="form" :model="form" size="mini" :rules="rules" status-icon>
                <el-col :span="18">
                    <el-card>
                        <el-form-item label="" prop="title">
                            <el-row class="input_num_box">
                                <el-input placeholder="请输入视频标题,不能超过50个字符"
                                          v-model="form.title"
                                          :maxlength="50"
                                          :minlength="5"
                                          size="large"></el-input>
                                <div class="input_num info">
                                    <span :class="form.title.length==50?'danger':''">{{ form.title.length }}/50</span>
                                </div>
                            </el-row>
                        </el-form-item>
                        <el-row class="mt-10">
                            <div class="null-video" v-if="this.playerOptions.sources[0].src==''">
                                点击下方上传按钮或拖拽视频至下方
                            </div>
                            <video-player :options="playerOptions" ref="videoPlayer" v-else></video-player>
                        </el-row>
                        <el-row class="mt-10">
                            <el-upload
                                v-if="!uploading"
                                accept=".mp4,.mov,.Mp4"
                                class="edit-drag__upload video"
                                drag
                                :show-file-list="false"
                                :action="videoUploadUrl"
                                :http-request='beforeAvatarVideoUpload'
                                :on-success="handleSuccess">
                                <i class="el-icon-plus"></i>
                                <div class="el-upload__tip" slot="tip">只能上传.mp4,.mov,.Mp4文件</div>
                            </el-upload>
                            <div class="videoUpload_hasVideo" v-if="uploading">
                                <div class="ucloud_video videoUpload_wrap" @click="switchVideo(form.ucloudUrl)">
                                    <el-progress type="circle" :status="getUploadStatus(Number(videoloadSize),ucloudUploadStatus)"
                                                 :percentage="Number(videoloadSize)"
                                                 class="progress_circle"
                                                 v-if="form.ucloudUrl==''"
                                                 ></el-progress>
                                    <video @canplaythrough='videoDuration()' id='sendVideoUc' controls v-if="form.ucloudUrl!=''">
            							<source :src="form.ucloudUrl" type="video/mp4">
            							您的浏览器不支持 video 属性。
        							</video>
                                </div>
                                <div class="aliyun_video videoUpload_wrap" @click="switchVideo(form.aliyunUrl)">
                                    <el-progress type="circle" :status="getUploadStatus(Number(aliyunSize),aliyunUploadStatus)"
                                                               :percentage="Number(aliyunSize)"
                                                               v-if="form.aliyunUrl==''"
                                                               class="progress_circle"></el-progress>
                                    <video @canplaythrough='videoDuration()' controls v-if="form.aliyunUrl!=''">
            							<source :src="form.aliyunUrl" type="video/mp4">
            							您的浏览器不支持 video 属性。
        							</video>
                                </div>
                            </div>
                        </el-row>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <el-form-item label="平台" prop="platform" style="margin-bottom:10px" :show-message="false">
                            <el-select v-model="form.platform"
                                       filterable
                                       placeholder="选择平台"
                                       @change="getClassify">
                                <el-option
                                    v-for="(item,index) in platformOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类" prop="maintype" style="margin-bottom:10px" :show-message="false">
                            <el-cascader
                                change-on-select
                                :options="newsTypeLevel"
                                v-model="form.maintype">
                            </el-cascader>
                        </el-form-item>
                        <el-row class="mt-10">
                            <div class="flex-div" style="align-items:baseline">
                                <div class="inline-label">标签</div>
                                <div class="inline-content">
                                    <el-tag
                                        style=""
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
                        </el-row>
                        <el-row class="mt-10">
                            <el-form-item label="来源" prop="source" style="margin-bottom:0">
                                <el-input v-model="form.source" placeholder="请输入视频来源" style="width:200px"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row class="mt-10">
                            <div class="flex-div" style="align-items:baseline">
                                <div class="inline-label">时长</div>
                                <div class="inline-content">
                                    {{ form.timeSize }}
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10">
                            <div class="flex-div">
                                <div class="inline-label">是否优质</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isquality">是</el-checkbox>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10">
                            <div class="flex-div">
                                <div class="inline-label">是否原创</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isoriginal">是</el-checkbox>
                                </div>
                            </div>
                        </el-row>
                    </el-card>
                    <el-tabs type="border-card" class="mt-10">
                        <el-tab-pane label="封面图">
                            <!--上传图片后显示的内容-->
                            <draggable :list="fileList" class="img_Box" v-if="fileList.length!==0">
                                <div class="img_Box_item" v-for="(item,index) in fileList">
                                    <img :src="item">
                                    <div class="img_Box_tools">
                                        <i class="el-icon-zoom-in" @click.stop="toBig(item)"></i>
                                        <i class="el-icon-delete ml-10" @click.stop="removeImg(item,index)"></i>
                                    </div>
                                </div>
                            </draggable>
                            <!--上传图片组件-->
                            <el-upload
                                v-if="fileList.length<1"
                                class="edit-drag__upload"
                                :class="fileList.length!==0?'has_imgs':''"
                                multiple
                                drag
                                :limit="3"
                                :on-exceed="handleExceed"
                                :show-file-list="false"
                                :action="fileUpload"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload">
                                <i class="el-icon-plus" v-if="fileList.length!==0"></i>
                                <i class="el-icon-upload" v-if="fileList.length===0"></i>
                                <div class="el-upload__text" v-if="fileList.length===0">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip" v-if="fileList.length===0">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-form>
        </el-row>
        <!--图片放大-->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
        <!--正文预览-->
        <!--缩略图预览-->
        <el-dialog title="客户端预览" :visible.sync="dialogShowVisible" :close-on-click-modal="false">
            <div>
                2:1
                <div>
                    <img width="100%" v-for="item in newImg.lunbjs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
                </div>
                4:3
                <div>
                    <img width="100%" v-for="item in newImg.minijs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
                </div>
                16:9大图
                <div>
                    <img width="100%" v-for="item in newImg.miniajs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
                </div>
                16：9
                <div>
                    <img width="100%" v-for="item in newImg.minibjs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
                </div>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import $ from 'jquery'
import draggable from 'vuedraggable'
//Aliyun OSS
import '@/assets/aliyun/aliyun-sdk.min.js'
import '@/assets/aliyun/oss-js-upload.js'
import {
    BUCKETALIY,
    BUCKETS,
    BUCKETY
} from '@/api/commonApi'
import {
    getOperPlatform
} from '@/api/commonApi'
import {
    getfileUpload
} from '@/api/operationTools'

import {
    newsvideoapiGettypes,
    newsvideoGetauth,
    newsvideoMinipreview,
    newsvideoSavevideos
} from '@/api/contentManage'

export default {
    components: {
        draggable,
        videoPlayer
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    data() {
        return {
            isoriginal: true,
            isquality: false,
            form: {
                title: '',
                platform: '',
                maintype: [],
                source: '',
                timeSize: '',
                ucloudUrl: '',
                aliyunUrl: ''
            },
            rules: {},
            loading: {
                coverPreview: false,
                save: false
            },
            btnDisabled: {
                coverPreview: true,
                save: true
            },
            platformOptions: [],
            newsTypeLevel: [],
            // 标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            // 封面图
            fileUpload: '',
            fileList: [],
            dialogVisible: false,
            dialogImageUrl: '',
            playerOptions: {
                height: '400',
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
            // 视频上传
            videoUploadUrl: '',
            videoloadSize: 0,
            aliyunSize: 0,
            uploading: false,
            ucloudUploadStatus: true,
            aliyunUploadStatus: true,
            // 缩略图预览
            dialogShowVisible: false,
            newImg: '',

        }
    },
    mounted() {
        this.fileUpload = getfileUpload
        this.getOperPlatform()
    },
    methods: {
        getUploadStatus(percentage,status){
            if(!status){
                return 'exception'
            }else{
                if(percentage == 100){
                    return 'success'
                }
            }
        },
        switchVideo(url) {
            this.playerOptions.sources[0].src = url
        },
        getOperPlatform() {
            let params = {
                userName: this.$store.getters.name,
                url: 'send/video'
            }
            getOperPlatform(params).then(res => {
                this.platformOptions = res.data;
                this.form.platform = this.platformOptions[0].value;
                this.getClassify()
            });
        },
        getClassify() {
            var level1 = [];
            var level2 = [];
            var level3 = [];
            let para = {};
            if (this.form.platform == 'wxsport') {
                para = {
                    type: 'wxsportsvideo'
                }
            } else if (this.form.platform == 'all') {
                para = {
                    type: 'sportsvideopublish'
                }
            } else {
                para = {
                    type: 'newsvideo'
                }
            }
            newsvideoapiGettypes(para).then(res => {
                if (res.data && res.data.length) {
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].level && res.data[i].level == 1) {
                            level1.push({
                                value: res.data[i].typePy,
                                label: res.data[i].typeName,
                                typeId: res.data[i].typeId,
                                level: res.data[i].level
                            })
                        } else if (res.data[i].level && res.data[i].level == 2) {
                            level2.push({
                                value: res.data[i].typePy,
                                label: res.data[i].typeName,
                                typeId: res.data[i].typeId,
                                parentId: res.data[i].parentId,
                                level: res.data[i].level
                            })
                        } else if (res.data[i].level && res.data[i].level == 3) {
                            level3.push({
                                value: res.data[i].typePy,
                                label: res.data[i].typeName,
                                typeId: res.data[i].typeId,
                                parentId: res.data[i].parentId,
                                level: res.data[i].level
                            })
                        }

                    }
                    for (var i = 0; i < level1.length; i++) {
                        for (var j = 0; j < level2.length; j++) {
                            if (level1[i].typeId == level2[j].parentId) {
                                if (level1[i].children == undefined) {
                                    level1[i].children = [];
                                }
                                for (var k = 0; k < level3.length; k++) {
                                    if (level2[j].typeId == level3[k].parentId) {
                                        if (level2[j].children == undefined) {
                                            level2[j].children = [];
                                        }
                                        level2[j].children.push({
                                            value: level3[k].value,
                                            label: level3[k].label
                                        });
                                    }
                                }
                                level1[i].children.push({
                                    value: level2[j].value,
                                    label: level2[j].label,
                                    parentId: level2[j].parentId,
                                    typeId: level2[j].typeId,
                                    children: level2[j].children
                                })
                            }
                        }
                    }
                    this.newsTypeLevel = level1;
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
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // 上传成功后返回
        handleSuccess(response, file, fileList) {
            this.fileList.push(response.url)
            // 改动封面后需重新进行图片预览
            this.btnDisabled.save = false
        },
        // 放大
        toBig(url) {
            this.dialogImageUrl = url
            this.dialogVisible = true
        },
        // 删除
        removeImg(url, index) {
            var _this = this;
            _this.fileList.forEach((item, index) => {
                if (item == url) {
                    _this.fileList.splice(index, 1)
                }
            })
            // 改动封面后需重新进行图片预览
            this.btnDisabled.save = false
        },
        // 封面
        // 上传前
        beforeUpload(file) {
            let fileType = file.type
            let fileSize = file.size
            if (fileType != 'image/jpeg' && fileType != 'image/png') {
                this.$message({
                    message: '请上传 jpg/png 图片',
                    type: 'warning'
                });
                return false
            }
        },
        // 视频上传
        beforeAvatarVideoUpload(res) {
            this.uploading = true
            var _this = this
            var file = res.file
            var name = file.name
            var size = file.size
            var content_type = file.type
            var Header = {
                "Content-Type": content_type,
                "Content-Length": size
            }
            var Bucket = ''
            var upUrl = ''
            if (this.form.platform == 'wxsport') {
                Bucket = BUCKETY;
                upUrl = '.cn-bj.ufileos.com/';
            }else {
                Bucket = BUCKETS;
                upUrl = '.ufile.ucloud.cn/'
            }
            // 如果视频标题为空，自动设置为文件名
            if(this.form.title === ''){
                this.form.title = name.split('.')[0]
            }
            var _data = file.slice(0, size);
            var params = {
                "Bucket": Bucket,
                "METHOD": 'PUT',
                "Header": Header,
                "Key": name
            }
            var extendName = name.substring(name.lastIndexOf(".") + 1);
            var limitType = 'mp4,mov';
            if (limitType.indexOf(extendName) == -1) {
                this.$message({
                    type: 'warning',
                    message: '格式不允许！'
                });
                return;
            }
            if (this.form.platform == 'wxsport') {
                params.type = 'wxsportsvideo';
            } else if(this.form.platform == 'all'){
                params.type = 'sportsvideopublish'
            } else {
                params.type = 'newsvideo';
            }
            var xhrOnProgress = function(fun) {
                xhrOnProgress.onprogress = fun; //绑定监听
                //使用闭包实现监听绑
                return function() {
                    //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
                    var xhr = $.ajaxSettings.xhr();
                    //判断监听函数是否为函数
                    if (typeof xhrOnProgress.onprogress !== 'function')
                        return xhr;
                    //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
                    if (xhrOnProgress.onprogress && xhr.upload) {
                        xhr.upload.onprogress = xhrOnProgress.onprogress;
                    }
                    return xhr;
                }
            };
            let isAuth = newsvideoGetauth(params).then(res => {
                if (res.code == '00001') {
                    let vurl = res.data.url;
                    $.ajax({
                        url: vurl,
                        type: "PUT",
                        processData: false,
                        contentType: false,
                        async: true,
                        data: _data,
                        headers: {
                            "Authorization": res.data.auth,
                            "Content-Type": content_type
                        },
                        xhr: xhrOnProgress(function(e) {
                            _this.ucloudUploadStatus = true
                            var percent = e.loaded / e.total; //计算百分比
                            _this.videoloadSize = (percent * 100).toFixed(2);
                        }),
                        success: function(response, textStatus, jqXHR) {
                            _this.videoloadSize = 100;
                            _this.videoload = true;
                            _this.form.ucloudUrl = vurl;
                            if(_this.playerOptions.sources[0].src == ''){
                                _this.playerOptions.sources[0].src = _this.form.ucloudUrl
                            }
                            clearInterval(_this.videoInterva);
                            _this.$notify({
                                title: '成功',
                                message: '视频上传成功',
                                type: 'success'
                            });
                        },
                        error: function(){
                            _this.ucloudUploadStatus = false
                        }
                    });

                    //阿里云
                    //aliyun-sdk
                    _this.aliyunload = false;
                    var ossUpload = new OssUpload({
                        bucket: BUCKETALIY,
                        //   bucket: 'gxtest00',//正式gaoxinmv
                        endpoint: 'http://oss-cn-beijing.aliyuncs.com',
                        // 如果文件大于 chunkSize 则分块上传, chunkSize 不能小于 100KB 即 102400
                        chunkSize: 1048576,
                        // 分块上传的并发数
                        concurrency: 2,
                        aliyunCredential: {
                            "accessKeyId": "LTAIjzNN6TTNNCVg",
                            "secretAccessKey": "68bnrfGFpnyKpHpkfO1B0hMDdI1H7k"
                        }
                    });

                    console.log('wasports/' + res.data.newFileName.split('/')[1])
                    ossUpload.upload({
                        // 必传参数, 需要上传的文件对象
                        file: file,
                        // 必传参数, 文件上传到 oss 后的名称, 包含路径
                        key: 'wasports/' + res.data.newFileName.split('/')[1],
                        // 上传失败后重试次数
                        maxRetry: 3,
                        // OSS支持4个 HTTP RFC2616(https://www.ietf.org/rfc/rfc2616.txt)协议规定的Header 字段：
                        // Cache-Control、Expires、Content-Encoding、Content-Disposition。
                        // 如果上传Object时设置了这些Header，则这个Object被下载时，相应的Header值会被自动设置成上传时的值
                        // 可选参数
                        headers: {
                            'CacheControl': 'public',
                            'Expires': '',
                            'ContentEncoding': '',
                            'ContentDisposition': '',
                            // oss 支持的 header, 目前仅支持 x-oss-server-side-encryption
                            'ServerSideEncryption': ''
                        },
                        // 文件上传中调用, 可选参数
                        onprogress: function(evt) {
                            _this.aliyunUploadStatus = true
                            _this.aliyunSize = ((evt.loaded / evt.total) * 100).toFixed(2);
                        },
                        // 文件上传失败后调用, 可选参数
                        onerror: function(evt) {
                            _this.aliyunUploadStatus = false
                        },
                        // 文件上传成功调用, 可选参数
                        oncomplete: function(res) {
                            _this.form.aliyunUrl = res.Location
                            if(_this.playerOptions.sources[0].src == ''){
                                _this.playerOptions.sources[0].src = _this.form.aliyunUrl
                            }
                            _this.aliyunload = true
                        }
                    })
                    return true;
                } else {
                    return false;
                }
            })
        },
        videoDuration() {
            this.$nextTick(() => {
                var a = document.getElementById('sendVideoUc').duration.toFixed(3);
                this.form.timeSize = a * 1000;
            })
        },
        // 缩略图预览
        coverPreview() {
            if(this.fileList.length == 0){
                this.$message({
                    type: 'warning',
                    message: '无略缩图，无法预览'
                });
                return;
            }
            if (this.form.maintype.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '未选择任何分类,请选择分类'
                });
                return;
            }
            var params = {
                imgs: [this.fileList[0]],
                maintype: this.form.maintype[0],
                platform: this.form.platform
            }

            if (this.form.platform == 'wxsport') {
                params.type = 'wxsportsvideo';
            } else if(this.form.platform == 'all'){
                params.type = 'sportsvideopublish';
            }else {
                params.type = 'newsvideo';
            }
            this.loading.coverPreview = true
            newsvideoMinipreview(params).then(res => {
                if(res.code === '00001'){
                    this.newImg = res.data;
                    this.newImg.minibjs = JSON.parse(this.newImg.minibjs);
                    this.newImg.lunbjs = JSON.parse(this.newImg.lunbjs);
                    this.newImg.minijs = JSON.parse(this.newImg.minijs);
                    this.newImg.miniajs = JSON.parse(this.newImg.miniajs);
                    this.dialogShowVisible = true
                }
                this.loading.coverPreview = false
            })
        },
        contentAdd(){
            if (this.form.ucloudUrl == '') {
                this.$message({
                    type: 'warning',
                    message: '视频未上传，无法发布'
                });
                return;
            }
            var _params = {
                title: this.form.title,
                describe: this.form.describe,
                source: this.form.source,
                maintype: this.form.maintype[0],
                secondtype: this.form.maintype[1],
                thirdtype: this.form.maintype[2],
                keywords: this.dynamicTags.join(","),
                timeSize: this.form.timeSize,
                url: this.form.ucloudUrl,
                isoriginal: Number(this.isoriginal),
                platform: this.form.platform,
                isquality: Number(this.isquality)
            };

            if (this.form.platform == 'wxsport') {
                _params.type = 'wxsportsvideo';
            } else if(this.form.platform == 'all'){
                _params.type = 'sportsvideopublish';
            }else {
                _params.type = 'newsvideo';
            }

            newsvideoSavevideos(_params).then(res => {
                if (res.code == '00001') {
                    this.resetForm()
                    this.$notify({
                        title: '成功',
                        message: '发布视频成功',
                        type: 'success'
                    });
                }
            })
        },
        resetForm(){
            this.form.title = ''
            this.form.platform = this.platformOptions[0].value
            this.form.maintype = []
            this.form.source = ''
            this.form.timeSize = ''
            this.ucloudUrl = ''
            this.aliyunUrl = ''
            this.dynamicTags = []
            this.fileList = []
            this.videoloadSize = 0
            this.aliyunSize = 0
            this.uploading = false
            this.ucloudUploadStatus = true
            this.aliyunUploadStatus = true
            this.newImg = ''
            this.isquality = false
            this.playerOptions.sources[0].src = ''
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.input_num_box {
    position: relative;
    padding-right: 60px;
}
.input_num {
    position: absolute;
    right: 0;
    font-size: 16px;
    top: 50%;
    margin-top: -16px;
}
.flex-div {
    display: flex;
    align-items: center;
    .inline-label {
        font-size: 12px;
        display: inline-block;
        font-weight: bold;
        margin-right: 20px;
    }
    .inline-content {
        flex: 1;
    }
}
.button-new-tag {
    height: 30px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.el-tag {
    margin-right: 4px;
    min-height: 24px;
    height: auto;
    white-space: normal;
    word-break: break-all;
    max-width: 200px;
    margin-bottom: 4px;
}
.videoUpload_wrap{
    height: 140px;
    width: 240px;
    border: 1px dashed #999;
    margin-right: 10px;
    position: relative;
    &:hover {
        border: 1px dashed #409EFF
    }
    video{
        max-width: 100%;
        max-height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        position: absolute;
    }
    .progress_circle{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
.videoUpload_text p {
    font-size: 14px;
    margin-top: 40px;
}
.videoUpload_hasVideo{
    display: flex;
}
.null-video{
    line-height: 400px;
    height: 400px;
    font-size: 32px;
    letter-spacing: 4px;
    color: #666;
    text-align: center;
    border: 1px solid #ccc
}
.img_Box {
    display: flex;
    flex-wrap: wrap;
    .img_Box_item {
        background-color: #ccc;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        margin-right: 6px;
        margin-bottom: 6px;
        cursor: pointer;
        position: relative;
        img {
            width: 100%;
            height: 100%;
        }
        &:hover .img_Box_tools {
            visibility: visible;
        }
        .img_Box_tools {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
            top: 0;
            left: 0;
            visibility: hidden;
        }
    }
}
</style>
