<template lang="html">
    <section class="accountAudit">
        <el-card>
            <!--当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 <el-form> 标签上添加 @submit.native.prevent-->
            <el-form :inline="true" :model="form" @submit.native.prevent>
                <el-row>
                    <el-form-item style="margin-bottom:0">
                        <el-input v-model="form.keywords" placeholder="请输入名称关键词搜索" @keyup.enter.native="getList" style="width:340px;"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button type="primary" @click="search">搜索</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-row>
                <el-table :data="tableData"
                          highlight-current-row
                          v-loading="listLoading"
                          style="width: 100%;"
                          tooltip-effect="dark"
                          stripe border>
                    <el-table-column prop="mediaName" label="东方号名称" min-width="140" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="userId" label="账号ID" width="200" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="entryType" label="媒体类型" width="140" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.entryType | getMediaTypeTag">{{ scope.row.entryType | getMediaType }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="registTime" label="申请时间" width="220" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="mobile" label="手机号码" width="160" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="registsource" label="注册渠道" width="160" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.registsource | getRegisterFrom }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pwd" label="邀请码" min-width="160" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="isauditmodify" label="状态" width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.isauditmodify | getState }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type='primary' size='small' @click='openAudit(scope.row)'>审核</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
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
                  style="float:right;"
                  >
                </el-pagination>
            </el-row>
        </el-card>
        <!--账号审核 东方号 个人dialog Begin-->
        <el-dialog :visible.sync="personDialog" :fullscreen="true" :close-on-click-modal="false">
			<accountauditDfhPerson :dialogData="dialogData"
                                   :dialogLoading="dialogLoading"
                                   @closeDialog="closeDialog"
                                   v-if="personDialog"
                                   ></accountauditDfhPerson>
		</el-dialog>
        <!--账号审核 东方号 个人dialog End-->
        <!--账号审核 东方号 企业媒体其他组织dialog Begin-->
        <el-dialog :visible.sync="companyDialog" :fullscreen="true" :close-on-click-modal="false">
			<accountauditDfhCompany  :dialogData="dialogData"
                                     :dialogLoading="dialogLoading"
                                     :title="companyTitle"
                                     v-if="companyDialog"
                                     @closeDialog="closeDialog"></accountauditDfhCompany>
		</el-dialog>
        <!--账号审核 东方号 企业媒体其他组织dialog End-->
        <!--账号审核 东方号 国家dialog Begin-->
        <el-dialog :visible.sync="countryDialog" :fullscreen="true" :close-on-click-modal="false">
			<accountauditDfhCountry :dialogData="dialogData"
                                    :dialogLoading="dialogLoading"
                                    v-if="countryDialog"
                                    @closeDialog="closeDialog"></accountauditDfhCountry>
		</el-dialog>
        <!--账号审核 东方号 国家dialog End-->
    </section>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    searchReview,
    reviewAddQuery
} from '@/api/audit'
import accountauditDfhPerson from './accountauditDfhPerson.vue'
import accountauditDfhCompany from './accountauditDfhCompany.vue'
import accountauditDfhCountry from './accountauditDfhCountry.vue'

export default {
    components: {
        accountauditDfhPerson,
        accountauditDfhCompany,
        accountauditDfhCountry
    },
    computed: {
        ...mapGetters([
            'personalConfig'
        ])
    },
    data() {
        return {
            personDialog: false,
            companyDialog: false,
            countryDialog: false,
            dialogData: '',
            dialogLoading: false,
            form: {
                keywords: ''
            },
            tableData: [],
            total: 0,
            listLoading: false,
            currentPage: 1,
            pageSize: 10,
            companyTitle: ''
        }
    },
    mounted() {
        this.pageSize = this.personalConfig.tableRowShow
        this.search()
    },
    filters: {
        getMediaTypeTag(val) {
            switch (val) {
                case '1':
                    return ''
                    break
                case '2':
                    return 'success'
                    break
                case '3':
                    return 'danger'
                    break
                case '4':
                    return 'success'
                    break
                case '5':
                    return 'success'
                    break
            }
        },
        getMediaType(val) {
            // 1=个人、2=企业、3=国家机构、4=媒体、5其他组织
            switch (val) {
                case '1':
                    return '个人'
                    break
                case '2':
                    return '企业'
                    break
                case '3':
                    return '国家机构'
                    break
                case '4':
                    return '媒体'
                    break
                case '5':
                    return '其他组织'
                    break
            }
        },
        getRegisterFrom(val) {
            switch (val) {
                case 'wx':
                    return '微信端'
                    break
                case 'pc':
                    return 'PC端'
                    break
            }
        },
        getState(val) {
            switch (val) {
                case '0':
                    return '新增'
                    break
                case '1':
                    return ''
                    break
                case '2':
                    return '修改'
                    break
            }
        },
    },
    methods: {
        // 关闭dialog
        closeDialog(val){
            this[val] = false
            this.getList()
        },
        search() {
            this.currentPage = 1
            this.getList()
        },
        getList() {
            let params = {
                type: 'api/toexamine',
                content: this.form.keywords,
                startpage: this.currentPage,
                pagesize: this.pageSize
            }
            this.listLoading = true
            searchReview(params).then(res => {
                if (res.code === '00001') {
                    this.tableData = res.data.dataPageData
                    this.total = res.data.dataCount
                }
                this.listLoading = false
            })
        },
        // 打开审核页面
        openAudit(row) {
            if(row.entryType == 1) {
                this.personDialog = true
            }else if(row.entryType == 2 || row.entryType == 4 || row.entryType == 5) {
                this.companyDialog = true
                switch (row.entryType) {
                    case '2':
                        this.companyTitle = '企业资料'
                        break;
                    case '4':
                        this.companyTitle = '媒体资料'
                        break;
                    case '5':
                        this.companyTitle = '其他组织资料'
                        break;
                    default:
                        this.companyTitle = '企业资料'
                }
            }else if(row.entryType == 3) {
                this.countryDialog = true
            }

            this.dialogLoading = true
            let params = {
                type: 'api/toexamine',
                id: row.userId
            }
            reviewAddQuery(params).then(res => {
                if(res.code === '00001'){
                    this.dialogData = res.data
                }
                this.dialogLoading = false
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

<style lang="css">
</style>
