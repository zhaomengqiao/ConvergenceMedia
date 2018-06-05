<template>
<div class="auth-config">
    <el-card class="add-auth">
        <el-row :gutter='20'>
            <el-form :rules='addRule' ref='addAuth' :model='add' :inline="true">
                <el-form-item label='权限' prop='auth' label-width="70px">
                    <el-select v-model='add.auth' placeholder='请选择权限'>
                        <template v-for='item in options.add'>
                  <el-option :label='item.label' :value='item.value'></el-option>
                </template>
                    </el-select>
                </el-form-item>
                <el-form-item label='用户名' prop='username' label-width="70px">
                    <el-input v-model='add.username' placeholder='请输入账号'>
                    </el-input>
                </el-form-item>
                <el-form-item label='到期时间' label-width="70px">
                    <el-date-picker v-model='add.date' placeholder='请输入到期时间' type="datetime" :disabled='add.auth !== "3"'>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label='永久' label-width="70px">
                    <el-checkbox v-model='add.forever' :disabled='add.auth !== "3"'></el-checkbox>
                    <el-button type='primary' class='add-submit' @click='authAdd()'>添加</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </el-card>
    <el-card class="box-card mt-10">
        <div slot="header">
            <span style="font-size:18px;">查询面板</span>
        </div>
        <el-row :gutter='20'>
            <el-form :rules='searchRule' ref='searchAuth' :model='search' :inline="true">
                <el-form-item label='权限' prop='auth' label-width="70px">
                    <el-select v-model='search.auth' placeholder='请选择权限'>
                        <template v-for='item in options.add'>
                  <el-option :label='item.label' :value='item.value'></el-option>
                </template>
                    </el-select>
                </el-form-item>
                <el-form-item label='用户名' label-width="70px">
                    <el-input v-model='search.username' placeholder='请输入用户名'>
                    </el-input>
                </el-form-item>
                <el-button type='primary' @click='authSearch()'>搜索</el-button>
            </el-form>
        </el-row>
    </el-card>
    <el-card class="mt-10">
        <el-table :data="tableData" border style='margin-top:20px;'>
            <el-table-column prop="userName" label="用户名" align="center">
            </el-table-column>
            <el-table-column prop="validTime" label="到期时间" align="center">
                <template slot-scope="scope">
                    <span v-bind:class='{
                      danger: Number(scope.row.validTime) < new Date().getTime(),
                      warning: Number(scope.row.validTime) - new Date().getTime() > 0 && Number(scope.row.validTime) - new Date().getTime() < 7200000,
                      normal: scope.row.validTime == -1
                    }'>
                      {{strInCol(scope.row, 'validTime')}}
                    </span>
                  </template>
            </el-table-column>
            <el-table-column prop="createUserName" label="授权人" align="center">
                <template slot-scope="scope">
                    {{strInCol(scope.row, 'createUserName')}}
                  </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button size='small' type='danger' @click='authDelete(scope.row)'>删除</el-button>
                  </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-pagination background @current-change='paginationChange' class='page' :page-size="10" layout="prev, pager, next" :total="total">
            </el-pagination>
        </el-row>
    </el-card>
</div>
</template>

<script>
import {
    getOperPlatform
} from '@/api/commonApi'
import {
    checkUser,
    addBigBoss,
    addVeriCode,
    searchBigBoss,
    searchVeriCode,
    delBigBoss,
    delVeriCode
} from '@/api/systemTools'
import {
    parseTime,
} from '@/utils'
export default {
    data() {
        let scope = this
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
            currpage: 1,
            addAuth: '',
            typeForDel: '',
            add: {
                auth: '',
                username: '',
                date: '',
                forever: false
            },
            search: {
                auth: '',
                username: ''
            },
            addRule: {
                auth: [{
                    required: true,
                    message: '请选择要添加的权限',
                    trigger: 'change'
                }],
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }, {
                    trigger: 'blur',
                    validator: checkUserExist
                }]
            },
            searchRule: {
                auth: [{
                    required: true,
                    message: '请选择要搜索的权限',
                    trigger: 'change'
                }],
            },
            options: {
                add: []
            },
            tableData: []
        }
    },
    mounted() {
        this.getAuthPlatform();
    },
    methods: {
        paginationChange(page) {
            let scope = this
            scope.currpage = page
            scope.authSearch()
        },
        getAuthPlatform() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'login/getSpecialVerification'
            }
            getOperPlatform(params).then(res => {
                this.options.add = res.data;
                if (this.add.auth == '') {
                    this.add.auth = this.options.add[0].value;
                }

            });
        },
        formatDate(date) {
            date = Number(date)
            if (date === -1) {
                return '永久'
            } else {
                return parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}:{s}')
            }
        },
        authAdd() {
            let scope = this
            let forever = scope.add.forever
            let date = scope.add.date
            scope.$refs['addAuth'].validate(validate => {
                if (validate) {
                    if (scope.add.auth !== '3') {
                        // 大V
                        addBigBoss({
                            userName: scope.add.username,
                            sign: scope.add.auth
                        }).then(res => {
                            if (res.state) {
                                scope.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                scope.$refs['addAuth'].resetFields();
                            } else {
                                scope.$message.error(res.ret)
                            }
                        })
                    } else {
                        // 免验证码
                        if (forever === true) {
                            date = -1
                        } else {
                            date = date.getTime()
                        }
                        addVeriCode({
                            userName: scope.add.username,
                            validTime: date
                        }).then(res => {
                            if (res.state) {
                                scope.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                scope.$refs['addAuth'].resetFields();
                            } else {
                                scope.$message.error(res.ret)
                            }
                        })
                    }
                } else {
                    return false
                }
            })
        },
        authDelete(item) {
            let scope = this
            let type = scope.typeForDel
            if (type !== '3') {
                delBigBoss({
                    userName: item.userName,
                    sign: type
                }).then(res => {
                    if (res.state) {
                        scope.authSearch()
                        scope.$message({
                            type: 'success',
                            message: "删除成功"
                        })
                    } else {
                        scope.$message.error('删除失败')
                    }
                })
            } else {
                delVeriCode({
                    userName: item.userName
                }).then(res => {
                    if (res.state) {
                        scope.authSearch()
                        scope.$message({
                            type: 'success',
                            message: "删除成功"
                        })
                    } else {
                        scope.$message.error('删除失败')
                    }
                })
            }
        },
        authSearch(item) {
            let scope = this
            let auth = scope.search.auth
            let username = scope.search.username
            let page = scope.currpage
            scope.$refs['searchAuth'].validate(validate => {
                if (validate) {
                    if (auth !== '3') {
                        searchBigBoss({
                            userName: username,
                            sign: scope.search.auth,
                            page: page.toString()
                        }).then(res => {
                            if (res.state) {
                                scope.tableData = res.data.data
                                scope.typeForDel = scope.search.auth
                                scope.total = res.data.size
                            } else {
                                scope.$message.error('查询失败')
                            }
                        })
                    } else {
                        searchVeriCode({
                            userName: username,
                            page: page.toString()
                        }).then(res => {
                            if (res.state) {
                                scope.tableData = res.data.data
                                scope.typeForDel = scope.search.auth
                                scope.total = res.data.size
                            } else {
                                scope.$message.error('查询失败')
                            }
                        })
                    }
                } else {
                    return false
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
/* .add-auth,
.search-auth {
    border-bottom: 1px solid #d9d9d9;
} */

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
