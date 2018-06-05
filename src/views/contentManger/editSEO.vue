<template lang="html">
    <section class="addSEO">
        <el-card>
            <el-row>
                <el-form :inline="true" :model="form">
                    <el-form-item style="margin-bottom:0" v-if="!areaShow.list">
                        <el-button type="primary" @click="saveData" :loading="saveLoading">保存</el-button>
                    </el-form-item>
                    <!-- <el-form-item style="margin-bottom:0" v-if="!areaShow.list">
                        <el-button type="primary" @click="savedraft" :loading="savedraftLoading" :disabled="idx!=''">存草稿</el-button>
                    </el-form-item> -->
                    <el-form-item style="margin-bottom:0" v-if="!areaShow.list">
                        <el-button @click="resetForm">清空</el-button>
                    </el-form-item>
                    <el-form-item label="" prop="timeQuantum" style="margin-bottom:0">
                        <el-date-picker format="yyyy-MM-dd HH:mm:ss"
                                        v-model="form.timeQuantum"
                                        type="datetimerange"
                                        placeholder="选择时间范围"
                                        @change="getTopTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="" style="margin-bottom:0">
                        <el-select v-model="form.mtp" placeholder="请选择类型" style="width:100px;" filterable>
                            <el-option
                                v-for="(item,index) in mtps"
                                :key="item.typePy"
                                :label="item.typeName"
                                :value="item.typeName=='全部'?item.typePy:item.typeName"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="form.keywords" placeholder="请输入标题关键词"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-card>
        <el-row class="mt-10" :gutter="10">
            <el-col :span="1" v-show="!areaShow.list">
                <el-button type="primary" style="display:block;white-space:normal;line-height:20px;padding:4px 4px;max-width:50px;font-size:14px;"
                           @click="showArea('list')">查询列表</el-button>
            </el-col>
            <el-col :span="elspanShow">
                <el-card v-if="areaShow.list">
                    <el-row>
                        <!--列表Begin-->
                        <el-table :data="tableData"
                                  highlight-current-row
                                  v-loading="listLoading"
                                  style="width: 100%;"
                                  tooltip-effect="dark"
                                  @row-click="rowClick"
                                  stripe border>
                            <el-table-column label="标题" min-width="220" :show-overflow-tooltip="true" prop="newtitle">
                                <template slot-scope="scope">
                                    <a :href="scope.row.url" class="aclick" target="_blank">{{ scope.row.newtitle }}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="来源" width="200" :show-overflow-tooltip="true" prop="newsrc">
                            </el-table-column>
                            <el-table-column prop="keywords" label="标签" width="200" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column prop="dateline" label="发布时间" :show-overflow-tooltip="true" width="200">
                                <template slot-scope="scope">
                                    <span>{{ format(Number(scope.row.dateline), 'yyyy-MM-dd HH:mm:ss') }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row class="own-pagination">
                        <el-pagination
                           background
                          @current-change="handleCurrentChange"
                          @size-change="handleSizeChange"
                          layout="total, sizes, prev, pager, next, jumper"
                          :page-sizes="[10, 15, 20, 50, 100]"
                          :page-size="pageSize"
                          :current-page="currentPage"
                          :total="total"
                          style="float:right;"
                          >
                        </el-pagination>
                    </el-row>
                </el-card>
                <el-row :gutter="10">
                    <el-col :span="areaShow.create?12:24" v-if="areaShow.review" v-loading="leftLoading">
                        <el-card :body-style="{position:'relative'}">
                            <!-- <el-button type="text" @click="closeAreaShow('review')"
                                       style="position:absolute;top:0px;right:10px;">收起
                                       <i class="el-icon-d-arrow-right" style="font-size:12px;margin-left:10px"></i>
                            </el-button> -->
                            <el-row>
                                <h2>{{ reveiewTitle }}</h2>
                                <p>{{ reveiewKeywords }}</p>
                            </el-row>
                            <el-row style="max-height:600px;overflow:auto;">
                                <div class="content_view" v-html="reveiewContent">
                                </div>
                            </el-row>
                        </el-card>
                    </el-col>
                    <el-col :span="areaShow.review?12:24" v-show="areaShow.create" v-loading="rightLoading">
                        <el-card :body-style="{position:'relative'}">
                            <!-- <el-button type="text" @click="closeAreaShow('create')"
                                       style="position:absolute;top:0px;right:10px;">收起
                                       <i class="el-icon-d-arrow-right" style="font-size:12px;margin-left:10px"></i>
                            </el-button> -->
                            <el-form ref="ruleForm" :model="addForm">
                                <el-form-item label="使用渠道：" prop="urlfromName" style="margin-bottom:10px;">
                                    <el-select v-model="addForm.channel" placeholder="请选择渠道" >
                                        <el-option
                                            v-for="(item,index) in channels"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            >
                                        </el-option>
                                    </el-select>
                                    <el-input v-model.trim="reviewSrc" placeholder="请输入来源" style="width:120px"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="urlfromName" style="margin-bottom:10px;">
                                    <el-input v-model.trim="editTitle" placeholder="请输入标题" :maxlength="100"></el-input>
                                </el-form-item>
                                <el-form-item label="" style="margin-bottom:10px;">
                                    <el-tag
                                        :key="tag"
                                        v-for="tag in dynamicTags"
                                        :closable="true"
                                        :close-transition="false"
                                        @close="handleClose(tag)"
                                    >
                                        {{tag}}
                                    </el-tag>
                                    <el-input
                                        class="input-new-tag"
                                        v-if="inputVisible"
                                        v-model="inputValue"
                                        ref="saveTagInput"
                                        size="mini"
                                        @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加关键词</el-button>
                                </el-form-item>
                                <el-form-item label="" prop="comment">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="meta描述"
                                        v-model.trim="addForm.comment">
                                    </el-input>
                                </el-form-item>
                                <el-row>
                                    <VueUEditor @ready="editorReady" :ueditorConfig="ueditorConfig" style="width: 100%;height: 400px;"  ref="addVideo"></VueUEditor>
                                </el-row>
                                <!-- <el-row class="mt-10">
                                    <el-button type="primary" @click="saveData" :loading="saveLoading">保存</el-button>
                                </el-row> -->
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="1" v-if="!areaShow.review || !areaShow.create">
                <el-button type="primary" style="display:block;white-space:normal;line-height:20px;padding:4px 4px;max-width:50px;font-size:14px"
                           @click="showArea('review')"
                           v-if="!areaShow.review"
                           :disabled="idx!=''">正文预览</el-button>
                <el-button type="primary" style="margin:10px 0 0 0;display:block;white-space:normal;line-height:20px;padding:4px 4px;max-width:50px;font-size:14px"
                           @click="showArea('create')"
                           v-if="!areaShow.create">文章发布</el-button>
            </el-col>
        </el-row>
    </section>
</template>
<script>
import VueUEditor from '@/components/UEditor';
import { contentToHtml, myReplace, contentEditorHtml } from '@/utils/contentTransform'
import {
    getSeoList,
    examPlatType,
    getOriginalDetail,
    saveSEOData,
    getSeoChannels,
    savedraft,
    getOriginalDetailByRowkey,
    saveEditSeoData
} from '@/api/contentManage'

export default {
    name: 'addSEO',
    components: {
        VueUEditor
    },
    data() {
        const startTime = new Date().setHours(0, 0, 0) - 3600 * 1000 * 24 * 1
        const endTime = new Date().setHours(23, 59, 59)
        return {
            ueditorConfig: {
                toolbars: [
                    [
                        'fullscreen', 'source', '|', 'undo', 'redo', 'bold', 'pagebreak', 'removeformat', 'insertimage', 'link', 'unlink'
                    ]
                ]
            },
            editorInstance: null,
            form: {
                timeQuantum: [startTime, endTime],
                starttime: startTime,
                endtime: endTime,
                keywords: '',
                mtp: ''
            },
            listLoading: false,
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            areaShow: {
                list: true,
                review: false,
                create: false
            },
            channels: [

            ],
            mtps: [],
            addForm: {
                channel: '',
                comment: '',
                mtp: ''
            },
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            // 文章编辑
            idx: '',
            rowkey: '',
            reveiewTitle: '',
            reveiewKeywords: '',
            reveiewContent: '',
            reviewSrc: '',
            reviewOldUrl: '',
            editTitle: '',
            editContent: '',
            leftLoading: false,
            rightLoading: false,
            saveLoading: false,
            savedraftLoading: false
        }
    },
    computed: {
        elspanShow() {
            if (!this.areaShow.list) {
                if (this.areaShow.review && this.areaShow.create) {
                    return 23
                } else {
                    return 22
                }
            } else {
                return 23
            }
        }
    },
    mounted() {
        this.isEdit()
        this.getTypes()
        this.getSeoChannels()
    },
    // KEEP ALIVE
    activated(){
        this.isEdit()
    },
    methods: {
        isEdit(){
            let rowkey = this.$route.query.rowkey
            if (rowkey) {
                this.getOriginalDetailByRowkey(rowkey)
                this.showArea('create')
                this.rowkey = rowkey
            }
            let idx = this.$route.query.idx
            if (idx) {
                this.idx = idx
            }
        },
        getTopTime() {
            if (this.form.timeQuantum.length != 0) {
                this.form.starttime = new Date(this.form.timeQuantum[0]).getTime()
                this.form.endtime = new Date(this.form.timeQuantum[1]).getTime()
            }
        },
        search() {
            this.currentPage = 1
            this.getList()
        },
        // 获取渠道
        getSeoChannels() {
            getSeoChannels().then(res => {
                var _this = this;
                res.data.forEach(item => {
                    if (item !== '' && item !== null) {
                        _this.channels.push({
                            label: item,
                            value: item
                        })
                    }
                })
                this.addForm.channel = _this.channels[0].value
            })
        },
        getTypes() {
            let params = {
                type: 'selfmedia/news',
                parentpy: '1'
            }
            examPlatType(params).then(res => {
                this.mtps = res.data
                this.mtps.unshift({
                    typeName: '全部',
                    typePy: ''
                })
            });
        },
        getList() {
            let params = {
                startime: this.form.starttime,
                endtime: this.form.endtime,
                mtp: this.form.mtp,
                title: this.form.keywords,
                page: this.currentPage,
                pagesize: this.pageSize
            }
            this.listLoading = true
            getSeoList(params).then(res => {
                if (res.code == "00001") {
                    this.tableData = res.data.data
                    this.total = res.data.count
                }
                this.listLoading = false
            })
        },
        getOriginalDetailByRowkey(rowkey) {
            let params = {
                rowkey: rowkey
            }
            getOriginalDetailByRowkey(params).then(res => {
                if (res.code == "00001") {
                    // 预览信息
                    this.reveiewTitle = res.data.contenttitle
                    this.reveiewKeywords = res.data.keywords
                    this.reveiewContent = contentToHtml(res.data, [], 'seo');
                    this.reviewSrc = res.data.source
                    this.reviewOldUrl = res.data.url
                    this.addForm.mtp = res.data.urlmaintype
                    this.addForm.comment = res.data.meta
                    // 编辑信息
                    this.editTitle = res.data.contenttitle
                    this.editContent = contentEditorHtml(res.data)
                    this.editorInstance.setContent(this.editContent);
                    this.dynamicTags = res.data.keywords.split(",")
                }
            })
        },
        getOriginalDetail(url) {
            let params = {
                url: url
            }
            this.leftLoading = true
            this.rightLoading = true
            getOriginalDetail(params).then(res => {
                if (res.code == "00001") {
                    // 预览信息
                    this.reveiewTitle = res.data.contenttitle
                    this.reveiewKeywords = res.data.keywords
                    this.reveiewContent = contentToHtml(res.data, [], 'seo');
                    this.reviewSrc = res.data.source
                    this.reviewOldUrl = res.data.url
                    this.addForm.mtp = res.data.urlmaintype
                    // 编辑信息
                    this.editTitle = (res.data.robottitle == null || res.data.robottitle == '') ? res.data.contenttitle : res.data.robottitle
                    if (res.data.robotzw == '' || res.data.robotzw == null) {
                        this.$message({
                            message: '该文章未做预处理',
                            type: 'warning'
                        });
                    }
                    this.editContent = res.data.robotzw ? contentEditorHtml(res.data, '', 'robotzw') : contentEditorHtml(res.data)
                    this.editorInstance.setContent(this.editContent);
                    this.dynamicTags = res.data.keywords.split(",")
                }
                this.leftLoading = false
                this.rightLoading = false
            })
        },
        rowClick(row, event, column) {
            if (event.target.nodeName !== 'A') {
                this.idx = ''
                this.getOriginalDetail(row.url)
                this.showArea('review')
                this.showArea('create')
            }
        },
        // 展示/收起 不同区域
        // type （list 列表 | review 正文预览 | create 文章发布）
        showArea(type) {
            switch (type) {
                case 'list':
                    this.areaShow.list = true
                    this.areaShow.review = false
                    this.areaShow.create = false
                    break;
                case 'review':
                    this.areaShow.review = true
                    this.areaShow.list = false
                    break;
                case 'create':
                    this.areaShow.create = true
                    this.areaShow.list = false
                    break;
            }
        },
        // 保存
        saveData() {
            var content = myReplace(this.editContent, '_ueditor_page_break_tag_', '<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>')
            let params = {
                title: this.editTitle,
                pkey: this.dynamicTags.join(","),
                meta: this.addForm.comment,
                src: this.reviewSrc,
                mtp: this.addForm.mtp,
                oriurl: this.reviewOldUrl,
                channel: "东方头条",
                content: content,
                isdraft: 0
            }
            // 编辑保存
            if (this.idx != '') {
                params.idx = this.idx
                params.rowkey = this.rowkey
                this.saveLoading = true
                saveEditSeoData(params).then(res => {
                    if (res.code == "00001") {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        this.showArea('list')
                        this.resetForm()
                    }
                    this.saveLoading = false
                })
            } else {
                // 新增保存
                this.saveLoading = true
                saveSEOData(params).then(res => {
                    if (res.code == "00001") {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        this.showArea('list')
                        this.resetForm()
                    }
                    this.saveLoading = false
                })
            }
        },
        savedraft() {
            let params = {
                title: this.editTitle,
                pkey: this.dynamicTags.join(","),
                meta: this.addForm.comment,
                src: this.reviewSrc,
                mtp: this.addForm.mtp,
                oriurl: this.reviewOldUrl,
                channel: "东方头条",
                content: myReplace(this.editContent, '_ueditor_page_break_tag_', '<hr class="pagebreak" noshade="noshade" size="1" style="user-select: none;"/>'),
                isdraft: 1
            }
            this.savedraftLoading = true
            savedraft(params).then(res => {
                if (res.code == "00001") {
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                    this.showArea('list')
                    this.resetForm()
                }
                this.savedraftLoading = false
            })
        },
        closeAreaShow(type) {
            switch (type) {
                case 'review':
                    this.areaShow.review = false
                    break;
                case 'create':
                    this.areaShow.create = false
                    break;
            }
            if (!this.areaShow.create && !this.areaShow.review) {
                this.areaShow.list = true
            }
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
        editorReady(editorInstance) {
            this.editorInstance = editorInstance;
            editorInstance.setContent(this.editContent);
            editorInstance.addListener('contentChange', () => {
                this.editContent = editorInstance.getContent();
            });
        },
        resetForm() {
            this.idx = ''
            this.rowkey = ''
            this.reveiewTitle = ''
            this.reveiewKeywords = ''
            this.reveiewContent = ''
            this.reviewSrc = ''
            this.reviewOldUrl = ''
            this.editTitle = ''
            this.editContent = ''
            this.editorInstance.setContent(this.editContent);
            this.dynamicTags = []
            this.addForm.comment = ''
            this.addForm.mtp = ''
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
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    &:hover {
        color: #58B7FF;
    }
}
</style>
