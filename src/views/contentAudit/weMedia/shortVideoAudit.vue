<template lang="html">
    <section class="short_video_audit">
        <el-card :body-style="{padding:'10px 20px'}">
            <el-row :gutter="4">
                <el-col :span="4">
                    <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                        <div slot="content">快捷键：shift+回车</div>
                        <el-button type="primary" size="small" icon="circle-check" @click="pass">通过</el-button>
                    </el-tooltip>
                    <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
                        <div slot="content">快捷键：shift+\</div>
                        <el-button type="danger" size="small" icon="circle-cross" @click="refuse">拒绝</el-button>
                    </el-tooltip>
                </el-col>
                <el-col :span="20" class="flex_center" v-if="newExam.contenttitle">
                    <!-- <el-tag type="danger">境外</el-tag> -->
                    <span class="audit-title">{{ newExam.contenttitle }}</span>
                    <el-button type="primary" size="mini" @click="copyContent(newExam.contenttitle,$event)">复制</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top:10px" :body-style="{padding:'10px 10px 10px 10px'}">
            <el-row :gutter="20" type="flex">
                <el-col :span="4" justify="space-between">
                    <el-card :body-style="{padding:'10px'}">
                        <div class="left-label hasBorderBottom">
                            <span class="title" style="font-weight:700">当前待审：</span>
                            <span class="audit-num" style="color:#ff4949;font-weight:700">{{ unCheckedNum }}</span>
                        </div>
                        <div class="left-radio hasBorderBottom mt-10">
                            <div class="left-title">评级：
                                <el-tooltip class="item tooltip-key" effect="dark" placement="bottom">
    						      	<div slot="content">快捷键：<br/>数字键1~5对应1~5级；</div>
    						      	<img src='../../../assets/audit_images/wen.png' style="width: 14px" class="tip-question"/>
        						</el-tooltip>
                            </div>
                            <el-radio-group v-model="videoLevel">
                                <div v-for="(item,index) in levelOptions" :key="index" style="margin-bottom:6px;">
                                    <el-radio :label="item.value">{{ item.label }}</el-radio>
                                </div>
    					   </el-radio-group>
                        </div>
                    </div>
                    </el-card>
                </el-col>
                <el-col style="width:380px;padding:0 20px;">
                    <el-card :body-style="{padding:'0px'}">
                        <video-player :options="playerOptions" ref="videoPlayer" v-if="playerOptions.sources[0].src!==''"></video-player>
                        <div class="null-short-video" v-if="playerOptions.sources[0].src===''">
                            暂无视频
                        </div>
                    </el-card>
                </el-col>
                <el-col style="flex:1">
                    <el-card :body-style="{padding:'10px'}">
                        <div class="flex_box">
                            <div class="flex_title">标签：</div>
                            <div class="flex_content">
                                <el-tag v-for="(item,index) in newExam.keywords" :key="index" v-if="newExam.keywords.length!==0"
                                        style="margin:0 10px 10px 0">{{ item }}</el-tag>
                                <span v-if="newExam.keywords.length===0">暂无关键词</span>
                            </div>
                        </div>
                        <div class="flex_box">
                            <div class="flex_title">视频封面：</div>
                            <div class="flex_content">
                                <div class="img_cover" v-if="newExam.videoCover!==''">
                                    <img :src="newExam.videoCover" alt="" style="width:168.5px;height:300px">
                                </div>
                                <div class="img_null" v-if="newExam.videoCover===''">
                                    暂无封面
                                </div>
                            </div>
                        </div>
                        <div class="flex_box">
                            <div class="flex_title">视频简介：</div>
                            <div class="flex_content">
                                <el-input
                                    type="textarea"
                                    :rows="4"
                                    :disabled="true"
                                    placeholder="请输入视频简介"
                                    v-model="newExam.infor">
                                </el-input>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import clip from '@/utils/clipboard'
import {
    videoPlayer
} from 'vue-video-player'
import {
    getShortVideoAuditList,
    passShortVideo,
    refuseShortVideo,
    getShortVideoNum,
    removeExamData
} from '@/api/audit'

