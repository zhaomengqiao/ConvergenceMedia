<template lang="html">
    <section class="sendVideo">
        <el-form label-position="right" ref="ruleForm" label-width="120px" :model="form">
            <el-form-item label="选择操作平台：">
                <el-select v-model="form.platform" style="width: 180px;" filterable placeholder="支持中文/拼音搜索" @change='gettypes'>
                    <el-option v-for="item in platform" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="视频上传：">
                <el-upload class="avatar-videoUploader" :action="videoUploadUrl" accept='.mp4,.mov,.Mp4' :show-file-list="false" :on-success='handleChange' :http-request='beforeAvatarVedioUpload' :on-change='handleChange'>
                    <i class="avatar-video-uploader-icon" v-if='!videoload&&videoloadSize==0&&!aliyunload&&aliyunSize==0'></i>
                    <div class="clearfix" :style="{marginTop:(!videoload&&videoloadSize!=0||!aliyunload&&aliyunSize!=0)?'30px':'0px'}">
                        <div class="pull-left">
                            <el-progress type="circle" :percentage="Number(videoloadSize)" v-if='!videoload&&videoloadSize>0'></el-progress>
                            <el-progress type="circle" :percentage="Number(videoloadSize)" v-if='videoload&&form.videoUrl==""' status="exception"></el-progress>
                            <p style="color:#666;font-size:18px;margin:0" v-if='!videoload&&videoloadSize>0'>ucloud上传进度</p>
                            <video width="160" height="120" v-if='form.videoUrl!=""' id='sendVideoUc' @canplaythrough='videoDuration()' controls>
                                <source :src="form.videoUrl" type="video/mp4">
                                您的浏览器不支持 video 属性。
                            </video>
                        </div>
                        <div class="pull-left" style="margin-left:20px;">
                            <el-progress type="circle" :percentage="Number(aliyunSize)" v-if='!aliyunload&&Number(aliyunSize)>0'></el-progress>
                            <el-progress type="circle" :percentage="Number(aliyunSize)" v-if='aliyunload&form.aliyunUrl==""' status="exception"></el-progress>
                            <p style="color:#666;font-size:18px;margin:0" v-if='!aliyunload&&aliyunSize>0'>aliyun上传进度</p>
                            <video width="160" height="120" v-if='form.aliyunUrl!=""' id='sendVideoAli' controls>
                                <source :src="form.aliyunUrl" type="video/mp4">
                                您的浏览器不支持 video 属性。
                            </video>
                        </div>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="视频标题：">
                <el-input v-model.trim="form.title" style="width: 40%;" placeholder="请输入视频标题，5-50个汉字；"></el-input>
            </el-form-item>
            <el-form-item label="是否优质：">
                <el-checkbox v-model="isquality" v-if="form.platform == 'toutiao'">是否优质</el-checkbox>
            </el-form-item>
            <el-form-item label="视频分类：">
                <el-cascader style="width: 280px;" change-on-select :options="classification" v-model="form.maintype">
                </el-cascader>
            </el-form-item>
            <el-form-item label="视频简介：">
                <el-input style="width: 40%;" type="textarea" :autosize="{ minRows: 2}" placeholder="请输入视频简介，限140个汉字；" v-model="form.describe"></el-input>
            </el-form-item>
            <el-form-item label="视频时长：">
                <el-input v-model="form.timeSize" style="width: 40%;" placeholder="请输入视频时长(毫秒)"></el-input>
            </el-form-item>
            <el-form-item label="视频来源：">
                <el-input v-model="form.source" style="width: 40%;" placeholder="请输入视频来源，2-10个汉字；"></el-input>
            </el-form-item>
            <el-form-item label="关键词：">
                <div v-if='form.platform=="toutiao"||form.platform=="yangzi"||form.platform=="all"'>
                    <el-tag :key="tag" v-for="tag in form.keywords" :closable="true" :close-transition="false" @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input style="width: 100px;" class="input-new-tag" v-if="inputVisible" v-model.trim="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
                    <p class="keywords-tips">每个关键词五个汉字以内或三个以内单词</p>
                </div>
                <div v-if='form.platform=="wxsport"'>
                    <el-select v-model="form.keywords" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
                        <el-option v-for="item in sportTags" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label="封面图片：">
                <template>
                    <el-radio-group v-model="form.cover">
                        <el-radio :label="1">单图</el-radio>
                        <el-radio :label="2">自动</el-radio>
                        <span class="question"></span>
                    </el-radio-group>
                </template>
                <el-upload v-if='isAuth.videoUpload' class="avatar-imgUploader" :action="fileUpload" :show-file-list="false" list-type="picture-card" :on-success="handleAvatarImgSuccess">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="是否原创：">
                <template>
                    <el-radio-group style="padding-top: 8px;" v-model="form.isoriginal">
                        <el-radio :label="1">原创</el-radio>
                        <el-radio :label="0">非原创</el-radio>
                    </el-radio-group>
                </template>
            </el-form-item>
            <el-form-item>
                <el-button v-if='isAuth.videoImgPreview' type="primary" @click="clientPreview">客户端预览</el-button>
                <el-button type="primary" v-if='isAuth.videoAdd' :disabled="!showSave" @click="releaseData">发布</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
