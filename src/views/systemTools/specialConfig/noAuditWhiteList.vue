<template>
<div class="auth-config">
    <div class="add-auth" v-if='isAuth.authWhiteUpdate||isAuth.authWhiteAdd'>
        <el-row :gutter='20'>
            <el-form :rules='addRule' ref='authWhite' :model='add'>
                <el-col class="el-col-auto" :span="6">
                    <el-form-item label='新增用户：' prop='username' label-width="100px">
                        <el-input v-model='add.username' placeholder='请输入账号'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto" :span="6">
                    <el-form-item label='类型：' prop='passreview' label-width="100px">
                        <el-select v-model='add.passreview' placeholder='请选择类型'>
                            <el-option label='优审' value='0'></el-option>
                            <el-option label='免审' value='1'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto" :span="8">
                    <el-form-item label='备注' prop='notes' label-width="300px">
                        <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="add.notes">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto" style="padding-right:30px;" :span="4">
                    <el-button type='primary' class='add-submit' v-if='add.id==""&&isAuth.authWhiteAdd' @click='authWhiteAdd()'>添加</el-button>
                    <el-button type='primary' class='add-submit' v-if='add.id!=""' @click='authWhiteUpdate()'>编辑</el-button>
                </el-col>
            </el-form>
        </el-row>
    </div>
    <div class="search-auth">
        <el-row :gutter='20'>
            <el-form ref='searchAuth' :model='search'>
                <el-col class="el-col-auto">
                    <el-form-item label='查询条件：' prop='passreview' label-width="100px">
                        <el-select v-model='search.passreview' placeholder='请选择类型'>
                            <template v-for='item in options'>
                      <el-option :label='item.label'
                      	:value='item.value'></el-option>
                    </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto">
                    <el-form-item label='用户名' label-width="120px">
                        <el-input v-model='search.cmsname' placeholder='请输入用户名'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto">
                    <el-button type='primary' @click='authWhiteSearch()'>搜索</el-button>
                </el-col>
            </el-form>
        </el-row>
    </div>
    <el-table :data="tableData" border style='margin-top:20px;'>
        <el-table-column prop="cmsname" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="passreview" label="类型" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.passreview==0">
                		 优审
                </span>
                <span v-if="scope.row.passreview==1">
                		 免审
                </span>
              </template>
        </el-table-column>
        <el-table-column prop="revinadvance" label="添加时间" align="center">
            <template slot-scope="scope">
                <span >
                    {{ scope.row.revinadvance | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                </span>
              </template>
        </el-table-column>

        <el-table-column prop="comments" label="备注" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button size='small' v-if='isAuth.authWhiteUpdate' type='primary' @click='authUpdate(scope.row)'>编辑</el-button>
                <el-button size='small' v-if='isAuth.authWhiteDel'  type='danger' @click='authDelete(scope.row)'>删除</el-button>
              </template>
        </el-table-column>
    </el-table>
    <el-row>
        <el-pagination @current-change="paginationChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next,jumper" :page-sizes="[10,15,20,50,100]" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
        </el-pagination>
    </el-row>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    authWhiteAdd,
    authWhiteUpdate,
    authWhiteList,
    checkUser,
    authWhiteDelete
} from '@/api/systemTools'
export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        let scope = this;
        let checkUserExist = (rule, value, callback) => {
            if (scope.add.username === '' || scope.add.username === null) {
                callback(new Error('用户名不能为空'))
                return
            }
            checkUser(scope.add.username).then(function(res) {
                if (!res.state) {
                    callback(new Error('用户不存在'))
                } else {
                    callback()
                }
            })
        }
        return {
            total: 0,
            pageSize: 10,
            page: 1,
            isAuth: {
                authWhiteDel: false,
                authWhiteAdd: false,
                authWhiteUpdate: false,
            },
            typeForDel: '',
            add: {
                id: '',
                username: '',
                notes: '',
                passreview: '0'
            },
            search: {
                passreview: '-1',
                cmsname: ''
            },
            addRule: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }, {
                    trigger: 'blur',
                    validator: checkUserExist
                }]
            },
            options: [{
                value: '-1',
                label: '全部'
            }, {
                value: '0',
                label: '优审'
            }, {
                value: '1',
                label: '免审'
            }],
            tableData: []
        }
    },
    mounted() {
        this.pageSize = this.personalConfig.tableRowShow
        this.getAuth();
        this.authWhiteSearch();
    },
    methods: {
        getAuth() { //权限控制
            let authorList = localStorage.getItem('authorList');
            if (authorList.indexOf('userauditmanager/add') > -1) {
                this.isAuth.authWhiteAdd = true;
            }
            if (authorList.indexOf('userauditmanager/update') > -1) {
                this.isAuth.authWhiteUpdate = true;
            }
            if (authorList.indexOf('userauditmanager/del') > -1) {
                this.isAuth.authWhiteDel = true;
            }

        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.authWhiteSearch();
        },
        paginationChange(page) {
            let scope = this
            scope.page = page
            scope.authWhiteSearch()
        },
        authUpdate(row) {
            let scope = this
            scope.add = {
                id: row.id,
                username: row.cmsname,
                notes: row.comments,
                passreview: row.passreview
            }
        },
        authWhiteUpdate() {
            let scope = this;
            scope.$refs['authWhite'].validate(validate => {
                if (validate) {
                    let timetmp = new Date();
                    authWhiteUpdate({
                        type: 'userauditmanager',
                        id: scope.add.id,
                        cmsname: scope.add.username,
                        passreview: scope.add.passreview,
                        revinadvance: timetmp.getTime(),
                        comments: scope.add.notes
                    }).then(res => {
                        if (res.code === '00001') {
                            this.authWhiteSearch();
                            scope.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            scope.$refs['authWhite'].resetFields();
                        } else {
                            scope.$message.error(res.ret)
                        }
                    })
                }
            })
        },
        authWhiteAdd() {
            let scope = this;
            scope.$refs['authWhite'].validate(validate => {
                if (validate) {
                    let timetmp = new Date();
                    authWhiteAdd({
                        type: 'userauditmanager',
                        cmsname: scope.add.username,
                        passreview: scope.add.passreview,
                        revinadvance: timetmp.getTime(),
                        comments: scope.add.notes
                    }).then(res => {
                        if (res.code === '00001') {
                            this.authWhiteSearch();
                            scope.$message({
                                message: '保存成功',
                                type: 'success'
                            })
                            scope.$refs['authWhite'].resetFields();
                        } else {
                            scope.$message.error(res.ret)
                        }
                    })
                }
            })
        },
        authDelete(item) {
            let scope = this
            let type = scope.typeForDel
            this.$confirm('确认提交吗?', '提示', {
                type: 'warning'
            }).then(() => {
                authWhiteDelete({
                    type: 'userauditmanager',
                    id: item.id,
                }).then(res => {
                    if (res.code === '00001') {
                        scope.authWhiteSearch();
                        scope.$message({
                            type: 'success',
                            message: "删除成功"
                        })
                    }
                })
            });
        },
        authWhiteSearch() {
            let scope = this;
            authWhiteList({
                type: 'userauditmanager',
                cmsname: scope.search.cmsname,
                passreview: scope.search.passreview,
                start: scope.page,
                limit: scope.pageSize
            }).then(res => {
                if (res.code === '00001' && res.data != null) {
                    scope.tableData = res.data.data;
                    scope.total = res.data.total;
                } else {
                    scope.tableData = '';
                    scope.total = 0;
                }
            })
        },
        strInCol(item, property) {
            if (item[property] === undefined || item[property] === null) {
                return '-'
            }
            let scope = this
            let rule = {
                validTime: scope.formatDate
            }
            if (rule[property] === undefined) {
                return item[property]
            } else {
                return rule[property](item[property])
            }
        }
    }
}
</script>

<style scoped="scoped">
.add-auth,
.search-auth {
    border-bottom: 1px solid #d9d9d9;
}

.search-auth {
    padding-top: 20px;
}

div.el-input,
div.el-date-editor.el-input {
    width: 180px;
}

.el-input.el-input--small {
    width: 100%;
}

.add-submit {
    margin-left: 20px;
}

.page {
    float: right;
    margin-top: 20px;
}

.danger {
    color: #ff4949;
}

.normal {
    color: #48576a;
}

.warning {
    color: #f7ba2a;
}
</style>
