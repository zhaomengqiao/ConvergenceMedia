<template lang="html">
    <section class="contentSyncAdd">
        <el-row :gutter="10">
            <el-col :span="6">
                <el-card>
                    <el-form label-position="right" label-width="110px" :model="form">
                        <el-form-item label="选择同步类型：">
                            <el-select v-model="form.syncType" placeholder="请选择">
                                <el-option
                                    v-for="item in syncType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="网址：">
                            <el-input v-model="form.website" placeholder="请输入同步网址"></el-input>
                        </el-form-item>
                        <div class="">
                            <el-form-item label="标题：">
                                <el-input v-model.trim="form.title" placeholder="请输入同步内容标题；"></el-input>
                            </el-form-item>
                            <el-form-item label="来源：">
                                <el-input v-model="form.source" placeholder="请输入同步内容来源；"></el-input>
                            </el-form-item>
                            <el-form-item label="类别：">
                                <el-select v-model="form.category" placeholder="请选择类别">
                                    <el-option
                                        v-for="item in category"
                                        :key="item.typePy"
                                        :label="item.typeName"
                                        :value="item.typePy">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关键词：">
                                <el-tag style='margin-right: 10px;'
                                      :key="tag"
                                      v-for="(tag,index) in form.keywords"
                                      :closable="true"
                                      :close-transition="false"
                                      @close="handleClose(tag)"
                                    >
                                    {{tag}}
                                    </el-tag>
                                    <el-input style="width: 100px;"
                                      class="input-new-tag"
                                      v-if="inputVisible"
                                      v-model.trim="inputValue"
                                      ref="saveTagInput"
                                      :maxlength='keywordsMax'
                                      size="mini"
                                      @keyup.enter.native="handleInputConfirm"
                                      @blur="handleInputConfirm"
                                    >
                                    </el-input>
                                    <el-button class="button-new-tag" size="small" @click="showInput">添加关键词</el-button>
                            </el-form-item>
                            <el-form-item label="封面：">
                                <el-upload
                                    class="middle-single__uploader"
                                    :action="fileUpload"
                                    :show-file-list="false"
                                    :on-success="uploadSuccess">
                                    <img v-if="imageUrl" :src="imageUrl" class="middle-single__img">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="synchronize" :loading="syncLoading">同步</el-button>
                                <el-button type="success" @click="resetForm">清空</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-card>
                    <div class="addNewsRight-top">
                        <span>我添加的同步内容：</span>
                        <div style="margin-top:10px;">
                            <el-date-picker format="yyyy-MM-dd HH:mm:ss"
                                v-model="search.timeQuantum"
                                type="datetimerange"
                                placeholder="选择时间范围"
                                @change="getTopTime">
                            </el-date-picker>
                            <el-input v-model="search.user" placeholder="请输入用户名" style="width:120px;"></el-input>
                            <el-input v-model="search.title" placeholder="请输入标题关键词" style="width:120px;"></el-input>
                            <el-button type="primary" @click="getSyncContent">搜索</el-button>
                        </div>
                    </div>
                    <div>
                        <el-row style="margin:10px 0;">
                            <el-radio-group class="pull-left" v-model="search.status" @change="getSyncContent">
                                <el-radio-button :label="item.value" v-for="(item,index) in statusOptions" :key="index">{{ item.label }}</el-radio-button>
                            </el-radio-group>
                        </el-row>
                        <el-row>
                            <el-table
                                :data="tableData"
                                :default-expand-all="expandAllRow"
                                border
                                :key="key"
                                :row-class-name="tableRowClassName"
                                style="width: 100%">
                                <el-table-column type="expand">
                                    <template slot-scope="props">
                                        <el-form label-position="left" inline class="demo-table-expand">
                                            <div class="clearfix label_div">
                                                <span class="label_title">id：</span>
                                                <span class="label_content">{{ props.row.id }}</span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">原网址：</span>
                                                <span class="label_content">{{ props.row.purl }}</span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">视频标题：</span>
                                                <span class="label_content">{{ props.row.title }}</span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">视频地址：</span>
                                                <span class="label_content">{{ props.row.url }}</span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">视频标签：</span>
                                                <span class="label_content">{{ props.row.tags }}</span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">添加时间：</span>
                                                <span class="label_content">{{ props.row.dateline }}</span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">失败原因：</span>
                                                <span class="label_content">{{ props.row.reason }}</span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">视频封面：</span>
                                                <span class="label_content">
                                                    <span v-if="!props.row.poster">暂无封面</span>
                                                    <el-button v-if="props.row.poster" slot="reference" type="text" style="padding:0;" @click="getPoster(props.row.poster)">查看封面</el-button>
                                                </span>
                                            </div>
                                            <div class="clearfix label_div">
                                                <span class="label_title">Rowkey：</span>
                                                <span class="label_content">{{ props.row.rowkey }}</span>
                                            </div>
                                        </el-form>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="purl"
                                    :show-overflow-tooltip="true"
                                    label="目标网址"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="title"
                                    :show-overflow-tooltip="true"
                                    label="标题"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="source"
                                    label="来源"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                    width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="mainType"
                                    label="分类"
                                    align="center"
                                    width="80">
                                </el-table-column>
                                <el-table-column
                                    prop="status"
                                    label="状态"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                    width="120">
                                    <template slot-scope="scope">
                                        <span slot="reference">{{ scope.row.status | statusType }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="username"
                                    label="操作人"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                    width="120">
                                </el-table-column>
                            </el-table>
                        </el-row>

                    </div>
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 15, 20, 50,100]"
                            style="float:right;"
                            :page-size="PageSize"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="封面" :visible.sync="dialogShow" size="tiny">
            <img :src="nowPoster" style="width:100%">
        </el-dialog>
    </section>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    getCategory,
    syncContent,
    getSyncContent
} from '@/api/contentManage'
import { getfileUpload } from '@/api/operationTools'

