<template>
<section>
    <!--工具条-->
    <el-row :gutter="20" style="margin: 0 auto;">
        <el-col :span="18">
            <el-card>
                <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
                    <div class="news_title">{{newExam.contenttitle}}</div>
                    <el-tag type="gray" class="cTag" v-for='(item,index) in newExam.keywords' :key="index">{{item}}</el-tag>
                    <div style="float: right;">
                        <el-button-group>
                            <el-button type="primary" icon="arrow-left" v-if="page_num>1" @click="nextPage(0)">上一页</el-button>
                            <el-button type="primary" v-if="(page_total-page_num)>=1" @click="nextPage(1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                        </el-button-group>
                    </div>
                </el-col>
                <el-col :span="6" class='box_div' id='box_div'>
                    <div class="box_img" id="box_img" style="column-width: 250px;left: 0px;width: 100%;" v-html="newExam.content">
                    </div>
                </el-col>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <el-row class="toolbar">
                    <el-form label-position="left" label-width="85px">
                        <el-form-item label="标题：">
                            <el-input v-model="newExam.contenttitle" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="原始地址：">
                            <el-input v-model="newExam.purl" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="来源：">
                            <el-input v-model="newExam.source" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="分类：">
                            <el-input v-model="newExam.urlmaintype" :disabled="true"></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row class="toolbar box_toolbar">
                    <el-radio-group v-model="radiopj" label="新闻评级">
                        <el-row :gutter="20" class="mb-10">
                            <el-col :span="12">
                                <el-radio :label="1">一级（纯新闻）</el-radio>
                            </el-col>
                            <el-col :span="12">
                                <el-radio :label="2">二级（非新闻）</el-radio>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="mb-10">
                            <el-col :span="12">
                                <el-radio :label="3">三级（暴力血腥）</el-radio>
                            </el-col>
                            <el-col :span="12">
                                <el-radio :label="4">四级（诱惑图片）</el-radio>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="mb-10">
                            <el-col :span="12">
                                <el-radio :label="5">五级（猎奇野史）</el-radio>
                            </el-col>
                            <el-col :span="12">
                                <el-radio :label="6">六级（两性话题）</el-radio>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="mb-10">
                            <el-col :span="12">
                                <el-radio :label="7">七级（不适图片）</el-radio>
                            </el-col>
                            <el-col :span="12">
                                <el-radio :label="8">八级（政治敏感）</el-radio>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="mb-10">
                            <el-col :span="12">
                                <el-radio :label="9">九级（负面新闻）</el-radio>
                            </el-col>
                            <el-col :span="12">
                                <el-radio :label="10">十级（突发新闻）</el-radio>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="mb-10">
                            <el-col :span="12">
                                <el-radio :label="11">十一级（推销乏味）</el-radio>
                            </el-col>
                            <el-col :span="12">
                                <el-radio :label="12">十二级（自媒体）</el-radio>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="mb-10">
                            <el-col :span="12">
                                <el-radio :label="13">十三级（原创）</el-radio>
                            </el-col>
                            <el-col :span="12">
                                <el-radio :label="14">十四级（图片水印）</el-radio>
                            </el-col>
                        </el-row>
                    </el-radio-group>
                </el-row>
                <el-row class="toolbar" v-if="!noPassVisible">
                    <el-button type="danger" icon="circle-cross" @click="newNoPassed">拒绝</el-button>
                    <el-button type="primary" icon="circle-check" @click="newPassed">通过</el-button>
                </el-row>
                <el-row class="toolbar" v-if="noPassVisible">
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
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</section>
</template>

<script>
import {
    searchExamVerification,
    searchExamPass,
    searchExamNoPass,
    newType
} from '@/api/audit'
import imagesLoaded from 'imagesloaded'

