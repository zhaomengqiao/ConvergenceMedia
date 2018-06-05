<template>
<div>
    <el-form label-position="left" :inline="true" :model="form" ref="refForm">
        <el-col :span="24" class="el-form-wrap">
            <el-form-item label="文章类型">
                <el-select v-model="form.classify" style='width: 150px;'>
                    <el-option label="全部" value="-1"></el-option>
                    <el-option label="新闻" value="0"></el-option>
                    <el-option label="图集" value="1"></el-option>
                    <el-option label="视频" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="form.mtp" placeholder="选择分类" class="select-platform">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in qualityClassify" :key="item.typeId" :label="item.typeName" :value="item.typeName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题:">
                <el-input v-model="form.title" placeholder="输入标题" style='width: 200px;'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryMgNewsList" icon="search">搜索</el-button>
            </el-form-item>
            <el-form-item style="float: right;">
                <el-radio-group v-model="form.read" @change="queryMgNewsList">
                    <el-radio-button label="0" value="0">未阅</el-radio-button>
                    <el-radio-button label="1" value="1">已阅</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-col>
    </el-form>
    <el-table v-loading="listLoading" ref="singleTable" class='tableList' :data="tableData" stripe border highlight-current-row width="100%">
        <el-table-column prop="newsdate" label="日期" width="190">
        </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip>
            <template slot-scope="scope">
					 <div  @click="handleDialog(scope.$index, scope.row)" style="cursor: pointer;" >{{tableData[scope.$index].title}}</div>
				</template>
        </el-table-column>
        <el-table-column prop="sensitivekey" label="敏感词" width="150"></el-table-column>
        <el-table-column prop="src" label="来源" width="180"></el-table-column>
        <el-table-column prop="classify" label="类型" width="80">
            <template slot-scope="scope">
						<div v-if='tableData[scope.$index].classify==0'>新闻</div>
						<div v-if='tableData[scope.$index].classify==1'>图集</div>
						<div v-if='tableData[scope.$index].classify==2'>视频</div>
				</template>
        </el-table-column>
        <el-table-column prop="mtp" label="分类" width="80"></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
            <template slot-scope="scope">
                	<el-button @click.native.prevent="handleToManage(1, scope.row)" type="primary" v-if='btnAuth(scope.row)&&(~~scope.row.isban==0)' size="small">编辑</el-button>
                    <el-button @click.native.prevent="handleToManage(2,scope.row)" type="success" v-if='btnManageAuth(scope.row)&&(~~scope.row.isban==0)' size="small">管理</el-button>
                    <el-button @click.native.prevent="handleToManage(3, scope.row)" type="primary" v-if='(tableData[scope.$index].read==0)&&(~~scope.row.isban==0)' size="small">已阅</el-button>
					<el-button type="primary" size="small" @click="openNew(scope.row)">打开URL</el-button>
                </template>
        </el-table-column>
    </el-table>
    <el-pagination @current-change="handlePageChange" layout="total, sizes, prev, pager, next, jumper" :page-size="form.pagesize" @size-change="handleSizeChange" :current-page="form.startpage" :page-sizes="[10, 15, 30, 50,100]" style="float:right;" :total="total">
    </el-pagination>

    <el-dialog title="新闻详情" v-model="urlVisible" :close-on-click-modal="false" top="5%">
        <div v-html="contentPreview" class="title-content-box" v-if="thisClassify==0">

        </div>
        <div>
            <iframe :src="contentPreview" style="border: 0;" width="100%" height="700px" v-if="thisClassify!=0"></iframe>
        </div>
    </el-dialog>

