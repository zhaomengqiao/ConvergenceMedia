<template lang="html">
    <section class="searchAudit">
        <el-card>
            <!--条件选择栏 Begin-->
            <el-form :inline="true" :model="form">
                <el-form-item label="" prop="platform" style="margin-bottom:0">
                    <el-select v-model="form.classify" class="select-platform" filterable placeholder="选择分类">
                        <el-option v-for="(item,index) in classifyOptions" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="platform" style="margin-bottom:0">
                    <el-select v-model="form.type" class="select-platform" filterable placeholder="选择类型">
                        <el-option v-for="(item,index) in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-input type="primary" v-model="form.searchFrom" placeholder="输入来源搜索（选填）"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-input type="primary" v-model="form.searchTitle" placeholder="输入标题搜索（必填）"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button type="primary" @click="getDfwList">查询</el-button>
                </el-form-item>
            </el-form>
            <!--条件选择栏 End-->
        </el-card>
        <el-card class="mt-10">
            <!--表格 Begin-->
            <el-table :data="newExamList" border highlight-current-row v-loading="listLoading" style="width: 100%;margin: 0 auto;">
                <el-table-column label="标题" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
						<span @click='handleDialog(scope.$index, scope.row)' class="hoverTitel">{{newExamList[scope.$index].title}}</span>
					</template>
                </el-table-column>
                <el-table-column label="时间" width="180">
                    <template slot-scope="scope">
						{{setDateTime(newExamList[scope.$index].createtime)}}
					</template>
                </el-table-column>
                <el-table-column prop="urlfrom" label="信源" width="100">
                </el-table-column>
                <el-table-column prop="source" label="来源" width="150">
                </el-table-column>
                <el-table-column prop="urltype" label="类型" width="150">
                    <template slot-scope="scope">
						<el-tag :type="scope.row.urltype | typeColorFilters">{{ newExamList[scope.$index].urltype | typeNameFilters}}</el-tag>
					</template>
                </el-table-column>
                <el-table-column prop="url" label="原始地址" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
						<a @click='handleDialog(scope.$index, scope.row)'>{{newExamList[scope.$index].url}}</a>
					</template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
						<el-button type="success" size="small" v-if="isAuth.newPassed"  @click="newPassed(scope.$index, scope.row)"  >通过</el-button>
						<el-button type="danger" size="small" v-if="isAuth.newNoPassed"  @click="newNoPassed(scope.$index, scope.row)" >拒绝</el-button>
					</template>
                </el-table-column>
            </el-table>
            <!--表格 End-->
        </el-card>
        <!--审核详情框 Begin-->
        <el-dialog title="新闻详情" :fullscreen="true" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <newsSearchExam :large-v="largeV" :new-exam="newExam" @listentPass='childEvent' ref="newExam1" v-if="addFormVisible"></newsSearchExam>
        </el-dialog>
        <el-dialog title="视频详情" :fullscreen="true" :visible.sync="videoFormVisible" :close-on-click-modal="false">
            <videoSearchExam :large-v="largeV" :new-exam="newExam" @listentPass='childEvent' ref="newExam2" v-if="videoFormVisible"></videoSearchExam>
        </el-dialog>
        <el-dialog title="图集详情" :fullscreen="true" :visible.sync="imgFormVisible" :close-on-click-modal="false">
            <imgSearchExam :large-v="largeV" :new-exam="newExam" @listentPass='childEvent' ref="newExam3" v-if="imgFormVisible"></imgSearchExam>
        </el-dialog>
        <!--审核详情框 End-->
        <!--拒绝原因框-->
        <el-dialog title="拒绝原因" v-model="noPassVisible" size="tiny" top='20%' :close-on-click-modal="false">
            <span>
    				<el-form  :model="dialog" ref="dialogr">
    					<el-form-item label="拒绝原因:">
    						<el-select v-model="dialog.reasonSelect" placeholder="请选择拒绝原因"  @change='setReason' >
    							<el-option value="文章内容或图片涉敏感" ></el-option>
    							<el-option value="文章内容或图片涉低俗" ></el-option>
    							<el-option value="文章没有可读性" ></el-option>
    							<el-option value="封面或者正文图片含水印"></el-option>
    							<el-option value="封面或正文用户不适图片"></el-option>
    							<el-option value="标题存在错误" ></el-option>
    							<el-option value="文章分类不合理" ></el-option>
    							<el-option value="文章内容混乱" ></el-option>
    							<el-option value="文章缺乏新闻属性" ></el-option>
    						</el-select>
    					</el-form-item>
    					<el-form-item prop="reason":rules="[{ required: true, message: '必须输入原因'}]">
    						<el-input  v-model="dialog.reason" placeholder="请输入原因" ></el-input>
    					 </el-form-item>
    				</el-form>
    			</span>
            <span slot="footer" class="dialog-footer">
    				<el-button type="primary" @click="noPassedClick">确 定</el-button>
    				<el-button @click="noPassVisible = false">取 消</el-button>
    			</span>
        </el-dialog>
    </section>
