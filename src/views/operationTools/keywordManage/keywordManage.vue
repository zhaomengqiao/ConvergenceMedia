<template>
<section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
            <el-form-item label="关键字：">
                <el-select v-model="filters.platform" style="width: 180px;" @change='getKeyWordList(1)'>
                    <el-option v-for="item in platform" :key="item.value" v-if='item.isAuth' :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
                <el-input v-model.trim="filters.rowkey" placeholder="输入关键字" style="width: 350px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getKeyWordList(1)">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-upload class="upload-demo" :show-file-list='false' :on-success="handleAvatarSuccess" accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' :action="filters.newXurl+'/'+filters.platform">
                    <el-button type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="downloadTemplate">下载模版</el-button>
                <el-button type="primary" @click="exportData">导出数据</el-button>
            </el-form-item>
            <br/>
            <el-form-item v-if="filters.platform != 'username'">
                启动状态:
                <el-select v-model="filters.status" style="width: 100px;">
                    <el-option v-for="item in isblack" v-if='(filters.platform=="audit"&&item.value!="2")||filters.platform!="audit"' :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="filters.platform == 'audit'||filters.platform == 'auditrefusekeywords'">
                屏蔽级别:
                <el-radio-group v-model="filters.level" label="屏蔽级别：">
                    <el-radio :label="1">红色</el-radio>
                    <el-radio :label="2">橙色</el-radio>
                    <el-radio :label="3">黄色</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="filters.platform == 'username'||filters.platform == 'dfhnick'">
                备注信息:
                <el-select v-model="filters.keytype" style="width: 180px;">
                    <el-option v-for="item in remarks" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addAuditKey">新增</el-button>
            </el-form-item>
            <span v-if="filters.platform == 'username'">
					<el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
						      	<div slot="content">昵称关键词库为东方头条、东方号等平台账号注册时昵称判断使用。<br/>
						      		1、目前线上业务使用该表:words(敏感词)是全模糊匹配，即words=a时, abc和bac和	bca均会匹配到。示例：录入敏感词“习”时，“学习”、“习近平”、“习总书记”等所有带“习”字的都会匹配屏蔽。<br/>
