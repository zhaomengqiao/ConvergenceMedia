<template>
    <div>
        <el-form :inline="true" :model="form">
            <el-form-item label="时间：">
                <el-date-picker
                  v-model="dateRange"
                  @change="dateRangeChange"
                  type="daterange"
                  align="right"
                  placeholder="选择日期范围"
                  :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="软件名称：">扬子头条</el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
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
              label="时间"
              width="100"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="apptype"
              label="软件名称"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column label="基础" align="center">
              <el-table-column
                prop="openuv"
                label="APP打开UV数(IMEI)"
                width="200"
                align="center"
                sortable>
              </el-table-column>
              <el-table-column
                prop="pv"
                label="总浏览量PV"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="uv"
                label="总访客UV"
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
                label="人均时长"
                width="120"
                align="center"
                sortable
                :formatter="formatterTime"
                >
              </el-table-column>
              <el-table-column
                prop="onlineavg"
                label="人均在线时长(APP)"
                width="200"
                align="center"
                sortable
                :formatter="formatterTimeonline"
                >
              </el-table-column>
              <el-table-column
                prop="newuid_cnt"
                label="新增用户数"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="total_newuid_cnt"
                label="累计新增用户数"
                width="180"
                align="center"
                sortable
                >
              </el-table-column>
            </el-table-column>
            <el-table-column label="注册" align="center">
              <el-table-column
                prop="register_phone"
                label="手机注册用户数"
                width="200"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="register_other"
                label="第三方注册用户数"
                width="200"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="total_register_cnt"
                label="累计注册用户数"
                width="200"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="register_rate"
                label="当日注册率"
                width="140"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="total_register_rate"
                label="累计注册率"
                width="140"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="active_register_cnt"
                label="活跃注册用户"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
              <el-table-column
                prop="register_active_rate"
                label="注册活跃占比"
                width="150"
                align="center"
                sortable
                >
              </el-table-column>
            </el-table-column>
            <el-table-column label="新闻" align="center">
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
            <el-table-column label="图集" align="center">
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
            <el-table-column label="视频" align="center">
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
            seriesName: ["APP打开UV数(IMEI)", "总浏览量PV", "总访客UV", "P/U", "新增用户数", "累计新增用户数", "手机注册用户数", "第三方注册用户数", "累计注册用户数", "当日注册率", "累计注册率", "活跃注册用户", "注册活跃占比", "新闻pv", "新闻pvrate", "新闻uv", "新闻uvrate", "图片pv", "图片pvrate", "图片uv", "图片uvrate","视频pv", "视频pvrate", "视频uv", "视频uvrate"],
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
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
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
