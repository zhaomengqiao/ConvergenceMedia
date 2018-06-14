<template>
<section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" :rules="rules" ref="ruleForm">
            <el-row>
                <el-radio-group v-model="type" prop="type">
                    <el-radio label="news">新闻</el-radio>
                    <el-radio label="videos">视频</el-radio>
                    <el-radio label="imgs">图集</el-radio>
                </el-radio-group>
            </el-row>
            <el-form-item>
                <el-upload class="upload-demo" accept='text/plain' :action="filters.newurl" :before-upload="beforePosterUpload" :on-success="handleChange" :file-list="fileList3">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传text文件，且不超过5m</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="addBlackDialog = true">加黑</el-button>
                <el-button type="primary" size="small" @click="add404Dialog = true">稿件替换</el-button>
                <el-button type="primary" size="small" @click="delete404Dialog = true">稿件删除</el-button>
                <el-button type="primary" size="small" @click="addhkBlackDialog = true">香港加黑</el-button>
                <el-button type="primary" size="small" @click="deletehk404Dialog = true">香港删除</el-button>
                <el-button type="primary" size="small" @click="addDfsportBlackDialog = true">东方体育加黑</el-button>
                <el-button type="primary" size="small" @click="addDfsport404Dialog = true">东方体育删除</el-button>
                <el-button type="primary" size="small" @click="addMore('ruleForm',3)">测试</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--加黑理由dialog-->
    <el-dialog title="加黑理由" :visible.sync="addBlackDialog" size="tiny">
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addBlackMail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addBlackReason" auto-complete="off" placeholder="请输入加黑理由"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addBlackDialog = false">取 消</el-button>
            <el-button type="primary" @click="addMore('ruleForm',1)">确定</el-button>
        </div>
    </el-dialog>
    <!--404理由dialog-->
    <el-dialog title="404理由" :visible.sync="add404Dialog" size="tiny">
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="add404Mail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="add404Reason" auto-complete="off" placeholder="请输入稿件替换理由"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="add404Reason = false">取 消</el-button>
            <el-button type="primary" @click="addMore('ruleForm',2)">确定</el-button>
        </div>
    </el-dialog>
    <!--delete404理由dialog-->
    <el-dialog title="404理由" :visible.sync="delete404Dialog" size="tiny">
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="delete404Mail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="delete404Reason" auto-complete="off" placeholder="请输入稿件删除理由"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="delete404Reason = false">取 消</el-button>
            <el-button type="primary" @click="addMore('ruleForm',4)">确定</el-button>
        </div>
    </el-dialog>
    <!--香港加黑理由dialog-->
    <el-dialog title="香港加黑理由" :visible.sync="addhkBlackDialog" size="tiny">
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addhkBlackMail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addhkBlackReason" auto-complete="off" placeholder="请输入加黑理由"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addhkBlackDialog = false">取 消</el-button>
            <el-button type="primary" @click="addMore('ruleForm',5)">确定</el-button>
        </div>
    </el-dialog>
    <!--delete404理由dialog-->
    <el-dialog title="404理由" :visible.sync="deletehk404Dialog" size="tiny">
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="deletehk404Mail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="deletehk404Reason" auto-complete="off" placeholder="请输入稿件删除理由"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="deletehk404Reason = false">取 消</el-button>
            <el-button type="primary" @click="addMore('ruleForm',6)">确定</el-button>
        </div>
    </el-dialog>
    <!--东方体育加黑理由dialog-->
    <el-dialog title="东方体育加黑理由" :visible.sync="addDfsportBlackDialog" size="tiny">
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addDfsportBlackMail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addDfsportBlackReason" auto-complete="off" placeholder="请输入稿件删除理由"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDfsportBlackReason = false">取 消</el-button>
            <el-button type="primary" @click="addMore('ruleForm',7)">确定</el-button>
        </div>
    </el-dialog>
    <!--东方体育404理由dialog-->
    <el-dialog title="东方体育404理由" :visible.sync="addDfsport404Dialog" size="tiny">
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addDfsport404Mail" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="">
                <el-input v-model.trim="addDfsport404Reason" auto-complete="off" placeholder="请输入稿件删除理由"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDfsport404Reason = false">取 消</el-button>
            <el-button type="primary" @click="addMore('ruleForm',8)">确定</el-button>
        </div>
    </el-dialog>
</section>
</template>

<script>
import {
    uploadTaskAdd,
    UploadTaskUrl
} from '@/api/operationTools'

