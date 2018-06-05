<template>
<div v-loading="listLoading">
    <el-card>
        <el-form label-position="left" :model="search" ref="blackList">
            <el-row>
                <el-form-item class="clearfix">
                    <div class="pull-left">
                        <el-select style="width: 300px;" v-if='isAuth.logSystem' v-model="search.username" multiple filterable remote placeholder="请输入用户" :remote-method="remoteMethod" :loading="loading">
                            <el-option v-for="(item,index) in userNameList" :key="index" :label="item.uname" :value="item.uname">
                            </el-option>
                        </el-select>
                        <el-date-picker @change="setStartEnd" :picker-options="pickerOptions" v-model="search.dateTimer" type="datetimerange" placeholder="选择时间范围">
                        </el-date-picker>
                        <el-select v-model="search.logtype" style="width: 200px;" filterable>
                            <el-option v-for="(item,index) in logType" :key="index" :label="item.mean" :value="item.logtype"></el-option>
                        </el-select>
                    </div>
                    <el-radio-group class="pull-right" v-model="search.table" @change="changeSystem">
                        <el-radio-button label="old">V3</el-radio-button>
                        <el-radio-button label="new">V4</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-row>
            <el-form-item style="margin-bottom:0px;">
                <el-row>
                    <el-input v-model="search.source" placeholder="文章来源" style="width: 100px;"></el-input>
                    <el-input v-model="search.title" placeholder="文章标题" style="width: 200px;"></el-input>
                    <el-input v-model="search.urlid" placeholder="文章URL" style="width: 200px;"></el-input>
                    <el-button type="primary" icon="search" @click="queryOperNewsList">搜索</el-button>
                    <el-button type="primary" @click="exportExcel" v-if="exportExcelAuth">导出</el-button>

                </el-row>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card class="mt-10">
        <el-table ref="singleTable" :data="tableData" stripe border highlight-current-row width="100%">
            <el-table-column prop="username" label="日志帐号" width="120"></el-table-column>
            <el-table-column prop="dateline" label="日志时间" width="170">
                <template slot-scope="scope">
					{{ scope.row.dateline | parseTime }}
				</template>
            </el-table-column>
            <el-table-column prop="newtitle" label="内容标题" width="270" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <a :href="scope.row.url" target="_blank">{{ scope.row.newtitle }}</a>
                </template>
            </el-table-column>
            <el-table-column prop="newsrc" label="内容来源" width="120"></el-table-column>
            <el-table-column prop="newstype" label="内容类型" width="180"></el-table-column>
            <el-table-column prop="mean" label="日志内容" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.mean? scope.row.mean : scope.row.logtype }}
                </template>
            </el-table-column>
            <el-table-column prop="mean" label="备注">
                <template slot-scope="scope">
					<span>{{ scope.row.fwords }}</span>
				</template>
            </el-table-column>
        </el-table>

        <el-pagination background @current-change="handlePageChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" :page-size="pageSize" :current-page="page" :page-sizes="[10, 15, 20, 50,100]" style="float:right;" :total="total">
        </el-pagination>
    </el-card>
    <el-dialog v-model="dialogTableVisible" :close-on-click-modal="false">
        <span slot="title" class="dialog-title" style='width: 80%;'>
    		<span style='font-size: 20px;'>编辑 </span> (2017)
        </span>
        <el-table :data="gridData">
            <el-table-column property="date" label="字段名" width="20%"></el-table-column>
            <el-table-column property="name" label="原内容" width="40%"></el-table-column>
            <el-table-column property="address" label="新内容" width="40%"></el-table-column>
        </el-table>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible2" :close-on-click-modal="false">
        <span slot="title" class="dialog-title" style='width: 80%;'>
    		<span style='font-size: 20px;'>置顶</span> (2017)
        </span>
        <el-table :data="gridData">
            <el-table-column property="date" label="字段名" width="20%"></el-table-column>
            <el-table-column property="name" label="原内容" width="40%"></el-table-column>
            <el-table-column property="address" label="新内容" width="40%"></el-table-column>
        </el-table>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible3" :close-on-click-modal="false">
        <span slot="title" class="dialog-title" style='width: 80%;'>
    		<span style='font-size: 20px;'>审核通过</span> (2017)
        </span>
        <el-table :data="gridData">
            <el-table-column property="date" label="字段名" width="20%"></el-table-column>
            <el-table-column property="name" label="原内容" width="40%"></el-table-column>
            <el-table-column property="address" label="新内容" width="40%">
            </el-table-column>
        </el-table>
    </el-dialog>
