<template lang="html">
    <el-upload
        :action="uploadUrl"
        :before-upload="beforeAvatarUpload"
        :on-success="handleSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过5MB</div>
    </el-upload>
</template>

<script>
import { uploadFilmEditing } from '@/api/operationTools'
export default {
    data(){
        return {
            uploadUrl: ''
        }
    },
    mounted(){
        this.uploadUrl = uploadFilmEditing
    },
    methods: {
        beforeAvatarUpload(file) {
            const isTxt = file.type === 'text/plain';
            const isLt5M = file.size / 1024 / 1024 < 5;

            if (!isTxt) {
                this.$message.error('上传文件只能是 TXT 格式!');
            }
            if (!isLt5M) {
                this.$message.error('上传文件大小不能超过 5MB!');
            }
            return isTxt && isLt5M;
        },
        handleSuccess() {
            this.$notify({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2*1000
            })
        }
    }
}
</script>

<style lang="css">
</style>
