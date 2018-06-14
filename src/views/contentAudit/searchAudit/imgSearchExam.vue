<template>
<section>
    <el-row :gutter="10" style="margin: 0 auto;" v-loading="listLoading">
        <el-col :xs="13" :sm="14" :md="16" :lg="18">
            <el-card>
                <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
                    <div class="news_title">
                        <div v-if='pictureListNum>0'>
                            <el-popover ref="popoverTitle" placement="bottom" v-model='popShow' width="750" trigger="click">
                                <span style="font-size: 16px;">查看 封面</span>
                                <div class="content_img">
                                    <img v-for='item in newExam.imgmini' :src="item.src" style='height:180px;width:240px;'>
                                </div>
                            </el-popover>
                            <el-button v-popover:popoverTitle class="tooltip_title">{{newExam.contenttitle}}
                                <!-- <img v-if='newExam!=null&&newExam.isoriginal==1' src="../../assets/u3120.png"> -->
                            </el-button>
                        </div>
                        <div style="float: right;width: 175px;">
                            <el-tooltip class="item tooltip-key" effect="dark" v-if="pageNum>1" placement="bottom">
                                <div slot="content">快捷键：shift+方向上键</div>
                                <el-button type="primary" size="small" icon="arrow-left" @click="nextPage(0)">上一页</el-button>
                            </el-tooltip>
                            <el-tooltip class="item tooltip-key" effect="dark" v-if="(pageTotal-pageNum)>=1" placement="bottom">
                                <div slot="content">快捷键：shift+方向下键</div>
                                <el-button type="primary" size="small" @click="nextPage(1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                            </el-tooltip>
                        </div>
                    </div>
                    <div>标签：
                        <el-tag style="margin-right: 10px;" :key="tag" type="primary" v-for="tag in dynamicTags">
                            {{tag}}
                        </el-tag>
                    </div>
                </el-col>
                <el-col :span="24" class="box_div" id="box_div">
                    <div id="box_cont" style="width: 100%;">
                        <el-row :gutter="10">
                            <el-col :span="6" v-for='(item,index) in pictureInfoImg' :key="index">
                                <div><img class="box_img" style="width: 100%;" :src="item.src" /> </div>
                                <div class="img_txt">{{item.des_img}}</div>
                            </el-col>
                        </el-row>
                    </div>

                </el-col>
            </el-card>
        </el-col>
        <el-col :xs="11" :sm="10" :md="8" :lg="6">
            <el-card>
                <el-col :span="24" class="toolbar">
                    <el-form label-position="left" label-width="85px">
                        <el-form-item label="标题：">
                            <el-input v-model="newExam.contenttitle" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="原始地址：">
                            <el-input v-model="newExam.purl" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="来源：">
                            <div class="input_div"><span :style="newExam.dfhviplv>0?{color: 'red'}:''">{{newExam.source}}</span>
                                <!-- <img v-if='newExam!=null&&newExam.dfhviplv>0' src="../../assets/u3118.png" style="vertical-align:-3px;"> -->
                            </div>
                        </el-form-item>
                        <el-form-item label="分类：">
                            <el-input v-model="newExam.urlmaintype" :disabled="true"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="24">评级：
                    <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                        <div slot="content">快捷键：<br/>数字键1~5对应1~5级；</div>
                        <img src='../../../assets/audit_images/wen.png' style="width: 18px" class="tip-question" />
                    </el-tooltip>
                </el-col>
                <el-col :span="24" class="toolbar box_toolbar">
                    <el-radio-group v-model="imgLevel" label="新闻评级">
                        <el-row :gutter="20" class="radiopj">
                            <el-col :span="12" class="mb-10">
                                <el-radio :label="1">1级(普通级)</el-radio>
                            </el-col>
                            <el-col :span="12" class="mb-10">
                                <el-radio :label="2">2级(暴力血腥)</el-radio>
                            </el-col>
                            <el-col :span="12" class="mb-10">
                                <el-radio :label="3">3级(情色诱惑)</el-radio>
                            </el-col>
                            <el-col :span="12" class="mb-10">
                                <el-radio :label="4">4级(政治敏感)</el-radio>
                            </el-col>
                            <el-col :span="12" class="mb-10">
                                <el-radio :label="5">5级(内容低质)</el-radio>
                            </el-col>
                        </el-row>
                    </el-radio-group>
                </el-col>
                <el-col :span="24" class="toolbar mb-10" v-if="!noPassVisible">
                    <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                        <div slot="content">快捷键：shift+\</div>
                        <el-button type="danger" size="small" icon="circle-cross" @click="imgNoPassed">拒绝</el-button>
                    </el-tooltip>
                    <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                        <div slot="content">快捷键：shift+回车</div>
                        <el-button type="primary" size="small" icon="circle-check" @click="imgPassed">通过</el-button>
                    </el-tooltip>
                </el-col>
                <el-col :span="24" class="toolbar" v-if="noPassVisible">
                    <el-form :model="dialog" ref="dialogr">
                        <el-form-item label="拒绝原因:">
                            <el-select v-model="dialog.reasonSelect" placeholder="请选择拒绝原因" @change='setReason'>
                                <el-option value="文章内容或图片涉敏感"></el-option>
                                <el-option value="文章内容或图片涉低俗"></el-option>
                                <el-option value="文章没有可读性"></el-option>
                                <el-option value="封面或者正文图片含水印"></el-option>
                                <el-option value="封面或正文用户不适图片"></el-option>
                                <el-option value="标题存在错误"></el-option>
                                <el-option value="文章分类不合理"></el-option>
                                <el-option value="文章内容混乱"></el-option>
                                <el-option value="文章缺乏新闻属性"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="reason" :rules="[{ required: true, message: '必须输入原因'}]">
                            <el-input v-model="dialog.reason" placeholder="请输入原因"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="noPassedClick">确 定</el-button>
                            <el-button @click="noPassVisible = false">取 消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-card>
        </el-col>
    </el-row>
