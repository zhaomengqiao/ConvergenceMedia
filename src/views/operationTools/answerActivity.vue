<template lang="html">
    <section class="answerActivity">
        <el-card>
            <el-form :inline="true" :model="form" ref="toolForm" :rules="rules">
                <el-form-item label="分享模板：" style="margin-bottom:0" prop="templateName">
                    <el-input v-model.trim="form.templateName" placeholder="请输入分享模板名称"></el-input>
                </el-form-item>
                <el-form-item label="模板编号：" style="margin-bottom:0" prop="templateNum">
                    <el-input v-model.trim="form.templateNum" placeholder="请输入模板编号"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="addAnswerTemplate" :loading="loading.add">新增模板</el-button>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="resetToolForm">清空</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-row>
                <el-col :span="16">
                    <el-form :rules="contentRules" ref="contentForm" :model="contentForm" label-position="right">
                        <el-form-item label="分享模板：" :label-width="labelWidth" prop="shareTemplate">
                            <el-select v-model="contentForm.shareTemplate" placeholder="请选择分享模板" filterable>
                                <el-option
                                    v-for="(item,index) in shareTemplates"
                                    :key="item.value"
                                    :label="item.templatename"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="getSingleAnswerTemplate">编辑当前模板</el-button>
                            <el-button type="danger" @click="delAnswerTemplate">删除当前模板</el-button>
                        </el-form-item>
                        <el-form-item label="分享图片：" :label-width="labelWidth" prop="shareImgs">
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
                                class="edit-drag__upload"
                                :class="fileList.length!==0?'has_imgs':''"
                                v-if="fileList.length<1"
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
                        </el-form-item>
                        <el-form-item label="分享标题：" prop="title" :label-width="labelWidth">
                            <el-input v-model="contentForm.title" placeholder="请输入分享标题"></el-input>
                        </el-form-item>
                        <el-form-item label="分享描述：" prop="description" :label-width="labelWidth">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入分享描述"
                                v-model="contentForm.description">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label-width="labelWidth">
                            <el-button type="primary" @click="editAnswerTemplate" :loading="loading.save">保存</el-button>
                            <el-button type="primary" @click="resetContentForm">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <!--图片放大-->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
    </section>
</template>

<script>
import draggable from 'vuedraggable'
import {
    getfileUpload,
    getAnswerTemplate,
    addAnswerTemplate,
    getSingleAnswerTemplate,
    editAnswerTemplate,
    delAnswerTemplate
} from '@/api/operationTools'
import {
    roomfileUpload
} from '@/api/liveManage'

export default {
    components: {
        draggable
    },
    data() {
        return {
            loading: {
                add: false,
                save: false
            },
            fileUpload: '',
            labelWidth: '94px',
            form: {
                templateName: '',
                templateNum: ''
            },
            contentForm: {
                shareTemplate: '',
                description: '',
                title: ''
            },
            shareTemplates: [],
            fileList: [],
            rules: {
                templateName: [{
                    required: true,
                    message: '请输入分享模板名称',
                    trigger: 'blur'
                }, ],
                templateNum: [{
                    required: true,
                    message: '请输入模板编号',
                    trigger: 'blur'
                }, ]
            },
            contentRules: {
                shareTemplate: [{
                    required: true,
                    message: '请输入分享模板名称',
                    trigger: 'blur'
                }]
            },
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    mounted() {
        this.fileUpload = roomfileUpload
        this.getAnswerTemplate()
    },
    methods: {
        getAnswerTemplate() {
            let params = {
                templatename: ''
            }
            getAnswerTemplate(params).then(res => {
                if(res.code === '00001'){
                    this.shareTemplates = res.data
                }
            })
        },
        addAnswerTemplate() {
            let params = {
                templateid: this.form.templateNum,
                templatename: this.form.templateName
            }
            this.loading.add = true
            addAnswerTemplate(params).then(res => {
                if(res.code === '00001'){
                    this.$refs['toolForm'].validate((valid) => {
                        if(valid) {
                            this.getAnswerTemplate()
                            this.$notify({
                                title: '成功',
                                message: '新增答题模板成功',
                                type: 'success'
                            })
                        }
                    })
                }
                this.loading.add = false
            })
        },
        editAnswerTemplate() {
            let params = {
                id: this.contentForm.shareTemplate,
                templatepic: this.fileList[0],
                templatetitle: this.contentForm.title,
                templatecomments: this.contentForm.description
            }
            this.loading.save = true
            editAnswerTemplate(params).then(res => {
                if(res.code === '00001'){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                }
                this.loading.save = false
            })
        },
        getSingleAnswerTemplate() {
            let params = {
                id: this.contentForm.shareTemplate
            }
            this.$refs['contentForm'].validate((valid) => {
                if(valid) {
                    getSingleAnswerTemplate(params).then(res => {
                        if(res.code === '00001'){
                            this.contentForm.title = res.data.templatetitle
                            this.contentForm.description = res.data.templatecomments
                            if(res.data.templatepic) {
                                this.fileList = [res.data.templatepic]
                            }else{
                                this.fileList = []
                            }
                        }
                    })
                }
            })
        },
        // 删除
        delAnswerTemplate(){
            let params = {
                id: this.contentForm.shareTemplate
            }
            delAnswerTemplate(params).then(res => {
                if(res.code === '00001'){
                    this.resetContentForm()
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                }
            })
        },
        resetToolForm() {
            this.$refs['toolForm'].resetFields()
        },
        resetContentForm() {
            this.$refs['contentForm'].resetFields()
            this.fileList = []
        },
        // 上传成功后返回
        handleSuccess(response, file, fileList) {
            this.fileList.push(response.url)
        },
        beforeUpload(file) {
            let fileSize = file.size / 1024
            if (fileSize > 300) {
                this.$message({
                    message: '请上传小于300kb的图片',
                    type: 'warning'
                });
                return false
            }
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
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
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
</style>