</template>

<script>
import {
    parseTime,
} from '@/utils'
import { contentToHtml } from '@/utils/contentTransform'
import {
    searchExamVerification,
    searchExamPass,
    searchExamNoPass,
    searchExamDetail,
    searchExam,
    getNewExam,
    newPassed,
    newNoPassed
} from '@/api/audit'
import newsSearchExam from './newsSearchExam.vue'
import videoSearchExam from './videoSearchExam.vue'
import imgSearchExam from './imgSearchExam.vue'
export default {
    filters: {
        typeNameFilters(val) {
            var arr = [{
                    name: "新闻",
                    type: "primary"
                },
                {
                    name: "视频",
                    type: "gray"
                },
                {
                    name: "图集",
                    type: "success"
                }
            ];
            return arr[val].name
        },
        typeColorFilters(val) {
            var arr = [{
                    name: "新闻",
                    type: "primary"
                },
                {
                    name: "视频",
                    type: "gray"
                },
                {
                    name: "图集",
                    type: "success"
                }
            ];
            return arr[val].type
        }
    },
    data() {
        return {
            largeV: '',
            noPassVisible: false,
            dialog: {
                reasonSelect: '',
                reason: ''
            },
            tableData: [

            ],
            // 分类下拉选项
            classifyOptions: [{
                    label: "娱乐",
                    value: "yule"
                },
                {
                    label: "社会",
                    value: "shehui"
                },
                {
                    label: "财经",
                    value: "caijing"
                },
                {
                    label: "军事",
                    value: "junshi"
                },
                {
                    label: "体育",
                    value: "tiyu"
                },
                {
                    label: "游戏",
                    value: "youxi"
                },
                {
                    label: "科技",
                    value: "keji"
                },
                {
                    label: "国内",
                    value: "guonei"
                },
                {
                    label: "国际",
                    value: "guoji"
                },
                {
                    label: "汽车",
                    value: "qiche"
                },
                {
                    label: "教育",
                    value: "jiaoyu"
                },
                {
                    label: "房产",
                    value: "fangchan"
                },
                {
                    label: "时尚",
                    value: "shishang"
                },
                {
                    label: "笑话",
                    value: "xiaohua"
                },
                {
                    label: "人文",
                    value: "renwen"
                },
                {
                    label: "健康",
                    value: "jiankang"
                },
                {
                    label: "星座",
                    value: "xingzuo"
                },
                {
                    label: "家居",
                    value: "jiaju"
                },
                {
                    label: "情感",
                    value: "qinggan"
                },
                {
                    label: "旅游",
                    value: "lvyou"
                },
                {
                    label: "育儿",
                    value: "yuer"
                },
                {
                    label: "动漫",
                    value: "dongman"
                },
                {
                    label: "宠物",
                    value: "chongwu"
                }
            ],
            // 类型下拉选项
            typeOptions: [{
                    label: "新闻",
                    value: 0
                },
                {
                    label: "视频",
                    value: 1
                },
                {
                    label: "图集",
                    value: 2
                }
            ],
            platform: [],
            form: {
                searchFrom: '',
                searchTitle: '',
                classify: '',
                type: '',
            },
            newExam: [],
            newExamList: [],
            isAuth: {
                newPassed: true,
                newNoPassed: true
            },
            filters: {
                name: '',
                isblack: 0,
            },
            addFormVisible: false, //详情界面是否显示
            videoFormVisible: false,
            imgFormVisible: false,
            addLoading: false,
            keyList: [],
            newsType: 'eastday',
            listLoading: false,
            total: 0,
            pageSize: 10,
            newsSize: 10,
            page: 1,
            sels: [],
            activeName: '1' //父元素选项卡
        }
    },
    components: {
        newsSearchExam,
        videoSearchExam,
        imgSearchExam
    },
    mounted() {
        //this.getAuth();
        //this.getDfwList();
    },
    watch: {
        '$route.path': function() {
            this.addFormVisible = false //详情界面是否显示
            this.videoFormVisible = false
            this.imgFormVisible = false
            this.addLoading = false
        }
    },
    methods: {
        // getAuth(){//权限控制
        // 	let authorList=localStorage.getItem('authorList');
        // 	if(authorList.indexOf('eastday/news/audit-refused')>-1){
        // 		this.isAuth.newNoPassed=true;
        // 	}
        // 	if(authorList.indexOf('eastday/news/audit-pass')>-1){
        // 		this.isAuth.newPassed=true;
        // 	}
        //
        // },
        // 选择原因后自动填补
        setReason() {
            this.dialog.reason = this.dialog.reasonSelect;
        },
        // 格式化时间
        setDateTime(oldTime) {
            var newTime = new Date(oldTime)
            return parseTime(newTime, '{y}-{m}-{d} {h}:{i}:{s}')
        },
        // 搜索审核列表
        getDfwList() {
            if (this.form.searchTitle == '') {
                this.$message({
                    message: '请输入标题',
                    type: 'warning'
                });
                return false
            }
            let para = {
                title: this.form.searchTitle,
                source: this.form.searchFrom,
                urltype: this.form.type,
                maintype: this.form.classify
            };
            this.listLoading = true;
            searchExam(para).then((res) => {
                if (res.data != null) {
                    this.newExamList = res.data;
                }
                this.listLoading = false;
            });
        },
        //dongfanghao 拒绝时需提供拒绝原因
        noPassedClick() {
            this.noPassVisible = false;
            let para = {
                rowkey: this.newExam.rowkey,
                reason: this.dialog.reason,
                urltype: 1,
                urlfrom: this.newExam.urlfrom,
                mtppy: this.newExam.urlmaintypepy,
                largeV: this.newExam.islargev
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
                    this.newExamList.splice(this.newExam.index, 1);
                    if (this.newExamList.length < 1) {
                        this.getDfwList();
                    }
                    this.$message({
                        type: 'success',
                        message: '拒绝成功'
                    });
                });
                this.listLoading = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消'
                });
            });
        },
        // 拒绝
        newNoPassed(index, row) {
            this.newExam.rowkey = row.rowkey;
            this.newExam.urlfrom = row.urlfrom;
            this.newExam.urltype = row.urltype;
            this.newExam.index = index;
            this.newExam.islargev = row.islargev;
            /**校检
             * 返回的code为 01067 的时候，提示 数据已存在审核队列中，是否继续审核？
             * 用户选择是否继续，继续就调审核接口，取消就取消
             */
            var params = {
                urltype: row.urltype,
                urlfrom: row.urlfrom,
                rowkey: row.rowkey,
                mtppy: row.mtppy,
                largeV: row.islargev
            }
            searchExamVerification(params).then((res) => {
                if (res.code == "00001") {
                    // 获取详情----------------------
                    let para = {
                        rowkey: row.rowkey,
                        urltype: row.urltype
                    }
                    searchExamDetail(para).then((res) => {
                        let msg = res.ret;
                        if (res.code == "00001") {
                            var data;
                            switch (row.urltype) {
                                case 0:
                                    data = res.data[0];
                                    this.newExam = data;
                                    break;
                                case 1:
                                    data = res.data;
                                    this.newExam = data;
                                    break;
                                case 2:
                                    data = res.data;
                                    this.newExam = data;
                                    break;
                            }
                        }
                    })
                    let param = {
                        rowkey: row.rowkey,
                        reason: 1,
                        urltype: 1,
                        urlfrom: row.urlfrom,
                        mtppy: this.newExam.urlmaintypepy,
                        largeV: row.islargev
                    }
                    switch (row.urltype) {
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
                    if (row.urlfrom == "dongfanghao") {
                        this.noPassVisible = true;
                    } else {
                        this.$confirm('确认审核拒绝吗?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.listLoading = true;
                            searchExamNoPass(param).then((res) => {
                                this.newExamList.splice(index, 1);
                                if (this.newExamList.length < 1) {
                                    this.getDfwList();
                                }
                                this.$message({
                                    type: 'success',
                                    message: '拒绝成功'
                                });
                            });
                            this.listLoading = false;
                        }).catch(() => {
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
                        // 获取详情----------------------
                        let para = {
                            rowkey: row.rowkey,
                            urltype: row.urltype
                        }
                        searchExamDetail(para).then((res) => {
                            let msg = res.ret;
                            if (res.code == "00001") {
                                var data;
                                switch (row.urltype) {
                                    case 0:
                                        data = res.data[0];
                                        this.newExam = data;
                                        break;
                                    case 1:
                                        data = res.data;
                                        this.newExam = data;
                                        break;
                                    case 2:
                                        data = res.data;
                                        this.newExam = data;
                                        break;
                                }
                            }
                        })
                        let param = {
                            rowkey: row.rowkey,
                            reason: 1,
                            urltype: 1,
                            urlfrom: row.urlfrom,
                            mtppy: this.newExam.urlmaintypepy,
                            largeV: row.islargev
                        }
                        switch (row.urltype) {
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
                        if (row.urlfrom == "dongfanghao") {
                            this.noPassVisible = true;
                        } else {
                            this.$confirm('确认审核拒绝吗?', '提示', {
                                type: 'warning'
                            }).then(() => {
                                this.listLoading = true;
                                searchExamNoPass(param).then((res) => {
                                    this.newExamList.splice(index, 1);
                                    if (this.newExamList.length < 1) {
                                        this.getDfwList();
                                    }
                                    this.$message({
                                        type: 'success',
                                        message: '拒绝成功'
                                    });
                                });
                                this.listLoading = false;
                            }).catch(() => {
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
        //通过
        newPassed(index, row) {
            //校检
            var params = {
                urltype: row.urltype,
                urlfrom: row.urlfrom,
                rowkey: row.rowkey,
                mtppy: row.mtppy,
                largeV: row.islargev
            }
            searchExamVerification(params).then((res) => {
                if (res.code == "00001") {
                    let para = {
                        rowkey: row.rowkey,
                        urltype: row.urltype
                    }
                    // 查询该条信息详情
                    searchExamDetail(para).then((res) => {
                        let msg = res.ret;
                        if (res.code == "00001") {
                            var data;
                            var params = {};
                            switch (row.urltype) {
                                case 0:
                                    data = res.data[0];
                                    this.newExam = data;
                                    params = {
                                        urlfrom: row.urlfrom,
                                        urltype: 0,
                                        rowkey: this.newExam.rowkey,
                                        gradelv: 1,
                                        mtppy: this.newExam.urlmaintypepy,
                                        largeV: row.islargev
                                    }
                                    break;
                                case 1:
                                    data = res.data;
                                    this.newExam = data;
                                    params = {
                                        urlfrom: row.urlfrom,
                                        urltype: 1,
                                        rowkey: this.newExam.rowkey,
                                        gradelv: 1,
                                        keyword: this.newExam.keywords,
                                        videodescribe: this.newExam.content,
                                        newtitle: this.newExam.contenttitle,
                                        tp1st: this.newExam.urlmaintypeid,
                                        tp2nd: this.newExam.tp2nd,
                                        tp3rd: this.newExam.tp3rd,
                                        coverpic: this.coverpic,
                                        mtppy: this.newExam.urlmaintypepy,
                                        largeV: row.islargev
                                    }
                                    break;
                                case 2:
                                    data = res.data;
                                    this.newExam = data;
                                    params = {
                                        urlfrom: row.urlfrom,
                                        urltype: 2,
                                        rowkey: this.newExam.rowkey,
                                        gradelv: 1,
                                        pkey: this.newExam.keywords,
                                        contenttitle: this.newExam.contenttitle,
                                        mtppy: this.newExam.urlmaintypepy,
                                        largeV: row.islargev
                                    };
                                    break;
                            }
                            this.$confirm('确认审核通过吗?', '提示', {
                                type: 'warning'
                            }).then(() => {
                                this.listLoading = true;
                                searchExamPass(params).then((res) => {
                                    this.newExamList.splice(index, 1);
                                    if (this.newExamList.length < 1) {
                                        this.getDfwList();
                                    }
                                    this.$message({
                                        type: 'success',
                                        message: '成功'
                                    });
                                });

                                this.listLoading = false;
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '取消'
                                });
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: msg
                            });
                        }
                    })
                } else if (res.code == "01067") {
                    this.$confirm('数据已存在审核队列中，是否继续审核?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let para = {
                            rowkey: row.rowkey,
                            urltype: row.urltype
                        }
                        // 查询该条信息详情
                        searchExamDetail(para).then((res) => {
                            let msg = res.ret;
                            if (res.code == "00001") {
                                var data;
                                var params = {};
                                switch (row.urltype) {
                                    case 0:
                                        data = res.data[0];
                                        this.newExam = data;
                                        params = {
                                            urlfrom: row.urlfrom,
                                            urltype: 0,
                                            rowkey: this.newExam.rowkey,
                                            gradelv: 1,
                                            mtppy: this.newExam.urlmaintypepy,
                                            largeV: row.islargev
                                        }
                                        break;
                                    case 1:
                                        data = res.data;
                                        this.newExam = data;
                                        params = {
                                            urlfrom: row.urlfrom,
                                            urltype: 1,
                                            rowkey: this.newExam.rowkey,
                                            gradelv: 1,
                                            keyword: this.newExam.keywords,
                                            videodescribe: this.newExam.content,
                                            newtitle: this.newExam.contenttitle,
                                            tp1st: this.newExam.urlmaintypeid,
                                            tp2nd: this.newExam.tp2nd,
                                            tp3rd: this.newExam.tp3rd,
                                            coverpic: this.coverpic,
                                            mtppy: this.newExam.urlmaintypepy,
                                            largeV: row.islargev
                                        }
                                        break;
                                    case 2:
                                        data = res.data;
                                        this.newExam = data;
                                        params = {
                                            urlfrom: row.urlfrom,
                                            urltype: 2,
                                            rowkey: this.newExam.rowkey,
                                            gradelv: 1,
                                            pkey: this.newExam.keywords,
                                            contenttitle: this.newExam.contenttitle,
                                            mtppy: this.newExam.urlmaintypepy,
                                            largeV: row.islargev
                                        };
                                        break;
                                }
                                this.$confirm('确认审核通过吗?', '提示', {
                                    type: 'warning'
                                }).then(() => {
                                    this.listLoading = true;
                                    searchExamPass(params).then((res) => {
                                        this.newExamList.splice(index, 1);
                                        if (this.newExamList.length < 1) {
                                            this.getDfwList();
                                        }
                                        this.$message({
                                            type: 'success',
                                            message: '成功'
                                        });
                                    });

                                    this.listLoading = false;
                                }).catch(() => {
                                    this.$message({
                                        type: 'info',
                                        message: '取消'
                                    });
                                });
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: msg
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消'
                        });
                    });
                }
            });

        },
        handleDialog(index, row) {
            let para = {
                rowkey: row.rowkey,
                urltype: row.urltype
            }
            this.largeV = row.islargev
            searchExamDetail(para).then((res) => {
                let msg = res.ret;
                if (res.code == "00001") {
                    var data;
                    switch (row.urltype) {
                        case 0:
                            data = res.data[0];
                            this.newExam = data;
                            this.newExam.urlfrom = row.urlfrom
                            this.newExam.islargev = row.islargev
                            this.newExam.content = contentToHtml(this.newExam)
                            this.addFormVisible = true;
                            break;
                        case 1:
                            data = res.data;
                            this.newExam = data;
                            this.newExam.urlfrom = row.urlfrom
                            this.newExam.islargev = row.islargev
                            this.videoFormVisible = true;
                            break;
                        case 2:
                            data = res.data;
                            this.newExam = data;
                            this.newExam.urlfrom = row.urlfrom
                            this.newExam.islargev = row.islargev
                            this.imgFormVisible = true;
                            break;
                    }
                }
            })


        },
        childEvent(data) {
            this.addFormVisible = false;
            this.videoFormVisible = false;
            this.imgFormVisible = false;
            this.getDfwList();
        },
        batchRemove(index) { //批量更改
            if (index == 0) {
                if (!this.isAuth.newPassed) {
                    return;
                }
            } else {
                if (!this.isAuth.newNoPassed) {
                    return;
                }
            }
            var ids = this.sels.map(item => item.rowkey).toString();
            this.$confirm('确认更改选中记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {
                    type: this.newsType,
                    param: {
                        rowkey: ids,
                        gravelv: 1
                    }
                };
                if (index == 0) {
                    newPassed(para).then((res) => {
                        this.getDfwList();
                        this.listLoading = false;
                    });
                } else {
                    para.param.gravelv = 2;
                    newNoPassed(para).then((res) => {
                        this.getDfwList();
                        this.listLoading = false;
                    });
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
    }
}
</script>

<style scoped>
.jdz {
    width: 50px;
}

.hoverTitel:hover {
    cursor: pointer;
    color: #0000ee;
}
.searchAudit{
    padding: 20px;
}
</style>