export default {
    name: 'contentSyncAdd',
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        var timeHorizon = "";
        var today = new Date();
        var oneDay = new Date(today.getTime() - 3600 * 1000 * 24 * 1);
        return {
            key: 0,
            expandAllRow: false,
            nowPoster: '',
            dialogShow: false,
            syncLoading: false,
            fileListShow: [],
            tableConfigCheck: [],
            tableConfig: [{
                    prop: "url",
                    label: "网址"
                },
                {
                    prop: "dateline",
                    label: "添加时间"
                },
                {
                    prop: "dateline",
                    label: "添加时间"
                },
                {
                    prop: "username",
                    label: "同步操作人"
                }
            ],
            statusOptions: [{
                    label: '全部',
                    value: ''
                },
                {
                    label: '待处理',
                    value: '0'
                },
                {
                    label: '爬取成功',
                    value: '1'
                },
                {
                    label: '爬取失败',
                    value: '2'
                },
                {
                    label: '处理成功',
                    value: '3'
                },
                {
                    label: '处理失败',
                    value: '4'
                }
            ],
            activeName: '1',
            isAuth: {
                addNews: false,
                syncContent: false
            },
            fileUpload: '',
            currentPage: 1,
            imageUrl: '',
            syncType: [{
                value: 'video',
                label: '视频'
            }],
            search: {
                title: '',
                startTime: '',
                endTime: '',
                status: '',
                user: '',
                timeQuantum: [oneDay, today]
            },
            form: {
                syncType: '',
                website: '',
                title: '',
                source: '',
                category: '',
                keywords: []
            },
            category: [{
                value: 'gaoxiao',
                label: '搞笑'
            }],
            tableData: [],
            startPage: 1,
            PageSize: 10,
            total: 0,
            inputVisible: false,
            inputValue: '',
            keywordsMax: 10
        }
    },
    filters: {
        statusType(val) {
            var statusArr = ['待处理', '爬取成功', '爬取失败', '处理成功', '处理失败'];
            return statusArr[val]
        }
    },
    mounted() {
        this.fileUpload = getfileUpload;
        this.PageSize = this.personalConfig.tableRowShow
        this.getAuth();
        this.getCategory();
        this.getSyncContent()
    },
    methods: {
        getAuth() { //权限控制
            let authorList = localStorage.getItem('authorList');
            if (authorList.indexOf('sync/add') > -1) {
                this.isAuth.addNews = true;
            }
            if (authorList.indexOf('sync/list') > -1) {
                this.isAuth.syncContent = true;
            }
            if (authorList.indexOf('sync/sourceVideo') > -1) {
                this.isAuth.sourceVideo = true;
            }
            if (this.isAuth.addNews) {
                this.activeName = '1';
            } else if (this.isAuth.sourceVideo) {
                this.activeName = '2';
            }

        },
        getCategory() {
            getCategory().then(res => {
                this.category = res.data;
            })
        },
        synchronize() {
            var syncParams = {
                purl: this.form.website,
                title: this.form.title,
                source: this.form.source,
                maintype: this.form.category,
                poster: this.imageUrl
            }
            for (var val in syncParams) {
                if (!syncParams[val]) {
                    this.$notify.error({
                        title: '失败',
                        message: '同步失败，请提交完整信息！'
                    });
                    return false;
                }
            }
            var keywordsStr = this.form.keywords.join(',');
            console.log(keywordsStr)
            syncParams.tags = keywordsStr;
            this.syncLoading = true;
            syncContent(syncParams).then(res => {
                if (res.code == '00001') {
                    this.$notify({
                        title: '成功',
                        message: '同步成功',
                        type: 'success'
                    });
                    this.getSyncContent()
                    this.resetForm()
                }
                this.syncLoading = false;
            })
        },
        getSyncContent() {
            var getAyncParams = {
                title: this.search.title,
                startTime: this.search.startTime == '' ? '' : this.format(this.search.startTime, 'yyyy-MM-dd HH:mm:ss'),
                endTime: this.search.endTime == '' ? '' : this.format(this.search.endTime, 'yyyy-MM-dd HH:mm:ss'),
                username: this.search.user,
                purl: '',
                status: this.search.status,
                source: '',
                startPage: this.startPage,
                PageSize: this.PageSize
            }

            getSyncContent(getAyncParams).then(res => {
                if (res.code == "00001") {
                    // 时间格式化处理
                    function dateFtt(fmt, date) {
                        var o = {
                            "M+": date.getMonth() + 1, //月份
                            "d+": date.getDate(), //日
                            "h+": date.getHours(), //小时
                            "m+": date.getMinutes(), //分
                            "s+": date.getSeconds(), //秒
                            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                            "S": date.getMilliseconds() //毫秒
                        };
                        if (/(y+)/.test(fmt))
                            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                        for (var k in o) {
                            if (new RegExp("(" + k + ")").test(fmt)) {
                                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            }
                        }
                        return fmt;
                    }
                    for (var i = 0; i < res.data.data.length; i++) {
                        var crtTime = new Date(parseInt(res.data.data[i].dateline));
                        res.data.data[i].dateline = dateFtt("yyyy-MM-dd hh:mm:ss", crtTime)
                        res.data.data[i].syncType = '视频'
                    }
                    // 对每条关键词分别做处理  !@#!@替换成,
                    res.data.data.forEach(item => {
                        item.tags = item.tags.replace(/!@#!@/g, ',')
                    })
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                } else if (res.code == "00002") {
                    this.tableData = [];
                    this.total = 0;
                }
            })
        },
        uploadSuccess(res, file) {
            this.imageUrl = res.url;
        },
        handleSizeChange(val) {
            this.PageSize = val;
            this.getSyncContent();
        },
        handleCurrentChange(val) {
            this.startPage = val;
            this.currentPage = val;
            this.getSyncContent();
        },
        tableRowClassName(obj, index) {
            if (obj.status == "未同步") {
                return 'red';
            }
        },
        handleClose(tag) {
            this.form.keywords.splice(this.form.keywords.indexOf(tag), 1);
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
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.form.keywords.push(inputValue);
            }
            this.addTag = this.form.keywords.length;
            this.inputVisible = false;
            this.inputValue = '';
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 列表查询的时间
        getTopTime() {
            if (this.search.timeQuantum.length != 0) {
                this.search.startTime = this.search.timeQuantum[0]
                this.search.endTime = this.search.timeQuantum[1]
            }
        },
        // 重置表单
        resetForm() {
            this.form.website = '';
            this.form.title = '';
            this.form.source = '';
            this.form.category = '';
            this.form.keywords = [];
            this.imageUrl = '';
        },
        tableKeyChange() {
            this.key = this.key + 1
        },
        getPoster(url) {
            this.nowPoster = url;
            this.dialogShow = true;
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.addNews .addNewsLeft {
    width: 430px;
    float: left;
}
/*.addNews .addNewsLeft .el-button{
        margin-left: 200px;
    }*/
.addNews .addNewsRight {
    margin-left: 450px;
}
.addNews .addNewsRight .addNewsRight-top {
    margin-bottom: 30px;
}
.syncContent .addNewsRight-top {
    margin-bottom: 30px;
}
.el-table .red {
    color: #333;
}
.el-pagination {
    margin: 20px 0;
}
.label_title {
    font-weight: 700;
}
</style>
