<template lang="html">
    <section class="urlformLiveList">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="审核时间" prop="timeQuantum">
                        <el-date-picker
                            v-model="form.starttime"
                            type="month"
                            placeholder="选择月"
                            style="width:140px">
                        </el-date-picker>
                        至
                        <el-date-picker
                            v-model="form.endtime"
                            type="month"
                            placeholder="选择月"
                            style="width:140px">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="信源添加人">
                        <el-select v-model="form.addPeople" class="select-platform"
                            filterable placeholder="选择信源添加人">
                            <el-option
                                v-for="(item,index) in addPeoples"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="信源等级">
                        <el-select v-model="form.urlfromLevel" class="select-platform"
                            filterable placeholder="选择信源等级">
                            <el-option
                                v-for="(item,index) in urlfromLevels"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="作用区域">
                        <el-select v-model="form.activeArea" class="select-platform"
                            filterable placeholder="选择作用区域">
                            <el-option
                                v-for="(item,index) in activeAreas"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="信源类型">
                        <el-select v-model="form.sourcetype" class="select-platform"
                            filterable placeholder="选择采集类型">
                            <el-option
                                v-for="(item,index) in sourcetypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否免审">
                        <el-select v-model="form.noAudit" class="select-platform" placeholder="选择是否免审">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.homepage" placeholder="请输入站点首页链接"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.urlfrom" placeholder="请输入URLfrom"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.sourcename" placeholder="请输入信源名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                    <el-row>
                        <el-form-item style="margin-bottom:0">
                            <el-button type="primary" @click="exportExcel">导出</el-button>
                        </el-form-item>
                        <el-form-item style="margin-bottom:0">
                            <el-button type="primary" @click="dialogFormVisible=true">导入</el-button>
                        </el-form-item>
                        <el-form-item style="margin-bottom:0">
                            <el-button type="primary" @click="downloadExcel">下载模板</el-button>
                        </el-form-item>
                        <el-form-item style="margin-bottom:0">
                            <el-button type="primary" @click="addUrlfrom">新增</el-button>
                        </el-form-item>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-row>
                <!--列表Begin-->
                <el-table :data="tableData"
                          highlight-current-row
                          v-loading="listLoading"
                          style="width: 100%;"
                          tooltip-effect="dark"
                          stripe border>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                          <div style="width:100%;padding-right:150px;">
                              <div class="table-div">
                                  <div class="label">采集负责人：</div>
                                  <div class="content">{{ props.row.grabuser }}</div>
                              </div>
                              <div class="table-div">
                                  <div class="label">作用区域：</div>
                                  <div class="content">{{ props.row.usearea }}</div>
                              </div>
                              <div class="table-div">
                                  <div class="label">信息添加：</div>
                                  <div class="content">{{ props.row.createuser }}</div>
                              </div>
                              <div class="table-div">
                                  <div class="label">采集类型：</div>
                                  <div class="content">{{props.row.grabtype}}（{{props.row.homepage}}）</div>
                              </div>
                              <div class="table-div" style="align-items:baseline">
                                  <div class="label">备注信息：</div>
                                  <div class="content">
                                    <p v-if="props.row.remark==null||(props.row.remark.indexOf(';')==-1)" style="margin:4px 0">{{ props.row.remark }}</p>
                                    <p v-for="item in props.row.remark.split(';')" v-else style="margin:4px 0">{{ item }}</p>
                                  </div>
                              </div>
                          </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="URLFrom" width="120" :show-overflow-tooltip="true" prop="urlfrom">
                    </el-table-column>
                    <el-table-column label="信源名称" min-width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span><el-tag :type="getStatus(scope.row.isused,scope.row.onlinetime)=='停用'?'danger':'success'">{{ getStatus(scope.row.isused,scope.row.onlinetime) }}</el-tag> <span>{{ scope.row.sourcename }}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="信源首页" min-width="200" :show-overflow-tooltip="true" prop="homepage">
                    </el-table-column>
                    <el-table-column prop="sourcelevel" label="信源等级" width="100">
                    </el-table-column>
                    <el-table-column label="是否免审" width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.isreview == 2?'是':'否' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sitelevel" label="站点规模" width="120">
                    </el-table-column>
                    <el-table-column prop="onlinetime" label="上线时间" :show-overflow-tooltip="true" width="220">
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="changeUseState(scope.row.idx,1)" v-if="scope.row.isused!=1&&(getStatus(scope.row.isused,scope.row.onlinetime)!='开发中')">启用</el-button>
                            <el-button type="success" size="small" @click="changeUseState(scope.row.idx,0)" v-if="scope.row.isused==1&&(getStatus(scope.row.isused,scope.row.onlinetime)!='开发中')">停用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row class="toolbar">
                <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-sizes="[10, 15, 20, 50, 100]"
                  :page-size="pageSize"
                  :current-page="currentPage"
                  :total="total"
                  background
                  style="float:right;"
                  >
                </el-pagination>
            </el-row>
        </el-card>
        <el-dialog title="" :visible.sync="dialogFormVisible">
            <el-upload
                class="upload-demo"
                :action="importExcelURL"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    parseTime,
} from '@/utils'
import {
    getUrlfromPeople,
    getUrlfromActiveArea,
    getUrlfromLiveList,
    changeUseState,
    exportUrlfromExcel,
    downloadUrlfromExcel,
    importExcel
} from '@/api/systemTools'

