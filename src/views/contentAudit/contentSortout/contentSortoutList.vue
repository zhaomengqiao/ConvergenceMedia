<template lang="html">
    <section class="sortoutList">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item>
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="form.timeQuantum"
                            type="datetimerange"
                            placeholder="选择时间范围"
                            @change="getTopTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="分类：">
                        <el-select v-model="form.classification" class="select-platform"
                        filterable placeholder="请选择分类">
                            <el-option
                            v-for="(item,index) in classification"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人员：">
                        <el-select v-model="form.personnel" class="select-platform"
                        filterable placeholder="请选择分类">
                            <el-option
                            v-for="(item,index) in personnel"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="标题：" style="margin-bottom:0">
                        <el-input v-model.trim="form.title" style="width: 300px;" placeholder="请输入文章标题关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="URL：" style="margin-bottom:0">
                        <el-input v-model="form.url" style="width: 300px;" placeholder="请输入文章URL"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" icon="search" @click="searchTableData">搜索</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="createdate"
                    label="日期" width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="logtypelv2"
                    label="内容分类"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="tableData[scope.$index].logtypelv2 == 3080">新闻标签添加</span>
                        <span v-if="tableData[scope.$index].logtypelv2 == 3081">新闻标签修改</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createuser"
                    label="操作人"
                    align="center" width="120">
                </el-table-column>
                <el-table-column
                    prop="changeTime"
                    label="操作时间" width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="内容标题"
                    :show-overflow-tooltip="true"
                    align="center">
                    <template slot-scope="scope">
                        <a class="e-table-title" target="_blank" :href="tableData[scope.$index].url">{{tableData[scope.$index].title}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="timeliness"
                    label="时效性" width="100"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="tableData[scope.$index].timeliness == 1">时效性</span>
                        <span v-if="tableData[scope.$index].timeliness == 0">非时效性</span>
                        <span v-if="tableData[scope.$index].timeliness == 2">未知</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="customtag"
                    :show-overflow-tooltip="true"
                    label="标签"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="操作" width="100" fixed="right"
                    align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="changeTableData(scope.$index)"
                            type="primary"
                            size="small">
                            修改
                        </el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 15, 20, 50,100]"
                    style="float:right;"
                    :page-size="PageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog title="信息修改" :visible.sync="dialogFormVisible">
            <p class="dialogTitle"><a target="_blank" :href="thisChangeObj.url">{{thisChangeObj.title}}</a></p>
            <el-form ref="form" :model="tagForm" label-width="150px">
                <el-form-item label="活动名称：">
                    <el-tag
                        :key="tag"
                        v-for="tag in tagForm.dynamicTags"
                        :closable="true"
                        :close-transition="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        style='width: 100px;'
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="mini"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
                </el-form-item>
                <el-form-item label="时效性：">
                    <template>
                        <el-radio-group v-model="tagForm.radio">
                            <el-radio :label="1">时效性</el-radio>
                            <el-radio :label="0">非时效性</el-radio>
                            <el-radio :label="2" >未知</el-radio>
                        </el-radio-group>
                    </template>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="makeSure">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import {
    searchTableData,
    changeTableData,
    searchUserData
} from '@/api/audit'

