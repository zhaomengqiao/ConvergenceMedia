<template>
<div :v-loading="listAllLoading">
    <el-form label-position="left" :model="blackList" ref="blackList" class="clearfix">
        <el-row :span="24" class="clearfix" :gutter="20">
            <el-col :span="6">
                <el-form-item prop="ttaccid">
                    <el-input placeholder="请输入主播ID或账号进行搜索" v-model.number="temp.accid">
                        <el-select placeholder="请选择直播平台" v-model="temp.appId" style="width: 120px;" slot="prepend">
                            <el-option v-for="(item,index) in livePlatform" :key="item.index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button slot="append" type="primary" @click.native="sendQueryLiveList" icon="search"></el-button>
                    </el-input>
                </el-form-item>
                <el-input placeholder="主播昵称" v-model="temp.nickName">
                </el-input>
            </el-col>
            <el-col class="el-col-auto">
                <el-form-item style="margin:0">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleSuccess" :http-request='beforeAvatarVedioUpload'>
                        <img v-if="temp.headPic" :src="temp.headPic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item>
                    <!-- <el-select placeholder="请选择设置" class="select-smallW" style="width:150px;" v-model="blackList.state">
                            	<el-option label="设为主播" value="1"></el-option>
                            	<el-option label="取消主播权限" value="0"></el-option>
                        </el-select> -->
                    <span>{{blackList.accid}}</span>
                    <el-checkbox v-model="isAnchor" v-if="isAnchorShow" style="margin-right:10px">设为主播</el-checkbox>
                    <el-button type="primary" @click.native.prevent="pushLiveWhite" v-if="saveShow" :disabled="saveDisabled">保存</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <hr style="border:1px solid #f3f3f3;margin-bottom:30px;">
    <el-form label-position="left" :model="blackList" ref="blackList">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item prop="ttaccid">
                    <el-input placeholder="请输入主播ID或账号进行搜索" v-model.number="blackList.ttaccid">
                        <el-select placeholder="请选择直播平台" v-model="blackList.livePlatform" style="width: 120px;" slot="prepend">
                            <el-option v-for="(item,index) in livePlatform" :key="item.index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button slot="append" type="primary" @click.native="anchorQueryList" icon="search"></el-button>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-table ref="singleTable" :data="tableData" stripe border highlight-current-row width="100%" v-loading="listLoading">
        <el-table-column prop="accid" label="主播ID"></el-table-column>
        <el-table-column prop="nickName" label="主播昵称"></el-table-column>
        <el-table-column prop="accountName" label="主播帐号"></el-table-column>
        <el-table-column prop="appId" label="所属平台"></el-table-column>
        <el-table-column prop="modifyDateFmt" label="开放时间"></el-table-column>
        <el-table-column prop="operate" label="操作" fixed="right">
            <template slot-scope="scope">
                <el-button @click.native.prevent="handleUpdate(scope.row)" type="primary" size="small">编辑</el-button>
                <el-button @click.native.prevent="removeLiveWhite(scope.row)" type="primary" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background @current-change="handlePageChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" :page-size="pageCount" :current-page.sync="page" :page-sizes="[10]" style="float:right;" :total="total">
    </el-pagination>
