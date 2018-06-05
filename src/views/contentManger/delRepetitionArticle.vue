<template lang="html">
    <section class="delRepetitionArticle">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="发布时间：" prop="timeQuantum" style="margin-bottom:0">
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" v-model="form.timeQuantum" type="datetimerange" placeholder="选择时间范围" @change="getTopTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="新闻分类：">
                        <el-select v-model="form.type" class="select-platform"
                            filterable placeholder="选择新闻分类">
                            <el-option
                                v-for="(item,index) in types"
                                :key="index"
                                :label="item.typeName"
                                :value="item.typeName=='全部分类'?'':item.typeName"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  style="margin-bottom:0">
                        <el-input v-model="form.keywords" placeholder="标题关键词进行查询"></el-input>
                    </el-form-item>
                    <el-form-item  style="margin-bottom:0">
                        <el-input v-model="form.url" placeholder="请输入新闻url"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-table :data="tableData"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;"
                      tooltip-effect="dark"
                      stripe border>
                <el-table-column label="新闻" min-width="220" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <a :href="scope.row.surl" class="aclick" target="_blank">{{ scope.row.stitle }} </a>
                        <p>{{ scope.row.surl }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="新闻来源" width="140" :show-overflow-tooltip="true" prop="ssource">
                </el-table-column>
                <el-table-column label="去重新闻" min-width="220" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <a :href="scope.row.durl" class="aclick" target="_blank">{{ scope.row.dtitle }} </a>
                        <p>{{ scope.row.durl }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="去重来源" width="140" :show-overflow-tooltip="true" prop="dsource">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="manage(scope.row)">管理</el-button>
                        <el-button type="success" size="small" @click="delRepetitionArticle(scope.row)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="margin-top:10px;">
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
    parseTime
} from '@/utils'
import {
    getRepetitionArticle,
    getRepetitionTypes,
    delRepetitionArticle
} from '@/api/contentManage'

export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data(){
        const startTime = parseTime(new Date(new Date().setHours(0, 0, 0)), '{y}-{m}-{d} {h}:{i}:{s}')
        const endTime = parseTime(new Date(new Date().setHours(23, 59, 59)), '{y}-{m}-{d} {h}:{i}:{s}')
        return {
            listLoading: false,
            types: [],
            form: {
                type: '',
                starttime: startTime,
                endtime: endTime,
                timeQuantum: [startTime, endTime],
                keywords: '',
                url: ''
            },
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 - 3600 * 1000 * 24 * 7;
                }
            }
        }
    },
    mounted(){
        this.getTypes()
        this.pageSize = this.personalConfig.tableRowShow
    },
    methods: {
        search(){
            this.currentPage = 1
            this.getList()
        },
        getList(){
            let params = {
                starttime: this.form.starttime,
                endtime: this.form.endtime,
                stitle: this.form.keywords,
                surl: this.form.url,
                sclassify: this.form.type,
                snewstype: '',
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            getRepetitionArticle(params).then(res => {
                if(res.code === '00001'){
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
            })
        },
        getTypes(){
            getRepetitionTypes().then(res => {
                if(res.code === '00001'){
                    this.types = res.data
                    this.types.unshift({
                        typeName: '全部分类',
                        typePy: ''
                    })
                }
            })
        },
        manage(row){
            let type = ''
            switch (row.dsource) {
                case 'news':
                    type = '文章'
                    break;
                case 'video':
                    type = '视频'
                    break;
                case 'picture':
                    type = '图集'
                    break;
                default:
                    type = '文章'
            }
            this.$router.push({
                path: '/operationTools/contentManageTools/contentManage',
                query: {
                    url: row.durl,
                    platform: '',
                    type: type
                }
            })
        },
        getTopTime() {
            if (this.form.timeQuantum.length != 0) {
                this.form.starttime = parseTime(new Date(this.form.timeQuantum[0]), '{y}-{m}-{d} {h}:{i}:{s}')
                this.form.endtime = parseTime(new Date(this.form.timeQuantum[1]), '{y}-{m}-{d} {h}:{i}:{s}')
            }
        },
        // 移除
        delRepetitionArticle(row){
            this.$confirm('是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    id: row.id,
                    isdel: 1
                }
                delRepetitionArticle(params).then(res => {
                    if(res.code === '00001'){
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getList()
                    }
                })
            }).catch(() => {

            })
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        }
    }
}
</script>

<style lang="css">
</style>