</section>
</template>

<script>
import {
    searchExamVerification,
    searchExamPass,
    searchExamNoPass
} from '@/api/audit';
export default {
    props: [
        'newExam',
        'largeV'
    ],
    created() {
        console.log(this.newExam)
    },
    data() {
        return {
            noPassVisible: false,
            dialog: {
                reasonSelect: '',
                reason: ''
            },
            popShow: false,
            pictureInfo: [],
            pictureInfoImg: [],
            pictureList: [],
            imgInterva: '',
            pictureListNum: 0,
            imgLevel: 0,
            imgtype: 'selfmedia',
            imgSize: 5,
            imgRowkey: '',
            box_width: '',
            cont_width: '',
            pageTotal: 0,
            pageNum: 1,
            pageSize: 8,
            listLoading: false,
            dynamicTags: [],
            activeName: this.myParam, //父元素选项卡
            inputVisible: false,
            showTag: true,
            inputValue: ''
        }
    },
    mounted() {
        this.pictureInfoImg = this.newExam.imgs.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize);
        this.loadKey()
    },
    methods: {
        setReason() {
            this.dialog.reason = this.dialog.reasonSelect;
        },
        loadKey() {
            let _that = this;
            document.onkeydown = function(ev) {
                if (ev.keyCode == 49) {
                    _that.imgLevel = 1;
                } else if (ev.keyCode == 50) {
                    _that.imgLevel = 2;
                } else if (ev.keyCode == 51) {
                    _that.imgLevel = 3;
                } else if (ev.keyCode == 52) {
                    _that.imgLevel = 4;
                } else if (ev.keyCode == 53) {
                    _that.imgLevel = 5;
                } else if (ev.shiftKey == 1 && ev.keyCode == 13) {
                    _that.imgPassed();
                } else if (ev.shiftKey == 1 && ev.keyCode == 220) {
                    _that.imgNoPassed();
                } else if (ev.shiftKey == 1 && (ev.keyCode == 38 || ev.keyCode == 37 || ev.keyCode == 219)) {
                    _that.nextPage(0);
                } else if (ev.shiftKey == 1 && (ev.keyCode == 40 || ev.keyCode == 39 || ev.keyCode == 221)) {
                    _that.nextPage(1);
                }
            };
            this.imgInterva = window.setInterval(this.getPicInterva, 30000);
        },
        nextPage(index) {
            let _that = this;
            if (index == 1 && _that.pageTotal > 1) {
                _that.pageNum++;
                _that.pictureInfoImg = _that.pictureInfo.yzwbimgs.slice((_that.pageNum - 1) * _that.pageSize, _that.pageNum * _that.pageSize);
            } else if (index == 0 && _that.pageNum > 1) {
                _that.pageNum--;
                _that.pictureInfoImg = _that.pictureInfo.yzwbimgs.slice((_that.pageNum - 1) * _that.pageSize, _that.pageNum * _that.pageSize);
            }
        },
        //dongfanghao
        noPassedClick() {
            this.noPassVisible = false;
            let para = {
                rowkey: this.newExam.rowkey,
                reason: this.dialog.reason,
                urltype: 2,
                urlfrom: this.newExam.urlfrom,
                mtppy: this.newExam.urlmaintypepy,
                largeV: this.largeV
            }
            switch (this.newExam.urltype) {
                case 0:
                    para.urltype = 0
                    break;
                case 1:
                    para.urltype = 1
                    break;
                case 2:
                    para.urltype = 2
                    break;
            }
            this.$confirm('确认审核拒绝吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                searchExamNoPass(para).then((res) => {
                    this.$emit('listentPass', '');
                    this.listLoading = false;
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消'
                });
            });
        },
        imgNoPassed() {
            if (this.imgLevel == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                });
                return;
            }
            //校检
            var params = {
                urltype: 2,
                urlfrom: this.newExam.urlfrom,
                rowkey: this.newExam.rowkey,
                mtppy: this.newExam.urlmaintypepy,
                largeV: this.largeV
            }
            searchExamVerification(params).then((res) => {
                if (res.code == "00001") {
                    let para = {
                        rowkey: this.newExam.rowkey,
                        reason: this.imgLevel,
                        urltype: 2,
                        urlfrom: this.newExam.urlfrom,
                        mtppy: this.newExam.urlmaintypepy,
                        largeV: this.newExam.islargev
                    }
                    if (this.newExam.urlfrom == "dongfanghao") {
                        this.noPassVisible = true;
                    } else {
                        this.$confirm('确认审核拒绝吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.listLoading = true;
                            searchExamNoPass(para).then((res) => {
                                this.$emit('listentPass', '');
                                this.listLoading = false;
                                this.noPassVisible = false;
                            });
                        }).catch(() => {
                            this.noPassVisible = false;
                            this.$message({
                                type: 'info',
                                message: '取消'
                            });
                        });
                    }
                } else if (res.code == "01067") {
                    this.$confirm('数据已存在审核队列中，是否继续审核?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let para = {
                            rowkey: this.newExam.rowkey,
                            reason: this.imgLevel,
                            urltype: 2,
                            urlfrom: this.newExam.urlfrom,
                            mtppy: this.newExam.urlmaintypepy,
                            largeV: this.newExam.islargev
                        }
                        if (this.newExam.urlfrom == "dongfanghao") {
                            this.noPassVisible = true;
                        } else {
                            this.$confirm('确认审核拒绝吗?', '提示', {
                                type: 'warning'
                            }).then(() => {
                                this.listLoading = true;
                                searchExamNoPass(para).then((res) => {
                                    this.$emit('listentPass', '');
                                    this.listLoading = false;
                                    this.noPassVisible = false;
                                });
                            }).catch(() => {
                                this.noPassVisible = false;
                                this.$message({
                                    type: 'info',
                                    message: '取消'
                                });
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消'
                        });
                    });
                }
            });

        },
        imgPassed() {
            if (this.imgLevel == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                });
                return;
            }
            //校检
            var params = {
                urltype: 2,
                urlfrom: this.newExam.urlfrom,
                rowkey: this.newExam.rowkey,
                mtppy: this.newExam.urlmaintypepy,
                largeV: this.largeV
            }
            searchExamVerification(params).then((res) => {
                if (res.code == "00001") {
                    let para = {
                        urlfrom: this.newExam.urlfrom,
                        urltype: 2,
                        rowkey: this.newExam.rowkey,
                        gradelv: this.imgLevel,
                        pkey: this.newExam.keywords,
                        contenttitle: this.newExam.contenttitle,
                        mtppy: this.newExam.urlmaintypepy,
                        largeV: this.newExam.islargev
                    };
                    this.$confirm('确认审核通过吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        searchExamPass(para).then((res) => {
                            this.$emit('listentPass', '');
                            this.listLoading = false;
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消'
                        });
                    });
                } else if (res.code == "01067") {
                    this.$confirm('数据已存在审核队列中，是否继续审核?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let para = {
                            urlfrom: this.newExam.urlfrom,
                            urltype: 2,
                            rowkey: this.newExam.rowkey,
                            gradelv: this.imgLevel,
                            pkey: this.newExam.keywords,
                            contenttitle: this.newExam.contenttitle,
                            mtppy: this.newExam.urlmaintypepy,
                            largeV: this.newExam.islargev
                        };
                        console.log(para);
                        this.$confirm('确认审核通过吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.listLoading = true;
                            searchExamPass(para).then((res) => {
                                this.$emit('listentPass', '');
                                this.listLoading = false;
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '取消'
                            });
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消'
                        });
                    });
                }
            });

        }
    },
}
</script>