</div>
</template>
<script>
import {
    mapGetters
} from 'vuex';
import {
    parseTime,
} from '@/utils'
import {
    exportContentExcel,
    getContentLogByParameter,
    getUserByParameter,
    getContentLogType
} from '@/api/systemTools';
export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    filters: {
        formatTimestamp: function(value) {
            if (!value) return ''
            return util.formatDate.timestamp(value);
        }
    },
    data() {
        return {
            pickerOptions: {
                shortcuts: []
            },
            adminAuth: false,
            exportExcelAuth: false,
            listLoading: false,
            loading: false,
            total: 0,
            isAuth: {
                logSystem: false,
            },
            search: {
                dateTimer: [null, null],
                username: [],
                logtype: '9999',
                source: '',
                contenttype: '4',
                urlid: '',
                title: '',
                table: 'new'
            },
            dialogTableVisible: false,
            dialogTableVisible2: false,
            dialogTableVisible3: false,
            gridData: [],
            logType: [],
            page: 1,
            pageSize: 10,
            tableData: [],
            userNameList: []
        }
    },
    created() {
        this.getAuth();
        this.getContentLogType();
        // 时间选择默认值（3天）
        var today = new Date()
        var threeDay = new Date(today.getTime() - 3 * 1000 * 60 * 60 * 24)
        this.search.dateTimer[1] = today
        this.search.dateTimer[0] = threeDay;
    },
    mounted() {
        this.pageSize = this.personalConfig.tableRowShow
        const authListStr = localStorage.getItem('authorList');
        if (authListStr.indexOf('api/batchaddkey/exportContentOprationExcelData') != -1) {
            this.exportExcelAuth = true;
        }
    },
    methods: {
        setStartEnd(val) {
            let time = this.search.dateTimer[1];
            if (time.getHours() < 1) {
                time.setHours(23, 59, 59);
                this.search.dateTimer.splice(1, 1, time);
            }
            let starttime = this.search.dateTimer[0].getTime();
            let endtime = this.search.dateTimer[1].getTime();
            let difftime = parseInt((endtime - starttime) / (1000 * 60 * 60 * 24));
            // 非管理员只能查询7天内的
            if (difftime > 7 && !this.adminAuth) {
                this.$message({
                    message: '选择时间范围不能大于7天',
                    type: 'warning'
                });
                this.search.dateTimer = [];
                return
            } else {
                this.search.starttime = starttime;
                this.search.endtime = endtime;
            }
        },
        getAuth() {
            let authorList = localStorage.getItem('authorList');
            if (authorList.indexOf('contentOpLog/getUserByParameter') > -1) {
                this.isAuth.logSystem = true;
            }
            var _this = this;
            if (authorList.indexOf('contentOpLog/admin') != -1) {
                this.adminAuth = true;
                this.pickerOptions.shortcuts.push({
                    text: '发稿轨迹',
                    onClick(picker) {
                        const end = new Date();
                        let start;
                        if (_this.search.urlid != '') {
                            if (isNaN(_this.search.urlid)) {
                                const nowYear = new Date().getFullYear().toString().substr(0, 2)
                                var arr = _this.search.urlid.split('/');
                                const urlTime = (nowYear + arr[arr.length - 1].split('.')[0]).substr(0, 14)
                                const year = urlTime.substr(0, 4)
                                const month = urlTime.substr(4, 2)
                                const day = urlTime.substr(6, 2)
                                const hour = urlTime.substr(8, 2)
                                const minute = urlTime.substr(10, 2)
                                const second = urlTime.substr(12, 2)
                                start = new Date(year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second);
                            } else {
                                start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            }
                        } else {
                            start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        }
                        picker.$emit('pick', [start, end]);
                    }
                })

            }
        },
        getContentLogType() {
            getContentLogType('').then((res) => {
                if (res.code == '00001') {
                    this.logType = res.data;
                    this.logType.unshift({
                        "logtype": "9999",
                        "mean": "全部"
                    })
                }
            });
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                let para = {
                    uname: query.toLowerCase()
                };
                getUserByParameter(para).then((res) => {
                    if (res.code == '00001') {
                        this.userNameList = res.data;
                    } else {
                        this.userNameList = []
                    }
                    this.loading = false;
                });

            } else {
                this.userNameList = [];
            }
        },
        handlePageChange(val) {
            this.page = val;
            this.queryOperNewsList();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.queryOperNewsList();
        },
        dialogExamineShow(n) {
            if (n == 1) {
                this.dialogTableVisible = true;
            } else if (n == 2) {
                this.dialogTableVisible2 = true;
            } else if (n == 3) {
                this.dialogTableVisible3 = true;
            }
        },
        changeSystem() {
            this.queryOperNewsList();
        },
        queryOperNewsList() {
            this.listLoading = true;
            if (this.search.dateTimer[0] == null && this.search.dateTimer[1] == null) {
                let date = new Date(); //获取当前时间
                let curDate = new Date();
                date.setDate(date.getDate() - 7);
                this.search.dateTimer.splice(0, 1, date);
                this.search.dateTimer.splice(1, 1, curDate);
            }
            let username = '';
            if (this.isAuth.logSystem) {
                username = this.search.username.join(',');
            } else {
                var user = localStorage.getItem('user'); //获取用户名
                user = JSON.parse(user);
                username = user.username;
            }
            let para = {
                "username": username,
                "page": this.page,
                "pageSize": this.pageSize,
                "logtype": this.search.logtype,
                "starttime": this.search.dateTimer[0].getTime(),
                "endtime": this.search.dateTimer[1].getTime(),
                "urlid": this.search.urlid,
                "contenttype": this.search.contenttype,
                "source": this.search.source,
                "title": this.search.title,
                "table": this.search.table
            };
            getContentLogByParameter(para).then((res) => {
                if (res.code === '00001') {
                    this.tableData = res.data;
                    this.total = res.totalSize;
                }
                this.listLoading = false;
            })
        },
        exportExcel() {
            var exportUrl = exportContentExcel;
            exportUrl += 'json={"username":' + (this.search.username ? '"' + this.search.username + '"' : '')
            exportUrl += ',"logtype":' + (this.search.logtype ? '"' + this.search.logtype + '"' : '""')
            exportUrl += ',"starttime":' + '"' + this.search.dateTimer[0].getTime() + '"'
            exportUrl += ',"endtime":' + '"' + this.search.dateTimer[1].getTime() + '"'
            exportUrl += ',"urlid":' + (this.search.urlid ? '"' + this.search.urlid + '"' + '"' : '""')
            exportUrl += ',"source":' + (this.search.source ? '"' + this.search.source : '""')
            exportUrl += ',"title":' + (this.search.title ? '"' + this.search.title + '"' : '""')
            exportUrl += ',"table":' + '"' + this.search.table + '"' + '}'
            console.log(exportUrl)
            window.location.href = exportUrl
        }
    }
}
</script>