export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            fileList: [],
            dialogFormVisible: false,
            importExcelURL: '',
            form: {
                starttime: '',
                endtime: '',
                addPeople: '',
                urlfromLevel: '',
                activeArea: '',
                urlfrom: '',
                homepage: '',
                sourcetype: '',
                noAudit: ''
            },
            addPeoples: [],
            urlfromLevels: [{
                    label: '全部',
                    value: ''
                },
                {
                    label: '一级',
                    value: '1'
                },
                {
                    label: '二级',
                    value: '2'
                },
                {
                    label: '三级',
                    value: '3'
                },
                {
                    label: '四级',
                    value: '4'
                },
                {
                    label: '五级',
                    value: '5'
                },
                {
                    label: '六级',
                    value: '6'
                },
                {
                    label: '七级',
                    value: '7'
                },
                {
                    label: '八级',
                    value: '8'
                },
                {
                    label: '九级',
                    value: '9'
                },
                {
                    label: '十级',
                    value: '10'
                }
            ],
            activeAreas: [],
            sourcetypes: [{
                    label: '新闻',
                    value: '新闻'
                },
                {
                    label: '图集',
                    value: '图集'
                },
                {
                    label: '视频',
                    value: '视频'
                }
            ],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            listLoading: false
        }
    },
    mounted() {
        this.pageSize = this.personalConfig.tableRowShow
        this.getUrlfromPeople();
        this.getUrlfromActiveArea();
        this.importExcelURL = importExcel
    },
    methods: {
        // 获取信源添加人
        getUrlfromPeople() {
            getUrlfromPeople().then(res => {
                if (res.code == "00001") {
                    this.addPeoples = res.data.map(item => {
                        return {
                            label: item,
                            value: item
                        }
                    })
                    this.addPeoples.unshift({
                        'label': '全部',
                        'value': ''
                    })
                    this.form.addPeople = this.addPeoples[0].value
                }
                this.search()
            })
        },
        // 作用区域
        getUrlfromActiveArea() {
            getUrlfromActiveArea().then(res => {
                if (res.code == "00001") {
                    this.activeAreas = res.data.map(item => {
                        return {
                            label: item,
                            value: item
                        }
                    })
                    this.activeAreas.unshift({
                        'label': '全部',
                        'value': ''
                    })
                    this.form.activeArea = this.activeAreas[0].value
                }
            })
        },
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            let params = {
                stime: this.form.starttime == '' ? '' : parseTime(new Date(this.form.starttime).getTime(), '{y}-{m}'),
                etime: this.form.endtime == '' ? '' : parseTime(new Date(this.form.endtime).getTime(), '{y}-{m}'),
                createuser: this.form.addPeople,
                sourcelevel: this.form.urlfromLevel,
                usearea: this.form.activeArea,
                sourcetype: this.form.sourcetype,
                urlfrom: this.form.urlfrom,
                homepage: this.form.homepage,
                page: this.currentPage,
                pagesize: this.pageSize,
                isreview: this.form.noAudit,
                sourcename: this.form.sourcename
            }
            this.listLoading = true
            getUrlfromLiveList(params).then(res => {
                if (res.code == "00001") {
                    if (res.data) {
                        this.tableData = res.data.data
                        this.total = res.data.count
                    } else {
                        this.tableData = []
                        this.total = 0
                    }
                }
                this.listLoading = false
            })
        },
        exportExcel() {
            var exportUrl = exportUrlfromExcel;
            exportUrl += 'json={"stime":' + '"' + this.form.starttime + '"'
            exportUrl += ',"etime":' + '"' + this.form.endtime + '"'
            exportUrl += ',"createuser":' + '"' + this.form.addPeople + '"'
            exportUrl += ',"sourcelevel":' + '"' + this.form.urlfromLevel + '"'
            exportUrl += ',"usearea":' + '"' + this.form.activeArea + '"'
            exportUrl += ',"sourcetype":' + '"' + this.form.sourcetype + '"'
            exportUrl += ',"urlfrom":' + '"' + this.form.urlfrom + '"'
            exportUrl += ',"homepage":' + '"' + this.form.homepage + '"'
            exportUrl += ',"page":' + '"' + this.currentPage + '"'
            exportUrl += ',"pageSize":' + '"' + this.pageSize + '"' + '}'
            console.log(exportUrl)
            window.location.href = exportUrl
        },
        addUrlfrom() {
            this.$emit('addUrlfrom', '4')
        },
        getStatus(isused, onlinetime) {
            if (isused == 1) {
                if ((new Date(onlinetime).getTime() - new Date().getTime()) <= 0) {
                    return '启用'
                } else {
                    return '开发中'
                }
            } else {
                return '停用'
            }
        },
        // 改变使用状态
        changeUseState(id, used) {
            this.$prompt('请输入理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: function(val) {
                    if (val == '' || val == null) {
                        return false
                    }
                },
                inputErrorMessage: '理由不能为空'
            }).then(({
                value
            }) => {
                let params = {
                    idx: id,
                    isused: used,
                    remark: parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}') + '-' + value
                }
                console.log(params)
                changeUseState(params).then(res => {
                    if (res.code == "00001") {
                        this.search()
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    }
                })

            }).catch(() => {

            });
        },
        downloadExcel() {
            window.location.href = downloadUrlfromExcel
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
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
.table-div {
    display: flex;
    align-items: center;
    .label {
        width: 100px;
        text-align: right;
        font-weight: bold;
    }
}
</style>
