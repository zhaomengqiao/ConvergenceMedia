<template>
<section v-loading="listLoading">
    <el-row>
        <el-col :span="24" style="padding-left: 20px;">
            <el-form label-position="right" label-width="140px" :model="newLive" :rules="rules" ref="newLive">
                <el-form-item label="直播平台：" prop="livePlatform">
                    <el-select v-model="newLive.livePlatform" :disabled="editType" placeholder="请选择直播平台" class="w50" @change="getClassify">
                        <el-option v-for="(item,index) in livePlatform" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="pull-right" @click="urlDialogFormVisible=true">生成推流地址</el-button>
                </el-form-item>

                <el-form-item label="直播样式：" prop="roomtype">
                    <el-select v-model="newLive.roomtype" :disabled="editType" placeholder="请选择直播类型" class="w50">
                        <el-option label="资讯类直播" value="2"></el-option>
                        <el-option label="网红类直播" value="1"></el-option>
                        <el-option label="资讯直播厅" value="4"></el-option>
                        <el-option label="图文直播" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="直播类型：" prop="roomclassify">
                    <el-select v-model="newLive.roomclassify" :disabled="editType" placeholder="请选择直播类型" class="w50">
                        <el-option v-for="(item,index) in classify" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="直播状态：" prop="livestatus">
                    <el-select v-model="newLive.livestatus" :disabled="editType" placeholder="请选择直播状态" class="w50">
                        <el-option label="直播" value="0"></el-option>
                        <el-option label="初始" value="100"></el-option>
                        <el-option label="直播结束" disabled value="1"></el-option>
                        <el-option label="回看" disabled value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置推流：" prop="tuiliu">
                    <el-select class="select-smallW" :disabled="editType" v-model="newLive.tuiliuSelect" placeholder="请选择">
                        <el-option label="推流流名" value="1"></el-option>
                        <el-option label="拉流地址(flvurl)" value="2"></el-option>
                    </el-select>
                    <el-input v-if='newLive.tuiliuSelect=="1"' placeholder="请输入推流流名" :disabled="editType" v-model="newLive.tuiliu" class="w30" @blur="createLiveVerify">
                    </el-input>
                    <p v-if="newLive.tuiliuSelect==1&&!canCreate" style="color:red;margin:2px 0;line-height:14px">请输入正确的推流流名</p>
                    <el-input v-if='newLive.tuiliuSelect=="2"' placeholder="请输入拉流地址(flvurl)" :disabled="flvEdit" v-model="newLive.tuiliu" class="w30" @keyup.native="isWhiteEdit">
                    </el-input>
                    <el-checkbox v-model="isPull" v-if='newLive.tuiliuSelect=="2"' @change="setLookBack">拉流转推</el-checkbox>
                    <el-checkbox v-model="isRepush" v-if='newLive.tuiliuSelect=="2"' :disabled="!isPull" @change="setRepush">生成回看</el-checkbox>
                    <div v-if='newLive.tuiliuSelect=="2"' class="w40">
                        <el-input v-model.number="newLive.hlsurl" placeholder="请输入拉流地址(hlsurl)" :disabled="hlsEdit"></el-input>
                    </div>
                    <div v-if='newLive.tuiliuSelect=="2"' class="w40">
                        <el-input v-model.number="newLive.thirdurl" placeholder="白名单拉流地址必填项" :disabled="whiteEdit"></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="主播ID：" prop="ttaccid">
                    <el-input v-model="newLive.ttaccid" placeholder="请输入有效主播ID" :disabled="editType" class="w50"></el-input>
                </el-form-item>
                <el-form-item label="主播头像：" prop="toppic" v-if="newLive.roomtype === '3'">
                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :show-file-list="false" accept='.jpg,.png' :before-upload="beforePosterUpload" :on-success="handleTwSuccess">
                        <img v-if="newLive.toppic" :src="newLive.toppic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="动态封面图：" prop="cover_gif" v-if="newLive.roomtype === '3'">
                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :show-file-list="false" accept='.jpg,.png,.gif' :on-success="handleGifSuccess">
                        <img v-if="newLive.cover_gif" :src="newLive.cover_gif" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="banner图：" prop="cover_banner" v-if="newLive.roomtype === '3'">
                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :show-file-list="false" accept='.jpg,.png' :on-success="handleBaSuccess">
                        <img v-if="newLive.cover_banner" :src="newLive.cover_banner" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="直播标题：" prop="title">
                    <el-input v-model.trim="newLive.title" placeholder="请输入直播标题，5-50个汉字；" class="w50"></el-input>
                </el-form-item>
                <el-form-item label="直播封面：" prop="coverpic">
                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :show-file-list="false" accept='.jpg,.png' :before-upload="beforePosterUpload" :on-success="handlePosterSuccess">
                        <img v-if="newLive.coverpic" :src="newLive.coverpic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="直播简介：" prop="liveintroduce">
                    <el-input type="textarea" placeholder="请输入直播简介内容，限500个汉字；" :rows="3" :maxlength='500' v-model="newLive.liveintroduce" class="w50"></el-input>
                </el-form-item>
                <el-form-item label="评论：">
                    <el-radio-group v-model.number="newLive.commentflag" :disabled="editType">
                        <el-radio :label="1">允许</el-radio>
                        <el-radio :label="0">禁止</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-show="newLive.roomtype === '2'">
                    <el-form-item label="添加管理员：" prop="manager">
                        <div class="w50">
                            <el-input v-model.number="newLive.manager" placeholder="请输入要添加的管理员ID，仅限数字；" type="text" style="width: 80%;"></el-input>
                            <!--<el-autocomplete
                              v-model.number="newLive.manager"
                              :fetch-suggestions="querySearchAsync"
                              :props="{label:'accid',value:'accid'}"
                              placeholder="请输入内容"
                              @select="handleSelect"
                              style="width: 80%;"
                            ></el-autocomplete>-->
                            <el-button @click="addManager(newLive.manager)" class="info">添加</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item prop="roomAdminArr">
                        <div class="w50">
                            <el-badge v-for="(roomAdmin,index) in roomAdminArr" :key="index" @click.native="deleteManager(roomAdmin)" value="-" class="item">
                                <el-button size="small">{{ roomAdmin }}</el-button>
                            </el-badge>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitLiveInfo">确定</el-button>
                </el-form-item>
            </el-form>

        </el-col>
    </el-row>
    <el-dialog title="生成推流地址" :visible.sync="urlDialogFormVisible" size="tiny">
        <el-form>
            <el-form-item label="推流流名">
                <el-input v-model.trim="plugFlowName" auto-complete="off" placeholder="请输入推流流名点击生成"></el-input>
            </el-form-item>
            <span>{{ plugFlowUrl }}</span><span style="color:red" v-if="plugFlowUrl!=''">  链接已复制至剪切板</span>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="urlDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="getPullFlow($event)">生成</el-button>
        </div>
    </el-dialog>
