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
                              :value="item.typeName=='全部'?'':item.typeName">
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
                    <!-- <el-form-item label="内容来源">
                        <el-select v-model="formData.isdfh" placeholder="选择类型" filterable class="select-platform">
                            <el-option key="id0" label="全部" value=""></el-option>
                            <el-option key="id1" label="非东方号" value="0"></el-option>
                            <el-option key="id2" label="东方号" value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
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
                  stripe border>
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
                    <span>{{ format(parseInt(scope.row.crawlerts), 'yyyy-MM-dd HH:mm:ss') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="来源"  width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="urlfrom" label="信源"  width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="author" label="操作人"  width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="操作" width="340" fixed="right">
                <template slot-scope="scope">
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
    newsvideoapiGettypes,
    videoDelQuality,
    videoQuality,
    getHqualityClass,
    videohQualityList
} from '@/api/contentManage'
export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            activeName: '1',
            nowApi: 'newsmanager',
            // 表单
            formData: {
                platform: 'toutiao',
                startTime: '',
                endTime: '',
                text: '',
                dateRange: [new Date(new Date().toLocaleDateString()).getTime() - 2 * 24 * 60 * 60 * 1000, new Date().getTime()],
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
        this.formData.startTime = this.formData.dateRange[0]
        this.formData.endTime = this.formData.dateRange[1]
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
                    if (authList.indexOf('api/videomanager/addquality') != -1) {
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
            newsvideoapiGettypes({
                type: 'newsvideo'
            }).then(res => {
                var _this = this;
                if (res.code == "00001") {
                    res.data.forEach(item => {
                        if (item.level == 1) {
                            _this.qualityClassify.push(item)
                        }
                    })
                    this.qualityClassify.unshift({
                        'typeName': '全部',
                        'typePy': ''
                    })
                    this.formData.classify = ''
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
            }
            videohQualityList(param).then((res) => {
                if (res.code == "00001") {
                    if (res.data) {
                        var data = res.data;
                        this.tableData = data.result;
                        this.total = Number(data.count);
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                }
                this.listLoading = false
            })
        },
        // 加黑
        addblack(row) {
            var params = {
                param: {
                    rowkey: row.rowkey
                },
                platform: this.nowApi
            }
            this.listLoading = true;
            addblack(params).then(res => {
                if (res.code == '00001') {
                    this.$notify({
                        title: '成功',
                        message: '加黑成功',
                        type: 'success'
                    });
                    this.getList();
                }
                this.listLoading = false;
            })
        },
        // 撤销
        removeblack(row) {
            var params = {
                param: {
                    rowkey: row.rowkey
                },
                platform: this.nowApi
            }
            this.listLoading = true;
            removeblack(params).then(res => {
                if (res.code == '00001') {
                    this.$notify({
                        title: '成功',
                        message: '撤销成功',
                        type: 'success'
                    });
                    this.getList();
                }
                this.listLoading = false;
            })
        },
        // 404
        add404(row) {
            var params = {
                param: {
                    rowkey: row.rowkey
                },
                platform: this.nowApi
            }
            this.listLoading = true;
            add404(params).then(res => {
                if (res.code == '00001') {
                    this.$notify({
                        title: '成功',
                        message: '404成功',
                        type: 'success'
                    });
                    this.getList();
                }
                this.listLoading = false;
            })
        },
        // 置顶
        toTop(data) {
            this.$router.push({
                path: '/operationTools/contentRecommend/videoRecommend',
                query: {
                    data: {
                        rowkey: data.url,
                        platfrom: 'toutiao'
                    },
                    type: 'videoTop'
                }
            })
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
                    type: 'videoUtil'
                }
            });
        },
        // 删除
        del(row) {
            let param = {
                rowkey: row.rowkey
            }
            videoDelQuality(param).then(res => {
                if (res.code == "00001") {
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '移除成功!'
                    });
                }
            })
        },
        //时间戳转换
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
            videoQuality().then(res => {
                if (res.code == "00001") {
                    this.userNameOptions = res.data;
                    this.userNameOptions.unshift('')
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
