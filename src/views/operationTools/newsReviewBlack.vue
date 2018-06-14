<template lang="html">
    <section class="content-preview" v-loading="listLoading">
        <el-col :span="24" class="news-preview-black" style="padding-bottom: 0px;">
            <div class="news-preview-black-left">
                <el-form label-position="top"  ref="ruleForm"   label-width="120px" :model="blackForm">
                    <el-form-item label="选择操作平台：">
                        <el-select v-model="blackForm.platform" placeholder="请选择" @change="changePlatform">
                            <el-option
                                v-for="item in blackFormOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="news-preview-black-right">
                <div class="right-title">
                    <ul class="right-title-list">
                        <li v-for="item in platformCities" :key='item.typePy'  :value="item.typePy" @click="getNewbytype(item.typePy)">
                            <span v-if='newbytype==item.typePy' style="color: #f80000;font-weight: bold;">{{item.typeName}}</span>
                            <span v-else>{{item.typeName}}</span>
                        </li>
                    </ul>
                </div>
                <div class="right-content" ref="rightcontent">
                    <ul class="right-content-list" ref="rightlist">
                        <li v-for="item in newsList" :key='item.rowkey'>
                            <div v-if="item.minibjs.length == 1">
                                <a :href="item.url" target="_blank"><img class="right-content-list-img" :src="item.minibjs[0].src" /></a>
                                <div class="right-content-list-txt">
                                    <h3 class="right-content-list-title"><a :href="item.url" target="_blank">{{ item.topic ? item.topic : item.contenttitle}}</a></h3>
                                    <div class="time-btn">
                                        <a :href="item.url" target="_blank">{{item.wappgdate}} {{item.source}}</a>
                                        <div style="float: right;">
                                            <el-button v-if="item.isblack == 0" size="small" @click="changestate(item,'black')">加黑</el-button>
                                            <el-button v-else size="small" @click="changestate(item,'remove')">还原</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="item.minibjs.length > 1">
                                <h3 class="right-content-list-title more"><a :href="item.url" target="_blank">{{item.topic}}</a></h3>
                                <div class="right-content-list-txt more">
                                    <div class="right-content-img-list">
                                        <a v-for="img in item.minibjs"  :key='img.url' :href="item.url" target="_blank"><img class="right-content-list-img more" :src="img.src" /></a>
                                    </div>
                                    <div class="time-btn more">
                                        <a :href="item.url" target="_blank">{{item.wappgdate}} {{item.source}}</a>
                                        <div style="float: right;">
                                            <el-button v-if="item.isblack == 0" size="small" @click="changestate(item,'black')">加黑</el-button>
                                            <el-button v-else size="small" @click="changestate(item,'remove')">还原</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <!-- <li style="text-align:center">
                            <el-button type="primary" size="small" @click="loadMore" :loading="btnLoad" v-show="btnShow">加载更多</el-button>
                        </li> -->
                    </ul>
                </div>
            </div>
        </el-col>
    </section>
</template>

<script>
import {
    getXianggangList,
    platformSearch,
    changestate,
    getNewbytype
} from '@/api/operationTools'
import {
    getOperPlatform
} from '@/api/commonApi'

export default {
    data() {
        return {
            listLoading: false,
            page: 1,
            pagesize: 10,
            total: 0,
            errorP: false,
            btnLoad: false,
            btnShow: false,
            activeName: 'first',
            searchForm: {
                platform: '',
                type: ''
            },
            searchTypeList: [

            ],
            params: {
                param: null,
                platform: ''
            },
            blackForm: {
                platform: '',
            },
            newbytype: '',
            blackFormOptions: [],
            platformCities: [],
            realAuthList: {},
            newsList: [],
            authorList: '',
            newsInfo: {
                nocomment: 0,
                hidcomment: 0,
                nodownvote: 0,
                noupvote: 0
            },
            box_width: '',
            cont_width: '',
            page_total: 0,
            page_num: 1,
            apiByPlatform: {},
            nowApi: '',
            lastRowkey: ''
        }
    },
    mounted() {
        this.getOperPlatform();
        this.scrollLoadMore()
    },
    methods: {
        getOperPlatform() {
            var user = localStorage.getItem('user'); //获取用户名
            user = JSON.parse(user);
            let params = {
                userName: user.username,
                url: 'news/black'
            }
            getOperPlatform(params).then(res => {
                this.blackFormOptions = res.data;
                if (this.blackFormOptions.length > 0) {
                    this.blackForm.platform = this.blackFormOptions[0].value;
                }
                this.changePlatform()
            });
        },
        // 平台改变
        changePlatform() {
            var params = {
                area: this.blackForm.platform
            }
            platformSearch(params).then(res => {
                this.platformCities = res.data;
                this.newbytype = res.data[0].typePy;
                this.getNewbytype(res.data[0].typePy);
                if (this.newsList.length >= 4) {
                    this.btnShow = true;
                }
            })
        },
        scrollLoadMore() {
            var rightContent = this.$refs.rightcontent;
            var rightList = this.$refs.rightlist;
            var _this = this;
            // console.log(rightContent.style.height)
            // if(rightList.clientHeight){
            //     _this.btnLoad = true;
            // }
            rightContent.onscroll = function() {

                if (rightContent.scrollHeight <= rightContent.clientHeight + rightContent.scrollTop) {
                    var params = {
                        tppy: _this.newbytype,
                        lastkey: _this.lastRowkey,
                        number: 20
                    }
                    console.log(params)
                    getXianggangList(params).then(res => {
                        if (res.code == "00001") {
                            // _this.btnLoad = false;
                            var len = _this.newsList.length;
                            for (var i = 0; i < res.data.length; i++) {
                                res.data[i].minibjs = eval(res.data[i].minibjs)
                            }
                            _this.newsList = _this.newsList.concat(res.data);
                            _this.lastRowkey = _this.newsList[_this.newsList.length - 1].rowkey;
                        }
                    })
                }
            }
        },
        // 获取新闻
        getNewbytype(value) {
            var params = {
                tppy: value,
                lastkey: '',
                number: 20
            }
            this.newbytype = value;
            getXianggangList(params).then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].minibjs = eval(res.data[i].minibjs)
                }
                this.newsList = res.data;
                if (res.data.length != 0) {
                    this.lastRowkey = this.newsList[this.newsList.length - 1].rowkey;
                }
                if (this.newsList.length >= 4) {
                    this.btnShow = true;
                }
            })
        },
        // 是否加黑
        changestate(item, type) {
            var newstate = '';
            var imsg = ''
            var params = {
                rowkey: item.rowkey,
                oper: type,
                lcsite: this.newbytype,
                area: this.blackForm.platform
            }
            changestate(params).then(res => {
                if (res.code == '00001') {
                    // this.changePlatform();
                    this.$notify({
                        title: '成功',
                        message: ((type == 'black') ? '加黑成功' : '还原成功'),
                        type: 'success'
                    });
                    this.getNewbytype(this.newbytype)
                }
            })
        }
    }
}
</script>

