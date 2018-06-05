<template lang="html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="formData">
                <el-form-item label="操作平台">
                    <!--榜单暂时只有扬子-->
                    <el-select v-model="formData.platform" class="select-platform"
                        filterable placeholder="选择分类" @change="searchList">
                        <el-option
                            v-for="(item,index) in platformOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主分类：">
                    <el-select v-model="formData.classify" placeholder="选择分类" class="select-platform">
                        <el-option
                          v-for="item in qualityClassify"
                          :key="item.typeId"
                          :label="item.typeName"
                          :value="item.typePy">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道来源：" v-if="formData.platform=='toutiao'">
                    <el-select v-model="formData.channel" placeholder="渠道来源" class="select-platform">
                        <el-option
                          v-for="item in channelOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input type="primary" v-model="formData.text" placeholder="请输入关键字查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchList">查询</el-button>
                </el-form-item>
                <el-radio-group class="pull-right" v-model="listDate" @change="changeListDate">
                    <el-radio-button label="today">今日榜</el-radio-button>
                    <el-radio-button label="sevenDays">7日榜</el-radio-button>
                </el-radio-group>
            </el-form>
        </el-col>
        <!--扬子列表-->
        <el-table :data="tableData"
                  highlight-current-row
                  :key="1"
                  v-if="formData.platform=='yangzi'"
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border>
            <el-table-column prop="title" label="标题">
                <template slot-scope="scope">
            		<el-popover
						  ref="popover1"
						  placement="right"
						  title="封面"
						  width="250"
						  height="150"
						  trigger="hover"
						  >
						  <img :src="JSON.parse(scope.row.minibjs)[0].src" width="100%" height="100%" />
						</el-popover>
                    <span v-popover:popover1 style="white-space:nowrap" @click="showReplyForm(scope.row)" :class="scope.row.yzwbisban==1?'disable_title':''" class="dialog-span">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="psrc" label="来源" width="200" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="pushtpid" label="分类" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.pushtpid }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="yzwbblk" label="状态" width="100">
                <template slot-scope="scope">
                    <span>{{ nowStatus(scope.row) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="阅读状态" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.isread==0?'未阅':'已阅' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="阅读人" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.username }}
                </template>
            </el-table-column>
            <el-table-column prop="cts" label="发布时间" width="200">
                <template slot-scope="scope">
                    <span>{{ parseInt(scope.row.cts) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="280" fixed="right">
                <!--图集无置顶功能-->
                <template slot-scope="scope">
                    <el-button type="primary" size="small"
                               @click="modify(scope.row)"
                               v-if="btnAuth('edit',scope.row)&&auth.edit">编辑</el-button>
                    <el-button type="success" size="small"
                               @click="manage(scope.row)"
                               v-if="btnAuth('manage',scope.row)&&auth.manage">管理</el-button>
                   <el-button type="primary" size="small"
                             @click="yangAlreadyRead(scope.row)"
                             v-if="btnAuth('read',scope.row)">已阅</el-button>
                    <el-button v-if="scope.row.yzwbisban!=1" type="primary" size="small" @click="openNew(scope.row)">打开URL</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--东方头条-->
        <el-table :data="tableData"
                  :key="2"
                  v-if="formData.platform=='toutiao'"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border>
            <el-table-column prop="title" label="标题">
                <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" width="200" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="pushtpid" label="分类" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.maintype }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="阅读状态" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.isread==0?'未阅':'已阅' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="阅读人" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.isread==1?scope.row.readuser:'' }}
                </template>
            </el-table-column>
            <el-table-column prop="cts" label="发布时间" width="200">
                <template slot-scope="scope">
                    <span>{{ parseInt(scope.row.dateline) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="340" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="small"
                               @click="modify(scope.row)"
                               v-if="auth.edit">编辑</el-button>
                    <el-button type="success" size="small"
                               @click="manage(scope.row)"
                               v-if="auth.manage">管理</el-button>
                    <el-button type="warning" size="small"
                               @click="toTop(scope.row)"
                               v-if="auth.toTop">置顶</el-button>
                    <el-button type="primary" size="small" @click="openNew(scope.row)">打开URL</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="block">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total,sizes, prev, pager, next,jumper"
              :page-sizes='[10,15,20,50,100]'
              :current-page="limit.page"
              :page-size="limit.pageSize"
              :total="total"
              style="float:right;"
              >
            </el-pagination>
        </div>
        <!--点击标题触发-->
        <el-dialog title="页面预览" v-model="replyFormVisible" top="5%" size="small" :close-on-click-modal="false">
			  <div >
			  	<iframe :src="contentPreview" style="border: 0;" width="100%" height="700px"></iframe>
			  </div>
		</el-dialog>
    </section>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import { contentToHtml } from '@/utils/contentTransform'
import {
    getOperPlatform
} from '@/api/commonApi'
import {
    parseTime,
} from '@/utils'
import {
    getToutiaoTopList,
    yangList,
    getHqualityClass,
    hQualityKeywordsList,
    yangAlreadyRead
} from '@/api/contentManage'

export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        var today = parseTime(new Date(), '{y}{m}{d}')

        return {
            activeName: '1',
            nowApi: 'yzwbpicturemanager',
            // 标题dialog
            contentPreview: '',
            // 表单
            formData: {
                platform: '',
                type: 'picture',
                startTime: '',
                endTime: '',
                text: '',
                dateRange: today,
                words: '',
                comments: '',
                id: '',
                status: '',
                classify: '',
                channel: 'h5'
            },
            // 榜单日
            listDate: 'today',
            //DIALOG
            replyFormVisible: false,
            keywordDisable: false,
            saveEditBtn: false,
            qualityClassify: [],
            platformOptions: [

            ],
            channelOptions: [{
                    label: 'H5',
                    value: 'h5'
                },
                {
                    label: 'PC',
                    value: 'pc'
                },
                {
                    label: 'APP',
                    value: 'app'
                }
            ],
            addStatus: true,
            // 表格
            listLoading: false,
            tableData: [],
            total: 0,
            limit: {
                page: 1,
                pageSize: 10
            },
            auth: {
                manage: false,
                toTop: false,
                edit: false
            }
        }
    },
    mounted() {
        this.limit.pageSize = this.personalConfig.tableRowShow
        this.getAuth();
        this.getHqualityClass();
    },
    methods: {
        // 按钮权限
        btnAuth(btnType, row) {
            var isban, isblack;
            isban = row.yzwbisban;
            isblack = row.yzwbblk;
            // 按钮权限
            switch (btnType) {
                case 'edit': // 编辑按钮：404不显示
                    if (~~isban == 0) {
                        return true
                    }
                    break;
                case 'manage': // 管理按钮：404不显示
                    if (~~isban == 0) {
                        return true
                    }
                    break;
                case 'toTop': // 置顶按钮：404/加黑/不显示
                    if (~~isban == 0 && ~~isblack == 0) {
                        return true
                    }
                    break;
                case 'open': // 置顶按钮：404不显示
                    if (~~isban == 0) {
                        return true
                    }
                    break;
                case 'read': // 置顶按钮：404/已读不显示
                    if (~~isban == 0 && row.isread == 0) {
                        return true
                    }
                    break;
                default:
                    return false
            }
        },
        // 权限控制
        getAuth() {
            var user = localStorage.getItem('user')
            user = JSON.parse(user)
            let params = {
                userName: user.username,
                url: 'hotlistpictures'
            }
            getOperPlatform(params).then(res => {
                if (res.code === '00001') {
                    this.platformOptions = res.data
                    this.formData.platform = res.data[0].value
                }
            })
            const authList = localStorage.getItem('authorList');
            if (authList.indexOf('content/black/yangzi/picture') != -1) {
                this.auth.manage = true
            }
            if (authList.indexOf('sendpicture-platform-YANGZI') != -1) {
                this.auth.edit = true
            }
        },
        // 新闻主分类
        getHqualityClass() {
            getHqualityClass().then(res => {
                if (res.code == "00001") {
                    this.qualityClassify = res.data;
                    this.qualityClassify.unshift({
                        'typeName': '全部',
                        'typePy': ''
                    })
                    this.formData.classify = res.data[0].typePy;
                    this.getList();
                }
            });
        },
        // 搜索
        searchList() {
            this.limit.page = 1;
            this.getList();
        },
        // 获取表格数据（数据为空需提示）
        getList() {
            //扬子头条/东方头条接口不同
            if (this.formData.platform == 'yangzi') {
                // 拼接connector
                var connector1, connector2, connector;
                // 根据今日榜/七天榜区分
                switch (this.listDate) {
                    case "today":
                        connector1 = 'toDay'
                        break;
                    case "sevenDays":
                        connector1 = 'sevenDay'
                        break;
                }
                // 根据类型（news/imgs/videos）区分
                switch (this.formData.type) {
                    case "news":
                        connector2 = "News"
                        this.nowApi = "yzwbmanager"
                        break;
                    case "picture":
                        connector2 = "Picture"
                        this.nowApi = "yzwbpicturemanager"
                        break;
                    case "video":
                        connector2 = "Video"
                        this.nowApi = "yzwbvideomanager"
                        break;
                }
                connector = connector1 + connector2 + "Category";
                let param = {
                    connector: connector,
                    time: this.formData.dateRange,
                    leixing: this.formData.classify,
                    start: this.limit.pageSize * (this.limit.page - 1),
                    columnBatch: this.limit.pageSize,
                    url: this.formData.text
                }
                this.listLoading = true;
                yangList(param).then((res) => {
                    if (res.code == "00001") {
                        var data = res.data;
                        this.tableData = data.list;
                        this.total = Number(data.size);
                    } else if (res.code == "00005") {
                        this.tableData = [];
                        this.total = 0;
                    }
                    this.listLoading = false
                })
            } else if (this.formData.platform == 'toutiao') {
                let days
                // 根据今日榜/七天榜区分
                switch (this.listDate) {
                    case "today":
                        days = '0'
                        break;
                    case "sevenDays":
                        days = '1'
                        break;
                }
                let params = {
                    maintype: this.formData.classify,
                    newstype: this.formData.type,
                    channel: this.formData.channel,
                    days: days,
                    isread: 0,
                    platform: this.formData.platform,
                    page: this.limit.page,
                    pagesize: this.limit.pageSize
                }
                getToutiaoTopList(params).then(res => {
                    if (res.code == "00001") {
                        var data = res.data;
                        if (data) {
                            this.tableData = data.data;
                            this.total = Number(data.count);
                        } else {
                            this.tableData = [];
                            this.total = 0;
                        }
                    }
                    this.listLoading = false
                })
            }
        },
        //管理
        manage(data) {
            this.$router.push({
                path: '/operationTools/contentManageTools/contentManage',
                query: {
                    url: data.url,
                    type: 'picUtil'
                }
            });
        },
        //分页操作
        handleSizeChange(val) {
            this.limit.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.limit.page = val;
            this.getList();
        },
        // 判断文本是否为空
        textIsNull() {
            if (this.formData.words == '') {
                this.addStatus = true
            } else {
                this.addStatus = false
            }
        },
        //修改
        editComment(id, type, comments, words) {
            this.saveEditBtn = true;
            this.formData.words = words
            this.keywordDisable = true;
            this.formData.id = id;
            this.formData.status = type;
            this.formData.comments = comments
        },
        // 保存修改
        saveEdit() {
            let param = {
                id: this.formData.id,
                status: this.formData.status,
                comments: this.formData.comments
            }
            yzLexiconEdit(param).then((res) => {
                if (res.code == "00001") {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.keywordDisable = false;
                    this.saveEditBtn = false;
                    this.formData.words = '';
                    this.formData.comments = '';
                    this.getList()
                }
            })
        },
        // 编辑
        modify(data) {
            this.$router.push({
                path: '/contentManage/editContent/editPictures',
                query: {
                    rowkey: data.url,
                    platform: this.formData.platform
                }
            })
        },
        // 切换今日榜/7日榜
        changeListDate() {
            this.searchList();
        },
        // 点击标题dialog
        showReplyForm(row) {
            if (row.yzwbisban == 1) {
                return false
            }
            this.replyFormVisible = true;
            this.contentPreview = row.url
        },
        // 状态判断
        nowStatus(row) {
            if (row.yzwbisban == 1) {
                return "404"
            } else if (row.yzwbblk == 1 && row.yzwbisban == 0) {
                return "加黑"
            } else {
                return "正常"
            }
        },
        // 已阅
        yangAlreadyRead(row) {
            var params = {
                url: row.url,
                urlres: row.urlres,
                rowkey: row.rowkey,
                title: row.title,
                pushtpid: row.pushtpid,
                psrc: row.psrc
            }
            this.listLoading = true
            yangAlreadyRead(params).then(res => {
                if (res.code == "00001") {
                    this.getList();
                }
            })
        },
        // 打开按钮
        openNew(row) {
            window.open(row.url)
        }
    }
}
</script>

<style lang="css">
</style>
