<!--审核页面用{{}}渲染的动态数据与高亮插件冲突，尽量用v-html-->
<template>
<section class="new-self">
    <!--新闻分拣新闻工具条-->
    <el-row :gutter="10" style="margin: 0 auto;min-width: 1100px;" v-loading="listLoading">
        <div class="button-title" v-if='newExamListNum>0' style="border-bottom: 1px solid #bbbbbb;">
            <div class="button-div">
                <el-tooltip class="item tooltip-key" effect="dark" placement="bottom" v-if='isAuth.newPassed'>
                    <div slot="content">快捷键：shift+回车</div>
                    <el-button type="primary" size="small" icon="circle-check" @click="newPassed">保存</el-button>
                </el-tooltip>
                <el-tooltip class="item tooltip-key" effect="dark" v-if="isAuth.newEditPassed&&isEdit" placement="bottom">
                    <div slot="content">快捷键：shift+'</div>
                    <el-button type="warning" size="small" icon="edit" @click="auditBegin = (!auditBegin)">
                        {{ auditBegin ? "停止分拣" : "开始分拣" }}
                    </el-button>
                </el-tooltip>
            </div>
            <div class="title-div">
                <div class="news_title">
                    <span v-html="newExam.contenttitle" style="vertical-align: middle"></span>
                    <el-button type="primary" size="mini" @click="copyTitle(newExam.contenttitle,$event)" v-if="newExam.contenttitle">复制</el-button>
                </div>
            </div>
        </div>
        <div class="next-title clearfix" v-if="newExam.length!=0">
            <div class="url-div">
                <span v-html="newExam.source"></span>：<a :href="newExam.purl" id='self-news' v-html="newExam.purl" style="color:#409EFF;vertical-align:middle" target="_blank"></a>
                <el-button type="primary" size="mini" @click="copyTitle(newExam.purl,$event)">复制</el-button>
            </div>
            <div class="page-div" v-if="imgAllLoaded">
                <el-tooltip class="item tooltip-key" effect="dark" v-if="page_num>1" placement="bottom">
                    <div slot="content">快捷键：shift+方向上键</div>
                    <el-button type="primary" size="small" icon="arrow-left" @click="nextPage(0)">上一页</el-button>
                </el-tooltip>
                <el-tooltip class="item tooltip-key" effect="dark" v-if="(page_total-page_num)>=1" placement="bottom">
                    <div slot="content">快捷键：shift+方向下键</div>
                    <el-button type="primary" size="small" @click="nextPage(1)">下一页</el-button>
                </el-tooltip>
            </div>
            <div class="page-div" v-if="!imgAllLoaded">
                <el-button type="primary" :loading="!imgAllLoaded">图片加载中</el-button>
            </div>
        </div>
        <div class="self-content">
            <div class="list_div">
                <div class="list_li" style="border-bottom: 1px solid #bbbbbb;">
                    <span>
						当前待分拣：<span class="list_red">{{isNumNews}}</span>
                    </span>
                </div>
                <div class="list_li" style="border-bottom: 1px solid #bbbbbb;">
                    <el-select v-model="newExam.tfmaintype" popper-class='tfmaintypeSelect' :disabled="newExamListNum==0" placeholder="请选择" style="width: 100%;float:left">
                        <el-option v-for="(item,index) in platform" :key="index" :label="item.typeName" :value="item.typePy" :disabled="item.typeName=='猎奇'||item.typeName=='NBA'||item.typeName=='娱乐八卦'||item.typeName=='女性'||item.typeName=='微看点'||item.typeName=='本地政务'||item.typeName=='新闻'||item.typeName=='段子'">
                        </el-option>
                    </el-select>
                </div>
                <div class="list_li" style="border-bottom: 1px solid #bbbbbb;">
                    <span>标签：</span>
                    <div v-if="showKey" style="margin-top: 10px;">
                        <!-- <el-tag style="margin-right: 10px;margin-bottom: 5px;" :key="tag" type="primary" v-for="tag in dynamicTags">
                            {{tag}}
                        </el-tag> -->
                        <el-tag
                            style="margin: 0 6px 6px 0"
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
                            style="width:140px;"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
                    </div>
                    <div class="demo-block-control" v-if="showKey" @click="showKey=false"><i class="el-icon-caret-top"></i><span class="">收起</span></div>
                    <div class="demo-block-control" v-else @click="showKey=true"><i class="el-icon-caret-bottom"></i><span class="">展开</span></div>
                </div>
                <div class="list_li">
                    <span>
							时效性：<span>{{timelinessOptions[timeliness].label}}</span>
                    </span>
                    <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                        <div slot="content">快捷键：<br/>数字键1~3</div>
                        <img src='../../../assets/audit_images/wen.png' class="tip-question">
                    </el-tooltip>
                </div>
                <div class="list_li" v-if="showRadio">
                    <el-radio-group v-model="timeliness" label="新闻评级">
                        <el-row :gutter="20" class="radiopj">
                            <el-col :span="24" v-for="(arr,index) in timelinessOptions" :key="index" style="margin-bottom:6px;">
                                <el-radio :label="arr.value">{{arr.label}}</el-radio>
                            </el-col>
                        </el-row>
                    </el-radio-group>
                </div>
                <div class="demo-block-control" v-if="showRadio" @click="showRadio=false"><i class="el-icon-caret-top"></i><span class="">收起</span></div>
                <div class="demo-block-control" v-else @click="showRadio=true"><i class="el-icon-caret-bottom"></i><span class="">展开</span></div>

            </div>
            <div class='box_div' id='box_div'>
                <div class="box_img" v-if='newExamListNum>0' id="box_img" style="column-count: 4;column-gap:20px;left: 0px;font-size:16px;" v-html="newExam.content">
                </div>
                <div class="audit_nullData" v-if='newExamListNum==0'>
                    暂无审核数据
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="imgBigBox" top="5%">
            <el-carousel trigger="click" height="500px" :initial-index="nowCarousel" :autoplay="false" v-if="imgBigBox">
                <el-carousel-item v-for="item in contentImgs" :key="item">
                    <div style="margin:0 auto;display:flex;align-items:center;justify-content:center;height:100%">
                        <img :src="item" alt="" style="width:auto;height:auto;max-width:100%;max-height:100%;display:block;">
                    </div>
                </el-carousel-item>
            </el-carousel>
            <!-- <img width="100%" :src="imgBigUrl" alt=""> -->
        </el-dialog>

    </el-row>