<style scoped="scoped">
/*内容加黑工具*/

.content-black-tool .urlId-input {
    display: inline-block;
    width: 300px;
}

.content-black-tool .content-black-tool-bottom {
    margin-top: 20px;
    padding: 10px;
    background-color: #EEF1F7;
}

.content-black-tool .el-form-item {
    display: inline-block;
    width: 30%;
}

/*新闻预览加黑*/

.news-preview-black-left,
.news-preview-black-right {
    float: left;
}

.news-preview-black-right {
    width: 800px;
    margin-left: 20px;
}

.news-preview-black-right .right-title {
    border: 1px solid #ddd;
    background-color: #F2F2F2;
    text-align: center;
}

.news-preview-black-right .right-title .right-title-list {
    overflow: hidden;
    display: inline-block;
    padding-left: 0;
    margin: 0 auto;
}

.news-preview-black-right .right-title .right-title-list li {
    list-style: none;
    float: left;
    padding: 10px;
    font-size: 15px;
    cursor: pointer;
}

.news-preview-black-right .right-title .right-title-list li.active {
    color: #F85959;
}

.news-preview-black-right .right-content {
    border: 1px solid #ddd;
    height: 600px;
    overflow: auto;
}

.news-preview-black-right .right-content .right-content-list {
    padding: 0;
}

.news-preview-black-right .right-content .right-content-list a {
    text-decoration: none;
    color: #333;
}

.news-preview-black-right .right-content .right-content-list li {
    padding: 10px 20px;
    list-style: none;
    overflow: hidden;
}

.news-preview-black-right .right-content .right-content-list li .right-content-list-title {
    margin: 0;
    margin-bottom: 20px;
}

.news-preview-black-right .right-content .right-content-list li .right-content-list-img {
    float: left;
    width: 160px;
    height: 90px;
}

.news-preview-black-right .right-content .right-content-list li .right-content-list-txt {
    float: left;
    width: 560px;
    margin-left: 15px;
}

.news-preview-black-right .right-content .right-content-list li .right-content-list-txt .el-button {
    float: right;
    background-color: #D9534F;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
}

.news-preview-black-right .right-content .right-content-list li .right-content-img-list {
    overflow: hidden;
    margin-bottom: 10px;
}

.news-preview-black-right .right-content .right-content-list li .right-content-img-list a {
    display: inline-block;
    overflow: hidden;
    margin-right: 20px;
}

.news-preview-black-right .right-content .right-content-list li .right-content-list-title.more {
    margin-bottom: 5px;
}

.news-preview-black-right .right-content .right-content-list li .right-content-list-txt.more {
    margin-left: 0;
    width: 735px;
}

.news-preview-black-right .right-content .right-content-list li .time-btn {
    height: 32px;
    margin-top: 35px;
}

.news-preview-black-right .right-content .right-content-list li .time-btn.more {
    margin-top: 0;
}

.box_div {
    width: 100%;
    padding: 10px 10px;
    border: 1px solid #bbbbbb;
    box-sizing: border-box;
}

.box_toolbar {
    width: 90%;
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

.news_title {
    text-align: center;
    font-size: 20px;
}

.row-el-form {
    padding-left: 70px;
}

.row-el-form>.el-form-item {
    width: auto !important;
    margin-right: 10px;
}

.row-el-form>.el-form-item .el-form-item__label {
    width: auto !important;
    display: inline-block;
}

.row-el-form>.el-form-item .el-form-item__content {
    width: 160px !important;
    display: inline-block;
    margin-left: 0 !important;
}

.row-el-form>.el-form-item .el-input__inner {
    border-color: transparent !important;
}

.content-black-tool-bottom .el-form-item__label {
    font-weight: 700 !important;
}

.content-black .el-form-item {
    margin-bottom: 0px !important;
}

.input-error {
    position: relative;
}

.input-error p {
    color: red;
    position: absolute;
    font-size: 12px;
    bottom: -20px;
    margin: 0;
}
</style>
