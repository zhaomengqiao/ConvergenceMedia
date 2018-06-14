<template>
<section>
    <el-row :gutter="20" style="margin: 0 auto;" v-loading="listLoading">
        <el-row class="toolbar" prop="searchUrl">
            <el-input v-model.trim="form.searchID" placeholder="请输入正在直播的主播ID" style="width: 300px;" @change="inputChange"></el-input>
            <el-button type="primary" icon="search" @click="livedetail">搜索</el-button>
            <el-radio-group class="pull-right" v-model="auth.topType" @change="changeRecommendType" :disabled="topDisabled">
                <el-radio-button v-if="auth.hasNews" label="新闻">置顶于新闻</el-radio-button>
                <el-radio-button v-if="auth.hasVideo" label="视频">置顶于视频</el-radio-button>
            </el-radio-group>
        </el-row>
        <el-col :span="20" style="padding-top: 10px;">
            <el-table :data="newsData" height="430" border highlight-current-row style="width: 100%;margin: 0 auto;">
                <el-table-column prop="createUser" label="用户" min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="urlId" label="urlId" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="newstype" label="栏目" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="apptypeid" label="app" min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="provid" label="区域" min-width="150" align="center" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="pagenum" label="分屏" min-width="80" align="center">
                </el-table-column>
                <el-table-column prop="idx" label="位置" min-width="80" align="center">
                </el-table-column>
                <el-table-column prop="" label="新闻位置状态" min-width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="newsData[scope.$index].isoneself == 0">非独占</span>
                        <span v-if="newsData[scope.$index].isoneself == 1">独占</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" min-width="160" align="center">
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" min-width="160" align="center">
                </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="4">
            <el-form :inline="true" :model="form" ref="ruleForm" label-position="left" label-width="85px">
                <el-form-item prop="appfrom" label-width="80px" label="操作平台">
                    <!-- <el-input  v-model="form.appfrom" placeholder="请点击选择App"  :disabled="true"></el-input> -->
                    <el-select v-model="form.appfrom" @change='changePlatform'>
                        <el-option v-for="(app,index) in newsAppList" :label="app.label" :value="app.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form :inline="true" ref="topForm" :model="form">
                <el-form-item class="top-select__input" @click.native='dialogHandleOpen(0)' prop="newstype">
                    <el-input v-model="form.newstype" placeholder="请点击选择栏目" :disabled="true" class="disable-click"></el-input>
                </el-form-item>
                <el-form-item class="top-select__input" @click.native='dialogHandleOpen(1)' prop="app">
                    <el-input v-model="form.app" placeholder="请点击选择app" :disabled="true" class="disable-click"></el-input>
                </el-form-item>

                <el-form-item class="top-select__input" @click.native='dialogHandleOpen(2)' prop="provid">
                    <el-input v-model="form.provid" placeholder="请点击选择区域" :disabled="true" class="disable-click"></el-input>
                </el-form-item>
                <el-form-item prop="pagenum">
                    <el-select placeholder="请点击选择屏幕" v-model="form.pagenum" @change='getNewsTopList'>
                        <el-option v-for="(item,index) in selectOptions.idxOptions" :key='index' :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="idx">
                    <el-select placeholder="请点击选择位置" v-model="form.idx" @change='getNewsTopList'>
                        <el-option v-for="(item,index) in selectOptions.areasOptions" :key='index' :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="startTime">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="form.startTime" @change='' type="datetime" placeholder="请选择开始时间" :editable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endTime">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="form.endTime" @change='' type="datetime" placeholder="请选择结束时间" :editable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="isoneself">
                    <el-select placeholder="直播房间" v-model="form.isoneself" @change='getNewsTopList'>
                        <el-option v-for="(item,index) in selectOptions.liveRoom" :key='index' :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="isoneself">
                    <el-select placeholder="是否独占" v-model="form.isoneself" @change='getNewsTopList'>
                        <el-option v-for="(item,index) in selectOptions.dzOptions" :key='index' :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="issuper" v-show="superShow">
                    <el-select placeholder="是否强制置顶" v-model="form.issuper" @change='getNewsTopList'>
                        <el-option v-for="(item,index) in selectOptions.zdOptions" :key='index' :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">置顶</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" style="margin-top:15px;">
            <el-form :inline="true" :model="showform" ref="showform" label-position="right" label-width="100px">
                <el-form-item label="主播昵称：" :span="8">
                    <el-input v-model="showform.anchorName" style="width: 300px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="主播id：" :span="8">
                    <el-input v-model="showform.anchorID" style="width: 300px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="房间状态：" :span="8">
                    <el-input v-model="showform.roomStatus" style="width: 300px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="房间名：" :span="8">
                    <el-input v-model="showform.roomName" style="width: 300px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="房间id：" :span="8">
                    <el-input v-model="showform.roomID" style="width: 300px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="rowkey：" :span="8">
                    <el-input v-model="showform.rowkey" style="width: 300px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="人数：" :span="8">
                    <el-input v-model="showform.userNumber" style="width: 300px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="封面图片：" :span="8">
                    <div class="imgShow" style="width: 300px;"><img :src="showform.coverImg" alt="" width="150" height="150" /></div>
                </el-form-item>
                <el-form-item label="头像：" :span="8">
                    <div class="imgShow" style="width: 300px;"><img :src="showform.avatarImg" alt="" width="150" height="150" /></div>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-dialog title="选择栏目" :visible.sync="typeVisible" size='small' :before-close="handleCloseType" :close-on-click-modal="false">
        <div>
            <el-checkbox-group v-model="newstype">
                <el-row :gutter="10">
                    <div v-for="(type,index) in newsTypeList" style="float: left;padding: 5px;width: 100px;" :id="type.typePy">
                        <el-checkbox v-if="type.children==null" :label="type.typeName" :key="type.typeId">{{type.typeName}}</el-checkbox>
                        <el-checkbox v-else v-model="type.checkAll" :indeterminate="type.indeterminate" :label="type.typeName" @change="handleCheckAllChange($event,type,index)">{{type.typeName}}</el-checkbox>
                        <div v-if='type.checkedCities.length!=0||type.checkAll'>
                            <el-checkbox-group v-model="type.checkedCities" @change="handleCheckedCitiesChange(type.checkedCities,type,index)">
                                <el-checkbox v-for="(typec,indexc) in type.children" :label="typec.typeName" :key="typec.typeId">{{typec.typeName}}</el-checkbox>
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

    <el-dialog title="选择App" :visible.sync="appVisible" :before-close="handleCloseApp" :close-on-click-modal="false">
        <div>
            <el-checkbox-group v-model="app">
                <el-checkbox v-for="app in newsAppListChose" :label="app" :key="app">{{app}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCloseApp">取 消</el-button>
            <el-button type="primary" @click="dialogHandleClose(1)">确定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="选择地区" :visible.sync="providVisible" :before-close="handleClosePro" :close-on-click-modal="false">
        <div style="height:250px">
            <el-checkbox-group v-model="provid">
                <template v-for="areas in newsAreasList">
                            <el-col :span="4" style='padding: 5px 0;'> <el-checkbox  :label="areas" :key="areas">{{areas}}</el-checkbox></el-col>
                        </template>
            </el-checkbox-group>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClosePro">取 消</el-button>
            <el-button type="primary" @click="dialogHandleClose(2)">确定</el-button>
        </div>
    </el-dialog>
</section>
</template>

<script>
import {
    parseTime,
} from '@/utils'
import {
    livedetail,
    newsAreas,
    vRecommendToVideoType,
    vRecommendToNewsType,
    queryPlatDetail,
    newsType,
    newsTopSave,
    checkStickIsConflict,
    newsTopList
} from '@/api/contentRecommend';
import {
    getOperPlatform
} from '@/api/commonApi'

export default {
    data() {
        return {
            superShow: false,
            typeVisible: false,
            appVisible: false,
            providVisible: false,
            newsTypeList: [],
            newsAppListChose: ['DFTT'],
            newsAreasList: [],
            newstype: [],
            app: [],
            provid: [],
            form: {
                appfrom: '',
                searchID: '',
                newstype: '',
                app: '',
                provid: '',
                idx: '1',
                pagenum: '1',
                startTime: '',
                endTime: '',
                isoneself: '',
                liveRoom: '',
                sourcetype: '',
                issuper: ''
            },
            topDisabled: false,
            showform: {
                anchorName: '',
                anchorID: '',
                roomStatus: '',
                roomName: '',
                roomID: '',
                rowkey: '',
                userNumber: '',
                coverImg: '',
                avatarImg: ''
            },
            newsData: [],
            newsAppList: [],
            listLoading: false,
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
                liveRoom: [{
                    value: '0',
                    label: '直播房间'
                }],
                dzOptions: [{
                        value: '0',
                        label: '非独占'
                    },
                    {
                        value: '1',
                        label: '独占'
                    }
                ],
                zdOptions: [{
                        value: '0',
                        label: '非强制置顶'
                    },
                    {
                        value: '1',
                        label: '强制置顶'
                    }
                ]
            },
            auth: {
                topType: '新闻',
                hasNews: false,
                hasVideo: false
            },
            newsShow: true,
            videoShow: true
        }
    },
    activated() { //keep-alive 组件激活

    },
    mounted() {
        this.getAuth();
        this.getOperPlatform();
        this.form.liveRoom = this.selectOptions.liveRoom[0].value;
        this.form.isoneself = this.selectOptions.dzOptions[0].value;
    },
    methods: {
        // 权限
        getAuth() {
            // 置顶于视频
            let authorList = localStorage.getItem('authorList');
            if (authorList.indexOf('liveroom/video/recommendTools') > -1) {
                this.auth.hasVideo = true;
            }
            // 置顶于新闻
            if (authorList.indexOf('liveroom/news/recommendTools') > -1) {
                this.auth.hasNews = true;
            }
            if (!this.auth.hasNews) {
                this.auth.topType = "视频"
            }
            if (!this.auth.hasVideo) {
                this.auth.topType = "新闻"
            }
        },
        inputChange() {
            this.form.searchID = this.form.searchID.replace(/\s+/g, "");
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
        handleCheckedCitiesChange(value, typeOptions, index) {
            let checkedCount = value.length;
            typeOptions.checkedCities = value;
            typeOptions.checkAll = checkedCount === typeOptions.children.length;
            typeOptions.indeterminate = checkedCount > 0 && checkedCount < typeOptions.children.length;
            this.newsTypeList.splice(index, 1, typeOptions);
        },
        getOperPlatform() {
            var user = localStorage.getItem('user'), //获取用户名
                username = JSON.parse(user).username;
            this.form.username = username;
            let params = {
                userName: username,
                url: 'liveroom/recommendTools'
            }
            this.listLoading = true;
            getOperPlatform(params).then(res => {
                this.listLoading = false;
                this.newsAppList = res.data;
                res.data.forEach(function(item) {
                    item.value = item.value.split("-")[0]
                })
                if (res.data && res.data.length > 0) {
                    let platfromArrStr = '';
                    for (let i = 0, len = res.data.length; i < len; i++) {
                        platfromArrStr += res.data[i].value + ',';
                    }
                    this.form.appfrom = this.newsAppList[0].value;
                    this.queryPlatDetail()
                    //  this.queryCreateList();
                    // this.search();
                }
            });
        },
        livedetail() {
            var searchStrReg = new RegExp(/^[0-9]*$/);
            if (!this.form.searchID || !searchStrReg.test(this.form.searchID)) {
                this.$message.error('请输入正确的主播ID');
                return;
            }
            var params = {
                accid: this.form.searchID,
                mtype: this.form.appfrom
            }
            livedetail(params).then(res => {
                if (res.code == '00001') {
                    this.showform.anchorName = res.data.roomInfo.nickname;
                    this.showform.anchorID = res.data.roomInfo.accid;
                    if (res.data.roomInfo.livestatus == 0) {
                        this.showform.roomStatus = '直播';
                    } else if (res.data.roomInfo.livestatus == 1) {
                        this.showform.roomStatus = '直播结束';
                    } else if (res.data.roomInfo.livestatus == 2) {
                        this.showform.roomStatus = '回看';
                    }
                    this.showform.roomName = res.data.roomInfo.title;
                    this.showform.roomID = res.data.roomInfo.roomid;
                    this.showform.rowkey = res.data.roomInfo.roomkey;
                    this.showform.userNumber = res.data.roomInfo.actual;
                    this.showform.coverImg = res.data.roomInfo.coverpic;
                    this.showform.avatarImg = res.data.roomInfo.headpic;
                }
            })
        },
        getNewsTopList() {
            this.listLoading = true;
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
            let topType;
            switch (this.auth.topType) {
                case '新闻':
                    topType = 1
                    break;
                case '视频':
                    topType = 2
                    break;
            }
            let para = {
                sttime: this.form.startTime==''?'':parseTime(this.form.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                endtime: this.form.endTime==''?'':parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                apptype: this.form.app,
                index: this.form.idx,
                pagenum: this.form.pagenum,
                showpagenum: '1',
                showpagesize: '20',
                channel: topType,
                id: '',
                appfrom: this.form.appfrom
            }
            newsTopList(para).then((res) => {
                if (res.code === '00001') {
                    for (var i = 0; i < res.data.list.length; i++) {
                        var arr = res.data.list[i].provid.split(',');
                        arr.remove('checkall');
                        arr.remove('notall');
                        res.data.list[i].provid = arr.join(',');
                    }
                    this.newsData = res.data.list;
                }
                this.listLoading = false;
            });
        },
        handleSave() { //置顶保存
            this.$refs.topForm.validate((valid) => {
                let providPrefix = 'notall,';
                if (this.newsAreasList.length === this.form.provid.split(',').length) {
                    providPrefix = 'checkall,';
                }
                var issuperStr = '';
                if (valid) {
                    if (this.superShow) {
                        issuperStr = this.form.issuper;
                    } else {
                        issuperStr = '0';
                    }
                    let topType;
                    switch (this.auth.topType) {
                        case '新闻':
                            topType = 1
                            break;
                        case '视频':
                            topType = 2
                            break;
                    }
                    let para = {
                        channel: topType,
                        content: this.showform.rowkey,
                        title: this.showform.roomName,
                        newstype: this.form.newstype,
                        idx: this.form.idx,
                        pagenum: this.form.pagenum,
                        startTime: this.form.startTime==''?'':parseTime(this.form.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                        endTime: this.form.endTime==''?'':parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                        sourcetype: this.form.sourcetype,
                        isoneself: this.form.isoneself,
                        apptypeid: this.form.app,
                        provid: providPrefix + this.form.provid,
                        appfrom: this.form.appfrom,
                        issuper: issuperStr,
                        islocal: '',
                        source: '',
                        imgs: '',
                        bigPic: 0
                    }
                    if (this.isblacklist == 1) {
                        para.blacklist = this.form.dynamicTags.join(',');
                    }
                    if (para.content == '' || para.endTime == '' || para.startTime == '' || para.title == '' || para.appfrom == '' || para.apptypeid == '' || para.issuper == '' || para.isoneself == '' || para.newstype == '' || para.provid ==
                        '' || para.sourcetype == '' || para.pagenum == '' || para.idx == '') {
                        this.$alert('有数据为空，请完善数据', '提示', {
                            confirmButtonText: '确定'
                        });
                        return;
                    }
                    this.listLoading = true;
                    checkStickIsConflict(para).then((res) => {
                        if (res.code === '00001') {
                            newsTopSave(para).then((res) => {
                                if (res.code === '00001') {
                                    this.listLoading = false;
                                    // this.form.startTime = '';
                                    // this.form.endTime = '';
                                    this.$notify({
                                        title: '成功',
                                        message: '保存置顶成功',
                                        type: 'success'
                                    });
                                    //this.$refs.topForm.resetFields();
                                    // this.form.searchID = '';
                                    // this.form.appfrom = 'dftv';
                                    this.showform = {
                                        anchorName: '',
                                        anchorID: '',
                                        roomStatus: '',
                                        roomName: '',
                                        roomID: '',
                                        rowkey: '',
                                        userNumber: '',
                                        coverImg: '',
                                        avatarImg: ''
                                    }
                                }
                            });
                        } else if (res.code === '00100') {
                            this.$alert('该位置已经存在强制置顶记录', '提示', {
                                confirmButtonText: '确定'
                            });
                            return;
                        } else if (res.code === '00101') {
                            this.$confirm('该位置已经存在独占置顶记录,是否继续？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                newsTopSave(para).then((res) => {
                                    if (res.code === '00001') {
                                        this.listLoading = false;
                                        this.$notify({
                                            title: '成功',
                                            message: '保存置顶成功',
                                            type: 'success'
                                        });
                                        //this.$refs.topForm.resetFields();
                                        // this.form.searchID = '';
                                        // this.form.appfrom = 'dftv';
                                        this.showform = {
                                            anchorName: '',
                                            anchorID: '',
                                            roomStatus: '',
                                            roomName: '',
                                            roomID: '',
                                            rowkey: '',
                                            userNumber: '',
                                            coverImg: '',
                                            avatarImg: ''
                                        }
                                    }
                                })
                            })
                        }

                    });
                }
            });
        },
        changePlatform() {
            this.queryPlatDetail();
        },
        newsAreas() {
            newsAreas('').then((res) => {
                this.newsAreasList = res.data;
                this.provid = this.newsAreasList;
                this.form.provid = this.newsAreasList.join(',');
            });
        },
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
                }
            });
        },
        queryPlatDetail() {
            Array.prototype.contains = function(needle) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == needle) return true;
                }
                return false;
            }
            let para = 'area=' + this.form.appfrom;
            queryPlatDetail(para).then((res) => {
                if (res.code == '00001') {
                    this.form.appfrom = res.data.appfrom;
                    this.form.sourcetype = res.data.sourcetype;
                    var issuper = res.data.issuper.split(',');
                    if (issuper.contains(1)) {
                        this.superShow = true;
                    }
                    this.newsAppListChose = res.data.apptypeid.split(',');
                    this.newsAreas();
                    this.newsType();
                    this.getNewsTopList()
                }
            });
        },
        handleCloseType(done) {
            this.form.newstype = this.newstype.join(',');
            this.typeVisible = false;
        },
        handleCloseApp(done) {
            this.form.app = this.app.join(',');
            this.appVisible = false;
        },
        handleClosePro(done) {
            this.form.provid = this.provid.join(',');
            this.providVisible = false;
        },
        //修改置顶类型
        changeRecommendType(val) {
            this.$refs.topForm.resetFields();
            //this.$refs.bottomForm.resetFields();
            this.form.url = '';
            this.form.newstypeStr = '';
            this.newstype = [];
            if (this.auth.topType === '视频') {
                this.vRecommendToVideoType({
                    area: this.form.appFullName
                });
                this.topUrl = newsTopSave;
                this.checkUrl = checkStickIsConflict;
                this.isRecommendNews = false;
            } else {
                if (this.form.appFullName == 'toutiao') {
                    this.vRecommendToNewsType();
                } else {
                    this.newsType({
                        area: this.form.appFullName
                    })
                }
                //this.topUrl = vRecommendToNews;
                //this.checkUrl = videoRecommendInsertCheck;
                this.isRecommendNews = true;
            }
            this.form.liveRoom = this.selectOptions.liveRoom[0].value,
                this.form.isoneself = this.selectOptions.dzOptions[0].value,
                this.form.appfrom = 'dftv'
            this.getNewsTopList();
            // if(val == 'video' || val == 'news'){
            //this.assignment(this.displayDataList)
            // }
        },
        vRecommendToVideoType(param) {
            function compare(property) {
                return function(a, b) {
                    var value1 = a[property] == null ? 0 : 1;
                    var value2 = b[property] == null ? 0 : 1;
                    return value2 - value1;
                }
            }
            vRecommendToVideoType(param).then((res) => {
                this.newsTypeList = res.data;
                for (var i = 0; i < this.newsTypeList.length; i++) {
                    this.newsTypeList[i].indeterminate = false;
                    this.newsTypeList[i].checkedCities = [];
                    this.newsTypeList[i].checkAll = false;
                }
                this.newsTypeList.sort(compare('children'));
            });
        },
        vRecommendToNewsType() {
            function compare(property) {
                return function(a, b) {
                    var value1 = a[property] == null ? 0 : 1;
                    var value2 = b[property] == null ? 0 : 1;
                    return value2 - value1;
                }
            }
            vRecommendToNewsType().then(res => {
                this.newsTypeList = res.data;
                for (var i = 0; i < this.newsTypeList.length; i++) {
                    this.newsTypeList[i].indeterminate = false;
                    this.newsTypeList[i].checkedCities = [];
                    this.newsTypeList[i].checkAll = false;
                }
                this.newsTypeList.sort(compare('children'));
            });
        },
        dialogHandleClose(index) {
            if (index == 0) {
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
            } else if (index == 1) {
                this.form.app = this.app.join(',');
                this.appVisible = false;
            } else if (index == 2) {
                this.form.provid = this.provid.join(',');
                this.providVisible = false;
            }
        },
        dialogHandleOpen(index) {
            if (index == 0) {
                this.typeVisible = true;
            } else if (index == 1) {
                this.appVisible = true;
            } else if (index == 2) {
                this.providVisible = true;
            }
        }
    },
    watch: {
        $route() {}
    }
}
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
    content: '';
    display: table;
}

.clearfix:after {
    clear: both;
}

.pull-right {
    float: right;
    margin-right: 20px;
}

.el-form-item {
    margin-bottom: 5px;
}

.box_div {
    width: 100%;
    padding: 10px 10px;
    border: 1px solid #bbbbbb;
    box-sizing: border-box;
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

.box_img {
    height: 700px;
}

.box_img img {
    width: auto;
}

.news_title {
    text-align: center;
    font-size: 20px;
}

.imgShow {
    width: 150px;
    height: 150px;
}

.imgShow img {
    /*border: 1px solid #ddd;*/
    background-color: #EEF1F6;
}
</style>
