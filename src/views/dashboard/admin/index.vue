<template>
<div class="dashboard-editor-container">
    <el-row>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>快速入口</span>
                <el-button type="text" @click="showTree" style="margin-left:20px"><i class="el-icon-plus"></i></el-button>
            </div>
            <div class="box-card--content">
                <div class="nav_box" v-if="show_quickNav.length!=0">
                    <router-link :to="{path: item.path}"
                                  tag="div"
                                  class="nav_box_item"
                                  v-for="(item,index) in show_quickNav"
                                  :key="index">
                        <div class="nav_logo" :style="{backgroundColor:color_arr[Math.floor(Math.random()*5)]}">{{ generateTitle(item.name).charAt(0) }}</div>
                        <el-tooltip class="item" effect="dark" :content="generateTitle(item.name)" placement="bottom">
                            <div class="nav_name">
                                {{ generateTitle(item.name) }}
                            </div>
                        </el-tooltip>
                    </router-link>
                </div>
                <div class="nav_box" v-if="show_quickNav.length===0">
                    <span class="null_nav">请点击'+'添加需要的快速入口</span>
                </div>
            </div>
        </el-card>
    </el-row>
    <el-row :gutter="10" class="mt-10">
        <el-col :xs="24" :sm="24" :lg="8">
            <el-card class="box-card" :body-style="pendingStyle">
                <div slot="header" class="clearfix">
                    <span>待审稿件</span>
                </div>
                <div class="box-card--content">
                    <wait-audit></wait-audit>
            	</div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
            <el-card class="box-card" :body-style="pendingStyle">
                <div slot="header" class="clearfix">
                    <span>采集稿件</span>
                </div>
                <div class="box-card--content">
                    <collect-content></collect-content>
            	</div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
            <el-card class="box-card" :body-style="pendingStyle">
                <div slot="header" class="clearfix">
                    <span>昨日稿件产出</span>
                    <el-radio-group v-model="articleType" class="pull-right" size="small">
                        <el-radio-button label="0">添加</el-radio-button>
                        <el-radio-button label="1">编辑</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="box-card--content">
                    <produce-content :articleType="articleType"></produce-content>
            	</div>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top:10px">
        <el-col :xs="24" :sm="24" :lg="8">
            <el-card class="box-card" :body-style="todoStyle">
                <div slot="header" class="clearfix">
                    <span>待办事项</span>
                    <el-button type="text" class="pull-right" @click="addTodo"><i class="el-icon-plus"></i></el-button>
                </div>
                <div class="box-card--content">
                    <todo-list :todoList="todoList" @delTodo="delTodo" v-if="todoList.length!=0"></todo-list>
                    <div v-if="todoList.length==0" class="todoNull">
                        <span>暂无待办事项</span>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="16">
            <el-card class="box-card" :body-style="todoStyle">
                <div slot="header" class="clearfix">
                    <span>昨日访问量数据</span>
                    <el-radio-group v-model="mapCheck" class="pull-right" size="small">
                        <el-radio-button label="H5"></el-radio-button>
                        <el-radio-button label="APP"></el-radio-button>
                        <el-radio-button label="PC"></el-radio-button>
                    </el-radio-group>
                </div>
                <div class="box-card--content">
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-table
                                height="210"
                                :data="uvTableData"
                                style="width: 100%">
                                <el-table-column
                                    prop="provname"
                                    label="省份">
                                </el-table-column>
                                <el-table-column
                                    prop="pv"
                                    label="PV"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="uv"
                                    label="UV"
                                    sortable>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="14">
                            <map-chart @mapTableData="getMapTableData" :mapType="mapCheck" @mapDataLoad="getMapDataLoad"></map-chart>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top:10px">
        <!--今日置顶数据 Begin-->
        <el-col  :xs="24" :sm="24" :lg="8" id="map">
            <el-card class="box-card" :body-style="auditStyle">
                <div slot="header" class="clearfix">
                    <span>今日置顶数据</span>
                </div>
                <div class="box-card--content" id="mapBox">
                    <top-count @topCountLoad="getTopCountLoad"></top-count>
                </div>
            </el-card>
        </el-col>
        <!--今日置顶数据 End-->
        <!--审稿量数据 Begin-->
        <el-col  :xs="24" :sm="24" :lg="16" id="audit">
            <el-card class="box-card" :body-style="auditStyle">
                <div slot="header" class="clearfix">
                    <span>今日审稿量</span>
                    <el-radio-group v-model="auditType" class="pull-right" size="small">
                        <el-radio-button label="selfmedia">新媒体</el-radio-button>
                        <el-radio-button label="DFH">东方号</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="box-card--content" v-loading="loading.auditChart" id="auditBox">
                    <auditChart :auditCheck="auditType" @auditLoad="getAuditLoad"></auditChart>
                </div>
            </el-card>
        </el-col>
        <!--审稿量数据 End-->
    </el-row>
    <el-dialog :visible.sync="navDialog">
        <el-tree
            node-key="id"
            :props="defaultProps"
            :data="treeData"
            show-checkbox
            ref="tree"
            @check="handleCheckChange">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="navDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveTree">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import waitAudit from './components/waitAudit'
import collectContent from './components/collectContent'
import produceContent from './components/produceContent'
import todoList from './components/todoList'
import mapChart from './components/mapChart'
import topCount from './components/topCount'
import auditChart from './components/auditChart'
import { generateTitle } from '@/utils/i18n'