export default {
    components: {
        videoPlayer
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    mounted() {
        // 如果本地缓存没有，调取接口
        var localVideo = localStorage.getItem('short_video')
        if (localVideo && JSON.parse(localVideo).length!=0) {
            this.dataList = JSON.parse(localVideo)
            this.getVideoDetail()
        } else {
            this.getAuditList()
        }
        this.loadKey()
        this.getShortVideoNum()
    },
    destroyed() {
        clearInterval(this.videoInterva)
        localStorage.removeItem("short_video")
        let para = {
            queue: 'usershortvideo'
        };
        removeExamData(para).then((res) => {});
    },
    data() {
        return {
            dataList: [],
            playerOptions: {
                height: '600',
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
            fold: {
                tag: true,
                level: true
            },
            newExam: {
                contenttitle: '',
                keywords: [],
                videoCover: '',
                videoInfor: '',
                rowkey: ''
            },
            platform: [{
                typePy: 'lieqi',
                typeName: '猎奇'
            }],
            unCheckedNum: 0,
            levelOptions: [{
                    label: '1级(纯新闻)',
                    value: 1
                },
                {
                    label: '2级(非新闻)',
                    value: 2
                },
                {
                    label: '3级(血腥暴力)',
                    value: 3
                },
                {
                    label: '4级(诱惑图片)',
                    value: 4
                },
                {
                    label: '5级(猎奇野史)',
                    value: 5
                }
            ],
            videoLevel: 1,
            videoInterva: ''
        }
    },
    methods: {
        getShortVideoNum(){
            getShortVideoNum().then(res => {
                this.unCheckedNum = res.data
            })
        },
        getAuditList() {
            let params = {
                size: 5
            }
            getShortVideoAuditList(params).then(res => {
                if (res.code === '00001') {
                    this.dataList = res.data.Beans
                    this.getVideoDetail()
                    localStorage.setItem('short_video', JSON.stringify(this.dataList))
                }else{
                    this.dataList = []
                    this.getVideoDetail()
                }
            })
        },
        getVideoDetail() {
            if (this.dataList.length != 0) {
                clearInterval(this.videoInterva)
                this.newExam.contenttitle = this.dataList[0].title
                this.newExam.keywords = this.dataList[0].lable01.split(',')
                this.newExam.videoCover = JSON.parse(this.dataList[0].imgjs)[0].src
                this.playerOptions.sources[0].src = JSON.parse(this.dataList[0].videojs)[0].src
                this.playerOptions.poster = JSON.parse(this.dataList[0].imgjs)[0].src
                try {
                    let myPlayer = this.$refs.videoPlayer.player;
                    myPlayer.poster(JSON.parse(this.dataList[0].imgjs)[0].src);
                } catch (e) {
                    console.log(e)
                }
                this.newExam.videoCover = JSON.parse(this.dataList[0].imgjs)[0].src
                this.newExam.rowkey = this.dataList[0].rowkey

            } else {
                clearInterval(this.videoInterva)
                this.newExam.contenttitle = ''
                this.newExam.keywords = []
                this.newExam.videoCover = ''
                this.playerOptions.sources[0].src = ''
                this.playerOptions.poster = ''
                this.newExam.videoCover = ''
                this.newExam.rowkey = ''
                this.getInterva()
            }
        },
        // 通过/拒绝获取视频
        getData() {
            this.newExam.contenttitle = ''
            this.newExam.keywords = []
            this.newExam.videoCover = ''
            this.playerOptions.sources[0].src = ''
            this.playerOptions.poster = ''
            this.newExam.videoCover = ''
            this.newExam.rowkey = ''
            if (this.dataList.length === 0) {
                this.getAuditList()
            } else {
                this.getVideoDetail()
            }
            this.getShortVideoNum()
        },
        // 没有数据开启定时器
        getInterva() {
            if (this.dataList.length === 0) {
                var _this = this
                this.videoInterva = setInterval(() => {
                    if(_this.dataList.length === 0){
                        _this.getAuditList()
                    }
                }, 30000)
            }
        },
        pass() {
            // 暂停视频
            this.player.pause()
            if(!this.newExam.rowkey){
                return
            }
            let params = {
                rowkey: this.newExam.rowkey,
                gradelv: this.videoLevel
            }
            this.$confirm('是否通过这条视频?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                passShortVideo(params).then(res => {
                    if (res.code == '00001') {
                        this.dataList.shift()
                        this.getData()
                        localStorage.setItem('short_video', JSON.stringify(this.dataList))
                        this.$notify({
                            title: '成功',
                            message: '通过成功',
                            type: 'success',
                            duration: 1 * 1000
                        });
                    }
                })
            }).catch(() => {

            })
        },
        refuse() {
            // 暂停视频
            this.player.pause()
            if(!this.newExam.rowkey){
                return
            }
            let params = {
                rowkey: this.newExam.rowkey,
                reason: this.videoLevel
            }
            this.$confirm('是否拒绝这条视频?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                refuseShortVideo(params).then(res => {
                    if (res.code == '00001') {
                        this.dataList.shift()
                        this.getData()
                        localStorage.setItem('short_video', JSON.stringify(this.dataList))
                        this.$notify({
                            title: '成功',
                            message: '拒绝成功',
                            type: 'success',
                            duration: 1 * 1000
                        });
                    }
                })
            }).catch(() => {

            })
        },
        // 快捷键
        loadKey() {
            let _that = this;
            document.onkeydown = function(ev) {
                if (ev.keyCode == 49) {
                    // 级别 1
                    _that.videoLevel = 1
                } else if (ev.keyCode == 50) {
                    // 级别 2
                    _that.videoLevel = 2
                } else if (ev.keyCode == 51) {
                    // 级别 3
                    _that.videoLevel = 3
                } else if (ev.keyCode == 52) {
                    // 级别 4
                    _that.videoLevel = 4
                } else if (ev.keyCode == 53) {
                    // 级别 5
                    _that.videoLevel = 5
                } else if (ev.shiftKey == 1 && ev.keyCode == 13) {
                    // shift + enter
                    _that.pass()
                } else if (ev.shiftKey == 1 && ev.keyCode == 220) {
                    // shift + \
                    _that.refuse()
                }
            }
        },
        // 权限控制
        getAuth() {
            let authorList = localStorage.getItem('authorList');
            // 通过
            // if (authorList.indexOf('wemedia/picture/audit-pass') > -1) {
            //     this.isAuth.imgPassed = true;
            // }
            // // 拒绝
            // if (authorList.indexOf('wemedia/picture/audit-refused') > -1) {
            //     this.isAuth.imgNoPassed = true;
            // }
        },
        // 复制URL按钮
        copyContent(text, event) {
            clip(text, event)
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.audit-title {
    font-size: 20px;
    text-align: center;
    margin: 0 10px;
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
        .source {
            margin-right: 20px;
        }
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

.flex_box {
    margin-bottom: 10px;
    .flex_title {
        font-size: 14px;
        margin-bottom: 20px;
        font-weight: 700;
    }
    .flex_content {
        margin-left: 10px;
    }
}
.img_null {
    font-size: 16px;
    color: #999;
    margin-bottom: 20px;
}
.null-short-video {
    width: 100%;
    height: 600px;
    line-height: 600px;
    font-size: 42px;
    color: #999;
    letter-spacing: 2px;
    text-align: center;
}
</style>