</div>
</template>
<script>
import {
    mapGetters
} from 'vuex';
import { contentToHtml } from '@/utils/contentTransform'
import {
    yangDetail,
    yangSensitiveWords,
    queryYzMgNews,
    getHqualityClass,
    updateNewsRead
} from '@/api/contentManage';
export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            thisClassify: "",
            listLoading: false,
            urlVisible: false,
            dialogTitle: '',
            total: 0,
            newsType: 'wnwifinewsaudit',
            qualityClassify: [],
            form: {
                startdate: '',
                enddate: '',
                title: '',
                read: '0',
                sensitivekey: '',
                url: '',
                classify: '-1',
                mtp: '',
                startpage: 1,
                pagesize: 10
            },
            isAuth: {
                NewsMgEdit: false,
                ImgsMgEdit: false,
                VideosMgEdit: false,
                NewsMgManager: false,
                ImgsMgManager: false,
                VideosMgManager: false
            },
            contentPreview: '',
            dateTimer: '',
            newExam: [],
            livePlatform: [],
            tableData: [],
            redKeyWords: []
        }
    },
    mounted() {
        this.getAuth();
        this.getHqualityClass();
        this.yangSensitiveWords();
        this.form.pagesize = this.personalConfig.tableRowShow
    },
    methods: {
        // 获取敏感词
        yangSensitiveWords() {
            yangSensitiveWords().then(res => {
                if (res.code == "00001") {
                    this.redKeyWords = res.data;
                }
            })
        },
        getAuth() { //权限控制
            let authorList = localStorage.getItem('authorList');
            if (authorList.indexOf('sendnews-platform-YANGZI') != -1) {
                this.isAuth.NewsMgEdit = true
            }
            if (authorList.indexOf('sendpicture-platform-YANGZI') != -1) {
                this.isAuth.ImgsMgEdit = true
            }
            if (authorList.indexOf('sendvideo-platform-YANGZI') != -1) {
                this.isAuth.VideosMgEdit = true
            }
            if (authorList.indexOf('content/black/yangzi/article') != -1) {
                this.isAuth.NewsMgManager = true
            }
            if (authorList.indexOf('content/black/yangzi/picture') != -1) {
                this.isAuth.ImgsMgManager = true
            }
            if (authorList.indexOf('content/black/yangzi/video') != -1) {
                this.isAuth.VideosMgManager = true
            }
        },
        btnAuth(row) {
            switch (Number(row.classify)) {
                case 0:
                    return this.isAuth.NewsMgEdit
                    break;
                case 1:
                    return this.isAuth.ImgsMgEdit
                    break;
                case 2:
                    return this.isAuth.VideosMgEdit
                    break;
            }
        },
        btnManageAuth(row) {
            switch (Number(row.classify)) {
                case 0:
                    return this.isAuth.NewsMgManager
                    break;
                case 1:
                    return this.isAuth.ImgsMgManager
                    break;
                case 2:
                    return this.isAuth.VideosMgManager
                    break;
            }
        },
        // 新闻主分类
        getHqualityClass() {
            getHqualityClass().then(res => {
                if (res.code == "00001") {
                    this.qualityClassify = res.data;
                    this.queryMgNewsList();
                }
            });
        },
        openNew(row) {
            window.open(row.url);
        },
        handleToManage(type, row) {
            if (type == '1') {
                this.$router.push({
                    path: '/contentEdit',
                    query: {
                        rowkey: row.url,
                        platfrom: 'yangzi',
                        type: 'newsEdit'
                    }
                });
            } else if (type == '2') {
                this.$router.push({
                    path: '/content/black',
                    query: {
                        rowkey: row.url,
                        platfrom: 'yangzi',
                        type: 'yzMgNewList'
                    }
                });
            } else if (type == '3') {
                this.listLoading = true
                updateNewsRead({
                    idx: row.idx,
                    read: 1
                }).then((res) => {
                    if (res.code == '00001') {
                        this.queryMgNewsList();
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                    }
                    this.listLoading = false
                });
            }
        },
        handleDialog(index, row) {
            if (row.yzwbisban == 1) {
                return false
            }
            this.urlVisible = true;
            this.thisClassify = row.classify
            if (row.classify != 0) {
                this.contentPreview = row.url
            } else {
                let params = {
                    "url": row.url
                }
                yangDetail(params).then(res => {
                    if (res.code == "00001") {
                        if (res.data.content !== null) {
                            this.contentPreview = contentToHtml(res.data, this.redKeyWords);
                        }
                    }
                })
            }
        },
        queryMgNewsList() {
            this.listLoading = true;
            queryYzMgNews(this.form).then((res) => {
                if (res.code === '00001') {
                    this.tableData = res.data.dataPageData;
                    // 测试数据
                    // this.tableData = [{
                    //     classify: "0",
                    //     idx: "103735",
                    //     insertdate: "2017-11-06 14:46:29.0",
                    //     isblk: "0",
                    //     mtp: "娱乐",
                    //     newsdate: "2017-11-06 14:45:58.0",
                    //     rowkey: "8678570599051",
                    //     sensitivekey: "985",
                    //     src: "国际在线",
                    //     title: "这六位明星脱发秃头 陈伟霆不影响五官吴亦凡不如光头",
                    //     url: "http://m.yzwb.net/a/171106144558768.html",
                    //     urlid: "171106144558768"
                    // }]
                    this.total = res.data.dataCount;
                } else {
                    this.tableData = [];
                    this.total = 0;
                }
                this.listLoading = false;
            })
        },
        handlePageChange(val) {
            this.form.startpage = val;
            this.queryMgNewsList();
        },
        handleSizeChange(val) {
            this.form.pagesize = val;
            this.queryMgNewsList();
        },
    }
}
</script>
<style media="screen">
.el-form-wrap .el-form-item {
    margin-right: 30px;
}

.tableList .cell .el-button--default {
    border: 0px solid #c4c4c4;
    background: rgba(255, 255, 255, 0);
}

.title-content-box {
    height: 700px;
    overflow: auto;
    font-size: 16px;
}

.title-content-box img {
    display: block;
    margin: 0 auto;
}
</style>
