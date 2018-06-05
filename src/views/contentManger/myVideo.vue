<template lang="html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="formData">
                <el-form-item label="操作平台">
                    <el-select v-model="formData.platform" class="select-platform"
                        filterable placeholder="选择平台" @change="searchList">
                        <el-option
                            v-for="(item,index) in platformOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间：">
                    <el-date-picker
                      v-model="dateRange"
                      @change="dateRangeChange"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      align="right"
                      placeholder="选择日期范围"
                      :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input type="primary" v-model.trim="formData.newsname" placeholder="请输入关键字查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="primary"
                              v-model.trim="formData.username"
                              placeholder="请输入添加人账号"
                              v-if="auth.isAll"
                              clearable></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-checkbox v-model="formData.isAll" v-if="auth.isAll">查询全部</el-checkbox>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="searchList">查询</el-button>
                </el-form-item>
                <el-radio-group class="pull-right" v-model="labelData" @change="changeLabelData">
                    <el-radio-button label="create">发布</el-radio-button>
                    <!-- <el-radio-button label="edit">编辑</el-radio-button> -->
                </el-radio-group>
            </el-form>
        </el-col>
        <!--列表-->
        <!--发布列表Begin-->
        <el-table :data="tableData"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border
                  v-if="labelData=='create'||!formData.isAll">
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <el-popover
						  ref="popover1"
						  placement="right"
						  title="封面"
						  width="250"
						  height="150"
						  trigger="hover"
						  >
                          <span v-if="scope.row.minibjsbeans!=null&&scope.row.minibjsbeans!=''">暂无封面</span>
						  <img :src="item.src" width="100%" height="100%" v-for="item in JSON.parse(scope.row.minijs)" v-if="JSON.parse(scope.row.minibjs)!=null&&JSON.parse(scope.row.minibjs)!=''"/>
						</el-popover>
                    <!--404状态标题增加disable_title class-->
                    <el-button v-popover:popover1
                          @click="showReplyForm(scope.row)"
                          class="dialog-span title-button"
                          :class="(scope.row.isban==1&&formData.platform!='yangzi')||(scope.row.yzwbisban==1&&formData.platform=='yangzi')?'disable_title':''">{{ scope.row.contenttitle }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="urlmaintype" label="作者" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.cmsadduser }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cts" label="发布时间" width="170">
                <template slot-scope="scope">
                    <span>{{ parseInt(scope.row.crawlerts) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="yzwbblk" label="状态" width="80">
                <template slot-scope="scope">
                    <span>{{ nowStatus(scope.row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="平台" width="100">
                <template slot-scope="scope">
                    <span>{{ formData.platformLabel }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="280" fixed="right">
                <!--视频没有编辑-->
                <template slot-scope="scope">
                    <!-- <el-button type="primary" size="small"
                               @click="modify(scope.row)"
                               v-if="btnAuth('edit',scope.row)&&auth.edit">编辑</el-button> -->
                    <el-button type="success" size="small"
                               @click="manage(scope.row)"
                               v-if="btnAuth('manage',scope.row)&&auth.manage">管理</el-button>
                    <el-button type="warning" size="small"
                               @click="toTop(scope.row)"
                               v-if="btnAuth('toTop',scope.row)&&auth.toTop">置顶</el-button>
                    <el-button type="primary" size="small" @click="openNew(scope.row)" v-if="(scope.row.isban!=1&&formData.platform!='yangzi')||(scope.row.yzwbisban!=1&&formData.platform=='yangzi')" >打开URL</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--发布列表End-->
        <!--编辑列表Begin-->
        <el-table :data="tableData"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border
                  v-if="labelData=='edit'&&formData.isAll">
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <!--404状态标题增加disable_title class-->
                    <span @click="showReplyForm(scope.row)"
                          class="dialog-span"
                          :class="(scope.row.isban==1&&this.formData.platform!='yangzi')||(scope.row.yzwbisban==1&&this.formData.platform=='yangzi')?'disable_title':''">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="作者" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.username }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cts" label="发布时间" width="170">
                <template slot-scope="scope">
                    <span>{{ format(parseInt(scope.row.dateline), 'yyyy-MM-dd HH:mm:ss') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
                <template slot-scope="scope">
                    <span>{{ nowStatus(scope.row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="平台" width="100">
                <template slot-scope="scope">
                    <span>{{ formData.platformLabel }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="280" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="openNew(scope.row)">打开URL</el-button>
                    <!-- <el-button type="primary" size="small"
                               @click="modify(scope.row)">编辑</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!--编辑列表End-->
        <!--分页-->
        <div class="own-pagination">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total,sizes, prev, pager, next,jumper"
              :page-sizes='[10,15,20,50,100]'
              :current-page="formData.page"
              :page-size="formData.pagesize"
              :total="total"
              class="pull-right"
              >
            </el-pagination>
        </div>
        <!--点击标题触发-->
        <el-dialog title="页面预览" :visible.sync="replyFormVisible" top="5%" :close-on-click-modal="false">
            <div>
                <iframe :src="contentPreview" style="border: 0;" width="100%" height="600px"></iframe>
            </div>
		</el-dialog>
    </section>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    queryContentCreateList,
    queryContentEditList,
} from '@/api/contentManage'
import {
    getOperPlatform
} from '@/api/commonApi'

export default {
    name: 'myVideos',
    data() {
        return {
            activeName: '1',
            nowApi: 'yzwbmanager',
            // 标题dialog
            contentPreview: '',
            // 表单（涵盖获取list所传的所有参数）
            formData: {
                stime: '',
                etime: '',
                platform: '',
                platformLabel: '',
                newstype: '视频',
                newsname: '',
                page: 1,
                pagesize: 10,
                isAll: false,
                username: ''
            },
            dateRange: '',
            // 我的发布/编辑
            labelData: 'create',
            //DIALOG
            replyFormVisible: false,
            keywordDisable: false,
            saveEditBtn: false,
            qualityClassify: [],
            platformOptions: [],
            addStatus: true,
            // 表格
            listLoading: false,
            tableData: [],
            total: 0,
            auth: {
                isAll: true,
                edit: false,
                manage: false,
                toTop: false
            },
            btnControls: ['addblack', 'removeblack', 'add404', 'toTop', 'edit'],
            authPlatformList: {},
            // 时间插件配置
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            }
        }
    },
    mounted() {
        this.getAuth();
        this.getOperPlatform();
        this.formData.pagesize = this.personalConfig.tableRowShow
    },
    methods: {
        // 按钮权限
        btnAuth(btnType, row) {
            var isban, isblack, isupload;
            // 加黑/404(扬子使用扬子字段)
            switch (this.formData.platform) {
                case 'yangzi':
                    isban = row.yzwbisban;
                    isblack = row.yzwbisblack;
                    isupload = row.yzwbisupload
                    break;
                default:
                    isban = row.isban;
                    isblack = row.isblack;
                    isupload = row.isupload
            }
            // 按钮权限
            switch (btnType) {
                case 'edit': // 编辑按钮：404/审核中不显示
                    if (~~isban == 0 && ~~isupload != 0) {
                        return true
                    }
                    break;
                case 'manage': // 管理按钮：404/审核中不显示
                    if (~~isban == 0 && ~~isupload != 0) {
                        return true
                    }
                    break;
                case 'toTop': // 置顶按钮：404/加黑/审核中不显示
                    if (~~isban == 0 && ~~isblack == 0 && ~~isupload != 0) {
                        return true
                    }
                    break;
                default:
                    return false
            }
        },
        // 权限控制
        getAuth() {
            const authList = JSON.parse(localStorage.getItem('authorList'));
            const authListStr = localStorage.getItem('authorList');
            // 权限列表----编辑
            // let editAuthPlatform = [];
            // if(authList.v4blank28){
            //     // 内容管理
            //     let contentManage = authList.v4blank28;
            //     if(contentManage.subItems==null||contentManage.subItems==''){ return false }
            //     contentManage.subItems.forEach(function(manage_item){
            //         if(manage_item.cname == "内容编辑"){
            //             // 内容编辑
            //             if(manage_item.subItems==null||manage_item.subItems==''){ return false }
            //             manage_item.subItems.forEach(function(edit_item){
            //                 // 发新闻
            //                 if(edit_item.subItems==null||edit_item.subItems==''){ return false }
            //                 if(edit_item.cname == "发新闻"){
            //                     edit_item.subItems.forEach(function(send_item){
            //                         if(send_item.cname.split("-")[1]=='平台'){
            //                             editAuthPlatform.push(send_item.cname.split("-")[2]);
            //                         }
            //                     })
            //                 }
            //             })
            //         }
            //     })
            // }
            // this.authPlatformList.edit = editAuthPlatform;
            // 权限列表----置顶
            let toTopAuthPlatform = [];
            if (authList.v4blank29) {
                // 运营工具
                let contentToTop = authList.v4blank29;
                if (contentToTop.subItems == null || contentToTop.subItems == '') {
                    return false
                }
                contentToTop.subItems.forEach(function(manage_item) {
                    if (manage_item.cname == "内容推荐工具") {
                        // 内容推荐工具
                        if (manage_item.subItems == null || manage_item.subItems == '') {
                            return false
                        }
                        manage_item.subItems.forEach(function(edit_item) {
                            // 新闻推荐
                            if (edit_item.subItems == null || edit_item.subItems == '') {
                                return false
                            }
                            if (edit_item.cname == "视频推荐") {
                                edit_item.subItems.forEach(function(send_item) {
                                    if (send_item.cname.split("-")[1] == '平台') {
                                        toTopAuthPlatform.push(send_item.cname.split("-")[2]);
                                    }
                                })
                            }
                        })
                    }
                })
            }
            this.authPlatformList.toTop = toTopAuthPlatform;
            // 权限列表----管理
            let manageAuthPlatform = [];
            if (authList.v4blank29) {
                // 运营工具
                let contentToTop = authList.v4blank29;
                if (contentToTop.subItems == null || contentToTop.subItems == '') {
                    return false
                }
                contentToTop.subItems.forEach(function(manage_item) {
                    if (manage_item.cname == "内容管理工具") {
                        // 内容管理工具
                        if (manage_item.subItems == null || manage_item.subItems == '') {
                            return false
                        }
                        manage_item.subItems.forEach(function(edit_item) {
                            // 内容管理工具
                            if (edit_item.subItems == null || edit_item.subItems == '') {
                                return false
                            }
                            if (edit_item.cname == "内容管理工具") {
                                edit_item.subItems.forEach(function(send_item) {
                                    if (JSON.stringify(send_item.subItems).indexOf("-视频") != -1) {
                                        manageAuthPlatform.push(send_item.cname);
                                    }
                                })
                            }
                        })
                    }
                })
            }
            this.authPlatformList.manage = manageAuthPlatform;
            // 权限列表----查询全部
            if (authListStr.indexOf('api/findmynews/queryall') != -1) {
                this.auth.isAll = true;
            }
        },
        // 根据平台判断是否有权限
        platformHasAuth() {
            var _this = this;

            function hasAuth(arr, authType) {
                arr.forEach(function(item) {
                    if (item == _this.formData.platformLabel) {
                        _this.auth[authType] = true;
                    }
                })
            }
            // 编辑
            //hasAuth(this.authPlatformList.edit,'edit')
            // 置顶
            hasAuth(this.authPlatformList.toTop, 'toTop')
            // 管理
            hasAuth(this.authPlatformList.manage, 'manage')
        },
        // 获取平台
        getOperPlatform() {
            //获取用户名
            var user = localStorage.getItem('user');
            var username = JSON.parse(user).username;
            this.formData.username = username;
            let params = {
                userName: username,
                url: 'send/video'
            }
            this.listLoading = true;
            getOperPlatform(params).then(res => {
                if (res.code == "00001") {
                    // 新版我的内容平台无全部选项
                    this.platformOptions = res.data;
                    // 默认第一个平台
                    this.formData.platform = this.platformOptions[0].value
                    this.getList()
                }
                this.listLoading = false;
            });
        },
        // 搜索
        searchList() {
            this.formData.page = 1;
            this.getList();
        },
        // 获取当前平台label
        getPlatformLabel() {
            var _this = this;
            for (var i = 0; i < _this.platformOptions.length; i++) {
                var item = _this.platformOptions[i];
                if (_this.formData.platform == item.value) {
                    _this.formData.platformLabel = item.label;
                    _this.platformHasAuth()
                }
            }
        },
        // 获取表格数据（数据为空需提示）
        getList() {
            // 我的发布/我的编辑
            this.listLoading = true;
            switch (this.labelData) {
                case "create": //我的发布
                    queryContentCreateList(this.formData).then((res) => {
                        if (res.code === '00001') {
                            // 数据数量为0时，返回没有data
                            if (res.data) {
                                this.tableData = res.data.data;
                                this.total = res.data.count;
                                this.getPlatformLabel(); // 更新表格内平台显示
                            } else {
                                this.tableData = []
                                this.total = 0;
                            }
                        }
                        this.listLoading = false
                    })
                    break;
                case "edit": //我的编辑
                    queryContentEditList(this.formData).then((res) => {
                        if (res.code === '00001') {
                            if (res.data) {
                                this.tableData = res.data.data;
                                this.total = res.data.count;
                                this.getPlatformLabel(); // 更新表格内平台显示
                            } else {
                                this.tableData = []
                                this.total = 0;
                            }
                        }
                        this.listLoading = false
                    })
                    break;
            }
        },
        //管理
        manage(data) {
            this.$router.push({
                path: '/operationTools/contentManageTools/contentManage',
                query: {
                    url: data.url,
                    type: 'videoUtil'
                }
            });
        },
        // 置顶
        toTop(data) {
            this.$router.push({
                path: '/operationTools/contentRecommend/videoRecommend',
                query: {
                    data: {
                        rowkey: data.url,
                        platfrom: this.formData.platform
                    },
                    type: 'videoTop'
                }
            });
        },
        //分页操作
        handleSizeChange(val) {
            this.formData.pagesize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.formData.page = val;
            this.getList();
        },
        // 时间插件
        dateRangeChange: function(val) {
            this.formData.stime = val[0]
            this.formData.etime = val[1]
        },
        // 编辑
        // modify(data) {
        //     this.$router.push({path:'/contentEdit',query:{rowkey:data.url,type:'videoTop',platfrom:this.formData.platform}});
        // },
        // 切换发布/编辑
        changeLabelData() {
            this.searchList();
        },
        // 点击标题dialog
        showReplyForm(row) {
            if ((row.isban == 1 && this.formData.platform != 'yangzi') || (row.yzwbisban == 1 && this.formData.platform == 'yangzi')) {
                return false
            }
            this.replyFormVisible = true;
            this.contentPreview = row.url
        },
        // 状态判断
        nowStatus(row) {
            var isban, isblack, isupload;
            // 加黑/404(扬子使用扬子字段)
            switch (this.formData.platform) {
                case 'yangzi':
                    isban = row.yzwbisban;
                    isblack = row.yzwbisblack;
                    isupload = row.yzwbisupload;
                    break;
                default:
                    isban = row.isban;
                    isblack = row.isblack;
                    isupload = row.isupload;
            }
            if (~~isupload == 0) {
                return "审核中"
            } else if (~~isban == 1) {
                return "404"
            } else if (~~isblack == 1 && ~~isban == 0) {
                return "加黑"
            } else {
                return "正常"
            }
        },
        // 打开按钮
        openNew(row) {
            window.open(row.url)
        }
    },
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    }
}
</script>

<style lang="css">
</style>
