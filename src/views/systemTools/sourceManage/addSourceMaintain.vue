<template lang="html">
    <section class="addUrlfrom">
        <el-row style="padding-top:40px">
            <el-col :span="16">
                <el-form label-position="right" :rules="rules" ref="ruleForm" :model="form">
                    <el-form-item label="URLFrom：" prop="urlfrom" :label-width="labelWidth">
                        <el-input v-model.trim="form.urlfrom" placeholder="请输入urlfrom"></el-input>
                    </el-form-item>
                    <el-form-item label="信源名称：" prop="urlfromName" :label-width="labelWidth">
                        <el-input v-model.trim="form.urlfromName" placeholder="请输入信源名称" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="上线时间：" prop="onlinetime" :label-width="labelWidth">
                        <el-date-picker
                            v-model="form.onlinetime"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否免审：" prop="noAudit" :label-width="labelWidth">
                        <el-radio-group v-model="form.noAudit">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="信源类型：" prop="urlfromType" :label-width="labelWidth">
                        <el-select v-model="form.urlfromType" placeholder="请选择信源类型" >
                            <el-option
                                v-for="(item,index) in urlfromTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="采集类型：" prop="gatherType" :label-width="labelWidth">
                        <el-radio-group v-model="form.gatherType">
                            <el-radio label="直接采集">直接采集</el-radio>
                            <el-radio label="RSS同步">RSS同步</el-radio>
                            <el-radio label="接口同步">接口同步</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="" prop="apiComment" :label-width="labelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入接口说明"
                            v-model.trim="form.apiComment">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="首页链接：" prop="homepage" :label-width="labelWidth">
                        <el-input v-model.trim="form.homepage" placeholder="请输入首页链接" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="采集负责人：" prop="gatherPeople" :label-width="labelWidth">
                        <el-input v-model.trim="form.gatherPeople" placeholder="请输入采集负责人" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="作用区域：" prop="activeArea" :label-width="labelWidth">
                        <el-input v-model.trim="form.activeArea" placeholder="头条/香港/美国" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="信源等级：" prop="urlfromLevel" :label-width="labelWidth">
                        <el-select v-model="form.urlfromLevel" placeholder="请选择信源类型" >
                            <el-option
                                v-for="(item,index) in urlfromLevels"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="站点规模：" prop="scale" :label-width="labelWidth">
                        <el-select v-model="form.scale" placeholder="请选择站点规模" >
                            <el-option
                                v-for="(item,index) in scales"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注信息：" prop="comment" :label-width="labelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入备注信息"
                            v-model.trim="form.comment">
                        </el-input>
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
    parseTime,
} from '@/utils'
import {
    addUrlfrom
} from '@/api/systemTools'
export default {
    data() {
        return {
            labelWidth: "120px",
            form: {
                urlfrom: '',
                urlfromName: '',
                urlfromType: '',
                gatherType: '',
                apiComment: '',
                homepage: '',
                gatherPeople: '',
                urlfromType: '',
                scale: '',
                onlinetime: '',
                activeArea: '',
                urlfromLevel: '',
                noAudit: ''
            },
            urlfromTypes: [{
                    label: '新闻',
                    value: '新闻'
                },
                {
                    label: '视频',
                    value: '视频'
                },
                {
                    label: '图集',
                    value: '图集'
                }
            ],
            urlfromLevels: [{
                    label: '一级',
                    value: '1'
                },
                {
                    label: '二级',
                    value: '2'
                },
                {
                    label: '三级',
                    value: '3'
                },
                {
                    label: '四级',
                    value: '4'
                },
                {
                    label: '五级',
                    value: '5'
                },
                {
                    label: '六级',
                    value: '6'
                },
                {
                    label: '七级',
                    value: '7'
                },
                {
                    label: '八级',
                    value: '8'
                },
                {
                    label: '九级',
                    value: '9'
                },
                {
                    label: '十级',
                    value: '10'
                }
            ],
            scales: [{
                    label: '小型站点',
                    value: '小型站点'
                },
                {
                    label: '中型站点',
                    value: '中型站点'
                },
                {
                    label: '大型站点',
                    value: '大型站点'
                },
                {
                    label: '特大型站点',
                    value: '特大型站点'
                }
            ],
            rules: {
                urlfrom: [{
                    required: true,
                    message: '请输入urlfrom',
                    trigger: 'blur'
                }, ],
                urlfromName: [{
                    required: true,
                    message: '请输入信源名称',
                    trigger: 'blur'
                }, ],
                urlfromType: [{
                    required: true,
                    message: '请选择信源类型',
                    trigger: 'blur'
                }],
                gatherType: [{
                    required: true,
                    message: '请选择采集类型',
                    trigger: 'blur'
                }],
                apiComment: [{
                    required: true,
                    message: '请输入接口说明',
                    trigger: 'blur'
                }],
                homepage: [{
                    required: true,
                    message: '请输入首页链接',
                    trigger: 'blur'
                }],
                gatherPeople: [{
                    required: true,
                    message: '请输入采集负责人',
                    trigger: 'blur'
                }],
                activeArea: [{
                    required: true,
                    message: '请输入作用区域',
                    trigger: 'blur'
                }],
                urlfromLevel: [{
                    required: true,
                    message: '请选择信源等级',
                    trigger: 'blur'
                }],
                scale: [{
                    required: true,
                    message: '请选择站点规模',
                    trigger: 'blur'
                }],
                onlinetime: [{
                    type: 'date',
                    required: true,
                    message: '请选择上线时间',
                    trigger: 'change'
                }],
                noAudit: [{
                    required: true,
                    message: '请选择是否免审',
                    trigger: 'blur'
                }]
            }
        }
    },
    mounted() {

    },
    methods: {
        saveData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 接口同步和rss导入 需要拼接参数
                    let gatherType = this.form.gatherType
                    if ((this.form.gatherType == '接口同步') || (this.form.gatherType == 'RSS同步')) {
                        gatherType = this.form.gatherType + '(' + this.form.apiComment + ')'
                    }
                    let params = {
                        onlinetime: parseTime(new Date(this.form.onlinetime).getTime(), '{y}-{m}-{d} {h}:{i}:{s}'),
                        usearea: this.form.activeArea,
                        sourcelevel: this.form.urlfromLevel,
                        sourcetype: this.form.urlfromType,
                        grabtype: gatherType,
                        grabuser: this.form.gatherPeople,
                        urlfrom: this.form.urlfrom,
                        sourcename: this.form.urlfromName,
                        sitelevel: this.form.scale,
                        homepage: this.form.homepage,
                        isused: 0,
                        remark: this.form.comment,
                        isreview: this.form.noAudit
                    }
                    addUrlfrom(params).then(res => {
                        if (res.code = '00001') {
                            this.$notify({
                                title: '成功',
                                message: '添加成功',
                                type: 'success'
                            });
                            this.clearData()
                        }
                    })
                }
            })

        },
        clearData() {
            this.$refs.ruleForm.resetFields();
        }
    }
}
</script>

<style lang="css">
</style>
