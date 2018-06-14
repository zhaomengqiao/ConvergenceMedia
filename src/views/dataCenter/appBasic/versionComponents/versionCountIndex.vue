<template>
    <div>
        <el-form :inline="true" :model="form">
            <el-button type="primary">按渠道</el-button>
            <el-button  @click="handleTopClick">按版本</el-button>
            <el-form-item label="时间：">
                <el-date-picker
                  v-model="timeCur"
                  type="date"
                  placeholder="选择时间"
                  align="right"
                  :picker-options="pickerOptions" @change="dateChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="软件名称：">扬子头条</el-form-item>
            <el-form-item label="渠道号：" prop="qid">
                <el-select v-model="form.qid" class="select-platform"
                    filterable placeholder="支持中文/拼音搜索" @change="optionChange">
                    <el-option
                        label="汇总"
                        value=""
                        >
                    </el-option>
                    <el-option
                        v-for="(item,index) in qid"
                        :key="item"
                        :label="item"
                        :value="item"
                        >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="24">
                <div id="chartContainer2" style=""></div>
            </el-col>
        </el-row>
        <div v-model="tableData" style="margin-top:20px;font-size: 14px;color: red;">返回渠道数: <em style="">{{ tableData.length }}</em></div>
        <el-table
            ref="singleTable"
            class="table-total-count"
            :data="tableDataTotal"
            border
            style="width: 100%; margin-top: 10px;"
            :default-sort = "{prop: 'dt', order: 'descending'}"
            highlight-current-row
            @row-click="selectCurrent"
            >
            <el-table-column
              prop="dt"
              width="100"
              label="日期"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              label="软件名称"
              prop="apptype"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              width="100"
              label="渠道名称"
              prop="appqid"
              align="center">
            </el-table-column>
            <el-table-column
              label="版本名称"
              width="100"
              align="center">
              <template slot-scope="scope">
                <el-button @click="handleVersionClick(scope.row)" type="text" size="middle">{{ scope.row.vf }}</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="用户分布"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleUserFbTotal(scope.row)" type="text" size="middle">{{ scope.row.uf }}</el-button>
                <el-button type="text" size="middle">{{ scope.row.uf }}</el-button>
              </template>
            </el-table-column>  -->
            <el-table-column
              prop="openuv"
              width="140"
              label="APP打开UV数(IMEI)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="pv"
              label="总浏览量pv"
              width="120"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="uv"
              width="120"
              label="总访客数uv"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="purate"
              label="P/U比"
              width="120"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="ip"
              label="IP数"
              width="100"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="onlineavg"
              label="日均总在线(APP)"
              align="center"
              width="160"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="timeavg"
              label="日均总在线(新闻、视频、图片)"
              align="center"
              width="160"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="news_onlinetime"
              label="新闻人均时长"
              width="140"
              align="center"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="video_onlinetime"
              label="视频人均时长"
              width="140"
              align="center"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="picture_onlinetime"
              label="图片人均时长"
              width="140"
              align="center"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column label="新闻" align="center">
              <el-table-column
                  prop="news_pv"
                  label="pv"
                  width="100"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="news_pvrate"
                  label="pvrate"
                  width="100"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
              <el-table-column
                  prop="news_uv"
                  label="uv"
                  width="100"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="news_uvrate"
                  label="uvrate"
                  width="100"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
            </el-table-column>
            <el-table-column label="图集" align="center">
              <el-table-column
                  prop="image_pv"
                  label="pv"
                  width="100"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="image_pvrate"
                  label="pvrate"
                  width="100"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
              <el-table-column
                  prop="image_uv"
                  label="uv"
                  width="100"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="image_uvrate"
                  label="uvrate"
                  width="100"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
            </el-table-column>
            <el-table-column label="视频" align="center">
              <el-table-column
                  prop="video_pv"
                  label="pv"
                  width="100"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="video_pvrate"
                  label="pvrate"
                  width="100"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
              <el-table-column
                  prop="video_uv"
                  label="uv"
                  width="100"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="video_uvrate"
                  label="uvrate"
                  width="100"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="80">
            </el-table-column>
        </el-table>

        <el-table
            ref="singleTable"
            :data="tableData"
            border
            style="width: 100%; margin-top: 20px;"
            :default-sort = "{prop: 'dt', order: 'descending'}"
            highlight-current-row
            @row-click="selectCurrent" >
            <el-table-column
              prop="dt"
              width="100"
              label="日期"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              label="软件名称"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleQdSoft(scope.row)" type="text" size="middle">{{ scope.row.apptype }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              label="渠道名称"
              align="center">
              <template slot-scope="scope">
                <el-button @click="handleQdDet(scope.row)" type="text" size="middle">{{ scope.row.appqid }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="版本名称"
              width="100"
              align="center">
              <template slot-scope="scope">
                <el-button @click="handleVerEveClick(scope.row)" type="text" size="middle">版本分布</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="用户分布"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleUserFbTotal(scope.row)" type="text" size="middle">用户分布</el-button>
                <el-button  type="text" size="middle">用户分布</el-button>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="openuv"
              width="140"
              label="APP打开UV数(IMEI)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="pv"
              label="总浏览量pv"
              width="120"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="uv"
              width="120"
              label="总访客数uv"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="purate"
              label="P/U比"
              width="120"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="ip"
              label="IP数"
              width="100"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="onlineavg"
              label="日均总在线(APP)"
              align="center"
              width="160"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="timeavg"
              label="日均总在线(新闻、视频、图片)"
              align="center"
              width="160"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="news_onlinetime"
              label="新闻人均时长"
              width="140"
              align="center"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="video_onlinetime"
              label="视频人均时长"
              width="140"
              align="center"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column
              prop="picture_onlinetime"
              label="图片人均时长"
              width="140"
              align="center"
              sortable
              :formatter="formatterTime">
            </el-table-column>
            <el-table-column label="新闻" align="center">
              <el-table-column
                  prop="news_pv"
                  label="pv"
                  width="80"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="news_pvrate"
                  label="pvrate"
                  width="80"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
              <el-table-column
                  prop="news_uv"
                  label="uv"
                  width="80"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="news_uvrate"
                  label="uvrate"
                  width="80"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
            </el-table-column>
            <el-table-column label="图集" align="center">
              <el-table-column
                  prop="image_pv"
                  label="pv"
                  width="80"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="image_pvrate"
                  label="pvrate"
                  width="80"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
              <el-table-column
                  prop="image_uv"
                  label="uv"
                  width="80"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="image_uvrate"
                  label="uvrate"
                  width="80"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
            </el-table-column>
            <el-table-column label="视频" align="center">
              <el-table-column
                  prop="video_pv"
                  label="pv"
                  width="80"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="video_pvrate"
                  label="pvrate"
                  width="80"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
              <el-table-column
                  prop="video_uv"
                  label="uv"
                  width="80"
                  align="center"
                  sortable>
              </el-table-column>
              <el-table-column
                  prop="video_uvrate"
                  label="uvrate"
                  width="80"
                  align="center"
                  sortable
                  :formatter="formatPercent">
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="80">
              <template slot-scope="scope">
                <el-button @click="handleQdHour(scope.row)" type="text" size="middle">详情</el-button>
              </template>
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
    import jsonp from 'jsonp';
    import echarts from 'echarts';
    export default {
        data() {
          return {
            timeCur: new Date().getTime()-3600 * 1000 * 24 * 1,
            currentRow: null,
            tableData: [],
            tableDataTotal: [],
            labelWidth:"120px",
            listLoading:false,
            total:0,
            qid: [],
            series: [{}, {}, {}, {}, {}],
            seriesName: ["APP打开UV数", "浏览量(pv)", "访问量(uv)", "总P/U","总IP数"],
            chartData:{
                openuv: [],
                pv: [],
                uv: [],
                purate: [],
                ip: [],
                appqid: []
            },
            pickerOptions: {
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }]
            },
            form:{
                page:1,
                pagesize:10,
                ctime: '',
                urlfrom: '',
                qid: ''
            },
            statusLabel:'请选择',
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
          },
          realAuthList: {}
          };
        },
        methods: {
          selectCurrent: function(row) {
            // this.currentRow = row.id;
            this.$refs.singleTable.setCurrentRow(row)
          },

          // 将小数转化为百分比
          formatPercent: function(row,column) {
            return row[column.property] + "%";
          },
          handleClick: function(row) {
            this.$emit('comchange', 'versionCountChild', row);
          },
          handleTopClick: function(row) {
            this.$emit('comchange', 'countByVersion');
          },
          handleVersionClick: function(row) {
            this.$emit('comchange', 'versionDisTotal', row);
          },
          handleVerEveClick: function(row) {
            this.$emit('comchange', 'versionDisEvery', row);
          },
          handleUserFbTotal: function(row) {
            this.$emit('comchange', 'userFbTotal', row);
          },
          handleQdSoft: function(row) {
            this.$emit('comchange', 'dayQdSoft', row);
          },
          handleQdDet: function(row) {
            this.$emit('comchange', 'dayQdDet', row);
          },
          handleQdHour: function(row) {
            this.$emit('comchange', 'dayQdHour', row);
          },
          formatterTime: function(row, column) {
            return parseInt(row[column.property] / 60) + '分' + row[column.property] % 60 + '秒'
          },
          toSecond: function(data) {
            if(data) {
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
            } else {
              return 0;
            }
          },
          dateChange: function(val){
            val = val || '';
            var dateArr=val.split(' - ');
            this.form.ctime=dateArr[0].split('-').join('');
            this.queryCreateList();
          },
          optionChange: function() {
            this.queryCreateList();
          },
          handleCurrentChange(val) {
              this.form.page=val;
              this.queryCreateList();
          },
          handleSizeChange(val){
              this.form.pagesize=val;
              this.queryCreateList();
          },
          getQid:function() {
            // jsonp回调函数
              var that = this;
              window.qid = function(data) {
                  if (data.code === 200) {
                      data.datalist.forEach(function(item,index){
                        that.qid.push(item.qid);
                      });
                      that.qid.splice(0, 1);
                      // console.log(that.qid);
                  } else {
                      console.log('fail')
                  }
              }

              jsonp('http://tongji.021.com/datacenterapi/appqidareaspreaddata/getqid?callbackparam=qid', null, function (err, data) {

              });
          },
          drawGraphBar(id) {
            // 绘图方法
            if(this.chart) {
              this.chart.clear();
              this.chart.dispose();
            }
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
                  type: 'bar',
                  barWidth: '60%',
                  data: that.chartData[chartArr[index]]
              }
            })
            // console.log(chartArr);
            // console.log(chartSeries);
            let option = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    left: 'left',
                    data: this.seriesName,
                    selectedMode: 'single'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.chartData.appqid,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : chartSeries
            };

            this.chart.setOption(option);
            this.chart.hideLoading();

            // 表格resize
            setTimeout(function() {
              that.chart.resize();
            }, 0)
          },
          queryCreateList() {
              let that = this;

              // 参数字符串
              let queryParam = 'pagesize=' + this.form.pagesize + '&page=' + this.form.page + '&startDate=' + this.form.ctime + '&endDate=' + this.form.ctime + '&appqid=' + this.form.qid + '&callback';

              // jsonp回调函数
              window.appdayqd = function(data) {
                  if (data.code === 200) {
                      data.datalist.forEach(function(item, index) {
                          item.openuv = parseInt(item.openuv) ? parseInt(item.openuv) : 0;
                          item.pv = parseInt(item.pv) ? parseInt(item.pv) : 0;
                          item.uv = parseInt(item.uv) ? parseInt(item.uv) : 0;
                          item.purate = parseFloat(item.purate) ? parseFloat(item.purate) : 0;
                          item.ip = parseInt(item.ip) ? parseInt(item.ip) : 0;
                          item.onlineavg = that.toSecond(item.onlineavg);
                          item.timeavg = that.toSecond(item.timeavg);
                          item.news_onlinetime = that.toSecond(item.news_onlinetime);
                          item.video_onlinetime = that.toSecond(item.video_onlinetime);
                          item.picture_onlinetime = that.toSecond(item.picture_onlinetime);
                          item.id = index;
                      });
                      data.totallist.forEach(function(item, index) {
                          item.openuv = parseInt(item.openuv) ? parseInt(item.openuv) : 0;
                          item.pv = parseInt(item.pv) ? parseInt(item.pv) : 0;
                          item.uv = parseInt(item.uv) ? parseInt(item.uv) : 0;
                          item.purate = parseFloat(item.purate) ? parseFloat(item.purate) : 0;
                          item.ip = parseInt(item.ip) ? parseInt(item.ip) : 0;
                          item.onlineavg = that.toSecond(item.onlineavg);
                          item.timeavg = that.toSecond(item.timeavg);
                          item.news_onlinetime = that.toSecond(item.news_onlinetime);
                          item.video_onlinetime = that.toSecond(item.video_onlinetime);
                          item.picture_onlinetime = that.toSecond(item.picture_onlinetime);
                          item.id = index;
                      });
                      that.tableData = data.datalist;
                      that.tableDataTotal = data.totallist;
                      that.tableDataTotal[1].vf = '版本分布';
                      that.tableDataTotal[1].uf = '用户分布';
                      that.total = data.pagecount;
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

                      // console.log(that.chartData);


                      // 回调成功绘图
                      that.drawGraphBar('chartContainer2')

                  } else {
                      console.log('fail')
                  }
              }
              this.listLoading = true;

              jsonp('http://tongji.021.com/datacenterapi/appdayqd/appdayqd?callbackparam=appdayqd', {'param': queryParam, 'name': 'callback'}, function (err, data) {

              });
          },
          init() {
              this.getQid();
              this.queryCreateList()
          }
        },
        mounted() {
            this.init()
        },
        activated() {
            this.queryCreateList()
        }
      };
</script>
<style scoped>
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
  #chartContainer2 {
    width: 1000px;
    height: 400px;
    margin: 0 auto;
  }
  .table-total-count th,
  .table-total-count td {
    background-color: #eef1f6;
  }
</style>