import $ from 'jquery'
// import {
//     videoAliyun,
//     newsvideoGetauth,
//     // newsvideoMinipreview,
//     // newsvideoSavevideos,
//     // getOperPlatform,
//     // getLatelyList,
//     // getVideoUpload,
//     // getfileUpload,
//     // newsvideoapiGettypes,
//     // newsvideoapiGettags,
//     // BUCKETALIY,
//     // BUCKETS,
//     // BUCKETY
// } from '../../api/api';

export default {
    data() {
        return {
            isquality: false,
            isAuth: {
                videoUpload: false,
                getVideoList: false,
                videoImgPreview: false,
                videoAdd: false,
            },
            inputVisible: false,
            dialogShowVisible: false,
            showSave: false,
            platform: [],
            form: {
                platform: '',
                title: '',
                source: '',
                describe: '',
                maintype: [],
                keywords: [],
                isoriginal: '1',
                cover: 1,
                timeSize: 0,
                videoUrl: '',
                aliyunUrl: ''
            },
            videoload: false,
            aliyunload: false,
            aliyunStatus: true,
            aliyunSize: 0,
            videoloadSize: 0,
            listLoading: false,
            videoInterva: '',
            classification: [],
            inputValue: '',
            checkedCover: ['单图'],
            checkedCoverOptions: ['单图', '自动'],
            checkedOriginal: ['原创'],
            checkedOriginalOptions: ['原创', '非原创'],
            worksData: [],
            videoUpload: '',
            fileUpload: '',
            imageUrl: '',
            newImg: '',
            sportTags: [],
            tagList: [],
            loading: false,
            url: '',
            videoUploadUrl: '',
            currentRow: null
        };
    },
    mounted() {
        this.getAuth();
        this.fileUpload = getfileUpload;
        this.getLatelyList();
        this.getOperPlatform();
    },
    watch: {
        videoloadSize: function(n, o) {

        }
    },
    methods: {
        getAuth() { //权限控制
            this.authorList = localStorage.getItem('authorList');
            if (this.authorList.indexOf('api/newsvideo/getauth') > -1) {
                this.isAuth.videoUpload = true;
            }
            if (this.authorList.indexOf('api/newsvideo/minipreview') > -1) {
                this.isAuth.videoImgPreview = true;
            }
            if (this.authorList.indexOf('api/newsvideo/savevideos') > -1) {
                this.isAuth.videoAdd = true;
            }
            if (this.authorList.indexOf('api/newsvideo/savevideos') > -1) {
                this.isAuth.videoAdd = true;
            }
        },
        getLatelyList() { //标签列表
            newsvideoapiGettags('').then(res => {
                this.tagList = res.data.map(item => {
                    return {
                        value: item,
                        label: item
                    };
                });
            });
        },
        remoteMethod(query) {
            if (query !== '') {
                this.sportTags = this.tagList.filter(item => {
                    return item.label.toLowerCase()
                        .indexOf(query.toLowerCase()) > -1;
                });
            } else {
                this.sportTags = [];
            }
        },
        videoDuration() {
            var a = document.getElementById('sendVideoUc').duration.toFixed(3);
            this.form.timeSize = a * 1000;
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        getOperPlatform() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'send/video'
            }
            getOperPlatform(params).then(res => {
                this.platform = res.data;
                this.form.platform = this.platform[0].value;
            });
        },
        gettypes() {
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
                    this.classification = level1;
                }
            })
        },
        handleClose(tag) {
            this.form.keywords.splice(this.form.keywords.indexOf(tag), 1);
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
                this.form.keywords.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        handleClick(tab, event) {},
        handleChange(file) {
            this.videoloadSize = 0;
            this.videoload = false;
            this.form.videoUrl = '';
            this.aliyunSize = 0;
            this.aliyunload = false;
            this.form.aliyunUrl = '';
        },
        // 视频上传
        beforeAvatarVedioUpload(res) {
            console.log(res);
            var _this = this;
            let file = res.file;
            let name = file.name; //文件名
            if (_this.form.title === '') {
                _this.form.title = name.split('.')[0];
            }
            let size = file.size; //总大小
            var content_type = file.type;
            let Header = {
                "Content-Type": content_type,
                "Content-Length": size
            };
            var Bucket = '';
            var upUrl = '';
            if (this.form.platform == 'wxsport') {
                Bucket = BUCKETY;
                upUrl = '.cn-bj.ufileos.com/';
            } else {
                Bucket = BUCKETS;
                upUrl = '.ufile.ucloud.cn/'
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
            } else if (this.form.platform == 'all') {
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
                            var percent = e.loaded / e.total; //计算百分比
                            _this.videoloadSize = (percent * 100).toFixed(2);
                        }),
                        success: function(response, textStatus, jqXHR) {
                            _this.videoloadSize = 100;
                            _this.videoload = true;
                            _this.form.videoUrl = vurl;
                            clearInterval(_this.videoInterva);
                            _this.$notify({
                                title: '成功',
                                message: '视频上传成功',
                                type: 'success'
                            });
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
                            _this.aliyunSize = ((evt.loaded / evt.total) * 100).toFixed(2);
                        },
                        // 文件上传失败后调用, 可选参数
                        onerror: function(evt) {
                            //   _that.aliyunStatus = true
                        },
                        // 文件上传成功调用, 可选参数
                        oncomplete: function(res) {
                            _this.form.aliyunUrl = res.Location
                            _this.aliyunload = true
                        }
                    })
                    return true;
                } else {
                    return false;
                }
            });
        },
        // 封面上传
        handleAvatarImgSuccess(res, file) {
            this.imageUrl = res.url;
        },
        clientPreview() {
            if (this.imageUrl.length == 0) {
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
                imgs: [this.imageUrl],
                maintype: this.form.maintype[0],
                platform: this.form.platform
            }

            if (this.form.platform == 'wxsport') {
                params.type = 'wxsportsvideo';
            } else if (this.form.platform == 'all') {
                params.type = 'sportsvideopublish';
            } else {
                params.type = 'newsvideo';
            }

            this.listLoading = true;
            newsvideoMinipreview(params).then(res => {
                this.newImg = res.data;
                this.newImg.minibjs = JSON.parse(this.newImg.minibjs);
                this.newImg.lunbjs = JSON.parse(this.newImg.lunbjs);
                this.newImg.minijs = JSON.parse(this.newImg.minijs);
                this.newImg.miniajs = JSON.parse(this.newImg.miniajs);
                this.showSave = true;
                this.dialogShowVisible = true;
                this.listLoading = false;
            })
        },
        dialogHandleClose(index) {
            if (index == 0) {
                this.dialogShowVisible = false;
            } else if (index == 1) {
                this.dialogFormVisible = false;
            } else {
                this.urlVisible = false;
            }
        },
        releaseData() {
            if (this.form.videoUrl == '') {
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
                keywords: this.form.keywords.join(","),
                timeSize: this.form.timeSize,
                url: this.form.videoUrl,
                isoriginal: this.form.isoriginal,
                platform: this.form.platform,
                isquality: Number(this.isquality)
            };

            if (this.form.platform == 'wxsport') {
                _params.type = 'wxsportsvideo';
            } else if (this.form.platform == 'all') {
                _params.type = 'sportsvideopublish';
            } else {
                _params.type = 'newsvideo';
            }

            this.listLoading = true;
            newsvideoSavevideos(_params).then(res => {
                if (res.code == '00001') {
                    //初始化视频上传组件
                    this.form = {
                        platform: '',
                        title: '',
                        source: '',
                        describe: '',
                        maintype: [],
                        keywords: [],
                        isoriginal: '1',
                        cover: 1,
                        videoUrl: '',
                        aliyunUrl: ''
                    }
                    this.videoloadSize = 0;
                    this.videoload = false;
                    this.form.videoUrl = '';
                    this.form.aliyunUrl = '';
                    this.aliyunSize = 0;
                    this.aliyunload = false;
                    this.imageUrl = '';
                    this.$notify({
                        title: '成功',
                        message: '发布视频成功',
                        type: 'success'
                    });
                    this.isquality = false
                }
                this.listLoading = false;
            })
        }
    }
}
</script>

<style scoped>

</style>
