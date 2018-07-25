<template lang="html">
    <section class="rejectEdit">
        <el-row type="flex" :gutter="10" style="align-items:center">
            <el-col style="max-width:440px;">
                <!-- <el-button type="primary"
                           :disabled="btnDisabled.contentPreview"
                           :loading="loading.contentPreview"
                           @click="newsContentPreview">正文预览</el-button>
                <el-button type="primary"
                           :loading="loading.imgsPreview"
                           :disabled="btnDisabled.imgsPreview"
                           @click="newsImgPreview">缩略图预览</el-button> -->
                <!-- <el-button type="primary"
                           :loading="loading.save"
                           :disabled="btnDisabled.save"
                           @click="newsAdd">保存</el-button> -->
                <el-button type="primary"
                           @click="saveContent">保存</el-button>
                <el-button type="danger"
                           :loading="loading.refuse"
                           @click="refuse">拒绝</el-button>
                <el-select v-model="newsQuestion" placeholder="请选择" style="width:120px;" @change='changeDataType'>
                    <el-option
                        v-for="(item,index) in newsQuestionList"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col style="flex:1">
                <div class="url-source" v-if="newExam!=null">
                    <span class="source"
                          v-html="newExam.source"></span>：
                    <a :href="newExam.purl" target="_blank" class="url" v-html="newExam.purl"></a>
                    <el-button type="primary" size="mini" @click="copyContent(newExam.purl,$event)">复制</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="mt-10" type="flex">
            <el-col :span="4" style="min-width:230px;">
                <el-card :body-style="{padding:'0px 20px'}">
                    <el-collapse v-model="activeName">
                        <el-collapse-item name="rejectReason">
                            <template slot="title">
                                <div class="collapse-title">
                                    <div class="collapse-title_label">
                                        驳回原因：
                                    </div>
                                </div>
                            </template>
                            <div class="collapse-content">
                                <span>{{ form.rejectReason }}</span>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="level">
                            <template slot="title">
                                <div class="collapse-title">
                                    <div class="collapse-title_label">
                                        评级：
                                        <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                                            <div slot="content">快捷键：<br/>数字键1~5对应1~5级；</div>
                                            <img src='../../../assets/audit_images/wen.png' style="width: 14px" class="tip-question"/>
                                        </el-tooltip>
                                    </div>
                                    <div class="collapse-title_content">
                                        {{ contentLevel==''?'暂未选择':levelOptions[contentLevel-1].label }}
                                    </div>
                                </div>
                            </template>
                            <div class="collapse-content">
                                <el-radio-group v-model="contentLevel">
                                    <div v-for="item in levelOptions" style="margin-bottom:6px;">
                                        <el-radio :label="item.value">{{ item.label }}</el-radio>
                                    </div>
                               </el-radio-group>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-col>
            <el-col :span="20">
                <el-form :rules="rules" ref="ruleForm" :model="form" :status-icon="true">
                    <el-form-item prop="title" :show-message="false">
                        <el-row class="input_num_box">
                            <el-input placeholder="请输入文章标题,不能超过50个字符"
                                      v-model="form.title"
                                      :maxlength="50"
                                      :minlength="5"
                                      size="large"></el-input>
                            <div class="input_num info">
                                <span :class="form.title.length==50?'danger':''">{{ form.title.length }}/50</span>
                            </div>
                        </el-row>
				  	</el-form-item>
                </el-form>
                <el-row :gutter="10">
                    <el-col :span="20">
                        <vueUEditor @ready="editorReady" style="width: 100%;height: 500px;" ref="addVideo"></vueUEditor>
                    </el-col>
                    <el-col :span="4">
                        <el-card :body-style="{padding:'10px'}">
                            <el-select :disabled="true" v-model="form.urlmaintypepy" placeholder="请选择" @change="getRejectType(form.urlmaintypepy,2)">
                                <el-option
                                    v-for="item in firpy"
                                    :key="item.typeId"
                                    :label="item.typeName"
                                    :value="item.typePy">
                                </el-option>
                            </el-select>
                            <el-select :disabled="true" v-model="form.tfsubtype" placeholder="请选择">
                                <el-option
                                    v-for="item in secpy"
                                    :key="item.typeId"
                                    :label="item.typeName"
                                    :value="item.typePy">
                                </el-option>
                            </el-select>
                            <el-collapse v-model="activeNameRight">
                                <el-collapse-item name="keywords">
                                    <template slot="title">
                                        <div class="collapse-title">
                                            <div class="collapse-title_label">
                                                标签：
                                            </div>
                                            <div class="collapse-title_content">
                                                {{ dynamicTags.length }}个
                                            </div>
                                        </div>
                                    </template>
                                    <div v-if="dynamicTags.length!=0" class="collapse-content">
        								<el-tag
                                            style="margin-right: 10px;margin-bottom: 5px;white-space:normal;height:auto;min-height:24px"
        								    :key="tag"
                                            type="primary"
        								    v-for="tag in dynamicTags"
        								>
        								{{ tag }}
        								</el-tag>
        							</div>
                                    <div class="null-keyword" v-if="dynamicTags.length==0">
                                        暂无标签
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
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
                                class="edit-drag__upload has_imgs mt-10"
                                multiple
                                drag
                                v-if="fileList.length<3"
                                :limit="3"
                                :on-exceed="handleExceed"
                                :show-file-list="false"
                                :action="fileUpload"
                                :on-success="handleSuccess"
                                :on-progress="handleProgress"
                                :before-upload="beforeUpload">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--图片放大-->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
        <!--正文预览-->
        <el-dialog title="页面预览" :visible.sync="replyFormVisible" top="5%" :close-on-click-modal="false">
			<div >
		  	    <iframe :src="contentPreview" style="border: 0;" width="100%" height="500px"></iframe>
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
        <!-- <el-dialog :visible.sync="urlVisible" :close-on-click-modal="false">
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
		</el-dialog> -->
    </section>