export default {
    data() {
        return {
            type: '',
            filters: {
                newurl: '',
                newXurl: '',
                isblack: '',
                isid: ''
            },
            fileList2: [],
            fileList3: [],
            fileName: '',
            rules: {
                type: [{
                    required: true,
                    message: '请选择类型',
                    trigger: 'change'
                }]
            },
            // 原因dialog
            addBlackDialog: false,
            addhkBlackDialog: false,
            add404Dialog: false,
            delete404Dialog: false,
            deletehk404Dialog: false,
            addDfsportBlackDialog: false,
            addDfsport404Dialog: false,
            addBlackReason: '',
            addhkBlackReason: '',
            addDfsportBlackReason: '',
            add404Reason: '',
            delete404Reason: '',
            deletehk404Reason: '',
            addDfsport404Reason: '',
            addBlackMail: '',
            addhkBlackMail: '',
            add404Mail: '',
            delete404Mail: '',
            deletehk404Mail: '',
            addDfsportBlackMail: '',
            addDfsport404Mail: ''
        }
    },
    mounted() {
        this.filters.newurl = UploadTaskUrl;
    },
    methods: {
        handleChange(file, fileList) {
            this.fileName = file.name;
        },
        beforePosterUpload(file) {
            const isJPG = file.type === 'text/plain';
            const isLt2M = file.size / 1024 / 1024 < 5;

            if (!isJPG) {
                this.$message.error('上传文件只能是TXT格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 5MB!');
            }
            return isJPG && isLt2M;
        },
        addMore(formName, type) {
            if (this.type == '') {
                this.$notify({
                    title: '提示',
                    message: '请选择类型',
                    type: 'warning'
                });
                return
            }
            var para;
            var task;
            // 加黑
            if (type == '1') {
                if (this.addBlackReason == '') {
                    this.$message({
                        type: 'warning',
                        message: '请填写相应的理由'
                    });
                    return false
                }
                switch (this.type) {
                    case 'news':
                        task = "newblk"
                        break;
                    case 'videos':
                        task = "videoblk"
                        break;
                    case 'imgs':
                        task = "picblk"
                        break;
                }
                para = {
                    name: this.fileName,
                    task: task,
                    mail: this.addBlackMail,
                    reason: this.addBlackReason
                }
                // 404
            } else if (type == '2') {
                if (this.add404Reason == '') {
                    this.$message({
                        type: 'warning',
                        message: '请填写相应的理由'
                    });
                    return false
                }
                switch (this.type) {
                    case 'news':
                        task = "new404"
                        break;
                    case 'videos':
                        task = "video404"
                        break;
                    case 'imgs':
                        task = "pic404"
                        break;
                }
                para = {
                    name: this.fileName,
                    task: task,
                    mail: this.add404Mail,
                    reason: this.add404Reason
                }
                // test
            } else if (type == '3') {
                para = {
                    name: this.fileName,
                    task: "test1"
                }
                // 删稿
            } else if (type == '4') {
                if (this.delete404Reason == '') {
                    this.$message({
                        type: 'warning',
                        message: '请填写相应的理由'
                    });
                    return false
                }
                if (this.type == 'news') {
                    para = {
                        name: this.fileName,
                        task: "newdelete404",
                        mail: this.delete404Mail,
                        reason: this.delete404Reason
                    }
                } else {
                    this.$notify({
                        title: '注意',
                        message: '只有新闻可执行该操作',
                        type: 'success'
                    });
                    this.delete404Dialog = false;
                    return false
                }
            } else if (type == '5') {
                if (this.addhkBlackReason == '') {
                    this.$message({
                        type: 'warning',
                        message: '请填写相应的理由'
                    });
                    return false
                }
                switch (this.type) {
                    case 'news':
                        task = "hknewblk"
                        break;
                    case 'videos':
                        task = "hkvideoblk"
                        break;
                    case 'imgs':
                        task = "hkpicblk"
                        break;
                }
                para = {
                    name: this.fileName,
                    task: task,
                    mail: this.addhkBlackMail,
                    reason: this.addhkBlackReason
                }
            } else if (type == '6') {
                if (this.deletehk404Reason == '') {
                    this.$message({
                        type: 'warning',
                        message: '请填写相应的理由'
                    });
                    return false
                }
                if (this.type == 'news') {
                    para = {
                        name: this.fileName,
                        task: "hknewdelete404",
                        mail: this.deletehk404Mail,
                        reason: this.deletehk404Reason
                    }
                } else {
                    this.$notify({
                        title: '注意',
                        message: '只有新闻可执行该操作',
                        type: 'success'
                    });
                    this.deletehk404Dialog = false;
                    return false
                }
            } else if (type == '7') {
                // 东方体育加黑
                if (this.addDfsportBlackReason == '') {
                    this.$message({
                        type: 'warning',
                        message: '请填写相应的理由'
                    });
                    return false
                }
                switch (this.type) {
                    case 'news':
                        task = "dfsnewblk"
                        break;
                    case 'videos':
                        task = "dfsvideoblk"
                        break;
                    case 'imgs':
                        task = "dfspicblk"
                        break;
                }
                para = {
                    name: this.fileName,
                    task: task,
                    mail: this.addDfsportBlackMail,
                    reason: this.addDfsportBlackReason
                }
            } else if (type == '8') {
                if (this.addDfsport404Reason == '') {
                    this.$message({
                        type: 'warning',
                        message: '请填写相应的理由'
                    });
                    return false
                }
                switch (this.type) {
                    case 'news':
                        task = "dfsnew404"
                        break;
                    case 'videos':
                        task = "dfsvideo404"
                        break;
                    case 'imgs':
                        task = "dfspic404"
                        break;
                }
                para = {
                    name: this.fileName,
                    task: task,
                    mail: this.addDfsportBlackMail,
                    reason: this.addDfsport404Reason
                }

            }
            this.addBlackDialog = false;
            this.add404Dialog = false;
            this.delete404Dialog = false;
            this.addhkBlackDialog = false;
            this.deletehk404Dialog = false;
            this.addDfsportBlackDialog = false
            this.addDfsport404Dialog = false
            uploadTaskAdd(para).then(res => {
                if (res.code == '00001') {
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success'
                    });
                }
            });
        },
        selsChange(sels) { //全选
            this.sels = sels;
        },

    }
}
</script>

<style scoped>
</style>