</div>
</template>
<script>
import {
    mapGetters
} from 'vuex';
import {
    getfileUpload
} from '@/api/operationTools'
import {
    whiteUploadImg,
    addwhiteuser,
    removewhiteuser,
    getLivePlatform,
    setUserLiveState,
    anchorChangeBlk,
    anchorQueryList,
    anchorQueryUser,
} from '@/api/liveManage';
export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            saveDisabled: true,
            isAnchorShow: false,
            isAnchor: false,
            listLoading: false,
            listAllLoading: false,
            saveShow: false,
            total: 0,
            page: 1,
            accid: '',
            pageCount: 10,
            blackList: {
                ttaccid: '',
                app_id: '',
                state: '1',
                account: '',
                livePlatform: '',
                accid: '',
                pageSize: 10
            },
            search: {
                livePlatform: '',
            },
            temp: {
                nickName: '',
                headPic: '',
                ttaccid: '',
                state: '1',
                appId: ''
            },
            livePlatform: [],
            tableData: [],
            fileUpload: ''
        }
    },
    mounted() {
        this.pageCount = this.personalConfig.tableRowShow
        this.getLivePlatform();
        this.fileUpload = getfileUpload;
    },
    methods: {
        getLivePlatform() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'open/liveroom'
            }
            getLivePlatform(params).then(res => {
                this.livePlatform = res.data;
                if (res.data.length > 0) {
                    this.temp.appId = res.data[0].value;
                    this.blackList.livePlatform = res.data[0].value;
                    this.anchorQueryList();
                }
            });
        },
        // anchorQueryList(){
        // 		let params={
        // 			dfhname:'',
        // 			blkstatus:'',
        // 			lastkey:'',
        // 			pagesize:this.pageSize
        // 		}
        // 		anchorQueryList(params).then(res => {
        // 			if(res.code === '00001'){
        // 				this.tableData=res.data;
        // 			}
        // 		});
        // },
        sendQueryLiveList() {
            let params = {
                ttaccid: this.temp.accid,
                app_id: this.temp.appId.split('-')[0]
            }
            var _this = this;
            this.listAllLoading = true;
            anchorQueryUser(params).then(res => {
                if (res.code === '00001') {
                    this.saveDisabled = false
                    let data = res.data.result;
                    if (data.userflag == 1) {
                        this.isAnchorShow = true;
                    }
                    if (data != "") {
                        this.saveShow = true;
                        this.accid = data.accid
                        if (data.hostNickName == '') {
                            _this.temp.nickName = _this.temp.accid;
                        } else {
                            _this.temp.nickName = data.hostNickName;
                        }
                        _this.temp.headPic = data.headPic;
                    } else {
                        this.saveShow = false;
                        this.$message({
                            type: 'warning',
                            message: '平台下无该用户'
                        });
                        return false
                    }
                }
                this.listAllLoading = false;
            });
        },
        anchorQueryList() {
            console.log(this.blackList.livePlatform)
            let params = {
                ttaccid: this.blackList.ttaccid,
                app_id: this.blackList.livePlatform.split('-')[0],
                pageNum: this.page,
                pageCount: this.pageCount
            }
            this.listLoading = true;
            anchorQueryList(params).then(res => {
                if (res.code === '00001') {
                    this.tableData = res.data.result;
                    this.total = res.data.count;
                }
                this.listLoading = false
            });
        },
        pushLiveWhite() {
            var params = {};
            params = Object.assign({}, this.temp);
            params.appId = this.temp.appId.split("-")[0];
            params.hostNickName = this.temp.nickName;
            params.accid = this.accid;
            if (this.isAnchor == true) {
                params.userflag = 3
            }
            this.listAllLoading = true
            addwhiteuser(params).then(res => {
                if (res.code === '00001') {
                    this.saveDisabled = true;
                    this.saveShow = false;

                    this.isAnchorShow = false;
                    this.isAnchor = false;
                    this.blackList.ttaccid = this.temp.accid;
                    this.blackList.livePlatform = this.temp.appId;
                    this.anchorQueryList();
                    this.temp.accid = '';
                    this.temp.nickName = '';
                    this.temp.headPic = '';
                    this.accid = '';
                    this.$notify({
                        title: '成功',
                        message: res.data.msg,
                        type: 'success'
                    });
                }
                this.listAllLoading = false
            });
        },
        removeLiveWhite(row) {
            let params = {
                nickName: row.hostNickName,
                headPic: row.headPic,
                ttaccid: "",
                state: 1,
                appId: row.appId,
                accid: row.accid,
                hostNickName: row.hostNickName
            }
            params.userflag = 1
            this.$confirm('是否取消该主播白名单', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                addwhiteuser(params).then(res => {
                    if (res.code === '00001') {
                        this.saveShow = false;
                        this.anchorQueryList();
                        this.$message({
                            type: 'success',
                            message: '取消白名单成功!'
                        });
                    } else {
                        this.$notify({
                            title: '失败',
                            message: res.data.msg,
                            type: 'warning'
                        });
                    }
                    this.listLoading = false
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消白名单失败'
                });
            });
        },
        beforeAvatarUpload() {

        },
        handleSuccess(res, file) { //上传成功
            this.temp.headPic = res.url
        },
        handlePageChange(val) {
            this.anchorQueryList()
        },
        handleSizeChange() {
            this.anchorQueryList()
        },
        handleUpdate(row) {
            this.saveShow = true;
            this.saveDisabled = false
            this.temp = Object.assign({}, row);
            this.accid = row.accid
            this.dialogFormVisible = true;
            let _this = this
            this.livePlatform.forEach(function(item) {
                if (_this.temp.appId == item.value.split('-')[0]) {
                    _this.temp.appId = item.value
                }
            })
        },
        beforeAvatarVedioUpload(res) {
            let _this = this
            let file = res.file;
            let name = file.name;
            let type = file.type;
            let img = '';
            let ext = name.split('.')[1];
            let appid = this.blackList.livePlatform;

            function readAsDataURL() {
                var reader = new FileReader();
                //将文件以Data URL形式读入页面
                reader.readAsDataURL(file);
                console.log(file)
                reader.onload = function(e) {
                    let params = {
                        img: e.srcElement.result.replace(/[\r\n]/g, "").replace('data:' + type + ';base64,', ''),
                        ext: '.' + ext,
                        accid: _this.accid /*'100476006'*/
                    }
                    _this.listAllLoading = true
                    whiteUploadImg(params).then(res => {
                        if (res.code == "00001") {
                            let data = res.data;
                            _this.temp.headPic = res.data.src;
                            console.log(_this.temp.headPic)
                        }
                        _this.listAllLoading = false
                    });
                }
            }
            readAsDataURL();
        }
    }

}
</script>
<style media="screen">
.avatar-uploader .el-upload {
    border: 1px dashed #666;
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
    width: 94px;
    height: 94px;
    line-height: 94px;
    text-align: center;
}

.avatar {
    width: 94px;
    height: 94px;
    display: block;
}
</style>
