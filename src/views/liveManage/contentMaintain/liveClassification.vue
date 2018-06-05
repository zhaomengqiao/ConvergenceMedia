<template lang="html">
    <div>
        <el-col :span="24" class="">
            <div class="content-black-tool-top">
                <el-form :inline="true">
                    <el-row>
                        <el-form-item label="选择操作平台：">
                            <el-select v-model="platformValue" style="width: 180px;" @change="changePlatform"
                                filterable placeholder="支持中文/拼音搜索" >
                                <el-option
                                    v-for="(item,index) in platform"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类名称：">
                            <el-input class="urlId-input" v-model.trim="temp.title" placeholder="分类名称"></el-input>
                        </el-form-item>
                        <el-form-item label="排序：">
                            <el-input-number v-model="temp.sort"  :min="1"></el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveClass">{{ isEdit ? "保存" : "新增" }}</el-button>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="ICON上传：">
                            <el-upload
                                class="icon-uploader"
                                :action="fileUpload"
                                accept='.png'
                                :show-file-list="false"
                                :on-success="handleSuccess">
                                <img v-if="temp.icon.length!=0" :src="temp.icon[0]" class="icon-upload">
                                <i v-else class="el-icon-plus icon-uploader-icon"></i>
                                </el-upload>
                       </el-form-item>
                       <el-radio-group v-model="temp.is_test" class="el-radio-style" @change="changeType">
                           <el-radio :label="0">正式</el-radio>
                           <el-radio :label="1">测试</el-radio>
                       </el-radio-group>
                    </el-row>
                </el-form>
            </div>
        </el-col>
        <el-table :data="tableData"
                    class="roomList"
                    highlight-current-row
                    tooltip-effect="dark"
                    stripe
                    border
                    v-loading="listLoading"
                    style="width: 100%">
            <el-table-column label="ICON" width="80">
                <template slot-scope="scope">
                    <img :src="scope.row.icon" alt="" style="width:36px;height:36px;margin:4px 0;">
                </template>
            </el-table-column>
            <el-table-column label="分类名称" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column label="分类ID" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="排序" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.sort }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否测试" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.is_test==1?'是':'否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="最近编辑时间">
                <template slot-scope="scope"><span>{{ format(scope.row.update_time.time, 'yyyy-MM-dd HH:mm:ss') }}</span></template>
            </el-table-column>
            <!-- <el-table-column label="首页显示" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.sort }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" width="370" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button :type="scope.row.is_close == 0 ? 'danger' : 'primary'"
                                size="small"
                                @click="forbidden(scope.$index, scope.row)"
                                >{{ scope.row.is_close == 0 ? "禁用" : "启用" }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <div class="block">
            <el-pagination
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total,sizes, prev, pager, next,jumper"
              :page-sizes="[10,20,30]"
              :current-page="paginationParams.page"
              :page-size="paginationParams.pagesize"
              :total="paginationParams.total"
              style="float:right;"
              >
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
import {
    getfileUpload
} from '@/api/operationTools'
import {
    addClassify,
    getLivePlatform,
    getLiveClassList,
    forbiddenLiveClass,
    editLiveClass
} from '@/api/liveManage';

export default {
    data() {
        return {
            listLoading: false,
            platform: [],
            searchTypeList: '',
            platformValue: '',
            temp: {
                title: '',
                sort: '',
                is_test: 1,
                icon: []
            },
            paginationParams: {
                page: 1,
                pageSize: 9999,
                total: 0
            },
            tableData: [],
            showData: [],
            isEdit: false,
            fileUpload: ''
        }
    },
    mounted() {
        this.fileUpload = getfileUpload;
        this.getLivePlatform();
    },
    methods: {
        //直播平台获取
        getLivePlatform() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'open/liveroom'
            }
            getLivePlatform(params).then(res => {
                this.platform = res.data;
                // res.data.forEach(function(item){
                //     item.value = item.value.split("-")[0];
                // })
                this.platformValue = res.data[0].value;
                this.getLiveClassList();
                // this.getLiveClassList();
            });
        },
        //更换平台
        changePlatform() {
            this.getLiveClassList();
            this.resetForm();
        },
        changeType() {
            this.getLiveClassList();
        },
        //保存
        saveClass() {
            if (this.temp.title == "") {
                this.$message.error('分类名称不能为空！');
                return false
            }
            if (this.temp.icon == "") {
                this.$message.error('ICON不能为空！');
                return false
            }
            if (!this.isEdit) {
                var params = {
                    title: this.temp.title,
                    app_id: this.platformValue.split("-")[0],
                    is_test: this.temp.is_test,
                    icon: this.temp.icon
                }
                //新增
                this.listLoading = true
                addClassify(params).then(res => {
                    if (res.code == "00001") {
                        this.getLiveClassList();
                        this.$notify({
                            title: '成功',
                            message: msg,
                            type: 'success'
                        });
                        this.resetForm();
                        this.isEdit = false
                    }
                    this.listLoading = false
                })
            } else {
                //编辑
                this.listLoading = true
                editLiveClass(this.temp).then(res => {
                    if (res.code == "00001") {
                        this.getLiveClassList();
                        this.$notify({
                            title: '成功',
                            message: msg,
                            type: 'success'
                        });
                        this.resetForm();
                        this.isEdit = false
                        this.listLoading = false
                    }
                })
            }
        },
        //获取列表
        getLiveClassList() {
            var plat = this.platformValue.split("-")[0]
            let params = {
                app_id: plat,
                is_test: this.temp.is_test
            }
            this.listLoading = true;
            getLiveClassList(params).then(res => {
                let msg = res.data.ret;
                if (res.code == "00001") {
                    let data = res.data.data;
                    this.tableData = data;
                    this.paginationParams.total = data.length;
                    this.showData = this.tableData.slice(0, this.paginationParams.pageSize);

                }
                this.listLoading = false;
            });
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
        //编辑
        edit(row) {
            //this.temp = Object.assign({}, row);
            this.temp = {
                title: row.title,
                sort: row.sort,
                is_test: row.is_test,
                icon: [row.icon],
                room_num: '',
                app_id: row.app_id,
                id: row.id,
                oldicon: row.icon
            }
            this.isEdit = true;
        },
        //禁用
        forbidden(index, row) {
            let is_close;
            switch (row.is_close) {
                case 0:
                    is_close = 1;
                    break;
                case 1:
                    is_close = 0;
                    break;
            }
            let params = {
                id: row.id,
                is_close: is_close
            }
            this.listLoading = true
            forbiddenLiveClass(params).then(res => {
                var msg = res.ret;
                if (res.code == "00001") {
                    this.getLiveClassList();
                    this.$notify({
                        title: '成功',
                        message: msg,
                        type: 'success'
                    });
                }
                this.listLoading = false
            });
        },
        //重置
        resetForm() {
            this.temp = {
                title: '',
                sort: 1,
                is_test: 1,
                icon: []
            }
            this.isEdit = false;
        },
        handleCurrentChange(val) {
            this.paginationParams.page = val;
            var end = this.paginationParams.page * this.paginationParams.pageSize
            var start = end - this.paginationParams.pageSize
            this.showData = this.tableData.slice(start, end);
            console.log(this.showData)
        },
        handleSizeChange(val) {
            this.paginationParams.pageSize = val;
            var end = this.paginationParams.page * this.paginationParams.pageSize
            var start = end - this.paginationParams.pageSize
            this.showData = this.tableData.slice(start, end);
        },
        // 上传图片成功
        handleSuccess(res, file) {
            this.temp.icon = [];
            this.temp.icon.push(res.url)
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
/*内容加黑工具*/
.content-black-tool .urlId-input {
    display: inline-block;
    width: 300px;
    margin-bottom: 20px;
}
</style>
