<template lang="html">
    <section class="agendaAdd">
        <el-row>
            <el-col :span="16">
                <el-form label-position="right" :rules="rules" ref="ruleForm" :model="form">
                    <el-form-item label="主标题" prop="title" :label-width="labelWidth">
                        <el-input v-model.trim="form.title" placeholder="请输入主标题" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="二级标题" prop="subtitle" :label-width="labelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入二级标题"
                            v-model.trim="form.subtitle">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="赛事类型" prop="type" :label-width="labelWidth">
                        <el-cascader
                            v-model="form.type"
                            :options="racingType"
                            :props="props"
                            @change="getRacingList">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="所属赛事" prop="race" :label-width="labelWidth">
                        <el-select v-model="form.race" placeholder="请选择所属赛事">
                            <el-option
                                v-for="(item,index) in races"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="比赛状态" prop="status" :label-width="labelWidth">
                        <el-select v-model="form.status" placeholder="请选择比赛状态" >
                            <el-option
                                v-for="(item,index) in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="比赛方式" prop="raceWay" :label-width="labelWidth">
                        <el-radio-group v-model="form.raceWay">
                            <el-radio :label="1">多人</el-radio>
                            <el-radio :label="0">双方</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="主队" prop="hostTeam" :label-width="labelWidth">
                        <el-select v-model="form.hostTeam"
                                   placeholder="请选择主队"
                                   style="width:140px;"
                                   filterable remote
                                   :remote-method="getHostTeam"
                                   :loading="hostTeamLoading"
                                   @change="getIcon($event,'host')">
                            <el-option
                                v-for="(item,index) in hostTeams"
                                :key="index"
                                :label="item.teamfullname"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <div class="teamflag">
                            <img :src="hostTeamIcon" alt="" style="width:100%;height:100%;">
                        </div>
                    </el-form-item>
                    <el-form-item label="客队" prop="guestTeam" :label-width="labelWidth">
                        <el-select v-model="form.guestTeam"
                                   placeholder="请选择客队"
                                   style="width:140px;"
                                   filterable remote
                                   :remote-method="getGuestTeam"
                                   :loading="guestTeamLoading"
                                   @change="getIcon($event,'guest')">
                            <el-option
                                v-for="(item,index) in guestTeams"
                                :key="index"
                                :label="item.teamfullname"
                                :value="item.id"
                                >
                            </el-option>
                        </el-select>
                        <div class="teamflag">
                            <img :src="guestTeamIcon" alt="" style="width:100%;height:100%;">
                        </div>
                    </el-form-item>
                    <el-form-item label="主队积分" prop="hostScore" :label-width="labelWidth">
                        <el-input-number v-model="form.hostScore" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="客队积分" prop="guestScore" :label-width="labelWidth">
                        <el-input-number v-model="form.guestScore" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="" :label-width="labelWidth">
                        <el-button type="primary" @click="saveData('ruleForm')">保存</el-button>
                        <el-button type="primary" @click="clearData">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import {
    getRacingType,
    getRacingList,
    addAgenda,
    getCompetitiveTeams,
    getAgendaById,
    editAgenda,
    getTeamByid
} from '@/api/contentManage'

