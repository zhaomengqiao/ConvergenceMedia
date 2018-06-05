<template>
<div class="auth-config">
    <div class="add-auth" v-if='isAuth.authWhiteUpdate||isAuth.authWhiteAdd'>
        <el-form :rules='addRule' ref='authWhite' :model='add'>
            <el-row :gutter='20'>
                <el-col class="el-col-auto" :span="6">
                    <el-form-item label='新增用户：' prop='username' label-width="100px">
                        <el-input v-model='add.username' placeholder='请输入账号'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto">
                    <el-form-item label='新闻类别：' prop='newstype' label-width="100px">
                        <el-select v-model='add.newstype' placeholder='请选择类别' @change='remoteMethod'>
                            <template v-for='item in options'>
                      <el-option :label='item.label'
                      	:value='item.value'></el-option>
                    </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto">
                    <el-form-item label='平台：' prop='platfrom' label-width="100px" @change='remoteMethod'>
                        <el-select v-model='add.platfrom' placeholder='请选择平台'>
                            <template v-for='item in platfrom'>
                      <el-option :label='item.label'
                      	:value='item.value'></el-option>
                    </template>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col class="el-col-auto" :span="10" v-if='add.platfrom=="selfmedia"'>
                    <el-form-item label='专审类型' label-width="100px">
                        <el-select v-model="add.detailz" style="width: 300px;" multiple placeholder="请选择">
                            <el-option v-for="item in typeList" :key='item.typePy+"#"' :label="item.typeName" :value='item.typePy+"#"'>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto" :span="10">
                    <el-form-item label='普通类型' label-width="100px">
                        <el-select v-model="add.detail" multiple style="width: 300px;" placeholder="请选择">
                            <el-option v-for="item in typeList" :key="item.typePy" :label="item.typeName" :value="item.typePy">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto" style="padding-right:30px;" :span="4">
                    <el-button type='primary' class='add-submit' v-if='add.id==""&&isAuth.authWhiteAdd' @click='authWhiteAdd()'>添加</el-button>
                    <el-button type='primary' class='add-submit' v-if='add.id!=""' @click='authWhiteUpdate()'>编辑</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div class="search-auth">
        <el-row :gutter='20'>
            <el-form ref='searchAuth' :model='search' :rules='searchRule'>
                <el-col class="el-col-auto">
                    <el-form-item label='新闻类别：' prop='passreview' label-width="100px">
                        <el-select v-model='search.newstype' placeholder='请选择类别'>
                            <template v-for='item in options'>
                      <el-option :label='item.label'
                      	:value='item.value'></el-option>
                    </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto">
                    <el-form-item label='平台：' prop='passreview' label-width="100px">
                        <el-select v-model='search.platfrom' placeholder='请选择平台'>
                            <template v-for='item in platfrom'>
                      <el-option :label='item.label'
                      	:value='item.value'></el-option>
                    </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="el-col-auto">
                    <el-form-item label='用户名' prop='username' label-width="120px">
                        <el-input v-model='search.username' placeholder='请输入用户名'>
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
        <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              	{{scope.$index}}
               </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
            <template slot-scope="scope">
                <span >
                	{{tableData[scope.$index].field}}
                </span>
                <span v-if='tableData[scope.$index].field_v!=""'>,{{tableData[scope.$index].field_v}}</span>
              </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button size='small' v-if='isAuth.authWhiteUpdate' type='primary' @click='authUpdate(scope.$index,tableData[scope.$index].field,tableData[scope.$index].field_v)'>编辑</el-button>
                <el-button size='small' v-if='isAuth.authWhiteDel'  type='danger' @click='authDelete(scope.$index)'>删除</el-button>
              </template>
        </el-table-column>
    </el-table>
    <el-row>
        <el-pagination @current-change="paginationChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next,jumper" :page-sizes=[10,15,20,50,100] :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
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
    authDomainUpdate,
    authWhiteList,
    checkUser,
    authDomainDelete,
    auditdomainType
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

        let checkUserSearch = (rule, value, callback) => {
            if (scope.search.username != '' && scope.search.username != null) {
                checkUser(scope.search.username).then(function(res) {
                    if (!res.state) {
                        callback(new Error('用户不存在'))
                    } else {
                        callback()
                    }
                })
            } else {
                callback()
            }

        }

        return {
            total: 0,
            pageSize: 10,
            page: 1,
            isAuth: {
                authWhiteDel: true,
                authWhiteAdd: true,
                authWhiteUpdate: true,
            },
            typeForDel: '',
            add: {
                id: '',
                newstype: 'news',
                username: '',
                platfrom: 'selfmedia',
                detail: [],
                detailz: []
            },
            search: {
                newstype: 'news',
                username: '',
                platfrom: 'selfmedia',
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
            searchRule: {
                username: [{
                    trigger: 'blur',
                    validator: checkUserSearch
                }]
            },
            typeList: [],
            options: [{
                value: 'news',
                label: '文章'
            }, {
                value: 'video',
                label: '视频'
            }, {
                value: 'picture',
                label: '图集'
            }],
            platfrom: [{
                value: 'selfmedia',
                label: '东方号'
            }, {
                value: 'wemedia',
                label: '自媒体'
            }],
            tableData: [],
        }
    },
    mounted() {
        this.pageSize = this.personalConfig.tableRowShow
        this.getAuth();
        this.remoteMethod();
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
            scope.authSearch()
        },
        remoteMethod() {
            this.typeList = [];
            let para = {
                newstype: this.add.newstype,
                platfrom: this.add.platfrom
            };
            auditdomainType(para).then((res) => {
                if (res.code == '00001') {
                    this.typeList = res.data;
                } else {
                    this.typeList = []
                }
            });
        },
        authUpdate(item, detail, detailv) {
            let scope = this;
            let dArry = detailv.split(",");
            let dp = detail.split(",");
            scope.add = {
                username: item,
                platfrom: scope.search.platfrom,
                newstype: scope.search.newstype,
                detail: dp,
                detailz: dArry,
            }
        },
        authWhiteUpdate() {
            let scope = this;
            scope.$refs['authWhite'].validate(validate => {
                if (validate) {
                    let timetmp = new Date();
                    var detail = scope.add.detail.length == 0 ? '' : scope.add.detail.join(',');
                    var detailv = scope.add.detailz.length == 0 ? '' : scope.add.detailz.join(',');
                    if (detail == '' && scope.add.platfrom == "selfmedia") {
                        detail = detailv;
                    } else if (scope.add.platfrom == "selfmedia") {
                        detail = detail + ',' + detailv;
                    } else {
                        detail = detail;
                    }
                    authDomainUpdate({
                        id: scope.add.id,
                        type: 'auditdomain',
                        username: scope.add.username,
                        platfrom: scope.add.platfrom,
                        newstype: scope.add.newstype,
                        detail: detail,
                    }).then(res => {
                        if (res.code === '00001') {
                            scope.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            scope.$refs['authWhite'].resetFields();
                            scope.add.detail = [];
                            scope.add.detailz = [];
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
                    var detail = scope.add.detail.length == 0 ? '' : scope.add.detail.join(',');
                    var detailv = scope.add.detailz.length == 0 ? '' : scope.add.detailz.join(',');
                    if (detail == '' && scope.add.platfrom == "selfmedia") {
                        detail = detailv;
                    } else if (scope.add.platfrom == "selfmedia") {
                        detail = detail + ',' + detailv;
                    } else {
                        detail = detail;
                    }
                    authWhiteAdd({
                        type: 'auditdomain',
                        username: scope.add.username,
                        platfrom: scope.add.platfrom,
                        newstype: scope.add.newstype,
                        detail: detail,
                    }).then(res => {
                        if (res.code === '00001') {
                            scope.$message({
                                message: '保存成功',
                                type: 'success'
                            })
                            scope.$refs['authWhite'].resetFields();
                            scope.add.detail = [];
                            scope.add.detailz = [];
                        } else {
                            scope.$message.error(res.ret)
                        }
                    })
                }
            })
        },
        authDelete(item) {
            let scope = this
            this.$confirm('确认提交吗?', '提示', {
                type: 'warning'
            }).then(() => {
                authDomainDelete({
                    param: {
                        username: item,
                        platfrom: scope.search.platfrom,
                        newstype: scope.search.newstype,
                    },
                    type: 'auditdomain'
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
            scope.$refs['searchAuth'].validate(validate => {
                if (validate) {
                    authWhiteList({
                        type: 'auditdomain',
                        username: scope.search.username,
                        platfrom: scope.search.platfrom,
                        newstype: scope.search.newstype,
                        page: scope.page,
                        pagesize: scope.pageSize
                    }).then(res => {
                        if (res.code === '00001') {
                            scope.tableData = res.data.data;
                            scope.total = res.data.count;
                        }
                    })
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
