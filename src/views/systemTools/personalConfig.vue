<template lang="html">
    <div class="personal-center">
        <el-row style="padding:30px 20px">
            <!-- <el-row>
                <el-col :span="2" class="config-title">
                    快速设置:
                </el-col>
                <el-col :span="22"class="config-content">
                    <el-radio-group v-model="resolutionRatio" style="height:25px;line-height:25px;">
                        <el-radio :label="1">1920分辨率</el-radio>
                        <el-radio :label="2">1368分辨率</el-radio>
                        <el-radio :label="0">自定义</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row> -->
            <el-row class="config-row">
                <el-col :span="2" class="config-title">
                    审核样式:
                </el-col>
                <el-col :span="22"class="config-content">
                    <el-card class="clearfix" :body-style="{overflow: 'hidden'}">
                        <el-col :span="12">
                            <el-row class="config-row--row">
                                <div class="config-content--title pull-left">
                                    字体大小
                                </div>
                                <div class="config-content--content pull-left clearfix">
                                    <el-slider v-model="personalConfig.auditFontSize" :min="12" :max="32"
                                               style="width:150px;float:left"
                                               @change="changeFontSize"
                                               ></el-slider>
                                    <el-input-number v-model="personalConfig.auditFontSize" :min="12" :max="32" size="small"
                                              style="float:left;margin-left:20px;"></el-input-number>
                                </div>
                            </el-row>
                            <el-row class="config-row--row" style="margin-top:30px;">
                                <div class="config-content--title pull-left">
                                    文字行高
                                </div>
                                <div class="config-content--content pull-left clearfix">
                                    <el-slider v-model="personalConfig.auditLineHeight" :min="20" :max="34"
                                               style="width:150px;float:left" @change="changeLineHeight"></el-slider>
                                    <el-input-number v-model="personalConfig.auditLineHeight" :min="20" :max="34" size="small"
                                              style="float:left;margin-left:20px;"></el-input-number>
                                </div>
                            </el-row>
                        </el-col>
                        <el-col :span="12">
                            <div class="example-box" :style="{fontSize: personalConfig.auditFontSize+'px',lineHeight: personalConfig.auditLineHeight+'px'}">
                                示例效果<br>
                                示例文本，用于显示审核时候的文本效果，字体大小可拖拽设置，如果字体偏小，可自动设置大小，字体大小最大支持32号字号，
                                行高最大支持34号行高，请分局自己需要进行设置，也可以选择快速设置，由系统推荐设置
                            </div>
                        </el-col>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class="config-row">
                <el-col :span="2" class="config-title">
                    列表样式:
                </el-col>
                <el-col :span="22"class="config-content">
                    <el-card class="clearfix" :body-style="{overflow: 'hidden'}">
                        <el-row class="config-row--row">
                            <div class="config-content--title pull-left">
                                列表显示
                            </div>
                            <div class="config-content--content pull-left clearfix">
                                <el-radio-group v-model="personalConfig.tableColumnShow" @change="changeTableColumn">
                                    <el-radio :label="1">系统推荐列</el-radio>
                                    <el-radio :label="2">显示全部列</el-radio>
                                </el-radio-group>
                            </div>
                        </el-row>
                        <el-row class="config-row--row" style="margin-top:30px;">
                            <div class="config-content--title pull-left">
                                列表条数
                            </div>
                            <div class="config-content--content pull-left clearfix">
                                <el-radio-group v-model="personalConfig.tableRowShow" @change="changeTableRow">
                                    <el-radio :label="10">10条</el-radio>
                                    <el-radio :label="15">15条</el-radio>
                                    <el-radio :label="20">20条</el-radio>
                                    <el-radio :label="50">50条</el-radio>
                                    <el-radio :label="100">100条</el-radio>
                                </el-radio-group>
                            </div>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class="config-row">
                <el-col :span="2" class="config-title">
                    发稿设置:
                </el-col>
                <el-col :span="22"class="config-content">
                    <el-card class="clearfix" :body-style="{overflow: 'hidden'}">
                        <el-row class="config-row--row">
                            <div class="config-content--title pull-left">
                                常用来源
                            </div>
                            <div class="config-content--content pull-left clearfix">
                                <el-tag
                                    :key="index"
                                    v-for="(tag,index) in sourceTags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag,'source')">
                                    {{tag.value}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="sourceVisible"
                                    v-model="sourceValue"
                                    ref="sourceTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm('source')"
                                    @blur="handleInputConfirm('source')">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput('source')">+ 来源</el-button>
                            </div>
                        </el-row>
                        <el-row class="config-row--row" style="margin-top:30px;">
                            <div class="config-content--title pull-left">
                                编辑保护
                            </div>
                            <div class="config-content--content pull-left clearfix">
                                <el-checkbox v-model="isEditProject" @change="addEditProject">是</el-checkbox>
                            </div>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    addConfigSource,
    delConfigSource
} from '@/api/systemTools'

