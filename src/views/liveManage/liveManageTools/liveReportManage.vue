<template>
<div v-loading="listLoading">
    <el-form label-position="left" :inline="true" :model="form" ref="refForm">
        <el-col :span="24" class="el-form-wrap">
            <el-form-item label="举报类型">
                <el-select v-model="form.reportType" style='width: 150px;' placeholder="请选择直播类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="政治敏感" value="1"></el-option>
                    <el-option label="低俗色情" value="2"></el-option>
                    <el-option label="广告欺诈" value="3"></el-option>
                    <el-option label="骚扰谩骂" value="4"></el-option>
                    <el-option label="其他" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="直播类型">
                <el-select v-model="form.liveStatus" style='width: 100px;' placeholder="请选择直播类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="直播" value="0"></el-option>
                    <el-option label="回放" value="2"></el-option>
                    <el-option label="删除" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主播ID">
                <el-input v-model="form.accid" style='width: 200px;'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryReportList" icon="search">搜索</el-button>
            </el-form-item>
        </el-col>
    </el-form>
    <el-table ref="singleTable" class='tableList' :data="tableData" stripe border highlight-current-row width="100%">
        <el-table-column prop="reportType" label="举报类型" width="120">
            <template slot-scope="scope">
						<div v-if='scope.row.reportType==1' style="color: #990000;">政治敏感</div>
						<div v-if='scope.row.reportType==2' style="color: #FF0000;">低俗色情</div>
						<div v-if='scope.row.reportType==3' style="color: #996600;">广告欺诈</div>
						<div v-if='scope.row.reportType==4' >骚扰谩骂</div>
						<div v-if='scope.row.reportType!=1&&scope.row.reportType!=2&&scope.row.reportType!=3&&scope.row.reportType!=4'>
                            其他</div>
				</template>
        </el-table-column>
        <el-table-column prop="anchor" label="主播信息">
        </el-table-column>
        <el-table-column prop="roomid" label="房间ID" width="120"></el-table-column>
        <el-table-column prop="title" label="直播标题" show-overflow-tooltip>
            <template slot-scope="scope">
            		<el-popover
						  ref="popover1"
						  placement="right"
						  title="直播封面"
						  width="250"
						  height="150"
						  trigger="hover"
						  >
						  <img :src="scope.row.coverImg" width="100%" height="100%" />
						</el-popover>
						<el-button v-popover:popover1 @click.native="openLiveUrl(scope.$index,scope.row)">{{scope.row.title}}</el-button>
                </template>
        </el-table-column>
        <!-- <el-table-column prop="coverImg" label="直播封面" >
            	<template slot-scope="scope">
            		<el-popover
						  ref="popoverimg"
						  placement="right"
						  title="直播封面"
						  trigger="hover"
						  >
						  <img :src="scope.row.coverImg" width="100%" height="100%" />
						</el-popover>
						<img v-if="scope.row.coverImg!=''" v-popover:popoverimg  :src="scope.row.coverImg" width="80px" height="50px" />
				</template>
            </el-table-column> -->
        <el-table-column prop="startTime" label="开播时间" width="180">
            <template slot-scope="scope">
				{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
			</template>
        </el-table-column>
        <el-table-column prop="liveStatus" label="直播状态" width="120">
            <template slot-scope="scope">
						<div v-if='scope.row.liveStatus==0'>直播</div>
						<div v-if='scope.row.liveStatus==2'>回放</div>
						<div v-if='scope.row.liveStatus==1'>删除</div>
				</template>
        </el-table-column>
        <el-table-column prop="count" label="举报次数" style="cursor: auto;" width="120">
            <template slot-scope="scope">
            		<a @click="dialogShow(scope.$index, scope.row)" href="javaScript:void(0);" style='color: #000000;font-size: 18px;'>
						<div v-if='scope.row.count>100' style="color: #990000;font-weight: bold;">{{scope.row.count}}</div>
						<div v-else-if='scope.row.count<50' style="font-weight: bold;">{{scope.row.count}}</div>
						<div v-else style="color: #FF0000;font-weight: bold;">{{scope.row.count}}</div>
					</a>
				</template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="150" fixed="right">
            <template slot-scope="scope">
                    <el-button @click.native.prevent="closeRoom(0, scope.row)" :disabled="!scope.row.liveStatus==0" type="primary" size="small">关闭</el-button>
                    <el-button @click.native.prevent="closeRoom(1, scope.row)" :disabled="scope.row.liveStatus==1||scope.row.liveStatus==0"  type="primary" size="small">删除</el-button>
                </template>
        </el-table-column>
    </el-table>
    <el-pagination @current-change="handlePageChange" layout="total, sizes, prev, pager, next, jumper" :page-size="form.pageSize" @size-change="handleSizeChange" :current-page="form.pageNum" :page-sizes="[10, 15, 30, 50,100]" style="float:right;" :total="total">
    </el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="urlVisible" :close-on-click-modal="false">
        <div>
            <span style="float: left;padding: 10px;" v-for="value in livePlatform">{{ value }}</span>
        </div>
    </el-dialog>

</div>
</template>
<script>
import {
    queryRoomReportList,
    finishRoom,
    queryUserReportList,
    removewhiteuser
} from '@/api/liveManage';
export default {
    data() {
        return {
            listLoading: false,
            urlVisible: false,
            dialogTitle: '',
            livePlatform: [],
            total: 0,
            form: {
                reportType: '',
                liveStatus: '',
                accid: '',
                pageNum: 1,
                pageSize: 10
            },
            livePlatform: [],
            tableData: []
        }
    },
    methods: {
        dialogShow(index, rows) {
            this.dialogTitle = rows.anchor;
            let para = {
                reportType: rows.reportType,
                roomid: rows.roomid
            }
            queryUserReportList(para).then((res) => {
                if (res.code === '00001') {
                    this.livePlatform = res.data.result;
                }
                this.urlVisible = true;
            })
        },
        openLiveUrl(index, obj) {
            let accid = obj.anchor.substring(obj.anchor.indexOf("(") + 1, obj.anchor.indexOf(")"));
            let roomkey = 9223372036854775807 - obj.startTime;
            let url = 'http://api.mv.dftoutiao.com/shared/live.html?id=' + roomkey + '&ttaccid=' + accid + '&apptypeid=' + obj.appId + '';
            window.open(url);
        },
        closeRoom(index, obj) {
            this.$confirm('确认提交吗?', '提示', {
                type: 'warning'
            }).then(() => {
                var reg = /\((\d+)\)/;
                var ttaccid = '';
                if (reg.test(obj.anchor)) { //如果匹配上直接获取括号里的内容
                    ttaccid = RegExp.$1;
                }
                let para = {
                    roomid: obj.roomid,
                    ttaccid: ttaccid,
                    app_id: obj.appId,
                    closeAndDelete: index
                }
                this.listLoading = true;
                finishRoom(para).then((res) => {
                    if (res.code == '00001') {
                        this.queryReportList();
                    }
                    this.listLoading = false;
                });
            });
        },
        removewhiteuser() {
            this.$confirm('确认提交吗?', '提示', {
                type: 'warning'
            }).then(() => {
                var reg = /\((\d+)\)/;
                var ttaccid = '';
                if (reg.test(obj.anchor)) { //如果匹配上直接获取括号里的内容
                    ttaccid = RegExp.$1;
                }
                let para = {
                    ttaccid: ttaccid,
                    app_id: obj.appId,
                }
                this.listLoading = true;
                removewhiteuser(para).then((res) => {
                    if (res.code == '00001') {
                        this.queryReportList();
                    }
                    this.listLoading = false;
                });
            });
        },
        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },
        handlePageChange(val) {
            this.form.pageNum = val;
            this.queryReportList();
        },
        handleSizeChange(val) {
            this.form.pageSize = val;
            this.queryReportList();
        },
        queryReportList() {
            this.listLoading = true;
            queryRoomReportList(this.form).then((res) => {
                if (res.code === '00001') {
                    this.tableData = res.data.result;
                    this.total = res.data.countPageNum;
                }
                this.listLoading = false;
            })
        }
    },
    mounted() {
        this.queryReportList();
    }
}
</script>
<style media="screen">
.el-form-wrap .el-form-item {
    margin-right: 30px;
}

.tableList .cell .el-button--default {
    border: 0px solid #c4c4c4;
    background: rgba(255, 255, 255, 0);
}
</style>
