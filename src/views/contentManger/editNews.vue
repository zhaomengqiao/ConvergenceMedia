<template lang="html">
    <section class="edit_news">
        <el-row style="margin-bottom:10px;">
            <el-button type="primary"
                       @click="newsContentPreview('form')"
                       :loading="loading.contentPreview"
                       v-if="!isDFH"
                       :disabled="btnDisabled.contentPreview">正文预览</el-button>
            <el-button type="primary"
                        @click="newsImgPreview"
                        :disabled="btnDisabled.imgsPreview"
                        v-if="!isDFH"
                        :loading="loading.imgsPreview">缩略图预览</el-button>
            <el-button type="primary"
                       :loading="loading.save"
                       @click="newsAdd('form')"
                       v-if="!isDFH"
                       :disabled="btnDisabled.save">保存</el-button>
            <el-button type="primary"
                       :loading="loading.dfhsave"
                       v-if="isDFH"
                       @click="newsDfhAdd('form')">保存</el-button>
            <el-button type="primary" @click="addNewsDraft('form')" :loading="loading.saveDraft">存草稿</el-button>
            <el-button type="primary" @click="contentTransferred" :loading="loading.transferred">原文转义</el-button>
            <el-button @click="resetForm('form')">清空</el-button>
            <el-input placeholder="请输入要采集的文章URL" v-model="collectUrl" class="input-with-select" style="width:65%">
                <el-button slot="append" type="primary" @click="newsCollect">采集</el-button>
            </el-input>
        </el-row>
        <el-row :gutter="10">
            <el-form ref="form" :model="formData" size="mini" :rules="rules" status-icon>
                <el-col :span="18">
                    <el-card>
                        <el-alert
                            title="注意"
                            type="warning"
                            description="自媒体东方号新闻,请勿随意编辑"
                            show-icon
                            style="margin-bottom:10px;"
                            v-if="warningShow">
                        </el-alert>
                        <el-row>
                            <el-input placeholder="请输入文章URL搜索" v-model="formData.purl" class="input-with-select">
                                <el-button slot="append" type="primary" @click="searchNeweditor" :loading="loading.search">搜索</el-button>
                            </el-input>
                        </el-row>
                        <el-form-item label="" prop="title">
                            <el-row class="mt-10 input_num_box">
                                <el-input placeholder="请输入文章标题,不能超过50个字符"
                                          v-model="formData.title"
                                          :maxlength="50"
                                          :minlength="5"
                                          size="large"></el-input>
                                <div class="input_num info">
                                    <span :class="formData.title.length==50?'danger':''">{{ formData.title.length }}/50</span>
                                </div>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="" prop="content">
                            <vueUEditor @ready="editorReady" style="width: 100%;height: 400px;" ref="addVideo"></vueUEditor>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <el-form-item label="平台" prop="platform" style="margin-bottom:10px" :show-message="false" v-if="!isDFH">
                            <el-select v-model="formData.platform"
                                       filterable
                                       placeholder="选择平台"
                                       @change="getNewsType">
                                <el-option
                                    v-for="(item,index) in platformOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类" prop="maintype" style="margin-bottom:10px" :show-message="false">
                            <el-cascader
                                change-on-select
                                :options="newsTypeLevel"
                                v-model="formData.maintype">
                            </el-cascader>
                        </el-form-item>
                        <el-row class="mt-10" v-if="formData.platform=='eastdayqiche'">
                            <div class="flex-div">
                                <div class="inline-label"></div>
                                <div class="inline-content" style="display:flex;justify-content:space-between;">
                                    <el-select v-model="formData.localsite" multiple placeholder="请选择" style="width:49%">
                                        <el-option label="2017广州车展" value="2017广州车展"></el-option>
                                    </el-select>
                                    <el-select v-model="formData.labelname" multiple placeholder="请选择" style="width:49%">
                                        <el-option label="新能源" value="新能源" v-if="formData.localsite!=''"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10" v-if="pageStatus === 'add'">
                            <div class="inline-div">
                                <div class="inline-label">东方号：</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isDFH" @change="changeIsDFH">是</el-checkbox>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10" v-if="pageStatus === 'add'">
                            <div class="inline-div">
                                <div class="inline-label">原创：</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isOriginal">是</el-checkbox>
                                </div>
                            </div>
                            <div class="inline-div ml-10">
                                <div class="inline-label">群媒体：</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isQunMedia">是</el-checkbox>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10" v-if="((formData.platform === 'dfsport'||formData.platform === 'all') && pageStatus === 'add')||(formData.platform == 'wxsport')">
                            <div class="inline-div"
                                 v-if="(formData.platform === 'dfsport'||formData.platform === 'all') && pageStatus === 'add'">
                                <div class="inline-label">百度百家：</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isBaijia">是</el-checkbox>
                                </div>
                            </div>
                            <div class="inline-div"
                                 v-if="formData.platform == 'wxsport'"
                                 :class="formData.platform == 'wxsport'?'ml-10':''">
                                <div class="inline-label">添加到万能WIFI：</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isAllPowerfullWifi">是</el-checkbox>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10">
                            <div class="inline-div mr-10">
                                <div class="inline-label">稿库：</div>
                                <div class="inline-content">
                                    <el-checkbox v-model="isSync">同步</el-checkbox>
                                </div>
                            </div>
                            <div class="inline-div mt-10" v-if="pageStatus === 'edit'">
                                <div class="inline-label">时间：</div>
                                <div class="inline-content">
                                    <el-date-picker
                                        style="width:195px;"
                                        v-model="editTime"
                                        type="datetime"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10">
                            <div class="flex-div" style="align-items:baseline">
                                <div class="inline-label">标签：</div>
                                <div class="inline-content">
                                    <el-tag
                                        style=""
                                        :key="tag"
                                        v-for="tag in dynamicTags"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag)">
                                        {{tag}}
                                    </el-tag>
                                    <el-input
                                        class="input-new-tag"
                                        v-if="inputVisible"
                                        v-model="inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10" v-if="formData.urlfrom === 'dongfanghao'">
                            <div class="flex-div">
                                <div class="inline-label">东方号发布：</div>
                                <div class="inline-content">
                                    <el-input v-model="dfhNickName" placeholder="请输入东方号昵称"></el-input>
                                </div>
                            </div>
                        </el-row>
                        <el-row class="mt-10">
                            <el-form-item :label="isDFH?'东方号':'来源'" prop="source">
                                <!-- <el-input v-model="formData.source" placeholder="请输入新闻来源" style="width:200px"></el-input> -->
                                <el-select v-model="formData.source" filterable placeholder="请选择东方号" v-if="isDFH" value-key="dfhid">
                                    <el-option
                                        v-for="item in personalConfig.dfh"
                                        :key="item.dfhid"
                                        no-data-text="请到个人中心设置您的东方号"
                                        :label="item.dfhname"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-autocomplete
                                    v-else
                                    style="width:200px"
                                    v-model="formData.source"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入新闻来源"
                                ></el-autocomplete>
                            </el-form-item>
                        </el-row>
                        <!--下线修改必须输入原因，仅修改时不需要输入原因-->
                        <el-row v-if="pageStatus === 'edit' && formData.urlfrom ==='dongfanghao'">
                            <el-form-item label="" prop="offlineReason" size="small">
                                <el-input placeholder="请输入下线原因" v-model.trim="formData.offlineReason" class="input-with-select" :disabled="formData.offlineSelected == '0'">
                                    <el-select v-model="formData.offlineSelected" slot="prepend" placeholder="请选择" class="inline-select-input">
                                        <el-option label="仅修改" value="0"></el-option>
        								<el-option label="原文下线修改" value="1"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                        </el-row>
                    </el-card>
                    <el-tabs type="border-card" class="mt-10" v-if="!isDFH">
                        <el-tab-pane label="封面图">
                            <!--上传图片后显示的内容-->
                            <draggable :list="fileList" class="img_Box" v-if="fileList.length!==0">
                                <div class="img_Box_item" v-for="(item,index) in fileList">
                                    <img :src="item">
                                    <div class="img_Box_tools">
                                        <i class="el-icon-zoom-in" @click.stop="toBig(item)"></i>
                                        <i class="el-icon-delete ml-10" @click.stop="removeImg(item,index)"></i>
                                    </div>
                                </div>
                            </draggable>
                            <!--上传图片组件-->
                            <el-upload
                                v-if="fileList.length < (isDFH ? 3 : 4)"
                                class="edit-drag__upload"
                                :class="fileList.length!==0?'has_imgs':''"
                                multiple
                                drag
                                :show-file-list="false"
                                :action="fileUpload"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload">
                                <i class="el-icon-plus" v-if="fileList.length!==0"></i>
                                <i class="el-icon-upload" v-if="fileList.length===0"></i>
                                <div class="el-upload__text" v-if="fileList.length===0">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip" v-if="fileList.length===0">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-tab-pane>
                        <el-tab-pane>
                            <span slot="label">GIF图 <span class="tabDot" v-if="gifFileList.length!=0">1</span></span>
                            <!--上传图片后显示的内容-->
                            <draggable :list="gifFileList" class="img_Box" v-if="gifFileList.length!==0">
                                <div class="img_Box_item" v-for="(item,index) in gifFileList">
                                    <img :src="item">
                                    <div class="img_Box_tools">
                                        <i class="el-icon-zoom-in" @click.stop="toBig(item)"></i>
                                        <i class="el-icon-delete ml-10" @click.stop="removeGif(item,index)"></i>
                                    </div>
                                </div>
                            </draggable>
                            <!--上传图片组件-->
                            <el-upload
                                v-if="gifFileList.length<1"
                                class="edit-drag__upload"
                                :class="gifFileList.length!==0?'has_imgs':''"
                                multiple
                                drag
                                :show-file-list="false"
                                :action="fileUpload"
                                :on-success="handleGifSuccess"
                                :before-upload="beforeGifUpload">
                                <i class="el-icon-plus" v-if="gifFileList.length!==0"></i>
                                <i class="el-icon-upload" v-if="gifFileList.length===0"></i>
                                <div class="el-upload__text" v-if="gifFileList.length===0">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip" v-if="gifFileList.length===0">只能上传gif文件</div>
                            </el-upload>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="正文图">
                            <div class="img_Box_item" v-for="(item,index) in contentImgs">
                                <img :src="item">
                                <div class="img_Box_tools">
                                    <i class="el-icon-zoom-in" @click.stop="toBig(item)"></i>
                                    <i class="el-icon-delete ml-10" @click.stop="removeGif(item,index)"></i>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="网络图">网络图</el-tab-pane> -->
                        <el-tab-pane label="上传视频" v-if="formData.platform=='xianggang'||formData.platform=='yangzi'||formData.platform=='hebei'||formData.platform=='hainan'">
                            <el-upload
								class="avatar-videoUploader"
								:action="videoUploadUrl"
								accept='.mp4,.mov,.Mp4'
								:show-file-list="false"
								:on-success = 'handleChange'
								:http-request='beforeAvatarVedioUpload'
								:on-change='handleChange'
								>
								<i class=" avatar-video-uploader-icon" v-if='!videoload&&videoloadSize==0&&!aliyunload&&aliyunSize==0'></i>
								<div class="clearfix">
									<div class="pull-left">
										<el-progress type="circle" :percentage="Number(videoloadSize)" v-if='!videoload&&videoloadSize>0'></el-progress>
										<el-progress type="circle" :percentage="Number(videoloadSize)" v-if='videoload&&videoUrl==""' status="exception"></el-progress>
										<p style="color:#666;font-size:18px;margin:0" v-if='!videoload&&videoloadSize>0'>ucloud上传进度</p>
										<video width="160" height="120" v-if='videoUrl!=""' id='sendVideoUc' controls >
										<source :src="videoUrl" type="video/mp4">
										您的浏览器不支持 video 属性。
										</video>
									</div>
									<div class="pull-left" style="margin-left:20px;margin-right: 20px;">
										<el-progress type="circle" :percentage="Number(aliyunSize)" v-if='!aliyunload&&Number(aliyunSize)>0'></el-progress>
										<el-progress type="circle" :percentage="Number(aliyunSize)" v-if='aliyunload&aliyunUrl==""' status="exception"></el-progress>
										<p style="color:#666;font-size:18px;margin:0" v-if='!aliyunload&&aliyunSize>0'>aliyun上传进度</p>
										<video width="160" height="120" v-if='aliyunUrl!=""' id='sendVideoAli'  controls >
										<source :src="aliyunUrl" type="video/mp4">
										您的浏览器不支持 video 属性。
										</video>
									</div>
								</div>
							</el-upload>
                            <div style="margin-top:20px;">
                                <el-button type="primary" v-if='videoUrl!=""' @click="handleAddVideo(videoUrl)">插入视频</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <!-- <el-card class="mt-10"></el-card> -->
                </el-col>
            </el-form>
        </el-row>
        <!--图片放大-->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
        <!--正文预览-->
        <el-dialog title="页面预览" :visible.sync="replyFormVisible" top="5%" :close-on-click-modal="false">
			<div >
		  	    <iframe :src="contentPreview" style="border: 0;" width="100%" height="500px" v-if="replyFormVisible"></iframe>
			</div>
		</el-dialog>
        <!--缩略图预览-->
        <el-dialog title="略缩图预览" :visible.sync="replyImgVisible" :close-on-click-modal="false">
			2:1
			<div>
				<img width="100%" v-for="item in newImg.lunbjs" :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
			</div>
			4:3
			<div >
				<img width="100%" v-for="item in newImg.minijs"  :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
			</div>
			16:9大图
			<div >
				<img width="100%" v-for="item in newImg.miniajs"  :src="item.src" :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
			</div>
			16：9
			<div>
				<img width="100%" v-for="item in newImg.minibjs" :src="item.src"  :width="item.imgwidth" :height="item.imgheight" :alt="item.img_name">
			</div>
		</el-dialog>
        <!--保存成功后的dialog-->
        <el-dialog :visible.sync="urlVisible" :close-on-click-modal="false">
            <h2>{{ newUrlTitle }}</h2>
            <p v-if="newUrlArr.length==0" class="newUrl-p">
                <a :href="newUrl" target="_blank" class="newUrl-a">{{ newUrl }}<i class="el-icon-circle-check success"></i></a>
            </p>
            <p v-else v-for="(item,index) in newUrlArr" :key="index" class="newUrl-p">
                <span class="newUrl-title">{{ index }}：</span><a :href="item" target="_blank" class="newUrl-a">{{ item }}<i class="el-icon-circle-check"></i></a>
            </p>
            <div slot="footer" class="dialog-footer" style="text-align:center;padding:35px 0">
                <el-button type="primary" @click="copyUrl(newUrl, $event)">复制并关闭</el-button>
            </div>
		</el-dialog>
        <sideslip :operationTrackShow='operationTrackShow'
                  :boxWidth="600"
                  @show="sideShow"
                  @fold="sideFold"
                  title="草稿列表/添加视频"
                  icon="draft">
            <el-tabs type="border-card" class="mt-10" value="1">
                <el-tab-pane label="草稿列表" name="1">
                    <el-table :show-header='false'
                              :data='drafList'
                              highlight-current-row
                              style="width: 100%"
                              :key="drafTableKey"
                              :height="drafHeight">
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="table-div">
                                    <div class="group-title">{{ scope.row.title }}</div>
                                    <div class="group-title-box">
                                        <div>{{ scope.row.source }}&nbsp;&nbsp;{{ scope.row.modifydate }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="160">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="editNewsDraft(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="图片搜索" name="2">
                    <el-input size="small"  v-model="formImgs.keywords" style="width: 70%;" placeholder="请输入关键词,多个关键词用逗号隔开"></el-input>
                    <el-button type="primary" @click="getHasCopyrightImg('search')">查询</el-button>
                    <div class="imgSearch_wrap" v-loading="copyRightLoading">
                        <div v-if="copyrightImgsList.length!==0">
                            <el-row :gutter="10" v-loadDiv="getHasCopyrightImg">
                                <div class="clearfix loadDiv" :style="{height: drafHeight + 'px'}">
                                    <el-col :span="8" class="imgSearch_item" v-for="(item,index) in copyrightImgsList" :key="index">
                                        <div class="imgSearch_item_wrap">
                                            <img :src="item.cdnurl" alt="">
                                            <div class="imgSearch_controls">
                                                <div class="btn_group">
                                                    <el-button type="text" @click="toBig(item.cdnurl)">放大</el-button>
                                                    <el-button type="text" @click="addCopyRightImgs(item)">插入</el-button>
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                </div>
                            </el-row>
                        </div>
                        <div class="imgSearch_null" v-else>
                            暂无图片
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="添加视频" name="3" v-if="formData.platform === 'toutiao'||formData.platform === 'dfsport'">
                    <el-row>
                        <p style="color:#666;font-size:12px;line-height:24px;">
                            添加视频操作指引：<br>
                            1.搜索视频，选择需要插入的视频，点击“复制链接”；<br>
                            2.将光标放在需要插入视频的位置，点击编辑器当中的插入视频图标；<br>
                            3.点击图标后，会自动插入刚刚复制的视频链接，点击“确定”即完成添加。<br>
                        </p>
                        <el-input size="small"  v-model="formVideo.keywords" style="width: 70%;" placeholder="请输入视频标题关键词"></el-input>
                        <el-button type="primary" @click="getVideoList(true)">搜索</el-button>
                    </el-row>
                    <el-row>
                        <el-table ref="singleTable" :data="videoList" highlight-current-row height="400" style="width: 100%" v-loadmore="loadMore">
                            <el-table-column prop="title" label="视频标题">
                            </el-table-column>
                            <el-table-column prop="pic" label="封面图">
                                <template slot-scope="scope">
                                    <img :src="scope.row.pic" width="150px" height="100px">
                                </template>
                            </el-table-column>
                            <el-table-column prop="videotime" label="视频长度" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.videotime | formatSeconds }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="source" label="来源">
                            </el-table-column>
                            <el-table-column prop="value" label="操作" fixed="right" width="100">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="handleAddVideo(scope.row.videourl)">插入视频</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="稿件释义" name="4">
                    <el-table :data="transferred.tableData"
                        :show-header="false"
                        :height="transferredHeight"
                        :key="transferredKey"
                        highlight-current-row
                        style="width: 100%;">
                        <el-table-column label="状态" width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="JSON.parse(scope.row.json).contentpara">转义成功</el-tag>
                                <el-tag type="info" v-if="!JSON.parse(scope.row.json).contentpara">转义中...</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="标题" min-width="140" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ JSON.parse(scope.row.json).title }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="210">
                            <template slot-scope="scope">
                                <div v-if="JSON.parse(scope.row.json).contentpara">
                                    <el-button type="primary" size="mini" @click="transferredView(scope.row)">预览</el-button>
                                    <el-button type="primary" size="mini" @click="transferredEdit(scope.row)">编辑</el-button>
                                    <el-button type="primary" size="mini" @click="delTransferredContent(scope.row)">删除</el-button>
                                </div>
                                <div v-if="!JSON.parse(scope.row.json).contentpara">
                                    <el-button type="primary" size="mini" @click="getTransferredList">刷新状态</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row class="toolbar">
                        <el-pagination
                            @current-change="transferredCurrentChange"
                            @size-change="transferredSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[10, 15, 20, 50, 100]"
                            :page-size="transferred.pageSize"
                            :current-page="transferred.currentPage"
                            :total="transferred.total"
                            background
                            style="float:right;">
                        </el-pagination>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="热文列表" name="5">
                    <el-table :data="hotAriticle.tableData"
                        :height="transferredHeight"
                        :key="transferredKey"
                        highlight-current-row
                        style="width: 100%;">
                        <el-table-column prop="title" label="标题" min-width="140" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.title }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="hotAriticleEdit(scope.row)">编辑</el-button>
                                <el-button type="primary" size="mini" @click="delHotContent(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row class="toolbar">
                        <el-pagination
                            @current-change="hotAriticleCurrentChange"
                            @size-change="hotAriticleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[10, 15, 20, 50, 100]"
                            :page-size="hotAriticle.pageSize"
                            :current-page="hotAriticle.currentPage"
                            :total="hotAriticle.total"
                            background
                            style="float:right;">
                        </el-pagination>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </sideslip>
        <el-dialog
            :visible.sync="transferredVisible"
            :fullscreen="true">
            <el-row :gutter="10">
                <el-col :span="12">
                    <div class="transferred_title">
                        <h3>{{ nowTitle }}</h3>
                        <el-button type="primary" size="mini" @click="useNowContent">使用原文</el-button>
                    </div>
                    <div class="mt-10 transferred_content" v-html="nowContent" ref="leftDiv"
                        :style="{height:divHeight+'px'}"
                    ></div>
                </el-col>
                <el-col :span="12">
                    <div class="transferred_title">
                        <h3>{{ transferredTitle }}</h3>
                        <el-button type="primary" size="mini" @click="useTransferredContent">使用义文</el-button>
                    </div>
                    <div class="mt-10 transferred_content" v-html="transferredContent" ref="rightDiv"
                        :style="{height:divHeight+'px'}"
                    ></div>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
