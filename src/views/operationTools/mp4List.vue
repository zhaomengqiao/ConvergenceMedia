<template lang="html">
    <section class="mp4List">
        <el-table v-loading="listLoading" highlight-current-row :height="tableHeight" style="width: 100%" v-loadmore="loadMore" :data="tableData" tooltip-effect="dark" stripe border :key="tableKey">
            <el-table-column label="时间" width="150" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>
                        {{ parseInt(scope.row.crawlerts) | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="标题" width="170" :show-overflow-tooltip="true" prop="rowkey">
                <template slot-scope="scope">
                    <span v-if="scope.row.bt">{{ scope.row.bt }}</span>
                    <span v-else>暂无标题</span>
                </template>
            </el-table-column>
            <el-table-column label="ROWKEY" width="170" :show-overflow-tooltip="true" prop="rowkey">
            </el-table-column>
            <el-table-column label="原URL" width="300" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <a :href="scope.row.url" class="aclick" target="_blank">{{ scope.row.url }}</a>
                </template>
            </el-table-column>
            <el-table-column label="作者" width="140" :show-overflow-tooltip="true" prop="author">
            </el-table-column>
            <el-table-column label="视频URL" min-width="200" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="aclick" v-if="JSON.parse(scope.row.videojs)[0].src!=''" @click="showVideoDialog(scope.row)">{{ JSON.parse(scope.row.videojs)[0].src }}</span>
                    <span v-if="JSON.parse(scope.row.videojs)[0].src==''">暂无视频展示</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="视频展示" :visible.sync="replyFormVisible" :close-on-click-modal="false">
            <video-player :options="playerOptions" ref="videoPlayer"></video-player>
		</el-dialog>
    </section>
</template>

<script>
import {
    getTestMp4List
} from '@/api/operationTools'
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
import loadmore from '@/directive/loadMore'

export default {
    data() {
        return {
            listLoading: false,
            replyFormVisible: false,
            lastkey: '',
            tableHeight: 400,
            tableData: [],
            tableKey: 0,
            playerOptions: {
                height: '450',
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
            }
        }
    },
    components: {
        videoPlayer
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    directives: {
        loadmore
    },
    mounted() {
        console.log(document.body.clientHeight)
        this.getList()
        if(document.body.clientHeight>700){
            this.tableHeight = 800
            this.tableKey += 1
        }else if(document.body.clientHeight > 500 && document.body.clientHeight < 700){
            this.tableHeight = 380
            this.tableKey += 1
        }else{
            this.tableHeight = 400
            this.tableKey += 1
        }
    },
    methods: {
        getList() {
            let params = {
                lastkey: this.lastkey,
                number: 20
            }
            getTestMp4List(params).then(res => {
                if (res.code === '00001') {
                    if(!res.data){
                        this.$message({
                            showClose: true,
                            message: '暂无更多数据',
                            type: 'warning'
                        })
                    }else{
                        this.lastkey = res.data[res.data.length - 1].rowkey
                        this.tableData = this.tableData.concat(res.data);
                    }
                }
            })
        },
        showVideoDialog(row) {
            this.playerOptions.sources[0].src = JSON.parse(row.videojs)[0].src
            this.replyFormVisible = true
        },
        loadMore(){
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    color: #58B7FF;
}
</style>
