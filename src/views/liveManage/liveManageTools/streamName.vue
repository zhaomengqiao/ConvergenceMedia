<template lang="html">
    <section>
        <!--工具条-->
        <el-card style="padding-bottom: 0px;">
            <el-form :inline="true" :model="formData" @submit.native.prevent>
                <el-form-item style="margin-bottom:0">
                    <el-input type="primary" v-model.trim="formData.livecode" placeholder="请输入流名"></el-input>
                </el-form-item>
                <!-- <el-form-item label="状态" style="margin-bottom:0">
                    <el-select v-model="formData.isused" class="select-platform" placeholder="状态" @change="search">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="推流中" :value="1"></el-option>
                        <el-option label="不推流" :value="0"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click="addStreamName">新增</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!--列表-->
        <el-card style="margin-top:10px;">
            <!--发布列表Begin-->
            <el-table :data="tableData"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;"
                      tooltip-effect="dark"
                      stripe border>
                <el-table-column prop="username" label="最新修改人" width="140">
                </el-table-column>
                <el-table-column prop="livecode" label="流名">
                </el-table-column>
                <el-table-column label="最新修改时间" width="170">
                    <template slot-scope="scope">
                        <span>{{ format(parseInt(scope.row.dateline), 'yyyy-MM-dd HH:mm:ss') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="使用状态" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="Number(scope.row.isused)?'success':'danger'">
                            {{ Number(scope.row.isused)?'推流中':'不推流' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button type="primary" size="small" @click="changeStreamStatus(scope.row,'推流')">推流</el-button> -->
                        <el-button type="primary" size="small" @click="changeStreamStatus(scope.row,'取消')">取消</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--发布列表End-->
            <!--分页-->
            <!-- <div class="block">
                <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  layout="total,sizes, prev, pager, next,jumper"
                  :page-sizes='[10,15,20,50,100]'
                  :current-page="formData.page"
                  :page-size="formData.pagesize"
                  :total="total"
                  style="float:right;"
                  >
                </el-pagination>
            </div> -->
        </el-card>
    </section>
</template>

<script>
import {
    streamNameList,
    changeStreamStatus,
    addStreamName
} from '@/api/liveManage';
export default {
    data() {
        return {
            formData: {
                livecode: '',
                isused: ''
            },
            tableData: [],
            total: 0,
            listLoading: false
        }
    },
    mounted() {
        this.streamNameList();
    },
    methods: {
        streamNameList() {
            this.listLoading = true
            streamNameList(this.formData).then(res => {
                if (res.code == "00001") {
                    if (res.data) {
                        this.tableData = res.data.data;
                    } else {
                        this.tableData = []
                    }
                }
                this.listLoading = false
            })
        },
        changeStreamStatus(row, type) {
            let isused;
            switch (type) {
                case '推流':
                    isused = 1
                    break;
                case '取消':
                    isused = 0
                    break;
            }
            let params = {
                livecode: row.livecode,
                isused: isused
            }
            this.listLoading = true
            changeStreamStatus(params).then(res => {
                if (res.code == "00001") {
                    this.search();
                }
                this.listLoading = false
            })
        },
        //分页操作
        handleSizeChange(val) {
            this.formData.pagesize = val;
            this.streamNameList();
        },
        handleCurrentChange(val) {
            this.formData.page = val;
            this.streamNameList();
        },
        search() {
            this.formData.page = 1;
            this.streamNameList();
        },
        addStreamName() {
            if (this.formData.livecode == '') {
                this.$message({
                    type: 'warning',
                    message: '流名不能为空!'
                });
                return false
            }
            let params = {
                livecode: this.formData.livecode,
                isused: 1
            }
            this.listLoading = true
            addStreamName(params).then(res => {
                if (res.code == "00001") {
                    this.formData.livecode = ''
                    this.search();
                }
                this.listLoading = false
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
        }
    }
}
</script>

<style lang="scss">
</style>