export default {
    name: 'dashboard-admin',
    components: {
        waitAudit,
        collectContent,
        produceContent,
        todoList,
        mapChart,
        topCount,
        auditChart
    },
    mounted (){
        // 获取本地todo
        var todo = localStorage.getItem("todo" + this.$store.getters.name);
        if(todo){
            this.todoList = JSON.parse(todo);
        }
        this.getRouter_nav()
        this.getNav()
    },
    data() {
        return {
            color_arr: [
                'rgb(225,193,209)',
                'rgb(192,213,253)',
                'rgb(236,216,163)',
                'rgb(131,161,231)',
                'rgb(159,212,181)'
            ],
            router_nav: [],
            tree_nav: [],
            show_quickNav: [],
            navDialog: false,
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            loading: {
                mapData: false,
                auditChart: false,
                topCount: false
            },
            todoStyle: {
                height:'240px',
                boxSizing:'border-box',
                width: "100%",
                overflow:'auto',
                padding: '12px'
            },
            pendingStyle: {
                height:'260px',
                boxSizing:'border-box',
                overflow:'auto',
                padding: '10px'
            },
            auditStyle: {
                height:'280px',
                width: "100%",
                boxSizing:'border-box',
                overflow:'auto',
                padding: '12px'
            },
            // 昨日稿件
            articleType: '0',
            // todoList
            todoList: [],
            // 昨日访问量量数据
            mapCheck: 'H5',
            uvTableData: [],
            // 审稿量
            auditType: 'selfmedia',
            checkedNodes: []
        }
    },
    methods: {
        generateTitle,
        getNav() {
            if(localStorage.getItem('tree')){
                var _this = this
                _this.show_quickNav = []
                _this.tree_nav = []
                let treeData = JSON.parse(localStorage.getItem('tree'))

                treeData.forEach(item => {
                    if(!item.children || item.children.length == 0){
                        _this.tree_nav.push(item)
                    }
                })
                _this.tree_nav.forEach(item => {
                    _this.router_nav.forEach(nav => {
                        if(item.meta.authUrl === nav.authUrl){
                            _this.show_quickNav.push(nav)
                        }
                    })
                })
            }
        },
        showTree() {
            this.navDialog = true
            this.$nextTick(() => {
                if(localStorage.getItem('tree')){
                    let treeData = JSON.parse(localStorage.getItem('tree'))
                    this.$refs.tree.setCheckedNodes(treeData)
                }
            })
        },
        saveTree() {
            localStorage.setItem('tree',JSON.stringify(this.checkedNodes))
            this.getNav()
            this.navDialog = false
        },
        handleCheckChange(data, dataArr) {
            this.checkedNodes = dataArr.checkedNodes
            console.log(dataArr)
        },
        // 获取最后一级路由
        getRouter_nav(){
            let _this = this
            let router = JSON.parse(JSON.stringify(this.$store.getters.permission_routers))
            router.forEach((item,index) => {
                if(item.hidden !== true && item.redirect !== 'dashboard'){
                    let router1st_path = item.path
                    item.name = _this.generateTitle(item.name)
                    item.id = index
                    let router1st_name = item.name
                    if(item.children && item.children.length != 0){
                        item.children.forEach((item2nd,index2nd) => {
                            let router2nd_path = item2nd.path
                            let router2nd_name = item2nd.name
                            item2nd.name = _this.generateTitle(item2nd.name)
                            item2nd.id = index * 10 + index2nd
                            if(item2nd.children && item2nd.children.length != 0){
                                item2nd.children.forEach((item3rd, index3rd) => {
                                    let router3rd_path = item3rd.path
                                    let router3rd_name = item3rd.name
                                    item3rd.name = _this.generateTitle(item3rd.name)
                                    item3rd.id = item2nd.id * 10 + index3rd
                                    _this.router_nav.push({
                                        name: router3rd_name,
                                        path: router2nd_path + '/' + router3rd_path,
                                        authUrl: item3rd.meta.authUrl
                                    })
                                })
                            }else{
                                _this.router_nav.push({
                                    name: router2nd_name,
                                    path: router2nd_path,
                                    authUrl: item2nd.meta.authUrl
                                })
                            }
                        })
                    }else{
                        _this.router_nav.push({
                            name: router1st_name,
                            path: router1st_path,
                            authUrl: item3rd.meta.authUrl
                        })
                    }
                    // 获取树形图数据
                    this.treeData.push(item)
                }
            })
        },
        // 新增todoList
        addTodo(){
            this.$prompt('请输入新增任务', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '不能为空'
            }).then(({ value }) => {
                // 默认未完成
                this.todoList.push({
                    content: value,
                    checked: false
                })
                localStorage.setItem("todo" + this.$store.getters.name,JSON.stringify(this.todoList))
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        //删除
        delTodo(param){
            console.log(param)
        },
        getMapTableData(param){
            this.uvTableData = param
        },
        getMapDataLoad(param){
            this.loading.mapData = param
        },
        getTopCountLoad(param){
            this.loading.topCount = param
        },
        getAuditLoad(param){
            this.loading.auditChart = param
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }
}
.todoNull{
    text-align: center;
    color: #999;
    line-height: 130px;
    font-size: 18px;
}

// 快速导航
.nav_box{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.nav_box_item{
    width: 168px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0 20px 10px 0;
    .nav_logo{
        width: 40px;
        height: 40px;
        border-radius: 5px;
        background-color: #ccc;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
        font-weight: 600;
        margin-right: 10px;
    }
    .nav_name{
        color: #666;
    }
}
.null_nav{
    color: #999;
    font-size: 16px;
}
</style>