import $ from 'jquery'
import {
    mapGetters
} from 'vuex';
//Aliyun OSS
import '@/assets/aliyun/aliyun-sdk.min.js'
import '@/assets/aliyun/oss-js-upload.js'
import vueUEditor from '@/components/UEditor'
import sideslip from '@/components/sideslip'
import draggable from 'vuedraggable'
import {
    parseTime,
    delImgHasNullSrc,
    isNull,
    timeoutTime,
    arrContainsObj,
    formatSeconds
} from '@/utils'
import clip from '@/utils/clipboard'
import {
    contentToHtml,
    myReplace,
    contentEditorHtml
} from '@/utils/contentTransform'
import {
    getOperPlatform,
    BUCKETALIY,
    BUCKEXG
} from '@/api/commonApi'
import {
    newsPlatType,
    newsContentPreview,
    newsImgPreview,
    newsAdd,
    newsDetail,
    queryNewsDraft,
    addNewsDraft,
    deleteNewsDraft,
    getAddVideoList,
    newsvideoGetauth,
    getTransferredList,
    contentTransferred,
    delTransferredContent,
    getHasCopyrightImg,
    getHotAriticleList,
    delHotAriticle,
    getDFHtypes,
    dfhSaveContent,
    collectNews
} from '@/api/contentManage'
import {
    getfileUpload
} from '@/api/operationTools'
import loadmore from '@/directive/loadMore'
import loadDiv from '@/directive/loadDiv'

