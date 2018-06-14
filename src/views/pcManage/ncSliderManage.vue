<template>
<div class="yzSliderManage">
    <el-form align="right">
        <el-button @click="handleUpload" :disabled="!uploadStatus" type="primary" width="100px">上传</el-button>
    </el-form>
    <el-table :data="sliderData" border highlight-current-row v-loading="listLoading" style="width: 100%;margin: 10px auto;min-width:1060px">
        <el-table-column prop="" label="标题" align="center">
            <template slot-scope="scope">
                    <div style="height:100px">
                        <el-input v-model="scope.row.topic" @change="setSaveStatus(scope.row)" placeholder="请输入标题" style="width:200px;margin-top:34px" ></el-input>
                        <span>{{ getStrLength(scope.row.topic) }}字</span>
                    </div>
                </template>
        </el-table-column>
        <el-table-column prop="" label="链接" align="center">
            <template slot-scope="scope">
                    <div style="height:100px">
                        <div style="display:inline-block;"  @dblclick="openLink(scope.row)" >
                            <el-input v-model="scope.row.url" @change="setSaveStatus(scope.row)"placeholder="请输入链接" style="width:200px;margin-top:34px"></el-input>
                        </div>
                        <el-button @click="getTitle(scope.$index, scope.row)" type="text" size="middle">获取</el-button>
                    </div>
                </template>
        </el-table-column>
        <el-table-column prop="" label="缩略图" :show-overflow-tooltip="true" align="center" width="200px">
            <template slot-scope="scope">
                    <el-popover
                      ref="popover1"
                      placement="right"
                      width="150"
                      trigger="hover">
                      <a :href="scope.row.img" target="_blank">
                          <img :src="scope.row.img" style="width: 150px;">
                      </a>
                    </el-popover>
                    <div style="height:100px" class="yz-upload" @click="changeIndex(scope.$index)" v-popover:popover1>
                        <el-upload
                          class="avatar-uploader"
                          action="http://qqtt.dftoutiao.com/lunbo/upload"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload"
                          >
                          <img v-if="scope.row.img" :src="scope.row.img" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          <div slot="tip" class="el-upload__tip">点击上传或替换图片</div>
                        </el-upload>
                    </div>
                </template>
        </el-table-column>
        <el-table-column prop="" label="新闻类型" align="center" width="150px">
            <template slot-scope="scope">
                    <div style="height:100px">
                        <el-input v-model="scope.row.type" @change="setSaveStatus(scope.row)" placeholder="请输入" style="width:100px;margin-top:34px" :maxlength="maxlength"></el-input>
                    </div>
                </template>
        </el-table-column>
        <el-table-column prop="" label="操作" :show-overflow-tooltip="true" align="center" width="100px">
            <template slot-scope="scope">
                <el-button
                      size="small"
                      type="danger"
                      :disabled="!scope.row.change"
                      @click="handleSave(scope.$index, scope.row)">保存</el-button>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import $ from 'jquery'
