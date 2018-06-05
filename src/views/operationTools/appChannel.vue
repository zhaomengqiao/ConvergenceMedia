<template lang="html">
    <section>
        <!--工具条-->
        <el-card>
            <el-row style="padding-bottom: 0px;">
                <el-form :inline="true" :model="formData" :rules="rules" ref="ruleForm">
                    <el-row>
                        <el-form-item label="平台">
                            <el-select v-model="formData.platform" class="select-input-platform"
                                filterable placeholder="选择平台" >
                                <el-option
                                    v-for="(item,index) in platformOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类">
                            <el-select v-model="formData.newstype" class="select-platform"
                                filterable placeholder="选择分类" @change="selectType">
                                <el-option
                                    v-for="(item,index) in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="pull-right" style="width:140px;">
                            <el-button type="primary" @click="clickSaveBtn('ruleForm')" style="width:100px;">{{ btnName.save }}</el-button>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="频道" prop="channel">
                            <el-input type="primary" v-model.trim="formData.channel" placeholder="请输入频道"></el-input>
                        </el-form-item>
                        <el-form-item label="类型编号" prop="channelid">
                            <el-input type="primary" v-model.trim="formData.channelid" placeholder="请输入类型编号"></el-input>
                        </el-form-item>
                        <el-radio-group v-model="formData.channeltype" class="el-radio-style">
                            <el-radio :label="0">我的频道</el-radio>
                            <el-radio :label="1">推荐频道</el-radio>
                        </el-radio-group>
                        <el-form-item label="排序">
                            <el-input-number v-model="formData.sortid" :min="1"></el-input-number>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="URL" style="margin-bottom:0">
                            <el-input type="primary" v-model.trim="formData.url" placeholder="请输入URL" class="select-long"></el-input>
                        </el-form-item>
                        <el-radio-group v-model="formData.state" class="el-radio-style" style="margin-bottom:0">
                            <el-radio :label="0">启用</el-radio>
                            <el-radio :label="1">停用</el-radio>
                            <el-radio :label="2">强制上线</el-radio>
                            <el-radio :label="3">强制下线</el-radio>
                        </el-radio-group>
                    </el-row>
                </el-form>
            </el-row>
        </el-card>


        <el-card class="mt-10">
            <el-row style="margin-bottom:10px">
                <el-form :inline="true" :model="formTableData">
                    <el-form-item label="平台">
                        <el-select v-model="formTableData.platform" class="select-input-platform"
                            filterable placeholder="选择平台" >
                            <el-option
                                v-for="(item,index) in platformOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="formTableData.newstype" class="select-platform"
                            filterable placeholder="选择分类">
                            <el-option
                                v-for="(item,index) in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属频道">
                        <el-select v-model="formTableData.channeltype" class="select-platform"
                            filterable placeholder="选择频道" >
                            <el-option
                                v-for="(item,index) in channelTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-radio-group v-model="formTableData.state" class="el-radio-style" style="margin-bottom:0">
                        <el-radio :label="0">启用</el-radio>
                        <el-radio :label="1">停用</el-radio>
                        <el-radio :label="2">强制上线</el-radio>
                        <el-radio :label="3">强制下线</el-radio>
                    </el-radio-group> -->
                    <el-form-item label="状态">
                        <el-select v-model="formTableData.state" class="select-platform"
                            filterable placeholder="选择状态" >
                            <el-option
                                v-for="(item,index) in stateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="getList" size="small" style="width:80px;margin-left:20px;">查询</el-button>
                    <el-button type="primary" @click="sortAppClassify" size="small" style="width:80px;margin-left:20px;">保存排序</el-button>
                </el-form>
            </el-row>
            <!--列表Begin-->
            <el-table :data="tableData"
                      v-loading="listLoading"
                      style="width: 100%;"
                      row-key="idx"
                      stripe border>
                <el-table-column label="排序" prop="" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sortid }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="频道名" width="140">
                    <template slot-scope="scope">
                        <span>{{ scope.row.channel }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="所属频道" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.channeltype | channeltype }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="URL" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.url }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <span :class="scope.row.state==1||scope.row.state==4?'red_state':''">{{ scope.row.state | state }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small"
                                   v-if="btnShow(scope.row,'edit')"
                                   @click="editAppClassify(scope.row,'edit')">编辑</el-button>
                        <el-button type="success" size="small"
                                   v-if="btnShow(scope.row,'turnOn')"
                                   @click="editAppClassify(scope.row,'turnOn')">启用</el-button>
                        <el-button type="success" size="small"
                                   v-if="btnShow(scope.row,'turnOff')"
                                   @click="editAppClassify(scope.row,'turnOff')">停用</el-button>
                        <el-button type="primary" size="small"
                                   v-if="btnShow(scope.row,'online')"
                                   @click="editAppClassify(scope.row,'online')">强上</el-button>
                        <el-button type="success" size="small"
                                   v-if="btnShow(scope.row,'offline')"
                                   @click="editAppClassify(scope.row,'offline')">强下</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--列表End-->
        </el-card>
    </section>
</template>

<script>
import Sortable from 'sortablejs'
import {
    searchAppClassify,
    addAppClassify,
    editAppClassify,
    sortAppClassify,
    judgeAppClassify
} from '@/api/operationTools';
export default {
    data() {
        return {
            tableShow: true,
            formData: {
                platform: 'toutiao',
                newstype: 'news',
                channel: '',
                channelid: '',
                channeltype: 0,
                sortid: '',
                url: '',
                state: 1,
                idx: ''
            },
            formTableData: {
                platform: 'toutiao',
                newstype: 'news',
                state: '',
                channeltype: ''
            },
            platformOptions: [{
                label: '东方头条',
                value: 'toutiao'
            }],
            typeOptions: [

            ],
            channelTypeOptions: [{
                    label: '全部',
                    value: ''
                },
                {
                    label: '我的频道',
                    value: 0
                },
                {
                    label: '推荐频道',
                    value: 1
                }
            ],
            stateOptions: [{
                    label: '全部',
                    value: ''
                },
                {
                    label: '启用',
                    value: 0
                },
                {
                    label: '停用',
                    value: 1
                },
                {
                    label: '强制上线',
                    value: 2
                },
                {
                    label: '强制下线',
                    value: 3
                }
            ],
            tableData: [],
            olderList: [],
            newList: [],
            listLoading: false,
            btnName: {
                save: '新增'
            },
            rules: {
                channel: [{
                    required: true,
                    message: '请输入频道',
                    trigger: 'blur'
                }, ],
                channelid: [{
                    required: true,
                    message: '请输入类型编号',
                    trigger: 'blur'
                }, ]
            }
        }
    },
    mounted() {
        this.getAuth()
        this.getList();
    },
    filters: {
        // 所属频道
        channeltype(val) {
            let arr = ['我的频道', '推荐频道']
            return arr[val]
        },
        // 状态
        state(val) {
            let arr = ['启用', '停用', '强制上线', '强制下线']
            return arr[val]
        },
        // 类型
        newstype(val) {
            let obj = {
                news: '新闻',
                videos: '视频',
                article: '热文'
            }
            return obj[val]
        }
    },
    methods: {
        // 新闻/视频/热文 权限
        getAuth() {
            let authorList = localStorage.getItem('authorList');
            // 新闻权限
            if (authorList.indexOf('channel/manager/news') != -1) {
                this.typeOptions.push({
                    'label': '新闻',
                    'value': 'news'
                })
            }
            // 视频权限
            if (authorList.indexOf('channel/manager/video') != -1) {
                this.typeOptions.push({
                    'label': '视频',
                    'value': 'videos'
                })
            }
            // 热文权限
            if (authorList.indexOf('channel/manager/article') != -1) {
                this.typeOptions.push({
                    'label': '热文',
                    'value': 'article'
                })
            }
            // 初始值
            if (authorList.indexOf('channel/manager/news') != -1) {
                this.formData.newstype = this.typeOptions[0].value
                this.formTableData.newstype = this.typeOptions[0].value
            } else {
                this.formData.newstype = this.typeOptions[0].value
                this.formTableData.newstype = this.typeOptions[0].value
            }
            if (authorList.indexOf('channel/manager/video') != -1) {
                this.formData.newstype = this.typeOptions[0].value
                this.formTableData.newstype = this.typeOptions[0].value
            } else {
                this.formData.newstype = this.typeOptions[0].value
                this.formTableData.newstype = this.typeOptions[0].value
            }
            if (authorList.indexOf('channel/manager/article') != -1) {
                this.formData.newstype = this.typeOptions[0].value
                this.formTableData.newstype = this.typeOptions[0].value
            } else {
                this.formData.newstype = this.typeOptions[0].value
                this.formTableData.newstype = this.typeOptions[0].value
            }
        },
        // 获取列表
        getList() {
            this.listLoading = true;
            searchAppClassify(this.formTableData).then(res => {
                if (res.code == "00001") {
                    if (res.data) {
                        var _this = this;
                        this.tableData = res.data;
                        this.tableShow = true;
                        this.olderList = JSON.parse(JSON.stringify(this.tableData))
                        this.newList = JSON.parse(JSON.stringify(this.olderList))
                        this.$nextTick(() => {
                            this.setSort()
                        })
                    } else {
                        this.tableData = [];
                    }
                }
                this.listLoading = false;
            })
        },
        // 校检是否重复
        judgeAppClassify() {
            judgeAppClassify(this.formData).then(res => {
                if (res.code == "00001") {
                    switch (res.data) {
                        case 0:
                            this.addAppClassify();
                            break;
                        case 1:
                            this.$message({
                                message: '类型编号重复',
                                type: 'warning'
                            });
                            break;
                        case 2:
                            this.$message({
                                message: '排序重复',
                                type: 'warning'
                            });
                            break;
                        case 3:
                            this.$message({
                                message: '类型编号和排序均重复',
                                type: 'warning'
                            });
                            break;
                    }
                }
            })
        },
        // 点击新增/保存按钮
        clickSaveBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.btnName.save == '新增') {
                        this.judgeAppClassify();
                    } else {
                        this.saveAppClassify();
                    }
                }
            })
            // this.$refs[formName].validate((valid) => {
            //     if(valid){
            //         if(this.btnName.save == '新增'){
            //             this.judgeAppClassify();
            //         }else{
            //             this.saveAppClassify();
            //         }
            //     }
            // }）
        },
        btnShow(row, type) {
            let state = row.state;
            switch (type) {
                case 'edit':
                    return true
                    break;
                case 'turnOn':
                    if (state == 0 || state == 2) {
                        return false
                    } else {
                        return true
                    }
                    break;
                case 'turnOff':
                    if (state == 1 || state == 3) {
                        return false
                    } else {
                        return true
                    }
                    break;
                case 'online':
                    if (state == 2) {
                        return false
                    } else {
                        return true
                    }
                    break;
                case 'offline':
                    if (state == 3) {
                        return false
                    } else {
                        return true
                    }
                    break;
            }
        },
        // 新增
        addAppClassify() {
            this.listLoading = true;
            addAppClassify(this.formData).then(res => {
                if (res.code == "00001") {
                    this.getList();
                    this.resetForm();
                    this.$notify({
                        title: '成功',
                        message: '添加成功',
                        type: 'success'
                    });
                }
                this.listLoading = false;
            })
        },
        //保存
        saveAppClassify(param, msg) {
            this.listLoading = true;
            let params = param ? param : this.formData
            editAppClassify(params).then(res => {
                if (res.code == "00001") {
                    this.getList();
                    this.resetForm();
                    this.$notify({
                        title: '成功',
                        message: msg,
                        type: 'success'
                    });
                    this.btnName.save = "新增"
                }
                this.listLoading = false;
            })
        },
        // 排序
        setSort() {
            const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                onEnd: evt => {
                    const tempIndex = this.tableData.splice(evt.oldIndex, 1)[0]
                    this.tableData.splice(evt.newIndex, 0, tempIndex)
                    var _this = this;
                    this.tableData.forEach(function(item, index) {
                        item.sortid = _this.olderList[index].sortid;
                    })
                }
            })
        },
        // 清空
        resetForm() {
            this.formData = {
                platform: 'toutiao',
                newstype: 'news',
                channel: '',
                channelid: '',
                channeltype: 0,
                sortid: '',
                url: '',
                state: 0
            }
        },
        /**
         * 编辑
         * @param  type edit 编辑 / turnOn 启用 / online 强制上线 / offline 强制下线
         */
        editAppClassify(row, type) {
            let param;
            switch (type) {
                case 'edit':
                    this.btnName.save = "保存"
                    this.formData = Object.assign({}, row)
                    break;
                case 'turnOn':
                    param = Object.assign({}, row)
                    // 判断 启用
                    param.state = 0
                    this.saveAppClassify(param, '启用成功');
                    break;
                case 'turnOff':
                    param = Object.assign({}, row)
                    // 判断 禁用
                    param.state = 1
                    this.saveAppClassify(param, '停用成功');
                    break;
                case 'online':
                    param = Object.assign({}, row)
                    param.state = 2
                    this.saveAppClassify(param, '强制上线成功');
                    break;
                case 'offline':
                    param = Object.assign({}, row)
                    param.state = 3
                    this.saveAppClassify(param, '强制下线成功');
                    break;
            }
        },
        // 保存排序
        sortAppClassify() {
            this.$confirm('是否保存该排序', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sortAppClassify(this.tableData).then(res => {
                    if (res.code == "00001") {
                        this.tableShow = false;
                        this.getList();
                        this.$notify({
                            title: '成功',
                            message: '保存排序成功',
                            type: 'success'
                        });
                    }
                })
            }).catch(() => {
                this.tableShow = false;
                this.getList();
            });
        },
        // 修改类型
        selectType() {
            if (this.formData.newstype != 'news') {
                this.formData.channeltype = 1
            } else {
                this.formData.channeltype = 0
            }
        }
    }
}
</script>

<style lang="css" scoped="scoped">
.red_state{
    color: #FA5555
}
</style>
