<template>
<section>
    <el-row v-loading="listLoading">
        <el-col :span="11">
            <el-form label-position="right" :rules="rules" ref="ruleForm" :model="form">
                <div class="quality-search">
                    <div class="input-error content-black-tool" style="display:inline-block;width:75%">
                        <el-input v-model="form.purl" placeholder="请输入内容URL查询"></el-input>
                        <p v-if="urlError">已添至优质库</p>
                    </div>
                    <el-button type="primary" icon="search" @click="hQualityUrl" @keyup.enter.native="hQualityUrl">搜索</el-button>
                </div>
                <el-form-item label="原标题：" prop="title" :label-width="labelWidth">
                    <div style="position:relative" class='inputWidth'>
                        <el-input :maxlength="50" :minlength="5" type="textarea" autosize placeholder="请输入标题，5-50个汉字；" v-model.trim="form.title">
                        </el-input>
                        <img src="../../assets/audit_images/taobao.png" alt="" class="title-icon" v-if="hasTaobao">
                        <!-- <el-input  v-model.trim="form.title" :minlength='5' :maxlength='50' placeholder="请输入新闻标题，5-50个汉字；" @keyup.native="getfontNum"></el-input> -->
                        <div class="font-num">已输入字数<span :class="form.title.length>=50?'red':''">{{ form.title.length }}/50</span></div>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="分类：" :label-width="labelWidth" >
                        <el-cascader style="width: 280px;"
                            change-on-select
                            :options="newsTypeLevel"
                            v-model="form.maintype">
                        </el-cascader>
                    </el-form-item> -->
                <el-form-item label="分类：" :label-width="labelWidth">
                    <el-select v-model="form.searchClassify" placeholder="选择分类" :disabled="true">
                        <el-option v-for="item in qualityClassify" :key="item.typeId" :label="item.typeName" :value="item.typePy">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时效性：" :label-width="labelWidth">
                    <el-select v-model="form.timeliness" placeholder="选择时效性">
                        <el-option label="选择时效性" value="-1"></el-option>
                        <el-option label="非时效性" value="0"></el-option>
                        <el-option label="时效性" value="1"></el-option>
                        <el-option label="未知" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源：" prop="source" :label-width="labelWidth">
                    <el-input v-model="form.source" class='inputWidth' placeholder="请输入新闻来源，2-10个汉字"></el-input>
                </el-form-item>
                <el-form-item label="关键词：" :label-width="labelWidth">
                    <el-tag style='margin-right: 10px;' :key="tag" v-for="tag in form.keywords" :closable="true" :close-transition="false" @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input style="width: 100px;" class="input-new-tag" v-if="inputVisible" v-model.trim="inputValue" ref="saveTagInput" :maxlength='keywordsMax' size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                    </el-input>
                    <el-button class="button-new-tag" v-if="addTag<6" size="small" @click="showInput">添加关键词</el-button>
                </el-form-item>
                <el-form-item label="原封面图：" :label-width="labelWidth">
                    <!--<el-radio class="radio" v-model="form.imgtype" label="1">单图</el-radio>
                           <el-radio class="radio" v-model="form.imgtype" label="3">三图</el-radio>
                           <el-radio class="radio" v-model="form.imgtype" label="10">自动</el-radio>-->
                    优质的封面有利于推荐，请使用清晰度较高的图片，避免使用GIF、带大量文字的图片。
                    <div>
                        <el-upload :action="fileUpload" accept='.jpg,.png' list-type="picture-card" :file-list="fileListShow" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>

                        <el-dialog v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                </el-form-item>
                <div class="quality-content">
                    <!--副标题组件 固定五个-->
                    <!--内容1 Begin-->
                    <div class="quality-content__item">
                        <!-- <div class="quality-content__delete" @click="deleteQuality(1)">
                            <i class="el-icon-circle-close"></i>
                        </div> -->
                        <el-form-item :label="'副标题1：'" :label-width="labelWidth">
                            <div style="position:relative" class='inputWidth'>
                                <el-popover placement="top" width="200" trigger="focus" content="建议输入6至8个汉字">
                                    <el-input type="textarea" autosize slot="reference" placeholder="建议输入6至8个汉字" v-model.trim="qualityContent01.title">
                                    </el-input>
                                </el-popover>
                                <div class="font-num">已输入字数<span :class="countFontNum(qualityContent01.title)>=8?'red':''">{{ countFontNum(qualityContent01.title) }}/8</span></div>
                            </div>
                        </el-form-item>
                        <el-form-item :label="'内容封面1：'" :label-width="labelWidth">
                            <div>
                                <el-upload :action="fileUpload" accept='.jpg,.png' list-type="picture-card" :file-list="qualityContent01.img" :on-preview="handlePictureCardPreview" :objectBind="1" :on-success="subheadHandleSuccess" :on-remove="subheadHandleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>

                                <el-dialog v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </div>
                    <!--内容1 End-->
                    <!--内容2 Begin-->
                    <div class="quality-content__item">
                        <!-- <div class="quality-content__delete" @click="deleteQuality(2)">
                            <i class="el-icon-circle-close"></i>
                        </div> -->
                        <el-form-item :label="'副标题2：'" :label-width="labelWidth">
                            <div style="position:relative" class='inputWidth'>
                                <el-popover placement="top" width="200" trigger="focus" content="建议输入11至13.5个汉字">
                                    <el-input type="textarea" autosize slot="reference" placeholder="建议输入11至13.5个汉字；" v-model.trim="qualityContent02.title">
                                    </el-input>
                                </el-popover>
                                <div class="font-num">已输入字数<span :class="countFontNum(qualityContent02.title)>=13.5?'red':''">{{ countFontNum(qualityContent02.title) }}/13.5</span></div>
                            </div>
                        </el-form-item>
                        <el-form-item :label="'内容封面2：'" :label-width="labelWidth">
                            <div>
                                <el-upload :action="fileUpload" accept='.jpg,.png' list-type="picture-card" :file-list="qualityContent02.img" :on-preview="handlePictureCardPreview" :objectBind="2" :on-success="subheadHandleSuccess" :on-remove="subheadHandleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>

                                <el-dialog v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </div>
                    <!--内容2 End-->
                    <!--内容3 Begin-->
                    <div class="quality-content__item">
                        <!-- <div class="quality-content__delete" @click="deleteQuality(3)">
                            <i class="el-icon-circle-close"></i>
                        </div> -->
                        <el-form-item :label="'副标题3：'" :label-width="labelWidth">
                            <div style="position:relative" class='inputWidth'>
                                <el-popover placement="top" width="200" trigger="focus" content="建议输入14至15.5个汉字">
                                    <el-input type="textarea" autosize slot="reference" placeholder="建议输入14至15.5个汉字；" v-model.trim="qualityContent03.title">
                                    </el-input>
                                </el-popover>
                                <div class="font-num">已输入字数<span :class="countFontNum(qualityContent03.title)>=15.5?'red':''">{{ countFontNum(qualityContent03.title) }}/15.5</span></div>
                            </div>
                        </el-form-item>
                        <el-form-item :label="'内容封面3：'" :label-width="labelWidth">
                            <div>
                                <el-upload :action="fileUpload" accept='.jpg,.png' list-type="picture-card" :file-list="qualityContent03.img" :on-preview="handlePictureCardPreview" :objectBind="3" :on-success="subheadHandleSuccess" :on-remove="subheadHandleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>

                                <el-dialog v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </div>
                    <!--内容3 End-->
                    <!--内容4 Begin-->
                    <div class="quality-content__item">
                        <!-- <div class="quality-content__delete" @click="deleteQuality(4)">
                            <i class="el-icon-circle-close"></i>
                        </div> -->
                        <el-form-item :label="'副标题4：'" :label-width="labelWidth">
                            <div style="position:relative" class='inputWidth'>
                                <el-popover placement="top" width="200" trigger="focus" content="建议输入18至25个汉字">
                                    <el-input type="textarea" autosize slot="reference" placeholder="建议输入18至25个汉字；" v-model.trim="qualityContent04.title">
                                    </el-input>
                                </el-popover>
                                <div class="font-num">已输入字数<span :class="countFontNum(qualityContent04.title)>=25?'red':''">{{ countFontNum(qualityContent04.title) }}/25</span></div>
                            </div>
                        </el-form-item>
                        <el-form-item :label="'内容封面4：'" :label-width="labelWidth">
                            <div>
                                <el-upload :action="fileUpload" accept='.jpg,.png' list-type="picture-card" :file-list="qualityContent04.img" :on-preview="handlePictureCardPreview" :objectBind="4" :on-success="subheadHandleSuccess" :on-remove="subheadHandleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>

                                <el-dialog v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </div>
                    <!--内容4 End-->
                    <!--内容5 Begin-->
                    <div class="quality-content__item">
                        <!-- <div class="quality-content__delete" @click="deleteQuality(5)">
                            <i class="el-icon-circle-close"></i>
                        </div> -->
                        <el-form-item :label="'副标题5：'" :label-width="labelWidth">
                            <div style="position:relative" class='inputWidth'>
                                <el-popover placement="top" width="200" trigger="focus" content="建议输入5至50个汉字">
                                    <el-input type="textarea" autosize slot="reference" placeholder="建议输入5至50个汉字；" v-model.trim="qualityContent05.title">
                                    </el-input>
                                </el-popover>
                                <div class="font-num">已输入字数<span :class="countFontNum(qualityContent05.title)>=50?'red':''">{{ countFontNum(qualityContent05.title) }}/50</span></div>
                            </div>
                        </el-form-item>
                        <el-form-item :label="'内容封面5：'" :label-width="labelWidth">
                            <div>
                                <el-upload :action="fileUpload" accept='.jpg,.png' list-type="picture-card" :file-list="qualityContent05.img" :on-preview="handlePictureCardPreview" :objectBind="5" :on-success="subheadHandleSuccess" :on-remove="subheadHandleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>

                                <el-dialog v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </div>
                    <!--内容5 End-->
                    <el-form-item label="修改方式：" :label-width="labelWidth" v-if="form.urlfrom=='dongfanghao'" style="margin-top:10px;">
                        <el-input placeholder="请输入下线原因,如:该文章存在XXX恶意词语,需要进行修改" v-model.trim="form.reason" style="width: 70%;" :disabled="form.offlinedfh=='0'">
                            <el-select v-model="form.offlinedfh" slot="prepend" placeholder="请选择" style="width: 150px;">
                                <el-option label="仅修改" value="0"></el-option>
                                <el-option label="原文下线修改" value="1"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="quality-content__tools clearfix" label="" :label-width="labelWidth">
                        <div class="pull-right">
                            <el-button type="primary" class="pull-right" @click="hQualityEditheader('ruleForm')">新增至优质库</el-button>
                        </div>
                    </el-form-item>
                </div>
                <el-col :span="24" class="toolbar" style="padding-left: 20px;">
                    <vueUEditor @ready="editorReady" style="width: 100%;height: 400px;" ref="addVideo"></vueUEditor>
                </el-col>
            </el-form>
            <!-- <div id="box-content">
                <el-col :span="24" class="toolbar" style="margin: 0 auto;">
                    <el-button type="primary" style="width: 100px;" @click="hQualityRreview('ruleForm')" :disabled="contentView">正文预览</el-button>
                    <el-button type="primary" style="width: 100px;" @click="hQualityImgRreview" :disabled="!imgBtnShow">缩略图预览</el-button>
                    <el-button type="primary" style="width: 100px;" @click="saveData" :disabled="!saveBtnShow">保存</el-button>
                </el-col>
            </div> -->

        </el-col>
        <el-col :span="11" :offset="2">
            <el-tabs v-model="activeName2">
                <el-tab-pane label="文章列表" name="1">
                    <div>
                        <div ref="rightcontent">
                            <div class="toolBar clearfix">
                                <div class="toolBar-item item-select">
                                    <el-select v-model="classify" placeholder="选择分类" @change="changeSelect">
                                        <el-option v-for="item in qualityClassifyHasAll" :key="item.typeId" :label="item.typeName" :value="item.typePy">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="toolBar-item item-select">
                                    <el-select v-model="timestamp" placeholder="时间" @change="changeSelect">
                                        <el-option v-for="item in qualityTimestamp" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="toolBar-item item-input">
                                    <el-input v-model="searchKeywords" placeholder="输入查询关键词" @keyup.enter.native="hQualityKeywords('搜索')"></el-input>
                                </div>
                                <div class="toolBar-item">
                                    <el-button type="primary" icon="search" @click="hQualityKeywords('搜索')">搜索</el-button>
                                </div>
                            </div>
                            <el-table :data="tableData" height="800" style="width: 100%" v-if="!nullSearch" class="qualityNew" v-loadmore="hQualityKeywords">
                                <el-table-column prop="imgstr" label="封面" width="120">
                                    <template slot-scope="scope">
			                          <div class="table-img">
			                          	<img :src="scope.row.imgstr[0].src" alt="" v-if="scope.row.imgstr.length!=0">
										<span v-if="scope.row.imgstr.length==0">暂无封面</span>
			                          </div>
			                       </template>
                                </el-table-column>
                                <el-table-column prop="title" label="标题">
                                    <template slot-scope="scope">
			                           <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
			                       </template>
                                </el-table-column>
                                <el-table-column prop="source" label="来源" :show-overflow-tooltip="true" width="80">
                                </el-table-column>
                                <el-table-column prop="urlpv" label="阅读量" width="80">
                                </el-table-column>
                                <el-table-column prop="ts" label="发布时间" sortable>
                                    <template slot-scope="scope">
			                           <span>{{ format(parseInt(scope.row.ts), 'yyyy-MM-dd HH:mm:ss') }}</span>
			                       </template>
                                </el-table-column>
                                <el-table-column prop="address" label="操作">
                                    <template slot-scope="scope">
				                       <el-button type="primary" @click="tableRowClick(scope.row)">新增</el-button>
								   </template>
                                </el-table-column>
                            </el-table>
                            <el-table :data="tableData" height="800" style="width: 100%" v-if="nullSearch" class="qualityNew" v-loadmore="hQualityKeywords">
                                <el-table-column prop="imgstr" label="封面" width="120">
                                    <template slot-scope="scope">
									 <div class="table-img">
									   <img :src="scope.row.miniimg[0].src" alt="" v-if="scope.row.miniimg.length!=0">
									   <span v-if="scope.row.miniimg.length==0">暂无封面</span>
									 </div>
								  </template>
                                </el-table-column>
                                <el-table-column prop="title" label="标题">
                                    <template slot-scope="scope">
									  <a :href="scope.row.url" target="_blank">{{ scope.row.topic }}</a>
								  </template>
                                </el-table-column>
                                <el-table-column prop="source" label="来源" :show-overflow-tooltip="true" width="80">
                                </el-table-column>
                                <el-table-column prop="urlpv" label="阅读量" width="80">
                                </el-table-column>
                                <el-table-column prop="ts" label="发布时间" sortable :sort-method="timeSort">
                                    <template slot-scope="scope">
									  <span>{{ scope.row.date }}</span>
								  </template>
                                </el-table-column>
                                <el-table-column prop="address" label="操作">
                                    <template slot-scope="scope">
									  <el-button type="primary" @click="tableRowClick(scope.row)">新增</el-button>
								  </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
                <!--网易滚动 Begin-->
                <el-tab-pane label="网易滚动" name="2">
                    <div>
                        <div ref="rightcontent">
                            <div class="toolBar clearfix">
                                <div class="toolBar-item item-select">
                                    <el-select v-model="netease.classify" placeholder="选择分类" @change="changeSelect">
                                        <el-option v-for="(item, index) in netease.classifyArr" :key="index" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="toolBar-item item-select">
                                    <el-select v-model="netease.timestamp" placeholder="时间" @change="changeSelect">
                                        <el-option v-for="item in qualityTimestamp" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="toolBar-item item-input">
                                    <el-input v-model="netease.searchKeywords" placeholder="输入查询关键词" @keyup.enter.native="hQualityKeywords('搜索')"></el-input>
                                </div>
                                <div class="toolBar-item">
                                    <el-button type="primary" icon="search" @click="neteaseNewsList">搜索</el-button>
                                </div>
                            </div>
                            <el-table :data="netease.tableData" style="width: 100%">
                                <el-table-column prop="title" label="标题">
                                    <template slot-scope="scope">
			                           <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
			                       </template>
                                </el-table-column>
                                <el-table-column prop="source" label="来源" :show-overflow-tooltip="true" width="80">
                                </el-table-column>
                                <el-table-column prop="time" label="发布时间" sortable>
                                </el-table-column>
                                <el-table-column prop="address" label="操作">
                                    <template slot-scope="scope">
				                       <el-button type="primary" @click="neteaseNewsEdit(scope.row)">新增</el-button>
								   </template>
                                </el-table-column>
                            </el-table>
                            <div class="block">
                                <el-pagination @current-change="handleNeteasePage" @size-change="handleNeteasePageSize" layout="total,sizes, prev, pager, next,jumper" :page-sizes='[10,15,20,50,100]' :current-page="netease.page" :page-size="netease.pageSize" :total="netease.total" style="float:right;">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <!--网易滚动 End-->
                <!--中青网新闻 Begin-->
                <el-tab-pane label="中青网新闻" name="3">
                    <div>
                        <div ref="rightcontent">
                            <div class="toolBar clearfix">
                                <div class="toolBar-item item-select">
                                    <el-select v-model="cycnetMaintype" placeholder="选择分类" @change="changeCycnet">
                                        <el-option v-for="(item,index) in cycnetMaintypes" :key="index" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="toolBar-item item-select">
                                    <el-select v-model="cycnetTime" placeholder="时间" @change="changeCycnet">
                                        <el-option label="窜红" value="窜红"></el-option>
                                        <el-option label="七日" value="七日"></el-option>
                                        <el-option label="总榜" value="总榜"></el-option>
                                    </el-select>
                                </div>
                                <div class="toolBar-item">
                                    <el-button type="primary" icon="search" @click="getCYCNETlist('搜索')">搜索</el-button>
                                </div>
                            </div>
                            <el-table :data="cycnetTable" height="800" style="width: 100%" class="cycnetTable" v-loadmore="getCYCNETlist">
                                <el-table-column prop="imgstr" label="封面" width="120">
                                    <template slot-scope="scope">
									 <div class="table-img">
									   <img :src="JSON.parse(scope.row.imgjs)[0].src" alt="" v-if="JSON.parse(scope.row.imgjs).length!=0">
									   <span v-if="JSON.parse(scope.row.imgjs).length==0">暂无封面</span>
									 </div>
								  </template>
                                </el-table-column>
                                <el-table-column prop="title" label="标题">
                                    <template slot-scope="scope">
									  <a :href="scope.row.url" target="_blank">{{ scope.row.topic }}</a>
								  </template>
                                </el-table-column>
                                <el-table-column prop="source" label="来源" :show-overflow-tooltip="true" width="80">
                                </el-table-column>
                                <el-table-column label="发布时间" sortable :sort-method="timeSort">
                                    <template slot-scope="scope">
									  <span>{{ format(parseInt(scope.row.crawlerts), 'yyyy-MM-dd HH:mm:ss') }}</span>
								  </template>
                                </el-table-column>
                                <el-table-column prop="address" label="操作">
                                    <template slot-scope="scope">
									  <el-button type="primary" @click="cycnetClick(scope.row)">新增</el-button>
								  </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
                <!--中青网新闻 End-->
            </el-tabs>
        </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="rowClickDiag" size="tiny">
        <span>您已编辑此新闻副标题和副封面，是否切换新闻？</span>
        <span slot="footer" class="dialog-footer">
		    <el-button @click="rowClickCancel">取 消</el-button>
		    <el-button type="primary" @click="rowClickAffirm">确 定</el-button>
		  </span>
    </el-dialog>
    <!--正文预览dialog Begin-->
    <el-dialog title="页面预览" v-model="replyFormVisible" top="5%" size="small" :before-close="dialogHandleClose(1)" :close-on-click-modal="false">
        <div>
            <iframe :src="contentPreview" style="border: 0;" width="100%" height="700px"></iframe>
        </div>
    </el-dialog>
    <!--正文预览dialog End-->
    <!--缩略图预览dialog Begin-->
    <el-dialog title="略缩图预览" v-model="replyImgVisible" :before-close="dialogHandleClose(0)" :close-on-click-modal="false">
        <div>
            缩略图预览：
        </div>
        2:1
        <div>
            <img width="100%" v-for="item in newImg.lunbjs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
        </div>
        4:3
        <div>
            <img width="100%" v-for="item in newImg.minijs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
        </div>
        16:9大图
        <div>
            <img width="100%" v-for="item in newImg.miniajs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
        </div>
        16：9
        <div>
            <img width="100%" v-for="item in newImg.minibjs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
        </div>
    </el-dialog>
    <!--缩略图预览dialog End-->
