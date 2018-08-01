<template lang="html">
    <section class="agendaMaintain">
        <el-card>
            <el-form :inline="true" :model="form">
                <el-row>
                    <el-form-item label="所属分类" style="margin-bottom: 0">
                        <el-cascader
                            v-model="form.type"
                            :options="racingType"
                            :props="props"
                            @change="getRacingList">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="所属赛事" style="margin-bottom: 0">
                        <el-select v-model="form.racing" class="select-platform"
                            filterable placeholder="请选择赛事">
                            <el-option
                                v-for="(item,index) in races"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button type="success" @click="addAgenda">新增赛程</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-table :data="tableData"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border>
                  <el-table-column prop="title" label="赛程标题" min-width="220" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column prop="subtitle" label="二级标题" min-width="220" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column label="比赛状态" width="120" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <span>{{ scope.row.status | getStatus }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="队伍双方" width="200" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <span>
                            {{ scope.row.hostteam.teamfullname }} : {{ scope.row.guestteam.teamfullname }}
                          </span>
                      </template>
                  </el-table-column>
                  <el-table-column label="比分" width="120" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                          <span>
                            {{ scope.row.hostscore }} : {{ scope.row.guestscore }}
                          </span>
                      </template>
                  </el-table-column>
                  <el-table-column label="操作" width="280" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <el-button type="primary"
                            @click="showScoreDialog(scope.row)">编辑比分</el-button>
                        <el-button type="primary"
                            @click="editAgenda(scope.row)">编辑</el-button>
                            <el-dropdown @command="editStatus($event,scope.row)">
                                <el-button type="primary">
                                修改状态<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="0">未开始</el-dropdown-item>
                                <el-dropdown-item command="1">进行中</el-dropdown-item>
                                <el-dropdown-item command="2">已结束</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        <!-- <el-button type="primary"
                            @click="editStatus(scope.row)">修改状态</el-button> -->
                      </template>
                  </el-table-column>
            </el-table>
            <el-row class="toolbar">
                <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[10, 15, 20, 50, 100]"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    :total="total"
                    background
                    style="float:right;">
                </el-pagination>
            </el-row>
        </el-card>
        <el-dialog title="修改比分" :visible.sync="dialogFormVisible">
            <div class="score_title">{{ nowData.title }}</div>
            <div class="score_wrap">
                <div class="score_host">
                    <el-input-number v-model="hostScore" :min="0"></el-input-number>
                    <div v-if="nowData.hostteam" class="score_text">{{ nowData.hostteam.teamfullname }}</div>
                </div>
                <div class="score_guest">
                    <el-input-number v-model="guestScore" :min="0"></el-input-number>
                    <div v-if="nowData.guestteam" class="score_text">{{ nowData.guestteam.teamfullname }}</div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editScore">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import {
    getRacingType,
    getRacingList,
    getAgendaList,
    changeRacingScore,
    changeRacingStatus
} from '@/api/contentManage'

export default {
    data() {
        return {
            nowData: '',
            dialogFormVisible: false,
            form: {
                type: [],
                racing: ''
            },
            racingType: [],
            props: {
                value: 'typeName',
                label: 'typeName'
            },
            races: [],
            currentPage: 1,
            pageSize: 10,
            tableData: [],
            total: 0,
            listLoading: false,
            scoreTitle: '',
            hostScore: 0,
            guestScore: 0,
            hostTeamName: '',
            guestTeamName: ''
        }
    },
    mounted() {
        this.getType()
    },
    filters: {
        getStatus(val) {
            switch (Number(val)) {
                case 0:
                    return '未开始'
                    break;
                case 1:
                    return '进行中'
                    break;
                case 2:
                    return '已结束'
                    break;
                default:
                    return '未开始'
            }
        }
    },
    methods: {
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            let params = {
                title: '',
                status: '',
                type: '',
                subtitle: '',
                startTime: '',
                endTime: '',
                maintype: this.form.type[0],
                cid: this.form.racing,
                subtype: this.form.type[1],
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            getAgendaList(params).then(res => {
                if(res.code === '00001') {
                    this.tableData = res.data.data
                    this.total = res.data.total
                }
            })
        },
        getRacingList() {
            let params = {
                name: '',
                startTime: '',
                endTime: '',
                createuser: '',
                maintype: this.form.type.length == 0 ? '' : this.form.type[0],
                subtype: this.form.type.length == 0 ? '' : this.form.type[1],
                pageNum: 1,
                pageSize: 9999
            }
            getRacingList(params).then(res => {
                if(res.code === '00001') {
                    this.races = res.data.data
                }
            })
        },
        getType() {
            getRacingType().then(res => {
                let data = res.data
                // level 1
                let level1Arr = data.filter(item => {
                    return item.level == 1
                })
                // level 2
                let level2Arr = data.filter(item => {
                    return item.level == 2
                })
                level1Arr.forEach(item => {
                    item.children = []
                })
                level2Arr.forEach(lv2 => {
                    level1Arr.forEach(lv1 => {
                        if(lv2.parentId === lv1.typeId) {
                            lv1.children.push(lv2)
                        }
                    })
                })
                this.racingType = level1Arr
            })
        },
        addAgenda() {
            this.$router.push({
                path: '/contentManage/racingInfor/agendaAdd'
            })
        },
        showScoreDialog(row){
            this.nowData = row
            this.dialogFormVisible = true
            this.hostScore = row.hostscore
            this.guestScore = row.guestscore
        },
        editScore(row) {
            let params = {
                hid: this.nowData.hid,
                gid: this.nowData.gid,
                id: this.nowData.id,
                hostscore: this.hostScore,
                guestscore: this.guestScore,
                hostscoreid: this.nowData.hostscoreid,
                guestscoreid: this.nowData.guestscoreid
            }
            changeRacingScore(params).then(res => {
                if(res.code === '00001') {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '成功',
                        message: '修改比分成功',
                        type: 'success'
                    });
                    this.getList()
                }
            })
        },
        editAgenda(row) {
            this.$router.push({
                path: '/contentManage/racingInfor/agendaAdd',
                query: {
                    id: row.id
                }
            })
        },
        editStatus(command, row) {
            this.$confirm('确认修改吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let params = {
                    id: row.id,
                    status: command
                }
                changeRacingStatus(params).then(res => {
                    if(res.code === '00001') {
                        this.$notify({
                            title: '成功',
                            message: '修改状态成功',
                            type: 'success'
                        });
                        this.getList()
                    }
                })
            })
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.score_title{
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
}
.score_wrap{
    display: flex;
    justify-content: space-around;
}
.score_text{
    font-size: 20px;
    margin-top: 10px;
}
</style>