2、敏感词录入支持%, 即words=a%b是, ab和a1b和a22b均会匹配到。示例：录入敏感词“习%平”时，“习平”、“习近平”、“习*&近￥@#平”等都会匹配屏蔽。
						      	</div>
						      	 <el-button style='border: 0px solid #c4c4c4;text-decoration: underline;'>昵称关键词说明</el-button>
					</el-tooltip>
				</span>

        </el-form>
    </el-col>

    <el-table :data="keywordList" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;margin: 0 auto;">
        <el-table-column label="操作用户" width="120">
            <template slot-scope="scope">
					<span v-if='filters.platform=="audit"'>{{keywordList[scope.$index].addUser}}</span>
					<span v-else-if='filters.platform=="username"'>{{keywordList[scope.$index].user_name}}</span>
					<span v-else-if='filters.platform=="nicknamecommentkeywords"||filters.platform=="nickname2345keywords"'>
						{{ (scope.row.modifyUser == null || scope.row.modifyUser == '')?scope.row.createUser:scope.row.modifyUser}}
					</span>
		    		<span v-else>{{keywordList[scope.$index].adduser}}</span>
		    	</template>
        </el-table-column>
        <el-table-column label="新增日期" width="200">
            <template slot-scope="scope">
					<span v-if='filters.platform=="audit"'>{{keywordList[scope.$index].addDate|parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
					<span v-else-if='filters.platform=="nocomment"||filters.platform=="invlid"||filters.platform=="adv"'>{{keywordList[scope.$index].adddate}}</span>
					<span v-else-if='filters.platform=="username"'>{{keywordList[scope.$index].createtime}}</span>
					<span v-else-if='filters.platform=="dfhnick"'>{{keywordList[scope.$index].addtime}}</span>
					<span v-else-if='filters.platform=="nicknamecommentkeywords"||filters.platform=="nickname2345keywords"'>
						{{ scope.row.createTime }}
					</span>
					<span v-else-if='filters.platform=="toutiaopcadblock"||filters.platform=="eastdaypoliticskeywords"||filters.platform=="blocksearchkeywords"||filters.platform=="auditrefusekeywords"||filters.platform=="commentaudittitlekeywords"'>{{keywordList[scope.$index].addtime|parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
		    		<span v-else>{{keywordList[scope.$index].adddate|parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
		    	</template>
        </el-table-column>
        <el-table-column label="关键字">
            <template slot-scope="scope">
					<span v-if='filters.platform=="content"||filters.platform=="invlid"||filters.platform=="adv"'>{{keywordList[scope.$index].key}}</span>
					<span v-else-if='filters.platform=="nocomment"'>{{keywordList[scope.$index].keyword}}</span>
					<span v-else-if='filters.platform=="username"'>{{keywordList[scope.$index].words}}</span>
					<span v-else-if='filters.platform=="comment"'>{{keywordList[scope.$index].usernamekey}}</span>
					<span v-else-if='filters.platform=="audit"'>{{keywordList[scope.$index].rowkey}}</span>
					<span v-else-if='filters.platform=="nicknamecommentkeywords"||filters.platform=="nickname2345keywords"'>
						{{ scope.row.keywords }}
					</span>
					<span v-else-if='filters.platform=="dfhnick"||filters.platform=="toutiaopcadblock"||filters.platform=="eastdaypoliticskeywords"||filters.platform=="blocksearchkeywords"||filters.platform=="auditrefusekeywords"||filters.platform=="commentaudittitlekeywords"'>{{keywordList[scope.$index].keywords}}</span>
		    		<span v-else>{{keywordList[scope.$index].keyWord}}</span>
		    	</template>
        </el-table-column>
        <el-table-column prop="status" label="启用状态" width="130" v-if='filters.platform!="username"&&filters.platform!="dfhnick"&&filters.platform!="toutiaopcadblock"'>
            <template slot-scope="scope">
					<span v-if='filters.platform=="audit"'>
						<div v-if="keywordList[scope.$index].status==0">启用</div>
						<div v-if="keywordList[scope.$index].status==1">停用</div>
					</span>
					<span v-else-if='filters.platform=="nicknamecommentkeywords"||filters.platform=="nickname2345keywords"'>
						<div v-if="keywordList[scope.$index].isBlack==0">启用</div>
						<div v-if="keywordList[scope.$index].isBlack==1">停用</div>
					</span>
					<span v-else>
						<div v-if="keywordList[scope.$index].isblack==0">启用</div>
						<div v-if="keywordList[scope.$index].isblack==1">停用</div>
					</span>

				</template>
        </el-table-column>
        <el-table-column label="屏蔽级别" width="130" v-if='filters.platform=="audit"||filters.platform=="auditrefusekeywords"'>
            <template slot-scope="scope">
					<el-tag type="success" v-if="keywordList[scope.$index].level==3">黄色</el-tag>
					<el-tag type="warning" v-if="keywordList[scope.$index].level==2">橙色</el-tag>
					<el-tag type="danger"  v-if="keywordList[scope.$index].level==1">红色</el-tag>
				</template>
        </el-table-column>
        <el-table-column label="备注信息" width="130" v-if='filters.platform=="username"'>
            <template slot-scope="scope">
					<div v-if="keywordList[scope.$index].keyword_type=='POLITICAL'">政治</div>
					<div v-if="keywordList[scope.$index].keyword_type=='PORN'">色情</div>
					<div v-if="keywordList[scope.$index].keyword_type=='AD'">广告</div>
					<div v-if="keywordList[scope.$index].keyword_type=='WATER'">灌水</div>
					<div v-if="keywordList[scope.$index].keyword_type=='OTHER'">其他</div>
					<div v-if="keywordList[scope.$index].keyword_type=='UNKNOWN'">未知</div>
				</template>
        </el-table-column>
        <el-table-column label="备注信息" width="130" v-if='filters.platform=="dfhnick"'>
            <template slot-scope="scope">
					<div v-if="keywordList[scope.$index].keywordType=='POLITICAL'">政治</div>
					<div v-if="keywordList[scope.$index].keywordType=='PORN'">色情</div>
					<div v-if="keywordList[scope.$index].keywordType=='AD'">广告</div>
					<div v-if="keywordList[scope.$index].keywordType=='WATER'">灌水</div>
					<div v-if="keywordList[scope.$index].keywordType=='OTHER'">其他</div>
					<div v-if="keywordList[scope.$index].keywordType=='UNKNOWN'">未知</div>
				</template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
					<span v-if='filters.platform=="audit"'>
						<el-button size="small" v-if="keywordList[scope.$index].status==0"  @click="handleEdit(scope.$index, scope.row)">停用</el-button>
						<el-button size="small" v-if="keywordList[scope.$index].status==1"  @click="handleEdit(scope.$index, scope.row)">启用</el-button>
					</span>
					<span v-else-if='filters.platform=="username"||filters.platform=="dfhnick"||filters.platform=="toutiaopcadblock"'>
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">删除</el-button>
					</span>
					<span v-else-if='filters.platform=="eastdaypoliticskeywords"||filters.platform=="blocksearchkeywords"||filters.platform=="commentaudittitlekeywords"'>
						<el-button size="small" v-if="scope.row.isblack==0"  @click="handleEdit(scope.$index, scope.row, 'start')">停用</el-button>
						<el-button size="small" v-if="scope.row.isblack==1"  @click="handleEdit(scope.$index, scope.row, 'start')">启用</el-button>
						<el-button size="small" @click="handleEdit(scope.$index, scope.row, 'del')">删除</el-button>
					</span>
					<span v-else-if='filters.platform=="nicknamecommentkeywords"||filters.platform=="nickname2345keywords"'>
						<el-button size="small" v-if="scope.row.isBlack==0"  @click="handleEdit(scope.$index, scope.row, 'start')">停用</el-button>
						<el-button size="small" v-if="scope.row.isBlack==1"  @click="handleEdit(scope.$index, scope.row, 'start')">启用</el-button>
						<el-button size="small" @click="handleEdit(scope.$index, scope.row, 'del')">删除</el-button>
					</span>
					<span v-else>
						<el-button size="small" v-if="keywordList[scope.$index].isblack==0"  @click="handleEdit(scope.$index, scope.row)">停用</el-button>
						<el-button size="small" v-if="keywordList[scope.$index].isblack==1"  @click="handleEdit(scope.$index, scope.row)">启用</el-button>
					</span>
				</template>
        </el-table-column>
    </el-table>

    <el-col :span="24" class="toolbar">
        <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" :page-size="pageSize" :total="total" :current-page="page" :page-sizes="[10, 15, 20, 50,100]" style="float:right;">
        </el-pagination>
    </el-col>
</section>
</template>

<script>
import {
    getKeyWordList,
    addAuditKey,
    updateAuditKey,
    UploadXlsxUrl,
    exportExlData,
    getTemplateshow
} from '@/api/operationTools';

export default {
    data() {
        return {
            filters: {
                rowkey: '',
                newXurl: '',
                status: '2',
                level: 1,
                platform: '',
                keytype: 'POLITICAL'
            },
            isAuth: {
                invalidkeys: false,
                commentKeys: false,
                userNameKeys: false,
                auditKeys: false,
                contentKeys: false,
                wordsNoComment: false,
                blockadskeys: false,
                dfhusernamekeys: false,
                toutiaopcadblock: false,
                eastdaypoliticskeywords: false,
                blocksearchkeywords: false,
                auditrefusekeywords: false,
                commentaudittitlekeywords: false,
                nicknamecommentkeywords: false,
                nickname2345keywords: false
            },
            isblack: [{
                value: '2',
                label: '全部'
            }, {
                value: '0',
                label: '启用'
            }, {
                value: '1',
                label: '停用'
            }, ],
            platform: [{
                value: 'content',
                label: '正文标红关键词',
                isAuth: false
            }, {
                value: 'nocomment',
                label: '标题禁止评论关键词',
                isAuth: false
            }, {
                value: 'comment',
                label: '评论替换*关键词',
                isAuth: false
            }, {
                value: 'username',
                label: '头条昵称敏感词',
                isAuth: false
            }, {
                value: 'invlid',
                label: '推荐无效关键词',
                isAuth: false
            }, {
                value: 'adv',
                label: '禁止广告关键词',
                isAuth: false
            }, {
                value: 'dfhnick',
                label: '东方号昵称敏感词',
                isAuth: false
            }, {
                value: 'toutiaopcadblock',
                label: '头条PC去广告关键词',
                isAuth: false
            }, {
                value: 'audit',
                label: '标题审核关键词',
                isAuth: false
            }, {
                value: 'eastdaypoliticskeywords',
                label: '东方网涉政关键词',
                isAuth: false
            }, {
                value: 'blocksearchkeywords',
                label: '搜索屏蔽关键词',
                isAuth: false
            }, {
                value: 'auditrefusekeywords',
                label: '高危敏感词',
                isAuth: false
            }, {
                value: 'commentaudittitlekeywords',
                label: '评论审核标题关键词',
                isAuth: false
            }, {
                value: 'nicknamecommentkeywords',
                label: '头条评论用户昵称敏感词',
                isAuth: false
            }, {
                value: 'nickname2345keywords',
                label: '2345评论用户昵称敏感词',
                isAuth: false
            }],
            remarks: [{
                value: 'POLITICAL',
                label: '政治'
            }, {
                value: 'PORN',
                label: '色情'
            }, {
                value: 'AD',
                label: '广告'
            }, {
                value: 'WATER',
                label: '灌水'
            }, {
                value: 'OTHER',
                label: '其他'
            }, {
                value: 'UNKNOWN',
                label: '未知'
            }],
            keywordList: [],
            keywordAll: [],
            listLoading: false,
            total: 0,
            pageSize: 10,
            page: 1,
            sels: [],
        }
    },
    created() {
        this.getAuth();
        this.filters.newXurl = UploadXlsxUrl;
    },
    mounted() {
        this.getKeyWordList();
    },
    methods: {
        handleAvatarSuccess(res, file) {
            // let msg='总共上传'+res.data.total+',成功'+res.data.success+',重复数据'+res.data.duplicated;
            this.$notify({
                title: '成功',
                message: '关键词上传成功',
                type: 'success'
            });
        },
        getAuth() { //权限控制
            let authorList = localStorage.getItem('authorList');
            if (authorList.indexOf('auditKeys/queryKeys') > -1) {
                this.isAuth.auditKeys = true;
                this.platform[8].isAuth = true;
            }
            if (authorList.indexOf('contentKeys/red/queryKeys') > -1) {
                this.isAuth.contentKeys = true;
                this.platform[0].isAuth = true;
            }
            if (authorList.indexOf('wordsNoComment/queryusercomment') > -1) {
                this.isAuth.wordsNoComment = true;
                this.platform[1].isAuth = true;
            }
            if (authorList.indexOf('commentKeys/queryCommentKeys') > -1) {
                this.isAuth.commentKeys = true;
                this.platform[2].isAuth = true;
            }
            if (authorList.indexOf('userNameKeys/queryKeys') > -1) {
                this.isAuth.userNameKeys = true;
                this.platform[3].isAuth = true;
            }
            if (authorList.indexOf('api/invalidkeys/query') > -1) {
                this.isAuth.invalidkeys = true;
                this.platform[4].isAuth = true;
            }
            if (authorList.indexOf('api/blockadskeys/query') > -1) {
                this.isAuth.blockadskeys = true;
                this.platform[5].isAuth = true;
            }
            if (authorList.indexOf('api/dfhusernamekeys/querykeys') > -1) {
                this.isAuth.dfhusernamekeys = true;
                this.platform[6].isAuth = true;
            }
            if (authorList.indexOf('api/commonkeywords/query') > -1) {
                this.isAuth.toutiaopcadblock = true;
                this.platform[7].isAuth = true;
            }
            if (authorList.indexOf('api/eastdaypoliticskeywords/query') > -1) {
                this.isAuth.eastdaypoliticskeywords = true;
                this.platform[9].isAuth = true;
            }
            if (authorList.indexOf('api/blocksearchkeywords/query') > -1) {
                this.isAuth.blocksearchkeywords = true;
                this.platform[10].isAuth = true;
            }
            if (authorList.indexOf('api/auditrefusekeywords/query') > -1) {
                this.isAuth.auditrefusekeywords = true;
                this.platform[11].isAuth = true;
            }
            if (authorList.indexOf('api/commentaudittitlekeywords/query') > -1) {
                this.isAuth.commentaudittitlekeywords = true;
                this.platform[12].isAuth = true;
            }
            if (authorList.indexOf('api/nicknamecommentkeywords/query') > -1) {
                this.isAuth.nicknamecommentkeywords = true;
                this.platform[13].isAuth = true;
            }
            if (authorList.indexOf('api/nickname2345keywords/query') > -1) {
                this.isAuth.nickname2345keywords = true;
                this.platform[14].isAuth = true;
            }


            if (this.isAuth.contentKeys) {
                this.filters.platform = 'content';
            } else if (this.isAuth.wordsNoComment) {
                this.filters.platform = 'nocomment';
            } else if (this.isAuth.commentKeys) {
                this.filters.platform = 'comment';
            } else if (this.isAuth.userNameKeys) {
                this.filters.platform = 'username';
            } else if (this.isAuth.invalidkeys) {
                this.filters.platform = 'invlid';
            } else if (this.isAuth.blockadskeys) {
                this.filters.platform = 'adv';
            } else if (this.isAuth.dfhusernamekeys) {
                this.filters.platform = 'dfhnick';
            } else if (this.isAuth.toutiaopcadblock) {
                this.filters.platform = 'toutiaopcadblock';
            } else if (this.isAuth.auditKeys) {
                this.filters.platform = 'audit';
            } else if (this.isAuth.eastdaypoliticskeywords) {
                this.filters.platform = 'eastdaypoliticskeywords';
            } else if (this.isAuth.blocksearchkeywords) {
                this.filters.platform = 'blocksearchkeywords';
            } else if (this.isAuth.auditrefusekeywords) {
                this.filters.platform = 'auditrefusekeywords';
            } else if (this.isAuth.commentaudittitlekeywords) {
                this.filters.platform = 'commentaudittitlekeywords'
            } else if (this.isAuth.nicknamecommentkeywords) {
                this.filters.platform = 'nicknamecommentkeywords'
            } else if (this.isAuth.nickname2345keywords) {
                this.filters.platform = 'nickname2345keywords'
            }
        },
        selsChange(sels) { //全选
            this.sels = sels;
        },
        downloadTemplate() {
            window.location.href = getTemplateshow + '/' + this.filters.platform;
        },
        exportData() {
            window.location.href = exportExlData + '/' + this.filters.platform;
        },
        getKeyWordList(page) { //搜索
            let para = {};
            if (page) {
                this.page = page
            }

            if (this.filters.platform == 'audit') { //审核关键字
                if (this.filters.status == '2') {
                    this.filters.status = '0';
                }
                para = {
                    rowkey: this.filters.rowkey,
                    status: this.filters.status,
                    url: 'auditKeys/queryKeys'
                }
            } else if (this.filters.platform == 'content') { //正文关键字
                para = {
                    page: this.page,
                    pagesize: this.pageSize,
                    name: this.filters.rowkey,
                    isblack: this.filters.status,
                    url: 'contentKeys/red/queryKeys'
                }
            } else if (this.filters.platform == 'nocomment') { //标题关键字
                para = {
                    page: this.page,
                    pagesize: this.pageSize,
                    keyword: this.filters.rowkey == '' ? ' ' : this.filters.rowkey,
                    url: 'wordsNoComment/queryusercomment'
                }
            } else if (this.filters.platform == 'comment') { //评论关键字
                para = {
                    page: this.page,
                    pagesize: this.pageSize,
                    isblack: this.filters.status,
                    commentKey: this.filters.rowkey == '' ? ' ' : this.filters.rowkey,
                    url: 'commentKeys/queryCommentKeys'
                }
            } else if (this.filters.platform == 'username') { //昵称关键字
                para = {
                    page: this.page,
                    pagesize: this.pageSize,
                    name: this.filters.rowkey == '' ? ' ' : this.filters.rowkey,
                    url: 'userNameKeys/queryKeys'
                }
            } else if (this.filters.platform == 'invlid') { //无效关键字
                para = {
                    page: this.page,
                    pagesize: this.pageSize,
                    key: this.filters.rowkey,
                    isblack: this.filters.status,
                    url: 'api/invalidkeys/query'
                }
            } else if (this.filters.platform == 'adv') { //屏蔽广告关键字
                para = {
                    page: this.page,
                    pagesize: this.pageSize,
                    key: this.filters.rowkey,
                    isblack: this.filters.status,
                    url: 'api/blockadskeys/query'
                }
            } else if (this.filters.platform == 'dfhnick') { //东方号昵称关键字
                para = {
                    page: this.page,
                    pagesize: this.pageSize,
                    name: this.filters.rowkey,
                    url: 'api/dfhusernamekeys/querykeys'
                }
            } else if (this.filters.platform == 'toutiaopcadblock') { //头条PC去广告关键词
                para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    platform: this.filters.platform,
                    keywords: this.filters.rowkey,
                    url: 'api/commonkeywords/query'
                }
            } else if (this.filters.platform == 'eastdaypoliticskeywords' || this.filters.platform == 'commentaudittitlekeywords') { // 东方网涉政关键词
                para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    platform: this.filters.platform,
                    keywords: this.filters.rowkey,
                    url: 'api/commonkeywords/query'
                }
            } else if (this.filters.platform == 'blocksearchkeywords') { // 搜索屏蔽关键词
                para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    platform: this.filters.platform,
                    keywords: this.filters.rowkey,
                    url: 'api/commonkeywords/query'
                }
            } else if (this.filters.platform == 'auditrefusekeywords') { //头条PC去广告关键词
                para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    platform: this.filters.platform,
                    keywords: this.filters.rowkey,
                    url: 'api/commonkeywords/query'
                }
            } else if (this.filters.platform == 'nicknamecommentkeywords') { // 评论用户敏感词
                para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    keywords: this.filters.rowkey,
                    url: 'afterlogin/nicknamecommentkeywords/query'
                }
            } else if (this.filters.platform == 'nickname2345keywords') { // 2345敏感词
                para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    keywords: this.filters.rowkey,
                    url: 'afterlogin/nickname2345keywords/query'
                }
            }

            this.listLoading = true;
            getKeyWordList(para).then((res) => {
                if (res.code == '00001') {
                    if (this.filters.platform == 'audit') { //审核关键字
                        this.total = res.data.length;
                        this.keywordAll = res.data;
                        this.keywordList = this.keywordAll.slice((this.page - 1) * this.pageSize, this.pageSize);
                    } else if (this.filters.platform == 'blocksearchkeywords') {
                        this.total = res.data.total;
                        this.keywordAll = res.data.data;
                        this.keywordList = this.keywordAll.slice((this.page - 1) * this.pageSize, this.pageSize);
                    } else if (this.filters.platform == 'toutiaopcadblock' || this.filters.platform == 'auditrefusekeywords' || this.filters.platform == 'eastdaypoliticskeywords' || this.filters.platform == 'blocksearchkeywords' || this.filters
                        .platform == 'commentaudittitlekeywords' || this.filters.platform == 'nicknamecommentkeywords' || this.filters.platform == 'nickname2345keywords') { //头条PC去广告关键词
                        this.total = res.data.total;
                        this.keywordList = res.data.data;
                    } else {
                        this.total = res.data.dataCount;
                        this.keywordList = res.data.dataPageData;
                    }

                } else if (res.code == '00002') {
                    this.total = 0;
                    this.keywordAll = [];
                    this.keywordList = [];
                }
                this.listLoading = false;
            });
        },
        addAuditKey() {
            if (this.filters.rowkey != '') {
                this.$confirm('确认新增记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = {};
                    if (this.filters.platform == 'audit') { //审核关键字
                        para = {
                            rowkey: this.filters.rowkey,
                            status: this.filters.status,
                            level: this.filters.level,
                            url: 'auditKeys/addAuditKeys'
                        }
                    } else if (this.filters.platform == 'content') {
                        para = {
                            name: this.filters.rowkey,
                            url: 'contentKeys/red/addKey'
                        }
                    } else if (this.filters.platform == 'nocomment') {
                        para = {
                            keyword: this.filters.rowkey,
                            url: 'wordsNoComment/addkeywords'
                        }
                    } else if (this.filters.platform == 'comment') {
                        para = {
                            commentKey: this.filters.rowkey,
                            url: 'commentKeys/addCommentKey'
                        }
                    } else if (this.filters.platform == 'username') {
                        if (this.filters.keytype == 'UNKNOWN') {
                            this.$message({
                                message: '新增备注信息不能选择未知',
                                type: 'warning'
                            });
                            return;
                        }
                        para = {
                            name: this.filters.rowkey,
                            keytype: this.filters.keytype,
                            url: 'userNameKeys/addKey'
                        }
                    } else if (this.filters.platform == 'invlid') { //无效关键词
                        para = {
                            key: this.filters.rowkey,
                            url: 'api/invalidkeys/add'
                        }
                    } else if (this.filters.platform == 'adv') { //屏蔽广告词
                        para = {
                            key: this.filters.rowkey,
                            url: 'api/blockadskeys/add'
                        }
                    } else if (this.filters.platform == 'dfhnick') { //东方号昵称关键字
                        para = {
                            name: this.filters.rowkey,
                            keytype: this.filters.keytype,
                            url: 'api/dfhusernamekeys/addkey'
                        }
                    } else if (this.filters.platform == 'toutiaopcadblock' || this.filters.platform == 'eastdaypoliticskeywords' || this.filters.platform == "blocksearchkeywords" || this.filters.platform == "commentaudittitlekeywords") { //头条PC去广告关键词
                        para = {
                            keywords: this.filters.rowkey,
                            platform: this.filters.platform,
                            url: 'api/commonkeywords/add'
                        }
                    } else if (this.filters.platform == "auditrefusekeywords") { // 高危敏感词
                        para = {
                            keywords: this.filters.rowkey,
                            platform: this.filters.platform,
                            level: this.filters.level,
                            url: 'api/commonkeywords/add'
                        }
                    } else if (this.filters.platform == "nicknamecommentkeywords") { // 评论用户敏感词
                        para = {
                            keywords: this.filters.rowkey,
                            isBlack: 0,
                            url: 'afterlogin/nicknamecommentkeywords/add'
                        }
                    } else if (this.filters.platform == "nickname2345keywords") { // 2345
                        para = {
                            keywords: this.filters.rowkey,
                            isBlack: 0,
                            url: 'afterlogin/nickname2345keywords/add'
                        }
                    }
                    addAuditKey(para).then((res) => {
                        this.getKeyWordList();
                    });
                });
            } else {
                this.$message({
                    message: '请先输入关键字',
                    type: 'warning'
                });
            }

        },
        handleEdit(index, row, type) { //操作
            this.$confirm('确认修改该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let status;
                if (this.filters.platform == 'audit') { //审核关键字
                    if (row.status == 0) {
                        status = 1;
                    } else {
                        status = 0;
                    }
                } else if (this.filters.platform == 'nicknamecommentkeywords' || this.filters.platform == 'nickname2345keywords') {
                    if (row.isBlack == 0) {
                        status = 1;
                    } else {
                        status = 0;
                    }
                } else {
                    if (row.isblack == 0) {
                        status = 1;
                    } else {
                        status = 0;
                    }
                }
                let para = {};
                if (this.filters.platform == 'audit') { //审核关键字
                    para = {
                        rowkey: row.rowkey,
                        status: status,
                        url: 'auditKeys/updateKeysStatus'
                    }
                } else if (this.filters.platform == 'content') {
                    para = {
                        name: row.key,
                        isblack: status,
                        url: 'contentKeys/red/updateKey'
                    }
                } else if (this.filters.platform == 'nocomment') {
                    para = {
                        keywords: row.keyword,
                        oldstates: row.isblack,
                        isState: status,
                        url: 'wordsNoComment/changeworkstate'
                    }
                } else if (this.filters.platform == 'comment') {
                    para = {
                        isblack: status,
                        commentkeys: row.usernamekey + '_' + row.isblack,
                        url: 'commentKeys/updateKeyStatus'
                    }
                } else if (this.filters.platform == 'username') {
                    para = {
                        name: row.words,
                        url: 'userNameKeys/deleteKey'
                    }
                } else if (this.filters.platform == 'invlid') {
                    para = {
                        key: row.key,
                        isblack: status,
                        url: 'api/invalidkeys/update'
                    }
                } else if (this.filters.platform == 'adv') {
                    para = {
                        key: row.key,
                        isblack: status,
                        url: 'api/blockadskeys/update'
                    }
                } else if (this.filters.platform == 'dfhnick') { //东方号昵称关键字
                    para = {
                        id: row.id,
                        url: 'api/dfhusernamekeys/deletekey'
                    }
                } else if (this.filters.platform == 'toutiaopcadblock') { //头条PC去广告关键词
                    para = {
                        id: row.id,
                        keywords: row.keywords,
                        platform: this.filters.platform,
                        url: 'api/commonkeywords/del'
                    }
                } else if (this.filters.platform == 'auditrefusekeywords') { //头条PC去广告关键词
                    para = {
                        id: row.id,
                        isblack: status,
                        keywords: row.keywords,
                        platform: this.filters.platform,
                        url: 'api/commonkeywords/del'
                    }
                } else if (this.filters.platform == "eastdaypoliticskeywords" || this.filters.platform == "blocksearchkeywords" || this.filters.platform == 'commentaudittitlekeywords') {
                    if (type == 'start') {
                        para = {
                            id: row.id,
                            isblack: status,
                            platform: this.filters.platform,
                            keywords: row.keywords,
                            url: 'api/commonkeywords/update'
                        }
                    } else {
                        para = {
                            id: row.id,
                            keywords: row.keywords,
                            platform: this.filters.platform,
                            url: 'api/commonkeywords/del'
                        }
                    }

                } else if (this.filters.platform == "nicknamecommentkeywords" || this.filters.platform == "nickname2345keywords") { // 评论用户敏感词
                    if (type == 'start') {
                        para = {
                            id: row.id,
                            keywords: row.keywords,
                            isBlack: status,
                            url: 'afterlogin/' + this.filters.platform + '/update'
                        }
                    } else {
                        para = {
                            id: row.id,
                            keywords: row.keywords,
                            url: 'afterlogin/' + this.filters.platform + '/del'
                        }
                    }
                }
                updateAuditKey(para).then((res) => {
                    this.getKeyWordList();
                    this.listLoading = false;
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        handleCurrentChange(val) { //分页
            this.page = val;
            if (this.filters.platform == 'audit' || this.filters.platform == 'blocksearchkeywords') { //审核关键字
                let start = (this.page - 1) * this.pageSize;
                console.log(start)
                this.keywordList = this.keywordAll.slice(start, start + this.pageSize);
                console.log(this.keywordList)
            } else {
                this.getKeyWordList();
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
            if (this.filters.platform == 'audit' || this.filters.platform == 'blocksearchkeywords') { //审核关键字
                let start = (this.page - 1) * this.pageSize;
                this.keywordList = this.keywordAll.slice(start, start + this.pageSize);
            } else {
                this.getKeyWordList();
            }
        }
    }
}
</script>

<style scoped>
.jdz {
    width: 50px;
}
</style>
