<template lang="html">
    <section class="imgSelfExam">
        <el-card :body-style="{padding:'10px 20px'}" v-if="newExam!==null">
            <el-row :gutter="4">
                <el-col :span="4">
                    <el-button type="primary" size="small" icon="circle-check" @click="pass">通过</el-button>
                    <el-button type="danger" size="small" icon="circle-cross" @click="noPassVisible = true">拒绝</el-button>
                </el-col>
                <el-col :span="20" class="flex_center">
                    <span class="audit-title" v-html="newExam.contenttitle"></span>
                    <el-button type="primary" size="mini" @click="copyContent(newExam.contenttitle,$event)">复制</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top:10px" :body-style="{padding:'10px'}">
            <div class="url-next_page clearfix" v-if="newExam!==null">
                <div class="switch_div pull-left">
                    <el-button type="primary" @click="auditBegin = (!auditBegin)" size="small" style="margin-right:10px;">
                        {{ auditBegin?"停止审核(审核中)":"开始审核(停审中)" }}
                    </el-button>
                    <span>审核领域：</span>
                    <el-select v-model="selectAuditType" popper-class='tfmaintypeSelect' placeholder="请选择审核分类" style="width:100px;">
                        <el-option v-for="(item,index) in selectPlatforms" :key="index" :label="item.typeName" :value="item.typePy">
                        </el-option>
                    </el-select>
                </div>
                <div class="url-source">
                    <span class="source"
                          v-html="newExam.source"></span>
                    ：
                    <a :href="newExam.purl" target="_blank" class="url" v-html="newExam.purl"></a>
                    <el-button type="primary" size="mini" @click="copyContent(newExam.purl,$event)">复制</el-button>
                </div>
                <div class="next_btn-group" v-if="pageTotal>1">
                    <el-button type="primary" size="small" @click="changePage(-1)" v-if="currentPage!==1">上一页</el-button>
                    <el-button type="primary" size="small" @click="changePage(1)" v-if="currentPage!==pageTotal">下一页</el-button>
                </div>
            </div>
            <el-row :gutter="20" type="flex">
                <el-col :span="4" style="min-width:230px;">
                    <el-card :body-style="{padding:'0px'}">
                        <div class="left-label hasBorderBottom">
                            <span class="title" style="font-weight:700">当前待审：</span>
                            <span class="audit-num" style="color:#ff4949;font-weight:700" v-html="unCheckedNum"></span>
                        </div>
                        <div class="left-select hasBorderBottom" v-if="newExam!==null">
                            <el-select v-model="newExam.urlmaintypepy" placeholder="请选择" style="width: 100%">
                                <el-option
                                    v-for="(item,index) in platform"
                                    :key="item.typePy"
                                    :label="item.typeName"
                                    :value="item.typePy">
                                </el-option>
                            </el-select>
                        </div>
                        <el-collapse v-model="activeName">
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
                                            {{ imgLevel==''?'暂未选择':levelOptions[imgLevel-1].label }}
                                        </div>
                                    </div>
                                </template>
                                <div class="collapse-content">
                                    <el-radio-group v-model="imgLevel">
                                        <div v-for="(item,index) in levelOptions" style="margin-bottom:6px;" :key="index">
                                            <el-radio :label="item.value">{{ item.label }}</el-radio>
                                        </div>
            					   </el-radio-group>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                        <!-- <div class="left-tag hasBorderBottom">
                            <div class="left-title">标签：</div>
                            <div v-if="dynamicTags.length!=0">
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
                            <div class="demo-block-control" @click="fold.tag=false">
                                <i class="el-icon-caret-top"></i><span>{{ fold.tag?'收起':'展开' }}</span>
                            </div>
                        </div>
                        <div class="left-radio hasBorderBottom">
                            <div class="left-title">评级：
                                <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
    						      	<div slot="content">快捷键：<br/>数字键1~5对应1~5级；</div>
    						      	<img src='../../assets/audit_images/wen.png' style="width: 14px" class="tip-question"/>
        						</el-tooltip>
                            </div>
                            <el-radio-group v-model="imgLevel">
                                <div v-for="item in levelOptions" style="margin-bottom:6px;">
                                    <el-radio :label="item.value">{{ item.label }}</el-radio>
                                </div>
    					   </el-radio-group>
                           <div class="demo-block-control" @click="fold.level=(!fold.level)">
                               <i class="el-icon-caret-top"></i><span>{{ fold.level?'收起':'展开' }}</span>
                           </div>
                        </div> -->
                    </div>
                    </el-card>
                </el-col>
                <el-col style="flex:1">
                    <el-card :body-style="{padding:'0px'}">
                        <div class="box_div" id="box_div">
                            <!--此处4个为一行-->
                            <el-row :gutter="10" class="audit_content-box" v-if="newExam!=null">
                                <div v-for='(item,index) in Math.ceil(currentImgs.length/4)' class="clearfix" :key="index">
                                    <el-col :span="6" v-for="i in 4" v-if="currentImgs[(index*4)+i-1]" :key="i" style="margin-bottom:20px;">
                                        <div class="audit_img_item" style="position:relative">
                                            <img :src="currentImgs[(index*4)+i-1].src">
                                            <div class="taobao_price" v-if="newExam.isadv==1">￥{{currentImgs[(index*4)+i-1].taobao.finalprice}}</div>
                                        </div>
                                        <div class="img_txt">{{ currentImgs[(index*4)+i-1].des_img }}</div>
                                        <!--淘宝标题-->
    									<a :href="currentImgs[(index*4)+i-1].taobao.itemurl"
                                            v-if="newExam.isadv==1" target="_blank"
                                            style="text-decoration:underline;color:#20a0ff">
    										<img src="../../../assets/audit_images/taobao.png"
                                                 style="width:20px;vertical-align:middle"
    											 alt="">{{currentImgs[(index*4)+i-1].taobao.itemname}}</a>
                                    </el-col>
                                </div>
                            </el-row>
                            <div  v-if="newExam==null" class="audit_content-box null-data-content">
                                    暂无审核数据
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <!--点击图片显示轮播图-->
        <el-dialog :visible.sync="imgBigBox" top="5%">
            <el-carousel trigger="click" height="500px" :initial-index="nowCarousel" :autoplay="false" v-if="newExam!=null&&imgBigBox">
                <el-carousel-item v-for="(item,index) in newExam.imgs" :key="index">
                    <div style="margin:0 auto;display:flex;align-items:center;justify-content:center;height:100%">
                        <img :src="item.src" alt="" style="width:auto;height:auto;max-width:100%;max-height:100%;display:block;">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
        <el-dialog title="图集审核" :visible.sync="noPassVisible" :close-on-click-modal="false">
			<span>
				<el-form :model="dialog" ref="dialogr">
					<el-form-item label="拒绝原因:" prop="reasonSelect" :rules="[{ required: true, message: '必须选择原因'}]">
						<el-select v-model="dialog.reasonSelect" ref="selectInput" placeholder="请选择拒绝原因" filterable width="100%">
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
				<el-button type="primary" @click="refuse">确 定</el-button>
				<el-button @click="noPassVisible = false">取 消</el-button>
			</span>
		</el-dialog>
    </section>