export default {
    data() {
        return {
            resolutionRatio: 0,
            lineHeight: 20,
            fontSizeCustom: '',
            columnShow: '1',
            columnNum: '10',
            sourceTags: [],
            sourceVisible: false,
            sourceValue: '',
            isEditProject: false
        }
    },
    mounted() {
        this.isEditProject = Boolean(this.personalConfig.editProject)
        this.getSource()
        this.getEditProject()
    },
    methods: {
        addSource(){
            let params = {
                sourcename: this.sourceValue,
                configtype: 0
            }
            addConfigSource(params).then(res => {
                if(res.code === '00001'){
                    this.getSource()
                }
            })
        },
        delSource(tag){
            let params = {
                id: tag.id
            }
            delConfigSource(params).then(res => {
                if(res.code === '00001'){
                    this.getSource()
                }
            })
        },
        getSource(){
            this.$store.dispatch('getConfigSource').then(() => {
                this.sourceTags = this.personalConfig.source
            })
        },
        addEditProject(){
            let params = {
                editprotect: Number(this.isEditProject),
                configtype: 1
            }
            addConfigSource(params).then(res => {
                if(res.code === '00001'){
                    this.getEditProject()
                }
            })
        },
        getEditProject() {
            this.$store.dispatch('getEditProject').then(() => {})
        },
        changeFontSize() {
            this.$store.commit("SET_AUDIT_FONTSIZE", this.personalConfig.auditFontSize)
            localStorage.setItem("auditFontSize", this.personalConfig.auditFontSize)
        },
        changeLineHeight() {
            this.$store.commit("SET_AUDIT_LINEHEIGHT", this.personalConfig.auditLineHeight)
            localStorage.setItem("auditLineHeight", this.personalConfig.auditLineHeight)
        },
        changeTableColumn() {
            this.$store.commit("SET_TABLE_COLUMN", this.personalConfig.tableColumnShow)
            localStorage.setItem("tableColumn", this.personalConfig.tableColumnShow)
        },
        changeTableRow() {
            this.$store.commit("SET_TABLE_ROW", this.personalConfig.tableRowShow)
            localStorage.setItem("tableRow", this.personalConfig.tableRowShow)
        },
        handleClose(tag, type) {
            let _this = this
            this[type + 'Tags'].forEach((item,index) => {
                if(item.id === tag.id){
                    _this[type + 'Tags'].splice(index, 1)
                }
            })
            this.delSource(tag)
        },
        showInput(type) {
            this[type + 'Visible'] = true
            this.$nextTick(_ => {
                this.$refs[type + 'TagInput'].$refs.input.focus();
            });
        },
        handleInputConfirm(type) {
            if(this.sourceValue){
                this.addSource()
            }
            this[type + 'Visible'] = false;
            this[type + 'Value'] = '';
        }
    },
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    }
}
</script>

<style lang="scss" scoped="scoped">
.config-title {
    text-align: right;
    font-size: 16px;
    color: #666;
}
.config-content {
    padding: 0 20px;
}
.config-row {
    margin-top: 20px;
}
.config-content--title {
    padding-right: 20px;
}
.config-row--row {
    height: 36px;
    line-height: 36px;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