</section>
</template>
<script>
import {
    mapGetters
} from 'vuex';
import loadmore from '@/directive/loadMore'
import vueUEditor from '@/components/UEditor'
import { contentEditorHtml } from '@/utils/contentTransform'
import {
    neteaseNewsEdit,
    neteaseNewsList,
    hQualityEditheader,
    getHqualityClass,
    hQualityKeywords,
    hQualityUrl,
    newsPlatType,
    getCYCNETlist,
    getCYCNETtype,
    checkQualityIsEdit
} from '@/api/contentManage';
import {
    getfileUpload
} from '@/api/operationTools'

export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    directives: {
        loadmore
    },
    props: [
        'newsUrl'
    ],
    data() {
        var checkTitle01 = (rule, value, callback) => {
            if ((this.countFontNum(this.qualityContent01.title) < 6 || this.countFontNum(this.qualityContent01.title) > 8) && this.qualityContent01.title != "") {
                callback(new Error('请输入6到8个汉字'));
            } else {
                callback()
            }
        }
        var checkTitle02 = (rule, value, callback) => {
            if ((this.countFontNum(this.qualityContent02.title) < 11 || this.countFontNum(this.qualityContent02.title) > 13.5) && this.qualityContent02.title != "") {
                callback(new Error('请输入11到13.5个汉字'));
            } else {
                callback()
            }
        }
        var checkTitle03 = (rule, value, callback) => {
            if ((this.countFontNum(this.qualityContent03.title) < 14 || this.countFontNum(this.qualityContent03.title) > 15.5) && this.qualityContent03.title != "") {
                callback(new Error('请输入14到15.5个汉字'));
            } else {
                callback()
            }
        }
        var checkTitle04 = (rule, value, callback) => {
            if ((this.countFontNum(this.qualityContent04.title) < 18 || this.countFontNum(this.qualityContent04.title) > 25) && this.qualityContent04.title != "") {
                callback(new Error('请输入18到25个汉字'));
            } else {
                callback()
            }
        }
        var checkTitle05 = (rule, value, callback) => {
            if ((this.countFontNum(this.qualityContent05.title) < 5 || this.countFontNum(this.qualityContent05.title) > 50) && this.qualityContent05.title != "") {
                callback(new Error('请输入5到50个汉字'));
            } else {
                callback()
            }
        }
        return {
            contentView: false,
            hasTaobao: false,
            nullSearch: true,
            url: '',
            // 固定的五个副标题
            qualityContent01: {
                title: '',
                img: []
            },
            qualityContent02: {
                title: '',
                img: []
            },
            qualityContent03: {
                title: '',
                img: []
            },
            qualityContent04: {
                title: '',
                img: []
            },
            qualityContent05: {
                title: '',
                img: []
            },
            // 原来的
            oldqQualityContent01: {
                title: '',
                img: []
            },
            oldqQualityContent02: {
                title: '',
                img: []
            },
            oldqQualityContent03: {
                title: '',
                img: []
            },
            oldqQualityContent04: {
                title: '',
                img: []
            },
            oldqQualityContent05: {
                title: '',
                img: []
            },
            qualityContent: [],
            oldQualityContent: [],
            urlError: false,
            imgBtnShow: false,
            saveBtnShow: false,
            replyFormVisible: false,
            replyImgVisible: false,
            rowClickDiag: false,
            closeModal: false,
            dialogImageUrl: '',
            activeName2: '1',
            isNeweditor: false,
            dialogVisible: false,
            urlVisible: false,
            newUrl: '',
            newUrlArr: [],
            fileList2: new Array(),
            fileListShow: [],
            keywordsMax: 10,
            form: {
                isquality: '0',
                timeliness: '-1',
                radioType: '1',
                radioOffline: '1',
                platform: '',
                type: '',
                content: '',
                searchClassify: '',
                title: '',
                edate: '',
                source: '',
                purl: '',
                urlfrom: '',
                imgtype: '3',
                qunmedia: '1',
                original: '1',
                keywords: [],
                offlinedfh: '0',
                reason: ''
            },
            formVideo: {
                keywords: '',
                page: 1,
                pageSize: 20,
                stkey_video: 0,
                lastcol_video: 20
            },
            videoList: [],
            rules: {
                platform: [{
                    required: true,
                    message: '请选择操作平台',
                    trigger: 'change'
                }, ],
                title: [{
                    required: true,
                    message: '请输入标题',
                    trigger: 'blur'
                }, ],
                source: [{
                    required: true,
                    message: '请输入新闻来源',
                    trigger: 'blur'
                }],
                title01: [{
                    validator: checkTitle01,
                    trigger: 'blur'
                }],
                title02: [{
                    validator: checkTitle02,
                    trigger: 'blur'
                }],
                title03: [{
                    validator: checkTitle03,
                    trigger: 'blur'
                }],
                title04: [{
                    validator: checkTitle04,
                    trigger: 'blur'
                }],
                title05: [{
                    validator: checkTitle05,
                    trigger: 'blur'
                }]
            },
            platform: [],
            operNewsList: [],
            page: 1,
            pagesize: 20,
            pageTotal: 0,
            currentRow: null,
            showSave: false,
            showImg: false,
            imgpath: '',
            newsType: [],
            maintypeLabel: [],
            newImg: '',
            contentPreview: '',
            listLoading: false,
            radio2: 2,
            inputVisible: false,
            inputValue: '',
            addTag: 0,
            newsTypeLevel: [],
            clickSelect: true,
            props: {
                value: 'typePy',
                label: 'typeName',
                children: 'cities'
            },
            labelWidth: "120px",
            fileUpload: '',
            authorList: '',
            childmapoint: '',
            editorInstance: new Object(),
            tableData: [],
            timestamp: new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000,
            classify: '',
            qualityClassify: [],
            qualityClassifyHasAll: [],
            rowkey: '',
            qualityTimestamp: [{
                    label: '不限',
                    value: ''
                },
                {
                    label: '1天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000
                },
                {
                    label: '3天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime() - 3 * 24 * 60 * 60 * 1000
                },
                {
                    label: '7天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 60 * 60 * 1000
                },
                {
                    label: '30天内新闻',
                    value: new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 60 * 60 * 1000
                }
            ],
            searchKeywords: '',
            stkey_zixun: '',
            lastcol_zixun: '',
            splitwordsarr: '',
            netease: {
                classify: '',
                // 网易滚动分类
                classifyArr: [{
                        label: '全部',
                        value: ''
                    },
                    {
                        label: '国内',
                        value: '国内'
                    },
                    {
                        label: '国际',
                        value: '国际'
                    },
                    {
                        label: '社会',
                        value: '社会'
                    },
                    {
                        label: '评论',
                        value: '评论'
                    },
                    {
                        label: '探索',
                        value: '探索'
                    },
                    {
                        label: '军事',
                        value: '军事'
                    },
                    {
                        label: '图片',
                        value: '图片'
                    },
                    {
                        label: '视频',
                        value: '视频'
                    }
                ],
                searchKeywords: '',
                page: 1,
                pageSize: 10,
                total: 0,
                tableData: [],
                timestamp: new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000
            },
            // 中青网
            cycnetMaintype: '全部',
            cycnetMaintypes: [],
            cycnetTime: '窜红',
            cycnetTable: [],
            cycnetNum: 0,
            cycnetKey: ''
        };
    },
    components: {
        vueUEditor
    },
    mounted() {
        this.netease.pageSize = this.personalConfig.tableRowShow
        this.fileUpload = getfileUpload;
        // 分类
        this.getHqualityClass();
        // this.scrollLoadMore()
        // this.scrollLoadMoreCYCNET()
        // if (this.newsUrl != '') {
        //     this.form.purl = this.newsUrl;
        //     this.hQualityUrl();
        // }
        this.getCYCNETtype()
    },
    filters: {

    },
    methods: {
        // 切换行
        rowClickAffirm() {
            this.rowClickDiag = false;
            this.form.purl = this.url;
            this.resetForm();
            this.hQualityUrl();
        },
        rowClickCancel() {
            this.rowClickDiag = false
        },
        getHqualityClass() {
            getHqualityClass().then(res => {
                if (res.code == "00001") {
                    this.qualityClassify = res.data;
                    this.qualityClassifyHasAll = res.data;
                    this.qualityClassifyHasAll.unshift({
                        'typeName': '全部领域',
                        'typePy': ''
                    })
                    this.classify = this.qualityClassifyHasAll[0].typePy
                    this.form.searchClassify = res.data[0].urlmaintype;
                }
            });
        },
        cycnetClick(row) {
            // 检测是否被编辑过优质
            let params = {
                rowkey: row.rowkey
            }
            checkQualityIsEdit(params).then(res => {
                if (res.code !== "00001") {
                    this.$message({
                        message: res.ret,
                        type: 'warning'
                    });
                } else {
                    this.qualityContent.forEach(function(item) {
                        item.img.forEach(function(i) {
                            if (i.uid) {
                                delete i.uid;
                            }
                            if (i.status) {
                                delete i.status;
                            }
                        })
                    })
                    this.form.purl = row.url;
                    this.resetForm();
                    this.hQualityUrl();
                }
            })
        },
        tableRowClick(row) {
            // 副标题编辑过后，切换提醒
            this.qualityContent.forEach(function(item) {
                item.img.forEach(function(i) {
                    if (i.uid) {
                        delete i.uid;
                    }
                    if (i.status) {
                        delete i.status;
                    }
                })
            })
            if ((JSON.stringify(this.oldQualityContent) != JSON.stringify(this.qualityContent)) && this.form.title != '') {
                this.url = JSON.parse(JSON.stringify(row.url));
                this.rowClickDiag = true
            } else {
                this.form.purl = row.url;
                this.resetForm();
                this.hQualityUrl();
            }
        },
        // 优质内容URL查询
        hQualityUrl() {
            if (this.form.purl.substring(0, 4) != 'http') {
                this.$message({
                    message: '请输入正确的url查询',
                    type: 'warning'
                });
                return false
            }
            let params = {
                url: this.form.purl
            }
            hQualityUrl(params).then(res => {
                if (res.code == "00001") {
                    if (res.data) {
                        var data = res.data;
                        if (res.data.quality) {
                            if (res.data.quality == 1) {
                                this.form.isquality = "1"
                                this.urlError = true;
                            } else {
                                this.form.isquality = "0"
                                this.urlError = false;
                            }
                        } else {
                            this.form.isquality = '0'
                            this.urlError = false;
                        }
                        if (data.timeliness) {
                            this.form.timeliness = data.timeliness
                        } else {
                            this.form.timeliness = '-1'
                        }
                        this.rowkey = data.rowkey;
                        this.form.urlfrom = data.urlfrom;
                        this.form.title = data.contenttitle;
                        this.form.searchClassify = data.urlmaintypepy;
                        this.form.source = data.source;
                        this.form.keywords = data.keywords ? data.keywords.split(',') : [];
                        let imgList = eval("(" + data.minijs + ")");
                        this.fileList2 = [];
                        this.fileListShow = [];
                        for (var i = 0; i < imgList.length; i++) {
                            this.fileList2.push(imgList[i].src);
                            this.fileListShow.push({
                                name: imgList[i].imgname,
                                url: imgList[i].src
                            });
                        }
                        if (this.fileList2.length > 3) {
                            this.form.imgtype = '10';
                        } else if (this.fileList2.length == 3) {
                            this.form.imgtype = '3';
                        } else if (this.fileList2.length == 1) {
                            this.form.imgtype = '1';
                        }
                        if (this.fileList2.length >= 3) {
                            document.getElementsByClassName('el-upload--picture-card')[0].style.display = "none";
                        }

                        function minijs(data) {
                            if (data == "null" || data == null || data == "") {
                                return []
                            } else {
                                let imgList = eval("(" + data + ")");
                                console.log(imgList)
                                let arr = []
                                imgList.forEach(function(item) {
                                    arr.push({
                                        name: item.imgname,
                                        url: item.src
                                    })
                                })
                                return arr
                            }
                        }
                        if (data.title01 == null) {
                            data.title01 = ""
                        }
                        this.qualityContent01.title = data.title01;
                        this.qualityContent01.img = minijs(data.minijs01);
                        this.qualityContent01.tcnumber = data.tcnum01;

                        if (data.title02 == null) {
                            data.title02 = ""
                        }
                        this.qualityContent02.title = data.title02;
                        this.qualityContent02.img = minijs(data.minijs02);
                        this.qualityContent02.tcnumber = data.tcnum02;

                        if (data.title03 == null) {
                            data.title03 = ""
                        }
                        this.qualityContent03.title = data.title03;
                        this.qualityContent03.img = minijs(data.minijs03);
                        this.qualityContent03.tcnumber = data.tcnum03;

                        if (data.title04 == null) {
                            data.title04 = ""
                        }
                        this.qualityContent04.title = data.title04;
                        this.qualityContent04.img = minijs(data.minijs04);
                        this.qualityContent04.tcnumber = data.tcnum04;

                        if (data.title05 == null) {
                            data.title05 = ""
                        }
                        this.qualityContent05.title = data.title05;
                        this.qualityContent05.img = minijs(data.minijs05);
                        this.qualityContent05.tcnumber = data.tcnum05;

                        this.qualityContent = [];
                        this.qualityContent.push(this.qualityContent01, this.qualityContent02, this.qualityContent03, this.qualityContent04, this.qualityContent05)
                        this.oldQualityContent = JSON.parse(JSON.stringify(this.qualityContent));
                        var _this = this;
                        // 保证数据更新后再更新视图
                        setTimeout(function() {
                            _this.qualityContent.forEach(function(item, index) {
                                if (item.img.length >= 3) {
                                    document.getElementsByClassName('el-upload--picture-card')[parseInt(index)].style.display = "none";
                                }
                            })
                        }, 0)
                        this.form.content = contentEditorHtml(data);
                        this.editorInstance.setContent(this.form.content);
                        if (res.data.advsjs != null && res.data.advsjs.length != 0 && res.data.advsjs != "null" && res.data.advsjs != "[]") {
                            this.hasTaobao = true
                            this.$message({
                                type: 'warning',
                                message: '数据含有广告无法编辑'
                            });
                            this.contentView = true
                            return
                        } else {
                            this.contentView = false
                            this.hasTaobao = false
                        }
                    } else {
                        this.$message({
                            message: '该链接无相关内容',
                            type: 'warning'
                        });
                    }

                }
            });
        },
        hQualityKeywords(type) {
            // if(this.searchKeywords == ''){
            // 	this.$message({
            //       message: '搜索关键词不能为空',
            //       type: 'warning'
            //     });
            // 	return false
            // }
            if (type == "搜索") {
                this.stkey_zixun = '';
                this.lastcol_zixun = '';
                this.splitwordsarr = '';
            }
            let params = {
                keywords: this.searchKeywords,
                maintype: this.classify,
                stkey_zixun: this.stkey_zixun,
                lastcol_zixun: this.lastcol_zixun,
                splitwordsarr: this.splitwordsarr,
                timelimit: this.timestamp,
                newsnum: 10
            }
            hQualityKeywords(params).then(res => {
                if (res.code == "00001") {
                    if (res.data.zixunsize == 0) {
                        this.$message({
                            message: '暂无更多数据',
                            type: 'warning'
                        });
                    } else {
                        if (type == '搜索') {
                            var data;
                            if (this.searchKeywords != '') {
                                data = res.data.zixun.data;
                                this.nullSearch = false
                            } else {
                                data = res.data.data;
                                this.nullSearch = true
                            }
                            this.tableData = data;
                        } else {
                            var data;
                            if (this.searchKeywords != '') {
                                data = res.data.zixun.data;
                                this.nullSearch = false
                            } else {
                                data = res.data.data;
                                this.nullSearch = true
                            }
                            this.tableData = this.tableData.concat(data);
                        }
                        if (this.searchKeywords == '') {
                            this.stkey_zixun = res.data.endkey;
                        } else {
                            this.stkey_zixun = res.data.zixun.stkey;
                            this.lastcol_zixun = res.data.zixun.lastcol;
                            this.splitwordsarr = res.data.splitwordsarr;
                        }
                    }
                }
            });
        },
        // 优质内容库副标题
        hQualityEditheader(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var _this = this;
                    var control = true;
                    var qualityContent = [];
                    qualityContent.push(this.qualityContent01, this.qualityContent02, this.qualityContent03, this.qualityContent04, this.qualityContent05)
                    this.qualityContent.forEach(function(item) {
                        if (item.title == "") {
                            _this.$message({
                                message: '请填写所有的副标题',
                                type: 'warning'
                            });
                            control = false
                        }
                        // if (item.title == "" && item.img.length != 0) {
                        //     _this.$confirm('有封面必须添加副标题，是否继续添加优质', '提示', {
                        //         confirmButtonText: '确定',
                        //         cancelButtonText: '取消',
                        //         type: 'warning'
                        //     }).then(() => {
                        //
                        //     }).catch(() => {
                        //
                        //     });
                        //     control = false
                        // }
                    })
                    if (!control) {
                        return false
                    }
                    if (this.rowkey == "") {
                        _this.$message({
                            message: '请确定新闻后再添加',
                            type: 'warning'
                        });
                        return false
                    }
                    var _this = this
                    this.qualityContent.forEach(function(item) {
                        item.img.forEach(function(i) {
                            if (i.uid) {
                                delete i.uid;
                            }
                            if (i.status) {
                                delete i.status;
                            }
                        })
                    })
                    this.oldQualityContent.forEach((item, index) => {
                        if (item.tcnumber != null && item.tcnumber > (~~index + 1) * 100 + 89) {
                            _this.$message({
                                message: '单条内容修改已达上线，请联系管理员',
                                type: 'warning'
                            });
                            return
                        }
                        // 如果tcnumber为null 则赋初始值100、200、300、400、500
                        if (item.tcnumber == null) {
                            item.tcnumber = (~~index + 1) * 100
                            item.ischange = 0
                            _this.qualityContent[index].tcnumber = (~~index + 1) * 100
                            _this.qualityContent[index].ischange = 0
                            if (this.form.isquality == "1") {
                                if (JSON.stringify(item) != JSON.stringify(_this.qualityContent[index])) {
                                    _this.qualityContent[index].tcnumber = _this.qualityContent[index].tcnumber + 1
                                    _this.qualityContent[index].ischange = 1
                                    _this.qualityContent[index].oldtitle = item.title;
                                    var oldImg = [];
                                    item.img.forEach(item => {
                                        oldImg.push(item.url)
                                    })
                                    _this.qualityContent[index].oldimg = oldImg.join(',');
                                }
                            }
                            // 修改 ischange 传1
                        } else if (JSON.stringify(item) != JSON.stringify(_this.qualityContent[index])) {
                            _this.qualityContent[index].tcnumber = _this.qualityContent[index].tcnumber + 1
                            _this.qualityContent[index].ischange = 1
                            _this.qualityContent[index].oldtitle = item.title;
                            var oldImg = [];
                            item.img.forEach(item => {
                                oldImg.push(item.url)
                            })
                            _this.qualityContent[index].oldimg = oldImg.join(',');
                            // 未修改 ischange 传0
                        } else if (JSON.stringify(item) == JSON.stringify(_this.qualityContent[index])) {
                            _this.qualityContent[index].ischange = 0
                        }
                    })
                    let subheaderData = JSON.parse(JSON.stringify(this.qualityContent))
                    // 转化成 url逗号隔开的字符串
                    subheaderData.forEach(function(item) {
                        let arr = [];
                        item.img.forEach(function(i) {
                            arr.push(i.url)
                        })
                        item.img = arr.join(",")
                    })
                    let param = {
                        subheader: subheaderData,
                        isquality: this.form.isquality,
                        timeliness: this.form.timeliness,
                        rowkey: this.rowkey //this.rowkey
                    }
                    this.listLoading = true;
                    hQualityEditheader(param).then((res) => {
                        if (res.code == "00001") {
                            this.hQualityUrl();
                            this.$message({
                                message: '新增至优质库成功',
                                type: 'success'
                            });
                        }
                        this.listLoading = false;
                    })
                }
            });
        },
        // 正文预览
        hQualityRreview(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.form.content == '') {
                        this.$message({
                            type: 'warning',
                            message: '无正文信息，无法预览'
                        });
                        return;
                    }
                    //匹配图片（g表示匹配所有结果i表示区分大小写）
                    // var imgReg = /<img.*?(?:>|\/>)/gi;
                    // //匹配src属性
                    // var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                    // var arr = this.form.content.match(imgReg);
                    // console.log(arr)
                    // // 去除正文空的img标签
                    // this.form.content = this.form.content.replace(imgReg,function(match){
                    //     if(match.match(srcReg)!=null){
                    //         if(match.match(srcReg)[1] == ''|| match.indexOf('src') == -1){
                    //             return ''
                    //         }else{
                    //             return match
                    //         }
                    //     }else{
                    //         return ''
                    //     }
                    // })
                    // if(arr != null){
                    // 	var src = arr[0].match(srcReg)[1];
                    // }
                    // 正文预览参数
                    let param = {
                        content: this.form.content,
                        maintype: this.form.searchClassify,
                        title: this.form.title,
                        source: this.form.source,
                        keywords: this.form.keywords.join(","),
                        rowkey: this.rowkey
                    }
                    this.listLoading = true;
                    hQualityRreview(param).then((res) => {
                        if (res.code == "00001") {
                            this.contentPreview = res.data + '?qid=cms';
                            this.replyFormVisible = true;
                            this.imgBtnShow = true;
                        }
                        this.listLoading = false;
                    })
                }
            });
        },
        // 缩略图预览
        hQualityImgRreview() {
            if (this.fileList2.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '无略缩图，无法预览'
                });
                return;
            }
            var _this = this
            this.qualityContent.forEach(function(item) {
                item.img.forEach(function(i) {
                    if (i.uid) {
                        delete i.uid;
                    }
                    if (i.status) {
                        delete i.status;
                    }
                })
            })
            this.oldQualityContent.forEach((item, index) => {
                // 如果tcnumber为null 则赋初始值100、200、300、400、500
                if (item.tcnumber != null && item.tcnumber > (~~index + 1) * 100 + 89) {
                    _this.$message({
                        message: '单条内容修改已达上线，请联系管理员',
                        type: 'warning'
                    });
                    return
                }
                if (item.tcnumber == null) {
                    item.tcnumber = (~~index + 1) * 100
                    item.ischange = 0
                    _this.qualityContent[index].tcnumber = (~~index + 1) * 100
                    _this.qualityContent[index].ischange = 0
                    if (this.form.isquality == "1") {
                        console.log(JSON.stringify(item))
                        console.log(JSON.stringify(_this.qualityContent[index]))
                        console.log(item)
                        if (JSON.stringify(item) != JSON.stringify(_this.qualityContent[index])) {
                            _this.qualityContent[index].tcnumber = _this.qualityContent[index].tcnumber + 1
                            _this.qualityContent[index].ischange = 1
                            _this.qualityContent[index].oldtitle = item.title;
                            var oldImg = [];
                            item.img.forEach(item => {
                                oldImg.push(item.url)
                            })
                            _this.qualityContent[index].oldimg = oldImg.join(',');
                        }
                    }
                    // 修改 ischange 传1
                } else if (JSON.stringify(item) != JSON.stringify(_this.qualityContent[index])) {
                    _this.qualityContent[index].tcnumber = _this.qualityContent[index].tcnumber + 1
                    _this.qualityContent[index].ischange = 1
                    _this.qualityContent[index].oldtitle = item.title;
                    var oldImg = [];
                    item.img.forEach(item => {
                        oldImg.push(item.url)
                    })
                    _this.qualityContent[index].oldimg = oldImg.join(',');
                    // 未修改 ischange 传0
                } else if (JSON.stringify(item) == JSON.stringify(_this.qualityContent[index])) {
                    _this.qualityContent[index].ischange = 0
                }
            })
            let subheaderData = JSON.parse(JSON.stringify(this.qualityContent))
            // 转化成 url逗号隔开的字符串
            subheaderData.forEach(function(item) {
                let arr = [];
                item.img.forEach(function(i) {
                    arr.push(i.url)
                })
                item.img = arr.join(",")
            })
            let fileListShow = JSON.parse(JSON.stringify(this.fileListShow));
            // 转化成 url逗号隔开的字符串
            let arrFile = [];
            // debugger
            fileListShow.forEach(function(item) {
                arrFile.push(item.url)
            })
            arrFile = arrFile.join(",")
            let param = {
                imgs: arrFile,
                rowkey: this.rowkey,
                subheader: subheaderData
            }
            this.listLoading = true;
            hQualityImgRreview(param).then((res) => {
                if (res.code == "00001") {
                    this.newImg = res.data;
                    this.newImg.minibjs = JSON.parse(this.newImg.minibjs);
                    this.newImg.lunbjs = JSON.parse(this.newImg.lunbjs);
                    this.newImg.minijs = JSON.parse(this.newImg.minijs);
                    this.newImg.miniajs = JSON.parse(this.newImg.miniajs);
                    this.replyImgVisible = true;
                    this.saveBtnShow = true;
                }
                this.listLoading = false;
            })
        },
        // 保存
        saveData() {
            if (this.form.urlfrom == 'dongfanghao' && this.form.offlinedfh == "1" && this.form.reason == "") {
                this.$message({
                    type: 'warning',
                    message: '下线原因不能为空'
                });
                return
            }
            this.listLoading = true
            let subheaderData = JSON.parse(JSON.stringify(this.qualityContent))
            // 转化成 url逗号隔开的字符串
            subheaderData.forEach(function(item) {
                let arr = [];
                item.img.forEach(function(i) {
                    arr.push(i.url)
                })
                item.img = arr.join(",")
            })
            let param = {
                subheader: subheaderData,
                offlinedfh: this.form.offlinedfh,
                reason: this.form.reason,
                timeliness: this.form.timeliness,
                isquality: this.form.isquality,
                rowkey: this.rowkey
            }
            hQualitySave(param).then((res) => {
                if (res.code == "00001") {
                    this.listLoading = false
                    this.urlError = false
                    this.imgBtnShow = false
                    this.saveBtnShow = false
                    this.form.purl = ''
                    this.resetForm()
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                }
            })
        },
        handleItemChange(val) {
            var typeLength = val.length;
            let param = {
                type: 'dfsportnewsadd',
                id: val[typeLength - 1]
            };
            if (this.platform === 'wxsport') {
                param.type = 'wuxingsportsnewsadd'
            }
            newsPlatType(param).then(res => {
                if (res.data && res.data.length) {
                    if (typeLength == 1) {
                        for (var i = 0; i < this.newsTypeLevel.length; i++) {
                            let newsTypeLevel = [];
                            if (this.newsTypeLevel[i].value == val) {
                                this.maintypeLabel.push(this.newsTypeLevel[i].value);
                                for (var j = 0; j < res.data.length; j++) {
                                    newsTypeLevel.push({
                                        cities: [],
                                        label: res.data[j].typeName,
                                        value: res.data[j].typePy
                                    })
                                }
                                this.newsTypeLevel[i].cities = newsTypeLevel;
                                break;
                            }
                        }
                    } else if (typeLength == 2) {
                        for (var i = 0; i < this.newsTypeLevel.length; i++) {
                            if (this.newsTypeLevel[i].value == val[0]) {
                                for (var j = 0; j < this.newsTypeLevel[i].cities.length; j++) {
                                    let newsTypeLevel = [];
                                    if (this.newsTypeLevel[i].cities[j].value == val[1]) {
                                        this.maintypeLabel.push(this.newsTypeLevel[i].value);
                                        for (var k = 0; k < res.data.length; k++) {
                                            newsTypeLevel.push({
                                                label: res.data[k].typeName,
                                                value: res.data[k].typePy
                                            })
                                        }
                                        this.newsTypeLevel[i].cities[j].cities = newsTypeLevel;
                                        break;
                                    }

                                }
                            }
                        }
                    }
                }
            });
            this.form.maintype = val;
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        handleSuccess(res, file) { //上传成功
            this.imgpath = res.url;
            this.fileList2.push(res.url);
            this.fileListShow.push({
                name: file.name,
                url: res.url
            })
            if (this.fileList2.length >= 3) {
                document.getElementsByClassName('el-upload--picture-card')[0].style.display = "none";
            }
            this.showSave = false;
            this.showImg = false;
        },
        // 副标题配图新增成功
        subheadHandleSuccess(res, file, fileList, index) {
            this['qualityContent0' + index].img.push({
                name: file.name,
                url: res.url
            });
            if (this['qualityContent0' + index].img.length >= 3) {
                document.getElementsByClassName('el-upload--picture-card')[parseInt(index)].style.display = "none";
            }
            this.showSave = false;
            this.showImg = false;
        },
        // 副标题配图新增移除
        subheadHandleRemove(file, fileList, index) {
            for (var i = 0; i < this['qualityContent0' + index].img.length; i++) {
                if (this['qualityContent0' + index].img[i].url == file.url) {
                    this['qualityContent0' + index].img.splice(i, 1);
                }
            }
            if (this['qualityContent0' + index].img.length < 3) {
                document.getElementsByClassName('el-upload--picture-card')[parseInt(index)].style.display = "";
            }
        },
        handleRemove(file) { //删除图片
            for (var i = 0; i < this.fileList2.length; i++) {
                if (this.fileList2[i] == file.url) {
                    this.fileList2.splice(i, 1);
                    break;
                }
            };
            for (var i = 0; i < this.fileListShow.length; i++) {
                if (this.fileListShow[i].url == file.url) {
                    this.fileListShow.splice(i, 1);
                    break;
                }
            };
            if (this.fileList2.length < ~~this.form.imgtype) {
                document.getElementsByClassName('el-upload--picture-card')[0].style.display = "";
            }
            this.showSave = false;
            this.showImg = false;
            this.saveBtnShow = false
        },
        //下拉加载
        scrollLoadMore() {
            // 获取element-ui定义好的scroll盒子
            const SELECTWRAP_DOM = document.querySelector('.qualityNew .el-table__body-wrapper');
            var _this = this;
            SELECTWRAP_DOM.onscroll = function() {
                if (SELECTWRAP_DOM.scrollHeight <= SELECTWRAP_DOM.clientHeight + SELECTWRAP_DOM.scrollTop) {
                    _this.hQualityKeywords();
                }
            }
        },
        //下拉加载
        scrollLoadMoreCYCNET() {
            // 获取element-ui定义好的scroll盒子
            const SELECTWRAP_DOM = document.querySelector('.cycnetTable .el-table__body-wrapper');
            var _this = this;
            SELECTWRAP_DOM.onscroll = function() {
                if (SELECTWRAP_DOM.scrollHeight <= SELECTWRAP_DOM.clientHeight + SELECTWRAP_DOM.scrollTop) {
                    _this.getCYCNETlist();
                }
            }
        },
        dialogHandleCloseUrl(done) {
            this.form.title = '';
            this.urlVisible = false;
        },
        dialogHandleClose(index) {
            if (index == 0) {
                this.dialogImgVisible = false;
            } else if (index == 1) {
                this.dialogFormVisible = false;
            } else {
                this.urlVisible = false;
            }
        },
        // 删除优质副标题
        deleteQuality(index) {
            this['qualityContent0' + index].title = "";
            this['qualityContent0' + index].img = [];
        },
        handlePictureCardPreview(file) { //打开图片
            this.imgpath = file.url;
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleClose(tag) {
            this.form.keywords.splice(this.form.keywords.indexOf(tag), 1);
            this.addTag = this.form.keywords.length;
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
                this.form.keywords.push(inputValue);
            }
            this.addTag = this.form.keywords.length;
            this.inputVisible = false;
            this.inputValue = '';
        },
        editorReady(editorInstance) {
            this.editorInstance = editorInstance;
            editorInstance.setContent(this.form.content);
            editorInstance.addListener('contentChange', () => {
                this.form.content = editorInstance.getContent();
            });
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
        },
        // 清空
        resetForm() {
            this.form.title = '';
            this.form.source = '';
            this.form.keywords = [];
            this.form.searchClassify = this.qualityClassify[0].typePy;
            this.qualityContent = [];
            this.oldQualityContent = [];
            this.qualityContentHasAll = [];
            this.oldQualityContentHasAll = [];
            this.addTag = 0;
            this.fileListShow = [];
            this.fileList2 = [];
            this.editorInstance.setContent('');
            this.qualityContent01 = {
                    title: '',
                    img: []
                },
                this.qualityContent02 = {
                    title: '',
                    img: []
                },
                this.qualityContent03 = {
                    title: '',
                    img: []
                },
                this.qualityContent04 = {
                    title: '',
                    img: []
                },
                this.qualityContent05 = {
                    title: '',
                    img: []
                },
                // 原来的
                this.oldqQualityContent01 = {
                    title: '',
                    img: []
                },
                this.oldqQualityContent02 = {
                    title: '',
                    img: []
                },
                this.oldqQualityContent03 = {
                    title: '',
                    img: []
                },
                this.oldqQualityContent04 = {
                    title: '',
                    img: []
                },
                this.oldqQualityContent05 = {
                    title: '',
                    img: []
                }
        },
        changeSelect() {
            this.stkey_zixun = '';
            this.lastcol_zixun = '';
            this.splitwordsarr = '';
            this.tableData = [];
        },
        // 时间排序
        timeSort(a, b) {
            return (new Date(a.date).getTime() - new Date(b.date).getTime()) > 0
        },
        // 计算标题字数
        countFontNum(str) {
            // 计算字符
            String.prototype.gblen = function() {
                var len = 0;
                for (var i = 0; i < this.length; i++) {
                    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
                        len += 1;
                    } else {
                        len += 0.5;
                    }
                }
                return len;
            }
            return str.gblen()
        },
        // 网易滚动新闻列表
        neteaseNewsList() {
            let params = {
                stime: this.netease.timestamp,
                etime: new Date(new Date().toLocaleDateString()).getTime(),
                maintype: this.netease.classify,
                title: this.netease.searchKeywords,
                page: this.netease.page,
                pagesize: this.netease.pageSize
            }
            neteaseNewsList(params).then(res => {
                if (res.code == "00001") {
                    this.netease.tableData = res.data.data;
                    this.netease.total = Number(res.data.count)
                }
            })
        },
        neteaseNewsEdit(row) {
            let params = {
                url: row.url
            }
            neteaseNewsEdit(params).then(res => {
                if (res.code == "00001") {
                    if (res.data.data.rowkey == "-1") {
                        // 自己的表里找不到该新闻时
                        this.searchKeywords = row.title
                        this.hQualityKeywords("搜索")
                        this.activeName2 = "1";
                        this.$message({
                            message: '该条新闻暂未在新闻库搜到',
                            type: 'warning'
                        });
                        return false
                    } else {
                        var data = res.data.data;
                        if (res.data.quality) {
                            if (res.data.quality == 1) {
                                this.form.isquality = "1"
                                this.urlError = true;
                            } else {
                                this.form.isquality = "0"
                                this.urlError = false;
                            }
                        } else {
                            this.form.isquality = '0'
                            this.urlError = false;
                        }
                        if (data.timeliness) {
                            this.form.timeliness = data.timeliness
                        } else {
                            this.form.timeliness = '-1'
                        }
                        this.rowkey = data.rowkey;
                        this.form.urlfrom = data.urlfrom;
                        this.form.title = data.contenttitle;
                        this.form.searchClassify = data.urlmaintypepy;
                        this.form.source = data.source;
                        this.form.keywords = data.keywords ? data.keywords.split(',') : [];
                        let imgList = eval("(" + data.minijs + ")");
                        this.fileList2 = [];
                        this.fileListShow = [];
                        for (var i = 0; i < imgList.length; i++) {
                            this.fileList2.push(imgList[i].src);
                            this.fileListShow.push({
                                name: imgList[i].imgname,
                                url: imgList[i].src
                            });
                        }
                        if (this.fileList2.length > 3) {
                            this.form.imgtype = '10';
                        } else if (this.fileList2.length == 3) {
                            this.form.imgtype = '3';
                        } else if (this.fileList2.length == 1) {
                            this.form.imgtype = '1';
                        }
                        if (this.fileList2.length >= 3) {
                            document.getElementsByClassName('el-upload--picture-card')[0].style.display = "none";
                        }

                        function minijs(data) {
                            if (data == "null" || data == null || data == "") {
                                return []
                            } else {
                                let imgList = eval("(" + data + ")");
                                console.log(imgList)
                                let arr = []
                                imgList.forEach(function(item) {
                                    arr.push({
                                        name: item.imgname,
                                        url: item.src
                                    })
                                })
                                return arr
                            }
                        }
                        if (data.title01 == null) {
                            data.title01 = ""
                        }
                        this.qualityContent01.title = data.title01;
                        this.qualityContent01.img = minijs(data.minijs01);
                        this.qualityContent01.tcnumber = data.tcnum01;

                        if (data.title02 == null) {
                            data.title02 = ""
                        }
                        this.qualityContent02.title = data.title02;
                        this.qualityContent02.img = minijs(data.minijs02);
                        this.qualityContent02.tcnumber = data.tcnum02;

                        if (data.title03 == null) {
                            data.title03 = ""
                        }
                        this.qualityContent03.title = data.title03;
                        this.qualityContent03.img = minijs(data.minijs03);
                        this.qualityContent03.tcnumber = data.tcnum03;

                        if (data.title04 == null) {
                            data.title04 = ""
                        }
                        this.qualityContent04.title = data.title04;
                        this.qualityContent04.img = minijs(data.minijs04);
                        this.qualityContent04.tcnumber = data.tcnum04;

                        if (data.title05 == null) {
                            data.title05 = ""
                        }
                        this.qualityContent05.title = data.title05;
                        this.qualityContent05.img = minijs(data.minijs05);
                        this.qualityContent05.tcnumber = data.tcnum05;

                        this.qualityContent = [];
                        this.qualityContent.push(this.qualityContent01, this.qualityContent02, this.qualityContent03, this.qualityContent04, this.qualityContent05)
                        this.oldQualityContent = JSON.parse(JSON.stringify(this.qualityContent));
                        var _this = this;
                        // 保证数据更新后再更新视图
                        setTimeout(function() {
                            _this.qualityContent.forEach(function(item, index) {
                                if (item.img.length >= 3) {
                                    document.getElementsByClassName('el-upload--picture-card')[parseInt(index)].style.display = "none";
                                }
                            })
                        }, 0)
                        this.form.content = contentEditorHtml(data);
                        this.editorInstance.setContent(this.form.content);
                        if (res.data.advsjs != null && res.data.advsjs.length != 0 && res.data.advsjs != "null" && res.data.advsjs != "[]") {
                            this.hasTaobao = true
                            this.$message({
                                type: 'warning',
                                message: '数据含有广告无法编辑'
                            });
                            this.contentView = true
                            return
                        } else {
                            this.contentView = false
                            this.hasTaobao = false
                        }
                    }
                }
            })
        },
        handleNeteasePage(val) {
            this.netease.page = val;
            this.neteaseNewsList();
        },
        handleNeteasePageSize(val) {
            this.netease.pageSize = val;
            this.neteaseNewsList();
        },
        // 获取中青团分类
        getCYCNETtype() {
            getCYCNETtype().then(res => {
                var _this = this
                if (res.code == '00001') {
                    res.data.forEach(item => {
                        if (item != '' && item != null) {
                            _this.cycnetMaintypes.push({
                                label: item,
                                value: item
                            })
                        }
                    })
                }
            })
        },
        getCYCNETlist(type) {
            if (type == '搜索') {
                this.cycnetKey = ''
            }
            let params = {
                type: this.cycnetMaintype,
                days: this.cycnetTime,
                startkey: this.cycnetKey
            }
            if (this.cycnetNum < 5) {
                getCYCNETlist(params).then(res => {
                    if (type == '搜索') {
                        this.cycnetTable = res.data
                    } else {
                        this.cycnetTable = this.cycnetTable.concat(res.data)
                    }
                    this.cycnetNum = this.cycnetNum + 1
                    // START KEY 暂用这个字段 找每次返回的advjs中的最大值
                    var startKeys = res.data.map(item => {
                        return item.advsjs
                    })
                    Array.prototype.max = function() {
                        var max = this[0];
                        var len = this.length;
                        for (var i = 1; i < len; i++) {
                            if (this[i] > max) {
                                max = this[i];
                            }
                        }
                        return max;
                    }
                    this.cycnetKey = startKeys.max()
                })
            }
        },
        changeCycnet() {
            this.cycnetTable = []
            this.cycnetKey = ''
            this.cycnetNum = 0
        }
    }
}
</script>