export default {
    data() {
        var endTime = this.format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
        var startTime = this.format((Date.now() - 86400000), 'yyyy-MM-dd HH:mm:ss')
        return {
            activeName: 'third',
            currentPage: 1,
            form: {
                timeQuantum: [startTime,endTime],
                startTime: startTime,
                endTime: endTime,
                classification: '',
                personnel: '',
                title: '',
                url: ''
            },
            classification: [{
                value: '',
                label: '全部'
            }, {
                value: '3080',
                label: '新闻标签添加'
            }, {
                value: '3081',
                label: '新闻标签修改'
            }, {
                value: '3082',
                label: '审核时视频标签添加'
            }, {
                value: '3083',
                label: '视频标签修改'
            }, {
                value: '3102',
                label: '视频标签添加'
            }],
            personnel: [],
            tableData: [],
            startpage: 1,
            PageSize: 10,
            total: 0,
            dialogFormVisible: false,
            inputVisible: false,
            inputValue: '',
            tagForm: {
                dynamicTags: [],
                radio: ''
            },
            thisChangeObj: [],
            changeIndex: ''
        }
    },
    mounted() {
        this.searchUserData();

        this.loadKey();
    },
    methods: {
        trimStr(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        loadKey() { //键盘事件
            let _that = this;
            document.onkeyup = function(ev) {
                if (ev.keyCode == 49) {
                    _that.tagForm.radio = 1;
                } else if (ev.keyCode == 50) {
                    _that.tagForm.radio = 0;
                } else if (ev.keyCode == 51) {
                    _that.tagForm.radio = 2;
                }
            };
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
        searchTableData() {
            var startTime = this.format(this.form.startTime, 'yyyy-MM-dd HH:mm:ss')
            var endTime = this.format(this.form.endTime, 'yyyy-MM-dd HH:mm:ss')
            var params = {
                startdate: startTime,
                enddate: endTime,
                logtype: this.form.classification,
                createuser: this.form.personnel,
                urlid: this.form.url,
                title: this.form.title,
                startpage: this.startpage,
                pagesize: this.PageSize
            }
            searchTableData(params).then(res => {
                if (res.data) {
                    function dateFtt(fmt, date) {
                        var o = {
                            "M+": date.getMonth() + 1, //月份
                            "d+": date.getDate(), //日
                            "h+": date.getHours(), //小时
                            "m+": date.getMinutes(), //分
                            "s+": date.getSeconds(), //秒
                            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                            "S": date.getMilliseconds() //毫秒
                        };
                        if (/(y+)/.test(fmt))
                            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                        for (var k in o) {
                            if (new RegExp("(" + k + ")").test(fmt)) {
                                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            }
                        }
                        return fmt;
                    }

                    this.total = res.data.dataCount;
                    for (var i = 0; i < res.data.dataPageData.length; i++) {
                        var crtTime = new Date(res.data.dataPageData[i].createdate);
                        var date = dateFtt("yyyy-MM-dd hh:mm:ss", crtTime)
                        res.data.dataPageData[i].createdate = date.slice(0, 10);
                        res.data.dataPageData[i].changeTime = date.slice(10);

                    }
                    this.tableData = res.data.dataPageData;
                }
            })
        },
        changeTableData(index) {
            this.dialogFormVisible = true;
            this.thisChangeObj = this.tableData[index];
            if (this.tableData[index].customtag) {
                this.tagForm.dynamicTags = this.tableData[index].customtag.split(",");
            } else {
                this.tagForm.dynamicTags = [];
            }
            this.tagForm.radio = this.tableData[index].timeliness;
            this.changeIndex = index;
        },
        searchUserData() {
            searchUserData().then(res => {
                var UserData = [{
                    value: '',
                    name: '全部'
                }];
                if (res.data) {
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i]) {
                            UserData.push({
                                value: res.data[i],
                                name: res.data[i]
                            })
                        }
                    }
                }
                this.personnel = UserData;
            })
        },
        handleSizeChange(val) {
            this.PageSize = val;
            this.searchTableData()
        },
        handleCurrentChange(val) {
            this.startpage = val;
            this.currentPage = val;
            this.searchTableData()
        },
        makeSure() {
            this.dialogFormVisible = false;
            var params = {
                rowkey: this.tableData[this.changeIndex].rowkey,
                timeliness: this.tagForm.radio,
                logtype: this.tableData[this.changeIndex].logtypelv2,
                customtag: this.trimStr(this.tagForm.dynamicTags.join(',')),
                oldtimeliness: this.tableData[this.changeIndex].timeliness,
                oldcustomtag: this.tableData[this.changeIndex].customtag
            }
            changeTableData(params).then(res => {
                if (res.state) {
                    this.tableData[this.changeIndex].timeliness = params.timeliness;
                    this.tableData[this.changeIndex].customtag = params.customtag;
                    this.tableData[this.changeIndex].createuser = res.data.createuser;
                    this.tableData[this.changeIndex].createdate = res.data.createdate.slice(0, 10);
                    this.tableData[this.changeIndex].changeTime = res.data.createdate.slice(10);
                }
            })
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.trimStr(this.inputValue);
            if (this.tagForm.dynamicTags.length >= 6) {
                this.$message({
                    message: '最多添加6个标签',
                    type: 'warning'
                });
                return false;
            }
            if (inputValue) {
                this.tagForm.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        handleClose(tag) {
            this.tagForm.dynamicTags.splice(this.tagForm.dynamicTags.indexOf(tag), 1);
        }
    }
}
</script>

<style scoped>
.dialogTitle {
    text-align: center;
}

.dialogTitle a {
    text-decoration: none;
    color: #20a0ff;
}
</style>
