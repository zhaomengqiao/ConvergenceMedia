<template>
<section>
    <el-card :body-style="{paddingBottom: '0px'}">
        <el-form :inline="true" :model="form">
            <el-row>
                <el-form-item prop="appfrom">
                    <el-select v-model="form.appfrom" @change='changePlatform' class="select-platform">
                        <el-option :key="index" v-for="(app,index) in newsAppList" :label="app.label" :value="app.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item prop="newsType">
                        <el-select v-model="form.newsType" class="select-platform">
                            <el-option v-for="app in newsTypeListHasAll" :label="app.typeName" :value="app.typePy"></el-option>
                        </el-select>
                    </el-form-item> -->
                <el-form-item prop="nowAppForm">
                    <el-select v-model="form.pagenum" class="select-platform">
                        <el-option :key="index" v-for="(app,index) in pagenumOptionsHasAll" :label="app.label" :value="app.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="appfrom">
                    <el-select v-model="form.idx" class="select-platform">
                        <el-option :key="index" v-for="(app,index) in idxOptionsHasAll" :label="app.label" :value="app.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="timeQuantum">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="form.timeQuantum" type="datetimerange" placeholder="选择时间范围" @change="getTopTime">
                    </el-date-picker>
                </el-form-item>
            </el-row>
            <el-row>
                <el-select v-model="form.userName" class="select-platform">
                    <el-option :key="index" v-for="(item,index) in userNameList" :label="item.realname" :value="item.uname"></el-option>
                </el-select>
                <el-form-item>
                    <el-input v-model="form.title" placeholder="标题关键词查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.url" placeholder="新闻链接查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="search" @click="newsTopManager">搜索</el-button>
                </el-form-item>
                <!-- <el-checkbox v-model="expandAllRow" @change="tableKeyChange">展开所有行</el-checkbox> -->
            </el-row>
        </el-form>
    </el-card>
    <el-card style="margin-top:10px;" :body-style="{paddingBottom: '0px'}">
        <el-table :data="newsData" :default-expand-all="expandAllRow" :key="key" border highlight-current-row v-loading="listLoading" row-key="id" style="width: 100%;margin: 0 auto;">
            <!-- <el-table-column type="expand">
                  <template scope="props">
                      <div style="width:1111px">
                          <el-table
                              :data="props.row.childTable"
                              width="100%"
                              border>
                              <el-table-column
                                  prop="dt"
                                  label="日期"
                                  width="120">
                              </el-table-column>
                              <el-table-column
                                  prop="clickpv"
                                  label="点击PV"
                                  width="100">
                              </el-table-column>
                              <el-table-column
                                  prop="clickuv"
                                  label="点击UV"
                                  width="100">
                              </el-table-column>
                              <el-table-column
                                  prop="showpv"
                                  label="展现PV"
                                  width="100">
                              </el-table-column>
                              <el-table-column
                                  prop="showuv"
                                  label="展现UV"
                                  width="100">
                              </el-table-column>
                              <el-table-column
                                  prop="click_num"
                                  label="点击率PV"
                                  width="120">
                              </el-table-column>
                              <el-table-column
                                  prop="show_num"
                                  label="展现率PV"
                                  width="120">
                              </el-table-column>
                              <el-table-column
                                  prop="pv_seven_num"
                                  label="7天点击率PV"
                                  width="130">
                              </el-table-column>
                              <el-table-column
                                  prop="uv_seven_num"
                                  label="7天点击率UV"
                                  width="130">
                              </el-table-column>
                          </el-table>
                      </div>
                  </template>
                </el-table-column> -->
            <el-table-column prop="" label="标题" :show-overflow-tooltip="true" min-width="400">
                <template slot-scope="scope">
                        <a :href="newsData[scope.$index].content" target="_blank" >{{newsData[scope.$index].title}}</a>
                    </template>
            </el-table-column>
            <!--新闻状态 Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" v-if="item.prop == 'newsstatus'">
            </el-table-column>
            <el-table-column prop="newstype" label="投放栏目" :show-overflow-tooltip="true" min-width="120">
            </el-table-column>
            <el-table-column prop="provid" label="投放地域" :show-overflow-tooltip="true" min-width="120">
            </el-table-column>
            <el-table-column prop="newsstatus" label="新闻状态" align="center" width="100">
            </el-table-column>
            <el-table-column prop="createUser" label="操作人" width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="startTime" label="投放时间" width="170">
                <template slot-scope="scope">
                        <div class="block">
                            <span>{{ scope.row.startTime }}</span><br>
                            <span>{{ scope.row.endTime }}</span>
                        </div>
                    </template>
            </el-table-column>
            <el-table-column prop="" label="投放位置" align="center" width="100">
                <template slot-scope="scope">
                        <span>{{scope.row.pagenum == -1?'all':scope.row.pagenum}} - {{scope.row.idx}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="位置状态" width="100">
                <template slot-scope="scope">
                        <span v-if="scope.row.isoneself==0">非独占</span>
                        <span v-if="scope.row.isoneself==1">独占</span>
                    </template>
            </el-table-column>
            <el-table-column label="强制置顶" width="100">
                <template slot-scope="scope">
                        <span v-if="scope.row.issuper==0">非强制</span>
                        <span v-if="scope.row.issuper==1">强制</span>
                    </template>
            </el-table-column>
            <!--点击PV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'clickpv'">
            </el-table-column>
            <!--点击UV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'clickuv'">
            </el-table-column>
            <!--展现PV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'showpv'">
            </el-table-column>
            <!--展现UV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'showuv'">
            </el-table-column>
            <!--7天平均点击PV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'clickpv_avg'">
            </el-table-column>
            <!--7天平均点击UV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'clickuv_avg'">
            </el-table-column>
            <!--7天平均展现PV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'showuv_avg'">
            </el-table-column>
            <!--7天平均展现UV Begin-->
            <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" align="center" v-if="item.prop == 'showpv_avg'">
            </el-table-column>
            <!-- <el-table-column prop="apptypeid" label="投放APP" align="center">
                </el-table-column> -->
            <!-- <el-table-column prop="provid" label="投放地域" align="center" :show-overflow-tooltip="true" class-name="dialogArea">
                </el-table-column> -->
            <!-- <el-table-column prop="" label="屏幕" align="center" min-width="120" >
                    <template slot-scope="scope">
                        <el-select v-model="form.pagenum = scope.row.pagenum"  @change="nowItem.pagenum = form.pagenum" placeholder="请选择" size="mini" :disabled="new Date(scope.row.endTime).getTime() < new Date().getTime()">
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
                        <el-select v-model="form.idx = scope.row.idx" @change="nowItem.idx = form.idx" placeholder="请选择" size="mini":disabled="new Date(scope.row.endTime).getTime() < new Date().getTime()">
                            <el-option
                                v-for="item in idxOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column> -->

            <!-- <el-table-column prop="startTime" label="开始投放" min-width="220" align="center" size="mini">
                    <template  slot-scope="scope">
                        <div class="block">
                            <el-date-picker
                                v-model="form.tableStartTime = scope.row.startTime"
                                type="datetime"
                                :disabled="new Date(scope.row.endTime).getTime() < new Date().getTime()"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束投放" min-width="220" align="center" size="mini">
                    <template  slot-scope="scope">
                        <div class="block">
                            <el-date-picker
                                v-model="form.tableEndTime = scope.row.endTime"
                                type="datetime"
                                :disabled="new Date(scope.row.endTime).getTime() < new Date().getTime()"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                    </template>
                </el-table-column> -->
            <el-table-column label="操作" width="150" align="center" fixed="right">
                <template slot-scope="scope">
                        <span v-if=" new Date(scope.row.endTime).getTime() > new Date().getTime()">
                            <el-button type="primary" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                            <el-button type="danger" size="small" @click="handleEditor(scope.$index, scope.row)">修改</el-button>
                        </span>
                        <span v-else>数据已完成</span>
                    </template>
            </el-table-column>
        </el-table>
        <el-row class="toolbar">
            <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 50,100]" :page-size="pageSize" :current-page="currentPage" :total="total" style="float:right;">
            </el-pagination>
        </el-row>
        <div class="menu_slider" :class="edit_slide_show?'':'menu_slider_hide'">
            <el-button type="text" style="font-size:12px;color:#ccc;position:absolute;top:0px;left:10px;" @click="edit_slide_show=false">
                <i class="el-icon-close"></i>
            </el-button>
            <h2>{{ editForm.title }}</h2>
            <el-form :model="form" class="el_all_width">
                <el-form-item style="width:100%;margin-bottom:0">
                    <el-select v-model="editForm.appfrom" class="select-platform" size="small" style="width:100%;" :disabled="true">
                        <el-option :key="index" v-for="(app,index) in newsAppList" :label="app.label" :value="app.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top-select__input" @click.native='dialogHandleOpen(0)' style="width:100%;margin-bottom:0">
                    <el-input v-model="editForm.newstype" size="small" placeholder="请点击选择栏目" :disabled="true" class="disable-click"></el-input>
                </el-form-item>
                <el-form-item class="top-select__input" @click.native='dialogHandleOpen(2)' style="width:100%;margin-bottom:0">
                    <el-input v-model="editForm.provid" size="small" placeholder="请点击选择区域" :disabled="true" class="disable-click" style="width:100%"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="pagenum" style="width:100%;margin-bottom:0">
                            <el-select placeholder="请点击选择集合幕" size="small" v-model="editForm.pagenum" style="width:100%">
                                <el-option v-for="(item,index) in pagenumOptions" :key='index' :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="idx" style="width:100%;margin-bottom:0">
                            <el-select placeholder="请点击选择位置" size="small" v-model="editForm.idx" style="width:100%">
                                <el-option v-for="(item,index) in idxOptions" :key='index' :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" v-model="editTime" width="100%" type="datetimerange" placeholder="选择时间范围" @change="getEditTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="sourcetype" style="width:100%;margin-bottom:0" label="新闻类型：">
                    <el-select v-model="editForm.sourcetype" style="width:100%" size="small" :disabled="true">
                        <el-option v-for="(item,index) in typeOptions" :label="item.label" :key='index' :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="isoneself" label="独占" class="radio-el-form" style="width:100%;margin-bottom:0">
                    <el-radio-group v-model="editForm.isoneself" size="small" :disabled="true">
                        <el-radio v-for="(item,index) in dzOptions" :label="item.value" :key="index">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="issuper" label="强制置顶" class="radio-el-form" style="width:100%;margin-bottom:0">
                    <el-radio-group v-model="editForm.issuper" size="small" :disabled="true">
                        <el-radio v-for="(item,index) in qzOptions" :label="item.value" :key="index">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row style="margin-top:10px;">
                    <el-button type="primary" @click="saveEditor" :loading="saveEditLoading">置顶</el-button>
                </el-row>
            </el-form>
        </div>
    </el-card>
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
            	<el-button @click="handleCloseType">取 消</el-button>
                <el-button type="primary" @click="dialogHandleClose(0)">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="请选择地域:" :visible.sync="dialogVisibleArea" size="tiny" :before-close="handleCloseTypeArea" :close-on-click-modal="false">
        <template>
            <el-checkbox-group v-model="checkedArea" @change="handleCheckedAreaChange">
                <el-checkbox v-for="city in areas" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
        </template>
        <span slot="footer" class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary" @click="dialogHandleClose(2)">确 定</el-button>
        </span>
    </el-dialog>