export default {
    data() {
        return {
            noPassVisible: false,
            dialog: {
                reasonSelect: '',
                reason: ''
            },
            newExamList: [],
            newExamListNum: 0,
            selfInterva: '',
            radiopj: 0,
            parentId: -1,
            options: [{
                value: '1',
                label: '文章标题'
            }, {
                value: '2',
                label: '文章URL'
            }],
            newsType: 'eastday',
            newNum: 0,
            newsSize: 5,
            newsRowkey: '',
            box_width: '',
            cont_width: '',
            page_total: 0,
            page_num: 1
        }
    },
    props: [
        'newExam',
        'largeV'
    ],
    mounted() {
        let _that = this;
        document.onkeydown = function(ev) {
            if (ev.keyCode == 49) {
                _that.radiopj = 1;
            } else if (ev.keyCode == 50) {
                _that.radiopj = 2;
            } else if (ev.keyCode == 51) {
                _that.radiopj = 3;
            } else if (ev.keyCode == 52) {
                _that.radiopj = 4;
            } else if (ev.keyCode == 53) {
                _that.radiopj = 5;
            } else if (ev.keyCode == 54) {
                _that.radiopj = 6;
            } else if (ev.keyCode == 55) {
                _that.radiopj = 7;
            } else if (ev.keyCode == 56) {
                _that.radiopj = 8;
            } else if (ev.keyCode == 57) {
                _that.radiopj = 9;
            } else if (ev.keyCode == 48) {
                _that.radiopj = 10;
            } else if (ev.keyCode == 81) {
                _that.radiopj = 11;
            } else if (ev.keyCode == 87) {
                _that.radiopj = 12;
            } else if (ev.keyCode == 69) {
                _that.radiopj = 13;
            } else if (ev.keyCode == 82) {
                _that.radiopj = 14;
            } else if (ev.shiftKey == 1 && ev.keyCode == 13) {
                _that.newPassed()
            } else if (ev.shiftKey == 1 && ev.keyCode == 222) {
                _that.newEditPassed();
            } else if (ev.shiftKey == 1 && ev.keyCode == 220) {
                _that.newNoPassed();
            } else if (ev.shiftKey == 1 && (ev.keyCode == 38 || ev.keyCode == 37 || ev.keyCode == 219)) {
                _that.nextPage(0);
            } else if (ev.shiftKey == 1 && (ev.keyCode == 40 || ev.keyCode == 39 || ev.keyCode == 221)) {
                _that.nextPage(1);
            }
        };
        _that.loadDataContent();
        window.onresize = function() {
            _that.loadDataContent();
        }
    },
    methods: {
        setReason() {
            this.dialog.reason = this.dialog.reasonSelect;
        },
        loadDataContent() {
            let box_div = document.getElementById('box_div')
            box_div.scrollLeft = 0;
            this.page_total = 0;
            this.page_num = 1; //初始化文章布局
            let b_width = document.getElementById("box_div");
            let c_width = document.getElementById("box_img");
            this.cont_width = c_width.offsetWidth; //内容宽度
            let cont_height = c_width.offsetHeight; //内容高度
            this.box_width = document.getElementById("box_div").scrollWidth - 30; //容器宽度
            let hack = document.getElementById("hack");
            if (hack == null) {
                c_width.innerHTML += '<img src="../../../../static/images/audit_img/articleEnd.jpg" alt="" style="width:100%"/><div id="hack"></div>';
                hack = document.getElementById("hack");
            }
            let client_left = b_width.getBoundingClientRect().left;
            let hackLeft = (hack.getBoundingClientRect().left - client_left - 10) + document.getElementById('box_div').scrollLeft;
            let colWid = (this.cont_width - 60) / 4;
            let colNum = Math.ceil((hackLeft + 20) / (colWid + 20));
            if (colNum < 4) colNum = 4;
            this.page_total = Math.ceil(colNum / 4);
            let xNum = (this.page_total * 4) - colNum;
            document.getElementById("hack").style.height = (xNum * cont_height) + 'px';
        },
        nextPage(index) {
            if (index == 1 && this.page_total > 1) {
                document.getElementById('box_div').scrollLeft = (~~this.page_num * ~~this.cont_width) + 20;
                this.page_num++;
            } else if (index == 0 && this.page_num > 1) {
                document.getElementById('box_div').scrollLeft = ((~~this.page_num - 2) * ~~this.cont_width) - 20;
                this.page_num--;
            }
        },
        getType() {
            let para = {
                type: this.newsType,
                parentId: this.parentId
            };
            newType(para).then((res) => {
                this.options = res.data.data;
            });
        },
        //dongfanghao
        noPassedClick() {
            this.noPassVisible = false;
            let para = {
                rowkey: this.newExam.rowkey,
                reason: this.dialog.reason,
                urltype: 0,
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
        // 拒绝
        newNoPassed() {
            //校检
            var params = {
                urltype: 0,
                urlfrom: this.newExam.urlfrom,
                rowkey: this.newExam.rowkey,
                mtppy: this.newExam.urlmaintypepy,
                largeV: this.largeV
            }
            searchExamVerification(params).then((res) => {
                if (res.code == "00001") {
                    let para = {
                        rowkey: this.newExam.rowkey,
                        reason: this.radiopj,
                        urltype: 0,
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
                            reason: this.radiopj,
                            urltype: 0,
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
        // 通过
        newPassed() {
            if (this.radiopj == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                });
                return;
            }
            //校检
            var params = {
                urltype: 0,
                urlfrom: this.newExam.urlfrom,
                rowkey: this.newExam.rowkey,
                mtppy: this.newExam.urlmaintypepy,
                largeV: this.largeV
            }
            searchExamVerification(params).then((res) => {
                if (res.code == "00001") {
                    let para = {
                        urlfrom: this.newExam.urlfrom,
                        urltype: 0,
                        rowkey: this.newExam.rowkey,
                        gradelv: this.radiopj,
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
                } else if (res.code == "01067") {
                    this.$confirm('数据已存在审核队列中，是否继续审核?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let para = {
                            urlfrom: this.newExam.urlfrom,
                            urltype: 0,
                            rowkey: this.newExam.rowkey,
                            gradelv: this.radiopj,
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
                        })
                    })
                }
            })
        }
    },
    watch: {
        "newExam.content": function() {
            var _this = this;
            this.$nextTick(function() {
                let box_img = document.getElementById("box_img");
                imagesLoaded('#box_img', function() {
                    _this.$nextTick(() => {
                        _this.loadDataContent();
                        _this.imgAllLoaded = true
                    })
                });

            })
        },
    }
}
</script>

<style scoped>
.box_div {
    width: 100%;
    height: 750px;
    padding: 10px 10px;
    box-sizing: border-box;
    overflow: hidden;
}

.box_toolbar {
    width: 100%;
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

.box_img {
    height: 700px;
}

.box_img img {
    width: auto;
}

.list-group {
    height: 200px;
    overflow-y: scroll;
}

.list_type {
    line-height: 30px;
    font-size: 20px;
}

.list_num {
    line-height: 30px;
    font-size: 16px;
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
}
</style>