<style scoped lang="scss">
.input-error {
    position: relative;
}
.input-error p {
    color: red;
    position: absolute;
    font-size: 12px;
    bottom: -20px;
    margin: 0;
}
#box-content {
    margin: 0 auto;
}
.el-form-item {
    margin-bottom: 22px;
}
// .list-group{
//     height: 400px;
// 	overflow-y: scroll;
// }
.list_type {
    line-height: 30px;
    padding-bottom: 5px;
}
.list_num {
    float: right;
}
.list_red {
    color: red;
}
.inputWidth {
    width: 70%;
}
.list-group ul {
    padding: 0;
}
.list-group .el-table__body tr.current-row > td {
    background: #a9d4f7;
}
.list-group .group-title-box {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    color: rgba(119, 119, 119, 0.73);
}
.table-div {
    padding: 4px 5px;
}
.list-group .group-title {
    font-size: 16px;
}
.newUrl-p {
    position: relative;
    padding-right: 30px;
    display: flex;
    align-items: center;
}
.newUrl-title {
    font-size: 16px;
    color: #666;
}
.newUrl-a {
    font-size: 16px;
    color: #999;
    display: inline-block;
    max-width: 340px;
    word-break: break-all;
}
.newUrl-a > i {
    margin-left: 6px;
    color: #13CE66;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -8px;
}
.quality-content__item {
    background-color: #f3f3f3;
    padding: 20px 0;
    position: relative;
}
.quality-content__tools {
    margin: 14px 0;
}
.quality-content__label {
    margin-left: 10px;
}
.toolBar {
    margin: 10px 0;
}
.toolBar-item {
    float: left;
    margin-right: 10px;
    &.item-select {
        width: 120px;
    }
    &.item-input {
        width: 120px;
    }
}
.quality-search {
    margin-left: 30px !important;
    margin-bottom: 22px;
}
.table-img {
    width: 120px;
    padding: 10px;
    text-align: center;
    img {
        width: 100%;
    }
}
.el-upload-list__item:last-child {
    margin-right: 0 !important;
}
.quality-content__delete {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 18px;
    cursor: pointer;
    color: #ccc;
    z-index: 999;
    &:hover {
        color: #999;
    }
}
.font-num {
    position: absolute;
    right: -132px;
    color: #999;
    top: 50%;
    transform: translateY(-50%);
}
.red {
    color: #FF4949;
}
.title-icon {
    position: absolute;
    top: 50%;
    right: -148px;
    transform: translateY(-50%);
}
</style>