</section>
</template>

<script>
import jsonp from 'jsonp';
import {
    parseTime,
} from '@/utils'
import {
    getNewsInfo,
    getNewsTopUser,
    hotNewsTopList,
    hotNewsTopManagerDel,
    hotNewsTopManagerUpdate,
    newsApp,
    queryPlatDetail,
    hotNewsType,
    NewsTopUtilsArea,
    checkStickIsConflict
} from '@/api/contentRecommend';

export default {
    data() {
        var timeHorizon = "";
        var today = new Date().setHours(23, 59, 59);
        var threeDay = today - 3600 * 1000 * 24 * 3;
        return {
            editTime: '',
            expandAllRow: false,
            edit_slide_show: false,
            editForm: {
                appfrom: '',
                newstype: '',
                provid: '',
                pagenum: '',
                idx: '',
                sourcetype: '',
                isoneself: '',
                issuper: '',
                timeQuantum: []
            },
            provid: '',
            providVisible: false,
            tableConfigCheck: [],
            // 列表配置
            tableConfig: [

            ],
            newsTypeListHasAll: [],
            pagenumOptions: [{
                    value: 1,
                    label: '第一集合'
                },
                {
                    value: 2,
                    label: '第二集合'
                },
                {
                    value: 3,
                    label: '第三集合'
                },
                {
                    value: 4,
                    label: '第四集合'
                },
                {
                    value: 5,
                    label: '第五集合'
                }
            ],
            idxOptions: [{
                    value: 1,
                    label: '第一项'
                },
                {
                    value: 2,
                    label: '第二项'
                },
                {
                    value: 3,
                    label: '第三项'
                },
                {
                    value: 4,
                    label: '第四项'
                },
                {
                    value: 5,
                    label: '第五项'
                },
                {
                    value: 6,
                    label: '第六项'
                },
                {
                    value: 7,
                    label: '第七项'
                },
                {
                    value: 8,
                    label: '第八项'
                },
                {
                    value: 9,
                    label: '第九项'
                },
                {
                    value: 10,
                    label: '第十项'
                },
                {
                    value: 11,
                    label: '第十一项'
                },
                {
                    value: 12,
                    label: '第十二项'
                },
                {
                    value: 13,
                    label: '第十三项'
                },
                {
                    value: 14,
                    label: '第十四项'
                },
                {
                    value: 15,
                    label: '第十五项'
                },
                {
                    value: 16,
                    label: '第十六项'
                },
                {
                    value: 17,
                    label: '第十七项'
                },
                {
                    value: 18,
                    label: '第十八项'
                },
                {
                    value: 19,
                    label: '第十九项'
                },
                {
                    value: 20,
                    label: '第二十项'
                }
            ],
            pagenumOptionsHasAll: [{
                    value: '1',
                    label: '第一集合'
                },
                {
                    value: '2',
                    label: '第二集合'
                },
                {
                    value: '3',
                    label: '第三集合'
                },
                {
                    value: '4',
                    label: '第四集合'
                },
                {
                    value: '5',
                    label: '第五集合'
                }
            ],
            idxOptionsHasAll: [{
                    value: '1',
                    label: '第一项'
                },
                {
                    value: '2',
                    label: '第二项'
                },
                {
                    value: '3',
                    label: '第三项'
                },
                {
                    value: '4',
                    label: '第四项'
                },
                {
                    value: '5',
                    label: '第五项'
                },
                {
                    value: '6',
                    label: '第六项'
                },
                {
                    value: '7',
                    label: '第七项'
                },
                {
                    value: '8',
                    label: '第八项'
                },
                {
                    value: '9',
                    label: '第九项'
                },
                {
                    value: '10',
                    label: '第十项'
                },
                {
                    value: '11',
                    label: '第十一项'
                },
                {
                    value: '12',
                    label: '第十二项'
                },
                {
                    value: '13',
                    label: '第十三项'
                },
                {
                    value: '14',
                    label: '第十四项'
                },
                {
                    value: '15',
                    label: '第十五项'
                },
                {
                    value: '16',
                    label: '第十六项'
                },
                {
                    value: '17',
                    label: '第十七项'
                },
                {
                    value: '18',
                    label: '第十八项'
                },
                {
                    value: '19',
                    label: '第十九项'
                },
                {
                    value: '20',
                    label: '第二十项'
                }
            ],
            typeOptions: [{
                    value: 'news',
                    label: '新闻'
                },
                {
                    value: 'topic',
                    label: '专题'
                }
            ],
            dzOptions: [{
                    value: '0',
                    label: '否'
                },
                {
                    value: '1',
                    label: '是'
                },
            ],
            qzOptions: [{
                    value: '0',
                    label: '否'
                },
                {
                    value: '1',
                    label: '是'
                },
            ],
            userNameList: [],
            form: {
                startTime: '',
                endTime: '',
                tableStartTime: '',
                tableEndTime: '',
                appfrom: '',
                pagenum: '',
                idx: '',
                newsType: '',
                timeQuantum: [threeDay, today],
                url: '',
                keywords: '',
                userName: '',
                title: '',
                createuser: ''
            },
            newsAppList: [],
            newsData: [],
            listLoading: false,
            total: 20,
            currentPage: 1,
            startPage: 1,
            pageSize: 10,
            dialogVisibleType: false,
            dialogVisibleArea: false,
            checkedType: [],
            newsTypeList: [],
            checkedArea: [],
            areas: [],
            typeIschange: false,
            areaIschange: false,
            appfrom: '',
            clickIndex: 1,
            // 修改时单条信息
            nowItem: {

            },
            saveEditLoading: false,
            key: 0,
            dvPVNum: 0
        }
    },
    mounted() {
        this.form.endTime = this.format(Date.now(), 'yyyy-MM-dd HH:mm:ss');
        this.form.startTime = this.format((Date.now() - 86400000), 'yyyy-MM-dd HH:mm:ss');
        this.newsTopInfo();
        this.getNewsTopUser()
    },
    methods: {
        // 获取用户名
        getNewsTopUser() {
            let params = {
                channel: 1,
                sttime: this.form.startTime,
                endtime: this.form.endTime
            }
            getNewsTopUser(params).then(res => {
                if (res.code == "00001") {
                    this.userNameList = res.data;
                    this.userNameList.unshift({
                        'realname': '全部',
                        'uname': ''
                    })
                    this.form.userName = this.userNameList[0].uname
                }
            })
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
                index: this.form.idx,
                pagenum: this.form.pagenum,
                showpagenum: this.startPage,
                showpagesize: this.pageSize,
                channel: '1',
                createuser: this.form.userName,
                title: this.form.title,
                id: '',
                appfrom: this.form.appfrom,
                url: this.form.url
            }
            this.listLoading = true;
            hotNewsTopList(params).then((res) => {
                var urlids = '';
                var urlidArr = []
                if (res.code === '00001') {
                    // 清空当前信息
                    this.nowItem = {}
                    for (var i = 0; i < res.data.list.length; i++) {
                        var arr = res.data.list[i].provid.split(',');
                        arr.remove('checkall');
                        arr.remove('notall');
                        res.data.list[i].provid = arr.join(',');
                    }
                    this.newsData = res.data.list;
                    var _this = this;
                    this.newsData.forEach(item => {
                        if (item.sourcetype == "news") {
                            if (item.urlId != '') {
                                urlidArr.push(item.urlId)
                            }
                        }
                        _this.dcGetPv(item)
                    })
                    urlids = urlidArr.join(",")
                    this.getNewsInfo(urlids, res.data.list)
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
            this.editForm = Object.assign({}, row);
            this.edit_slide_show = true;
            this.checkedType = row.newstype.split(',')
            this.checkedArea = row.provid.split(',')
            this.editTime = [this.editForm.startTime, this.editForm.endTime]
        },
        // 保存修改
        saveEditor() {
            // var tableStartTime = this.format(this.form.tableStartTime, 'yyyy-MM-dd HH:mm:ss')
            // var tableEndTime = this.format(this.form.tableEndTime, 'yyyy-MM-dd HH:mm:ss')
            var source = '';
            var imgsrc = '';
            if (this.editForm.source) {
                source = this.editForm.source
            };
            if (this.editForm.imgsrc) {
                imgsrc = this.editForm.imgsrc
            };
            if (this.areaIschange == false && this.checkedArea.length == 0) {
                this.checkedArea = this.editForm.provid.split(',')
            };
            if (this.checkedArea.length == this.areas.length && this.checkedArea.indexOf('checkall') == -1 && this.checkedArea.indexOf('notall') == -1) {
                this.checkedArea.unshift('checkall')
            } else {
                if (this.checkedArea.indexOf('checkall') == -1 && this.checkedArea.indexOf('notall') == -1) {
                    this.checkedArea.unshift('notall')
                }
            }
            if (this.typeIschange == false && this.checkedType.length == 0) {
                this.checkedType = this.editForm.newstype.split(',')
            };
            // 单条信息赋值
            this.nowItem.pagenum = this.editForm.pagenum;
            this.nowItem.idx = this.editForm.idx;
            this.nowItem.type = this.checkedType;
            this.nowItem.issuper = this.editForm.issuper;
            this.nowItem.title = this.editForm.title
            // 东方头条/头条/第一集合/第一项/强制置顶 置顶内容标题长度不得超过33字符
            // 计算字符
            String.prototype.gblen = function() {
                var len = 0;
                for (var i = 0; i < this.length; i++) {
                    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
                return len;
            }
            var _this = this;
            var typeHasToutiao = false
            this.checkedType.forEach(item => {
                if (item == "头条") {
                    typeHasToutiao = true
                }
            })
            if (_this.form.appfrom == "toutiao" && _this.nowItem.pagenum == "1" && _this.nowItem.idx == "1" && _this.nowItem.issuper == "1" && typeHasToutiao) {
                var titleLength = this.nowItem.title.gblen()
                if (titleLength > 33) {
                    this.$message({
                        message: '置顶标题超过16.5字，请修改。',
                        type: 'warning'
                    });
                    return false
                }
            }
            var params = {
                id: this.editForm.id,
                channel: 1,
                content: this.editForm.content,
                title: this.editForm.title,
                newstype: this.checkedType.join(','),
                idx: this.editForm.idx,
                pagenum: this.editForm.pagenum,
                startTime: this.format(this.editForm.startTime, 'yyyy-MM-dd HH:mm:ss'),
                endTime: this.format(this.editForm.endTime, 'yyyy-MM-dd HH:mm:ss'),
                sourcetype: this.editForm.sourcetype,
                isoneself: this.editForm.isoneself,
                apptypeid: this.editForm.apptypeid,
                provid: this.checkedArea.join(','),
                appfrom: this.form.appfrom,
                issuper: this.editForm.issuper,
                islocal: this.editForm.isLocal,
                source: source,
                imgs: imgsrc,
                bigPic: 0
            };
            this.saveEditLoading = true
            checkStickIsConflict(params).then(res => {
                if (res.code == '00001') {
                    hotNewsTopManagerUpdate(params).then(res => {
                        if (res.code == '00001') {
                            this.newsTopManager();
                            this.edit_slide_show = false
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.saveEditLoading = false
                        }
                    })
                } else if (res.code == '00100') {
                    this.$message({
                        message: res.ret,
                        type: 'warning'
                    });
                    this.saveEditLoading = false
                } else if (res.code == '00101') {
                    this.$confirm('是否确认修改?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        hotNewsTopManagerUpdate(params).then(res => {
                            if (res.code == '00001') {
                                this.newsTopManager();
                                this.edit_slide_show = false
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.saveEditLoading = false
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });
                        this.saveEditLoading = false
                    });
                }
            })
        },
        handleDel(index, row) { // 手选删除
            let param = {
                id: row.id,
                channel: '1'
            }
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                hotNewsTopManagerDel(param).then((res) => {
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
            //this.startPage = val;
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
            this.newsAppList = [{
                label: '热文置顶',
                value: 'hotntt'
            }];
            this.form.appfrom = this.newsAppList[0].value;
            this.newsTopManager();
            // let user = localStorage.getItem('user'),username='';
            // if (user) {
            //     user = JSON.parse(user);
            //     username = user.username || '';
            // };
            // let param='userName='+username+'&url=news/recommend';
            // newsApp(param).then((res)=>{
            //     if(res.code === '00001'){
            //         this.newsAppList=res.data;
            //         this.form.appfrom=this.newsAppList[0].value;
            //         this.newsTopManager();
            //     }
            // });
        },
        queryPlatDetail() {
            let para = 'area=' + this.form.appfrom;
            queryPlatDetail(para).then((res) => {
                if (res.code === '00001' && res.data) {
                    this.appfrom = res.data.appfrom;
                    // 新闻类型回显
                    var sourcetype = res.data.sourcetype;
                    var sourcetypeArr = sourcetype.split(',');
                    for (let j = 0, leng = sourcetypeArr.length; j < leng; j++) {
                        if (sourcetypeArr[j] === 'news') {
                            this.typeOptions.push({
                                value: sourcetypeArr[j],
                                label: '新闻'
                            })
                        } else if (sourcetypeArr[j] === 'topic') {
                            this.typeOptions.push({
                                value: sourcetypeArr[j],
                                label: '专题'
                            })
                        } else if (sourcetypeArr[j] === 'otherlink') {
                            this.typeOptions.push({
                                value: sourcetypeArr[j],
                                label: '外链'
                            })
                        } else if (sourcetypeArr[j] === 'vote') {
                            this.typeOptions.push({
                                value: sourcetypeArr[j],
                                label: '投票'
                            })
                        } else if (sourcetypeArr[j] === 'adv') {
                            this.typeOptions.push({
                                value: sourcetypeArr[j],
                                label: '广告'
                            })
                        } else if (sourcetypeArr[j] === 'adv_h5') {
                            this.typeOptions.push({
                                value: sourcetypeArr[j],
                                label: 'h5广告'
                            })
                        }
                    }
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
                typeOptions.checkedCities = event ? cities : [];
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
                area: this.form.appfrom
            }

            function compare(property) {
                return function(a, b) {
                    var value1 = a[property] == null ? 0 : 1;
                    var value2 = b[property] == null ? 0 : 1;
                    return value2 - value1;
                }
            }
            hotNewsType(params).then(res => {
                if (res.data) {
                    this.newsTypeList = res.data;
                    for (var i = 0; i < this.newsTypeList.length; i++) {
                        this.newsTypeList[i].indeterminate = false;
                        this.newsTypeList[i].checkedCities = [];
                        this.newsTypeList[i].checkAll = false;

                    }
                    this.newsTypeList.sort(compare('children'));
                    this.newsTypeListHasAll = this.newsTypeList.slice();
                    this.newsTypeListHasAll.unshift({
                        typeName: '全部',
                        typePy: ''
                    })
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
                    checkedCities.push(item.checkedCities);
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
            console.log(checkedCities);
            console.log(newstype)
            this.checkedType = [...newstype, ...checkedCities];
            console.log(this.checkedType)
            this.editForm.newstype = this.checkedType.join(',')
            this.typeIschange = true;
            this.dialogVisibleType = false
        },
        // 列表查询的时间
        getTopTime() {
            if (this.form.timeQuantum.length != 0) {
                this.form.startTime = this.form.timeQuantum[0]
                this.form.endTime = this.form.timeQuantum[1]
            }
            this.getNewsTopUser()
        },
        // 栏目、地域
        dialogHandleOpen(index) {
            if (index === 0) {
                this.dialogVisibleType = true;
                this.checkedType = this.editForm.newstype.split(',')
                this.typeIschange = true;
            } else if (index === 2) {
                this.dialogVisibleArea = true;
                this.checkedArea = this.editForm.provid.split(',')
                this.areaIschange = true;
            }
        },
        dialogHandleClose(index) {
            if (index == 0) {
                let checkedCities = [];
                this.newsTypeList.map(function(item) {
                    if (item.checkedCities.length == 0) {
                        return null
                    } else {
                        checkedCities.push(item.checkedCities);
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

                this.editForm.newstype = [...newstype, ...checkedCities].join(',');
                this.dialogVisibleType = false;
            } else {
                // this.form.provid=this.provid;
                this.editForm.provid = this.checkedArea.join(',');
                this.dialogVisibleArea = false;
            }
        },
        //dc 接口
        dcGetPv(itemData) {
            itemData.childTable = []
            var startTime = itemData.startTime==''?'':parseTime(itemData.startTime, '{y}{m}{d}')
            var endTime = itemData.endTime==''?'':parseTime(itemData.endTime, '{y}{m}{d}')
            window['dcPv' + itemData.urlId] = function(data) {
                if (data.code === 200) {
                    // 测试
                    // var obj = {}
                    // obj.clickpv = 1;
                    // obj.clickuv = 2;
                    // obj.showpv = 3;
                    // obj.showuv = 4;
                    // obj.clickpv_avg = 5;
                    // obj.clickuv_avg = 6;
                    // obj.showuv_avg = 7;
                    // obj.showpv_avg = 8;
                    // if(obj.showuv_avg!=0){
                    //     obj.pv_seven_num = ((obj.clickpv_avg*10000)/(obj.showpv_avg*10000)).toFixed(4)*100 + '%'
                    // }
                    // if(obj.showuv_avg!=0){
                    //     obj.uv_seven_num = ((obj.clickuv_avg*10000)/(obj.showuv_avg*10000)).toFixed(4)*100 + '%'
                    // }
                    // itemData.childTable.push(obj)
                    if (data.datalist) {
                        data.datalist.forEach(item => {
                            if (item.clickuv) {
                                item.click_num = ((item.clickpv * 10000 * 100) / (item.showpv * 10000)).toFixed(2) + '%'
                            }
                            if (item.clickuv) {
                                item.show_num = ((item.clickuv * 10000 * 100) / (item.showuv * 10000)).toFixed(2) + '%'
                            }
                            if (item.showpv_avg != 0) {
                                item.pv_seven_num = ((item.clickpv_avg * 10000 * 100) / (item.showpv_avg * 10000)).toFixed(2) + '%'
                            }
                            if (item.showuv_avg != 0) {
                                item.uv_seven_num = ((item.clickuv_avg * 10000 * 100) / (item.showuv_avg * 10000)).toFixed(2) + '%'
                            }
                        })
                        itemData.childTable = data.datalist
                    }
                } else {
                    console.log('fail')
                }
            }
            let url = 'http://tongji.021.com/datacenterapi/topnewsgatherdata/topnewsgather?callbackparam=' + 'dcPv' + itemData.urlId
            let queryParam = '&startDate=' + startTime + '&endDate=' + endTime + '&urlid=' + itemData.urlId + '&app=' + itemData.apptypeid + '&idx=' + itemData.idx + '&callback';
            jsonp(url, {
                'param': queryParam,
                'name': 'callback'
            }, function(err, data) {

            });
        },
        tableKeyChange() {
            this.key = this.key + 1
        },
        getEditTime(val) {
            console.log(val)
            this.editForm.startTime = this.editTime[0];
            this.editForm.endTime = this.editTime[1];
        },
        // 查询多条新闻信息
        getNewsInfo(urlids, listData) {
            let params = {
                urlids: urlids
            }
            if (urlids != '') {
                getNewsInfo(params).then(res => {
                    if (res.code == "00001") {
                        var data = res.data
                        listData.forEach(item => {
                            if (item.sourcetype == 'news') {
                                item.isblack = data[item.urlId] ? data[item.urlId].isblack : ''
                                item.isban = data[item.urlId] ? data[item.urlId].isban : ''
                                // 判断状态
                                if (item.isban == 1) {
                                    item.newsstatus = "404"
                                } else if (item.isblack == 1) {
                                    item.newsstatus = "加黑"
                                } else if (item.isblack == '' && item.isban == '') {
                                    item.newsstatus = "未知"
                                } else {
                                    item.newsstatus = "正常"
                                }
                            }
                        })
                        this.key = this.key + 1;
                    }
                })
            } else {
                listData.forEach(item => {
                    item.newsstatus = "--";
                    this.key = this.key + 1;
                })
            }
            this.newsData = listData
            this.key = this.key + 1;
        }
    },
    watch: {
        'tableConfigCheck': function() {
            this.key = this.key + 1;
        }
    }
}
</script>

<style scoped lang="scss">
.box_img {
    padding: 10px 0 !important;
}
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
.menu_slider {
    width: 320px;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    position: fixed;
    right: 0;
    border: 1px solid #e5e5e5;
    top: 122px;
    transform: translateX(0px);
    box-shadow:0 2px 4px #e5e5e5,
    /*左边阴影*/
    0 0 0 #000,
    /*右边阴影*/
    0 0 0 #000,
    /*顶部阴影*/
    0 2px 4px #e5e5e5;
    /*底边阴影*/
    &.menu_slider_hide {
        transform: translateX(490px);

    }
    transition: transform 0.3s;
    z-index: 100;
}
</style>
