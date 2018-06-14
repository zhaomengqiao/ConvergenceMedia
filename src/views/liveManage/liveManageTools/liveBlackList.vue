<template>
<div :v-loading="listLoading">
    <el-form label-position="left" :model="blackList" ref="blackList">
        <el-col :span="8">
            <el-form-item>
                <el-input placeholder="请输入用户ID" v-model.number="blackList.ttaccid">
                    <el-select placeholder="请选择直播平台" class="select-smallW" style="width:110px;" v-model="blackList.livePlatform" slot="prepend">
                        <el-option v-for="(item,index) in livePlatform" :key="item.index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button slot="append" type="primary" @click.native.prevent="queryBlackList" icon="el-icon-search"></el-button>
                </el-input>
            </el-form-item>
        </el-col>
    </el-form>
    <el-table ref="singleTable" :data="tableData" stripe border highlight-current-row width="100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="accid" label="用户ID"></el-table-column>
        <el-table-column prop="created_at" label="加黑时间">
            <template slot-scope="scope">
					{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
				</template>
        </el-table-column>
        <el-table-column prop="expire_at" label="解禁时间">
            <template slot-scope="scope">
					{{ scope.row.expire_at | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
				</template>
        </el-table-column>
        <el-table-column prop="operate" label="操作">
            <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="primary" size="small">解禁该用户</el-button>
                </template>
            <!-- <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, tableData4)"
                      type="text"
                      size="small">
                      移除
                    </el-button>
                </template> -->
        </el-table-column>
    </el-table>
    <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" :page-size="blackList.pageSize" :current-page="blackList.page" :page-sizes="[10, 15, 20, 50,100]" style="float:right;" :total="total">
    </el-pagination>
</div>
</template>
<script>
import {
    queryBlackList,
    removeBlack,
    getLivePlatform
} from '@/api/liveManage';
export default {
    data() {
        return {
            listLoading: false,
            total: 0,
            blackList: {
                ttaccid: '',
                app_id: '',
                livePlatform: '',
                page: 1,
                pageSize: 10
            },
            livePlatform: [],
            tableData: []
        }
    },
    methods: {
        deleteRow(index, rows) {
            let para = {
                ttaccid: rows[index].accid,
                app_id: rows[index].app_id
            }
            removeBlack(para).then((res) => {
                if (res.code === '00001') {
                    if (res.data.stat === 0) {
                        this.$message.success(res.ret);
                        rows.splice(index, 1);
                    }
                } else {
                    this.$message.warning(res.ret);
                }
            })
        },
        getLivePlatform() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'open/liveroom'
            }
            getLivePlatform(params).then(res => {
                this.livePlatform = res.data;
                this.blackList.livePlatform = res.data[0].value;
                // this.queryBlackList();
            });
        },
        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },
        handlePageChange(val) {
            this.blackList.page = val;
            this.queryBlackList();
        },
        handleSizeChange(val) {
            this.blackList.pageSize = val;
            this.queryBlackList();
        },
        queryBlackList() {
            this.listLoading = true;
            if(this.blackList.ttaccid === ''){
                this.$message({
                    message: '请输入用户ID',
                    type: 'warning',
                    duration: 2 * 1000
                })
                return
            }
            this.blackList.app_id = this.blackList.livePlatform.split('-')[0];
            let _this = this;
            queryBlackList(_this.blackList).then((res) => {
                if (res.code === '00001') {
                    _this.tableData = res.data.data;
                    _this.total = res.totalSize;
                }
                this.listLoading = false;
            })
        }
    },
    mounted() {
        this.getLivePlatform();
    }
}
</script>