</section>
</template>

<script>
import {
    contentToHtml
} from '@/utils/contentTransform'
import clip from '@/utils/clipboard'
import imagesLoaded from 'imagesloaded'
import {
    getRedKeyWords
} from '@/api/commonApi'
import {
    UncheckedNum,
    getTagslog,
    addTagslog,
    examPlatType
} from '@/api/audit';

export default {
    props: [
        'myParam'
    ],
    data() {
        return {
            imgBigBox: false,
            imgBigUrl: '',
            auditBegin: true,
            selectAuditType: '',
            selectPlatforms: [],
            newExam: [],
            isAuth: {
                newPassed: false,
                newNoPassed: false,
                newEditPassed: false
            },
            dialog: {
                reasonSelect: '',
                reason: ''
            },
            platform: '',
            platformSub: '',
            newExamList: [],
            newExamListNum: 0,
            selfInterva: '',
            radiopj: 0,
            timeliness: 1,
            timelinessOptions: [{
                    label: '非时效性',
                    value: 0
                },
                {
                    label: '时效性',
                    value: 1
                },
                {
                    label: '未知',
                    value: 2
                }
            ],
            parentId: -1,
            newsType: 'wemedia',
            newNum: 0,
            newsSize: 5,
            newsRowkey: '',
            showKey: true,
            showRadio: true,
            box_width: '',
            cont_width: '',
            page_total: 0,
            page_num: 1,
            isNumNews: 0,
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            listLoading: false,
            isEdit: false, //是否 只有自媒体新闻 可以驳回 rowkey 含_e 不能
            //标红关键词
            redKeyWords: [],
            imgAllLoaded: false,
            contentImgs: [],
            nowCarousel: 0
        }
    },
    created() {
        this.getExamPlatType('1');
        this.getRedKeyWords();
        let tags_news = localStorage.getItem('tags_news');
        tags_news = JSON.parse(tags_news);
        if (tags_news == null) {
            this.getNewExam();
        } else if (tags_news.length <= 9) {
            this.newExamList = tags_news;
            this.newExamListNum = this.newExamList.length;
            this.getNewExam();
        } else {
            this.checkedNum('news');
            this.newExamList = tags_news;
            this.newExamListNum = this.newExamList.length;
            if (this.newExamListNum > 0) {
                this.newExam = this.newExamList[0];
                this.dynamicTags = this.newExam.keywords ? this.newExam.keywords.split(',') : [];
                this.newExam.content = contentToHtml(this.newExam, this.redKeyWords);
            }
            this.getExamPlatType(this.newExam.tfmaintype);
            localStorage.setItem('tags_news', JSON.stringify(this.newExamList));
        }
    },
    mounted() {
        let _that = this;
        window.onresize = function() {
            _that.loadDataContent();
        }
        _that.loadKey();
        _that.selfInterva = window.setInterval(_that.getInterva, 30000);
    },
    methods: {
        // 标红关键词获取
        getRedKeyWords() {
            getRedKeyWords().then(res => {
                if (res.code == "00001") {
                    this.redKeyWords = res.data
                }
            })
        },
        // 当前待审数量
        checkedNum(subType) {
            let para = {
                type: 'wemedia', // 自媒体待审核（接口名字是这样的，不要误解）
                subType: subType
            };
            UncheckedNum(para).then((res) => {
                this.isNumNews = res.data;
            });
        },
        setReason() {
            this.dialog.reason = this.dialog.reasonSelect;
        },
        // 获取审核分类
        getExamPlatType(type) {
            let params = {
                type: 'wemedia/news',
                parentpy: type
            }
            examPlatType(params).then(res => {
                if (type === '1') {
                    this.platform = res.data;
                    this.selectPlatforms = res.data.slice();
                    this.selectPlatforms.unshift({
                        'typeName': '全部',
                        'typePy': ''
                    })
                } else {
                    this.platformSub = res.data;
                }
            });
        },
        loadKey() { //键盘事件
            let _that = this;
            document.onkeydown = function(ev) {
                if (ev.shiftKey == 1 && ev.keyCode == 49) {
                    _that.newEditPassed('文首问题');
                } else if (ev.keyCode == 49) {
                    _that.timeliness = 0;
                } else if (ev.keyCode == 50) {
                    _that.radiopj = 1;
                } else if (ev.keyCode == 51) {
                    _that.radiopj = 2;
                } else if (ev.shiftKey == 1 && ev.keyCode == 13) {
                    _that.newPassed();
                }  else if (ev.shiftKey == 1 && (ev.keyCode == 38 || ev.keyCode == 37 || ev.keyCode == 219)) {
                    _that.nextPage(0);
                } else if (ev.shiftKey == 1 && (ev.keyCode == 40 || ev.keyCode == 39 || ev.keyCode == 221)) {
                    _that.nextPage(1);
                }
            };

        },
        getInterva() { //定时加载
            if (this.newExamList.length <= 9) {
                this.getNewExam();
            }
            this.checkedNum('news');
        },
        loadSrorage() { //加载本地缓存列表
            this.newExamList.shift();
            this.newExamListNum = this.newExamList.length;
            if (this.newExamListNum > 0) {
                this.newExam = this.newExamList[0];
                this.dynamicTags = this.newExam.keywords ? this.newExam.keywords.split(',') : [];
                this.newExam.content = contentToHtml(this.newExam, this.redKeyWords);
                if (this.newExam.rowkey.indexOf('_e') == -1) {
                    this.isEdit = true;
                }
                //this.loadDataContent();
            } else {
                this.newExam = '';
            }
            this.page_num = 1;
            this.radiopj = 0;
            localStorage.setItem('tags_news', JSON.stringify(this.newExamList));
            if (this.newExamListNum == 0) {
                this.page_total = 0;
                this.page_num = 1
            }
            this.checkedNum('news');
        },
        nextPage(index) { //文章上下一页
            var box_div = document.getElementById('box_div');
            if (index == 1 && this.page_total > 1) {
                if (this.page_total - this.page_num < 1) {
                    return
                }
                box_div.scrollLeft = (~~this.page_num * ~~this.cont_width) + (this.page_num * 20);
                this.page_num++;
            } else if (index == 0 && this.page_num > 1) {
                box_div.scrollLeft = ((~~this.page_num - 2) * ~~this.cont_width) + ((~~this.page_num - 2) * 20);
                this.page_num--;
            }
        },
        loadDataContent() { //文章自适应分页
            if (this.newExamListNum > 0) {
                this.$nextTick(function() {
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
                    if (this.newExam.rowkey.indexOf('_e') == -1) {
                        this.isEdit = true;
                    }
                    // 给box_div里的每个img绑定事件
                    var _this = this;
                    this.contentImgs = []
                    document.querySelectorAll('#box_img>img').forEach((item,index) => {
                        if (item.src.indexOf('articleEnd') == -1) {
                            _this.contentImgs.push(item.getAttribute('src'))
                            item.addEventListener("click", function() {
                                _this.imgBigUrl = item.src;
                                _this.imgBigBox = true;
                                _this.nowCarousel = index
                            })
                        }
                    })
                })
            }
        },
        getNewExam() { //获取列表详情
            this.checkedNum('news');
            let para = {
                size: 5,
            }
            if (this.auditBegin) {
                getTagslog(para).then((res) => {
                    if (res.data != null) {
                        if (res.data != null) {
                            let beans = res.data.Beans;
                            for (var i = 0; i < res.data.Beans.length; i++) {
                                this.newExamList.push(beans[i])
                            }
                            this.newExamListNum = this.newExamList.length;
                            localStorage.setItem('tags_news', JSON.stringify(this.newExamList));
                        }
                        if (this.newExamListNum > 0 && this.newExam.length == 0) {
                            this.newExam = this.newExamList[0];
                            this.dynamicTags = this.newExam.keywords ? this.newExam.keywords.split(',') : [];
                            this.newExam.content = contentToHtml(this.newExam, this.redKeyWords);
                            this.$nextTick(() => {
                                this.loadDataContent()
                            })
                        }
                    }
                });
            }
        },
        //复制URL按钮
        copyTitle(text, event) {
            clip(text, event)
        },
        newPassed() { //通过
            if(this.newExam.rowkey==undefined){
                return
            }
            let para = {
                type: this.newsType,
                param: {
                    rowkey: this.newExam.rowkey,
                    timeliness: this.timeliness,
                    customtag: this.dynamicTags.join(',')
                }
            };
            this.$confirm('确认审核通过吗?', '提示', {
                type: 'warning'
            }).then(() => {
                addTagslog(para).then((res) => {});
                this.loadSrorage();
                this.getInterva();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消'
                })
            })
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
        }
    },
    activated() { //keep-alive 组件激活
        this.loadKey(); //组件激活时重新监控键盘
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
        }
    },
    destroyed() {
        clearInterval(this.selfInterva)
        // localStorage.removeItem("tags_news")
    }
}
</script>
<style>
.tfmaintypeSelect .el-scrollbar__wrap {
    max-height: 500px;
}
</style>

