<template lang="html">
    <section class="editPicture">
        <el-row class="mb-10">
            <el-button type="primary"
                       :loading="loading.save"
                       @click="newsAdd('form')">保存</el-button>
            <!-- <el-button type="primary" @click="addPictureDraft('form')" :loading="loading.saveDraft">存草稿</el-button> -->
            <el-button @click="resetForm('form')">清空</el-button>
            <el-input placeholder="请输入要采集的图集URL" v-model="collectUrl" class="input-with-select" style="width:65%">
                <el-button slot="append" type="primary">采集</el-button>
            </el-input>
        </el-row>
        <el-row :gutter="10">
            <el-form ref="form" :model="formData" size="mini" :rules="rules" status-icon>
                <el-col :span="18">
                    <el-card>
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
                        <el-row class="mt-10">
                            <!--上传图片组件-->
                            <el-form-item label="" prop="fileList">
                                <el-upload
                                    class="edit-drag__upload"
                                    drag
                                    multiple
                                    accept="image/gif, image/jpeg, image/jpg, image/png"
                                    :show-file-list="false"
                                    :action="fileUpload"
                                    :on-success="handleSuccess"
                                    :before-upload="beforeUpload">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-form-item>
                            <!--上传图片后显示的内容-->
                            <el-row :gutter="10" style="width:100%;">
                            <draggable :list="fileList" class="img_Box mt-10" style="width:100%;" v-if="fileList.length!==0">
                                <el-col :span="12" v-for="(item, index) in fileList" :key="index">
                                    <div class="picture_item clearfix">
                                        <div class="picture_box pull-left">
                                            <img :src="item.src" alt="">
                                            <div class="picture_box--control">
                                                <p class="control-item" @click="setCover(item)">设为封面</p>
                                                <p class="control-item" @click="delContent(index)">删除</p>
                                            </div>
                                        </div>
                                        <div class="picture_content pull-left">
                                            <el-input
                                                type="textarea"
                                                style="height:120px;"
                                                placeholder="请输入内容"
                                                v-model="item.content">
                                            </el-input>
                                        </div>
                                    </div>
                                </el-col>
                            </draggable>
                            </el-row>
                        </el-row>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <el-form-item label="平台" prop="platform" style="margin-bottom:10px" :show-message="false">
                            <el-select v-model="formData.platform"
                                       filterable
                                       placeholder="选择平台"
                                       @change='getNewsType'>
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
                        <el-row class="mt-10">
                            <el-form-item label="来源" prop="source">
                                <el-input v-model="formData.source" placeholder="请输入新闻来源" style="width:200px;"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-card>
                    <el-tabs type="border-card" class="mt-10">
                        <el-tab-pane label="封面图">
                            <!--上传图片后显示的内容-->
                            <draggable :list="coverList" class="img_Box" v-if="coverList.length!==0">
                                <div class="img_Box_item" v-for="(item,index) in coverList">
                                    <img :src="item">
                                    <div class="img_Box_tools">
                                        <i class="el-icon-zoom-in" @click.stop="toBig(item)"></i>
                                        <i class="el-icon-delete ml-10" @click.stop="removeImg(item,index)"></i>
                                    </div>
                                </div>
                            </draggable>
                            <!--上传图片组件-->
                            <el-form-item label="" prop="coverList">
                                <el-upload
                                    class="edit-drag__upload"
                                    :class="coverList.length!==0?'has_imgs':''"
                                    drag
                                    multiple
                                    :show-file-list="false"
                                    :action="fileUpload"
                                    :on-success="handleCoverSuccess"
                                    :before-upload="beforeCoverUpload"
                                    multiple>
                                    <i class="el-icon-plus" v-if="coverList.length!==0"></i>
                                    <i class="el-icon-upload" v-if="coverList.length===0"></i>
                                    <div class="el-upload__text" v-if="coverList.length===0">将文件拖到此处，或<em>点击上传</em></div>
                                    <div class="el-upload__tip" slot="tip" v-if="coverList.length===0">只能上传jpg/png文件，最多上传三张封面</div>
                                </el-upload>
                                <div class="el-upload__tip" slot="tip" v-if="coverList.length!==0">只能上传jpg/png文件，最多上传三张封面</div>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-form>
        </el-row>
        <!--图片放大-->
        <el-dialog :visible.sync="dialogVisible">
            <div style="height:500px;overflow:auto">
                <img width="100%" :src="dialogImageUrl">
            </div>
        </el-dialog>
    </section>
</template>

<script>
import draggable from 'vuedraggable'
import {
    isNull,
    timeoutTime,
} from '@/utils'
import {
    getfileUpload
} from '@/api/operationTools'
import {
    getOperPlatform
} from '@/api/commonApi'
import {
    newsPictureType,
    addPicturenews,
    savePicturenews,
    searchPictures
} from '@/api/contentManage'

