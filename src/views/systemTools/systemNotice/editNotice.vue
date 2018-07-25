<template lang="html">
    <section class="editNotice">
        <el-row :gutter="10" type="flex">
            <el-col :span="18" style="flex:1">
                <el-card>
                    <el-row class="input_num_box">
                        <el-input placeholder="请输入公告标题,不能超过50个字符"
                                  v-model="form.title"
                                  :maxlength="50"
                                  :minlength="5"
                                  size="large"></el-input>
                        <div class="input_num info">
                            <span :class="form.title.length==50?'danger':''">{{ form.title.length }}/50</span>
                        </div>
                    </el-row>
                    <el-row class="mt-10">
                        <vueUEditor @ready="editorReady" style="width: 100%;height: 400px;" ref="addVideo"></vueUEditor>
                    </el-row>
                    <el-row class="mt-10">
                        <el-button type="primary" @click="addNotice">发布</el-button>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="6" style="min-width:450px;">
                <el-card>
                    <div style="display:flex;align-items:center">
                        <el-date-picker value-format="timestamp"
                            :picker-options="pickerOptions"
                            v-model="form.timeQuantum"
                            type="datetimerange"
                            placeholder="选择时间范围"
                            @change="getTopTime"
                            style="width:364px;">
                        </el-date-picker>
                        <el-checkbox v-model="dateCheck" style="margin-left:4px;">永久</el-checkbox>
                    </div>
                    <div class="treeWrap mt-10" v-loading="loading.deptnoLoading">
                        <h4>接收人：</h4>
                        <div class="tree_control mb-10">
                            <el-input
                                placeholder="输入部门关键字"
                                v-model="filterText"
                                style="width:260px;">
                            </el-input>
                            <!-- <el-button type="primary" @click="checkAll" size="mini" class="ml-10" icon="el-icon-success">全选</el-button> -->
                            <el-button type="primary" @click="resetTree" size="mini" style="margin-left:6px;" icon="el-icon-error">清空</el-button>
                        </div>

                        <el-tree
                            style="padding:10px 0;background:#f3f3f3"
                            :check-strictly="true"
                            @check-change="getDeptnoUser"
                            :default-expanded-keys="[1]"
                            :data="deptnoTree"
                            show-checkbox
                            ref="tree"
                            :filter-node-method="filterNode"
                            node-key="id"
                            :props="defaultProps">
                        </el-tree>
                    </div>
                    <div class="userList mt-10" v-loading="loading.userList">
                        <el-checkbox v-if="userList.length!==0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="userCheckList" v-if="userList.length!==0" @change="handleCheckedChange">
                            <div style="display:flex;flex-wrap:wrap">
                                <el-checkbox :label="item.userName" v-for="(item,index) in userList" :key="index" style="maring: 0 6px 6px 0">{{ item.realName }}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                        <div class="user_null" v-if="userList.length===0">
                            选择部门，显示相应人员
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import vueUEditor from '@/components/UEditor'
import {
    getDeptnoTree,
    getDeptnoUser,
    addNotice
} from '@/api/systemTools'

export default {
    components: {
        vueUEditor
    },
    data() {
        return {
            checkAll: false,
            isIndeterminate: true,
            loading: {
                deptnoLoading: false,
                userList: false
            },
            filterText: '',
            dateCheck: false,
            userCheckList: [],
            userList: [],
            form: {
                title: '',
                content: '',
                timeQuantum: [],
                starttime: '',
                endtime: ''
            },
            defaultProps: {
                children: 'children',
                label: 'deptname'
            },
            deptnoTree: [],
            pickerOptions: {
                // 禁止选择之前时间
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
                shortcuts: [
                    {
                        text: '8小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 8);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '1天整',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '3天整',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '5天整',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 5);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            }
        }
    },
    mounted() {
        this.getDeptnoTree()
    },
    methods: {
        handleCheckedChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.userList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.userList.length
        },
        handleCheckAllChange(val) {
            let userAll = this.userList.map(item => {
                return item.userName
            })
            console.log(userAll,val)
            this.userCheckList = val ? userAll : []
            this.isIndeterminate = false
        },
        filterNode(value, data) {
            if (!value) return true
            return data.deptname.indexOf(value) !== -1
        },
        editorReady(editorInstance) {
            this.editorInstance = editorInstance;
            editorInstance.setContent(this.form.content);
            editorInstance.addListener('contentChange', () => {
                this.form.content = editorInstance.getContent()
            })
        },
        getDeptnoTree() {
            this.loading.deptnoLoading = true
            getDeptnoTree().then(res => {
                if(res.code === '00000') {
                    this.deptnoTree = res.data
                }
                this.loading.deptnoLoading = false
            })
        },
        getDeptnoUser() {
            let params = {
                deptnoids: this.$refs.tree.getCheckedKeys().join(','),
                projectid: 1
            }
            this.loading.userList = true
            getDeptnoUser(params).then(res => {
                if(res.code === '00000') {
                    this.userList = res.data
                }
                this.loading.userList = false
            })
        },
        getTopTime(){
            if (this.form.timeQuantum.length != 0) {
                this.form.starttime = this.form.timeQuantum[0]
                this.form.endtime = this.form.timeQuantum[1]
            }
        },
        addNotice(){
            let json = {
                createtime: new Date().getTime(),
                deadtime: this.form.endtime,
                title: this.form.title,
                content: this.form.content,
                senduser: this.userCheckList.join(',')
            }
            if(this.dateCheck){
                json.deadtime = -1
            }
            if(this.form.title === ''){
                this.$message({
                    message: '请填写文章标题',
                    type: 'warning'
                })
                return false
            }
            if(this.form.content === ''){
                this.$message({
                    message: '请填写公告内容',
                    type: 'warning'
                })
                return false
            }
            if(this.form.endtime === ''){
                this.$message({
                    message: '请选择公告时间',
                    type: 'warning'
                })
                return false
            }
            if(this.userCheckList.length === 0){
                this.$message({
                    message: '请选择要通知的人员',
                    type: 'warning'
                })
                return false
            }
            let params = {
                json: JSON.stringify(json),
                s_username: this.$store.getters.name
            }
            addNotice(params).then(res => {
                if(res.code === '00000'){
                    this.$notify({
                        title: '成功',
                        message: '发布成功',
                        type: 'success',
                        duration: 2 * 1000
                    });
                    this.resetForm()
                }
            })
        },
        resetTree() {
            this.$refs.tree.setCheckedKeys([])
        },
        resetForm() {
            this.resetTree()
            this.form.title = ''
            this.form.content = ''
            this.filterText = ''
            this.editorInstance.setContent(this.form.content)
            this.form.timeQuantum = []
            this.userCheckList = []
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.input_num_box {
    position: relative;
    padding-right: 60px;
}
.input_num {
    position: absolute;
    right: 0;
    font-size: 16px;
    top: 50%;
    margin-top: -8px;
}
.treeWrap {
    max-height: 450px;
    overflow: auto;
    h4{
        margin: 4px 0;
    }
}
.userList{
    border: 1px solid #ccc;
    padding: 6px;
    min-height: 100px;
}
.user_null{
    line-height: 100px;
    text-align: center;
    color: #999;
    font-size: 24px;
}
.tree_control{
    display: flex;
    align-items: center;
}
</style>
