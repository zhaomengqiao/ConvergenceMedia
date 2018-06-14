<template lang="html">
    <section>
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="formData">
                    <el-form-item label="">
                        <el-select v-model="formData.type" class="select-platform"
                            filterable placeholder="选择分类" >
                            <el-option
                                v-for="(item,index) in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model.trim="formData.words"
                                  placeholder="请输入关键词"
                                  :maxlength="10"
                                  @keyup.native="textIsNull"
                                  :disabled="keywordDisable"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input
                          type="textarea"
                          autosize
                          placeholder="请输入备注内容"
                          v-model="formData.comments">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchList">搜索</el-button>
                        <el-button type="success" :disabled="addStatus" @click="addWords" v-if="auth.add">新增</el-button>
                        <el-button type="success" @click="saveEdit" v-if="saveEditBtn">保存</el-button>
                    </el-form-item>
                    <el-form-item>
					<el-upload
							class="upload-demo"
                            :show-file-list='false'
							:on-success="handleAvatarSuccess"
                            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
							:action="formData.newXurl+'/'+formData.type">
							<el-button  type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="downloadTemplate"  >下载模版</el-button>
                        <el-button type="primary"  @click="exportData" >导出数据</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="tableData"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;"
                      tooltip-effect="dark"
                      stripe border>
                <el-table-column prop="username" label="用户">
                </el-table-column>
                <el-table-column prop="updatetime" label="新增时间">
                    <template slot-scope="scope">
                        <span >{{ (scope.row.createtime==''||scope.row.createtime==null)?'':format(parseInt(scope.row.createtime), 'yyyy-MM-dd HH:mm:ss') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="words" label="关键词">
                </el-table-column>
                <el-table-column prop="updateusername" label="最近修改人">
                </el-table-column>
                <el-table-column prop="status" label="启用状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status == 0? "启用" : "禁用" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="comments" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="370" fixed="right">
                    <template slot-scope="scope">
                        <el-button :type="scope.row.status == 0 ? 'danger' : 'primary'"
                                    v-if="auth.edit"
                                    size="small"
                                    @click="edit(scope.row.id,scope.row.status==0?1:0)"
                                    >{{ scope.row.status == 0 ? "禁用" : "启用" }}</el-button>
                        <el-button type="primary" size="small" @click="editComment(scope.row.id,scope.row.status,scope.row.comments,scope.row.words)" v-if="auth.edit">修改</el-button>
                        <el-button type="primary" size="small" @click="edit(scope.row.id,2)" v-if="auth.edit">删除</el-button>
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
    </section>
</template>

<script>
import {
    yzLexiconList,
    yzLexiconAdd,
    yzLexiconEdit,
    UploadXlsxUrl,
    exportExlData,
    getTemplateshow
} from '@/api/operationTools'
export default {
    data() {
        return {
            // 表单
            formData: {
                type: 'yzwb',
                words: '',
                newXurl: '',
                comments: '',
                id: '',
                status: ''
            },
            keywordDisable: false,
            saveEditBtn: false,
            typeOptions: [{
                label: '审核关键词',
                value: 'yzwb'
            }],
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
                add: false,
                edit: false
            }
        }
    },
    mounted() {
        this.formData.newXurl = UploadXlsxUrl;
        this.getAuth();
        this.getList();
    },
    methods: {
        // 权限控制
        getAuth() {
            const authList = localStorage.getItem('authorList');
            if (authList.indexOf('yzwbsensitivewords/add') != -1) {
                this.auth.add = true;
            }
            if (authList.indexOf('yzwbsensitivewords/edit') != -1) {
                this.auth.edit = true;
            }
        },
        handleAvatarSuccess(res, file) {
            this.$notify({
                title: '成功',
                message: '关键词上传成功',
                type: 'success'
            });
        },
        downloadTemplate() {
            window.location.href = getTemplateshow + '/' + this.formData.type;
        },
        exportData() {
            window.location.href = exportExlData + '/' + this.formData.type;
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
                words: this.formData.words,
                start: this.limit.page,
                limit: this.limit.pageSize
            }
            yzLexiconList(param).then((res) => {
                if (res.code == "00001") {
                    if (res.data.data.length == 0) {
                        this.$message({
                            message: '暂无关键词数据',
                            type: 'warning'
                        });
                    } else {
                        var data = res.data;
                        this.tableData = data.data;
                        this.total = data.total;
                    }
                }
                this.listLoading = false
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
        // 新增
        addWords() {
            this.listLoading = true;
            let param = {
                words: this.formData.words,
                status: 0,
                comments: this.formData.comments
            }
            yzLexiconAdd(param).then((res) => {
                if (res.code == "00001") {
                    this.formData.words = "";
                    this.formData.comments = "";
                    this.addStatus = true;
                    this.getList()
                }
                this.listLoading = false;
            })
        },
        // 禁用/启用/删除
        edit(id, type) {
            if (type == 2) {
                this.$confirm('此操作将删除该关键词, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: id,
                        status: type,
                        comments: this.formData.comments
                    }
                    yzLexiconEdit(param).then((res) => {
                        if (res.code == "00001") {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.getList()
                        }
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else {
                let param = {
                    id: id,
                    status: type,
                    comments: this.formData.comments
                }
                yzLexiconEdit(param).then((res) => {
                    if (res.code == "00001") {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.getList()
                    }
                })
            }
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

<style lang="css">
</style>
