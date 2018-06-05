<template lang="html">
    <section class="auditData_DFW">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="审核时间" prop="timeQuantum" style="margin-bottom:0">
                        <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="form.timeQuantum" type="datetimerange" placeholder="选择时间范围" @change="getTopTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核人">
                        <el-select v-model="form.auditPeople" class="select-platform"
                            filterable placeholder="选择审核人">
                            <el-option
                                v-for="(item,index) in auditPeoples"
                                :key="item.value"
                                :label="item.realname"
                                :value="item.uname"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核操作">
                        <el-select v-model="form.operate" class="select-platform"
                            filterable placeholder="选择审核操作">
                            <el-option
                                v-for="(item,index) in operations"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-row>
                <el-row>
                    <el-form-item  style="margin-bottom:0">
                        <el-input v-model="form.keywords" placeholder="请输入标题关键词查询"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="form.url" placeholder="请输入文章URL"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="exportExcel">导出</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-row>
                <span class="mr-10">共：{{ auditNum_total }}</span>
                <span class="mr-10">通过：{{ auditNum_pass }}</span>
                <span class="mr-10">拒绝：{{ auditNum_refuse }}</span>
            </el-row>
            <el-row class="mt-10">
                <!--发布列表Begin-->
                <el-table :data="tableData"
                          highlight-current-row
                          v-loading="listLoading"
                          style="width: 100%;"
                          tooltip-effect="dark"
                          stripe border>
                    <el-table-column label="审核时间" width="170" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>
                                {{ parseInt(scope.row.audittime) | parseTime('{y}-{m}-{d} {h}:{i}') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="audituser" label="审核人" width="100" :show-overflow-tooltip="true">

                    </el-table-column>
                    <el-table-column label="发稿日期" width="170" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>
                                {{ parseInt(scope.row.pushtime) | parseTime('{y}-{m}-{d} {h}:{i}') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="稿件标题" min-width="220">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" class="aclick" target="_blank">{{ scope.row.newstitle }} </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operationname" label="审核操作" :show-overflow-tooltip="true">
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row class="toolbar">
                <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-sizes="[10, 15, 20, 50, 100]"
                  :page-size="pageSize"
                  :current-page="currentPage"
                  :total="total"
                  background
                  style="float:right;"
                  >
                </el-pagination>
            </el-row>
        </el-card>
    </section>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    parseTime
} from '@/utils'
import {
    getDfwLogList,
    getDfwPeople,
    getDfwAuditNum,
    exportExcalAuditDfw
} from '@/api/dataCenter'

export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        const startTime = new Date().setHours(0, 0, 0) - 3600 * 1000 * 24 * 1
        const endTime = new Date().setHours(23, 59, 59)
        return {
            pageSize: 10,
            currentPage: 1,
            total: 0,
            listLoading: false,
            tableData: [],
            auditPeoples: [],
            auditNum_total: 0,
            auditNum_pass: 0,
            auditNum_refuse: 0,
            operations: [{
                    label: '全部',
                    value: ''
                },
                {
                    label: '审核通过',
                    value: '0'
                },
                {
                    label: '审核拒绝',
                    value: '1'
                }
            ],
            form: {
                timeQuantum: [startTime, endTime],
                starttime: startTime,
                endtime: endTime,
                auditPeople: '',
                operate: "0",
                keywords: '',
                url: ''
            }
        }
    },
    mounted() {
        this.pageSize = this.personalConfig.tableRowShow
        this.getDfwPeople();
    },
    methods: {
        search() {
            this.currentPage = 1;
            this.getList()
        },
        getList() {
            let params = {
                starttime: this.form.starttime,
                endtime: this.form.endtime,
                username: this.form.auditPeople,
                status: this.form.operate,
                title: this.form.keywords,
                url: this.form.url,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            this.listLoading = true
            this.getDfwAuditNum();
            getDfwLogList(params).then(res => {
                if (res.code == "00001") {
                    this.tableData = res.data.data
                    this.total = res.data.total
                } else {
                    this.tableData = []
                    this.total = 0
                }
                this.listLoading = false
            })
        },
        // 审核人
        getDfwPeople() {
            let params = {
                starttime: this.form.starttime,
                endtime: this.form.endtime
            }
            getDfwPeople(params).then(res => {
                if (res.code == "00001") {
                    this.auditPeoples = res.data
                    this.auditPeoples.unshift({
                        uname: '',
                        realname: '全部'
                    })
                }
            })
        },
        getDfwAuditNum() {
            let params = {
                starttime: this.form.starttime,
                endtime: this.form.endtime
            }
            getDfwAuditNum(params).then(res => {
                if (res.code == "00001") {
                    this.auditNum_total = res.data.total
                    this.auditNum_pass = res.data.pass
                    this.auditNum_refuse = res.data.refuse
                }
            })
        },
        getTopTime() {
            if (this.form.timeQuantum.length != 0) {
                this.form.starttime = new Date(this.form.timeQuantum[0]).getTime()
                this.form.endtime = new Date(this.form.timeQuantum[1]).getTime()
            }
        },
        exportExcel() {
            var exportUrl = exportExcalAuditDfw;
            exportUrl += 'json={"starttime":' + (this.form.starttime ? '"' + this.form.starttime + '"' : '')
            exportUrl += ',"endtime":' + '"' + this.form.endtime + '"'
            exportUrl += ',"username":' + (this.form.auditPeople ? '"' + this.form.auditPeople + '"' + '"' : '""')
            exportUrl += ',"status":' + '"' + this.form.operate + '"' + '}'
            console.log(exportUrl)
            window.location.href = exportUrl
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
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
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    &:hover {
        color: #58B7FF;
    }
}
</style>
