<template>
<section>
    <!--工具条-->
    <el-row :gutter="20" style="margin: 0 auto;">
        <el-col :span="18">
			<el-card>
				<el-row class="toolbar" style="padding-bottom: 10px;">
	                <div class="news_title"><span v-if="newExam.tfmaintype=='junshi'" style="float: left;font-size: 16px;color: red;">军事头条</span><span v-if="newExam.isabroad==1" style="float: left;font-size: 16px;color: red;">境外头条专用</span><span v-html="newExam.contenttitle"></span></div>
	                <el-tag type="gray" class="cTag" v-for='(item,index) in newExam.keywords' :key='index'>{{item}}</el-tag>
	                <div style="float: right;">
	                    <el-button-group>
	                        <el-button type="primary" icon="arrow-left" v-if="page_num>1" @click="nextPage(0)">上一页</el-button>
	                        <el-button type="primary" v-if="(page_total-page_num)>=1" @click="nextPage(1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
	                    </el-button-group>
	                </div>
	            </el-row>
	            <el-col :span="6" class='box_div' id='box_div' style="position:relative">
	                <div class="box_img" id="box_img" style="position:absolute;width:100%;column-width: 250px;left: 0px;width: 100%;" v-html="newExam.content">
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
	                    <el-row :gutter="20">
	                        <el-col :span="12">
	                            <el-radio :label="1">一级（纯新闻）</el-radio>
	                        </el-col>
	                        <el-col :span="12">
	                            <el-radio :label="2">二级（非新闻）</el-radio>
	                        </el-col>
	                    </el-row>
	                    <el-row :gutter="20" class="mt-10">
	                        <el-col :span="12">
	                            <el-radio :label="3">三级（暴力血腥）</el-radio>
	                        </el-col>
	                        <el-col :span="12">
	                            <el-radio :label="4">四级（诱惑图片）</el-radio>
	                        </el-col>
	                    </el-row>
	                    <el-row :gutter="20" class="mt-10">
	                        <el-col :span="12">
	                            <el-radio :label="5">五级（猎奇野史）</el-radio>
	                        </el-col>
	                        <el-col :span="12">
	                            <el-radio :label="6">六级（两性话题）</el-radio>
	                        </el-col>
	                    </el-row>
	                    <el-row :gutter="20" class="mt-10">
	                        <el-col :span="12">
	                            <el-radio :label="7">七级（不适图片）</el-radio>
	                        </el-col>
	                        <el-col :span="12">
	                            <el-radio :label="8">八级（政治敏感）</el-radio>
	                        </el-col>
	                    </el-row>
	                    <el-row :gutter="20" class="mt-10">
	                        <el-col :span="12">
	                            <el-radio :label="9">九级（负面新闻）</el-radio>
	                        </el-col>
	                        <el-col :span="12">
	                            <el-radio :label="10">十级（突发新闻）</el-radio>
	                        </el-col>
	                    </el-row>
	                    <el-row :gutter="20" class="mt-10">
	                        <el-col :span="12">
	                            <el-radio :label="11">十一级（推销乏味）</el-radio>
	                        </el-col>
	                        <el-col :span="12">
	                            <el-radio :label="12">十二级（自媒体）</el-radio>
	                        </el-col>
	                    </el-row>
	                    <el-row :gutter="20" class="mt-10">
	                        <el-col :span="12">
	                            <el-radio :label="13">十三级（原创）</el-radio>
	                        </el-col>
	                        <el-col :span="12">
	                            <el-radio :label="14">十四级（图片水印）</el-radio>
	                        </el-col>
	                    </el-row>
	                </el-radio-group>
	            </el-row>
	            <el-row class="toolbar mt-10">
	                <el-button type="danger" v-if="newExam.newNoPassed" icon="circle-cross" @click="showDialog">拒绝</el-button>
	                <el-button type="primary" v-if="newExam.newPassed" icon="circle-check" @click="newPassed">通过</el-button>
	            </el-row>
			</el-card>
        </el-col>
    </el-row>
    <!--拒绝Dialog Begin-->
    <el-dialog title="拒绝原因" :visible.sync="noPassVisible" top='20%' :modal="false">
        <span>
			<el-form :model="dialog" ref="dialogr">
				<el-form-item label="拒绝原因:" prop="reasonSelect":rules="[{ required: true, message: '必须输入原因'}]">
					<el-select v-model="dialog.reasonSelect" ref="selectInput" placeholder="请选择拒绝原因" filterable style="width:100%">
						<el-option-group
							v-for="(group,index) in noPassedOptions"
							:key="index"
							:value="group.label"
							:label="group.label">
							<el-option
								v-for="item in group.options"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-option-group>
					</el-select>
				</el-form-item>
			</el-form>
		</span>
        <span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="newNoPassed">确 定</el-button>
			<el-button @click="noPassVisible = false">取 消</el-button>
		</span>
    </el-dialog>
    <!--拒绝Dialog End-->
