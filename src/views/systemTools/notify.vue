<template lang="html">
    <section class="notify-page">
        <el-card class="mt-10" style="padding:20px 0;min-height:460px;">
            <el-table
                v-show="!notifyDetail"
                empty-text="暂无公告"
                :show-header="false"
                :data="tableData"
                @row-click="getNotifyDetail"
                style="width: 100%">
                <el-table-column
                    prop="title"
                    label="标题"
                    min-width="180"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span style="cursor:pointer">{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label=""
                    width="100"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isread!==0">已读</el-tag>
                        <el-tag type="warning" v-else="scope.row.isread">未读</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createuser"
                    label="发布人"
                    width="140"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    label="时间"
                    width="170"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="notifyDetail" v-if="notifyDetail">
                <div>
                    <el-button type="primary" @click="notifyDetail=false" size="mini">返回</el-button>
                </div>
                <div class="notify_wrap">
                    <div class="notify_title">
                        {{ detailNotify.title }}
                    </div>
                    <div class="notify_date">
                        <span>{{ detailNotify.date }}</span>
                        <span class="ml-10">{{ detailNotify.user }}</span>
                    </div>
                    <div class="notify_content" v-html="detailNotify.content">

                    </div>
                </div>
            </div>
        </el-card>
    </section>
</template>

<script>
import {
    parseTime,
} from '@/utils'
import {
    getUnreadNotify,
    getNotifyDetail
} from '@/api/systemTools'
export default {
    data() {
        return {
            tableData: [],
            notifyDetail: false,
            detailNotify: {
                title: '',
                date: '',
                user: '',
                content: ''
            },
            hasNewNotify: false
        }
    },
    mounted() {
        this.getUnreadNotify()
    },
    methods: {
        // 获取未读通知
        getUnreadNotify() {
            let params = {
                username: this.$store.getters.name,
                projectid: 1
            }
            getUnreadNotify(params).then(res => {
                if(res.code === '00000'){
                    this.tableData = res.data
                    let unRead = this.tableData.filter(item => {
                        return item.isread === 0
                    })
                    console.log(unRead.length)
                    if(unRead.length != 0){
                        this.hasNewNotify = true
                        this.$store.dispatch('getHasNotify', this.hasNewNotify)
                    }else{
                        this.hasNewNotify = false
                        this.$store.dispatch('getHasNotify', this.hasNewNotify)
                    }
                }
            })
        },
        getNotifyDetail(row) {
            let params = {
                username: this.$store.getters.name,
                noticeid: row.noticeid
            }
            getNotifyDetail(params).then(res => {
                if(res.code === '00000'){
                    this.detailNotify.title = res.data.title
                    this.detailNotify.date = parseTime(Number(res.data.createtime), '{y}-{m}-{d} {h}:{i}:{s}')
                    this.detailNotify.user = res.data.createuser
                    this.detailNotify.content = res.data.content
                    this.notifyDetail = true
                    this.getUnreadNotify()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.notify-page{
    background-color: #f0f0f0;
    position: absolute;
    padding: 20px;
    top: 86px;
    bottom: 0;
    left: 180px;
    right: 0;
}
.nav_Left{
    height: 100%;
    ul{
        list-style: none;
        padding: 0;
        margin: 0;
        li{
            padding: 16px 14px;
            font-size: 16px;
            color: #495060;
            border-bottom: 1px dashed #ccc;
            text-align: center;
            cursor: pointer;
            transition: color 0.5s;
            &:hover {
                color: #409EFF
            }
        }
    }
}
.notifyDetail{
    min-height: 460px;
}
.notify_wrap{
    padding: 20px 60px;
}
.notify_title{
    font-size: 20px;
    color: #666;
    text-align: center;
}
.notify_date{
    font-size: 14px;
    color: #999;
    margin: 14px 0;
    text-align: center;
}
.notify_content{
    font-size: 16px;
}
</style>
