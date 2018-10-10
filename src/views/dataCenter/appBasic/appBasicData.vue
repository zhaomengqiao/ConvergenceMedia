<template>
    <div>
        <el-form :inline="true" :model="form">
            <el-form-item label="時間：">
                <el-date-picker
                  v-model="dateRange"
                  @change="dateRangeChange"
                  type="daterange"
                  align="right"
                  placeholder="選擇日期範圍"
                  :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="軟件名稱：">香港頭條</el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查詢</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="24">
                <div id="chartContainer" style=""></div>
            </el-col>
        </el-row>
        <el-table :data="tableData" class="roomList" highlight-current-row tooltip-effect="dark" stripe border align="center" v-loading="listLoading" :default-sort = "{prop: 'dt', order: 'descending'}" style="width: 100%;" max-height="300">
            <el-table-column
              prop="dt"
              label="時間"
              width="100"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="apptype"
              label="軟件名稱"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column label="基礎" align="center">
              <el-table-column
                prop="openuv"
                label="APP打開UV數(IMEI)"
                width="200"
                align="center"
                sortable>
              </el-table-column>
              <el-table-column
                prop="pv"
                label="總瀏覽量PV"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="uv"
                label="總訪客UV"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="p_u_rate"
                label="P/U"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="timeavg"
                label="人均時長"
                width="120"
                align="center"
                sortable
                :formatter="formatterTime"
                >
              </el-table-column>
              <el-table-column
                prop="onlineavg"
                label="人均在線時長(APP)"
                width="200"
                align="center"
                sortable
                :formatter="formatterTimeonline"
                >
              </el-table-column>
              <el-table-column
                prop="newuid_cnt"
                label="新增用戶數"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="total_newuid_cnt"
                label="累計新增用戶數"
                width="180"
                align="center"
                sortable
                >
              </el-table-column>
            </el-table-column>
            <el-table-column label="註冊" align="center">
              <el-table-column
                prop="register_phone"
                label="手機註冊用戶數"
                width="200"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="register_other"
                label="第三方註冊用戶數"
                width="200"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="total_register_cnt"
                label="累計註冊用戶數"
                width="200"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="register_rate"
                label="當日註冊率"
                width="140"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="total_register_rate"
                label="累計註冊率"
                width="140"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="active_register_cnt"
                label="活躍註冊用戶"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="register_active_rate"
                label="註冊活躍占比"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
            </el-table-column>
            <el-table-column label="新聞" align="center">
              <el-table-column
                prop="pv_news"
                label="pv"
                width="100"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="pvrate_news"
                label="pvrate"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="uv_news"
                label="uv"
                width="100"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="uvrate_news"
                label="uvrate"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
            </el-table-column>
            <el-table-column label="圖集" align="center">
              <el-table-column
                prop="pv_pic"
                label="pv"
                width="100"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="pvrate_pic"
                label="pvrate"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="uv_pic"
                label="uv"
                width="100"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="uvrate_pic"
                label="uvrate"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
            </el-table-column>
            <el-table-column label="視頻" align="center">
              <el-table-column
                prop="video_pv"
                label="pv"
                width="100"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="pvrate_video"
                label="pvrate"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="video_uv"
                label="uv"
                width="100"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="uvrate_video"
                label="uvrate"
                width="120"
                align="center"
                sortable
                >
              </el-table-column>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total,sizes, prev, pager, next,jumper"
              :page-sizes=[10,15,20,50,100]
              :current-page="form.page"
              :page-size="form.pagesize"
              :total="total"
              style="float:right;"
              >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import jsonp from 'jsonp';

    export default {
        data() {
          return {
            chart: null,
            series: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            seriesName: ["APP打開UV數(IMEI)", "總瀏覽量PV", "總訪客UV", "P/U", "新增用戶數", "累計新增用戶數", "手機註冊用戶數", "第三方註冊用戶數", "累計註冊用戶數", "當日註冊率", "累計註冊率", "活躍註冊用戶", "註冊活躍占比", "新聞pv", "新聞pvrate", "新聞uv", "新聞uvrate", "圖片pv", "圖片pvrate", "圖片uv", "圖片uvrate","視頻pv", "視頻pvrate", "視頻uv", "視頻uvrate"],
            labelWidth:"120px",
            listLoading:false,
            dateRange:'',
            total:0,
            form:{
                stime:'',
                etime:'',
                page:1,
                pagesize:100
            },
            tableData:[],
            chartData:{
                dt: [],
                openuv: [],
                pv: [],
                uv: [],
                p_u_rate: [],
                newuid_cnt: [],
                total_newuid_cnt: [],
                register_phone: [],
                register_other: [],
                total_register_cnt: [],
                register_rate: [],
                total_register_rate: [],
                active_register_cnt: [],
                register_active_rate: [],
                pv_news: [],
                pvrate_news: [],
                uv_news: [],
                uvrate_news: [],
                pv_pic: [],
                pvrate_pic: [],
                uv_pic: [],
                uvrate_pic: [],
                video_pv: [],
                pvrate_video: [],
                video_uv: [],
                uvrate_video: []
            },
            pickerOptions: {
              shortcuts: [{
                text: '最近壹周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近壹個月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三個月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            }
          };
        },
        methods: {
            drawGraph(id) {
              // 绘图方法
              this.chart = echarts.init(document.getElementById(id));
              this.chart.showLoading();
              let that = this;
              let chartArr = [];
              let chartSeries = [];
              for(let key in this.chartData) {
                  if (this.chartData.hasOwnProperty(key)) {
                      chartArr.push(key);
                  }
              }
              chartSeries = this.series.map(function(item, index) {
                return {
                    name: that.seriesName[index],
                    type: 'line',
                    data: that.chartData[chartArr[index+1]]
                }
              })

              this.chart.setOption({
                 title: {

                 },
                 tooltip: {
                     trigger: 'item',
                     formatter: '{a} <br/>{b} : {c}'
                 },
                 legend: {
                     left: 'left',
                     data: that.seriesName,
                     selectedMode: 'single'
                 },
                 xAxis: {
                     type: 'category',
                     name: 'x',
                     splitLine: {show: false},
                     data: that.chartData.dt
                 },
                 grid: {
                     top: '25%',
                     left: '3%',
                     right: '4%',
                     bottom: '4%',
                     containLabel: true
                 },
                 yAxis: {
                     type: 'log',
                     name: 'y'
                 },
                 series: chartSeries
              })
              this.chart.hideLoading();

              // 表格resize
              setTimeout(function() {
                that.chart.resize();
              }, 0)
            },
            formatterTime: function(row, column) {
                return parseInt(row.timeavg / 60) + '分' + row.timeavg % 60 + '秒'
            },
            formatterTimeonline: function(row, column) {
                return parseInt(row.onlineavg / 60) + '分' + row.onlineavg % 60 + '秒'
            },
            toSecond: function(data) {
                let time = data.split('分').map(function(item) {
                  return parseInt(item);
                });
                let timeSecond = 0;
                if(time.length > 1) {
                  timeSecond = time[0]*60 + time[1];
                } else {
                  timeSecond = time[0];
                }
                return timeSecond;
            },
            dateRangeChange:function(val){
                var dateArr=val.split(' - ');
                this.form.stime=dateArr[0].split('-').join('');
                this.form.etime=dateArr[1].split('-').join('');
                // this.search();
            },
            handleCurrentChange(val) {
                this.form.page=val;
                this.search();
                // this.queryCreateList();
            },
            handleSizeChange(val){
                this.form.pagesize=val;
                // this.queryCreateList();
                this.search();
            },
            search:function(){
                this.queryCreateList()
            },
            init() {
                this.search();
            },
            queryCreateList() {
                let that = this;

                // 参数字符串
                let queryParam = 'pagesize=' + this.form.pagesize + '&page=' + this.form.page + '&startDate=' + this.form.stime + '&endDate=' + this.form.etime +'&callback';

                // jsonp回调函数
                window.jsonpdata = function(data) {
                    if (data.code === 200) {
                        data.datalist.forEach(function(item, index) {
                          item.openuv = parseInt(item.openuv);
                          item.uv = parseInt(item.uv);
                          item.pv = parseInt(item.pv);
                          item.timeavg = that.toSecond(item.timeavg);
                          item.onlineavg = that.toSecond(item.onlineavg);
                        })
                        that.tableData = data.datalist;
                        that.total = data.pagecount
                        that.listLoading = false;

                        // echart所需数据清空
                        for(let key in that.chartData) {
                            if (that.chartData.hasOwnProperty(key)) {
                                that.chartData[key] = [];
                            }
                        }
                        // echart所需数据格式转换
                        data.datalist.reverse().forEach(function(item, index) {
                            for(let key in that.chartData) {
                                if (that.chartData.hasOwnProperty(key)) {
                                    that.chartData[key].push(item[key]);
                                }
                            }
                        });

                        // 回调成功绘图
                        that.drawGraph('chartContainer')
                    } else {
                        console.log('fail')
                    }
                }
                this.listLoading = true;

                jsonp('http://tongji.021.com/datacenterapi/appbasedata/appdata?callbackparam=jsonpdata', {'param': queryParam, 'name': 'callback'}, function (err, data) {

                });
            }
        },
        mounted() {
            this.init();
        },
        activated() {
            this.search();
        }
      };
</script>
<style scoped>
    /*.block{
        margin-top: 20px;
    }*/
    .disabled{
        cursor:text;
        color:#bfcbd9;
    }
    a{
        color:#666;
        cursor:pointer;
        text-decoration:none;
    }
    a.disabled:hover{
        color:#bfcbd9;
    }
    a:hover{
        color:#0000ee;
    }
    #chartContainer {
      width: 100%;
      height: 400px;
    }
</style>
