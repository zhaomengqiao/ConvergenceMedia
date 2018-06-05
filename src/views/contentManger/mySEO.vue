<template lang="html">
    <section class="seoList">
        <el-card>
            <el-row>
                <el-form :inline="true" :model="form">
                    <el-form-item label="" style="margin-bottom:0">
                        <el-select v-model="form.people" placeholder="请选择人员" style="width:120px;">
                            <el-option
                                v-for="(item,index) in peoples"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" style="margin-bottom:0">
                        <el-select v-model="form.channel" placeholder="请选择渠道" style="width:120px;">
                            <el-option
                                v-for="(item,index) in channels"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" style="margin-bottom:0">
                        <el-select v-model="form.mtp" placeholder="请选择分类" style="width:120px;">
                            <el-option
                                v-for="(item,index) in mtps"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核时间" prop="timeQuantum" style="margin-bottom:0">
                        <el-date-picker format="yyyy-MM-dd HH:mm:ss"
                                        v-model="form.timeQuantum"
                                        type="datetimerange"
                                        placeholder="选择时间范围"
                                        @change="getTopTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="form.keywords" placeholder="请输入关键词查询"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-card>
        <el-card class="mt-10">
            <el-row>
                <!--列表Begin-->
                <el-table :data="tableData"
                          highlight-current-row
                          v-loading="listLoading"
                          style="width: 100%;"
                          tooltip-effect="dark"
                          stripe border>
                    <el-table-column label="标题" min-width="220" :show-overflow-tooltip="true" prop="title">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" class="aclick" target="_blank">{{ scope.row.title }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="来源" width="200" :show-overflow-tooltip="true" prop="src">
                    </el-table-column>
                    <el-table-column prop="pkey" label="标签" width="200" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="createdate" label="上线时间" :show-overflow-tooltip="true" width="220">
                    </el-table-column>
                    <el-table-column prop="modifyuser" label="编辑人" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            <span>{{ (scope.row.modifyuser=='' || scope.row.modifyuser==null)?scope.row.createuser:scope.row.modifyuser}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="channel" label="渠道" :show-overflow-tooltip="true" width="100">
                    </el-table-column>
                    <el-table-column label="操作" width="160" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="modify(scope.row)">编辑</el-button>
                            <el-button type="primary" size="small" @click="delSeoNews(scope.row)">删除</el-button>
                        </template>
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
    getSeoLogList,
    getSeoLogCondition,
    delSeoNews
} from '@/api/contentManage'

export default {
    name: 'mySEO',
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        const startTime = this.format((new Date().setHours(0, 0, 0) - 3600 * 1000 * 24 * 3), 'yyyy-MM-dd HH:mm:ss')
        const endTime = this.format(new Date().setHours(23, 59, 59), 'yyyy-MM-dd HH:mm:ss')
        return {
            form: {
                channel: '',
                people: '',
                mtp: '',
                timeQuantum: [startTime, endTime],
                starttime: startTime,
                endtime: endTime,
                keywords: ''
            },
            peoples: [],
            mtps: [],
            channels: [],
            tableData: [],
            listLoading: false,
            pageSize: 10,
            currentPage: 1,
            total: 0
        }
    },
    mounted() {
        this.getCreatePeople()
        this.getChannel()
        this.getMtp()
        this.pageSize = this.personalConfig.tableRowShow
    },
    methods: {
        search() {
            this.currentPage = 1
            this.getList()
        },
        getCreatePeople() {
            let params = {
                sign: 'createuser'
            }
            getSeoLogCondition(params).then(res => {
                if (res.code == "00001") {
                    var _this = this
                    res.data.forEach(item => {
                        if (item != '' && item != null) {
                            _this.peoples.push({
                                label: item,
                                value: item
                            })
                        }
                    })
                    _this.peoples.unshift({
                        label: '全部人员',
                        value: ''
                    })
                }
            })
        },
        getChannel() {
            let params = {
                sign: 'channel'
            }
            getSeoLogCondition(params).then(res => {
                if (res.code == "00001") {
                    var _this = this
                    res.data.forEach(item => {
                        if (item != '' && item != null) {
                            _this.channels.push({
                                label: item,
                                value: item
                            })
                        }
                    })
                    _this.channels.unshift({
                        label: '全部渠道',
                        value: ''
                    })
                }
            })
        },
        getMtp() {
            let params = {
                sign: 'mtp'
            }
            getSeoLogCondition(params).then(res => {
                if (res.code == "00001") {
                    var _this = this
                    res.data.forEach(item => {
                        if (item != '' && item != null) {
                            _this.mtps.push({
                                label: item,
                                value: item
                            })
                        }
                    })
                    _this.mtps.unshift({
                        label: '全部分类',
                        value: ''
                    })
                }
            })
        },
        getList() {
            let params = {
                startime: this.form.starttime,
                endtime: this.form.endtime,
                mtp: this.form.mtp,
                title: this.form.keywords,
                channel: this.form.channel,
                username: this.form.people,
                page: this.currentPage,
                pagesize: this.pageSize
            }
            this.listLoading = true
            getSeoLogList(params).then(res => {
                if (res.code == "00001") {
                    this.tableData = res.data.data
                    this.total = res.data.count
                }
                this.listLoading = false
            })
        },
        // 编辑
        modify(data) {
            this.$router.push({
                path: '/contentManage/editContent/addSEO',
                query: {
                    rowkey: data.rowkey,
                    idx: data.idx
                }
            });
        },
        getTopTime() {
            if (this.form.timeQuantum.length != 0) {
                this.form.starttime = this.format(new Date(this.form.timeQuantum[0]).getTime(), 'yyyy-MM-dd HH:mm:ss')
                this.form.endtime = this.format(new Date(this.form.timeQuantum[1]).getTime(), 'yyyy-MM-dd HH:mm:ss')
            }
        },
        // 删除
        delSeoNews(row) {
            let params = {
                idx: row.idx,
                rowkey: row.rowkey
            }
            delSeoNews(params).then(res => {
                if (res.code == "00001") {
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search()
                }
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
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