export default {
    name: 'editPictures',
    components: {
        draggable
    },
    data() {
        // 图集内容
        let pictureContent = (rule, value, callback) => {
            if (this.fileList.length === 0) {
                return callback(new Error('图集内容不能为空'))
            } else {
                callback()
            }
        }
        let coverPicture = (rule, value, callback) => {
            if (this.coverList.length === 0) {
                return callback(new Error('图集封面不能为空'))
            } else {
                callback()
            }
        }
        return {
            coverNum: 3,
            pageStatus: 'add',
            collectUrl: '',
            formData: {
                platform: '',
                purl: '',
                title: '',
                maintype: []
            },
            fileList: [],
            fileShowList: [],
            // 封面
            coverList: [],
            coverShowList: [],
            fileUpload: '',
            loading: {
                save: false,
                saveDraft: false,
                search: false
            },
            newsTypeLevel: [],
            platformOptions: [],
            // 标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            dialogImageUrl: '',
            dialogVisible: false,
            rules: {
                title: [{
                    required: true,
                    message: '请输入图集标题',
                    trigger: 'blur'
                }],
                platform: [{
                    required: true,
                    message: '请选择平台',
                    trigger: 'blur'
                }],
                source: [{
                    required: true,
                    message: '请输入图集来源',
                    trigger: 'blur'
                }],
                maintype: [{
                    required: true,
                    message: '请选择分类',
                    trigger: 'blur'
                }],
                fileList: [{
                    validator: pictureContent,
                    trigger: 'blur'
                }],
                coverList: [{
                    validator: coverPicture,
                    trigger: 'blur'
                }]
            }
        }
    },
    mounted() {
        this.fileUpload = getfileUpload
        this.getOperPlatform()
    },
    activated() {
        // 需要先清空，否则表单缓存
        this.resetForm('form')
        this.getEditDetail()
        if (this.$route.query.rowkey) {
            this.searchNeweditor()
        }
    },
    methods: {
        // 编辑状态
        getEditDetail() {
            // 编辑页面
            if (this.$route.query.rowkey) {
                this.pageStatus = 'edit'
                this.formData.purl = this.$route.query.rowkey
                this.formData.platform = this.$route.query.platform
            }
        },
        // 获取平台
        getOperPlatform() {
            let params = {
                userName: this.$store.getters.name,
                url: 'send/picture'
            }
            getOperPlatform(params).then(res => {
                this.platformOptions = res.data;
                if (this.formData.platform == '') {
                    this.formData.platform = this.platformOptions[0].value
                }
                this.getEditDetail()
                this.getNewsType()
            })
        },
        // 获取分类
        getNewsType() {
            let param = {
                platform: this.formData.platform
            }
            newsPictureType(param).then(res => {
                if (res.data && res.data.length) {
                    if (this.formData.platform !== 'dfsport') {
                        this.newsTypeLevel = res.data.map(item => {
                            return {
                                label: item.typeName,
                                value: item.typePy
                            }
                        })
                    } else {
                        this.newsTypeLevel = res.data
                    }
                    // 获取分类后
                    if (this.$route.query.rowkey) {
                        this.searchNeweditor()
                    }
                }
            })
        },
        newsAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let content = []
                    let contentImgs = []
                    let coverImgs = []
                    // 图集正文参数
                    this.fileList.forEach(item => {
                        if (item.content === '') {
                            content.push("  ")
                        } else {
                            content.push(item.content)
                        }
                        contentImgs.push(item.src)
                    })
                    let params = {
                        platform: this.formData.platform,
                        title: this.formData.title,
                        source: this.formData.source,
                        maintype: this.formData.maintype[0],
                        keywords: this.dynamicTags.join(","),
                        content: content.join("!@#!@"),
                        contentImgs: contentImgs.join(","),
                        miniImgs: this.coverList.join(","),
                        secondtype: this.formData.maintype[1],
                        thirdtype: this.formData.maintype[2]
                    }
                    this.loading.save = true
                    let time = setTimeout(() => {
                        this.loading.save = false
                    }, timeoutTime)
                    if (this.pageStatus === 'add') {
                        addPicturenews(params).then(res => {
                            if (res.code === '00001') {
                                this.$notify({
                                    title: '成功',
                                    message: '发布图集成功',
                                    type: 'success'
                                });
                                this.resetForm('form')
                            }
                            this.loading.save = false
                            clearTimeout(time)
                        })
                    } else if (this.pageStatus === 'edit') {
                        params.newsUrl = this.formData.purl
                        savePicturenews(params).then(res => {
                            if (res.code === '00001') {
                                this.$notify({
                                    title: '成功',
                                    message: '编辑图集成功',
                                    type: 'success'
                                });
                                this.resetForm('form')
                            }
                            this.loading.save = false
                            clearTimeout(time)
                        })
                    }
                }
            })
        },
        searchNeweditor() {
            let params = {
                url: this.formData.purl,
                platform: this.formData.platform
            }
            searchPictures(params).then(res => {
                let picture = res.data
                if (res.code == '00001') {

                    if (isNull(picture.rowkey)) {
                        let content = ''
                        if (isNull(picture.content)) {
                            content = picture.content.split('!@#!@')
                        } else {
                            content = ''
                        }
                        let imgjs = JSON.parse(picture.imgjs)
                        let minijs = JSON.parse(picture.minijs)
                        // 图集内容
                        for (let i = 0; i < imgjs.length; i++) {
                            this.fileList.push({
                                content: !isNull(content) ? '' : content[i],
                                src: imgjs[i].src
                            })
                            this.fileShowList.push({
                                name: 'a.jpg',
                                url: imgjs[i].src
                            })
                        }
                        // 封面
                        for (var i = 0; i < minijs.length; i++) {
                            this.coverList.push(minijs[i].src)
                            this.coverShowList.push({
                                name: 'a.jpg',
                                url: minijs[i].src
                            })
                        }
                        this.formData.title = picture.contenttitle
                        this.formData.source = picture.source
                        if (!isNull(picture.lcsite)) {
                            if (isNull(this.formData.platform)) {
                                this.formData.platform = 'toutiao'
                            }
                        } else {
                            this.formData.platform = picture.lcsite
                        }
                        // 关键词
                        if (isNull(picture.keywords)) {
                            this.dynamicTags = picture.keywords.split(',')
                        }
                        // 分类
                        if (this.formData.platform === 'dfsport') {
                            this.formData.maintype = []
                            this.formData.maintype.push(picture.tplv001py)
                            this.formData.maintype.push(picture.tplv002py)
                            this.formData.maintype.push(picture.tplv003py)
                        } else {
                            let tp1st = this.newsTypeLevel.find(function(value, index, arr) {
                                return value.label == picture.tp1st
                            })
                            this.formData.maintype = [tp1st.value]
                        }
                    } else {
                        this.$message({
                            message: '该链接无效/与对应平台不匹配',
                            type: 'warning'
                        });
                        this.listLoading = false
                    }
                }
            })
        },
        addPictureDraft() {

        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.formData.title = ''
            this.fileList = []
            this.fileShowList = []
            this.coverList = []
            this.coverShowList = []
            this.dynamicTags = []
            this.formData.purl = ''
            this.formData.source = ''
            this.pageStatus = 'add'
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
        // 上传成功后返回
        handleSuccess(response, file, fileList) {
            this.fileList.push({
                src: response.url,
                content: ''
            })
            this.fileShowList.push({
                name: 'a.jpg',
                url: response.url
            })
            this.$refs.form.clearValidate()
        },
        // 上传封面图
        beforeCoverUpload(file) {
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
        // 上传成功后返回
        handleCoverSuccess(response, file, fileList) {
            console.log(fileList)
            if(this.coverList.length >= this.coverNum){
                this.$message.warning(`当前限制最多上传 ${this.coverNum} 个文件`)
                return false
            }
            this.coverList.push(response.url)
            this.coverShowList.push({
                name: 'a.jpg',
                url: response.url
            })
            this.$refs.form.clearValidate()
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
        // 放大
        toBig(url) {
            this.dialogImageUrl = url
            this.dialogVisible = true
        },
        // 删除
        removeImg(url, index) {
            var _this = this;
            _this.coverList.forEach((item, index) => {
                if (item == url) {
                    _this.coverList.splice(index, 1)
                }
            })
            _this.coverShowList.forEach((item, index) => {
                if (item.url == url) {
                    _this.coverShowList.splice(index, 1)
                }
            })
        },
        // 设为封面
        setCover(item) {
            // 封面数量
            if (this.coverList.length >= this.coverNum) {
                return
            }
            if (this.coverList.length >= this.coverNum) {
                this.coverList.splice(this.coverList.length - 1, 1, item.src)
                this.coverShowList.splice(this.coverShowList.length - 1, 1, {
                    name: 'a',
                    url: item.src
                })
            } else {
                this.coverList.push(item.src)
                this.coverShowList.push({
                    name: 'a',
                    url: item.src
                })
            }
        },
        delContent(index){
            this.fileList.splice(index,1)
            this.fileShowList.splice(index,1)
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
.avatar-video-uploader-icon {
    margin-top: 10px;
    display: inline-block;
    width: 204px;
    height: 105px;
    background-image: url("../../assets/video_images/upload.png");
}
.picture_item {
    display: flex;
    align-items: center;
    height: 120px;
    padding: 10px;
    border: 1px solid #ccc;
    box-sizing: content-box;
    margin-bottom: 10px;
}
.picture_box {
    width: 120px;
    height: 120px;
    background-color: #f3f3f3;
    position: relative;
    cursor: pointer;
    &:hover .picture_box--control {
        visibility: visible;
    }
    .picture_box--control {
        visibility: hidden;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.6);
        box-sizing: border-box;
        padding-top: 26px;
        .control-item {
            color: #fff;
            font-size: 14px;
            text-align: center;
            &:hover {
                color: #409EFF;
            }
        }
    }
    img {
        width: 100%;
        height: 100%;
    }
}
.picture_content {
    height: 100%;
    flex: 1;
    margin-left: 10px;
}
</style>