</section>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import {
    getNewExam,
    newPassed,
    newNoPassed,
    newEditPassed,
    newType,
    editNewPassed,
    editNewNoPassed
} from '@/api/audit';

export default {
    data() {
        return {
            noPassVisible: false,
            dialog: {
                reason: '',
                reasonSelect: '',
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
            page_num: 1,
            noPassedOptions: [{
                    label: '一 政治类',
                    options: [{
                        label: '101 发布内容涉及政治或敏感信息，违背相关现行政策与法律法规',
                        value: '101 发布内容涉及政治或敏感信息，违背相关现行政策与法律法规'
                    }]
                },
                {
                    label: '二 色情淫秽、低俗类',
                    options: [{
                            label: '201 发布内容涉及色情、淫秽信息',
                            value: '201 发布内容涉及色情、淫秽信息'
                        },
                        {
                            label: '202 发布内容包含低俗内容',
                            value: '202 发布内容包含低俗内容'
                        }
                    ]
                },
                {
                    label: '三 广告类',
                    options: [{
                            label: '301 正文含不相关违规推广文字或ID',
                            value: '301 正文含不相关违规推广文字或ID'
                        },
                        {
                            label: '302 内容涉嫌恶意营销',
                            value: '302 内容涉嫌恶意营销'
                        },
                        {
                            label: '303 内容涉嫌软文推广',
                            value: '303 内容涉嫌软文推广'
                        }
                    ]
                },
                {
                    label: '四 旧闻、虚假信息',
                    options: [{
                            label: '401 文章内容描述违背科学常理',
                            value: '401 文章内容描述违背科学常理'
                        },
                        {
                            label: '402 文中描述涉嫌无中生有或捏造谣言',
                            value: '402 文中描述涉嫌无中生有或捏造谣言'
                        },
                        {
                            label: '403 发布内容包含未被证实或与客观事实相左内容',
                            value: '403 发布内容包含未被证实或与客观事实相左内容'
                        },
                        {
                            label: '404 发布内容为过时旧闻',
                            value: '404 发布内容为过时旧闻'
                        }
                    ]
                },
                {
                    label: '五 标题类',
                    options: [{
                            label: '501 发布内容涉嫌标题党',
                            value: '501 发布内容涉嫌标题党'
                        },
                        {
                            label: '502 标题内容格式错误',
                            value: '502 标题内容格式错误'
                        },
                        {
                            label: '503 标题含错别字',
                            value: '503 标题含错别字'
                        },
                        {
                            label: '504 发布内容题文不符',
                            value: '504 发布内容题文不符'
                        }
                    ]
                },
                {
                    label: '六 内容格式类',
                    options: [{
                            label: '601 请删除请点击此处输入图片描述',
                            value: '601 请删除请点击此处输入图片描述'
                        },
                        {
                            label: '602 封面或正文图片缺失',
                            value: '602 封面或正文图片缺失'
                        },
                        {
                            label: '603 正文含有不相关字符或存在排版问题',
                            value: '603 正文含有不相关字符或存在排版问题'
                        },
                        {
                            label: '604 图片带有logo水印',
                            value: '604 图片带有logo水印'
                        },
                        {
                            label: '605 语意不明：病句、错别字、标点符号等错误较多',
                            value: '605 语意不明：病句、错别字、标点符号等错误较多'
                        },
                        {
                            label: '606 该内容不予收录',
                            value: '606 该内容不予收录'
                        },
                        {
                            label: '607 内容涉嫌拼凑、重复',
                            value: '607 内容涉嫌拼凑、重复'
                        },
                        {
                            label: '608 内容可能引起读者恶心、不适',
                            value: '608 内容可能引起读者恶心、不适'
                        },
                        {
                            label: '609 正文含敏感词汇',
                            value: '609 正文含敏感词汇'
                        }
                    ]
                }
            ]
        }
    },
    props: [
        'newExam'
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
        this.$nextTick(function() {
            let box_img = document.getElementById("box_img");
            imagesLoaded('#box_img', function() {
                _that.loadDataContent();
            });

        })
    },
    methods: {
        loadDataContent() {
            let path = this.$route.path;
            if (path == '/eastday/audit') {
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
                    c_width.innerHTML += '<img src="../../../static/images/articleEnd.jpg" alt="" /><div id="hack"></div>';
                    hack = document.getElementById("hack");
                }
                let client_left = b_width.getBoundingClientRect().left;
                console.log("滚动条长度：" + box_div.scrollWidth)
                console.log("hack：" + hack.getBoundingClientRect().left)
                let hackLeft = (hack.getBoundingClientRect().left - client_left - 10) + document.getElementById('box_div').scrollLeft;
                let colWid = (this.cont_width - 80) / 4;
                console.log(hackLeft)
                console.log(colWid)
                let colNum = Math.ceil((hackLeft + 20) / (colWid + 20));
                if (colNum < 4) colNum = 4;
                this.page_total = Math.ceil(colNum / 4);
                let xNum = (this.page_total * 4) - colNum;
                document.getElementById("hack").style.height = (xNum * cont_height) + 'px';
            }
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
        showDialog() {
            // 东方号的新闻拒绝需要理由
            this.$confirm('确认审核拒绝吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.newNoPassed()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消'
                });
            })
        },
        newNoPassed() { //拒绝
            if (!this.newExam.newNoPassed) {
                return;
            }
            let para = {
                type: this.newsType,
                param: {
                    rowkey: this.newExam.rowkey,
                    // reason: this.dialog.reasonSelect
                }
            };

            this.listLoading = true;
            if (this.newExam.rowkey.indexOf('_e') == -1) {
                newNoPassed(para).then((res) => {
                    this.$emit('listentPass', this.newExam.index);
                    this.listLoading = false;
                });
            } else {
                editNewNoPassed(para).then((res) => {
                    this.$emit('listentPass', this.newExam.index);
                    this.listLoading = false;
                });
            }
            this.noPassVisible = false
        },
        newPassed() { //通过
            if (!this.newExam.newPassed) {
                return;
            }
            if (this.radiopj == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                });
                return;
            }
            let para = {
                type: this.newsType,
                param: {
                    rowkey: this.newExam.rowkey,
                    gradelv: this.radiopj
                }
            };
            this.$confirm('确认审核通过吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                if (this.newExam.rowkey.indexOf('_e') == -1) {
                    newPassed(para).then((res) => {
                        this.$emit('listentPass', this.newExam.index);
                        this.listLoading = false;
                    });
                } else {
                    editNewPassed(para).then((res) => {
                        this.$emit('listentPass', this.newExam.index);
                        this.listLoading = false;
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消'
                });
            });
        },
    },
    watch: {
        "newExam": function() {
            var _this = this;
            this.$nextTick(function() {
                let box_img = document.getElementById("box_img");
                imagesLoaded('#box_img', function() {
                    _this.loadDataContent();
                });

            })
        },
        "noPassVisible": function() {
            var _this = this;
            if (this.noPassVisible) {
                setTimeout(function() {
                    _this.$refs.selectInput.$refs.reference.$refs.input.focus()
                }, 0)
            }
        }
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

.box_img {
    padding: 10px 0;
    box-sizing: border-box;
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