</template>

<script>
import vueUEditor from '@/components/UEditor'
import draggable from 'vuedraggable'
import {
    getfileUpload
} from '@/api/operationTools'
import clip from '@/utils/clipboard'
import {
    getRejectType,
    getNewsReject,
    rejectContentPreview,
    rejectImgPreview,
    newsRejectSave,
    newsRejectSaveAll,
    newsRejectNoPasse,
    removeDoExamData
} from '@/api/audit'
import {
    contentEditorHtml
} from '@/utils/contentTransform'
import {
    isNull,
    timeoutTime
} from '@/utils'

export default {
    components: {
        vueUEditor,
        draggable
    },
    data() {
        return {
            newsQuestion: 'wenshou',
            newsQuestionList: [
                {
                    label: '文首问题',
                    value: 'wenshou'
                },
                {
                    label: '文尾问题',
                    value: 'wenwei'
                },
                {
                    label: '文中问题',
                    value: 'wenzhong'
                },
                {
                    label: '图片问题',
                    value: 'tupian'
                },
                {
                    label: '标题问题',
                    value: 'biaoti'
                },
                {
                    label: '其他问题',
                    value: 'qita'
                }
            ],
            fileUpload: '',
            activeName: ['rejectReason', 'level'],
            activeNameRight: ['keywords'],
            // 评级
            contentLevel: '',
            // 标签
            dynamicTags: [],
            levelOptions: [{
                    value: 1,
                    label: '1级(纯新闻)'
                }, {
                    value: 2,
                    label: '2级(非新闻)'
                }, {
                    value: 3,
                    label: '3级(暴力血腥)'
                }, {
                    value: 4,
                    label: '4级(诱惑图片)'
                }, {
                    value: 5,
                    label: '5级(猎奇野史)'
                },
                {
                    value: 6,
                    label: '6级(两性话题)'
                }, {
                    value: 7,
                    label: '7级(不适图片)'
                }, {
                    value: 8,
                    label: '8级(政治敏感)'
                }, {
                    value: 9,
                    label: '9级(负面新闻)'
                },
                {
                    value: 10,
                    label: '10级(突发新闻)'
                }, {
                    value: 11,
                    label: '11级(推销乏味)'
                }, {
                    value: 12,
                    label: '12级(自媒体)'
                }, {
                    value: 13,
                    label: '13级(原创)'
                },
                {
                    value: 14,
                    label: '14级(图片水印)'
                }, {
                    value: 15,
                    label: '15级(内容低质)'
                },
            ],
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
                ]
            },
            firpy: [],
            secpy: [],
            form: {
                title: '',
                content: '',
                tfsubtype: '',
                urlmaintypepy: '',
                rejectReason: ''
            },
            newExam: null,
            fileList: [],
            btnDisabled: {
                contentPreview: false,
                imgsPreview: true,
                save: true
            },
            loading: {
                contentPreview: false,
                imgsPreview: false,
                save: false,
                search: false,
                saveDraft: false,
                refuse: false
            },
            // dialog 图片
            dialogImageUrl: '',
            dialogVisible: false,
            editorInstance: null,
            newsSize: 5,
            dataList: [],
            selfInterva: '',
            // 正文预览
            replyFormVisible: false,
            contentPreview: '',
            // 缩略图预览
            newImg: '',
            replyImgVisible: false
        }
    },
    mounted() {
        this.fileUpload = getfileUpload
        this.getRejectType('0', 1) // 一级分类
        this.mountedGetData()
        this.loadKey()
    },
    methods: {
        // 获取分类
        getRejectType(pid, level) {
            let params = {
                pid: pid,
                tlevel: level == 1 ? 1 : 0
            }
            if (pid == '') {
                return
            }
            getRejectType(params).then((res) => {
                if (level == 1) {
                    this.firpy = res.data;
                } else if (level == 2) {
                    this.secpy = res.data;
                    this.form.tfsubtype = ''
                }
            })
        },
        mountedGetData() {
            // this.checkedNum('video')
            let localData = localStorage.getItem('reject_news')
            if (localData && (JSON.parse(localData).length > 0 && JSON.parse(localData).length <= 3)) {
                this.getLocalData()
                this.getDataList()
                console.log('获取 本地数据+接口数据')
            } else if (localData && JSON.parse(localData).length > 3) {
                this.getLocalData()
                console.log('获取 本地数据')
            } else {
                this.getDataList()
                console.log('获取 接口数据')
            }
        },
        getDataList(type) {
            let params = {
                size: this.newsSize,
                type: this.newsQuestion
            }
            getNewsReject(params).then(res => {
                let _this = this
                if (res.data) {
                    this.dataList = this.dataList.concat(res.data.Beans)
                }
                if (this.dataList.length === 0) {
                    this.newExam = null
                    this.dynamicTags = []
                    if (type !== 'interval') {
                        if (this.dataList.length === 0) {
                            this.selfInterva = window.setInterval(() => {
                                _this.getDataList('interval')
                            }, 30000)
                        }
                    }
                    this.form.urlmaintypepy = ''
                    this.form.tfsubtype = ''
                    this.contentLevel = ''
                    this.fileList = []
                    this.newExam = null
                    this.form.content = ''
                    this.form.rejectReason = ''
                    this.form.title = ''
                } else {
                    clearInterval(this.selfInterva)
                    this.newExam = this.dataList[0]
                    this.dynamicTags = this.newExam.keywords ? this.newExam.keywords.split(',') : []
                    this.form.urlmaintypepy = this.newExam.urlmaintypepy
                    this.form.tfsubtype = this.newExam.tfsubtype
                    this.contentLevel = this.newExam.gradelv == null ? 0 : this.newExam.gradelv
                    this.fileList = this.newExam.imgminilist.map(item => {
                        return item.src
                    })
                    this.form.rejectReason = this.newExam.reviewnopass
                    this.form.content = contentEditorHtml(this.newExam)
                    this.form.title = this.newExam.contenttitle
                    localStorage.setItem('reject_news', JSON.stringify(this.dataList))
                }
            })
        },
        getLocalData() {
            let localData = JSON.parse(localStorage.getItem('reject_news'))
            this.dataList = localData
            this.newExam = this.dataList[0]
            this.form.urlmaintypepy = this.newExam.urlmaintypepy
            this.form.tfsubtype = this.newExam.tfsubtype
            this.contentLevel = this.newExam.gradelv == null ? 0 : this.newExam.gradelv
            this.fileList = this.newExam.imgminilist.map(item => {
                return item.src
            })
            this.dynamicTags = this.newExam.keywords ? this.newExam.keywords.split(',') : []
            this.form.rejectReason = this.newExam.reviewnopass
            this.form.content = contentEditorHtml(this.newExam)
            this.form.title = this.newExam.contenttitle
        },
        editorReady(editorInstance) {
            this.editorInstance = editorInstance
            editorInstance.setContent(this.form.content)
            editorInstance.addListener('contentChange', () => {
                this.form.content = editorInstance.getContent()
            })
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
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // 上传成功后返回
        handleSuccess(response, file, fileList) {
            this.fileList.push(response.url)
            // 改动封面后需重新进行图片预览
            this.btnDisabled.save = false
        },
        handleProgress(event, file, fileList) {

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
        // 正文预览
        newsContentPreview() {
            if (!this.form.content) {
                this.$message({
                    type: 'warning',
                    message: '无正文信息，无法保存'
                })
                return
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.replyFormVisible = true
                    let params = {
                        rowkey: this.newExam.rowkey,
                        content: this.form.content,
                        maintype: this.newExam.urlmaintypepy,
                        title: this.form.title,
                        source: this.newExam.source,
                        purl: this.newExam.purl,
                        cts: this.newExam.crawlerts
                    }
                    this.loading.contentPreview = true
                    let time = setTimeout(() => {
                        this.loading.contentPreview = false
                    }, timeoutTime)
                    rejectContentPreview(params).then(res => {
                        if (res.code === '00001') {
                            this.contentPreview = res.data + '?qid=cms'

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
        },
        newsImgPreview() {
            this.replyFormVisible = false
            this.replyImgVisible = true
            if (this.fileList.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '无略缩图，无法预览'
                })
                return
            }

            let params = {
                imgStrs: this.fileList,
                rowkey: this.newExam.rowkey,
                cts: this.newExam.crawlerts,
                purl: this.newExam.purl
            }
            this.loading.imgsPreview = true
            let time = setTimeout(() => {
                this.loading.imgsPreview = false
            }, timeoutTime)
            rejectImgPreview(params).then(res => {
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

                }
                this.loading.imgsPreview = false
                clearTimeout(time)
            })
        },
        // 保存
        newsAdd() {
            this.replyImgVisible = false
            this.replyFormVisible = false
            if (!this.form.content) {
                this.$message({
                    type: 'warning',
                    message: '无正文信息，无法保存'
                })
                return
            }
            if (!this.contentLevel) {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                })
                return
            }

            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            rowkey: this.newExam.rowkey,
                            level: this.contentLevel,
                            mainType: this.newExam.urlmaintypepy,
                            subType: this.newExam.tfsubtype,
                            cts: this.newExam.crawlerts,
                            title: this.form.title
                        }
                        this.loading.save = true
                        let time = setTimeout(() => {
                            this.loading.save = false
                        }, timeoutTime)
                        newsRejectSave(params).then(res => {
                            if (res.code === '00001') {
                                this.$notify({
                                    title: '成功',
                                    message: '保存成功',
                                    type: 'success'
                                })
                            }
                            this.dataList.shift()
                            localStorage.setItem('reject_news', JSON.stringify(this.dataList))
                            this.mountedGetData()
                            this.loading.save = false
                            clearTimeout(time)
                        })
                    })
                }
            })
        },
        // 三步合一的保存
        saveContent() {
            if (!this.form.content) {
                this.$message({
                    type: 'warning',
                    message: '无正文信息，无法保存'
                })
                return
            }
            if (!this.contentLevel) {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                })
                return
            }

            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            rowkey: this.newExam.rowkey,
                            imgStrs: this.fileList,
                            purl: this.newExam.purl,
                            content: this.form.content,
                            source: this.newExam.source,
                            level: this.contentLevel,
                            mainType: this.newExam.urlmaintypepy,
                            subType: this.newExam.tfsubtype,
                            cts: this.newExam.crawlerts,
                            title: this.form.title
                        }
                        this.dataList.shift()
                        localStorage.setItem('reject_news', JSON.stringify(this.dataList))
                        this.mountedGetData()
                        newsRejectSaveAll(params).then(res => {

                        })
                    })
                }
            })
        },
        // 拒绝
        refuse() {
            if (!this.newExam.rowkey) {
                this.$message({
                    type: 'warning',
                    message: '无正文信息，无法保存'
                })
                return
            }
            this.$confirm('确认提交吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let params = {
                    rowkey: this.newExam.rowkey
                }
                // this.loading.refuse = true
                // let time = setTimeout(() => {
                //     this.loading.refuse = false
                // }, timeoutTime)
                newsRejectNoPasse(params).then(res => {
                    if (res.code === '00001') {
                        this.$notify({
                            title: '成功',
                            message: '拒绝成功',
                            type: 'success'
                        })
                    }
                })
                this.dataList.shift()
                localStorage.setItem('reject_news', JSON.stringify(this.dataList))
                this.mountedGetData()
                // this.loading.refuse = false
                // clearTimeout(time)
            })
        },
        // 复制URL按钮
        copyContent(text, event) {
            clip(text, event)
        },
        // 快捷键设置
        loadKey() {
            let _that = this;
            document.onkeydown = function(ev) {
                if (ev.keyCode == 49) {
                    _that.contentLevel = 1
                } else if (ev.keyCode == 50) {
                    _that.contentLevel = 2
                } else if (ev.keyCode == 51) {
                    _that.contentLevel = 3
                } else if (ev.keyCode == 52) {
                    _that.contentLevel = 4
                } else if (ev.keyCode == 53) {
                    _that.contentLevel = 5
                } else if (ev.keyCode == 54) {
                    _that.contentLevel = 6
                } else if (ev.keyCode == 55) {
                    _that.contentLevel = 7
                } else if (ev.keyCode == 56) {
                    _that.contentLevel = 8
                } else if (ev.keyCode == 57) {
                    _that.contentLevel = 9
                } else if (ev.keyCode == 48) {
                    _that.contentLevel = 10
                } else if (ev.keyCode == 81) {
                    _that.contentLevel = 11
                } else if (ev.keyCode == 87) {
                    _that.contentLevel = 12
                } else if (ev.keyCode == 69) {
                    _that.contentLevel = 13
                } else if (ev.keyCode == 82) {
                    _that.contentLevel = 14
                } else if (ev.shiftKey == 1 && ev.keyCode == 112) {
                    _that.newsContentPreview()
                } else if (ev.shiftKey == 1 && ev.keyCode == 113) {
                    _that.newsImgPreview()
                } else if (ev.shiftKey == 1 && ev.keyCode == 114) {
                    _that.newsAdd()
                } else if (ev.shiftKey == 1 && ev.keyCode == 220) {
                    _that.refuse()
                }

            }
        },
        // 回收数据
        recycleData() {
            clearInterval(this.selfInterva)
            localStorage.removeItem("reject_news")
            this.dataList = []
            let para = {
                queue: 'reject_news'
            };
            removeDoExamData(para).then((res) => {});
        },
        // 改变数据类型
        changeDataType() {
            this.recycleData()
            this.mountedGetData()
        }
    },
    watch: {
        "editorInstance": function() {
            if (this.editorInstance != null) {
                this.editorInstance.setContent(this.form.content)
            }
        },
        "newExam": function() {
            if (this.editorInstance != null) {
                this.editorInstance.setContent(this.form.content)
            }
        }
    },
    destroyed() {
        this.recycleData()
    }
}
</script>

<style lang="scss" scoped="scoped">
.rejectEdit {
    padding: 10px;
}
.collapse-title {
    padding: 0 10px 0 5px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
.url-source {
    text-align: center;
    font-size: 18px;
    .url {
        text-decoration: none;
        color: #20a0ff;
        &:hover {
            color: #4db3ff;
        }
    }
}
</style>
