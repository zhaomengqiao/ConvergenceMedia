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
                        <el-row class="config-row--row">
                            <div class="config-content--title pull-left">
                                编辑保护
                            </div>
                            <div class="config-content--content pull-left clearfix">
                                <el-checkbox v-model="isEditProject" @change="addEditProject">是</el-checkbox>
                            </div>
                        </el-row>
                        <el-row class="config-row--row">
                            <div class="config-content--title pull-left">
                                东方号
                            </div>
                            <div class="config-content--content pull-left clearfix">
                                <el-tag
                                    :key="index"
                                    v-for="(tag,index) in dfhTags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag,'dfh')">
                                    {{tag.dfhname}}
                                </el-tag>
                                <div style="display:inline-block" v-if="dfhVisible">
                                    <el-select v-model="dfhValue"
                                               value-key="userid"
                                               filterable
                                               remote
                                               :remote-method="getAllDFH"
                                               placeholder="请选择"
                                               ref="dfhTagInput"
                                               size="small"
                                               :loading="dfhLoading"
                                               no-data-text="请输入关键词进行模糊匹配">
                                        <el-option
                                            v-for="item in allDFH"
                                            :key="item.userid"
                                            :label="item.mediaName"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                    <el-button size="small" type="primary" @click="addDFH">确认</el-button>
                                    <el-button size="small" @click="closeAddDFH">取消</el-button>
                                </div>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput('dfh')">+ 新增东方号</el-button>
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
    delConfigSource,
    getSystemNotify,
    getAllDFHaccount
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
            dfhTags: [],
            dfhVisible: false,
            dfhValue: '',
            allDFH: [],
            isEditProject: false,
            dfhLoading: false,
            dfhSendAuth: false
        }
    },
    mounted() {
        this.isEditProject = Boolean(this.personalConfig.editProject)
        this.getSource()
        this.getDFH()
        this.getEditProject()
        this.getAuth()
    },
    methods: {
        getAuth() { //权限控制
            let authorList = localStorage.getItem('authorList')
            if (authorList.indexOf('sendNews/byDFH') > -1) {
                this.dfhSendAuth = true
            }
        },
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
        getDFH(){
            this.$store.dispatch('getDFHaccount').then(() => {
                this.dfhTags = this.personalConfig.dfh
            })
        },
        getAllDFH(query) {
            if (query !== '') {
                this.dfhLoading = true;
                let params = {
                    mediaName: query
                }
                getAllDFHaccount(params).then(res => {
                    if(res.code === '00001'){
                        this.allDFH = res.data
                    }
                    this.dfhLoading = false
                })
            } else {
                this.allDFH = [];
            }
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
        // 删除东方号
        handleCloseDFH(tag) {
            let params = {
                id: tag.id
            }
            delConfigSource(params).then(res => {
                if(res.code === '00001'){
                    this.getDFH()
                }
            })
        },
        showInput(type) {
            this[type + 'Visible'] = true
            if(type === 'source'){
                this.$nextTick(_ => {
                    this.$refs[type + 'TagInput'].$refs.input.focus();
                });
            }else{
                this.$nextTick(_ => {
                    this.$refs[type + 'TagInput'].focus();
                });
            }
        },
        handleInputConfirm(type) {
            if(this.sourceValue){
                this.addSource()
            }
            this[type + 'Visible'] = false;
            this[type + 'Value'] = '';
        },
        // 确认新增
        addDFH() {
            let params = {
                dfhname: this.dfhValue.mediaName,
                dfhid: this.dfhValue.userid,
                dfhhead: this.dfhValue.mediaHeadPic,
                isdfhblock: 0,
                configtype: 2
            }
            addConfigSource(params).then(res => {
                if(res.code === '00001'){
                    this.closeAddDFH()
                    this.getDFH()
                }
            })
        },
        closeAddDFH() {
            this.dfhVisible = false
            this.dfhValue = ''
            this.allDFH = []
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
