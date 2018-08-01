<template lang="html">
    <section class="dynamicAudit">
        <hulk-table :tableData="tableData"
                    :table_config="tableConfig"
                    :pagination="pagination"
                    :option="option"
                    :getList="getList"
        ></hulk-table>
    </section>
</template>

<script>
import QRCode from 'qrcodejs2'
import hulkTable from '@/components/Table/index'
import {
    getUrlfromLiveList,
    changeUseState
} from '@/api/systemTools'
import {
    parseTime,
} from '@/utils'

export default {
    components: {
        hulkTable
    },
    data() {
        return {
            tableData: [],
            option: {
                dynamicColumn: true,
                listLoading: false
            },
            tableConfig: [
                {
                    type: 'primary',
                    id: 1,
                    label: 'URLFrom',
                    prop: 'urlfrom',
                    width: '120'
                },
                {
                    type: 'tag',
                    id: 2,
                    label: '信源名称',
                    tagType: (row) => {
                        if(row.isused){
                            if ((new Date(row.onlinetime).getTime() - new Date().getTime()) <= 0) {
                                return 'success'
                            } else {
                                return 'infor'
                            }
                        }else {
                            return 'danger'
                        }
                    },
                    tagText: (row) => {
                        if(row.isused){
                            if ((new Date(row.onlinetime).getTime() - new Date().getTime()) <= 0) {
                                return '启用'
                            } else {
                                return '开发中'
                            }
                        }else {
                            return '停用'
                        }
                    }
                },
                {
                    type: 'primary',
                    id: 3,
                    label: '信源首页',
                    prop: 'homepage',
                    minWidth: '200'
                },
                {
                    type: 'primary',
                    id: 3,
                    label: '信源等级',
                    prop: 'sourcelevel',
                    width: '100'
                },
                {
                    type: 'primary',
                    id: 4,
                    label: '站点规模',
                    prop: 'sitelevel',
                    width: '120'
                },
                {
                    type: 'primary',
                    id: 5,
                    label: '上线时间',
                    prop: 'onlinetime',
                    width: '220'
                },
                {
                    type: 'operation',
                    id: 6,
                    label: '操作',
                    buttons: [
                        {
                            type: 'primary',
                            name: '停用',
                            hanleClick: (row) => {
                                this.changeUseState(row.idx, 0)
                            }
                        }
                    ]
                }
            ],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    mounted(){
        this.getList()
        // this.initCanvas()
    },
    methods: {
        getList() {
            let params = {
                stime: '',
                etime: '',
                createuser: '',
                sourcelevel: '',
                usearea: '',
                sourcetype: '',
                urlfrom: '',
                homepage: '',
                page: this.pagination.currentPage,
                pagesize: this.pagination.pageSize,
                isreview: '',
                sourcename: ''
            }
            this.option.listLoading = true
            getUrlfromLiveList(params).then(res => {
                if (res.code == "00001") {
                    if (res.data) {
                        this.tableData = res.data.data
                        this.pagination.total = res.data.count
                    } else {
                        this.tableData = []
                        this.pagination.total = 0
                    }
                }
                this.option.listLoading = false
            })
        },
        // 停用
        changeUseState(id, used) {
            this.$prompt('请输入理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: function(val) {
                    if (val == '' || val == null) {
                        return false
                    }
                },
                inputErrorMessage: '理由不能为空'
            }).then(({
                value
            }) => {
                let params = {
                    idx: id,
                    isused: used,
                    remark: parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}') + '-' + value
                }
                console.log(params)
                changeUseState(params).then(res => {
                    if (res.code == "00001") {
                        this.getList()
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    }
                })

            }).catch(() => {

            });
        },
        initCanvas() {
            const paint = this.$refs.paint
            let ctx = paint.getContext('2d')
            // 矩形
            // ctx.fillStyle="#409EFF"
            // ctx.fillRect(0,0,150,75)
            // 直线
            // ctx.moveTo(0,0)
            // ctx.lineTo(500,500)
            // ctx.stroke()
            // 圆
            // ctx.beginPath();
            // ctx.arc(250, 250, 250, 0,2 * Math.PI); // 中心 半径 起始角 结束角
            // ctx.stroke();
            // 文字
            // 文字 ---- 实心
            ctx.font = '30px Arial'
            ctx.fillText('Hello World',30,265)
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.dynamicAudit {
    padding: 20px;
}
#canvas{
    margin-top: 100px;
    border: 1px solid #ccc;
}
#qrcode{
    text-align: center;
    display: flex;
    justify-content: center;
}
</style>
