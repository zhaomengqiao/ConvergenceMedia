<template>
<section>
    <!--表单-->
    <el-form id="matchListForm" :inline="true" ref="matchListForm" :model="matchListForm">
        <el-row>
            <el-form-item label="同步平台：">
                <el-select v-model="matchListForm.platform" placeholder="请选择投放平台">
                    <!-- <el-option label="全平台" value="all"></el-option> -->
                    <el-option label="东方体育" value="df"></el-option>
                    <el-option label="猫扑体育" value="mp"></el-option>
                    <el-option label="五星体育" value="wx"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围：">
                <el-date-picker @change='setStartEnd' v-model="matchListForm.dateTimer" :editable="false" type="datetimerange" placeholder="选择时间范围">
                </el-date-picker>
            </el-form-item>
            <el-form-item label-width="10px">
                <el-button type="primary" @click="searchForm(matchListForm)">查询</el-button>
            </el-form-item>
            <el-form-item label-width="10px">
                <el-checkbox v-model="checked" @change="showimp()">重要比赛</el-checkbox>
            </el-form-item>
        </el-row>
    </el-form>
    <!--表格-->
    <el-row>
        <el-row>
            <el-col :span="24">
                <el-table v-loading="listLoading" :data="matchShowData" border height="700" style="min-width:100px">

                    <!--比赛标题-->
                    <el-table-column fixed class="txt_hide" label="比赛标题" min-width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <a :href="scope.row.url" target=_blank>{{scope.row.title}}</a>
                            </template>
                    </el-table-column>
                    <!--比赛类型-->
                    <el-table-column prop="tplv001" label="比赛类型" width="100">
                    </el-table-column>

                    <!--开始时间-->
                    <el-table-column label="开始时间" prop="stateDate" width="180">
                    </el-table-column>
                    <!--比赛队伍-->
                    <el-table-column label="主队VS客队" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                                {{ scope.row.home_team }}
                                vs
                                {{ scope.row.visit_team }}
                            </template>
                    </el-table-column>
                    <!--比赛状态-->
                    <el-table-column label="比赛状态" width="100">
                        <template slot-scope="scope">
                                {{scope.row.ismatched/1?'完赛':(scope.row.starttime>new Date()/1?'未开赛':'直播中')}}
                            </template>
                    </el-table-column>
                    <!--前瞻-->
                    <el-table-column label="前瞻" width="120">
                        <template slot-scope="scope">
                                <a :class="scope.row.prospect?'':'hide'"  :href="scope.row.prospect?scope.row.prospect.url:''"  target=_blank>{{scope.row.prospect?scope.row.prospect.title:''}}</a>
                                {{ scope.row.prospect?"":'-'}}
                            </template>
                    </el-table-column>
                    <!--战报-->
                    <el-table-column label="战报" width="120">
                        <template slot-scope="scope">
                                <a  :class="scope.row.battlelog?'':'hide'" :href="scope.row.battlelog?scope.row.battlelog.url:''" target=_blank>{{scope.row.battlelog?scope.row.battlelog.title:''}}</a>
                                {{ scope.row.battlelog?"":'-'}}

                            </template>
                    </el-table-column>
                    <!--直播源-->
                    <!-- <el-table-column
                                label="直播源"
                                width="120">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top"  :class="scope.row.livestreams.length?'':'hide'">
                                    <div v-for='(item,index) in scope.row.livestreams' :key="index">
                                        <p v-for='(itemSub,indexs) in item.details' :key="indexs"><a :href="itemSub.url" target=_blank >{{itemSub.title}}</a></p>
                                    </div>
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.livestreams.length}}
                                    </div>
                                </el-popover>
                                {{ scope.row.livestreams.length?"":'-'}}
                            </template>
                        </el-table-column> -->
                    <!--信号源-->
                    <el-table-column label="信号源" width="120">
                        <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top"  :class="scope.row.signals.length?'':'hide'">
                                    <!-- <div v-for='(item,index) in scope.row.signals' :key="index">
                                        <p v-for='(itemSub,indexs) in item.details' :key="indexs"><a :href="itemSub.url" target=_blank >{{itemSub.title}}</a></p>
                                    </div> -->
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.signals.length}}
                                    </div>
                                </el-popover>
                                {{ scope.row.signals.length?"":'-'}}
                            </template>
                    </el-table-column>
                    <!--操作-->
                    <el-table-column fixed="right" label="操作" width="140">
                        <template slot-scope="scope">
                                <el-button @click.native.prevent="editClick(scope.row.rowkey,matchListForm.platform)" type="primary" size="small">编辑</el-button>
                                <el-button @click.native.prevent="delClick(scope.row)"  type="primary" size="small">删除</el-button>
                            </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-row>
    <el-row>
        <div class="block">
            <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="matchListManage.currentPage" :page-sizes="matchListManage.sizes" :page-size="matchListManage.size" layout="total, sizes, prev, pager, next, jumper" :total="matchListManage.total"
                style="float:right;">
            </el-pagination>
        </div>
    </el-row>
</section>
</template>


