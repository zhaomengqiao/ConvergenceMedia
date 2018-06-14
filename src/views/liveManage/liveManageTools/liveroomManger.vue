<template>
<div v-loading="listLoading">
    <el-form label-position="left" :model="roomManagePara" :rules="rules" ref="roomManage" :inline="true">
        <el-form-item prop="livePlat" label="直播平台:">
            <el-select placeholder="请选择直播平台" v-model="roomManagePara.livePlat" @change="getClassify" style="width: 120px;">
                <el-option v-for="(item,index) in livePlatform" :key="item.index" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="livePlat" label="直播类型:">
            <el-select v-model="roomManagePara.roomclassify" placeholder="请选择直播类型" style="width: 150px;">
                <el-option v-for="(item,index) in classify" :key="item.id" :label="item.title" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="ttaccid" label="主播ID:">
            <el-input placeholder="请输入主播ID" v-model="roomManagePara.ttaccid" style="width: 250px;">
                <el-button slot="append" type="primary" @click.native="sendQueryLiveList" icon="el-icon-search"></el-button>
            </el-input>
        </el-form-item>
        <el-col class="pull-right el-col-auto" style="padding-right:50px;">
            <el-button inline type="primary" @click="createRoom" v-if="isAuth.saveRoom">创建房间</el-button>
        </el-col>
    </el-form>
    <el-table :data="roomManage" class="roomList" stripe border highlight-current-row style="width:100%">
        <el-table-column prop="nickname" label="昵称-账号(ID)" width="300">
            <template slot-scope="scope">
                    {{scope.row.nickname}}-{{scope.row.accountname}}({{scope.row.accid}})
                </template>
        </el-table-column>
        <el-table-column prop="roomid" label="房间ID" width="120"></el-table-column>
        <el-table-column prop="title" label="直播标题" width="300">
            <template slot-scope="scope">
            		<el-popover
						  ref="popover1"
						  placement="right"
						  title="直播封面"
						  width="250"
						  height="150"
						  trigger="hover"
						  >
						  <img :src="scope.row.coverpic" width="100%" height="100%" />
						</el-popover>
                    <el-button v-popover:popover1 @click.native="openVideoUrl(scope.$index,scope.row)">{{scope.row.title}}</el-button>
                </template>
        </el-table-column>
        <el-table-column prop="roomkey" label="roomkey" width="200"></el-table-column>
        <el-table-column prop="starttime" label="开始-结束时间" width="200">
            <template slot-scope="scope">
            	 	{{ scope.row.starttime.indexOf("-") == -1 && roomManage[scope.$index].starttime!='' ? format(parseInt(scope.row.starttime), 'yyyy-MM-dd HH:mm:ss') : scope.row.starttime}}
                    <br/>
                    {{ scope.row.endtime.indexOf("-") == -1 && roomManage[scope.$index].endtime!='' ? format(parseInt(scope.row.endtime), 'yyyy-MM-dd HH:mm:ss') : scope.row.endtime}}
            	 </template>
        </el-table-column>
        <el-table-column prop="livestatus" label="直播状态" width="110"></el-table-column>
        <el-table-column prop="lookback" label="观看人数" width="110">
            <template slot-scope="scope">
                    <span v-if="scope.row.livestatus=='回看'">{{scope.row.lookback}}</span>
                    <span v-else>{{scope.row.all}}</span>
                </template>
        </el-table-column>
        <el-table-column prop="commentflag" label="评论状态" width="120">
            <template slot-scope="scope">
                    <span v-if="scope.row.commentflag=='是'">允许评论</span>
                    <span v-else>禁止评论</span>
                </template>
        </el-table-column>
        <el-table-column prop="pushurl" label="推流URL" width="500"></el-table-column>
        <el-table-column prop="hlsurl" label="拉流URL" width="500"></el-table-column>
        <el-table-column prop="operate" fixed="right" label="操作" width="500">
            <template slot-scope="scope">
                	<el-button  type="primary" v-if="scope.row.commentflag=='是'&&isAuth.queryCommentList" @click.native.prevent="showCommentDetail(scope.$index, scope.row)" size="small">查看评论</el-button>
                   	<el-button v-if="(scope.row.livestatus=='直播'||scope.row.livestatus=='回看')&&isAuth.updateTitleAndPic" @click.native.prevent="editRoom(scope.$index, roomManage[scope.$index])" type="primary" size="small">编辑</el-button>
                    <el-button v-if="scope.row.livestatus=='直播'&&isAuth.finishRoom" @click.native.prevent="closeRoom(0, scope.row)" type="primary" size="small">关闭房间</el-button>
                    <el-button v-if='isAuth.deleteroom' @click.native.prevent="deleteRoom(1, scope.row)" type="primary" size="small">删除房间</el-button>
                    <el-button  @click="showCount(scope.$index, scope.row)" v-if="isAuth.updateCount"  type="primary" size="small">更改人数</el-button>
					<el-button  @click="repairContentRoom(scope.$index, scope.row)" v-if='scope.row.roomtype=="3"||scope.row.roomtype=="4"'  type="primary" size="small">维护内容</el-button>
                    <el-button  v-if="scope.row.livestatus=='回看'&&scope.row.roomtype!='3'&&isAuth.videoCut"  @click="showLookBack(scope.$index, scope.row)" type="primary" size="small">设置回看</el-button>
                </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination @current-change="handleCurrentChange" :page-size="roomManagePara.pageSize" :total="roomManagePara.total" :current-page="roomManagePara.page" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 50,100]"
            style="float:right;">
        </el-pagination>
    </div>

    <el-dialog title="修改观看人数" :visible.sync="updateVisible" style="height: 350px;" :close-on-click-modal="false">
        <el-form label-position="right" label-width="140px" :model="objLook" ref="objLook">
            <el-form-item label="回看人数：" v-if="objLook.livestatus=='回看'" prop="lookback" :rules="[
													      { required: true, message: '人数不能为空'},
													      { type: 'number', message: '人数必须为数字值'}
													    ]">
                <el-input v-model.number="objLook.lookback" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item v-else label="所有人数：" prop="all" :rules="[
													      { required: true, message: '人数不能为空'},
													      { type: 'number', message: '人数必须为数字值'}
													    ]">
                <el-input v-model.number="objLook.all" style="width: 200px;"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
			    <el-button @click="updateVisible = false">取 消</el-button>
			    <el-button type="primary" @click="updateCount">确 定</el-button>
			  </span>
    </el-dialog>

    <el-dialog title="回看视频修改" :visible.sync="lookVisible" :close-on-click-modal="false">
        <el-tabs v-model="activeLook">
            <el-tab-pane label="截取回看" name="1">
                <el-form label-position="right" label-width="160px" :model="lookBack" ref="lookBack">
                    <el-checkbox-group v-model="lookBack.videourl" @change="changeUrl">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-checkbox :label="lookBack.hlsurl" style="width:100%">MP4
                                    <el-button type="text" @click="copyUrl(lookBack.flvurl,$event)">[复制链接]</el-button>
                                    <video-player :options="videoOptionsLeft"></video-player>
                                </el-checkbox>
                            </el-col>
                            <el-col :span="12">
                                <el-checkbox :label="lookBack.flvurl" style="width:100%">FLV
                                    <el-button type="text" @click="copyUrl(lookBack.flvurl,$event)">[复制链接]</el-button>
                                    <video-player :options="videoOptionsRight"></video-player>
                                </el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                    <el-form-item label="截取的开始位置(秒)：" prop="startTime" :rules="[
														      { required: true, message: '开始位置不能为空'},
														      { type: 'number', message: '开始位置必须为数字值'}
														    ]">
                        <el-input v-model.number="lookBack.startTime" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="截取的长度：" prop="operation" :rules="[
		                  										{ required: true, message: '长度不能为空'},
														      { type: 'number', message: '长度必须为数字值'}
														    ]">
                        <el-input v-model.number="lookBack.operation" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="替换原视频：">
                        <el-switch v-model="lookBack.modify" on-text="" off-text="">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="上传回看" name="2">
                <el-upload class="avatar-videoUploader" :action="videoUploadUrl" accept='.mp4,.mov' :show-file-list="false" :http-request='beforeAvatarVedioUpload' :on-change='handleChange'>
                    <i class=" avatar-video-uploader-icon" v-if='!videoload&&videoloadSize==0'></i>
                    <el-progress type="circle" :percentage="videoloadSize" v-if='!videoload&&videoloadSize>0'></el-progress>
                    <el-progress type="circle" :percentage="videoloadSize" v-if='videoload&&videoUrl==""' status="exception"></el-progress>
                    <video width="160" height="120" v-if='videoUrl!=""' id='sendVideo' controls>
					    <source :src="videoUrl" type="video/mp4">
						您的浏览器不支持 video 属性。
					</video>
                </el-upload>
                <p></p>
                <div>
                    替换原视频：
                    <el-switch v-model="lookBack.modify" on-text="" off-text="">
                    </el-switch>
                </div>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
			    <el-button @click="lookVisible = false">取 消</el-button>
			    <el-button type="primary" @click="updateLook">确 定</el-button>
			  </span>
    </el-dialog>

