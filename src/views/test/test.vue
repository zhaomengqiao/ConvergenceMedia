<template lang="html">
    <section class="dynamicAudit">
        <hulk-table :tableData="tableData"
                    :table_config="tableConfig"
                    :total="total"
                    :loading="listLoading"
        ></hulk-table>
    </section>
</template>

<script>
import QRCode from 'qrcodejs2'
import hulkTable from '@/components/Table/index'
import {
    getUrlfromLiveList
} from '@/api/systemTools'
import {
    getGameList
} from '@/api/contentManage'


export default {
    components: {
        hulkTable
    },
    data() {
        return {
            tableData: [],
            total: 0,
            listLoading: false,
            tableConfig: [
                {
                    type: 'primary',
                    label: 'URLFrom',
                    prop: ''
                }
            ]
        }
    },
    mounted(){
        this.getList()
        this.getGameList()
        // this.initCanvas()
    },
    methods: {
        getGameList() {
            let params = {
                pageNum: 1,
                pageSize: 10
            }
            getGameList(params).then(res => {

            })
        },
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
                page: '',
                pagesize: '',
                isreview: '',
                sourcename: ''
            }
            this.listLoading = true
            getUrlfromLiveList(params).then(res => {
                if (res.code == "00001") {
                    if (res.data) {
                        this.tableData = res.data.data
                        this.total = res.data.count
                    } else {
                        this.tableData = []
                        this.total = 0
                    }
                }
                this.listLoading = false
            })
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
    text-align: center;
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