<script>
import {
    mapGetters
} from 'vuex';
import {
    parseTime,
} from '@/utils'
import {
    matchListApi,
    matchDelApi,
    matchSingleApi,
    matchTeamApi
} from '@/api/contentManage';
export default {
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            checked: false,
            listLoading: false,
            matchListForm: {
                platform: 'df',
                dateTimer: [],
                starttime: '',
                endtime: '',
            },
            // rules: {
            //     region: [{ required: true, message: '请选择同步平台', trigger: 'blur' }],
            //     dateStart:[{ required: true, message: '请选择起始日期', trigger: 'blur' }],
            //     endtime:[{ required: true, message: '请选择终止日期', trigger: 'blur' }]
            // },
            //                表格数据
            matchdata: '', //全部数据
            matchimpdata: '', //重要
            matchListData: '', //默认显示全部赛程
            matchShowData: [],
            matchplatform: 'df', //默认平台
            matchListManage: {
                currentPage: 1,
                sizes: [10, 15, 30, 50, 100],
                size: 15,
                total: 0, //共多少条
            },
        };
    },
    created() {
        let date = new Date(); //获取当前时间
        let curDate = new Date();
        date.setDate(date.getDate() - 3);
        this.matchListForm.dateTimer.push(date);
        this.matchListForm.dateTimer.push(curDate);
        this.matchListForm.starttime = this.matchListForm.dateTimer[0].getTime();
        this.matchListForm.endtime = this.matchListForm.dateTimer[1].getTime();
    },
    mounted: function() {
        this.searchForm(this.matchListForm)
        this.matchListManage.size = this.personalConfig.tableRowShow
    },
    methods: {
        setStartEnd(val) {
            let time = this.matchListForm.dateTimer[1];
            if (time.getHours() < 1) {
                time.setHours(23, 59, 59);
                this.matchListForm.dateTimer.splice(1, 1, time);
            }
            let starttime = this.matchListForm.dateTimer[0].getTime();
            let endtime = this.matchListForm.dateTimer[1].getTime();
            let difftime = parseInt((endtime - starttime) / (1000 * 60 * 60 * 24));
            if (difftime > 30) {
                this.$message({
                    message: '选择时间范围不能大于30天',
                    type: 'warning'
                });
                this.matchListForm.dateTimer = [];
                return
            } else {
                this.matchListForm.starttime = starttime;
                this.matchListForm.endtime = endtime;
            }
        },
        searchForm(formName) {
            const self = this;
            if (!formName.platform || !formName.starttime || !formName.endtime) {
                return
            }
            const searecdata = {
                "platform": formName.platform,
                "starttime": formName.dateTimer[0].getTime(),
                "endtime": formName.dateTimer[1].getTime(),
                "startkey": "",
                "limit": "1000"
            };
            self.listLoading = true;
            matchListApi({
                data: JSON.stringify(searecdata)
            }).then(res => {
                self.matchimpdata = [];
                this.matchplatform = formName.platform;
                res.data.forEach(function(v) { //筛选重要赛程
                    v.stateDate = parseTime((v.starttime), '{y}-{m}-{d} {h}:{i}:{s}')
                    if (v.isimp / 1) {
                        self.matchimpdata.push(v)
                    }
                });
                self.matchdata = res.data; //记录全部赛程
                if (self.checked) {
                    self.matchListData = self.matchimpdata;
                } else {
                    self.matchListData = self.matchdata;
                }
                self.matchListManage.total = self.matchListData.length;
                self.matchShowData = self.matchListData.slice(0, self.matchListManage.size);
                this.listLoading = false;
            })
        },
        //            表格
        editClick(matchid, region) {
            const {
                href
            } = this.$router.resolve({
                path: '/contentManage/editContent/editMatch',
                query: {
                    type: 'match',
                    id: matchid,
                    region: region
                }
            })
            window.open(href, '_blank')
            // this.$router.push({path:'/contentEdit',query:{type:'match',id:matchid,region:region}});
        },
        delClick(data) {
            var self = this;
            const params = {
                "rowkey": data.rowkey,
                "platform": this.matchplatform
            };
            matchDelApi({
                data: JSON.stringify(params)
            }).then(res => {
                this.open('提示', `赛程："${data.title}"删除成功`);
                let index1 = this.matchdata.indexOf(data)
                let index2 = this.matchimpdata.indexOf(data)
                let index3 = this.matchShowData.indexOf(data)
                self.matchdata.splice(index1, 1);
                self.matchimpdata.splice(index2, 1);
                self.matchShowData.splice(index3, 1);
                self.matchListManage.total = self.matchListData.length;
            });
        },
        handleSizeChange(val) {
            this.matchListManage.size = val;
            var end = this.matchListManage.currentPage * this.matchListManage.size;
            var start = end - this.matchListManage.size;
            this.matchShowData = this.matchListData.slice(start, end);
        },
        handlePageChange(val) {
            this.matchListManage.currentPage = val;
            var end = this.matchListManage.currentPage * this.matchListManage.size;
            var start = end - this.matchListManage.size;
            this.matchShowData = this.matchListData.slice(start, end);
        },
        showimp() {
            if (this.checked) {
                this.matchListData = this.matchimpdata;
            } else {
                this.matchListData = this.matchdata;
            }
            this.matchShowData = this.matchListData.slice(0, this.matchListManage.size);
            this.matchListManage.total = this.matchListData.length;
        },
        open(tit, cont) {
            this.$alert(cont, tit, {
                confirmButtonText: '确定',
            });
        }
    }
}
</script>


<style scoped>
.txt_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hide {
    display: none;
}
</style>