</div>
</template>
<style scoped>
.red {
    color: red;
}

.roomList .cell .el-button--default {
    border: 0px solid #c4c4c4;
    background: rgba(255, 255, 255, 0);
}

.avatar-video-uploader-icon {
    margin-top: 10px;
    display: inline-block;
    width: 204px;
    height: 105px;
    background-image: url(../../../assets/video_images/upload.png);
}

.green {
    color: green;
}
</style>
<script>
import $ from 'jquery'
import {
    queryLiveList,
    updateLookBack,
    finishRoom,
    finishRoomTwo,
    getLivePlatform,
    updateLiveCount,
    deleteRoom,
    queryLiveListHistory,
    getLiveClassList,
} from '@/api/liveManage'
import {
    LIVECLASS
} from '@/api/commonApi'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
    data() {
        var checkAccid = (rule, value, callback) => {
            if (value === '') {
                // callback(new Error('请输入主播ID'))
                this.$message.error('请输入主播ID');
            } else {
                if (!Number.isInteger(value)) {
                    // callback(new Error('请输入数字'));
                    this.$message.error('请输入数字');
                } else {
                    callback();
                }
            }
        }
        return {
            videoOptionsLeft: {
                source: {
                    type: "video/mp4", //视频格式
                    src: "" //视频地址
                },
                playbackRates: [0.5, 1, 1.5, 2], //播放速度
                poster: "", //视频封面图片
                autoplay: false, //自动播放
                controls: true, //播放控制条是否显示
                preload: true, //是否预加载
                width: "100%", //宽度
                height: "250px", //高度
                language: 'zh-cn',
                //        controlBar:     //控制条显示配置
                techOrder: ['html5', 'flash'], //支持视频类型
            },
            videoOptionsRight: {
                source: {
                    type: "video/mp4", //视频格式
                    src: "" //视频地址
                },
                language: 'zh-CN',
                playbackRates: [0.5, 1, 1.5, 2], //播放速度
                poster: "", //视频封面图片
                autoplay: false, //自动播放
                controls: true, //播放控制条是否显示
                preload: true, //是否预加载
                width: "100%", //宽度
                height: "250px", //高度
                //        controlBar:     //控制条显示配置
                techOrder: ['html5', 'flash'], //支持视频类型
            },
            listLoading: false,
            updateVisible: false,
            lookVisible: false,
            activeLook: '1',
            videoUploadUrl: '',
            videoUrl: '',
            classify: [],
            videoload: false,
            videoloadSize: 0,
            roomManagePara: {
                num: 500,
                tagid: '1000',
                ttaccid: '',
                total: 0,
                page: 1,
                pageSize: 10,
                colparam: '',
                app_id: '',
                livePlat: '',
                roomclassify: ''
            },
            objLook: {
                all: 0,
                ttaccid: '',
                rowkey: '',
                lookback: 0,
                livestatus: ''
            },
            lookBack: {
                flvurl: '',
                hlsurl: '',
                rowkey: '',
                videourl: [],
                operation: '',
                startTime: '',
                modify: true,
                livestatus: ''
            },
            isAuth: {
                deleteroom: false,
                queryCommentList: false,
                updateTitleAndPic: false,
                finishRoom: false,
                updateCount: false,
                videoCut: false,
                saveRoom: false,
            },
            livePlatform: [],
            curPage: 1,
            isNextPage: true,
            prevPage: '',
            prevColparam: '',
            rules: {
                ttaccid: [
                    //              {validator:checkAccid,trigger:'blur'}
                    // {require:true,message:'请输入主播ID',trigger:'blur'},
                    // {type:'number',message:'请输入数字',trigger:'change'}
                ]
            },
            roomManage: [],
            roomManageList: []
        }
    },
    mounted() {
        this.getLivePlatform();
        this.getAuth();
    },
    activated() { //keep-alive 组件激活
        this.sendQueryLiveList();
    },
    methods: {
        getAuth() { //权限控制
            this.authorList = localStorage.getItem('authorList');
            if (this.authorList.indexOf('api/liveroommanager/deleteroom') > -1) {
                this.isAuth.deleteroom = true;
            }
            if (this.authorList.indexOf('api/liveroommanager/queryCommentList') > -1) {
                this.isAuth.queryCommentList = true;
            }
            if (this.authorList.indexOf('api/liveroommanager/updateTitleAndPic') > -1) {
                this.isAuth.updateTitleAndPic = true;
            }
            if (this.authorList.indexOf('api/liveroommanager/finishRoom') > -1) {
                this.isAuth.finishRoom = true;
            }
            if (this.authorList.indexOf('api/liveroommanager/updateCount') > -1) {
                this.isAuth.updateCount = true;
            }
            if (this.authorList.indexOf('api/liveroommanager/videoCut') > -1) {
                this.isAuth.videoCut = true;
            }
            if (this.authorList.indexOf('api/liveroommanager/save') > -1) {
                this.isAuth.saveRoom = true;
            }

        },
        getClassify() {
            var plat = this.roomManagePara.livePlat.split("-")[0]
            let params = {
                app_id: plat,
                is_test: LIVECLASS
            }
            getLiveClassList(params).then(res => {
                if (res.code == "00001") {
                    var _this = this;
                    _this.classify = res.data.data;
                    if (_this.classify.length == 0) {
                        _this.roomManagePara.roomclassify = ''
                    } else {
                        _this.roomManagePara.roomclassify = _this.classify[0].id
                    }
                    this.sendQueryLiveList();
                }
            });
        },
        createRoom() {
            this.$router.push({
                path: '/content/maintenance',
                query: {
                    type: 'add'
                }
            });
        },
        handleChange(file) {
            this.videoloadSize = 0;
            this.videoload = false;
            this.form.videoUrl = '';
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
                this.roomManagePara.livePlat = res.data[0].value;
                // this.getClassify();
            });
        },
        // 视频上传
        beforeAvatarVedioUpload(res) {
            var _this = this;
            this.videoloadSize = 10;
            this.videoInterva = window.setInterval(() => {
                if (this.videoloadSize < 85) {
                    this.videoloadSize += 5;
                } else if (this.videoloadSize < 95) {
                    this.videoloadSize += 1;
                }
            }, 500);
            let file = res.file;
            let name = file.name; //文件名
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
            } else {
                params.type = 'newsvideo';
            }

            let isAuth = newsvideoGetauth(params).then(res => {
                if (res.code = '00001') {
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
                        success: function(response, textStatus, jqXHR) {
                            _this.videoloadSize = 100;
                            _this.videoload = true;
                            _this.form.videoUrl = vurl;
                            clearInterval(this.videoInterva);
                            _this.$notify({
                                title: '成功',
                                message: '视频上传成功',
                                type: 'success'
                            });
                        }
                    });

                    return true;
                } else {
                    return false;
                }
            });
        },
        sendQueryLiveList() {
            let _this = this;
            this.roomManagePara.page = 1;
            this.roomManagePara.app_id = this.roomManagePara.livePlat.split('-')[0];
            this.roomManagePara.tagid = this.roomManagePara.roomclassify;
            this.roomManagePara.colparam = ''
            this.listLoading = true;
            if (_this.roomManagePara.ttaccid == '') {
                queryLiveList(this.roomManagePara).then((res) => {
                    if (res.code === '00001') {
                        _this.roomManageList = res.data.rooms;
                        if (_this.roomManageList.length > 0) {
                            _this.roomManage = _this.roomManageList.slice((_this.roomManagePara.page - 1) * _this.roomManagePara.pageSize, _this.roomManagePara.pageSize);
                            _this.roomManagePara.colparam = res.colparam;
                            _this.roomManagePara.total = _this.roomManageList.length;
                        } else {
                            _this.roomManage = [];
                            _this.roomManagePara.colparam = res.colparam;
                            _this.roomManagePara.total = 0;
                        }
                    }
                    this.listLoading = false;
                });
            } else {
                // ttaccid: 主播id或观众id
                // isanchor: 1-主播/0-关注。如果获取主播开播历史这里传1，否则传0
                // colparam: 开始rowkey，第一次传空字符串，下一页传接口返回的colparam值
                // num: 一页获取的数量
                // jsonpcallback: jsonp的function(可为空或不传)
                // 返回:
                // stat: 错误码
                // msg: 错误描述
                // colparam: 作为下一页请求的colparam
                // data: 房间信息 的数组
                this.roomManagePara.isanchor = 1
                queryLiveListHistory(this.roomManagePara).then(res => {
                    if (res.code === '00001') {
                        _this.roomManageList = res.data.data;
                        if (_this.roomManageList.length > 0) {
                            _this.roomManage = _this.roomManageList.slice((_this.roomManagePara.page - 1) * _this.roomManagePara.pageSize, _this.roomManagePara.pageSize);
                            _this.roomManagePara.colparam = res.colparam;
                            _this.roomManagePara.total = _this.roomManageList.length;
                        } else {
                            _this.roomManage = [];
                            _this.roomManagePara.colparam = res.colparam;
                            _this.roomManagePara.total = 0;
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.ret
                        });
                    }
                    this.listLoading = false;
                })
            }



        },
        handleCurrentChange(val) { //分页
            this.roomManagePara.page = val;
            let start = (this.roomManagePara.page - 1) * this.roomManagePara.pageSize;
            this.roomManage = this.roomManageList.slice(start, start + this.roomManagePara.pageSize);
        },
        handleSizeChange(val) { //分页
            this.roomManagePara.pageSize = val;
            let start = (this.roomManagePara.page - 1) * this.roomManagePara.pageSize;
            this.roomManage = this.roomManageList.slice(start, start + this.roomManagePara.pageSize);
        },
        editRoom(index, obj) {
            this.$router.push({
                path: '/content/maintenance',
                query: {
                    roomkey: obj.roomkey,
                    type: 'edit'
                }
            });
        },
        repairContentRoom(index, obj) { //图文维护
            let livestatus = '';
            if (obj.livestatus == '直播') {
                livestatus = '0'
            } else if (obj.livestatus == '初始') {
                livestatus = '100'
            } else if (obj.livestatus == '直播结束') {
                livestatus = '1'
            } else if (obj.livestatus == '回看') {
                livestatus = '2'
            }
            this.$router.push({
                path: '/content/imgTextLive',
                query: {
                    roomid: obj.roomid,
                    appid: obj.app_id,
                    livestatus: livestatus,
                    accid: obj.accid,
                    type: 'edit'
                }
            });
        },
        closeRoom(index, obj) {
            let para = {
                roomid: obj.roomid,
                ttaccid: obj.accid,
                app_id: obj.app_id,
                closeAndDelete: index
            }
            this.$confirm('确认提交吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;

                finishRoom(para).then((res) => {
                    if (res.code == '00001') {
                        let param = {
                            roomId: obj.roomid,
                            accid: obj.accid,
                            app_id: obj.app_id
                        }
                        this.sendQueryLiveList();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.ret
                        });
                    }
                    this.listLoading = false;
                });
            });
        },
        deleteRoom(index, obj) {
            let para = {
                tagid: obj.tag,
                rowkey: obj.roomkey
            }
            this.$confirm('确认提交吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                deleteRoom(para).then((res) => {
                    if (res.code == '00001') {
                        let param = {
                            roomId: obj.roomid,
                            accid: obj.accid,
                            app_id: obj.app_id
                        }
                        this.sendQueryLiveList();
                    }
                    this.listLoading = false;
                });
            });
        },
        showCount(index, obj) {
            this.objLook = {
                all: obj.all,
                ttaccid: obj.accid,
                rowkey: obj.roomkey,
                lookback: obj.lookback,
                livestatus: obj.livestatus
            };
            this.updateVisible = true;
        },
        //复制URL按钮
        copyUrl(text, event) {
            clip(text, event)
        },
        showLookBack(index, obj) {
            this.lookBack = {
                flvurl: obj.recordingurl[1],
                hlsurl: obj.recordingurl[0],
                rowkey: obj.roomkey,
                videourl: [],
                operation: '',
                startTime: '',
                modify: true,
                livestatus: ''
            }
            this.lookVisible = true;
            this.videoOptionsLeft.source.src = obj.recordingurl[1];
            this.videoOptionsRight.source.src = obj.recordingurl[0];
            let leftUrl, rightUrl;
            var _this = this;
            if (obj.recordingurl.length != 0) {
                obj.recordingurl.forEach(item => {
                    if (item.indexOf('.mp4') != -1) {
                        leftUrl = item
                        _this.lookBack.hlsurl = item
                    }
                    if (item.indexOf('.flv') != -1) {
                        rightUrl = item
                        _this.lookBack.flvurl = item
                    }
                })
                this.videoOptionsLeft.source.src = leftUrl;
                this.videoOptionsRight.source.src = rightUrl;
            }
        },
        updateCount() {
            if (this.objLook.livestatus == '回看') {
                this.objLook.all = this.objLook.lookback;
            } else {
                this.objLook.lookback = this.objLook.all;
            }
            this.$refs['objLook'].validate((valid) => {
                if (valid) {

                    updateLiveCount(this.objLook).then((res) => {
                        if (res.code == '00001') {
                            this.sendQueryLiveList();
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success'
                            });
                        }
                        this.updateVisible = false;
                    });
                }
            });
        },
        updateLook() {
            this.$refs['lookBack'].validate((valid) => {
                if (valid) {
                    let para = {
                        videourl: this.lookBack.videourl.join(','),
                        roomkey: this.lookBack.rowkey,
                        operation: this.lookBack.startTime + ',' + this.lookBack.operation,
                        modify: this.lookBack.modify ? 'on' : 'off',
                    }
                    updateLookBack(para).then((res) => {
                        if (res.code == '00001') {
                            this.sendQueryLiveList();
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success'
                            });
                        }
                        this.lookVisible = false;
                    });
                }
            });
        },
        showCommentDetail(index, obj) {
            let url = 'http://api.mv.dftoutiao.com/shared/live.html?id=' + obj.roomkey + '&ttaccid=' + obj.accid + '&apptypeid=' + obj.app_id + '';
            this.$router.push({
                path: '/comment/manager',
                query: {
                    roomid: obj.roomid,
                    app_id: obj.app_id,
                    accid: obj.accid,
                    title: obj.title,
                    shareUrl: url
                }
            });
        },
        openVideoUrl(index, obj) {
            let url = 'http://api.mv.dftoutiao.com/shared/live.html?id=' + obj.roomkey + '&ttaccid=' + obj.accid + '&apptypeid=' + obj.app_id + '';
            window.open(url);
        },
        format(time, format) {
            var t = new Date(time);
            var tf = function(i) {
                return (i < 10 ? '0' : '') + i
            };
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
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
        changeUrl(value) {
            if (value.length == 2) {
                this.lookBack.videourl.splice(0, 1)
            }
        }
    }
}
</script>
