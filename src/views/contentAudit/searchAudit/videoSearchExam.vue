<template>
<section v-loading="listLoading">
    <!--新媒体视频工具条-->
    <el-row :gutter="10" style="margin: 0 auto;" v-loading="listLoading">
        <el-col :xs="13" :sm="14" :md="16" :lg="18">
            <el-row :gutter="20">
                <el-col :span="24" style="padding-bottom: 10px;">
                    <div class="news_title">{{newExam.contenttitle}}</div>
                </el-col>
                <el-col :span="24">
                    <div class='box_div'>
                        <el-col :xs="11" :sm="12" :md="14" :lg="15" class="grid-content bg-purple">
                            <el-row :gutter="10">
                                <el-col :span="8" v-for='(item,index) in newExam.cmsphoto' class="setVideo" :key="index">
                                    <img :src="item.src" style="width: 100%;" />
                                </el-col>
                                <el-col :span="8" v-for='i in 12' v-if='newExam.cmsphoto==null' class="setVideo" :key="i">
                                    <svg-icon icon-class="noImage" class-name="card-panel-icon" />
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :xs="13" :sm="12" :md="10" :lg="9" class="bg-purple video-play">
                            <video-player :options="playerOptions" ref="videoPlayer"></video-player>
                            <el-col :span="24" style="padding-bottom: 10px;">
                                <el-form :inline="true" label-position="left" label-width="85px">
                                    <el-form-item label="标签：" style='width: 100%;'>
                                        <el-row :gutter="20">
                                            <el-col :span="8" style="padding: 5px;">
                                                <el-input v-model="videoTag[0]"></el-input>
                                            </el-col>
                                            <el-col :span="8" style="padding: 5px;">
                                                <el-input v-model="videoTag[1]"></el-input>
                                            </el-col>
                                            <el-col :span="8" style="padding: 5px;">
                                                <el-input v-model="videoTag[2]"></el-input>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="20">
                                            <el-col :span="8" style="padding: 5px;">
                                                <el-input v-model="videoTag[3]"></el-input>
                                            </el-col>
                                            <el-col :span="8" style="padding: 5px;">
                                                <el-input v-model="videoTag[4]"></el-input>
                                            </el-col>
                                            <el-col :span="8" style="padding: 5px;">
                                                <el-input v-model="videoTag[5]"></el-input>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item label="视频简介：">
                                        <el-row :gutter="20">
                                            <el-col :span="24" style="padding: 5px;">
                                                <el-input class="v_textarea" type="textarea" :maxlength='200' :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入简介内容" v-model="newExam.content">
                                                </el-input>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-col>

                    </div>
                </el-col>
            </el-row>
            <!--工具条-->
            <!---->
        </el-col>
        <el-col :xs="11" :sm="10" :md="8" :lg="6">
            <el-col :span="24">
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
                        <el-select :disabled="true" v-model="newExam.urlmaintypeid" placeholder="请选择" @change="getVideoType(newExam.urlmaintypeid,2)">
                            <el-option v-for="item in firpy" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                            </el-option>
                        </el-select>
                        <el-select :disabled="true" v-model="newExam.tp2nd" placeholder="请选择" @change="getVideoType(videoInfo.tp2nd,3)">
                            <el-option v-for="item in secpy" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                            </el-option>
                        </el-select>
                        <el-select :disabled="true" v-model="newExam.tp3rd" placeholder="请选择">
                            <el-option v-for="item in thipy" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24">评级：
                <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                    <div slot="content">快捷键：<br/>数字键1~5对应1~5级；</div>
                    <img src='../../../assets/audit_images/wen.png' style="width: 18px" class="tip-question" />
                </el-tooltip>
            </el-col>
            <el-col :span="24" style="padding-top: 10px;">
                <el-radio-group v-model="radiopj" label="新闻评级">
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
            <el-col :span="24" style='margin-top: 15px;' v-if="!noPassVisible">
                <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                    <div slot="content">快捷键：shift+\</div>
                    <el-button type="danger" size="small" icon="circle-cross" @click="videoNoPassed">拒绝</el-button>
                </el-tooltip>
                <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                    <div slot="content">快捷键：shift+回车</div>
                    <el-button type="primary" size="small" icon="circle-check" @click="videoPassed">通过</el-button>
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
        </el-col>
    </el-row>
