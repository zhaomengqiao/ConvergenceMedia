<template>
    <div class="yzPCData">
        <el-form :inline="true" :model="form">
            <el-form-item label="时间：">
                <!-- <el-date-picker
                  v-model="dateRange"
                  @change="dateRangeChange"
                  type="daterange"
                  align="right"
                  placeholder="选择日期范围"
                  :picker-options="pickerOptions">
                </el-date-picker> -->
                <el-date-picker
                    v-model="timeStart"
                    type="date"
                    placeholder="选择开始时间"
                    align="right"
                    :picker-options="pickerOptions" @change="dateStartChange">
                  </el-date-picker>
                </el-form-item>
                至
                <el-date-picker
                    v-model="timeEnd"
                    type="date"
                    placeholder="选择结束时间"
                    align="right"
                    :picker-options="pickerOptions" @change="dateEndChange">
                  </el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item label="软件名称：" style="margin-left: 10px;">扬子头条</el-form-item>
        </el-form>
        <el-row>
            <el-col :span="24">
                <div id="chartContainer" style=""></div>
            </el-col>
        </el-row>
        <el-table :data="tableData" class="roomList" highlight-current-row tooltip-effect="dark" stripe border align="center" v-loading="listLoading" :default-sort = "{prop: 'dt', order: 'descending'}" style="width: 100%;">
            <el-table-column
              prop="dt"
              label="日期"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="pv"
              label="pv"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="uv"
              label="uv"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="ip"
              label="ip"
              align="center"
              sortable>
            </el-table-column>
        </el-table>
        <!-- <div class="block">
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
        </div> -->
    </div>
</template>

<script>
    import echarts from 'echarts';
    // import {appInfo} from '../../api/api';
    import jsonp from 'jsonp';

    export default {
        data() {
          return {
            timeStart: new Date().getTime() - 30 * 24 * 3600 * 1000,
            timeEnd: new Date().getTime(),
            chart: null,
            series: [{}, {}, {}],
            seriesName: ["总浏览量PV", "总访客UV", "总IP数"],
            seriesColor: ["#7bcaec", "#2b821d", "#d2676c"],
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
                pv: [],
                uv: [],
                ip: []
            },
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now();
              },
            }
          };
        },
        methods: {
            drawGraph(id) {
              // 绘图方法
              this.chart = echarts.init(document.getElementById(id))
              let that = this;
              let chartArr = [];
              let chartSeries = [];
              // console.log(this.chartData)
              for(let key in this.chartData) {
                  if (this.chartData.hasOwnProperty(key)) {
                      chartArr.push(key);
                  }
              }
              chartSeries = this.series.map(function(item, index) {
                return {
                    name: that.seriesName[index],
                    type: 'line',
                    lineStyle: {
                      normal: {
                        color: that.seriesColor[index]
                      }
                    },
                    itemStyle: {
                        normal: {
                            color: that.seriesColor[index],
                            borderColor: that.seriesColor[index]
                        }
                    },
                    data: that.chartData[chartArr[index+1]]
                }
              })

              this.chart.setOption({
                 title: {

                 },
                 tooltip: {
                     trigger: 'axis',
                     formatter: '{a} <br/>{b} : {c}'
                 },
                 legend: {
                     left: 'left',
                     data: that.seriesName,
                     selectedMode: 'single',
                     borderColor: '#d2676c'
                 },
                 xAxis: {
                     type: 'category',
                     name: '',
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
                     type: 'value',
                     name: ''
                 },
                 series: chartSeries
              })
              this.chart.hideLoading();

              // 表格resize
              setTimeout(function() {
                that.chart.resize();
              }, 0)
            },
            getUsefullDate:function(date){
              var date=new Date(date);
              var year=date.getFullYear(),
              month=date.getMonth()+1,
              day=date.getDate(),
              monthStr=month>9 ? month+'':'0'+month,
              dayStr=day>9 ? day+'':'0'+day;
              return year+''+monthStr+''+dayStr;
            },
            getFormatDate: function(date) {
              return date.replace(/\-/g, '');
            },
            dateStartChange:function(date){
              this.form.stime = date;
              this.search();
            },
            dateEndChange:function(date){
              this.form.etime = date;
              this.search();
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
            queryCreateList() {
                let that = this;

                // 参数字符串
                let queryParam = 'startDate=' + this.getFormatDate(this.form.stime) + '&endDate=' + this.getFormatDate(this.form.etime) +'&callback';

                // jsonp回调函数
                window.pcdata = function(data) {
                    if (data.code === 200) {
                        data.datalist.forEach(function(item, index) {
                          item.uv = parseInt(item.uv);
                          item.pv = parseInt(item.pv);
                          item.ip = parseInt(item.ip);
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

                jsonp('http://tongji.021.com/datacenterapi/yzttpcperdaygatherdata/yzttpcperdaygather?callbackparam=pcdata', {'param': queryParam, 'name': 'callback'}, function (err, data) {

                });
            }
        },
        mounted() {
          this.form.stime = this.getUsefullDate(this.timeStart);
          this.form.etime = this.getUsefullDate(this.timeEnd);
            this.search();
        },
      };
</script>
<style scoped>
    .yzPCData{
        padding: 20px;
    }
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
