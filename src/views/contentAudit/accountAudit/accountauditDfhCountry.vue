<template lang="html">
    <section class="dfhPerson accountAuditTemp" v-loading="dialogLoading">
        <el-alert
            :title="warningTitle"
            type="warning"
            :description="warningText"
            class="mb-10"
            show-icon
            v-if="dialogData.isauditmodify=='0' && dialogData.reason">
        </el-alert>
        <!--修改信息Begin-->
        <el-card class="box-card" v-if="dialogData.isauditmodify=='2'">
            <div slot="header" class="clearfix">
                <span>修改信息</span>
            </div>
            <el-row :gutter="40">
                <el-col :span="8">
                    <div class="flex-box">
                        <div class="flex-label">东方号名称</div>
                        <div class="flex-text">{{ dialogData.mediaName }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">东方号介绍</div>
                        <div class="flex-text">{{ dialogData.mediaDesc }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">所在地</div>
                        <div class="flex-text">{{ dialogData.seatof }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">详细地址</div>
                        <div class="flex-text">{{ dialogData.enterpriseAddress }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">其他联系方式</div>
                        <div class="flex-text">{{ dialogData.otherContactInfo }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">联系邮箱</div>
                        <div class="flex-text">{{ dialogData.operatorEmail }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="clearfix">
                        <div class="img-box">
                            <div class="title">东方号头像</div>
                            <div class="img-content">
                                <img :src="dialogData.mediaHeadPic" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.mediaHeadPic,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="mb-10">
                        <el-radio-group v-model="modifyRadio" @change="changeReason">
                            <el-radio label="通过">通过</el-radio>
                            <el-radio label="拒绝">拒绝</el-radio>
                        </el-radio-group>
                    </div>
                    <el-select v-model="modifyReason" v-if="modifyRadio=='拒绝'" placeholder="请选择" filterable @change="changeReason" multiple>
                        <el-option-group
                            v-for="(group,index) in dfhInforSelections"
                            :key="index"
                            :label="group.label">
                            <el-option
                                v-for="(item,i) in group.options"
                                :key="i"
                                :label="item.label"
                                :value="group.value + '-' + item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-col>
            </el-row>
        </el-card>
        <!--修改信息End-->
        <!--东方号信息Begin-->
        <el-card class="box-card" :class="dialogData.isauditmodify=='2'?'mt-10':''">
            <div slot="header" class="clearfix">
                <span>东方号信息</span>
            </div>
            <el-row :gutter="40">
                <el-col :span="8">
                    <div class="flex-box">
                        <div class="flex-label">东方号名称</div>
                        <div class="flex-text">{{ dialogData.oldmediaName }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">东方号介绍</div>
                        <div class="flex-text">{{ dialogData.oldmediaDesc }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">主发类型</div>
                        <div class="flex-text">{{ dialogData.primarytype }}</div>
                    </div>
                    <div class="flex-box">
                        <div class="flex-label">媒体领域</div>
                        <div class="flex-text">{{ dialogData.field }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="clearfix">
                        <div class="img-box">
                            <div class="title">东方号头像</div>
                            <div class="img-content">
                                <img :src="dialogData.oldmediaHeadPic" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.oldmediaHeadPic,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="mb-10">
                        <el-radio-group v-model="modifyRadio" @change="changeReason">
                            <el-radio label="通过">通过</el-radio>
                            <el-radio label="拒绝">拒绝</el-radio>
                        </el-radio-group>
                    </div>
                    <el-select v-model="modifyReason" v-if="dfhInforRadio=='拒绝'" placeholder="请选择" filterable @change="changeReason" multiple>
                        <el-option-group
                            v-for="(group,index) in dfhInforSelections"
                            :key="index"
                            :label="group.label">
                            <el-option
                                v-for="(item,i) in group.options"
                                :key="i"
                                :label="item.label"
                                :value="group.value + '-' + item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-col>
            </el-row>
        </el-card>
        <!--东方号信息End-->
        <!--机构资料Begin-->
        <el-card class="box-card mt-10">
            <div slot="header" class="clearfix">
                <span>机构资料</span>
            </div>
            <el-row :gutter="40">
                <el-col :span="8">
                    <div class="flex-box moreLong">
                        <div class="flex-label">机构级别</div>
                        <div class="flex-text">{{ dialogData.institutionsNiveau }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">机构名称</div>
                        <div class="flex-text">{{ dialogData.enterpriseName }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">机构代码</div>
                        <div class="flex-text">{{ dialogData.organizationNum }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">详细地址</div>
                        <div class="flex-text">{{ dialogData.enterpriseAddress }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="clearfix">
                        <div class="img-box">
                            <div class="title">机构代码证</div>
                            <div class="img-content">
                                <img :src="dialogData.organizationCode" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.organizationCode,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                        </div>
                        <div class="img-box">
                            <div class="title">授权扫描件</div>
                            <div class="img-content">
                                <img :src="dialogData.certificateAuthorization" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.certificateAuthorization,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                        </div>
                        <div class="img-box">
                            <div class="title">入驻公函</div>
                            <div class="img-content">
                                <img :src="dialogData.missive" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.missive,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="mb-10">
                        <el-radio-group v-model="organizationRadio" @change="changeReason">
                            <el-radio label="通过">通过</el-radio>
                            <el-radio label="拒绝">拒绝</el-radio>
                        </el-radio-group>
                    </div>
                    <el-select v-model="organizationReason" placeholder="请选择" v-if="organizationRadio=='拒绝'" filterable @change="changeReason" multiple>
                        <el-option-group
                            v-for="(group,index) in organizationSelections"
                            :key="index"
                            :label="group.label">
                            <el-option
                                v-for="(item,i) in group.options"
                                :key="i"
                                :label="item.label"
                                :value="group.value + '-' + item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-col>
            </el-row>
        </el-card>
        <!--机构资料End-->
        <!--运营者资料Begin-->
        <el-card class="box-card mt-10">
            <div slot="header" class="clearfix">
                <span>运营者资料</span>
                <el-button type="primary" :disabled="dialogData.isauditmodify=='2'" @click="verifyIdentity" class="ml-10" :loading="verifyLoading" v-if="verifyText==''">实名认证</el-button>
                <span style="margin-left:10px" v-if="verifyText!=''">{{ verifyText }}</span>
            </div>
            <el-row :gutter="40">
                <el-col :span="8">
                    <div class="flex-box moreLong">
                        <div class="flex-label">运营者姓名</div>
                        <div class="flex-text">{{ dialogData.operatorName }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">运营者身份证号</div>
                        <div class="flex-text">{{ dialogData.operatorId }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">所在地</div>
                        <div class="flex-text">{{ dialogData.seatof }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">详细地址</div>
                        <div class="flex-text">{{ dialogData.enterpriseAddress }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">运营者电话</div>
                        <div class="flex-text">{{ dialogData.operatorTelephone }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">联系邮箱</div>
                        <div class="flex-text">{{ dialogData.operatorEmail }}</div>
                    </div>
                    <div class="flex-box moreLong">
                        <div class="flex-label">其他联系方式</div>
                        <div class="flex-text">{{ dialogData.otherContactInfo }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="clearfix">
                        <div class="img-box">
                            <div class="title">身份证照片</div>
                            <div class="idcard_box">
                                <img :src="dialogData.idcardpicface" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.idcardpicface,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                            <div class="idcard_box mt-10">
                                <img :src="dialogData.idcardreverse" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.idcardreverse,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                        </div>
                        <div class="img-box">
                            <div class="title">相似身份证</div>
                            <div class="idcard_withUser">
                                <img :src="dialogData.operatorIdPic" alt="">
                                <div class="img-box_tools" @click.stop="imgToBig(dialogData.operatorIdPic,'infor')">
                                    <i class="el-icon-zoom-in"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="mb-10">
                        <el-radio-group v-model="operatorRadio" @change="changeReason">
                            <el-radio label="通过">通过</el-radio>
                            <el-radio label="拒绝">拒绝</el-radio>
                        </el-radio-group>
                    </div>
                    <el-select v-model="operatorReason" placeholder="请选择" v-if="operatorRadio=='拒绝'" filterable @change="changeReason" multiple>
                        <el-option-group
                            v-for="(group,index) in operatorSelections"
                            :key="index"
                            :label="group.label">
                            <el-option
                                v-for="(item,i) in group.options"
                                :key="i"
                                :label="item.label"
                                :value="group.value + '-' + item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-col>
            </el-row>
        </el-card>
        <!--运营者资料End-->
        <el-card class="mt-10">
            <div class="flex-box">
                <div class="flex-label">审核意见</div>
                <div class="flex-text">
                    <el-radio-group v-model="isPass" :disabled="true">
                        <el-radio :label="2">通过</el-radio>
                        <el-radio :label="1">不通过</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="flex-box">
                <div class="flex-label">通知内容</div>
                <div class="flex-text">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="notification">
                    </el-input>
                </div>
            </div>
            <div class="flex-box">
                <div class="flex-text">
                    <el-button type="primary" @click="submitData" :loading="submitLoading">确认</el-button>
                </div>
            </div>
        </el-card>
        <!--图片放大 Dialog Begin-->
        <el-dialog :visible.sync="imgScaleDialog" :modal="false" append-to-body :before-close="resetImg">
            <div class="dialog-img_wrap">
                <div class="dialog-img_box">
                    <img width="100%" :src="imgScale" id="showImg">
                </div>
                <div class="btn-control mt-10">
                    <el-button type="primary" @click="toBig('big')">放大</el-button>
                    <el-button type="primary" @click="toBig('small')">缩小</el-button>
                    <el-button type="primary" @click="toBig('restore')">还原</el-button>
                </div>
            </div>
        </el-dialog>
        <!--图片放大 Dialog End-->
    </section>
</template>

<script>
import {
    checkReview,
    submitReview,
    verifyIdentity
} from '@/api/audit'

export default {
    mounted(){
        this.getWarning()
    },
    props:[
        'dialogData',
        'dialogLoading'
    ],
    data() {
        let text = ''
        if(this.dialogData.isauditmodify == '2'){
            text = '亲爱的创作者，你修改的信息已通过审核'
        }else{
            text = '亲爱的创作者，恭喜你通过东方号入驻审核，成为东方号的新手，您每天可发表3篇文章。现在就开始创作吧！'
        }
        return {
            dialogType: '',
            verifyText: '',
            bigLevel: 1,
            submitLoading: false,
            verifyLoading: false,
            isPass: 2,
            notification: text,
            modifyRadio: '通过',
            dfhInforReason: [],
            modifyReason: [],
            dfhInforRadio: '通过',
            dfhInforSelections: [
                {
                    label: '东方号名称',
                    value: '东方号名称',
                    options: [
                        {
                            label: '请勿含有「东方」、「头条」等文字。',
                            value: '请勿含有「东方」、「头条」等文字。'
                        },
                        {
                            label: '请和其他平台保持一致。',
                            value: '请和其他平台保持一致。'
                        },
                        {
                            label: '含无意义字符或字母。',
                            value: '含无意义字符或字母。'
                        },
                        {
                            label: '根据相关法律法规要求，为保护用户商标权利、著作权等权利，现东方号升级身份核验系统。 对于已有重复名称的账号，实行更严格的审核标准。请您重新提交审核。',
                            value: '根据相关法律法规要求，为保护用户商标权利、著作权等权利，现东方号升级身份核验系统。 对于已有重复名称的账号，实行更严格的审核标准。请您重新提交审核。'
                        },
                        {
                            label: '个人不能申请使用第三方品牌名称。',
                            value: '个人不能申请使用第三方品牌名称。'
                        }
                    ]
                },
                {
                    label: '资质证明',
                    value: '资质证明',
                    options: [
                        {
                            label: '缺少相关行业从业资质证书',
                            value: '缺少相关行业从业资质证书'
                        },
                        {
                            label: '请提交与运营人信息相符的从业资格证书',
                            value: '请提交与运营人信息相符的从业资格证书'
                        }
                    ]
                },
                {
                    label: '发文领域',
                    value: '发文领域',
                    options: [
                        {
                            label: '不符合要求。',
                            value: '不符合要求。'
                        },
                        {
                            label: '申请领域与提供的辅助材料文章主体不符。',
                            value: '申请领域与提供的辅助材料文章主体不符。'
                        }
                    ]
                },
                {
                    label: '东方号介绍',
                    value: '东方号介绍',
                    options: [
                        {
                            label: '含明显营销推广意图。',
                            value: '含明显营销推广意图。'
                        },
                        {
                            label: '含联系方式如微博、手机号、QQ。',
                            value: '含联系方式如微博、手机号、QQ。'
                        },
                        {
                            label: '媒体介绍与申请帐号定位不一致。',
                            value: '媒体介绍与申请帐号定位不一致。'
                        }
                    ]
                },
                {
                    label: '东方号头像',
                    value: '东方号头像',
                    options: [
                        {
                            label: '图片模糊',
                            value: '图片模糊'
                        },
                        {
                            label: '材料不真实。',
                            value: '材料不真实。'
                        },
                        {
                            label: '不清晰',
                            value: '不清晰'
                        },
                        {
                            label: '含明显营销推广意图。',
                            value: '含明显营销推广意图。'
                        },
                        {
                            label: '含联系方式如微博、手机号、QQ。',
                            value: '含联系方式如微博、手机号、QQ。'
                        },
                        {
                            label: '请不要使用第三方品牌Logo作为头像。',
                            value: '请不要使用第三方品牌Logo作为头像。'
                        },
                        {
                            label: '头像低俗、缺乏健康度。',
                            value: '头像低俗、缺乏健康度。'
                        }
                    ]
                }
            ],
            organizationReason: [],
            organizationRadio: '通过',
            organizationSelections: [
                {
                    label: '机构代码证扫描件',
                    value: '机构代码证扫描件',
                    options: [
                        {
                            label: '图片模糊。',
                            value: '图片模糊。'
                        },
                        {
                            label: '材料涉嫌弄虚作假。',
                            value: '材料涉嫌弄虚作假。'
                        },
                        {
                            label: '扫描件注册号填写错误。',
                            value: '扫描件注册号填写错误。'
                        },
                        {
                            label: '企业定位与企业经营范围无关。',
                            value: '企业定位与企业经营范围无关。'
                        }
                    ]
                },
                {
                    label: '授权书扫描件',
                    value: '授权书扫描件',
                    options: [
                        {
                            label: '图片模糊。',
                            value: '图片模糊。'
                        },
                        {
                            label: '材料涉嫌弄虚作假。',
                            value: '材料涉嫌弄虚作假。'
                        },
                        {
                            label: '信息填写错误，请按照授权书模板修改信息。',
                            value: '信息填写错误，请按照授权书模板修改信息。'
                        },
                        {
                            label: '认证信息填写错误，请填写正确的企业名称。',
                            value: '认证信息填写错误，请填写正确的企业名称。'
                        },
                        {
                            label: '信息填写不完整，请按照授权书模板填写完整。',
                            value: '信息填写不完整，请按照授权书模板填写完整。'
                        }
                    ]
                },
                {
                    label: '地址',
                    value: '地址',
                    options: [
                        {
                            label: '请填写正确的省市名称。',
                            value: '请填写正确的省市名称。'
                        },
                        {
                            label: '请填写正确详细地址',
                            value: '请填写正确详细地址'
                        }
                    ]
                },
                {
                    label: '入驻公函',
                    value: '入驻公函',
                    options: [
                        {
                            label: '未加盖公章',
                            value: '未加盖公章'
                        },
                        {
                            label: '内容填写错误',
                            value: '内容填写错误'
                        }
                    ]
                }
            ],
            operatorReason: [],
            operatorRadio: '通过',
            operatorSelections: [
                {
                    label: '运营者资料',
                    value: '运营者资料',
                    options: [
                        {
                            label: '身份证图片模糊。',
                            value: '身份证图片模糊。'
                        },
                        {
                            label: '材料涉嫌弄虚作假',
                            value: '材料涉嫌弄虚作假'
                        },
                        {
                            label: '身份证照片照片中身份证信息不清晰（请确保证件文字清晰可见，且不存在镜像翻转效果）。',
                            value: '身份证照片照片中身份证信息不清晰（请确保证件文字清晰可见，且不存在镜像翻转效果）。'
                        },
                        {
                            label: '姓名与照片中身份证上不一致。',
                            value: '姓名与照片中身份证上不一致。'
                        },
                        {
                            label: '身份证号码与照片中身份证上不一致。',
                            value: '身份证号码与照片中身份证上不一致。'
                        },
                        {
                            label: '请上传运营者手持身份证照片。',
                            value: '请上传运营者手持身份证照片。'
                        },
                        {
                            label: '请填写正确的省市名称。',
                            value: '请填写正确的省市名称。'
                        },
                        {
                            label: '请填写正确详细地址',
                            value: '请填写正确详细地址'
                        }
                    ]
                },
            ],
            warningTitle: '',
            warningText: '',
            // dialog
            imgScaleDialog: false,
            imgScale: ''
        }
    },
    methods: {
        getWarning(){
            if(this.dialogData.fixnum){
                this.warningTitle =  '此用户已被拒绝' + this.dialogData.fixnum + '次'
            }
            if(this.dialogData.reason){
                this.warningText = '上次拒绝原因(' + this.dialogData.reason + ')'
            }else{
                this.warningText = ''
            }
        },
        imgToBig(url,type){
            if(type == 'infor'){
                window.open(url)
            }else{
                if(type=='text'){
                    this.dialogType = 'text'
                }
                this.imgScale = url
                this.imgScaleDialog = true
            }
        },
        resetImg(){
            this.bigLevel = 1
            this.imgScaleDialog = false
            this.dialogType = ''
        },
        toBig(type){
            var img = document.querySelector('#showImg')
            switch (type) {
                case 'big':
                    if(this.bigLevel <= 5){
                        this.bigLevel ++
                    }
                    break;
                case 'small':
                    if(this.bigLevel > 1){
                        this.bigLevel --
                    }
                    break;
                case 'restore':
                    this.bigLevel = 1
                    break;
                default:
                    this.bigLevel = 1
            }
            img.style.transform = 'scale(' + this.bigLevel + ')'
        },
        changeReason(){
            if(this.dialogData.isauditmodify=='2'){
                if(this.modifyRadio === '通过' && this.dfhInforRadio === '通过' && this.organizationRadio === '通过' && this.operatorRadio === '通过') {
                    this.isPass = 2
                    this.notification = '亲爱的创作者，恭喜你通过东方号入驻审核，成为东方号的新手，您每天可发表3篇文章。现在就开始创作吧！'
                }else {
                    this.isPass = 1
                    this.notification = ''
                    if(this.modifyRadio != '通过'){
                        this.notification += '东方号信息：'
                        this.modifyReason.forEach((item,index) => {
                            this.notification += (index+1) + '.' + item + '\n'
                        })
                    }
                    if(this.dfhInforRadio != '通过'){
                        this.notification += '东方号信息：'
                        this.dfhInforReason.forEach((item,index) => {
                            this.notification += (index+1) + '.' + item + '\n'
                        })
                    }
                    if(this.operatorRadio != '通过'){
                        this.notification += '运营者资料：'
                        this.operatorReason.forEach((item,index) => {
                            this.notification += (index+1) + '.' + item + '\n'
                        })
                    }
                    if(this.organizationRadio != '通过'){
                        this.notification += '机构资料：'
                        this.organizationReason.forEach((item,index) => {
                            this.notification += (index+1) + '.' + item + '\n'
                        })
                    }
                }
            }else {
                if(this.dfhInforRadio === '通过' && this.organizationRadio === '通过' && this.operatorRadio === '通过') {
                    this.isPass = 2
                    this.notification = '亲爱的创作者，恭喜你通过东方号入驻审核，成为东方号的新手，您每天可发表3篇文章。现在就开始创作吧！'
                }else {
                    this.isPass = 1
                    this.notification = ''
                    if(this.dfhInforRadio != '通过'){
                        this.notification += '东方号信息：'
                        this.dfhInforReason.forEach((item,index) => {
                            this.notification += (index+1) + '.' + item + '\n'
                        })
                    }
                    if(this.operatorRadio != '通过'){
                        this.notification += '运营者资料：'
                        this.operatorReason.forEach((item,index) => {
                            this.notification += (index+1) + '.' + item + '\n'
                        })
                    }
                    if(this.organizationRadio != '通过'){
                        this.notification += '机构资料：'
                        this.organizationReason.forEach((item,index) => {
                            this.notification += (index+1) + '.' + item + '\n'
                        })
                    }
                }
            }

        },
        // 身份认证
        verifyIdentity() {
            let params = {
                name: this.dialogData.operatorName,
                idcard: this.dialogData.operatorId
            }
            this.verifyLoading = true
            verifyIdentity(params).then(res => {
                if(res.code === '00001'){
                    this.verifyText = res.data.resultMsg
                }
                this.verifyLoading = false
            })
        },
        submitData(){
            let params = {
                type: 'api/toexamine',
                userid: this.dialogData.userId
            }
            checkReview(params).then(res => {
                if(res.code === '00001'){
                    // 如果返回0，代表未审核
                    if(res.data === '0'){
                        let params = {
                            type:'api/toexamine',
                            userid: this.dialogData.userId,
                            ispass: this.isPass,
                            reasons: this.notification
                        }
                        this.submitLoading = true
                        submitReview(params).then(res => {
                            if(res.code === '00001'){
                                this.$message({
                                    type: 'success',
                                    message: '提交成功'
                                })
                                this.submitLoading = false
                                this.$emit('closeDialog','countryDialog')
                            }
                        })
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '已被审核'
                        })
                    }
                }
            })
        }
    },
    watch: {
        'dialogData': function(){
            this.getWarning()
            let text = ''
            if(this.dialogData.isauditmodify == '2'){
                text = '亲爱的创作者，你修改的信息已通过审核'
            }else{
                text = '亲爱的创作者，恭喜你通过东方号入驻审核，成为东方号的新手，您每天可发表3篇文章。现在就开始创作吧！'
            }
            this.verifyText = ''
            this.notification = text
            this.dfhInforRadio = '通过'
            this.dfhInforReason = []
            this.modifyRadio = '通过'
            this.modifyReason = []
            this.operatorRadio = '通过'
            this.operatorReason = []
            this.organizationRadio = '通过'
            this.organizationReason = []
        }
    }
}
</script>

<style lang="scss" scoped="scope">
.flex-box{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 24px;
    .flex-label{
        width: 100px;
        font-weight: 600;
    }
    .flex-text{
        flex: 1
    }
    &.moreLong{
        .flex-label{
            width: 130px;
            font-weight: 600;
        }
    }
}
.img-box{
    font-weight: 600;
    float: left;
    margin-right: 20px;
    .title{
        margin-bottom: 20px;
    }
    .img-content{
        width: 140px;
        height: 140px;
        color: #fff;
        line-height: 140px;
        text-align: center;
        position: relative;
        cursor: pointer;
        &:hover .img-box_tools{
            visibility: visible;
        }
        img{
            width: 100%;
            height: 100%;
        }
    }
}
.img-box_tools{
    position: absolute;
    font-size: 20px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    top: 0;
    left: 0;
    visibility: hidden;
}
.idcard_box{
    width: 200px;
    height: 140px;
    line-height: 140px;
    text-align: center;
    position: relative;
    background-color: #ccc;
    color: #fff;
    cursor: pointer;
    &:hover .img-box_tools{
        visibility: visible;
    }
    img{
        max-width: 200px
    }
}
.idcard_withUser{
    width: 200px;
    height: 290px;
    line-height: 290px;
    text-align: center;
    overflow: hidden;
    position: relative;
    color: #fff;
    cursor: pointer;
    &:hover .img-box_tools{
        visibility: visible;
    }
    img{
        max-width: 200px
    }
}
.article-img{
    height: 160px;
    width: 200px;
    line-height: 160px;
    text-align: center;
    overflow: hidden;
    position: relative;
    color: #fff;
    cursor: pointer;
    &:hover .img-box_tools{
        visibility: visible;
    }
    img{
        max-height: 160px;
    }
}
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 200px;
    &:hover {
        color: #58B7FF;
    }
}
.dialog-img_wrap{
    .dialog-img_box{
        height: 500px;
        overflow: auto;
        img{
            max-height: 500px;
            display: block;
            margin: 0 auto;
            width: auto;
        }
    }
}
.btn-control{
    text-align: center;
}
</style>