</template>

<script>
import clip from '@/utils/clipboard'
import {
    imgContentToHtml
} from '@/utils/contentTransform'
import {
    removeDoExamData
} from '@/api/audit'
import {
    examPlatType,
    getPictureInfo,
    imgPassed,
    imgNoPassed,
    UncheckedNum
} from '@/api/audit'

export default {
    data() {
        return {
            auditBegin: true,
            selectAuditType: '',
            selectPlatforms: [],
            unCheckedNum: 0,
            auditType: 'wemedia',
            activeName: ['keywords', 'level'],
            popShow: false,
            imgBigBox: false,
            nowCarousel: 0,
            fold: {
                tag: true,
                level: true
            },
            dataList: [],
            currentImgs: [],
            newExam: null,
            platform: [{
                typePy: 'lieqi',
                typeName: '猎奇'
            }],
            dynamicTags: [

            ],
            levelOptions: [{
                    label: '1级(普通级)',
                    value: 1
                },
                {
                    label: '2级(暴力血腥)',
                    value: 2
                },
                {
                    label: '3级(情色诱惑)',
                    value: 3
                },
                {
                    label: '4级(政治敏感)',
                    value: 4
                },
                {
                    label: '5级(内容低质)',
                    value: 5
                }
            ],
            imgLevel: '',
            selfInterva: '',
            // 分页 每页8张图
            currentPage: 1,
            pageSize: 8,
            pageTotal: 0,
            // 拒审理由
            noPassVisible: false,
            dialog: {
                reasonSelect: ''
            },
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
                            label: '502 标题不完整或内容格式错误（含有特殊符号或句号、含有繁体字等）',
                            value: '502 标题不完整或内容格式错误（含有特殊符号或句号、含有繁体字等）'
                        },
                        {
                            label: '503 标题含错别字',
                            value: '503 标题含错别字'
                        },
                        {
                            label: '504 发布内容标题内容不符',
                            value: '504 发布内容标题内容不符'
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
    mounted() {
        this.getType()
        this.mountedGetData()
    },
    methods: {
        checkedNum(subType) {
            let para = {
                type: this.auditType,
                subType: subType
            }
            UncheckedNum(para).then((res) => {
                if(res.code === '00001'){
                    this.unCheckedNum = res.data
                }
            })
        },
        mountedGetData() {
            this.checkedNum('picture')
            let localData = localStorage.getItem('wemedia_img')
            if (localData && JSON.parse(localData).length <= 9) {
                this.dataList = JSON.parse(localData)
                this.getDataList()
            } else if (localData && JSON.parse(localData).length > 9) {
                this.getLocalData()
            } else {
                this.getDataList()
            }
        },
        // 获取审核分类
        getType() {
            let params = {
                type: 'wemedia/picture',
                parentpy: '1'
            }
            examPlatType(params).then(res => {
                this.platform = res.data
                this.selectPlatforms = res.data.slice();
                this.selectPlatforms.unshift({
                    'typeName': '全部',
                    'typePy': ''
                })
            })
        },
        getDataList(type) {
            let params = {
                type: this.auditType,
                param: {
                    field: this.selectAuditType,
                    size: 5
                }
            }
            if (this.auditBegin) {
                getPictureInfo(params).then(res => {
                    let _this = this
                    if (res.data) {
                        this.dataList = this.dataList.concat(res.data.Beans)
                    }
                    if(this.dataList.length === 0){
                        this.newExam = null
                        this.dynamicTags = []
                        if (type !== 'interval') {
                            if (this.dataList.length === 0) {
                                this.selfInterva = window.setInterval(() => {
                                    _this.getDataList('interval')
                                }, 30000)
                            }
                        }
                    }else{
                        clearInterval(this.selfInterva)
                        this.newExam = this.dataList[0]
                        // 淘宝信息
                        let _this = this;
                        if (_this.newExam.imgitemlist != null && _this.newExam.imgitemlist != '') {
                            this.newExam.imgs.forEach(function(item, index) {
                                item.taobao = _this.newExam.imgitemlist[index];
                            })
                        }
                        imgContentToHtml(this.newExam)
                        // 关键词
                        this.dynamicTags = this.newExam.keywords ? this.newExam.keywords.split(',') : []
                        localStorage.setItem('wemedia_img', JSON.stringify(this.dataList))
                        this.getCurrentImgs()
                    }
                })
            }
        },
        // 给每个图绑定展示轮播图的事件
        getSlide() {
            let _this = this
            let imgsArr = []
            document.querySelectorAll('#box_div img').forEach((item, index) => {
                if (item.src.indexOf('img/taobao') == -1) {
                    imgsArr.push(item)
                }
            })
            imgsArr.forEach((item, index) => {
                item.addEventListener("click", function() {
                    let imgIndex = (_this.currentPage - 1) * _this.pageSize + index
                    _this.nowCarousel = imgIndex
                    _this.imgBigBox = true
                })
            })
        },
        // 获取图片总页数以及当前页图片
        getCurrentImgs() {
            let imgs = this.newExam.imgs
            this.pageTotal = Math.ceil(~~imgs.length / this.pageSize)
            this.currentImgs = imgs.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        },
        // 获取本地数据
        getLocalData() {
            let localData = JSON.parse(localStorage.getItem('wemedia_img'))
            this.dataList = localData
            this.newExam = this.dataList[0]
            this.dynamicTags = this.newExam.keywords ? this.newExam.keywords.split(',') : []
            this.getCurrentImgs()
        },
        pass() {
            if (this.imgLevel === '') {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                })
                return
            }
            let params = {
                type: this.auditType,
                param: {
                    rowkey: this.newExam.rowkey,
                    gradelv: this.imgLevel,
                    mtppy: this.newExam.urlmaintypepy,
                    keyword: this.dynamicTags.join(",")
                }
            }
            this.$confirm('确认审核通过吗?', '提示', {
                type: 'warning'
            }).then(() => {
                imgPassed(params).then((res) => {})
                this.dataList.shift()
                localStorage.setItem('wemedia_img', JSON.stringify(this.dataList))
                this.mountedGetData()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消'
                })
            })
        },
        refuse() {
            this.$refs.dialogr.validate((valid) => {
                if (valid) {
                    let para = {
                        type: this.auditType,
                        param: {
                            rowkey: this.newExam.rowkey,
                            level: this.imgLevel,
                            reason: this.dialog.reasonSelect
                        }
                    };
                    imgNoPassed(para).then((res) => {})
                    this.dataList.shift()
                    localStorage.setItem('wemedia_img', JSON.stringify(this.dataList))
                    this.mountedGetData()
                    this.noPassVisible = false
                }
            })
        },
        // 上下页 -1上 1下
        changePage(type) {
            let imgs = this.newExam.imgs
            switch (type) {
                case -1:
                    if (this.currentPage <= 1) {
                        this.currentPage = 1
                        return
                    }
                    this.currentPage--
                        this.currentImgs = imgs.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
                    break;
                case 1:
                    if (this.currentPage >= this.pageTotal) {
                        this.currentPage = this.pageTotal
                        return
                    }
                    this.currentPage++
                        this.currentImgs = imgs.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
                    break;
            }
        },
        // 权限控制
        getAuth() {
            let authorList = localStorage.getItem('authorList');
            // 通过
            if (authorList.indexOf('wemedia/news/audit-pass') > -1) {
                this.isAuth.imgPassed = true;
            }
            // 拒绝
            if (authorList.indexOf('wemedia/news/audit-refused') > -1) {
                this.isAuth.imgNoPassed = true;
            }
        },
        // 复制URL按钮
        copyContent(text, event) {
            clip(text, event)
        }
    },
    watch: {
        "currentImgs": function() {
            let _this = this
            if (this.newExam != null) {
                this.$nextTick(function() {
                    _this.getSlide()
                    _this.popShow = true
                })
            }
        },
        "noPassVisible": function() {
            var _this = this
            if (!this.noPassVisible) {
                // document.onkeydown = null;
                // this.loadKey()
                setTimeout(function() {
                    _this.$refs.selectInput.blur()
                }, 0)
            } else {
                // 移除键盘事件
                // document.onkeydown = null;
                // document.onkeydown = function(ev){
                //     if(_this.noPassVisible&&ev.keyCode==13){
                //         _this.imgNoPassed();
                //     }
                // }
                setTimeout(function() {
                    _this.$refs.selectInput.focus()
                }, 0)
            }
        }
    },
    destroyed() {
        clearInterval(this.selfInterva)
        localStorage.removeItem("wemedia_img")
        let para = {
            queue: 'wemedia_img'
        };
        removeDoExamData(para).then((res) => {});
    }
}
</script>