export default {
    components: {
        vueUEditor,
        draggable,
        sideslip
    },
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    name: 'editNews',
    filters: {
        formatSeconds: function(value) {
            if (!value) return ''
            return formatSeconds(value);
        }
    },
    directives: {
        loadmore,
        loadDiv
    },
    data() {
        // 东方号原因检测
        let checkOfflineReason = (rule, value, callback) => {
            if (this.formData.offlineSelected === '1' && !value && this.pageStatus === 'edit') {
                return callback(new Error('原因不能为空'))
            } else {
                callback()
            }
        }
        return {
            copyRightKey: '',
            isDFH: false,
            copyRightLoading: false,
            copyrightImgsListAll: [

            ],
            copyRightImgs: {
                currentPage: 1,
                pageSize: 9,
                total: 0
            },
            copyrightImgsList: [

            ],
            formImgs: {
                keywords: ''
            },
            transferredTitle: '',
            nowTitle: '',
            transferredVisible: false,
            nowContent: '',
            transferredContent: '',
            // add 新增 | edit 编辑
            pageStatus: 'add',
            fileList: [],
            gifFileList: [],
            contentImgs: [],
            fileShowList: [],
            editorInstance: null,
            fileUpload: '',
            collectUrl: '',
            isOriginal: false,
            isBaijia: false,
            isSync: false,
            isQunMedia: false,
            isAllPowerfullWifi: false,
            editTime: '',
            formData: {
                platform: '',
                radioType: '1', // 1新增2编辑
                maintype: [],
                title: '',
                source: '',
                localsite: [], // 新能源
                labelname: [], // 广州车展
                content: '',
                offlineReason: '',
                offlineSelected: '0',
                purl: ''
            },
            platformOptions: [],
            newsTypeLevel: [],
            dfhNickName: '',
            // 标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            dialogImageUrl: '',
            dialogVisible: false,
            // 正文预览
            replyFormVisible: false,
            contentPreview: '',
            // 缩略图
            replyImgVisible: false,
            newImg: '',
            loading: {
                contentPreview: false,
                imgsPreview: false,
                save: false,
                search: false,
                saveDraft: false,
                transferred: false,
                dfhsave: false
            },
            // 保存成功的URL dialog
            newUrlTitle: '',
            newUrl: '',
            newUrlArr: '',
            urlVisible: false,
            // dongfanghao提醒
            warningShow: false,
            // 按钮disabled
            btnDisabled: {
                contentPreview: false,
                imgsPreview: true,
                save: true
            },
            divHeight: 460,
            // 草稿
            drafList: [],
            drafHeight: 400,
            drafTableKey: 0,
            draft: {
                id: 0,
                idAdd: 0,
                page: 1,
                total: 100,
                maintype: '',
                platform: ''
            },
            operationTrackShow: false,
            // 视频列表
            formVideo: {
                keywords: '',
                page: 1,
                pageSize: 20,
                stkey_video: 0,
                lastcol_video: 20
            },
            transferredId: 0,
            transferred: {
                id: 0,
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 10,
            },
            hotAriticle: {
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 10
            },
            transferredHeight: 400,
            transferredKey: 0,
            videoList: [],
            // 视频上传
            videoUploadUrl: '',
            videoloadSize: 0,
            videoUrl: '',
            videoload: false,
            aliyunSize: 0,
            aliyunload: false,
            aliyunUrl: '',
            // 表单提交规则
            rules: {
                title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    },
                    {
                        min: 5,
                        max: 50,
                        message: '长度在 5 到 50 个字符',
                        trigger: 'blur'
                    }
                ],
                content: [{
                    required: true,
                    message: '请输入正文',
                    trigger: 'blur'
                }],
                platform: [{
                    required: true,
                    message: '请选择相应的平台',
                    trigger: 'blur'
                }],
                maintype: [{
                    required: true,
                    message: '请选择分类',
                    trigger: 'blur'
                }],
                source: [{
                        required: true,
                        message: '请填写来源',
                        trigger: 'change'
                    }
                ],
                offlineReason: [{
                    validator: checkOfflineReason,
                    trigger: 'blur'
                }]
            },
            dfhSendAuth: false
        }
    },
    mounted() {
        this.fileUpload = getfileUpload
        this.getOperPlatform()
        this.getEditDetail()
        this.getTableHeight()
        this.getHotAriticleList()
        // this.getAuth()
    },
    activated() {
        this.getEditDetail()
    },
    methods: {
        getAuth() { //权限控制
            let authorList = localStorage.getItem('authorList')
            if (authorList.indexOf('sendNews/byDFH') > -1) {
                this.dfhSendAuth = true
            }
        },
        equalityTwoScroll(){
            var timer
            function throttle(method,context){
                clearTimeout(timer);
                timer=setTimeout(function(){
                    method.call(context)
                },100)
            }
            var lefDiv = this.$refs.leftDiv
            var rightDiv = this.$refs.rightDiv
            function leftScroll(){
                rightDiv.scrollTop = lefDiv.scrollTop
                rightDiv.scrollLeft= lefDiv.scrollLeft
            }
            function rightScroll(){
                lefDiv.scrollTop = rightDiv.scrollTop
                lefDiv.scrollLeft= rightDiv.scrollLeft
            }
            lefDiv.onscroll = function(){
                throttle(leftScroll)
            }
            rightDiv.onscroll = function(){
                throttle(rightScroll)
            }
        },
        getHasCopyrightImg(type){
            if(type === 'search'){
                this.copyRightKey = ''
                this.copyrightImgsList = []
            }
            let params = {
                tags: this.formImgs.keywords,
                startkey: this.copyRightKey,
                pgsize: 10
            }
            this.copyRightLoading = true
            getHasCopyrightImg(params).then(res => {
                if(res.code === '00001'){
                    if(res.data.length != 0){
                        this.copyrightImgsList = this.copyrightImgsList.concat(res.data.data)
                        this.copyRightKey = res.data.startkey
                    }else{
                        this.$message({
                            message: '暂无更多图片',
                            type: 'warning'
                        });
                    }
                }
                this.copyRightLoading = false
            })
        },
        // 根据显示器不同的表格高度
        getTableHeight() {
            // 可视宽度(判断)
            var seeHeight = document.body.clientWidth
            if (seeHeight <= 1920 && seeHeight > 1600) {
                this.drafHeight = 600
                this.drafTableKey += 1
                this.transferredHeight = 600
                this.transferredKey += 1
                this.divHeight = 700
            } else if (seeHeight < 1380) {
                this.drafHeight = 400
                this.drafTableKey += 1
                this.transferredHeight = 400
                this.transferredKey += 1
                this.divHeight = 400
            }
        },
        // 编辑状态
        getEditDetail() {
            // 编辑页面
            if (this.$route.query.rowkey) {
                this.formData.purl = this.$route.query.rowkey
                this.formData.platform = this.$route.query.platform
                this.searchNeweditor()
            }
        },
        // 获取平台
        getOperPlatform() {
            var _this = this;
            let params = {
                userName: this.$store.getters.name,
                url: 'send/news'
            }
            getOperPlatform(params).then(res => {
                _this.platformOptions = res.data;
                _this.platformOptions.find(function(item, index, arr) { //过滤体育项目排到第一
                    if (item.value == 'all') {
                        _this.platformOptions.splice(index, 1)
                        _this.platformOptions.unshift(item)
                    }
                    return;
                });
                if (_this.$route.query.rowkey == undefined) {
                    _this.formData.platform = _this.platformOptions[0].value;
                }
                _this.getNewsType();

                // _this.routeChange();
            });
        },
        // 获取分类(分类不默认填写，防止编辑没有注意到分类 填选成默认分类)
        getNewsType() {
            this.transferred.id = 0
            this.getTransferredList()
            if (this.formData.platform == '') {
                return;
            }
            let param = {
                type: '',
                parentId: ''
            };
            var level1 = [];
            var level2 = [];
            var level3 = [];
            if (this.formData.platform == 'toutiao') { //地方头条
                param.type = 'addtoutiaonews';
                this.formData.maintype = [];
                this.newsTypeLevel = [];
                param.parentId = '0';
            } else if (this.formData.platform == 'dfsport' || this.formData.platform == 'all') { //体育类别
                param.type = 'dfsportnewsadd';
                this.formData.maintype = [];
                this.newsTypeLevel = [];
                param.parentId = '0';
            } else if (this.formData.platform == 'eastdayqiche') { //东方汽车
                this.formData.maintype = [];
                param.type = 'addqichenews'; //汽车类别
                param.parentId = this.formData.platform;
                this.newsTypeLevel = [];
            } else if (this.formData.platform === 'wxsport') {
                this.formData.maintype = [];
                param.type = 'wuxingsportsnewsadd'; //五星体育类别
                param.parentId = this.formData.platform;
                this.newsTypeLevel = [];
            } else if (this.formData.platform == 'yangzi') { //扬子头条
                this.formData.maintype = [];
                param.type = 'yzwbnewsadd'; //汽车类别
                this.newsTypeLevel = [];
                param.parentId = this.formData.platform;
            } else if (this.formData.platform == 'lieqi') { // 猎奇
                this.formData.maintype = [];
                param.type = 'outernewsadd'; //汽车类别
                this.newsTypeLevel = [];
                param.parentId = this.formData.platform;
            } else {
                this.formData.maintype = [];
                param.type = 'newsaddlocal'; //地方类别
                param.parentId = this.formData.platform;
                this.newsTypeLevel = [];
            }
            this.draft.id = 0;
            this.draft.platform = this.formData.platform;
            this.queryNewsDraft(); //改变草稿
            newsPlatType(param).then(res => {
                if (res.data && res.data.length) {
                    // 体育项目/东方体育/五星体育 有多级分类
                    // 将一/二/三级分类分别筛选
                    if (this.formData.platform == 'dfsport' || this.formData.platform == 'wxsport' || this.formData.platform == 'all') {
                        for (var i = 0; i < res.data.length; i++) {
                            if (res.data[i].level && res.data[i].level == 1) {
                                level1.push({
                                    value: res.data[i].typePy,
                                    label: res.data[i].typeName,
                                    typeId: res.data[i].typeId,
                                    level: res.data[i].level
                                })
                            } else if (res.data[i].level && res.data[i].level == 2) {
                                level2.push({
                                    value: res.data[i].typePy,
                                    label: res.data[i].typeName,
                                    typeId: res.data[i].typeId,
                                    parentId: res.data[i].parentId,
                                    level: res.data[i].level
                                })
                            } else if (res.data[i].level && res.data[i].level == 3) {
                                level3.push({
                                    value: res.data[i].typePy,
                                    label: res.data[i].typeName,
                                    typeId: res.data[i].typeId,
                                    parentId: res.data[i].parentId,
                                    level: res.data[i].level
                                })
                            }
                        }
                        // 将一/二/三级 分类进行匹配
                        for (var i = 0; i < level1.length; i++) {
                            for (var j = 0; j < level2.length; j++) {
                                if (level1[i].typeId == level2[j].parentId) {
                                    if (level1[i].children == undefined) {
                                        level1[i].children = [];
                                    }
                                    for (var k = 0; k < level3.length; k++) {
                                        if (level2[j].typeId == level3[k].parentId) {
                                            if (level2[j].children == undefined) {
                                                level2[j].children = [];
                                            }
                                            level2[j].children.push({
                                                value: level3[k].value,
                                                label: level3[k].label
                                            });
                                        }
                                    }
                                    level1[i].children.push({
                                        value: level2[j].value,
                                        label: level2[j].label,
                                        parentId: level2[j].parentId,
                                        typeId: level2[j].typeId,
                                        children: level2[j].children
                                    })
                                }
                            }
                        }
                        this.newsTypeLevel = level1;
                    } else {
                        for (var i = 0; i < res.data.length; i++) {
                            // 编辑猎奇
                            if (this.formData.platform == 'lieqi' && this.formData.radioType == '1') {
                                // 猎奇分类部分编辑时不显示
                                if (!res.data[i].isaddhidden) {
                                    level1.push({
                                        value: res.data[i].typePy,
                                        label: res.data[i].typeName,
                                        typeId: res.data[i].typeId,
                                        level: res.data[i].level
                                    })
                                }
                            } else {
                                level1.push({
                                    value: res.data[i].typePy,
                                    label: res.data[i].typeName,
                                    typeId: res.data[i].typeId,
                                    level: res.data[i].level
                                })
                            }
                        }
                        this.newsTypeLevel = level1;
                    }

                    // if ((this.formData.platform == 'dfsport' || this.formData.platform == 'all') && this.draft.maintype != '') {
                    //     this.formData.maintype = this.draft.maintype;
                    // }
                }
            })
        },
        editorReady(editorInstance) {
            this.editorInstance = editorInstance;
            editorInstance.setContent(this.formData.content);
            editorInstance.addListener('contentChange', () => {
                this.showSave = false;
                this.showImg = false;
                this.formData.content = editorInstance.getContent();
            });

        },
        // 标签
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
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
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 上传图片
        // 上传前
        beforeUpload(file) {
            let fileType = file.type
            let fileSize = file.size
            if (fileType != 'image/jpeg' && fileType != 'image/png') {
                this.$message({
                    message: '请上传 jpg/png 图片',
                    type: 'warning'
                });
                return false
            }
        },
        beforeGifUpload(file) {
            let fileType = file.type
            let fileSize = file.size

            const isLt2M = file.size / 1024 / 1024 < 2;
            if (fileType != 'image/gif') {
                this.$message({
                    message: '请上传 GIF 图片',
                    type: 'warning'
                });
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
                return false
            }
        },
        // 上传成功后返回
        handleSuccess(response, file, fileList) {
            if(this.fileList.length < (this.isDFH ? 3 : 4)){
                this.fileList.push(response.url)
            }
            // 改动封面后需重新进行图片预览
            this.btnDisabled.save = false
        },
        handleGifSuccess(response, file, fileList) {
            this.gifFileList.push(response.url)
            // 改动封面后需重新进行图片预览
            this.btnDisabled.save = false
        },
        // 放大
        toBig(url) {
            this.dialogImageUrl = url
            this.dialogVisible = true
        },
        // 删除
        removeImg(url, index) {
            var _this = this;
            _this.fileList.forEach((item, index) => {
                if (item == url) {
                    _this.fileList.splice(index, 1)
                }
            })
            // 改动封面后需重新进行图片预览
            this.btnDisabled.save = false
        },
        removeGif(url, index) {
            var _this = this;
            _this.gifFileList.forEach((item, index) => {
                if (item == url) {
                    _this.gifFileList.splice(index, 1)
                }
            })
            // 改动封面后需重新进行图片预览
            this.btnDisabled.save = false
        },
        // 搜索
        searchNeweditor(type) {
            let newsType = ''
            this.pageStatus = 'edit'
            if (this.pageStatus === 'edit') { // 编辑接口
                switch (this.formData.platform) {
                    case 'dfsport':
                        newsType = 'dfsportnewsedit'
                        break
                    case 'all':
                        newsType = 'dfsportnewsedit'
                        break
                    case 'eastdayqiche':
                        newsType = 'editqichenews'
                        break
                    case 'yangzi':
                        newsType = 'yzwbnewsedit'
                        break
                    case 'wxsport':
                        newsType = 'wuxingsportsnewsedit'
                        break
                    case 'lieqi':
                        newsType = 'outernewsupdate'
                        break
                    default:
                        newsType = 'edittoutiaonews'
                }
            }
            let params = {
                id: this.formData.purl,
                type: newsType,
            }
            if (this.formData.purl == '') {
                this.$message({
                    type: 'warning',
                    message: '请输入来源URl'
                })
                return false
            }
            if (this.formData.platform == '') {
                this.$message({
                    type: 'warning',
                    message: '请选择平台'
                })
                return false
            }
            this.loading.search = true
            let time = setTimeout(() => {
                this.loading.search = false
            }, 5000)
            newsDetail(params).then(res => {
                if (res.code !== '00001') {
                    this.loading.search = false
                    clearTimeout(time)
                }
                if (res.ret === '数据审核中') {
                    this.$message({
                        type: 'warning',
                        message: '数据审核中,暂时无法编辑'
                    })
                    this.loading.search = false
                    clearTimeout(time)
                    return false
                }
                var newData = res.data
                if (newData.isabroad == 0 && this.formData.platform == 'xianggang') {
                    this.$message({
                        type: 'warning',
                        message: '該新聞不屬於香港自有新聞 ! '
                    })
                    this.loading.search = false
                    clearTimeout(time)
                    return false
                }
                if (type == 'search' && this.formData.platform != 'yangzi') {
                    this.formData.platform = ((newData.lcsite == '' || newData.lcsite == null) ? 'toutiao' : newData.lcsite)
                }
                this.isAllPowerfullWifi = Boolean(parseInt(newData.iswnwifi))
                this.formData.title = newData.contenttitle
                this.formData.source = newData.source
                this.formData.purl = newData.url
                this.formData.urlfrom = newData.urlfrom
                this.dynamicTags = newData.keywords ? newData.keywords.split(',') : []
                if (newData.urlfrom === 'dongfanghao') {
                    this.warningShow = true
                } else {
                    this.warningShow = false
                }
                // 封面赋值
                let imgList
                if (isNull(newData.minicjs)) {
                    if (isNull(eval("(" + newData.minicjs + ")"))) {
                        imgList = eval("(" + newData.minicjs + ")");
                    } else {
                        imgList = eval("(" + newData.minijs + ")");
                    }
                } else {
                    imgList = eval("(" + newData.minijs + ")")
                }
                this.fileListShow = []
                this.fileList = []
                for (var i = 0; i < imgList.length; i++) {
                    this.fileList.push(imgList[i].src);
                    this.fileListShow.push({
                        name: imgList[i].imgname,
                        url: imgList[i].src
                    });
                }
                var gifList = []
                try {
                    gifList = eval("(" + newData.pcgifminijs + ")")
                } catch (e) {
                    console.log(e)
                }
                this.gifFileList = []
                if(gifList){
                    if(gifList.length!=0 && this.gifFileList.length==0){
                        this.gifFileList.push(gifList[0].src)
                    }
                }
                if(this.formData.platform == 'xianggang'){
                    this.formData.content = contentEditorHtml(newData,'gbk');
                }else if(this.formData.platform == 'yangzi'){
                    this.formData.content = contentEditorHtml(newData,'yangzi');
                }else{
                    this.formData.content = contentEditorHtml(newData);
                }

                // UEditor的ready在nextTick中 到时候会给ueditor赋值，再此赋值，ueditor还是null(页面初次打开)
                // 搜索时还是需要赋值
                if (this.editorInstance !== null) {
                    this.editorInstance.setContent(this.formData.content)
                }
                // 分类赋值
                if (this.formData.platform === 'dfsport' || this.formData.platform === 'all' || this.formData.platform === 'wxsport') {
                    let maintype = []
                    maintype.push(newData.tplv001py)
                    maintype.push(newData.tplv002py)
                    maintype.push(newData.tplv003py)
                    this.formData.maintype = maintype
                } else {
                    // 如果之前分类接口获取的分类没有该新闻的分类，也要回显
                    this.formData.maintype = []
                    if (!arrContainsObj(this.newsTypeLevel, newData.urlmaintypepy)) {
                        this.newsTypeLevel.push({
                            label: newData.urlmaintype,
                            value: newData.urlmaintypepy
                        })
                    }
                    this.formData.maintype.push(newData.urlmaintypepy)
                }

                // 判断如果有广告的话，则无法编辑
                if (isNull(res.data.advsjs)) {
                    this.loading.search = false
                    clearTimeout(time)
                    this.$message({
                        type: 'warning',
                        message: '数据含有广告无法编辑'
                    })
                    this.btnDisabled.contentPreview = true
                    return
                } else {
                    this.btnDisabled.contentPreview = false
                }
                this.loading.search = false
                clearTimeout(time)
            })
        },
        // 正文预览
        newsContentPreview(formName) {
            var _this = this
            // 正则匹配正文中的图片
            let imgReg = /<img.*?(?:>|\/>)/gi
            // 匹配src属性
            let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
            let imgArr = this.formData.content.match(imgReg)
            // 去除正文空的img标签
            delImgHasNullSrc(this.formData.content)
            // 不同接口 不同的 newsType
            let newsType = ''
            if (this.pageStatus === 'add') { // 新增接口
                switch (_this.formData.platform) {
                    case 'dfsport':
                        newsType = 'dfsportnewsadd'
                        break
                    case 'all':
                        newsType = 'dfsportnewsadd'
                        break
                    case 'eastdayqiche':
                        newsType = 'addqichenews'
                        break
                    case 'yangzi':
                        newsType = 'yzwbnewsadd'
                        break
                    case 'wxsport':
                        newsType = 'wuxingsportsnewsadd'
                        break
                    case 'toutiao':
                        newsType = 'addtoutiaonews'
                        break
                    case 'lieqi':
                        newsType = 'outernewsadd'
                        break
                    default:
                        newsType = 'newsaddlocal'
                }
            } else if (this.pageStatus === 'edit') { // 编辑接口
                switch (_this.formData.platform) {
                    case 'dfsport':
                        newsType = 'dfsportnewsedit'
                        break
                    case 'all':
                        newsType = 'dfsportnewsedit'
                        break
                    case 'eastdayqiche':
                        newsType = 'editqichenews'
                        break
                    case 'yangzi':
                        newsType = 'yzwbnewsedit'
                        break
                    case 'wxsport':
                        newsType = 'wuxingsportsnewsedit'
                        break
                    case 'lieqi':
                        newsType = 'outernewsupdate'
                        break
                    default:
                        newsType = 'edittoutiaonews'
                }
            }
            // 分页符需替换成规定的<hr>
            let param = {
                param: {
                    platform: _this.formData.platform,
                    purl: _this.formData.purl,
                    content: myReplace(_this.formData.content, '_ueditor_page_break_tag_', '<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>'),
                    maintype: _this.formData.maintype[0],
                    subtype: (this.formData.maintype.length != 0) ? this.formData.maintype[1] : '',
                    thirdtype: (this.formData.maintype.length != 0) ? this.formData.maintype[2] : '',
                    title: this.formData.title,
                    source: this.formData.source,
                    iswnwifi: Number(this.isAllPowerfullWifi).toString(),
                    labelname: _this.formData.labelname.join(","),
                    localsite: _this.formData.localsite.join(","),
                    keywords: _this.dynamicTags.join(","),
                    isoriginal: Number(_this.isOriginal).toString(),
                    keywords: _this.dynamicTags.join(","),
                    gifimg: _this.gifFileList.join(","),
                    edate: this.editTime == '' ? '' : parseTime(this.editTime, '{y}-{m}-{d} {h}:{i}:{s}')
                },
                type: newsType
            }

            // 如果没有封面，且正文有符合相关标准的图片，则自动填充
            if (isNull(imgArr) && this.fileList.length === 0) {
                let contentImgs = [] // 所有正文图片
                let coverImgs = [] // 正文图中复合要求，往封面中添加的图
                for (let i = 0; i < imgArr.length; i++) {
                    if (imgArr[i].match(srcReg) != null) {
                        let image = new Image()
                        image.src = imgArr[i].match(srcReg)[1]
                        image.onload = function() {
                            let imgWidth = image.width
                            let imgHeight = image.height
                            contentImgs.push({
                                src: imgArr[i].match(srcReg)[1],
                                width: imgWidth,
                                height: imgHeight,
                                index: i
                            })
                            // 执行到最后一个图片执行正文预览
                            if (i == imgArr.length - 1) {
                                //最多从正文取四张图
                                let contentImgsToCover = ((contentImgs.length >= 4) ? 4 : contentImgs.length)
                                for (let j = 0; j < contentImgsToCover; j++) {
                                    // 判断图片分辨率 550 * 309
                                    let rate = contentImgs[j].width / contentImgs[j].height
                                    if (contentImgs[j].width > 530 && rate < 1.80 && rate > 1.75) {
                                        coverImgs.push(contentImgs[j]) // 从正文中获取符合规格的封面图
                                    }
                                }
                                // 将图片按照index排序
                                contentImgs.sort(function(a, b) {
                                    return a.index - b.index
                                })
                                // 如果没有自定义封面 且 正文图中没有合适的图 则只采用第一张作为封面
                                if (coverImgs.length === 0) {
                                    _this.fileList.push(contentImgs[0].src)
                                } else {
                                    coverImgs.forEach(item => {
                                        _this.fileList.push(item.src)
                                    })
                                }
                                // 这里 onload执行后
                                // 防止iframe因链接一样的缓存
                                _this.contentPreview = ''
                                _this.$refs[formName].validate((valid) => {
                                    if (valid) {
                                        _this.loading.contentPreview = true
                                        let time = setTimeout(() => {
                                            _this.loading.contentPreview = false
                                        }, timeoutTime)
                                        newsContentPreview(param).then(res => {
                                            if (res.code === '00001') {
                                                _this.contentPreview = res.data + '?qid=cms'
                                                _this.replyFormVisible = true
                                                // 正文预览后才可以缩录图预览
                                                _this.btnDisabled.imgsPreview = false
                                                // 正文预览后如果没有缩略图，直接可以保存
                                                _this.btnDisabled.save = false
                                            }
                                            _this.loading.contentPreview = false
                                            clearTimeout(time)
                                        })
                                    }
                                })
                            }
                        }
                    }
                }
            } else {
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading.contentPreview = true
                        let time = setTimeout(() => {
                            this.loading.contentPreview = false
                        }, timeoutTime)
                        newsContentPreview(param).then(res => {
                            if (res.code === '00001') {
                                _this.contentPreview = res.data + '?qid=cms'
                                _this.replyFormVisible = true
                                // 正文预览后才可以缩录图预览
                                this.btnDisabled.imgsPreview = false
                                // 正文预览后如果没有缩略图，直接可以保存
                                this.btnDisabled.save = false
                            }
                            this.loading.contentPreview = false
                            clearTimeout(time)
                        })
                    }
                })
            }

        },
        // 图片预览
        newsImgPreview() {
            // 不同接口 不同的 newsType
            let newsType = ''
            if (this.pageStatus === 'add') { // 新增接口
                switch (this.formData.platform) {
                    case 'dfsport':
                        newsType = 'dfsportnewsadd'
                        break
                    case 'all':
                        newsType = 'dfsportnewsadd'
                        break
                    case 'eastdayqiche':
                        newsType = 'addqichenews'
                        break
                    case 'yangzi':
                        newsType = 'yzwbnewsadd'
                        break
                    case 'wxsport':
                        newsType = 'wuxingsportsnewsadd'
                        break
                    case 'toutiao':
                        newsType = 'addtoutiaonews'
                        break
                    case 'lieqi':
                        newsType = 'outernewsadd'
                        break
                    default:
                        newsType = 'newsaddlocal'
                }
            } else if (this.pageStatus === 'edit') { // 编辑接口
                switch (this.formData.platform) {
                    case 'dfsport':
                        newsType = 'dfsportnewsedit'
                        break
                    case 'all':
                        newsType = 'dfsportnewsedit'
                        break
                    case 'eastdayqiche':
                        newsType = 'editqichenews'
                        break
                    case 'yangzi':
                        newsType = 'yzwbnewsedit'
                        break
                    case 'wxsport':
                        newsType = 'wuxingsportsnewsedit'
                        break
                    case 'lieqi':
                        newsType = 'outernewsupdate'
                        break
                    default:
                        newsType = 'edittoutiaonews'
                }
            }
            let param = {
                param: {
                    imgs: this.fileList,
                    purl: this.formData.purl,
                },
                type: newsType
            }
            this.loading.imgsPreview = true
            let time = setTimeout(() => {
                this.loading.imgsPreview = false
            }, timeoutTime)
            newsImgPreview(param).then(res => {
                if (res.code === '00001') {
                    this.newImg = res.data
                    this.btnDisabled.save = false
                    // 2:1
                    this.newImg.lunbjs = JSON.parse(this.newImg.lunbjs)
                    // 4:3
                    let minijs
                    if (isNull(this.newImg.minicjs)) {
                        if (isNull(JSON.parse(this.newImg.minicjs))) {
                            minijs = JSON.parse(this.newImg.minicjs)
                        } else {
                            minijs = JSON.parse(this.newImg.minijs)
                        }
                    } else {
                        minijs = JSON.parse(this.newImg.minijs)
                    }
                    this.newImg.minijs = minijs
                    // 16:9 大图
                    this.newImg.miniajs = JSON.parse(this.newImg.miniajs)
                    // 16:9
                    let minibjs
                    if (isNull(this.newImg.minidjs)) {
                        if (isNull(this.newImg.minidjs)) {
                            minibjs = JSON.parse(this.newImg.minidjs);
                        } else {
                            minibjs = JSON.parse(this.newImg.minibjs);
                        }
                    } else {
                        minibjs = JSON.parse(this.newImg.minibjs);
                    }
                    this.newImg.minibjs = minibjs
                    this.replyImgVisible = true
                }
                this.loading.imgsPreview = false
                clearTimeout(time)
            })
        },
        // 保存
        newsAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        // 不同接口 不同的 newsType
                        let newsType = ''
                        if (this.pageStatus === 'add') { // 新增接口
                            switch (this.formData.platform) {
                                case 'dfsport':
                                    newsType = 'dfsportnewsadd'
                                    break
                                case 'all':
                                    newsType = 'dfsportnewsadd'
                                    break
                                case 'eastdayqiche':
                                    newsType = 'addqichenews'
                                    break
                                case 'yangzi':
                                    newsType = 'yzwbnewsadd'
                                    break
                                case 'wxsport':
                                    newsType = 'wuxingsportsnewsadd'
                                    break
                                case 'toutiao':
                                    newsType = 'addtoutiaonews'
                                    break
                                case 'lieqi':
                                    newsType = 'outernewsadd'
                                    break
                                default:
                                    newsType = 'newsaddlocal'
                            }
                        } else if (this.pageStatus === 'edit') { // 编辑接口
                            switch (this.formData.platform) {
                                case 'dfsport':
                                    newsType = 'dfsportnewsedit'
                                    break
                                case 'all':
                                    newsType = 'dfsportnewsedit'
                                    break
                                case 'eastdayqiche':
                                    newsType = 'editqichenews'
                                    break
                                case 'yangzi':
                                    newsType = 'yzwbnewsedit'
                                    break
                                case 'wxsport':
                                    newsType = 'wuxingsportsnewsedit'
                                    break
                                case 'lieqi':
                                    newsType = 'outernewsupdate'
                                    break
                                default:
                                    newsType = 'edittoutiaonews'
                            }
                        }
                        let params = {
                            param: {
                                platform: this.formData.platform,
                                content: myReplace(this.formData.content, '_ueditor_page_break_tag_', '<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>'),
                                maintype: this.formData.maintype[0],
                                date: this.editTime == '' ? '' : parseTime(this.editTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                                title: this.formData.title,
                                source: this.formData.source,
                                iswnwifi: Number(this.isAllPowerfullWifi).toString(),
                                purl: this.formData.purl,
                                isofficial: Number(this.isBaijia).toString(),
                                isoriginal: Number(this.isOriginal).toString(),
                                labelname: this.formData.labelname.join(","),
                                localsite: this.formData.localsite.join(","),
                                keywords: this.dynamicTags.join(","),
                                paraid: this.transferred.id?this.transferred.id:0
                            },
                            type: newsType
                        }
                        // 体育平台分类为三级
                        if (this.formData.platform == 'dfsport' || this.formData.platform == 'all' || this.formData.platform == 'wxsport') {
                            params.param.subtype = this.formData.maintype[1]
                            params.param.thirdtype = this.formData.maintype[2]
                        } else {
                            params.param.offlinedfh = this.formData.offlineSelected
                            params.param.reason = this.formData.offlineReason
                        }
                        this.loading.save = true
                        let time = setTimeout(() => {
                            this.loading.save = false
                        }, timeoutTime)
                        newsAdd(params).then(res => {
                            if (res.code === '00001') {
                                this.newUrlTitle = this.formData.title
                                // 删除转义
                                // if(this.transferred.id && this.transferred.id!=0){
                                //     this.delTransferredContent()
                                // }
                                this.resetForm('form')
                                this.newUrl = res.data
                            }
                            if (this.newUrl.indexOf(',') != -1) {
                                this.newUrlArr = this.newUrl.split(',');
                                var urlArr = {}
                                this.newUrlArr.forEach(function(item) {
                                    var key = item.split('：')[0];
                                    var url = item.split('：')[1];
                                    urlArr[key] = url
                                })
                                this.newUrlArr = urlArr
                            } else {
                                this.newUrlArr = []
                            }
                            this.urlVisible = true
                            this.loading.save = false
                            clearTimeout(time)
                            if (this.draft.idAdd != 0) { //是草稿编辑保存后查询更新草稿列表
                                deleteNewsDraft({
                                    id: this.draft.idAdd
                                }).then(res => {
                                    this.draft.id = 0;
                                    this.queryNewsDraft();
                                });
                            }
                        })
                    })
                }
            })
        },
        // 东方号发文保存
        newsDfhAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.dynamicTags.length === 0){
                        this.$message({
                            message: '请填写关键词',
                            type: 'warning'
                        })
                        return false
                    }
                    this.$confirm('确认提交吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            title: this.formData.title,
                            maintype: this.formData.maintype[0],
                            subtype: (this.formData.maintype.length != 0) ? this.formData.maintype[1] : '',
                            thirdtype: (this.formData.maintype.length != 0) ? this.formData.maintype[2] : '',
                            isoriginal: Number(this.isOriginal).toString(),
                            content: myReplace(this.formData.content, '_ueditor_page_break_tag_', '<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>'),
                            userid: this.formData.source.dfhid,
                            username: this.formData.source.dfhname,
                            source: this.formData.source.dfhname,
                            keywords: this.dynamicTags.join(","),
                            purl: this.formData.purl
                        }
                        this.loading.dfhsave = true
                        let time = setTimeout(() => {
                            this.loading.dfhsave = false
                        }, timeoutTime)
                        dfhSaveContent(params).then(res => {
                            if(res.code === '00001'){
                                this.resetForm('form')
                                this.$notify({
                                    title: '成功',
                                    message: '保存成功',
                                    type: 'success'
                                });
                            }
                            this.loading.dfhsave = false
                            clearTimeout(time)
                            if (this.draft.idAdd != 0) { //是草稿编辑保存后查询更新草稿列表
                                deleteNewsDraft({
                                    id: this.draft.idAdd
                                }).then(res => {
                                    this.draft.id = 0;
                                    this.queryNewsDraft();
                                });
                            }
                        })
                    })
                }
            })
        },
        // 查询草稿列表
        queryNewsDraft() {
            let para = {
                page: this.draft.page,
                total: this.draft.total,
                id: 0,
                platform: this.draft.platform
            }
            queryNewsDraft(para).then(res => {
                this.drafList = res.data
            });
        },
        // 编辑草稿
        editNewsDraft(index, row) {
            if (row.url != "") {
                this.pageStatus = "edit"
            }
            this.draft.idAdd = row.id
            this.draft.id = row.id
            this.formData.platform = row.platform
            this.formData.title = row.title
            if(!this.isDFH){
                this.formData.source = row.source
            }
            this.formData.urlfrom = row.urlfrom
            if (row.urlfrom === 'dongfanghao') {
                this.warningShow = true
            } else {
                this.warningShow = false
            }

            this.formData.purl = row.url
            this.dynamicTags = row.keyword ? row.keyword.split(',') : []
            let title_pic = row.title_pic ? row.title_pic : '[]'
            let imgList = JSON.parse(title_pic)
            this.fileList = []
            this.fileListShow = []
            for (var i = 0; i < imgList.length; i++) {
                this.fileList.push(imgList[i]);
                this.fileListShow.push({
                    name: i,
                    url: imgList[i]
                });
            }
            this.formData.content = contentEditorHtml(row)
            this.editorInstance.setContent(this.formData.content)
            if (this.formData.platform == 'dfsport' || this.formData.platform == 'all') {
                this.draft.maintype = [];
                this.draft.maintype.push(row.maintype); //urlmaintypeid
                this.draft.maintype.push(row.subtype);
                this.draft.maintype.push(row.thirdtype);
                this.formData.maintype = this.draft.maintype;
            } else {
                this.draft.maintype = [];
                this.draft.maintype.push(row.maintype);
                this.formData.maintype = this.draft.maintype; //urlmaintypeid
            }
            this.operationTrackShow = false
        },
        // 删除草稿
        handleDelete(index, row) {
            this.$confirm('确认删除吗?', '提示', {
                type: 'warning'
            }).then(() => {
                deleteNewsDraft({
                    id: row.id
                }).then(res => {
                    if (res.code == '00001') {
                        this.drafList.splice(index, 1);
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                });
            });
        },
        // 复制URL按钮
        copyUrl(text, event) {
            clip(text, event)
            this.urlVisible = false
        },
        sideShow(val) {
            this.operationTrackShow = val
        },
        sideFold(val) {
            this.operationTrackShow = val
        },
        // 新增草稿
        addNewsDraft(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('确认添加草稿吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            id: this.draft.idAdd,
                            platform: this.formData.platform,
                            content: myReplace(this.formData.content, '_ueditor_page_break_tag_', '<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>'),
                            maintype: this.formData.maintype[0],
                            date: this.editTime == '' ? '' : parseTime(this.editTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                            title: this.formData.title,
                            source: this.isDFH ? this.formData.source.dfhname : this.formData.source,
                            iswnwifi: Number(this.isAllPowerfullWifi).toString(),
                            purl: ((this.pageStatus === 'edit') ? this.pageStatus : ''),
                            isofficial: Number(this.isBaijia).toString(),
                            isoriginal: Number(this.isOriginal).toString(),
                            labelname: this.formData.labelname.join(","),
                            localsite: this.formData.localsite.join(","),
                            keywords: this.dynamicTags.join(","),
                            imgs: this.fileList
                        }
                        // 体育平台分类为三级
                        if (this.formData.platform == 'dfsport' || this.formData.platform == 'all' || this.formData.platform == 'wxsport') {
                            params.subtype = this.formData.maintype[1]
                            params.thirdtype = this.formData.maintype[2]
                        } else {
                            params.offlinedfh = this.formData.offlineSelected
                            params.reason = this.formData.offlineReason
                        }
                        this.loading.saveDraft = true
                        let time = setTimeout(() => {
                            this.loading.saveDraft = false
                        }, timeoutTime)
                        addNewsDraft(params).then(res => {
                            if (res.code == '00001') {
                                this.resetForm('form')
                                this.queryNewsDraft()
                                this.$notify({
                                    title: '成功',
                                    message: '保存草稿成功',
                                    type: 'success'
                                });
                            }
                            this.loading.saveDraft = false
                            clearTimeout(time)
                        });
                    })
                }
            })
        },
        // 获取视频列表
        getVideoList(isSerch) {
            getAddVideoList(this.formVideo).then(res => {
                let video = res.data;
                if (isSerch) {
                    this.videoList = new Array(); //点击搜索就清空现有数据
                } else {
                    this.formVideo.page++; //否则下拉加载下一页!
                }
                this.videoList.push.apply(this.videoList, video.v1);
                this.videoList.push.apply(this.videoList, video.v2);
                this.formVideo.stkey_video = video.stkey;
                this.formVideo.lastcol_video = video.lastcol;
            });
        },
        //插入视频
        handleAddVideo(videourl) {
            var editor = this.editorInstance;
            editor.focus();
            let ehtml = '<p><video src="' + videourl + '" controls="controls"></video>&nbsp;</p>';
            editor.execCommand('inserthtml', ehtml);
        },
        loadMore() {
            this.getVideoList(false)
        },
        // 上传视频
        // 视频上传
        beforeAvatarVedioUpload(res) {
            console.log(res);
            var _this = this;
            let file = res.file;
            let name = file.name; //文件名
            // _this.form.title = name.split('.')[0];
            let size = file.size; //总大小
            var content_type = file.type;
            let Header = {
                "Content-Type": content_type,
                "Content-Length": size
            };
            var Bucket = '';
            var upUrl = '';
            Bucket = BUCKEXG;
            upUrl = '.ufile.ucloud.cn/';
            var _data = file.slice(0, size);
            var params = {
                "Bucket": Bucket,
                "METHOD": 'PUT',
                "Header": Header,
                "Key": name,
                "platform": _this.formData.platform
            }
            var extendName = name.substring(name.lastIndexOf(".") + 1);
            var limitType = 'mp4,mov';
            if (limitType.indexOf(extendName) == -1) {
                this.$message({
                    type: 'warning',
                    message: '格式不允许！'
                });
                return;
            }
            params.type = 'newsaddlocal'; //香港头条发视频
            var xhrOnProgress = function(fun) {
                xhrOnProgress.onprogress = fun; //绑定监听
                //使用闭包实现监听绑
                return function() {
                    //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
                    var xhr = $.ajaxSettings.xhr();
                    //判断监听函数是否为函数
                    if (typeof xhrOnProgress.onprogress !== 'function')
                        return xhr;
                    //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
                    if (xhrOnProgress.onprogress && xhr.upload) {
                        xhr.upload.onprogress = xhrOnProgress.onprogress;
                    }
                    return xhr;
                }
            };
            let isAuth = newsvideoGetauth(params).then(res => {
                if (res.code == '00001') {
                    let vurl = res.data.url;
                    $.ajax({
                        url: vurl,
                        type: "PUT",
                        processData: false,
                        contentType: false,
                        async: true,
                        data: _data,
                        headers: {
                            "Authorization": res.data.auth,
                            "Content-Type": content_type
                        },
                        xhr: xhrOnProgress(function(e) {
                            var percent = e.loaded / e.total; //计算百分比
                            _this.videoloadSize = (percent * 100).toFixed(2);
                        }),
                        success: function(response, textStatus, jqXHR) {
                            _this.videoloadSize = 100;
                            _this.videoload = true;
                            if (BUCKEXG == 'gaoxinmv') {
                                _this.videoUrl = vurl.replace(/gaoxinmv.cn-bj.ufileos.com/, "mv.eastday.com");
                            } else {
                                _this.videoUrl = vurl;
                            }
                            clearInterval(_this.videoInterva);
                            _this.$notify({
                                title: '成功',
                                message: '视频上传成功',
                                type: 'success'
                            });
                        }
                    });

                    //阿里云
                    //aliyun-sdk
                    _this.aliyunload = false;
                    var ossUpload = new OssUpload({
                        bucket: BUCKETALIY,
                        //   bucket: 'gxtest00',//正式gaoxinmv
                        endpoint: 'http://oss-cn-beijing.aliyuncs.com',
                        // 如果文件大于 chunkSize 则分块上传, chunkSize 不能小于 100KB 即 102400
                        chunkSize: 1048576,
                        // 分块上传的并发数
                        concurrency: 2,
                        aliyunCredential: {
                            "accessKeyId": "LTAIjzNN6TTNNCVg",
                            "secretAccessKey": "68bnrfGFpnyKpHpkfO1B0hMDdI1H7k"
                        }
                    });

                    console.log('wasports/' + res.data.newFileName.split('/')[1])
                    ossUpload.upload({
                        // 必传参数, 需要上传的文件对象
                        file: file,
                        // 必传参数, 文件上传到 oss 后的名称, 包含路径
                        key: 'wasports/' + res.data.newFileName.split('/')[1],
                        // 上传失败后重试次数
                        maxRetry: 3,
                        // OSS支持4个 HTTP RFC2616(https://www.ietf.org/rfc/rfc2616.txt)协议规定的Header 字段：
                        // Cache-Control、Expires、Content-Encoding、Content-Disposition。
                        // 如果上传Object时设置了这些Header，则这个Object被下载时，相应的Header值会被自动设置成上传时的值
                        // 可选参数
                        headers: {
                            'CacheControl': 'public',
                            'Expires': '',
                            'ContentEncoding': '',
                            'ContentDisposition': '',
                            // oss 支持的 header, 目前仅支持 x-oss-server-side-encryption
                            'ServerSideEncryption': ''
                        },
                        // 文件上传中调用, 可选参数
                        onprogress: function(evt) {
                            _this.aliyunSize = ((evt.loaded / evt.total) * 100).toFixed(2);
                        },
                        // 文件上传失败后调用, 可选参数
                        onerror: function(evt) {
                            //   _that.aliyunStatus = true
                        },
                        // 文件上传成功调用, 可选参数
                        oncomplete: function(res) {
                            _this.aliyunUrl = res.Location
                            _this.aliyunload = true
                        }
                    })
                    return true;
                } else {
                    return false;
                }
            });
        },
        handleChange(file) {
            this.videoloadSize = 0;
            this.videoload = false;
            this.videoUrl = '';
            this.aliyunSize = 0;
            this.aliyunload = false;
            this.aliyunUrl = '';
        },
        // 清空表单
        resetForm(formName) {
            this.operationTrackShow = false
            this.$refs[formName].resetFields()
            this.formData.title = ''
            this.formData.content = ''
            this.editorInstance.setContent(this.formData.content)
            this.formData.platform = this.platformOptions[0].value
            this.formData.purl = ''
            this.formData.maintype = []
            this.isAllPowerfullWifi = false
            this.isBaijia = false
            this.isOriginal = false
            this.isQunMedia = false
            this.dynamicTags = []
            this.formData.source = ''
            this.fileList = []
            this.fileListShow = []
            this.gifFileList = []
            this.pageStatus = 'add'
            this.draft.idAdd = 0
            this.draft.id = 0
            this.transferred.id = 0
            // this.transferred.tableData = []
            // this.transferred.total = 0
            this.transferredId = 0
        },
        // 可选择常用来源
        querySearch(queryString, cb) {
            var restaurants = this.personalConfig.source
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        getTransferredList(){
            let params = {
                page: this.transferred.currentPage,
                pagesize: this.transferred.pageSize,
                platform: this.formData.platform,
                id: 0
            }
            // params.id = this.transferred.id ? this.transferred.id : 0

            getTransferredList(params).then(res => {
                if(res.code === '00001'){
                    this.transferred.total = res.data.count
                    this.transferred.tableData = res.data.data
                }
            })
        },
        // 原文转义
        contentTransferred() {
            if (this.formData.content == '') {
                this.$message({
                    type: 'warning',
                    message: '请输入正文'
                })
                return false
            }
            if (this.formData.title == '') {
                this.$message({
                    type: 'warning',
                    message: '请输入标题'
                })
                return false
            }
            let jsonData = {
                title: this.formData.title,
                content: myReplace(this.formData.content, '_ueditor_page_break_tag_', '<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>')
            }
            let params = {
                id: this.transferred.id,
                platform: this.formData.platform,
                json: JSON.stringify(jsonData)
            }
            this.loading.transferred = true
            contentTransferred(params).then(res => {
                if(res.code === '00001'){
                    this.getTransferredList()
                    this.resetForm('form')
                    this.$notify({
                        title: '成功',
                        message: '转义成功',
                        type: 'success',
                        duration: 2 * 1000
                    });
                }
                this.loading.transferred = false
            })
        },
        transferredSizeChange(val) {
            this.transferred.pageSize = val
            this.transferred.id = 0
            this.getTransferredList()
        },
        transferredCurrentChange(val) {
            this.transferred.currentPage = val
            this.transferred.id = 0
            this.getTransferredList()
        },
        hotAriticleSizeChange(val) {
            this.hotAriticle.pageSize = val
            this.getHotAriticleList()
        },
        hotAriticleCurrentChange(val) {
            this.hotAriticle.currentPage = val
            this.getHotAriticleList()
        },
        paginationChange(data){
            return data.slice((this.copyRightImgs.currentPage - 1)*this.copyRightImgs.pageSize,(this.copyRightImgs.currentPage- 1)*this.copyRightImgs.pageSize + this.copyRightImgs.pageSize)
        },
        copyRightImgsChange(val) {
            this.copyRightImgs.pageSize = val
            this.copyrightImgsList = this.paginationChange(this.copyrightImgsListAll)
        },
        copyRightImgsCurrentChange(val) {
            this.copyRightImgs.currentPage = val
            this.copyrightImgsList = this.paginationChange(this.copyrightImgsListAll)
        },
        transferredView(row) {
            this.transferredId = row.id
            this.transferredVisible = true
            this.nowContent = JSON.parse(row.json).content
            this.nowTitle = JSON.parse(row.json).title
            this.transferredTitle = JSON.parse(row.json).title
            this.transferredContent = JSON.parse(row.json).contentpara
            this.$nextTick(() => {
                this.equalityTwoScroll()
            })
        },
        transferredEdit(row) {
            this.transferred.id = row.id
            this.formData.content = JSON.parse(row.json).contentpara
            this.formData.title = JSON.parse(row.json).title
            this.editorInstance.setContent(this.formData.content)
            this.btnDisabled.imgsPreview = true
            this.btnDisabled.save = true
        },
        useNowContent() {
            this.transferred.id = this.transferredId
            this.formData.content = this.nowContent
            this.formData.title = this.nowTitle
            this.editorInstance.setContent(this.formData.content)
            this.transferredVisible = false
            this.operationTrackShow = false
            this.btnDisabled.imgsPreview = true
            this.btnDisabled.save = true
        },
        useTransferredContent() {
            this.transferred.id = this.transferredId
            this.formData.content = this.transferredContent
            this.formData.title = this.nowTitle
            this.editorInstance.setContent(this.formData.content)
            this.transferredVisible = false
            this.operationTrackShow = false
            this.btnDisabled.imgsPreview = true
            this.btnDisabled.save = true
        },
        delTransferredContent(row) {
            let params = {
                id: row ? row.id : this.transferred.id
            }
            delTransferredContent(params).then(res => {
                if(res.code === '00001'){
                    if(row){
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                    this.getTransferredList()
                }
            })
        },
        addCopyRightImgs(url){
            var editor = this.editorInstance;
            editor.focus()
            let ehtml = '<p><img src="' + url.cdnurl + '" data-width="' + url.width + '" data-height="' + url.height + '">&nbsp;</p>'
            editor.execCommand('inserthtml', ehtml)
        },
        // 热文列表
        getHotAriticleList() {
            let params = {
                startTime: '',
                endTime: '',
                pageNum: this.hotAriticle.currentPage,
                pageSize: this.hotAriticle.pageSize,
                title: ''
            }
            getHotAriticleList(params).then(res => {
                if(res.code === '00001'){
                    this.hotAriticle.tableData = res.data.data
                    this.hotAriticle.total = res.data.total
                }
            })
        },
        hotAriticleEdit(row){
            this.formData.platform = 'toutiao'
            this.formData.purl = row.url
            this.searchNeweditor()
        },
        delHotContent(row){
            let params = {
                id: row.id,
                isdel: 1
            }
            delHotAriticle(params).then(res => {
                if(res.code === '00001'){
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                        duration: 2 * 1000
                    });
                    this.getHotAriticleList()
                }
            })
        },
        changeIsDFH(){
            this.formData.source = ''
            if(this.isDFH){
                this.$store.dispatch('getDFHaccount').then(() => {

                })
                this.getDFHtypes()
            }
        },
        // 东方号发文 获取分类
        getDFHtypes(){
            this.formData.maintype = []
            this.newsTypeLevel = []
            getDFHtypes().then(res => {
                if(res.code === '00001'){
                    var level1 = []
                    var level2 = []
                    var level3 = []
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].level && res.data[i].level == 1) {
                            level1.push({
                                value: res.data[i].typePy,
                                label: res.data[i].typeName,
                                typeId: res.data[i].typeId,
                                level: res.data[i].level
                            })
                        } else if (res.data[i].level && res.data[i].level == 2) {
                            level2.push({
                                value: res.data[i].typePy,
                                label: res.data[i].typeName,
                                typeId: res.data[i].typeId,
                                parentId: res.data[i].parentId,
                                level: res.data[i].level
                            })
                        } else if (res.data[i].level && res.data[i].level == 3) {
                            level3.push({
                                value: res.data[i].typePy,
                                label: res.data[i].typeName,
                                typeId: res.data[i].typeId,
                                parentId: res.data[i].parentId,
                                level: res.data[i].level
                            })
                        }
                    }
                    // 将一/二/三级 分类进行匹配
                    for (var i = 0; i < level1.length; i++) {
                        for (var j = 0; j < level2.length; j++) {
                            if (level1[i].typeId == level2[j].parentId) {
                                if (level1[i].children == undefined) {
                                    level1[i].children = [];
                                }
                                for (var k = 0; k < level3.length; k++) {
                                    if (level2[j].typeId == level3[k].parentId) {
                                        if (level2[j].children == undefined) {
                                            level2[j].children = [];
                                        }
                                        level2[j].children.push({
                                            value: level3[k].value,
                                            label: level3[k].label
                                        });
                                    }
                                }
                                level1[i].children.push({
                                    value: level2[j].value,
                                    label: level2[j].label,
                                    parentId: level2[j].parentId,
                                    typeId: level2[j].typeId,
                                    children: level2[j].children
                                })
                            }
                        }
                    }
                    this.newsTypeLevel = level1;
                }
            })
        },
        // 新闻采集
        newsCollect() {
            if(this.collectUrl === ''){
                this.$message({
                    message: '请填写采集地址',
                    type: 'warning'
                })
                return
            }
            this.resetForm('form')
            let params = {
                url: this.collectUrl
            }
            collectNews(params).then(res => {
                if(res.code === '00001'){
                    try {
                        let data = res.data
                        this.formData.title = data.contenttitle
                        this.formData.source = data.source
                        this.dynamicTags = data.keywords ? data.keywords.split(',') : []
                        this.formData.content = contentEditorHtml(data)
                        if (this.editorInstance !== null) {
                            this.editorInstance.setContent(this.formData.content)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.inline-div {
    display: inline-block;
    .inline-label {
        font-size: 12px;
        display: inline-block;
        font-weight: bold;
    }
    .inline-content {
        display: inline-block;
        vertical-align: middle;
    }
}
.flex-div {
    display: flex;
    align-items: center;
    .inline-label {
        font-size: 12px;
        display: inline-block;
        font-weight: bold;
    }
    .inline-content {
        flex: 1;
    }
}
.el-tag {
    margin-right: 4px;
    min-height: 24px;
    height: auto;
    white-space: normal;
    word-break: break-all;
    max-width: 200px;
    margin-bottom: 4px;
}
.button-new-tag {
    height: 30px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.input_num_box {
    position: relative;
    padding-right: 60px;
}
.input_num {
    position: absolute;
    right: 0;
    font-size: 16px;
    top: 50%;
    margin-top: -16px;
}
.img_Box {
    display: flex;
    flex-wrap: wrap;
    .img_Box_item {
        background-color: #ccc;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        margin-right: 6px;
        margin-bottom: 6px;
        cursor: pointer;
        position: relative;
        img {
            width: 100%;
            height: 100%;
        }
        &:hover .img_Box_tools {
            visibility: visible;
        }
        .img_Box_tools {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
            top: 0;
            left: 0;
            visibility: hidden;
        }
    }
}
.table-div {
    .group-title {
        font-size: 16px;
    }
    .group-title-box {
        font-size: #999;
        font-size: 12px;
    }
}
.avatar-video-uploader-icon{
    margin-top: 10px;
    display: inline-block;
    width: 204px;
    height: 105px;
    background-image: url(../../assets/video_images/upload.png);
}
.transferred_title{
    display: flex;
    justify-content: space-between;
    h3 {
        font-size: 14px;
        margin: 0
    }
}
.transferred_content {
    min-width: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 4px;
    img{
        max-width: 100% !important;
    }
}
.imgSearch_wrap{
    margin-top: 10px;
}
.imgSearch_item{
    margin-bottom: 10px;
    .imgSearch_item_wrap{
        height: 200px;
        position: relative;
        background-color: #fff
    }
    img{
        display: block;
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    &:hover .imgSearch_controls{
        visibility: visible;
    }
}
.imgSearch_null{
    height: 300px;
    line-height: 300px;
    text-align: center;
    color: #999;
    font-size: 24px;
}
.imgSearch_controls{
    visibility: hidden;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    position: absolute;
    top: 0;
    left: 0;
    .btn_group{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
    }
}
.tabDot{
    width: 14px;
    height: 14px;
    text-align: center;
    line-height: 14px;
    background-color: #f56c6c;
    border-radius: 50%;
    display: inline-block;
    font-size: 12px;
    vertical-align: 1px;
    color: #fff;
}
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 200px;
    &:hover {
        color: #58B7FF;
    }
}
.loadDiv{
    overflow: auto;
}
</style>