</section>
</template>
<script>
import {
    createLiveVerify,
    getLiveClassList,
    submitLiveInfo,
    getLivePlatform,
    addManager,
    updateLiveInfo,
    queryAdmin,
    queryRoomInfo,
    roomfileUpload,
    itExist,
    setCreateUrl
} from '@/api/liveManage';
import {
    LIVECLASS
} from '@/api/commonApi'
import md5 from 'js-md5';
import clip from '@/utils/clipboard'
export default {
    props: [
        'myParam'
    ],
    data() {
        var livestatusValidator = (rule, value, callback) => {
            if (value === '100') {
                callback(new Error('状态的房间不会第一时间在客户端显示'));
            } else {
                callback();
            }
        };
        var validateExist = (rule, value, callback) => {
            if (value == '' || value == undefined) {
                callback(new Error('请输入主播ID'));
            } else {
                itExist({
                    id: value,
                    app_id: this.newLive.livePlatform.split('-')[0]
                }).then((res) => {
                    if (res.code == '00001') {
                        callback();
                    } else {
                        callback(new Error('主播ID不存在!'));
                    }
                });
            }
        };
        var validateAdmin = (rule, value, callback) => {
            if (value == '' || value == undefined) {
                callback();
            } else if (!Number.isInteger(value)) {
                callback(new Error('管理员ID必须为数字值'));
            } else if (value.toString().length > 9) {
                callback(new Error('管理员ID长度在10个数字以内'));
            } else {
                itExist({
                    id: value,
                    app_id: this.newLive.livePlatform.split('-')[0]
                }).then((res) => {
                    if (res.code == '00001') {
                        callback();
                    } else {
                        callback(new Error('管理员ID不存在!'));
                    }
                });
            }

        };
        var tuiliuValidator = (rule, value, callback) => {
            if (value == '2') {
                if (this.newLive.hlsurl == '') {
                    callback(new Error('请输入拉流地址(hlsurl)'));
                } else if (this.newLive.flvurl == '') {
                    callback(new Error('请输入拉流地址(flvurl)'));
                } else {
                    callback();
                }
            } else {
                callback();
            }

        };
        return {
            canCreate: true,
            plugFlowName: '',
            plugFlowUrl: '',
            urlDialogFormVisible: false,
            classify: [],
            flvEdit: false,
            hlsEdit: false,
            whiteEdit: false,
            dialogVisible: false,
            listLoading: false,
            hasPoster: false,
            hasTwPoster: false,
            imgTwUploadUrl: '',
            imgUploadUrl: '',
            editType: false,
            isRepush: false,
            isPull: false,
            roomAdminArr: [],
            newLive: {
                livePlatform: '',
                ttaccid: '',
                app_id: 'dftv',
                tagid: 0,
                title: '',
                pushlivecode: '',
                coverpic: '',
                autoclose: '0',
                livedesc: '',
                manager: '',
                managers: [],
                tuiliu: '',
                tuiliuSelect: '1',
                livestatus: '0',
                flvurl: '',
                hlsurl: '',
                thirdurl: '',
                roomid: '',
                roomkey: '',
                roomtype: '2',
                repush: '0',
                liveintroduce: '',
                commentflag: 1,
                cflvurl: '',
                livecode: '',
                toppic: '',
                cover_gif: '',
                cover_banner: '',
                repush: '0',
                roomclassify: ''
            },
            livePlatform: [],
            myRoomkey: this.myParam,
            timeout: null,
            rules: {
                ttaccid: [{
                    validator: validateExist,
                    trigger: 'change'
                }, ],
                manager: [{
                    validator: validateAdmin,
                    trigger: 'change'
                }],
                title: [{
                        required: true,
                        message: '请输入推流直播标题',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 100,
                        message: '100字以内',
                        trigger: 'blur'
                    }
                ],
                pushlivecode: [{
                    required: true,
                    message: '请输入推流流名',
                    trigger: 'blur'
                }],
                coverpic: [{
                    required: true,
                    message: '请上传直播封面',
                    trigger: 'blur'
                }],
                livePlatform: [{
                    required: true,
                    message: '请选择直播平台',
                    trigger: 'change'
                }],
                livestatus: [{
                        required: true,
                        message: '请选择直播状态',
                        trigger: 'change'
                    },
                    {
                        validator: livestatusValidator,
                        trigger: 'change'
                    }
                ],
                tuiliu: [{
                    validator: tuiliuValidator,
                    trigger: 'change'
                }]
            }
        }
    },
    methods: {
        isWhiteEdit() {
            if (this.newLive.tuiliu == '') {
                this.whiteEdit = false;
            } else {
                this.whiteEdit = true;
            }
            if (this.newLive.thirdurl != '') {
                this.whiteEdit = false;
            }
        },
        addManager(manager) {
            this.$refs.newLive.validateField('manager', valid => {
                if (!valid && manager != '') {
                    this.newLive.manager = '';
                    if (manager) {
                        if (this.roomAdminArr.indexOf(manager) > -1) {
                            this.$notify({
                                title: '提示',
                                message: '该管理员已添加',
                                type: 'warning'
                            });
                        } else {
                            this.roomAdminArr.push(manager);
                        }
                    }
                }
            });
        },
        getLivePlatform() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'open/liveroom'
            }
            getLivePlatform(params).then(res => {
                this.livePlatform = res.data;
                this.newLive.livePlatform = res.data[0].value;
            });
        },
        getRepush() {
            if (this.isPull && this.isRepush) {
                this.newLive.repush = 1
            } else if (this.isPull && !this.isRepush) {
                this.newLive.repush = 2
            } else {
                this.newLive.repush = 0
            }
        },
        getClassify() {
            var plat = this.newLive.livePlatform.split("-")[0]
            let params = {
                app_id: plat,
                is_test: LIVECLASS
            }
            getLiveClassList(params).then(res => {
                let msg = res.ret;
                if (res.code == "00001") {
                    let data = res.data.data;
                    var _this = this;
                    _this.classify = [];
                    data.forEach(function(item) {
                        if (item.is_close == 0 && item.is_delete == 0) { //只取未关闭、未删除
                            _this.classify.push({
                                "label": item.title,
                                "value": item.id
                            })
                        }
                    })
                    if (this.classify.length == 0) {
                        this.newLive.roomclassify = ''
                    } else {
                        this.newLive.roomclassify = this.classify[0].value
                    }
                }
            });
        },
        setRepush() {
            this.getRepush();
        },
        setLookBack() {
            if (this.newLive.thirdurl != "") {
                if (this.isPull) {
                    setCreateUrl('').then(res => {
                        this.newLive.tuiliu = res.data.flvurl;
                        this.whiteEdit = false;
                        this.newLive.hlsurl = res.data.hlsurl;
                        this.flvEdit = true;
                        this.hlsEdit = true;
                        this.newLive.livecode = res.data.livecode;
                        this.getRepush();
                    });
                } else {
                    this.getRepush();
                    this.newLive.hlsurl = '';
                    this.flvEdit = false;
                    this.hlsEdit = false;
                    this.newLive.livecode = '';
                    this.newLive.tuiliu = "";
                    this.newLive.thirdurl = "";
                    this.whiteEdit = false;
                    this.isRepush = false;
                }
            } else {
                if (this.newLive.tuiliu == "") {
                    this.$message({
                        message: 'flvurl 不能为空',
                        type: 'warning'
                    });
                    this.isPull = false;
                    return false
                } else {
                    if (this.isPull) {
                        setCreateUrl('').then(res => {
                            this.newLive.hlsurl = res.data.hlsurl;
                            this.hlsEdit = true;
                            this.newLive.livecode = res.data.livecode;
                            this.getRepush();
                        });
                    } else {
                        this.getRepush();
                        this.newLive.tuiliu = "";
                        this.newLive.hlsurl = '';
                        this.newLive.livecode = '';
                        this.newLive.thirdurl = "";
                        this.flvEdit = false;
                        this.hlsEdit = false;
                        this.whiteEdit = false;
                        this.isRepush = false;
                    }
                }
            }


        },
        deleteManager(manager) {
            this.roomAdminArr.splice(this.roomAdminArr.indexOf(manager), 1);
        },
        uploadManager() {
            let _this = this,
                managers = this.roomAdminArr;
            let para = {
                ttaccid: managers.toString(),
                app_id: this.newLive.livePlatform.split('-')[0],
                roomid: this.newLive.roomid,
                roomkey: this.newLive.roomid === '0' ? '' : this.newLive.roomkey
            }

            addManager(para).then((res) => {
                // _this.managers.push(manager)
                if (res.code === '00001') {
                    this.$refs.newLive.resetFields();
                    // this.roomAdminArr=[];
                    this.$notify({
                        title: '成功',
                        message: '添加房间管理员成功',
                        type: 'success'
                    });
                    this.$router.push({
                        path: '/live/tools',
                        query: {
                            room: 'add',
                            type: 'edit'
                        }
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.ret
                    });
                }
            });
        },

        submitLiveInfo() { //提交信息
            this.$refs.newLive.validate((valid) => {
                if (valid) {
                    let newLive = this.newLive;
                    var _this = this;

                    this.listLoading = true;
                    if (this.myRoomkey != undefined && this.myRoomkey != '') {
                        let para = {
                            ttaccid: ~~this.newLive.ttaccid,
                            app_id: this.newLive.livePlatform.split('-')[0],
                            rowkey: this.myRoomkey,
                            title: this.newLive.title,
                            toppic: this.newLive.toppic,
                            coverpic: this.newLive.coverpic,
                            cover_gif: this.newLive.cover_gif,
                            cover_banner: this.newLive.cover_banner,
                            liveintroduce: newLive.liveintroduce,
                            roomid: newLive.roomid
                        }
                        updateLiveInfo(para).then((res) => {
                            if (res.code === '00001') {
                                this.$notify({
                                    title: '成功',
                                    message: '更新直播房间成功',
                                    type: 'success'
                                });
                                if (_this.newLive.roomtype == 2 && _this.roomAdminArr.length > 0) {
                                    _this.uploadManager();
                                } else {
                                    this.$router.push({
                                        path: '/live/tools',
                                        query: {
                                            room: 'query',
                                            type: 'edit'
                                        }
                                    });
                                }
                            } else {
                                this.$message.warning(res.ret);
                            }
                        });
                    } else {
                        let para = {
                            ttaccid: ~~this.newLive.ttaccid,
                            app_id: this.newLive.livePlatform.split('-')[0],
                            tagid: this.newLive.roomclassify,
                            title: this.newLive.title,
                            pushlivecode: this.newLive.tuiliuSelect == '2' ? '' : this.newLive.tuiliu,
                            flvurl: this.newLive.tuiliu,
                            hlsurl: this.newLive.hlsurl,
                            thirdurl: this.newLive.thirdurl,
                            overwrite: 0,
                            toppic: this.newLive.toppic,
                            coverpic: this.newLive.coverpic,
                            cover_gif: this.newLive.cover_gif,
                            cover_banner: this.newLive.cover_banner,
                            autoclose: '1',
                            livestatus: this.newLive.livestatus,
                            manager: this.newLive.manager,
                            roomtype: this.newLive.roomtype,
                            liveintroduce: this.newLive.liveintroduce,
                            commentflag: this.newLive.commentflag,
                            livecode: this.newLive.livecode,
                            repush: this.newLive.repush
                        }
                        submitLiveInfo(para).then((res) => {
                            if (res.code === '00001') {
                                _this.newLive.roomid = res.data.roomId;
                                _this.newLive.roomkey = res.data.roomkey;
                                _this.newLive.chlsurl = '';
                                _this.newLive.livecode = '';
                                _this.newLive.repush = '0';
                                this.$notify({
                                    title: '成功',
                                    message: '添加直播房间成功',
                                    type: 'success'
                                });
                                if (_this.newLive.roomtype == 2 && _this.roomAdminArr.length > 0) {
                                    _this.uploadManager();
                                } else {
                                    this.$refs.newLive.resetFields();
                                    this.newLive.livePlatform = this.livePlatform[0].value
                                }
                            } else {
                                this.$message.warning(res.ret);
                            }
                        });
                    }
                    this.listLoading = false;
                }
            });
        },

        // handleTwPictureCardPreview(type) {
        //   if(this.hasTwPoster){
        //     this.dialogVisible=true;
        //   }
        // },
        handlePosterSuccess(res, file) {
            this.newLive.coverpic = res.url;
        },
        handleTwSuccess(res, file) {
            this.newLive.toppic = res.url;
        },
        handleGifSuccess(res, file) {

            this.newLive.cover_gif = res.url;
        },
        handleBaSuccess(res, file) {
            this.newLive.cover_banner = res.url;
        },
        beforePosterUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        queryAdmin() {
            let para = {
                    ttaccid: '',
                    app_id: this.newLive.livePlatform.split('-')[0],
                    roomid: this.newLive.roomid,
                    page: '1',
                    pageSize: '10'
                },
                _this = this;
            queryAdmin(para).then((res) => {
                if (res.code === '00001') {
                    let adminData = res.data.data;
                    if (adminData && adminData.length > 0) {
                        for (let i = 0; i < adminData.length; i++) {
                            _this.roomAdminArr.push(adminData[i].accid);
                        }
                        _this.newLive.managers = res.data.data;
                    }
                }
                this.listLoading = false;
            });
        },
        queryEditor() {
            if (this.myRoomkey && this.myRoomkey != 'add') {
                this.newLive = {};
                let para = {
                    roomkey: this.myRoomkey
                }
                this.listLoading = true;
                queryRoomInfo(para).then((res) => {
                    if (res.code === '00001') {
                        let roomInfo = res.data.roomInfo;
                        if (roomInfo && roomInfo.accid) {
                            this.newLive = {
                                roomkey: this.myRoomkey,
                                ttaccid: ~~roomInfo.accid,
                                app_id: roomInfo.app_id,
                                roomtype: roomInfo.roomtype + '',
                                livestatus: roomInfo.livestatus,
                                toppic: roomInfo.toppic,
                                cover_gif: roomInfo.cover_gif,
                                cover_banner: roomInfo.cover_banner,
                                title: roomInfo.title,
                                coverpic: roomInfo.coverpic,
                                liveintroduce: roomInfo.liveintroduce,
                                pushlivecode: roomInfo.pushlivecode,
                                flvurl: roomInfo.flvurl,
                                hlsurl: roomInfo.hlsurl,
                                overwrite: roomInfo.overwrite,
                                roomid: roomInfo.roomid,
                                tuiliu: roomInfo.flvurl ? roomInfo.flvurl : roomInfo.pushlivecode,
                                tuiliuSelect: roomInfo.hlsurl == '' ? '2' : '1',
                                commentflag: roomInfo.commentflag,
                                livePlatform: roomInfo.app_id + '-' + roomInfo.tag
                            };
                            this.queryAdmin();
                        }
                    } else {
                        this.$message.warning(res.ret);
                    }
                    this.editType = true;
                    this.listLoading = false;
                })
            }
        },
        querySearchAsync(queryString, cb) {
            var managers = this.newLive.managers;
            var results = queryString ? managers.filter(this.createStateFilter(queryString)) : managers;
            cb(results);
            // clearTimeout(this.timeout);
            // this.timeout = setTimeout(() => {
            //   cb(results);
            // }, 3000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.accid.indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {

        },
        // 生成推流
        getPullFlow(event) {
            // rtmp://tui.mv.dftoutiao.com/live/{流名}?code={流名}&sign=1e1f1b81f5a1ceab5ceaa9d3bc23412a
            // sigin = md5(流名+c3e07c93ccd293d255a9eade3db17a6d)
            this.plugFlowUrl = 'rtmp://tui.mv.dftoutiao.com/live/' + this.plugFlowName + '?code=' + this.plugFlowName + '&sign=' + md5(this.plugFlowName + 'c3e07c93ccd293d255a9eade3db17a6d')
            clip(this.plugFlowUrl, event)
        },
        createLiveVerify() {
            let params = {
                livecode: this.newLive.tuiliu
            }
            createLiveVerify(params).then(res => {
                if (!res.data) {
                    this.$message({
                        showClose: true,
                        message: '请输入正确的推流流名',
                        type: 'warning'
                    });
                    this.canCreate = false
                } else {
                    this.canCreate = true
                }
            })
        }
    },
    mounted() {
        this.imgUploadUrl = roomfileUpload;
        this.$refs.newLive.resetFields();
        this.myRoomkey = this.$route.query.roomkey;
        this.roomAdminArr = [];
        this.newLive.roomtype = '2';
        this.newLive.tuiliuSelect = '1';
        this.newLive.hlsurl = '';
        this.newLive.overwrite = 0;
        this.newLive.commentflag = 1;
        this.newLive.hlsurl = '';
        this.queryEditor();
        this.getLivePlatform();
        // this.$router.query
        //        this.newLive.managers = this.queryAdmin();
    },
    activated() { //keep-alive 组件激活
        this.$refs.newLive.resetFields();
        this.myRoomkey = this.$route.query.roomkey;
        this.roomAdminArr = [];
        this.newLive.roomtype = '2';
        this.newLive.tuiliuSelect = '1';
        this.newLive.hlsurl = '';
        this.newLive.overwrite = 0;
        this.newLive.commentflag = 1;
        this.newLive.hlsurl = '';
        if (this.$route.query.type == 'edit') {
            this.queryEditor();
            this.editType = true;
        } else {
            this.editType = false;
        }

    }
}
</script>
<style lang="scss" scoped>
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

.select-smallW>.el-input {
    width: 110px;
}

.w50 {
    width: 50%;
}

.w30 {
    width: 40%;
}

.w40 {
    width: 50%;
    padding-top: 10px;
}

.item {
    margin-top: 10px;
    margin-right: 40px;
}
</style>