<style scoped>
.box_div {
    width: 100%;
    padding: 10px 10px;
    min-height: 700px;
    box-sizing: border-box;
    overflow: hidden;
}

#box_cont {
    width: 100%;
}

.img_txt {
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
}

@media screen and (max-width:1366px) {
    .list-group {
        display: none;
    }
    .img_txt {}
}

.tooltip_title {
    border: 1px solid #ffffff;
    font-size: 20px;
}

@media screen and (min-width:1367px) {
    .list-group {
        display: block;
    }
    .img_txt {}
}

.grid-content {
    width: 25%;
    height: 50%;
    float: left;
    padding: 6px 10px;
    overflow: hidden;
    box-sizing: border-box;
}

.box_img {
    width: 100%;
    height: 200px;
}

.list-group {
    height: 200px;
    border: 1px solid #d2dce6;
    overflow-y: scroll;
}

.list_type {
    line-height: 25px;
}

.list_num {
    float: right;
}

.list_red {
    color: red;
}

.list-group ul {
    padding: 0;
}

.list-group li {
    overflow: hidden;
    padding: 10px 0px 10px 10px;
    border: 1px solid #dddddd;
    border-bottom: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-group .active {
    background-color: #2d384a;
    color: #fff;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    padding: 10px 10px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}

.news_title {
    text-align: center;
    font-size: 20px;
    padding: 5px 0;
}

.input_div {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    color: #bbb;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    font-size: inherit;
    height: 36px;
    line-height: 2;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
}
</style>
