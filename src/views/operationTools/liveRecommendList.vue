<template>
<section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="form.startTime" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
                至
                <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="form.endTime" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="appfrom" label-width="80px" label="操作平台">
                <el-select v-model="form.appfrom" @change='changePlatform' class="select-platform">
                    <el-option :key="index" v-for="(app,index) in newsAppList" :label="app.label" :value="app.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item prop="appfrom" label-width="80px" label="置顶到">
                <el-select v-model="topType" @change='changePlatform' class="select-type">
                    <el-option v-for="item in selectOptions.topType" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" icon="search" @click="newsTopManager">搜索</el-button>
            </el-form-item>
            <el-radio-group class="pull-right" v-model="topTypeLable" @change="changeRecommendType">
                <el-radio-button label="新闻" v-if="auth.hasNews">置顶于新闻</el-radio-button>
                <el-radio-button label="视频" v-if="auth.hasVideo">置顶于视频</el-radio-button>
            </el-radio-group>
        </el-form>
    </el-col>
    <el-col :span="24" class="toolbar">

    </el-col>
    <el-table :data="newsData" border highlight-current-row v-loading="listLoading" style="width: 100%;margin: 0 auto;" @cell-click="cellClick">
        <el-table-column prop="" label="新闻标题" :show-overflow-tooltip="true" align="center" width="200">
            <template slot-scope="scope">
                    <a :href="newsData[scope.$index].content" target="_blank" >{{newsData[scope.$index].title}}</a>
                </template>
        </el-table-column>
        <el-table-column label="强制置顶" align="center" width="200">
            <template slot-scope="scope">
                    <span v-if="newsData[scope.$index].issuper==0">非强制置顶</span>
                    <span v-if="newsData[scope.$index].issuper==1">强制置顶</span>
                </template>
        </el-table-column>
        <el-table-column label="新闻位置状态" align="center">
            <template slot-scope="scope">
                    <span v-if="newsData[scope.$index].isoneself==0">非独占</span>
                    <span v-if="newsData[scope.$index].isoneself==1">独占</span>
                </template>
        </el-table-column>
        <el-table-column prop="newstype" label="投放栏目" align="center" :show-overflow-tooltip="true" class-name="dialogType">
        </el-table-column>
        <el-table-column prop="apptypeid" label="投放APP" align="center">
        </el-table-column>
        <el-table-column prop="provid" label="投放地域" align="center" :show-overflow-tooltip="true" class-name="dialogArea">
        </el-table-column>
        <el-table-column prop="" label="屏幕" align="center" min-width="120">
            <template slot-scope="scope">
                    <el-select v-model="form.pagenum = scope.row.pagenum" placeholder="请选择" size="mini" :disabled="(new Date(scope.row.endTime).getTime() < new Date().getTime())||scope.row.isdelete==1">
                        <el-option
                            v-for="item in pagenumOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </template>
        </el-table-column>
        <el-table-column prop="" label="投放位置" align="center" min-width="120">
            <template slot-scope="scope">
                    <el-select v-model="form.idx = scope.row.idx" placeholder="请选择" size="mini" :disabled="(new Date(scope.row.endTime).getTime() < new Date().getTime())||scope.row.isdelete==1">
                        <el-option
                            v-for="item in idxOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始投放" min-width="220" align="center" size="mini">
            <template slot-scope="scope">
                    <div class="block">
                        <el-date-picker
                            v-model="form.tableStartTime = scope.row.startTime"
                            type="datetime"
                            :disabled="(new Date(scope.row.endTime).getTime() < new Date().getTime())||scope.row.isdelete==1"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束投放" min-width="220" align="center" size="mini">
            <template slot-scope="scope">
                    <div class="block">
                        <el-date-picker
                            v-model="form.tableEndTime = scope.row.endTime"
                            type="datetime"
                            :disabled="(new Date(scope.row.endTime).getTime() < new Date().getTime())||scope.row.isdelete==1"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </template>
        </el-table-column>
        <el-table-column prop="createUser" label="操作人" align="center">
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
                    <span v-if="scope.row.isdelete==1">数据已删除</span>
                    <span v-else-if="new Date(scope.row.endTime).getTime() > new Date().getTime()">
                        <el-button type="primary" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        <el-button type="danger" size="small" @click="handleEditor(scope.$index, scope.row)">保存</el-button>
                    </span>
                    <span v-else>数据已完成</span>
                </template>
        </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 50,100]" :page-size="pageSize" :current-page="currentPage" :total="total" style="float:right;">
        </el-pagination>
    </el-col>
    <el-dialog title="请选择栏目:" :visible.sync="dialogVisibleType" size='small' :before-close="handleCloseType" :close-on-click-modal="false">
        <template>
                <el-checkbox-group v-model="checkedType">
                    <el-row :gutter="10">
							<div v-for="(type,index) in newsTypeList" style="float: left;padding: 5px;width: 100px;" :id="type.typePy">
								<el-checkbox v-if="type.children==null" :label="type.typeName" :key="type.typeId">{{type.typeName}}</el-checkbox>
								<el-checkbox v-else v-model="type.checkAll" :indeterminate="type.indeterminate" :label="type.typeName" @change="handleCheckAllChange($event,type,index)">{{type.typeName}}</el-checkbox>
								<div v-if='type.checkedCities.length!=0||type.checkAll' >
									<el-checkbox-group v-model="type.checkedCities" @change="handleCheckedCitiesChange(type.checkedCities,type,index)">
											<el-checkbox v-for="(typec,indexc) in type.children"  :label="typec.typeName" :key="typec.typeId">{{typec.typeName}}</el-checkbox>
									</el-checkbox-group>
								</div>
							</div>
						</el-row>
                </el-checkbox-group>
            </template>
        <span slot="footer" class="dialog-footer">
            	<el-button @click="dialogVisibleType = false">取 消</el-button>
                <el-button type="primary" @click="handleCheckedTypeChange">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="请选择地域:" :visible.sync="dialogVisibleArea" size="tiny" :before-close="handleCloseTypeArea" :close-on-click-modal="false">
        <template>
                <el-checkbox-group v-model="checkedArea" @change="handleCheckedAreaChange">
                    <el-checkbox v-for="city in areas" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
            </template>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisibleArea = false">确 定</el-button>
            </span>
    </el-dialog>