export default {
    data() {
        // 队伍名称
        let hostTeamRule = (rule, value, callback) => {
            if (this.form.raceWay == 0 && this.form.hostTeam == '') {
                callback(new Error('请选择主队'))
            } else {
                callback()
            }
        }
        let guestTeamRule = (rule, value, callback) => {
            if (this.form.raceWay == 0 && this.form.guestTeam == '') {
                callback(new Error('请选择客队'))
            } else {
                callback()
            }
        }
        return {
            labelWidth: '100px',
            racingType: [],
            props: {
                value: 'typeName',
                label: 'typeName'
            },
            form: {
                type: [],
                race: '',
                status: '',
                raceWay: '',
                title: '',
                subtitle: '',
                hostScore: 0,
                guestScore: 0,
                hostTeam: '',
                guestTeam: '',
                hostScoreId: '',
                guestScoreId: ''
            },
            statusOptions: [{
                label: '未开始',
                value: 0
            },{
                label: '进行中',
                value: 1
            },{
                label: '已结束',
                value: 2
            }],
            races: [],
            rules: {
                title: [{
                    required: true,
                    message: '请输入主标题',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择赛事类型',
                    trigger: 'change'
                }],
                race: [{
                    required: true,
                    message: '请选择所属赛事',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: '请选择比赛状态',
                    trigger: 'change'
                }],
                raceWay: [{
                    required: true,
                    message: '请选择比赛方式',
                    trigger: 'blur'
                }],
                hostTeam: [{
                    validator: hostTeamRule,
                    trigger: 'change'
                }],
                guestTeam: [{
                    validator: guestTeamRule,
                    trigger: 'change'
                }]
            },
            hostTeamLoading: false,
            guestTeamLoading: false,
            hostTeamIcon: '',
            guestTeamIcon: '',
            hostTeams: [],
            guestTeams: []
        }
    },
    mounted() {
        this.getType()
    },
    methods: {
        getAgendaById(id) {
            let params = {
                id: id
            }
            getAgendaById(params).then(res => {
                if(res.code === '00001') {
                    this.form.title = res.data.title
                    this.form.subtitle = res.data.subtitle
                    this.form.type.push(res.data.maintype)
                    this.form.type.push(res.data.subtype)
                    this.getRacingList()
                    this.form.race = res.data.cid
                    this.form.status = res.data.status
                    this.form.raceWay = res.data.type
                    this.hostTeams = [res.data.hostteam]
                    this.guestTeams = [res.data.guestteam]
                    this.form.hostTeam = res.data.hid
                    this.form.guestTeam = res.data.gid
                    this.getIcon(this.form.hostTeam,'host')
                    this.getIcon(this.form.guestTeam,'guest')
                    this.form.hostScore = res.data.hostscore
                    this.form.guestScore = res.data.guestscore
                    this.form.hostScoreId = res.data.hostscoreid
                    this.form.guestScoreId = res.data.guestscoreid
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
                let agendaId = this.$route.query.id
                if (agendaId) {
                    this.$nextTick(() => {
                        this.getAgendaById(agendaId)
                    })
                }
                let maintype = this.$route.query.maintype
                let subtype = this.$route.query.subtype
                let raceId = this.$route.query.raceId
                if(maintype && subtype && raceId){
                    this.form.type = []
                    this.form.type.push(maintype)
                    this.form.type.push(subtype)
                    this.getRacingList()
                    this.form.race = raceId
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
        getHostTeam(val) {
            if (val !== '') {
                let params = {
                    teamfullname: val,
                    pageNum: 1,
                    pageSize: 9999
                }
                this.hostTeamLoading = true
                var _this = this
                getCompetitiveTeams(params).then(res => {
                    if (res.code == "00001") {
                        _this.hostTeams = []
                        _this.hostTeams = res.data.data
                    }
                    _this.hostTeamLoading = false
                })
            } else {
                this.hostTeams = []
            }
        },
        getGuestTeam(val) {
            if (val !== '') {
                let params = {
                    teamfullname: val,
                    pageNum: 1,
                    pageSize: 9999
                }
                this.guestTeamLoading = true
                var _this = this
                getCompetitiveTeams(params).then(res => {
                    if (res.code == "00001") {
                        _this.guestTeams = []
                        _this.guestTeams = res.data.data
                    }
                    _this.guestTeamLoading = false
                })
            } else {
                this.guestTeams = []
            }
        },
        saveData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        title: this.form.title,
                        maintype: this.form.type[0],
                        subtype: this.form.type[1],
                        cid: this.form.race,
                        status: this.form.status,
                        type: this.form.raceWay,
                        hid: this.form.hostTeam,
                        gid: this.form.guestTeam,
                        subtitle: this.form.subtitle,
                        hostscore: this.form.hostScore,
                        guestscore: this.form.guestScore
                    }
                    if(!this.$route.query.id) {
                        addAgenda(params).then(res => {
                            if(res.code === '00001'){
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.clearData()
                            }
                        })
                    }else{
                        params.id = this.$route.query.id
                        params.hostscoreid = this.form.hostScoreId
                        params.guestscoreid = this.form.guestScoreId
                        editAgenda(params).then(res => {
                            if(res.code === '00001'){
                                this.$notify({
                                    title: '成功',
                                    message: '编辑成功',
                                    type: 'success'
                                });
                                this.clearData()
                                this.$router.push({
                                    path: '/contentManage/racingInfor/agendaAdd'
                                })
                            }
                        })
                    }

                }
            })
        },
        clearData() {
            this.$refs.ruleForm.resetFields();
        },
        getIcon(val,type) {
            let params = {
                id: val
            }
            getTeamByid(params).then(res => {
                if(res.code === '00001'){
                    if(type=='host') {
                        this.hostTeamIcon = res.data.teamlogpic
                    }else{
                        this.guestTeamIcon = res.data.teamlogpic
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.teamflag {
    width: 36px;
    height: 36px;
    vertical-align: middle;
    display: inline-block;
    margin-left: 10px;
}
</style>
