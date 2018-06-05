<template lang="html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="formData">
                <el-row>
                    <el-form-item label="操作平台">
                        <!--优质内容库暂时只有东方头条-->
                        <el-select v-model="formData.platform" class="select-platform"
                            filterable placeholder="选择分类" >
                            <el-option
                                v-for="(item,index) in platformOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="添加时间">
                        <el-date-picker
                          v-model="formData.dateRange"
                          @change="dateRangeChange"
                          type="daterange"
                          align="right"
                          placeholder="选择日期范围"
                          :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="主分类">
                        <el-select v-model="formData.classify" placeholder="选择分类" filterable class="select-platform">
                            <el-option
                              v-for="item in qualityClassify"
                              :key="item.typeId"
                              :label="item.typeName"
                              :value="item.typePy">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作人">
                        <el-select v-model="formData.username" placeholder="选择操作人" filterable class="select-platform">
                            <el-option
                              v-for="item in userNameOptions"
                              :key="item"
                              :label="item==''?'全部':item"
                              :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="内容来源">
                        <el-select v-model="formData.isdfh" placeholder="选择类型" filterable class="select-platform">
                            <el-option key="id0" label="全部" value=""></el-option>
                            <el-option key="id1" label="非东方号" value="0"></el-option>
                            <el-option key="id2" label="东方号" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="primary" v-model="formData.url" placeholder="请输入URL"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="primary" v-model="formData.text" placeholder="请输入文章关键字查询"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchList">查询</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="tableData"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border
                  @expand-change="hQualityClickRate">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div style="width:1111px">
                        <el-table
                            :data="props.row.subhead"
                            width="100%"
                            :key="subKey"
                            border>
                            <el-table-column
                                prop="dt"
                                label="标题"
                                min-width="220">
                                <template slot-scope="title">
                                    <el-popover
                              			  placement="right"
                              			  title="封面"
                              			  width="250"
                              			  height="150"
                              			  trigger="hover"
                                          :show-overflow-tooltip="true"
                              			  >
                              			  <img :src="i.src" width="100%" height="100%" v-for="i in title.row.img" v-if="i != ''"/>
                                          <el-button slot="reference"
                                                class="dialog-span title-button"
                                                :class="title.row.isbest==1?'red_text':''"
                                                style="white-space: nowrap;">{{ title.row.name }}</el-button>
                          			</el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="clickpv"
                                label="点击PV"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="showpv"
                                label="展现PV"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="click_num"
                                label="点击率PV"
                                width="120">
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
                  <!-- <template scope="props">
                      <p v-for="(item,index) in props.row.subhead" v-if="props.row.subhead.length!=0" style="margin:0">
                          <el-popover
                    			  placement="right"
                    			  title="封面"
                    			  width="250"
                    			  height="150"
                    			  trigger="hover"
                    			  >
                    			  <img :src="i.src" width="100%" height="100%" v-for="i in item.img" v-if="i != ''"/>
                                <el-button slot="reference"
                                      class="dialog-span title-button"
                                      style="white-space: nowrap;">{{ item.name }}</el-button>
                			</el-popover>
                      </p>
                      <p v-if="props.row.subhead.length == 0">
                          暂无副标题
                      </p>
                  </template> -->
            </el-table-column>
            <el-table-column prop="subheadNum" label="副标题" width="80" align="center">
            </el-table-column>
            <el-table-column label="标题" :show-overflow-tooltip="true">
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
                        style="white-space: nowrap;"
                        :class="scope.row.isban==1?'disable_title':''">{{ scope.row.contenttitle }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="新增时间" width="170">
                <template slot-scope="scope">
                    <span>{{ parseInt(scope.row.crawlerts) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="来源"  width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="urlfrom" label="信源"  width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="author" label="操作人"  width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="qualityuser" label="最新修改人"  width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="操作" width="340" fixed="right">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" size="small"
                               @click="edit(scope.row)"
                               v-if="scope.row.isban==0&&auth.edit&&adminAuth('edit',scope.row)">编辑</el-button> -->
                    <el-button type="success" size="small"
                              @click="manage(scope.row)"
                              v-if="scope.row.isban==0&&auth.manage">管理</el-button>
                    <el-button type="warning" size="small"
                               @click="toTop(scope.row)"
                               v-if="scope.row.isblack==0&&scope.row.isban==0&&auth.toTop">置顶</el-button>
                    <el-button type="primary" size="small" @click="openNew(scope.row)" v-if="scope.row.isban==0">打开URL</el-button>
                    <el-button type="primary" size="small"
                               @click="del(scope.row)"
                               v-if="scope.row.isban==0&&adminAuth('delete',scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="block">
            <el-pagination
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total,sizes, prev, pager, next,jumper"
              :page-sizes=[10,15,20,50,100]
              :current-page="limit.page"
              :page-size="limit.pageSize"
              :total="total"
              style="float:right;"
              >
            </el-pagination>
        </div>
        <!--点击标题触发-->
        <el-dialog title="页面预览" v-model="replyFormVisible" size="small" top="5%" :close-on-click-modal="false">
              <div >
                <iframe :src="contentPreview" style="border: 0;" width="100%" height="700px"></iframe>
              </div>
        </el-dialog>
    </section>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    hQualityClickRate,
    hQualityUser,
    getHqualityClass,
    hQualityKeywordsList,
    delhQuality
} from '@/api/contentManage'
export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            subKey: 0,
            activeName: '1',
            nowApi: 'newsmanager',
            // 表单
            formData: {
                platform: 'toutiao',
                startTime: '',
                endTime: '',
                text: '',
                dateRange: '',
                words: '',
                comments: '',
                id: '',
                status: '',
                classify: '',
                username: '',
                url: '',
                isdfh: ''
            },
            keywordDisable: false,
            replyFormVisible: false,
            contentPreview: '',
            saveEditBtn: false,
            qualityClassify: [],
            platformOptions: [{
                label: '东方头条',
                value: 'toutiao'
            }],
            userNameOptions: [],
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
            },
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
        this.limit.pageSize = this.personalConfig.tableRowShow
        this.getAuth();
        this.getHqualityClass();
        this.hQualityUser();
        this.getList();
    },
    methods: {
        // 管理员/一般人员 权限
        adminAuth(type, row) {
            const authList = localStorage.getItem('authorList');
            let user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            switch (type) {
                case 'edit':
                    if (authList.indexOf('quality/edit/admin') != -1) {
                        return true
                    } else {
                        if (row.author == user.username) {
                            return true
                        } else {
                            return false
                        }
                    }
                    break;
                case 'delete':
                    if (authList.indexOf('quality/delete/admin') != -1) {
                        return true
                    } else {
                        if (row.author == user.username) {
                            return true
                        } else {
                            return false
                        }
                    }
                    break;
            }
        },
        // 权限控制
        getAuth() {
            const authList = localStorage.getItem('authorList');
            if (authList.indexOf('news-platform-DONGFANG') != -1) {
                this.auth.toTop = true
            }
            if (authList.indexOf('sendnews-platform-DONGFANG') != -1) {
                this.auth.edit = true
            }
            if (authList.indexOf('content/black/dftt/article') != -1) {
                this.auth.manage = true
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
                    this.formData.classify = res.data[0].typePy
                }
            });
        },
        // 时间插件修改
        dateRangeChange: function(val) {
            this.formData.startTime = val[0].setHours(0,0,0,0)
            this.formData.endTime = val[1].setHours(23,59,59,99)
        },
        // 搜索
        searchList() {
            this.limit.page = 1;
            this.getList();
        },
        // 获取表格数据（数据为空需提示）
        getList() {
            this.listLoading = true;
            let param = {
                stime: this.formData.startTime,
                etime: this.formData.endTime,
                maintype: this.formData.classify,
                title: this.formData.text,
                page: this.limit.page,
                pagesize: this.limit.pageSize,
                url: this.formData.url,
                username: this.formData.username,
                isdfh: this.formData.isdfh
            }
            hQualityKeywordsList(param).then((res) => {
                if (res.code == "00001") {
                    if (res.data) {
                        var data = res.data;
                        this.tableData = data.data;
                        // 副标题处理
                        this.tableData.forEach((item, index) => {
                            item.subhead = [];
                            item.subheadNum = 0;
                            // 副标题名称
                            var allSubhead = [];
                            for (var i = 0; i < 5; i++) {
                                allSubhead.push({
                                    "name": item['title0' + (i + 1)],
                                    "img": item["miniajs0" + (i + 1)] == '' ? '' : eval(item["miniajs0" + (i + 1)])
                                });
                            }
                            allSubhead.forEach(itemSubhead => {
                                if (itemSubhead.name != '' && itemSubhead.name != null && itemSubhead.name != "null") {
                                    item.subhead.push(itemSubhead)
                                }
                            })
                            item.subheadNum = item.subhead.length
                            if (item.goodtitle == 1) {
                                item.subhead.forEach(sub => {
                                    if (sub.name == item.topic) {
                                        sub.isbest = 1
                                    }
                                })
                            }
                        })
                        this.total = Number(data.count);
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                }
                this.listLoading = false
            })
        },
        // 置顶
        toTop(data) {
            this.$router.push({
                path: '/operationTools/contentRecommend/newsRecommend',
                query: {
                    data: {
                        rowkey: data.url,
                        platfrom: this.formData.platform
                    },
                    type: 'newsTop'
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
        //管理
        manage(data) {
            this.$router.push({
                path: '/operationTools/contentManageTools/contentManage',
                query: {
                    url: data.url,
                    platform: this.formData.platform,
                    type: '文章'
                }
            })
        },
        // 删除
        del(row) {
            let param = {
                rowkey: row.rowkey
            }
            delhQuality(param).then(res => {
                if (res.code == "00001") {
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '移除成功!'
                    });
                }
            })
        },
        // 点击标题dialog
        showReplyForm(row) {
            if (row.isban == 1) {
                return false
            }
            this.replyFormVisible = true;
            this.contentPreview = row.url
        },
        // 操作人员列表
        hQualityUser() {
            hQualityUser().then(res => {
                if (res.code == "00001") {
                    this.userNameOptions = res.data;
                    this.userNameOptions.unshift('')
                }
            })
        },
        // 打开按钮
        openNew(row) {
            window.open(row.url)
        },
        // 副标题点击率
        hQualityClickRate(row, expand) {
            console.log(row)
            console.log(expand)
            let params = {
                url: row.url,
                date: row.crawlerts
            }
            if (expand) {
                hQualityClickRate(params).then(res => {
                    res.data.forEach(item => {
                        if (item.suptop != null && item.suptop != '' && item.suptop != 'null') {
                            var index = parseInt(item.suptop.charAt(item.suptop.length - 1))
                            row.subhead[index - 1].showpv = item.showpv
                            row.subhead[index - 1].clickpv = item.clickpv
                            if (item.showpv != 0) {
                                row.subhead[index - 1].click_num = ((item.clickpv * 10000 * 100) / (item.showpv * 10000)).toFixed(2) + '%'
                            } else {
                                row.subhead[index - 1].click_num = '0%'
                            }

                        }
                    })
                    this.subKey += 1
                })
            }
        }
    }
}
</script>

<style lang="css" scoped="scoped">
    .red_text{
        color: red !important
    }
</style>