<style scoped>
.red {
    color: red;
}

.new-self .button-title {
    padding: 8px 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center
}

.new-self .button-title .button-div {
    flex-grow: 0;
    min-width: 150px;
}

.next-title {
    position: relative;
    padding: 8px 5px;
    text-align: center;
}

.next-title .url-div {
    display: inline-block;
}

.next-title .page-div {
    position: absolute;
    top: 10px;
    right: 10px;
}

.new-self .button-title .title-div,
.url-div {
    flex-grow: 1;
    font-size: 18px;
}

.self-content {
    padding: 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
}

.self-content .list_div {
    flex-grow: 0;
    display: flex;
    flex-flow: column nowrap;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 10px;
    width: 250px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-sizing: border-box;
    margin-right: 10px;
}

.self-content .list_div .list_li {
    padding: 5px 0px;
    transition: height .2s;
}


.self-content .demo-block-control {
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    color: #d3dce6;
    cursor: pointer;
    transition: .2s;
    position: relative;
}

.self-content .demo-block-control:hover {
    color: #20a0ff;
    background-color: #f9fafc
}

.self-content .list_div .list_li>span {
    font-size: 16px;
    font-weight: bold;
}

.self-content .box_div {
    flex-grow: 1;
    padding: 10px;
    width: 100%;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
}

@media screen and (max-width:1366px) {
    .box_div,
    .list_div {
        height: 540px;
    }
    .box_img {
        height: 520px;
    }
}

@media screen and (min-width:1367px) {
    .box_div,
    .list_div {
        height: 720px;
    }
    .box_img {
        height: 700px;
    }
}

.cTag {
    margin: 0 5px;
}

.box_img img {
    width: auto;
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

.news_title {
    text-align: center;
    font-size: 20px;
}

.tfmaintypeSelect .el-scrollbar__wrap {
    max-height: 500px;
}

.box_img {
    padding: 10px 0;
    box-sizing: border-box;
}
</style>