</section>
</template>

<script>
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import {
    searchExamVerification,
    searchExamPass,
    searchExamNoPass,
    getVideoInfo,
    getVideoById,
    videoPassed,
    videoNoPassed,
    getVideoType
} from '@/api/audit';

export default {
    props: [
        'newExam',
        'largeV'
    ],
    components: {
        videoPlayer
    },
    data: function() {
        return {
            noPassVisible: false,
            dialog: {
                reasonSelect: '',
                reason: ''
            },
            newVideoList: [],
            newVideoListNum: 0,
            isAuth: {
                videoNoPassed: false,
                videoPassed: false
            },
            videoInterva: '',
            videoUrl: "",
            playerOptions: {
                height: '250',
                width: '400',
                autoplay: false,
                language: 'zh-CN',
                controls: true, //播放控制条是否显示
                preload: true, //是否预加载
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    // mp4
                    src: ""
                }]
            },
            videoInfo: '',
            radiopj: 0,
            videoTag: [],
            videoType: 'wemedia',
            coverpic: '',
            firpy: [],
            secpy: [],
            thipy: [],
            listLoading: false
        }
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player;
        }
    },
    mounted() {
        this.playerOptions.sources[0].src = ''
        this.playerOptions.sources[0].src = this.newExam.videominia[0].src
        this.getVideoType('-1', 1);
        this.loadKey();
    },
    methods: {
        setReason() {
            this.dialog.reason = this.dialog.reasonSelect;
        },
        loadKey() {
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
                } else if (ev.shiftKey == 1 && ev.keyCode == 13) {
                    _that.videoPassed();
                } else if (ev.shiftKey == 1 && ev.keyCode == 220) {
                    _that.videoNoPassed();
                }
            };
            this.videoInterva = window.setInterval(this.getInterva, 30000);
        },
        getVideoType(pid, level) {
            let para = {
                type: this.videoType,
                pid: pid,
                tlevel: level == 1 ? 1 : 0
            };
            if (pid == '') {
                return;
            }
            getVideoType(para).then((res) => {
                if (level == 1) {
                    this.firpy = res.data;
                } else if (level == 2) {
                    this.secpy = res.data;
                    this.thipy = [];
                    let tp2nd = this.secpy.find((value) => {
                        if (this.videoInfo.tp2nd != null && this.videoInfo.tp2nd != '' && value.typeName.indexOf(this.videoInfo.tp2nd) != -1) {
                            return true;
                        }
                        return value.typeName.indexOf('其他') != -1;
                    });
                    if (tp2nd == undefined) {
                        this.videoInfo.tp2nd = '';
                        this.videoInfo.tp3rd = '';
                    } else {
                        this.videoInfo.tp2nd = tp2nd.typeId;
                        this.videoInfo.tp3rd = '';
                    }
                } else {
                    this.thipy = res.data;
                    let tp3rd = this.thipy.find((value) => {
                        if (this.videoInfo.tp3rd != null && this.videoInfo.tp3rd != '' && value.typeName.indexOf(this.videoInfo.tp3rd) != -1) {
                            return true;
                        }
                        return value.typeName.indexOf('其他') != -1;
                    });

                    if (tp3rd == undefined) {
                        this.videoInfo.tp3rd = '';
                    } else {
                        this.videoInfo.tp3rd = tp3rd.typeId;
                    }
                }
            });
        },
        loadSrorage() {
            let myPlayer = this.$refs.videoPlayer.player;
            this.newVideoList.shift();
            this.newVideoListNum = this.newVideoList.length;
            if (this.newVideoListNum > 0) {
                this.videoInfo = this.newVideoList[0];
                this.playerOptions.sources[0].src = ''
                this.playerOptions.sources[0].src = this.videoInfo.videominia[0].src;
                // 设置封面
                myPlayer.poster(this.videoInfo.cmsphoto[0].src);
                this.videoTag = this.videoInfo.tags ? this.videoInfo.tags.split(',') : []

            } else {
                this.videoInfo = [];
                this.playerOptions.sources[0].src = '';
                myPlayer.poster('');
            }
            this.radiopj = 0;
            localStorage.setItem('wemedia_video', JSON.stringify(this.newVideoList));
        },
        setImgCover(pic) {
            this.coverpic = pic;
            this.$notify({
                title: '成功',
                message: '设置封面成功',
                type: 'success'
            });
        },
        //dongfanghao
        noPassedClick() {
            this.noPassVisible = false;
            let para = {
                rowkey: this.newExam.rowkey,
                reason: this.dialog.reason,
                urltype: 1,
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
        videoNoPassed() {
            //校检
            var params = {
                urltype: 1,
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
                        urltype: 1,
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
                            urltype: 1,
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
        videoPassed() {
            if (this.radiopj == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择评级'
                });
                return;
            }
            //校检
            var params = {
                urltype: 1,
                urlfrom: this.newExam.urlfrom,
                rowkey: this.newExam.rowkey,
                mtppy: this.newExam.urlmaintypepy,
                largeV: this.largeV
            }
            searchExamVerification(params).then((res) => {
                if (res.code == "00001") {
                    let para = {
                        urlfrom: this.newExam.urlfrom,
                        urltype: 1,
                        rowkey: this.newExam.rowkey,
                        gradelv: this.radiopj,
                        keyword: this.newExam.keywords,
                        videodescribe: this.newExam.content,
                        newtitle: this.newExam.contenttitle,
                        tp1st: this.newExam.urlmaintypeid,
                        tp2nd: this.newExam.tp2nd,
                        tp3rd: this.newExam.tp3rd,
                        coverpic: this.coverpic,
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
                            urltype: 1,
                            rowkey: this.newExam.rowkey,
                            gradelv: this.radiopj,
                            keyword: this.newExam.keywords,
                            videodescribe: this.newExam.content,
                            newtitle: this.newExam.contenttitle,
                            tp1st: this.newExam.urlmaintypeid,
                            tp2nd: this.newExam.tp2nd,
                            tp3rd: this.newExam.tp3rd,
                            coverpic: this.coverpic,
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
    }
}
</script>

<style scoped>
.box_div {
    width: 100%;
    padding: 10px 10px;
    box-sizing: border-box;
    overflow: hidden;
}

.setVideo {
    position: relative;
    cursor: pointer;
}

.setVideo .setCover {
    width: 96%;
    height: 99%;
    margin-left: 2%;
    margin-bottom: 1%;
    background: rgba(0, 0, 0, 0.45);
    position: absolute;
    box-sizing: border-box;
    bottom: 0px;
    left: 0px;
    display: none;
    font-size: 18px;
    font-weight: bold;
    color: white;
    text-align: center;
    line-height: 150px;
}

.setVideo:hover .setCover {
    width: 96%;
    height: 99%;
    margin-left: 2%;
    margin-bottom: 1%;
    background: rgba(0, 0, 0, 0.45);
    position: absolute;
    box-sizing: border-box;
    bottom: 0px;
    left: 0px;
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: white;
    text-align: center;
    line-height: 150px;
}

@media screen and (max-width:1366px) {
    .list-group {
        display: none;
    }
    .v_textarea {
        width: 200px;
    }
    .box_img {
        height: 120px;
        padding: 5px;
    }
}

@media screen and (min-width:1367px) {
    .list-group {
        display: block;
    }
    .v_textarea {
        width: 320px;
    }
    .box_img {
        height: 140px;
        padding: 5px;
    }
}

.grid-content {}

.list-group {
    height: 200px;
    margin-bottom: 10px;
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
}
</style>
