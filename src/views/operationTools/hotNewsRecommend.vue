<template>
<section>
    <el-row :gutter="20" style="margin: 0 auto;" v-loading="listLoading">
        <!--搜索工具栏 Begin-->
        <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" prop="searchUrl">
				<el-input v-model.trim="form.searchUrl" placeholder="新闻ID或者URL" style="width: 300px;"></el-input>
				<el-button type="primary" icon="search" :disabled="isOtherLink" @click="getNewsTopInfo">搜索</el-button>
			</el-col> -->
        <!--搜索工具栏 End-->
        <el-col :span="18">
            <el-card class="box-card">
                <el-row style="margin-bottom:10px;">
                    <el-checkbox-group v-model="tableConfigCheck" class="pull-right">
                        <el-checkbox :label="item" v-for="(item,index) in tableConfig" :key="index">{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                </el-row>
                <el-table :data="newsData" height="215" border highlight-current-row row-key="id" :key="key" style="width: 100%;margin: 0 auto;">
                    <el-table-column prop="title" label="标题" min-width="400" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="newstype" label="栏目" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <!--新闻状态 Begin-->
                    <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="100" v-if="item.prop == 'newsstatus'">
                    </el-table-column>
                    <!--新闻状态 End-->
                    <el-table-column prop="cTitle" label="独占状态" width="110">
                        <template slot-scope="scope">
    							<span v-if="newsData[scope.$index].isoneself==0">非独占</span>
    							<span v-if="newsData[scope.$index].isoneself==1">独占</span>
    						</template>
                    </el-table-column>
                    <el-table-column prop="createUser" label="操作人" width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <!--分屏 Begin-->
                    <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="70" align="center" v-if="item.prop == 'pagenum'">
                        <template slot-scope="scope">
    							<span v-if="newsData[scope.$index].pagenum == -1">所有屏幕</span>
    							<span v-else>{{newsData[scope.$index].pagenum}}</span>
    						</template>
                    </el-table-column>
                    <!--分屏 End-->
                    <!--位置 Begin-->
                    <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="70" align="center" v-if="item.prop == 'idx'">
                    </el-table-column>
                    <!--位置 End-->
                    <!--区域 Begin-->
                    <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="150" :show-overflow-tooltip="true" v-if="item.prop == 'provid'">
                    </el-table-column>
                    <!--区域 End-->
                    <!--开始时间 Begin-->
                    <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="170" v-if="item.prop == 'startTime'">
                    </el-table-column>
                    <!--开始时间 End-->
                    <!--结束时间 Begin-->
                    <el-table-column :key="index" v-for="(item,index) in tableConfigCheck" :prop="item.prop" :label="item.label" width="170" v-if="item.prop == 'endTime'">
                    </el-table-column>
                    <!--结束时间 End-->
                </el-table>
            </el-card>
            <el-card style="margin-top:20px;">
                <el-row :gutter="20" style="margin: 0 auto;">
                    <el-row class="toolbar" style="padding-bottom: 10px;">
                        <el-col :span="19" class="news_title">{{newsInfo.contenttitle}}</el-col>
                        <el-col :span="5" style="float: right;">
                            <el-button-group>
                                <el-button type="primary" size="small" icon="arrow-left" v-if="page_num>1" @click="nextPage(0)">上一页</el-button>
                                <el-button type="primary" size="small" v-if="(page_total-page_num)>=1" @click="nextPage(1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <el-col :span="6" class='box_div' id='box_div' style="position:relative">
                        <div class="box_img" id="box_img" style="position:absolute;width:100%;column-count: 4;column-gap:20px;left: 0px;font-size:16px;" v-html="newsInfo.content">
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card :body-style="{padding: '0px'}">
                <div class="right_top_box">
                    <el-row style="padding-bottom: 0px;margin-bottom:10px;" prop="searchUrl">
                        <el-col :span="18">
                            <el-input v-model.trim="form.searchUrl" placeholder="新闻ID或者URL"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" icon="el-icon-search" :disabled="isOtherLink" @click="getNewsTopInfo"></el-button>
                        </el-col>
                    </el-row>
                    <el-row v-if="!isOtherLink">
                        <!-- <el-row style="margin-bottom:6px;">
								<el-input v-model="newsInfo.contenttitle" placeholder="请输入标题" size="small" :disabled="true"></el-input>
							</el-row> -->
                        <el-row style="margin-bottom:6px;">
                            <div style="display:inline-block">
                                <span style="font-weight:700;margin-right:10px;">状态:</span>
                                <span>{{ form.status }}</span>
                                <el-button size="small" :loading="load.removeblack" @click="removeblack" style="margin-left:10px;" type="primary" v-if="form.status == '加黑'&&form.appfrom=='toutiao'">撤销加黑</el-button>
                            </div>
                            <div style="display:inline-block;margin-left:20px;">
                                <span style="font-weight:700;margin-right:10px;">分类:</span>
                                <span>{{ maintype }}</span>
                            </div>
                        </el-row>
                        <el-row :gutter="10" style="margin-bottom:10px;">
                            <div :span="8" v-if="form.imgList.length!=0" class="pull-left" style="overflow:hidden;height:80px;margin-right:10px;width:80px;background-color:#e5e5e5;position:relative" v-for="item in form.imgList">
                                <img @click="imgShow=true" :src="item.src" alt="" style="cursor:pointer;width:100%;position:absolute;top:50%;transform:translateY(-50%)">
                            </div>
                            <el-col v-if="form.imgList.length==0" :span="24" style="height:60px;line-height:60px;color:#666;text-align:center">
                                暂无封面
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row v-if="isOtherLink" style="margin-bottom:10px;">
                        <el-form :model="form">
                            <el-form-item label="" prop="title" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
                                <el-input v-model.trim="form.title" placeholder="请输入标题" size="small"></el-input>
                            </el-form-item>
                            <el-form-item label="" :rules="[{ required: true, message: '请输入来源', trigger: 'blur' }]">
                                <el-input v-model="form.source" placeholder="请输入来源" size="small"></el-input>
                            </el-form-item>
                            <el-form-item label="是否大图">
                                <el-radio v-model="form.bigPic" label="1" size="small">是</el-radio>
                            </el-form-item>
                            <el-form-item label="黑名单" v-show="isblacklist==1">
                                <el-tag :key="tag" v-for="tag in form.dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </el-form-item>
                            <el-upload class="small-upload" :action="imgUploadUrl" list-type="picture-card" accept='.jpg,.png' :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form>
                    </el-row>
                </div>
                <!--右侧工具栏 Begin-->
                <div style="padding: 0px 20px 20px 20px" class="el_all_width">
                    <el-form :inline="true" :model="form" ref="ruleForm" :rules="rules" label-position="left" label-width="85px">
                        <el-form-item prop="appfrom" label-width="80px" label="">
                            <!-- <el-input  v-model="form.appfrom" placeholder="请点击选择App"  :disabled="true"></el-input> -->
                            <el-select v-model="form.appfrom" @change='changePlatform' style="width:100%" size="small">
                                <el-option v-for="(app,index) in newsAppList" :label="app.label" :value="app.value" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" :model="form" :rules="rules" ref="topForm" label-position="left" label-width="85px">
                        <el-form-item class="top-select__input" @click.native='dialogHandleOpen(0)' prop="newstype" style="width:100%">
                            <el-input v-model="form.newstype" size="small" placeholder="请点击选择栏目" :disabled="true" class="disable-click"></el-input>
                        </el-form-item>

                        <el-form-item class="top-select__input" @click.native='dialogHandleOpen(2)' prop="provid" style="width:100%">
                            <el-input v-model="form.provid" size="small" placeholder="请点击选择区域" :disabled="true" class="disable-click" style="width:100%"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="pagenum" style="width:100%">
                                    <el-select placeholder="请点击选择集合幕" size="small" v-model="form.pagenum" @change='getNewsTopList'>
                                        <el-option v-for="(item,index) in selectOptions.idxOptions" :key='index' :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="idx" style="width:100%">
                                    <el-select placeholder="请点击选择位置" size="small" v-model="form.idx" @change='getNewsTopList'>
                                        <el-option v-for="(item,index) in selectOptions.areasOptions" :key='index' :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item prop="timeQuantum" style="width:100%">
                            <el-date-picker size="small" style="width:100%" format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" v-model="form.timeQuantum" type="datetimerange" placeholder="选择时间范围" @change="getTopTime">
                            </el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item prop="endTime">
	    						<el-date-picker format="yyyy-MM-dd HH:mm:ss" size="small"
	                                  style="width:100%"
	    						      v-model="form.endTime"
	    						      type="datetime"
	    						      placeholder="请选择结束时间">
							    </el-date-picker>
	    			    	</el-form-item> -->
                        <el-form-item prop="sourcetype" style="width:100%">
                            <el-select v-model="form.sourcetype" @change="changeSourceType" style="width:100%" size="small">
                                <el-option v-for="(item,index) in selectOptions.typeOptions" :label="item.label" :key='index' :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="isoneself" label="独占" class="radio-el-form">
                            <el-radio-group v-model="form.isoneself" size="small">
                                <el-radio v-for="(item,index) in selectOptions.dzOptions" :label="item.value" :key="index">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="issuper" label="强制置顶" class="radio-el-form">
                            <el-radio-group v-model="form.issuper" size="small">
                                <el-radio v-for="(item,index) in selectOptions.qzOptions" :label="item.value" :key="index">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-row>
                            <el-button type="primary" @click="handleSave" :disabled="form.status=='审核中'||form.status=='404'">置顶</el-button>
                        </el-row>
                    </el-form>
                    <!--右侧工具栏 End-->
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-dialog title="选择栏目" :visible.sync="typeVisible" size='small' :before-close="handleCloseType" :close-on-click-modal="false">
        <div>
            <el-checkbox-group v-model="newstype">
                <el-row :gutter="10">
                    <div v-for="(type,index) in newsTypeList" style="float: left;padding: 5px;width: 100px;" :id="type.typePy">
                        <el-checkbox v-if="type.children==null" :label="type.typeName" :key="type.typeId">{{type.typeName}}</el-checkbox>
                        <el-checkbox v-else v-model="type.checkAll" :indeterminate="type.indeterminate" :label="type.typeName" @change="handleCheckAllChange($event,type,index)">{{type.typeName}}</el-checkbox>
                        <div v-if='type.checkedCities.length!=0||type.checkAll'>
                            <el-checkbox-group v-model="type.checkedCities" @change="handleCheckedCitiesChange(type.checkedCities,type,index)">
                                <el-checkbox v-for="(typec,indexc) in type.children" :label="typec.typeName" :key="typec.typeId">{{typec.typeName}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </el-row>
            </el-checkbox-group>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCloseType">取 消</el-button>
            <el-button type="primary" @click="dialogHandleClose(0)">确定</el-button>
        </div>
    </el-dialog>

    <!-- <el-dialog title="选择栏目" :visible.sync="appVisible"   :before-close="handleCloseApp" >
				<div>
					<el-checkbox-group v-model="appfrom" >
				     <el-checkbox v-for="app in newsAppList" :label="app" :key="app">{{app}}</el-checkbox>
				  	</el-checkbox-group>
				</div>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="handleCloseApp">取 消</el-button>
				    <el-button type="primary" @click="dialogHandleClose(1)">确定</el-button>
				</div>
			</el-dialog> -->

    <el-dialog title="选择地区" :visible.sync="providVisible" :before-close="handleClosePro" :close-on-click-modal="false">
        <div style="height:250px">
            <el-checkbox-group v-model="provid">
                <template v-for="areas in newsAreasList">
						  <el-col :span="4" style='padding: 5px 0;'> <el-checkbox  :label="areas" :key="areas">{{areas}}</el-checkbox></el-col>
					</template>
            </el-checkbox-group>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClosePro">取 消</el-button>
            <el-button type="primary" @click="dialogHandleClose(2)">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow" :close-on-click-modal="false">
        <el-carousel height="450px">
            <el-carousel-item v-for="(item,index) in form.imgList" :key="index">
                <img :src="item.src" alt="" style="height:100%;display:block;margin: 0 auto">
            </el-carousel-item>
        </el-carousel>
    </el-dialog>
</section>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import imagesLoaded from 'imagesloaded'
import {
    parseTime,
} from '@/utils'
import { contentToHtml } from '@/utils/contentTransform'
import { removeblack, getfileUpload } from '@/api/operationTools'
import {
    getHotNewsInfo,
    newsAreas,
    hotNewsType,
    hotNewsTopSave,
    hotNewsTopList,
    hotNewsSearchTop,
    queryPlatDetail,
    hotCheckStickIsConflict
} from '@/api/contentRecommend';

export default {
    data() {
        return {
            key: 0,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            load: {
                removeblack: false
            },
            maintype: '',
            imgShow: false,
            tableConfigCheck: [],
            tableConfig: [{
                    prop: "pagenum",
                    label: "分屏"
                },
                {
                    prop: "idx",
                    label: "位置"
                },
                {
                    prop: "provid",
                    label: "区域"
                },
                {
                    prop: "startTime",
                    label: "开始时间"
                },
                {
                    prop: "endTime",
                    label: "结束时间"
                },
                {
                    prop: "newsstatus",
                    label: "新闻状态"
                }
            ],
            checkedCities: [],
            saveUrl: '',
            form: {
                timeQuantum: '',
                searchUrl: '',
                content: '',
                endTime: '',
                idx: '1',
                maintype: '',
                isoneself: '0',
                pagenum: '1',
                sourcetype: '',
                appfrom: '',
                apptypeid: '',
                provid: '',
                newstype: '',
                sourcetype: '',
                issuper: '0',
                islocal: '',
                startTime: '',
                title: '',
                source: '',
                imgsrc: [],
                bigPic: '0',
                dynamicTags: [],
                sendAppfrom: '',
                imgList: [],
                status: '',
                rowkey: ''
            },
            loadOptions: true,
            isAuth: {
                handleSave: false,
            },
            imgUploadUrl: '',
            isOtherLink: false,
            dialogImageUrl: '',
            dialogVisible: false,
            appfrom: [],
            provid: [],
            newstype: [],
            typeVisible: false,
            appVisible: false,
            providVisible: false,
            pagenum: [],
            newsTypeList: [],
            newsAppList: ['DFTT'],
            newsAreasList: [],
            selectOptions: {
                idxOptions: [{
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
                areasOptions: [{
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
                ]
            },
            permission: 'toutiao',
            newsData: [],
            rules: {
                appfrom: [{
                    required: true,
                    message: '请选择操作平台',
                    trigger: 'blur'
                }, ],
                pagenum: [{
                    required: true,
                    message: '请选择集合幕',
                    trigger: 'blur'
                }, ],
                idx: [{
                    required: true,
                    message: '请选择位置',
                    trigger: 'blur'
                }, ],
                // timeQuantum: [
                // {required: true, message: '请选择置顶时间', trigger: 'blur' },
                // ],
                // startTime: [
                //   { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' },
                // ],
                // endTime: [
                //   { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' },
                // ],
                sourcetype: [{
                    required: true,
                    message: '请选择来源类型',
                    trigger: 'blur'
                }, ],
                isoneself: [{
                    required: true,
                    message: '请选择是否独占',
                    trigger: 'blur'
                }, ],
                issuper: [{
                    required: true,
                    message: '请选择是否强制置顶',
                    trigger: 'blur'
                }, ]
            },
            newsInfo: '',
            box_width: '',
            cont_width: '',
            page_total: 0,
            page_num: 1,
            listLoading: true,
            // newstypeShow: true,
            isblacklist: 0,
            inputVisible: false,
            inputValue: '',
            clickIndex: 1
        }
    },
    activated() {
        this.newsTopInfo();
        this.imgUploadUrl = getfileUpload;

        let query = this.$route.query;
        if (query.data && query.data.rowkey && this.$route.query.type == 'newsTop') {
            this.$refs.ruleForm.resetFields();
            this.form.searchUrl = query.data.rowkey;
            this.form.appfrom = query.data.platfrom;
            this.getNewsTopInfo();
        }
    },
    mounted() {
        this.newsTopInfo();
        // this.loadDataContent();
        this.imgUploadUrl = getfileUpload;

        let query = this.$route.query;
        if (query.data && query.data.rowkey && this.$route.query.type == 'newsTop') {
            this.$refs.ruleForm.resetFields();
            this.form.searchUrl = query.data.rowkey;
            this.form.appfrom = query.data.platfrom;
            this.getNewsTopInfo();
        }
        // console.log(this.getPerson.tableColumnShow)
        // if (this.getPerson.tableColumnShow == 2) {
        //     this.tableConfigCheck = this.tableConfig.slice()
        //     console.log(this.tableConfigCheck)
        // }
    },
    methods: {
        // 取出数组中相同的元素
        arrayIntersection(a, b) {
            var result = new Array();
            var c = b.toString();
            for (var i = 0; i < a.length; i++) {
                if (c.indexOf(a[i].toString()) > -1) {
                    result.push(a[i]);
                }
            }
            return result;
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
        changePlatform() {
            this.$refs.topForm.resetFields();
            this.queryPlatDetail();
            this.clickIndex = 1;
        },
        // loadDataContent(){
        // 	let path=this.$route.path;
        // 	if(path=='/newtop'){
        // 		this.box_width=document.getElementById("box_div").scrollWidth-20;//容器宽度
        //         this.cont_width = document.getElementById("box_img").offsetWidth;//内容宽度
        //         this.page_total=Math.ceil(~~this.box_width/~~this.cont_width);
        //        }
        // },
        nextPage(index) {
            if (index == 1 && this.page_total > 1) {
                document.getElementById('box_div').scrollLeft = (~~this.page_num * ~~this.cont_width) + (this.page_num * 15);
                this.page_num++;
            } else if (index == 0 && this.page_num > 1) {
                document.getElementById('box_div').scrollLeft = ((~~this.page_num - 2) * ~~this.cont_width) + ((~~this.page_num - 2) * 15);
                this.page_num--;
            }
        },
        changeSourceType() {
            if (this.form.sourcetype === 'otherlink' || this.form.sourcetype === 'adv_h5') {
                this.isOtherLink = true;
                this.form.islocal = 1;
                if (this.form.sourcetype === 'adv_h5') {
                    this.isblacklist = 1;
                } else {
                    this.isblacklist = 0;
                }
            } else {
                this.isOtherLink = false;
                this.form.islocal = 0;
            }
        },
        queryPlatDetail() {
            let para = 'area=' + this.form.appfrom;
            var _that = this;
            queryPlatDetail(para).then((res) => {
                if (res.code === '00001') {
                    _that.loadOptions = false;
                    let issuper = res.data.issuper,
                        sourcetype = res.data.sourcetype;
                    if (res.data.issuper) {
                        let issuperArr = issuper.split(','),
                            sourcetypeArr = sourcetype.split(',');
                        this.selectOptions.qzOptions = [];
                        this.selectOptions.typeOptions = [];
                        this.form.sendAppfrom = res.data.appfrom;
                        this.form.apptypeid = res.data.apptypeid;
                        for (let i = 0, len = issuperArr.length; i < len; i++) {
                            this.selectOptions.qzOptions.push({
                                value: issuperArr[i],
                                label: issuperArr[i] === '0' ? '否' : '是'
                            })
                        }
                        // 强制置顶赋值
                        this.form.issuper = this.selectOptions.qzOptions[0].value;
                        for (let j = 0, leng = sourcetypeArr.length; j < leng; j++) {
                            if (sourcetypeArr[j] === 'news') {
                                this.selectOptions.typeOptions.push({
                                    value: sourcetypeArr[j],
                                    label: '新闻'
                                })
                            } else if (sourcetypeArr[j] === 'topic') {
                                this.selectOptions.typeOptions.push({
                                    value: sourcetypeArr[j],
                                    label: '专题'
                                })
                            } else if (sourcetypeArr[j] === 'otherlink') {
                                this.selectOptions.typeOptions.push({
                                    value: sourcetypeArr[j],
                                    label: '外链'
                                })
                            } else if (sourcetypeArr[j] === 'vote') {
                                this.selectOptions.typeOptions.push({
                                    value: sourcetypeArr[j],
                                    label: '投票'
                                })
                            } else if (sourcetypeArr[j] === 'adv') {
                                this.selectOptions.typeOptions.push({
                                    value: sourcetypeArr[j],
                                    label: '广告'
                                })
                            } else if (sourcetypeArr[j] === 'adv_h5') {
                                this.selectOptions.typeOptions.push({
                                    value: sourcetypeArr[j],
                                    label: 'h5广告'
                                })
                            }
                        }
                        // 置顶类型赋值
                        this.form.sourcetype = this.selectOptions.typeOptions[0].value
                    }
                    // if(res.data.areashow == 1){
                    // 	this.newstypeShow = true;
                    // }else{
                    // 	this.newstypeShow = false;
                    // }

                    this.getNewsTopList();
                    this.newsType();
                    this.newsAreas()
                }
            });
        },
        newsTopInfo() {
            this.newsAppList = [{
                'label': '热文推荐',
                'value': 'hotntt'
            }];
            this.form.appfrom = this.newsAppList[0].value;
            this.queryPlatDetail();
            // let user = localStorage.getItem('user'),username='';
            // if (user) {
            // 	user = JSON.parse(user);
            // 	username = user.username || '';
            // };
            // let param='userName='+username+'&url=news/recommend';
            // newsApp(param).then((res)=>{
            // 	if(res.code === '00001'){
            // 		this.newsAppList = res.data;
            // 		this.form.appfrom = this.newsAppList[0].value;
            // 		// let dataArr=res.data;
            // 		// if(dataArr.length>0){
            // 		// 	let appObj={};
            // 		// 	this.newsAppList=[];
            // 		// 	for(let i=0,len=dataArr.length;i<len;i++){
            // 		// 		for(let key in dataArr[i]){
            // 		// 			if(i === 0){
            // 		// 				this.form.appfrom=key;
            // 		// 			}
            // 		// 			this.newsAppList.push({name:dataArr[i][key],value:key});
            // 		// 		}
            // 		// 	}
            // 		// }
            // 	}
            // });
        },
        newsAreas() {
            newsAreas('').then((res) => {
                this.newsAreasList = res.data;
                this.provid = this.newsAreasList;
                this.form.provid = this.newsAreasList.join(',');
            });
        },
        newsType() {
            var params = {
                parentId: '',
                area: this.form.appfrom
            };

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
                }
            });
        },
        getNewsTopList() {
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
            let para = {
                apptype: this.form.apptypeid,
                content: this.form.searchUrl,
                endtime: this.form.endTime==''?'':parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                index: this.form.idx,
                isoneself: this.form.isoneself,
                pagenum: this.form.pagenum,
                sourcetype: this.form.sourcetype,
                sttime: this.form.startTime==''?'':parseTime(this.form.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                showpagenum: '1',
                channel: '1',
                showpagesize: '20',
                id: '',
                appfrom: this.form.sendAppfrom
            }
            // if(this.form.searchUrl==''){
            // 	return ;
            // }
            this.listLoading = true;
            hotNewsTopList(para).then((res) => {
                if (res.code === '00001') {
                    for (var i = 0; i < res.data.list.length; i++) {
                        var arr = res.data.list[i].provid.split(',');
                        arr.remove('checkall');
                        arr.remove('notall');
                        res.data.list[i].provid = arr.join(',');
                    }
                    var urlids = '';
                    var urlidArr = []
                    // 测试数据
                    // res.data.list.unshift({
                    // 	appfrom: 'toutiao',
                    // 	apptypeid: 'DFTT',
                    // 	content: "http://ddtest.w.wcsapi.biz.matocloud.com/ddtest/160801143630885.html",
                    // 	createUser: "createUser",
                    // 	endTime: "2016-12-31 16:25:39",
                    // 	id: 999,
                    // 	idx: 1,
                    // 	isLocal: "",
                    // 	isoneself: "0",
                    // 	issuper: "1",
                    // 	newstype: "滚动,国内",
                    // 	pagenum: 1,
                    // 	provid: "北京,安徽,福建,甘肃,广东,广西,贵州,海南",
                    // 	source: "",
                    // 	sourcetype: "news",
                    // 	startTime: "2016-12-30 16:26:21",
                    // 	title: "测试数据",
                    // 	urlId: "171205140850561"
                    // })
                    res.data.list.forEach(item => {
                        if (item.sourcetype == "news") {
                            if (item.urlId != '') {
                                urlidArr.push(item.urlId)
                            }
                        }
                    })
                    urlids = urlidArr.join(",")
                    this.getNewsInfo(urlids, res.data.list)
                }
                this.listLoading = false;
            });

        },
        getNewsTopInfo() {
            let para = {
                url: this.form.searchUrl,
            }
            this.listLoading = true;
            hotNewsSearchTop(para).then((res) => {
                if (res.code == '00001' && res.data) {
                    this.newsInfo = res.data;
                    this.saveUrl = res.data.url;
                    this.maintype = res.data.urlmaintype
                    this.newsInfo.content = contentToHtml(this.newsInfo);
                    if (res.data.pushtypeid) {
                        let newstypeStr = res.data.pushtypeid,
                            newstypeArr = newstypeStr.split(',');
                        //this.newstype=newstypeArr;
                        var newsTypeList = [];
                        for (var i = 0; i < this.newsTypeList.length; i++) {
                            newsTypeList.push(this.newsTypeList[i].typeName)
                        }
                        var newstypeShowStr = this.arrayIntersection(newstypeArr, newsTypeList);
                        //this.form.newstype=newstypeShowStr.join(',');
                    } else {
                        //this.form.newstype='';
                        this.newstype = [];
                    }
                    this.form.title = res.data.contenttitle;
                    // 封面回显
                    console.log('即将执行eval封面回显')
                    if (res.data.minijs) {
                        this.form.imgList = eval(res.data.minijs)
                    }
                    console.log('eval执行完毕')
                    // 状态
                    if (res.data.isupload == '-1') {
                        this.form.status = '审核中'
                    } else if (res.data.isban == '1') {
                        this.form.status = '404'
                    } else if (res.data.isblack == '1') {
                        this.form.status = '加黑'
                    } else {
                        this.form.status = '正常'
                    }

                    this.form.rowkey = res.data.rowkey
                    // this.loadDataContent();
                }
                this.listLoading = false;
            });
            this.getNewsTopList();
        },
        handleClosePro(done) {
            // this.provid=this.form.provid;
            this.form.provid = this.provid.join(',');
            this.providVisible = false;
        },
        handleCloseType(done) {
            // this.newstype=this.form.newstype;
            this.form.newstype = this.newstype.join(',');
            this.typeVisible = false;
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
                this.newstype.map(function(item) {
                    if (item == undefined) {
                        return null
                    } else {
                        newstype.push(item);
                    }
                    return item
                });

                this.form.newstype = [...newstype, ...checkedCities].join(',');
                console.log(this.form.newstype);
                this.typeVisible = false;
            } else {
                // this.form.provid=this.provid;
                this.form.provid = this.provid.join(',');
                this.providVisible = false;
            }
        },
        dialogHandleOpen(index) {
            if (index === 0) {
                if (this.clickIndex == 1) {
                    this.newstype = [];
                    this.clickIndex++;
                }
                this.typeVisible = true;
            } else if (index === 2) {
                if (this.clickIndex == 1) {
                    this.provid = this.newsAreasList;
                    this.form.provid = this.provid.join(',');
                    this.clickIndex++;
                }
                this.providVisible = true;
            }
        },
        handleSave() { //置顶保存
            this.$refs.topForm.validate((valid) => {
                let providPrefix = 'notall,';
                if (this.newsAreasList.length === this.form.provid.split(',').length) {
                    providPrefix = 'checkall,';
                }
                if (valid) {
                    let contentUrl = ''
                    if(!this.newsInfo){
                        this.$message({
                            message: '该新闻暂无内容，无法置顶',
                            type: 'warning'
                        });
                        return
                    }
                    contentUrl = this.saveUrl
                    let para = {
                        content: contentUrl,
                        endTime: this.form.endTime==''?'':parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                        idx: this.form.idx,
                        isoneself: this.form.isoneself,
                        newstype: this.form.newstype,
                        provid: providPrefix + this.form.provid,
                        pagenum: this.form.pagenum,
                        sourcetype: this.form.sourcetype,
                        startTime: this.form.startTime==''?'':parseTime(this.form.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                        channel: '1',
                        // apptypeid:'DFTT',
                        // apptypeid:this.appObj[this.form.appfrom].apptypeid.toUpperCase(),
                        apptypeid: "HOTNTT",
                        issuper: this.form.issuper,
                        islocal: this.form.islocal,
                        appfrom: "hotntt",
                        title: this.form.title,
                        source: this.form.source,
                        imgs: this.form.imgsrc.length === 0 ? '' : this.form.imgsrc.join(','),
                        bigPic: this.form.bigPic
                    }
                    if (this.isblacklist == 1) {
                        para.blacklist = this.form.dynamicTags.join(',');
                    }
                    console.log(para)
                    if (para.content == '' || para.endTime == '' || para.startTime == '' || para.title == '' || para.appfrom == '' || para.apptypeid == '' || para.issuper == '' || para.isoneself == '' || para.newstype == '' || para.provid ==
                        '' || para.sourcetype == '' || para.pagenum == '' || para.idx == '') {
                        this.$alert('有数据为空，请完善数据', '提示', {
                            confirmButtonText: '确定'
                        });
                        return;
                    }
                    if (this.form.islocal) {
                        if (para.title == '' || para.source == '' || para.imgsrc == '' || para.bigPic == '') {
                            this.$alert('有数据为空，请完善数据', '提示', {
                                confirmButtonText: '确定'
                            });
                            return;
                        }
                    }
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
                    var newsTypeArr = this.form.newstype.split(',')
                    var _this = this;
                    var typeHasToutiao = false
                    newsTypeArr.forEach(item => {
                        if (item == "头条") {
                            typeHasToutiao = true
                        }
                    })
                    if (_this.form.appfrom == "toutiao" && _this.form.pagenum == "1" && _this.form.idx == "1" && _this.form.issuper == "1" && typeHasToutiao) {
                        var titleLength = this.newsInfo.contenttitle.gblen()
                        if (titleLength > 33) {
                            this.$message({
                                message: '置顶标题超过16.5字，请修改。',
                                type: 'warning'
                            });
                            return false
                        }
                    }
                    this.listLoading = true;
                    //debugger;
                    hotCheckStickIsConflict(para).then((res) => {
                        if (res.code === '00001') {
                            //debugger
                            hotNewsTopSave(para).then((res) => {
                                if (res.code === '00001') {
                                    this.listLoading = false;
                                    this.$notify({
                                        title: '成功',
                                        message: '保存置顶成功',
                                        type: 'success'
                                    });
                                    //debugger;
                                    // this.form = {
                                    // 	searchUrl:'',
                                    // 	content:'',
                                    // 	endTime:'',
                                    // 	idx:'',
                                    // 	maintype:'',
                                    // 	isoneself:'',
                                    // 	pagenum:'',
                                    // 	sourcetype:'',
                                    // 	sendAppfrom: 'toutiao',
                                    // 	appfrom:'',
                                    // 	apptypeid:'',
                                    // 	provid:'',
                                    // 	newstype:'',
                                    // 	sourcetype:'',
                                    // 	issuper:'',
                                    // 	islocal:'',
                                    // 	startTime:'',
                                    // 	title:'',
                                    // 	source:'',
                                    // 	imgsrc:[],
                                    // 	bigPic:'0',
                                    // 	dynamicTags: []
                                    // }
                                    this.newsInfo.contenttitle = '';
                                    this.newsInfo.content = ''
                                }
                            });
                        } else if (res.code === '00100') { // 该位置已经存在强制置顶记录 置顶用的
                            this.$alert('该位置已经存在强制置顶记录', '提示', {
                                confirmButtonText: '确定'
                            });
                            this.listLoading = false;
                            return;
                        } else if (res.code === '00101') { // 该位置已经存在独占置顶记录 置顶用的
                            this.$confirm('该位置已经存在独占置顶记录,是否继续？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                hotNewsTopSave(para).then((res) => {
                                    if (res.code === '00001') {
                                        this.$notify({
                                            title: '成功',
                                            message: '保存置顶成功',
                                            type: 'success'
                                        });
                                        this.newsInfo.contenttitle = '';
                                        this.newsInfo.content = ''
                                        // this.form = {
                                        // 	searchUrl:'',
                                        // 	content:'',
                                        // 	endTime:'',
                                        // 	idx:'',
                                        // 	maintype:'',
                                        // 	isoneself:'',
                                        // 	pagenum:'',
                                        // 	sourcetype:'',
                                        // 	appfrom:'',
                                        // 	sendAppfrom: 'toutiao',
                                        // 	apptypeid:'',
                                        // 	provid:'',
                                        // 	newstype:'',
                                        // 	sourcetype:'',
                                        // 	issuper:'',
                                        // 	islocal:'',
                                        // 	startTime:'',
                                        // 	title:'',
                                        // 	source:'',
                                        // 	imgsrc:[],
                                        // 	bigPic:'0',
                                        // 	dynamicTags: []
                                        // }
                                    }
                                    this.listLoading = false;
                                })
                            })
                        }
                    });
                }
            });
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleSuccess(res, file) { //上传成功
            this.form.imgsrc.push(res.url);
            //				  this.fileList2.push(res.url);
            if (this.form.imgsrc.length === 3) {
                document.getElementsByClassName('el-upload--picture-card')[0].style.display = "none";
            }
        },
        handleRemove(file) { //删除图片
            for (var i = 0; i < this.form.imgsrc.length; i++) {
                let urlimg = '';
                if (file.response == undefined) {
                    urlimg = file.url;
                } else {
                    urlimg = file.response.url;
                }

                if (this.form.imgsrc[i] == urlimg) {
                    this.form.imgsrc.splice(i, 1);
                    break;
                }
            };
            if (this.form.imgsrc.length < 3) {
                document.getElementsByClassName('el-upload--picture-card')[0].style.display = "inline-block";
            }
        },
        handleClose(tag) {
            this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.form.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 撤销
        removeblack() {
            var params = {
                param: {
                    rowkey: this.form.rowkey
                },
                platform: 'newsmanager',
                nowPlat: '东方头条',
                type: '文章'
            }
            this.load.removeblack = true;
            removeblack(params).then(res => {
                if (res.code == '00001') {
                    this.$notify({
                        title: '成功',
                        message: '撤销成功',
                        type: 'success'
                    });
                    this.getNewsTopInfo();
                }
                this.load.removeblack = false;
            })
        },
        // 查询多条新闻信息
        getNewsInfo(urlids, listData) {
            let params = {
                urlids: urlids
            }
            if (urlids != '') {
                getHotNewsInfo(params).then(res => {
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
                    }
                })
            } else {
                listData.forEach(item => {
                    item.newsstatus = "--"
                })
            }
            this.newsData = listData
        },
        getTopTime() {
            if (this.form.timeQuantum.length != 0) {
                this.form.startTime = this.form.timeQuantum[0]
                this.form.endTime = this.form.timeQuantum[1]
            }
        },
        loadDataContent() { //文章自适应分页
            document.getElementById('box_div').scrollLeft = 0;
            this.page_total = 0;
            this.page_num = 1; //初始化文章布局
            let b_width = document.getElementById("box_div");
            let c_width = document.getElementById("box_img");
            this.cont_width = c_width.offsetWidth; //内容宽度
            let cont_height = c_width.offsetHeight; //内容高度
            this.box_width = document.getElementById("box_div").scrollWidth - 30; //容器宽度
            let hack = document.getElementById("hack");
            if (hack == null) {
                c_width.innerHTML += '<div id="hack"></div>';
                hack = document.getElementById("hack");
            }
            let client_left = b_width.getBoundingClientRect().left;
            let hackLeft = (hack.getBoundingClientRect().left - client_left - 10) + document.getElementById('box_div').scrollLeft;
            let colWid = (this.cont_width - 60) / 4;
            console.log("内容总宽度：" + hackLeft);
            console.log("一列的宽度：" + colWid)
            let colNum = Math.ceil((hackLeft + 20) / (colWid + 20));
            if (colNum < 4) colNum = 4;
            this.page_total = Math.ceil(colNum / 4);
            let xNum = (this.page_total * 4) - colNum;
            document.getElementById("hack").style.height = (xNum * cont_height) + 'px';
        }
    },
    computed: {
        // ...mapGetters([
        //     'getPerson'
        // ]),
    },
    watch: {
        // 'getPerson.tableColumnShow': function() {
        //     if (this.getPerson.tableColumnShow == 2) {
        //         this.tableConfigCheck = this.tableConfig.slice()
        //     }
        // },
        'tableConfigCheck': function() {
            this.key = this.key + 1;
        },
        "newsInfo": function() {
            var _this = this;
            this.$nextTick(function() {
                let box_img = document.getElementById("box_img");
                imagesLoaded('#box_img', function() {
                    _this.loadDataContent();
                });

            })
        }
    }
}
</script>

<style scoped>
.el-form-item {
    margin-bottom: 5px;
}

.box_div {
    width: 100%;
    padding: 10px 10px;
    box-sizing: border-box;
    overflow: hidden;
}

.box_img {
    padding: 10px 0;
    box-sizing: border-box;
}

@media screen and (max-width:1369px) {
    .box_div {
        height: 210px;
    }
    .box_img {
        height: 200px;
    }
    .list-group {
        display: none;
    }
}

@media screen and (min-width:1367px) {
    .box_div {
        height: 300px;
    }
    .box_img {
        height: 290px;
    }
    .list-group {
        display: block;
    }
}

.box_toolbar {
    width: 90%;
    display: flex;
    flex-flow: row nowrap;
}

.box_radio {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
}

.cTag {
    margin: 0 5px;
}

.box_img img {
    width: auto;
}

.news_title {
    font-size: 20px;
}

.top-select__input {}

.right_top_box {
    position: relative;
    padding: 20px 20px 10px 20px;
    margin-bottom: 10px;
}

.right_top_box:after {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #ccc;
}
</style>