</section>
</template>

<script>
import {
    newsTopList,
    newsTopManagerDel,
    newsTopManagerUpdate,
    queryPlatDetail,
    NewsTopUtilsType,
    NewsTopUtilsArea,
    checkStickIsConflict
} from '@/api/contentRecommend'
import {
    getOperPlatform
} from '@/api/commonApi'

export default {
    data() {
        return {
            pagenumOptions: [{
                    value: 1,
                    label: '1'
                },
                {
                    value: 2,
                    label: '2'
                },
                {
                    value: 3,
                    label: '3'
                },
                {
                    value: 4,
                    label: '4'
                },
                {
                    value: 5,
                    label: '5'
                },
                {
                    value: 6,
                    label: '6'
                },
                {
                    value: 7,
                    label: '7'
                },
                {
                    value: 8,
                    label: '8'
                },
                {
                    value: 9,
                    label: '9'
                },
                {
                    value: 10,
                    label: '10'
                },
                {
                    value: 11,
                    label: '11'
                },
                {
                    value: 12,
                    label: '12'
                },
                {
                    value: 13,
                    label: '13'
                },
                {
                    value: 14,
                    label: '14'
                },
                {
                    value: 15,
                    label: '15'
                },
                {
                    value: 16,
                    label: '16'
                },
                {
                    value: 17,
                    label: '17'
                },
                {
                    value: 18,
                    label: '18'
                },
                {
                    value: 19,
                    label: '19'
                },
                {
                    value: 20,
                    label: '20'
                }
            ],
            idxOptions: [{
                    value: 1,
                    label: '1'
                },
                {
                    value: 2,
                    label: '2'
                },
                {
                    value: 3,
                    label: '3'
                },
                {
                    value: 4,
                    label: '4'
                },
                {
                    value: 5,
                    label: '5'
                },
                {
                    value: 6,
                    label: '6'
                }
            ],
            form: {
                startTime: '',
                endTime: '',
                tableStartTime: '',
                tableEndTime: '',
                appfrom: '',
                pagenum: '',
                idx: ''
            },
            topType: 1,
            topTypeLable: '新闻',
            selectOptions: {
                topType: [{
                        label: '新闻',
                        value: 1
                    },
                    {
                        label: '视频',
                        value: 2
                    }
                ]
            },
            newsAppList: [],
            newsData: [],
            listLoading: false,
            total: 20,
            currentPage: 1,
            startPage: 1,
            pageSize: 20,
            dialogVisibleType: false,
            dialogVisibleArea: false,

            checkedType: [],
            newsTypeList: [],

            checkedArea: [],
            areas: [],
            typeIschange: false,
            areaIschange: false,
            appfrom: '',
            auth: {
                hasNews: false,
                hasVideo: false
            }
        }
    },
    created() {
        this.newsTopInfo();
    },
    mounted() {
        this.getAuth();
        this.form.endTime = this.format(Date.now() + 3600 * 1000 * 24 * 1, 'yyyy-MM-dd HH:mm:ss');
        this.form.startTime = this.format((Date.now() - 3600 * 1000 * 24 * 1), 'yyyy-MM-dd HH:mm:ss');
    },
    methods: {
        // 权限
        getAuth() {
            // 置顶于视频
            let authorList = localStorage.getItem('authorList');
            if (authorList.indexOf('live/videos/liveRecommentLog') > -1) {
                this.auth.hasVideo = true;
            }
            // 置顶于新闻
            if (authorList.indexOf('live/news/liveRecommentLog') > -1) {
                this.auth.hasNews = true;
            }
            if (!this.auth.hasNews) {
                this.topTypeLable = "视频"
            }
            if (!this.auth.hasVideo) {
                this.topTypeLable = "新闻"
            }
        },
        // 更换置顶类型
        changeRecommendType() {
            switch (this.topTypeLable) {
                case "新闻":
                    this.topType = 1
                    break;
                case "视频":
                    this.topType = 2
                    break;
            }
            this.queryPlatDetail();
            this.newsTopManager();
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
        newsTopManager() {
            Array.prototype.indexOf = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) {
                        return i;
                    }
                }
                return -1;
            }
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            }
            var startTime = this.format(this.form.startTime, 'yyyy-MM-dd HH:mm:ss')
            var endTime = this.format(this.form.endTime, 'yyyy-MM-dd HH:mm:ss')

            var params = {
                sttime: startTime,
                endtime: endTime,
                apptype: '',
                index: '',
                pagenum: '',
                showpagenum: this.startPage,
                showpagesize: this.pageSize,
                channel: this.topType,
                id: '',
                appfrom: JSON.parse(JSON.stringify(this.form.appfrom)).split("-")[0]
            }
            this.listLoading = true;
            newsTopList(params).then((res) => {
                if (res.code === '00001') {
                    for (var i = 0; i < res.data.list.length; i++) {
                        var arr = res.data.list[i].provid.split(',');
                        arr.remove('checkall');
                        arr.remove('notall');
                        res.data.list[i].provid = arr.join(',');
                    }
                    this.newsData = res.data.list;
                    this.total = res.data.count;
                    this.NewsTopUtilsType();
                    this.NewsTopUtilsArea();
                } else {
                    this.newsData = [];
                    this.$message.warning(res.ret);
                }
                this.listLoading = false;
            });
        },
        handleEditor(index, row) { //置顶编辑

            var tableStartTime = this.format(this.form.tableStartTime, 'yyyy-MM-dd HH:mm:ss')
            var tableEndTime = this.format(this.form.tableEndTime, 'yyyy-MM-dd HH:mm:ss')
            var source = '';
            var imgsrc = '';
            if (row.source) {
                source = row.source
            };
            if (row.imgsrc) {
                imgsrc = row.imgsrc
            };
            if (this.areaIschange == false && this.checkedArea.length == 0) {
                this.checkedArea = row.provid.split(',')
            };
            if (this.checkedArea.length == this.areas.length && this.checkedArea.indexOf('checkall') == -1 && this.checkedArea.indexOf('notall') == -1) {
                this.checkedArea.unshift('checkall')
            } else {
                if (this.checkedArea.indexOf('checkall') == -1 && this.checkedArea.indexOf('notall') == -1) {
                    this.checkedArea.unshift('notall')
                }
            }
            if (this.typeIschange == false && this.checkedType.length == 0) {
                this.checkedType = row.newstype.split(',')
            };
            var params = {
                id: row.id,
                channel: this.topType,
                content: row.content,
                title: row.title,
                newstype: this.checkedType.join(','),
                idx: row.idx,
                pagenum: row.pagenum,
                startTime: this.format(row.startTime, 'yyyy-MM-dd HH:mm:ss'),
                endTime: this.format(row.endTime, 'yyyy-MM-dd HH:mm:ss'),
                sourcetype: row.sourcetype,
                isoneself: row.isoneself,
                apptypeid: row.apptypeid,
                provid: this.checkedArea.join(','),
                appfrom: this.form.appfrom,
                issuper: row.issuper,
                islocal: row.isLocal,
                source: source,
                imgs: imgsrc,
                bigPic: 0
            };
            checkStickIsConflict(params).then(res => {
                if (res.code == '00001') {
                    newsTopManagerUpdate(params).then(res => {
                        if (res.code == '00001') {
                            this.newsTopManager();
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                        }
                    })
                } else if (res.code == '00100') {
                    this.$message({
                        message: res.ret,
                        type: 'warning'
                    });
                } else if (res.code == '00101') {
                    this.$confirm('是否确认修改?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        newsTopManagerUpdate(params).then(res => {
                            if (res.code == '00001') {
                                this.newsTopManager();
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });
                    });
                }
            })
        },
        handleDel(index, row) { //手选删除
            let param = {
                id: row.id,
                channel: this.topType
            }
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                newsTopManagerDel(param).then((res) => {
                    if (res.code === '00001') {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.newsTopManager();
                    } else {
                        this.$notify.warning(res.ret);
                    }
                    this.listLoading = false;
                })
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.newsTopManager();
        },
        handleCurrentChange(val) { //分页
            this.startPage = val;
            this.currentPage = val;
            this.newsTopManager();
        },
        changePlatform() {
            this.queryPlatDetail();
        },
        newsTopInfo() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'liveroom/recommendTools'
            }
            getOperPlatform(params).then(res => {
                this.newsAppList = res.data;
                this.form.appfrom = res.data[0].value;
                this.newsTopManager();
            });
        },
        queryPlatDetail() {
            console.log(this.form.appfrom)
            let para = 'area=' + this.form.appfrom.split('-')[0];
            queryPlatDetail(para).then((res) => {
                if (res.code === '00001' && res.data) {
                    this.appfrom = res.data.appfrom;
                }
            });
        },
        handleCloseType(done) {
            this.dialogVisibleType = false;
        },
        handleCloseTypeArea(done) {
            this.dialogVisibleArea = false;
        },
        handleCheckAllChange(event, typeOptions, index) {
            if (typeOptions.children != null) {
                var cities = typeOptions.children.map(item => item.typeName);
                typeOptions.checkedCities = event? cities : [];
                typeOptions.indeterminate = false;
                this.newsTypeList.splice(index, 1, typeOptions);
            }
            if (typeOptions.checkedCities.length != 0) {
                var div = document.getElementById(typeOptions.typePy);
                div.style = "float: left;padding: 5px;width:100%";
            } else {
                var div = document.getElementById(typeOptions.typePy);
                div.style = "float: left;padding: 5px;width: 100px;";
            }
        },
        handleCheckedCitiesChange(value, typeOptions, index) {
            let checkedCount = value.length;
            typeOptions.checkedCities = value;
            typeOptions.checkAll = checkedCount === typeOptions.children.length;
            typeOptions.indeterminate = checkedCount > 0 && checkedCount < typeOptions.children.length;
            this.newsTypeList.splice(index, 1, typeOptions);
        },
        NewsTopUtilsType() {
            var params = {
                parentId: '',
                area: this.form.appfrom.split('-')[0]
            }

            function compare(property) {
                return function(a, b) {
                    var value1 = a[property] == null ? 0 : 1;
                    var value2 = b[property] == null ? 0 : 1;
                    return value2 - value1;
                }
            }
            NewsTopUtilsType(params).then(res => {
                if (res.data) {
                    this.newsTypeList = res.data;
                    for (var i = 0; i < this.newsTypeList.length; i++) {
                        this.newsTypeList[i].indeterminate = false;
                        this.newsTypeList[i].checkedCities = [];
                        this.newsTypeList[i].checkAll = false;

                    }
                    this.newsTypeList.sort(compare('children'));
                }
            })
        },
        NewsTopUtilsArea() {
            NewsTopUtilsArea().then(res => {
                if (res.data) {
                    this.areas = res.data;
                }
            })
        },
        cellClick(row, column, cell, event) {
            if (new Date(row.endTime).getTime() < new Date().getTime()) {
                return false;
            }
            if (cell.classList.contains('dialogType')) {
                this.dialogVisibleType = true;
                this.checkedType = row.newstype.split(',')
                this.typeIschange = true;
            } else if (cell.classList.contains('dialogArea')) {
                this.dialogVisibleArea = true;
                this.checkedArea = row.provid.split(',')
                this.areaIschange = true;
            }
        },
        handleCheckedAreaChange(value) {
            this.checkedArea = value;
            this.areaIschange = true;
        },
        handleCheckedTypeChange() {
            let checkedCities = [];
            this.newsTypeList.map(function(item) {
                if (item.checkedCities.length == 0) {
                    return null
                } else {
                    item.checkedCities.map(c => checkedCities.push(c));
                }
                return item.checkedCities
            });
            let newstype = [];
            this.checkedType.map(function(item) {
                if (item == undefined) {
                    return null
                } else {
                    newstype.push(item);
                }
                return item
            });
            this.checkedType = [...checkedCities, ...newstype];
            this.typeIschange = true;
            this.dialogVisibleType = false
        }
    }
}
</script>

<style scoped>
/*.block{
    margin-top: 20px;
}*/

a {
    color: #666;
    cursor: pointer;
    text-decoration: none;
}

a.disabled:hover {
    color: #bfcbd9;
}

a:hover {
    color: #0000ee;
}
</style>