export default {
    data() {
        return {
            appTypeId: 'NCJTT',
            listLoading: false,
            baseURL: 'http://qqtt.dftoutiao.com/lunbo',
            sliderData: [],
            index: 0,
            uploadStatus: false,
            maxlength: 4
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.sliderData[this.index].img = res.url;
            this.sliderData[this.index].change = true;
            this.uploadStatus = true;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG或PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleUpload() {
            let uploadEmpty = this.sliderData.filter(item => {
                return !item.topic.trim() && !item.url.trim() && !item.type.trim()
            }).length;

            // console.log(uploadEmpty)
            if (this.setUploadStatus > 0) {
                this.$message.warning('上传之前请先保存哦!');
            } else if (uploadEmpty > 0) {
                this.$message.warning('条目不能为空!');
            } else {
                let _this = this;
                let url = `${this.baseURL}/lunbo_update_all`
                if (this.appTypeId) {
                    url = `${this.baseURL}/lunbo_update_all?url?appTypeId=${this.appTypeId}`
                }
                $.get(url, function(data) {
                    if (data.status) {
                        _this.$message.success('上传成功');
                        _this.uploadStatus = false;
                    } else {
                        _this.$message.error('上传失败');
                    }
                })
            }
        },
        handleSave(index, row) {
            // console.log(index,row)
            let _this = this;
            let params = `topic=${row.topic}&url=${row.url}&img=${row.img}&idx=${row.idx}&type=${row.type}`
            if (this.appTypeId) {
                params = `topic=${row.topic}&url=${row.url}&img=${row.img}&idx=${row.idx}&type=${row.type}&appTypeId=${this.appTypeId}`
            }
            let urlSame = this.sliderData.filter((item, idx) => {
                return item.url === row.url && idx !== index
            }).length;
            // console.log(urlSame)
            if (!row.topic.trim()) {
                this.$message.warning('标题不能为空哦');
            } else if (!row.url.trim()) {
                this.$message.warning('链接不能为空哦');
            } else if (!row.type.trim()) {
                this.$message.warning('新闻类型不能为空哦');
            } else if (!row.img) {
                this.$message.warning('请上传图片哦');
            } else if (urlSame > 0) {
                this.$message.warning('链接不能重复哦');
            } else {
                $.get(`${this.baseURL}/lunbo_update_one?${params}`, function(data) {
                    if (data.status) {
                        _this.$message.success('保存成功');
                        row.change = false;
                    } else {
                        _this.$message.error('保存失败');
                    }
                })
            }
        },
        getStrLength(str) {
            if (typeof(str) == 'undefined') {
                return 0;
            }
            var cArr = str.match(/[^\x00-\xff]/ig);
            return (str.length + (cArr == null ? 0 : cArr.length)) / 2;
        },
        getInitInfo() {
            this.listLoading = true;
            let _this = this;
            let url = `http://qqtt.dftoutiao.com/yangzi/lunbo`;
            if (this.appTypeId) {
                url = `http://qqtt.dftoutiao.com/lunbo/list?appTypeId=${this.appTypeId}`;
            }
            $.get(url, function(data) {
                // console.log(data)
                _this.listLoading = false;
                for (let key in data) {
                    if (data[key] instanceof Object) {
                        data[key].change = false;
                        _this.sliderData.push(data[key])
                    }
                }
            })
        },
        getTitle(index, row) {
            let _this = this;
            let url = `${this.baseURL}/get_title1?url=${row.url}`;
            if (this.appTypeId) {
                url = `${this.baseURL}/get_title1?url=${row.url}&appTypeId=${this.appTypeId}`;
            }
            $.get(url, function(data) {
                // console.log(data, index, _this.sliderData)
                if (data.code === 0) {
                    row.topic = data.title;
                    row.change = true;
                    _this.uploadStatus = true;
                } else {
                    _this.$message.error('获取标题失败!');
                }
            })
        },
        changeIndex(index) {
            this.index = index;
        },
        setSaveStatus(row) {
            row.change = true;
            this.uploadStatus = true;
            // console.log(this.setUploadStatus)
        },
        openLink(row) {
            // console.log(row)
            window.open(row.url);
        },
        init() {
            this.getInitInfo()
        }
    },
    computed: {
        setUploadStatus() {
            return this.sliderData.filter((item) => {
                return item.change
            }).length
        }
    },
    mounted() {
        // this.init();
    },
    activated() {

    },
    created() {
        this.init();
    }
};
</script>
<style lang="scss" scoped="scoped">
.yzSliderManage{
    padding: 20px;
}
.yz-upload {
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 68px;
        line-height: 68px;
        text-align: center;
    }
    .avatar {
        width: 150px;
        height: 68px;
        display: inline-block;
    }
    .el-upload__tip {
        line-height: 1.2;
        margin-top: 0;
    }
}
</style>