<style lang="scss" scoped>
.audit-title {
    font-size: 20px;
    text-align: center;
    margin: 0 10px;
    color: #20a0ff;
    cursor: pointer;
}
.flex_center {
    display: flex;
    align-items: center;
    justify-content: center;
}
.url-next_page {
    position: relative;
    text-align: center;
    padding: 8px 5px;
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
    .next_btn-group {
        position: absolute;
        right: 10px;
        top: 5px;
    }
}
.left-label {
    font-size: 16px;
    padding: 10px 0;
    line-height: 36px;
}
.hasBorderBottom {
    border-bottom: 1px solid #ccc;
    padding: 5px;
    &:last-child {
        border: none;
    }
}
.left-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 6px;
}
.audit_img_item {
    height: 200px;
    display: flex;
    align-items: center;
    background-color: #ccc;
    text-align: center;
    img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        margin: 0 auto;
    }
}
.audit_content-box {
    min-height: 620px;
}
.null-data-content {
    color: #999;
    font-size: 40px;
    text-align: center;
    line-height: 620px;
}
.demo-block-control {
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    color: #d3dce6;
    cursor: pointer;
    transition: 0.2s;
    position: relative;
    &:hover {
        color: #20a0ff;
        background-color: #f9fafc;
    }
}
/**taobao**/
.taobao_price {
    background-color: #999;
    color: #fff;
    position: absolute;
    padding-right: 4px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.taobao_price:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: -9px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid #999;
    border-bottom: 10px solid transparent;
}
.null-keyword{
    padding: 20px 10px 0px;
    font-size: 16px;
    color: #999;
    letter-spacing: 4px;
}
.collapse-title{
    padding: 0px 10px 0 5px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.collapse-content{
    padding: 0 5px
}
</style>
