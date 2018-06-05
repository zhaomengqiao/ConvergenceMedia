<template>
	<section>
		<div class="pull-right mb-10" v-if="timerShow">
            <el-button icon="el-icon-refresh" type="primary" @click="getDfwList" class="mr-10">刷新</el-button>
            <span style="color:#20A0FF;font-size:20px">{{ timeNum }}</span>s
            后系统将再次请求
        </div>
		<el-table :data="newExamList" border highlight-current-row v-loading="listLoading"
			 @selection-change="selsChange" style="width: 100%;margin: 0 auto;">
			<el-table-column type="selection" width="50" :selectable='selectableShow' >
			</el-table-column>
			<el-table-column  label="标题">
				<template slot-scope="scope">
					<div @click='handleDialog(scope.$index, scope.row)' class="hoverTitel">
						<el-tag type='danger' v-if="scope.row.isabroad == 1">境外</el-tag>
						<el-tag type='danger' v-if="scope.row.tfmaintype == 'junshi'">军事</el-tag>
						<span v-html="scope.row.contenttitleRed"></span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="关键词" width="160" :show-overflow-tooltip="true">
				<template slot-scope="scope">
					<span>{{
						(scope.row.reviewkey01 == ''?'': scope.row.reviewkey01)
						+(scope.row.reviewkey01 !== ''?'，' + scope.row.reviewkey02 : scope.row.reviewkey02)
						+(scope.row.reviewkey02 !== ''?'，' + scope.row.reviewkey03 : scope.row.reviewkey03)
					}}</span>
				</template>
			</el-table-column>
			<el-table-column label="分类" width="120" >
				<template slot-scope="scope">
					<span>{{ scope.row.urlmaintype }}</span>
				</template>
			</el-table-column>
			<el-table-column label="时间" width="170" >
				<template slot-scope="scope">
					<span v-if='scope.row.tfmaintype=="junshi"' style='color:red'>{{setDateTime(scope.row.crawlerts)}}</span>
					<span v-else>{{setDateTime(scope.row.crawlerts)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="urlfrom" label="信源" width="120" >
					<template slot-scope="scope">
						<span v-if='scope.row.tfmaintype=="junshi"' style='color:red'>{{scope.row.urlfrom}}</span>
						<span v-else>{{scope.row.urlfrom}}</span>
					</template>
			</el-table-column>
			<el-table-column prop="source" label="来源" width="150" >
				<template slot-scope="scope">
					<span v-if='scope.row.tfmaintype=="junshi"' style='color:red'>{{scope.row.source}}</span>
					<span v-else>{{ scope.row.source }}</span>
					<!--政务号标记-->
					<img src="../../../assets/audit_images/government.png" alt="" v-if="scope.row.dfhtype&&scope.row.dfhtype==3" style="vertical-align:-3px;">
				</template>
			</el-table-column>
			<el-table-column prop="purl" label="原始地址" :show-overflow-tooltip="true">
				<template slot-scope="scope">
					<a @click='handleDialog(scope.$index, scope.row)'>{{newExamList[scope.$index].purl}}</a>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="150" >
				<template slot-scope="scope">
					<el-button type="success" size="small" v-if="isAuth.newPassed"  @click="newPassed(scope.$index, scope.row)"  >通过</el-button>
					<el-button type="danger" size="small" v-if="isAuth.newNoPassed"  @click="showNoPassDialog(scope.$index, scope.row)" >拒绝</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-row class="mt-10">
			<el-button type="success" @click="batchRemove(0)"  v-if="isAuth.newPassed" :disabled="this.sels.length===0">全部通过</el-button>
			<el-button type="danger" @click="batchRemove(1)" v-if="isAuth.newNoPassed" :disabled="this.sels.length===0">全部拒绝</el-button>
		</el-row>
		<el-dialog title="东方网新闻详情" :visible.sync="addFormVisible" :fullscreen="true" :close-on-click-modal="false">
			<newDfwExam :new-exam="newExam" @listentPass='childEvent'  ref="newExam"></newDfwExam>
		</el-dialog>
	</section>
</template>

<script>
    import {
        parseTime
    } from '@/utils'
    import { contentToHtml } from '@/utils/contentTransform'
    import {
        getRedKeyWords
    } from '@/api/commonApi'
	import {
        removeExamData,
        getDfwNewExam,
        newPassed,
        newNoPassed,
        editNewPassed,
        editNewNoPassed
    } from '@/api/audit';
	import newDfwExam from './newDfwExam.vue'
	export default {
		data(){
			return{
				noAllPassVisible: false,
				dialogAll:{
					reasonAll:'',
					reasonSelectAll:'',
				},
				nowData: '',
				nowIndex: '',
				noPassVisible: false,
				timerShow: false,
				timeNum: 30,
				selfInterva: '',
				timerNum: '',
				newExam:[],
				newExamList:[],
				isAuth:{
		        	newPassed:false,
		        	newNoPassed:false
		      	},
				filters: {
					name:'',
					isblack:0,
				},
				addFormVisible: false,//详情界面是否显示
				addLoading: false,
		        keyList: [],
		        newsType:'eastday',
		        listLoading: false,
		        total:0,
		        pageSize:10,
		        newsSize:10,
		        page:1,
		        sels:[],
		        activeName:'1',//父元素选项卡
				//标红关键词
				redKeyWords: [],
				dialog:{
					reason:'',
					reasonSelect:'',
				},
				noPassedOptions: [
					{
						label: '一 政治类',
						options: [
							{
								label: '101 发布内容涉及政治或敏感信息，违背相关现行政策与法律法规',
								value: '101 发布内容涉及政治或敏感信息，违背相关现行政策与法律法规'
							}
						]
					},
					{
						label: '二 色情淫秽、低俗类',
						options: [
							{
								label: '201 发布内容涉及色情、淫秽信息',
								value: '201 发布内容涉及色情、淫秽信息'
							},
							{
								label: '202 发布内容包含低俗内容',
								value: '202 发布内容包含低俗内容'
							}
						]
					},
					{
						label: '三 广告类',
						options: [
							{
								label: '301 正文含不相关违规推广文字或ID',
								value: '301 正文含不相关违规推广文字或ID'
							},
							{
								label: '302 内容涉嫌恶意营销',
								value: '302 内容涉嫌恶意营销'
							},
							{
								label: '303 内容涉嫌软文推广',
								value: '303 内容涉嫌软文推广'
							}
						]
					},
					{
						label: '四 旧闻、虚假信息',
						options: [
							{
								label: '401 文章内容描述违背科学常理',
								value: '401 文章内容描述违背科学常理'
							},
							{
								label: '402 文中描述涉嫌无中生有或捏造谣言',
								value: '402 文中描述涉嫌无中生有或捏造谣言'
							},
							{
								label: '403 发布内容包含未被证实或与客观事实相左内容',
								value: '403 发布内容包含未被证实或与客观事实相左内容'
							},
							{
								label: '404 发布内容为过时旧闻',
								value: '404 发布内容为过时旧闻'
							}
						]
					},
					{
						label: '五 标题类',
						options: [
							{
								label: '501 发布内容涉嫌标题党',
								value: '501 发布内容涉嫌标题党'
							},
							{
								label: '502 标题内容格式错误',
								value: '502 标题内容格式错误'
							},
							{
								label: '503 标题含错别字',
								value: '503 标题含错别字'
							},
							{
								label: '504 发布内容题文不符',
								value: '504 发布内容题文不符'
							}
						]
					},
					{
						label: '六 内容格式类',
						options: [
							{
								label: '601 请删除请点击此处输入图片描述',
								value: '601 请删除请点击此处输入图片描述'
							},
							{
								label: '602 封面或正文图片缺失',
								value: '602 封面或正文图片缺失'
							},
							{
								label: '603 正文含有不相关字符或存在排版问题',
								value: '603 正文含有不相关字符或存在排版问题'
							},
							{
								label: '604 图片带有logo水印',
								value: '604 图片带有logo水印'
							},
							{
								label: '605 语意不明：病句、错别字、标点符号等错误较多',
								value: '605 语意不明：病句、错别字、标点符号等错误较多'
							},
							{
								label: '606 该内容不予收录',
								value: '606 该内容不予收录'
							},
							{
								label: '607 内容涉嫌拼凑、重复',
								value: '607 内容涉嫌拼凑、重复'
							},
							{
								label: '608 内容可能引起读者恶心、不适',
								value: '608 内容可能引起读者恶心、不适'
							},
							{
								label: '609 正文含敏感词汇',
								value: '609 正文含敏感词汇'
							}
						]
					}
				]
			}
		},
		components: {
			newDfwExam
		},
		mounted() {
			this.getAuth()
			this.getDfwList()
			this.getRedKeyWords()
		},
		methods:{
			// 标红关键词获取
			getRedKeyWords(){
				getRedKeyWords().then(res => {
					if(res.code == "00001"){
						this.redKeyWords = res.data
					}
				})
			},
			getAuth(){//权限控制
	    		let authorList=localStorage.getItem('authorList');
	    		if(authorList.indexOf('eastday/news/audit-refused')>-1){
	    			this.isAuth.newNoPassed=true;
	    		}
	    		if(authorList.indexOf('eastday/news/audit-pass')>-1){
	    			this.isAuth.newPassed=true;
	    		}
	    	},
			selectableShow(row){
				return row.rowkey.indexOf('_e')==-1;
			},
			setDateTime(oldTime){
				var newTime = new Date(oldTime);
				return parseTime(newTime, '{y}-{m}-{d} {h}:{i}:{s}')
			},
			selsChange(sels) {//全选
				this.sels = sels;
			},
			getDfwList(){//搜索
				let para = {
					size: this.newsSize,
					type: this.newsType
				};
				//this.listLoading=true;
				getDfwNewExam(para).then((res)=>{
					if(res.code == "00005"){
						var _this = this;
						_this.timerShow = true
						if(_this.timerNum){
							clearInterval(this.timerNum)
							clearInterval(this.selfInterva)
							this.timeNum = 30
						}
						_this.timerNum = window.setInterval(function(){
							_this.timeNum = _this.timeNum - 1
							if(_this.timeNum == 0){
								_this.timeNum = 30
							}
						},1000)
						// 没有数据30秒请求一次
						var _this = this
						this.selfInterva = window.setInterval(_this.getDfwListInterval, 30000);
					}else{
						clearInterval(this.timerNum);
						this.timerShow = false
						this.timeNum = 30
					}
					if(res.data!=null){
						// 标题标红
						var data = res.data.beans;
						if(data.length != 0){
							data.forEach(item => {
								// 标题标红
								item.contenttitleRed = item.contenttitle
								var redWords = (item.keywords == ''||item.keywords == null)?[]:item.keywords.split(',');
								// 匹配符号添加转义符
								function escapeMetacharacterOfStr(input) {
								    return input.replace(/[-$^()*+.\[\]|\\?{}]/gm, "\\$&");
								}
								// 敏感词标红
								if(redWords && redWords.length != 0){
					 				for(var i = 0;i < redWords.length;i++){
					 					var pattern = new RegExp(escapeMetacharacterOfStr(redWords[i]),"g");
					 					item.contenttitleRed = item.contenttitleRed.replace(pattern,"<span class='keyword_red'>" + redWords[i] + "</span>")
					 				}
					 			}
							})
						}
						this.newExamList=res.data.beans;
					}
					//this.listLoading=false;
				});
			},
			getDfwListInterval(){
				if(this.newExamList.length<1){
					let para = {
						size: this.newsSize,
						type: this.newsType
					};
					//this.listLoading=true;
					getDfwNewExam(para).then((res)=>{
						if(res.data!=null){
							// 标题标红
							var data = res.data.beans;
							if(data.length != 0){
								clearInterval(this.timerNum);
								this.timerShow = false
								this.timeNum = 30
								data.forEach(item => {
									// 标题标红
									item.contenttitleRed = item.contenttitle
									var redWords = (item.keywords == ''||item.keywords == null)?[]:item.keywords.split(',');
									// 匹配符号添加转义符
									function escapeMetacharacterOfStr(input) {
									    return input.replace(/[-$^()*+.\[\]|\\?{}]/gm, "\\$&");
									}
									// 敏感词标红
									if(redWords && redWords.length != 0){
						 				for(var i = 0;i < redWords.length;i++){
						 					var pattern = new RegExp(escapeMetacharacterOfStr(redWords[i]),"g");
						 					item.contenttitleRed = item.contenttitleRed.replace(pattern,"<span class='keyword_red'>" + redWords[i] + "</span>")
						 				}
						 			}
								})
							}
							this.newExamList=res.data.beans;
						}
						//this.listLoading=false;
					});
				}
			},
			showNoPassDialog(index,row){
				// 如果有东方号的新闻，需有拒绝理由
				this.$confirm('确认审核拒绝吗?','提示',{
					type:'warning'
				}).then(()=>{
					this.newNoPassed(index,row)
				})
			},
			newNoPassed(index,row){//拒绝
				if(!this.isAuth.newNoPassed||row.rowkey==undefined){
					return ;
				}
				let para = {
					type: this.newsType,
					param: {
						rowkey: row.rowkey,
						reason: this.dialog.reasonSelect
					}
				};
				if(row.rowkey.indexOf('_e') == -1){
					newNoPassed(para).then((res)=>{
						this.newExamList.splice(index,1);
						if(this.newExamList.length < 1){
							this.getDfwList();
						}
					});
				}else{
					editNewNoPassed(para).then((res)=>{
						this.newExamList.splice(index,1);
						if(this.newExamList.length < 1){
							this.getDfwList();
						}
					});
				}
				this.noPassVisible = false
			},
			newPassed(index,row){//通过
				if(!this.isAuth.newPassed||row.rowkey==undefined){
					return ;
				}
				let para = {
					type: this.newsType,
					param: {
						rowkey: row.rowkey,
						gradelv: 1
					}
				};
				this.$confirm('确认审核通过吗?','提示',{
					type:'warning'
				}).then(()=>{
					//this.listLoading=true;
					if(row.rowkey.indexOf('_e')==-1){
						newPassed(para).then((res)=>{
							this.newExamList.splice(index,1);
							if(this.newExamList.length<1){
								this.getDfwList();
							}
						});
					}else{
						editNewPassed(para).then((res)=>{
							this.newExamList.splice(index,1);
							if(this.newExamList.length<1){
								this.getDfwList();
							}
						});
					}
					//this.listLoading=false;
				}).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '取消'
			          });
			    });
			},
			handleDialog(index,row){
				this.newExam=row;
				this.newExam.index = index
				this.newExam.content = contentToHtml(this.newExam,this.redKeyWords);
				this.newExam.newPassed = this.isAuth.newPassed;
				this.newExam.newNoPassed = this.isAuth.newNoPassed;
				this.addFormVisible = true;
			},
			childEvent(data){
				this.addFormVisible = false;
				this.newExamList.splice(data,1)
				if(this.newExamList.length==0){
					this.getDfwList();
				}
			},
			noAllPass(){
				var _this = this
				var ids = this.sels.map(item => item.rowkey).toString();
				this.sels.forEach((item) => {
					_this.newExamList.forEach((i,index) => {
						if(item.rowkey == i.rowkey){
							_this.newExamList.splice(index,1)
						}
					})
				})
				if(this.newExamList.length==0){
					this.getDfwList();
				}

				let para = {
					type: this.newsType,
					param: {
						rowkey: ids,
						gravelv: 1,
						// reason: this.dialogAll.reasonSelectAll
					}
				};
				para.param.gravelv=2;
				newNoPassed(para).then((res)=>{
					//this.listLoading=false;
				});
				this.noAllPassVisible = false
			},
			batchRemove(index){//批量更改
				if(index==0){
					if(!this.isAuth.newPassed){
						return ;
					}
					var ids=this.sels.map(item=>item.rowkey).toString();
					this.$confirm('确认更改选中记录吗?','提示',{
						type:'warning'
					}).then(()=>{
						var _this = this
						this.sels.forEach((item) => {
							_this.newExamList.forEach((i,index) => {
								if(item.rowkey == i.rowkey){
									_this.newExamList.splice(index,1)
								}
							})
						})
						if(this.newExamList.length==0){
							this.getDfwList();
						}

						let para = {
							type: this.newsType,
							param: {
								rowkey: ids,
								gravelv: 1
							}
						};
						newPassed(para).then((res)=>{
							//this.listLoading=false;
						});
					}).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消'
			          });
			        });
				}else{
					this.$confirm('确认更改选中记录吗?','提示',{
						type:'warning'
					}).then(()=>{
						if(!this.isAuth.newNoPassed){
							return ;
						}
						var urlfrom = this.sels.map(item=>item.urlfrom).toString();
						var _this = this
						var ids = this.sels.map(item => item.rowkey).toString();
						this.sels.forEach((item) => {
							_this.newExamList.forEach((i,index) => {
								if(item.rowkey == i.rowkey){
									_this.newExamList.splice(index,1)
								}
							})
						})
						if(this.newExamList.length==0){
							this.getDfwList();
						}

						let para = {
							type: this.newsType,
							param: {
								rowkey: ids,
								gravelv: 1,
								// reason: this.dialogAll.reasonSelectAll
							}
						};
						para.param.gravelv=2;
						newNoPassed(para).then((res)=>{
							//this.listLoading=false;
						});
					})
				}
			}
		},
		watch:{
			"noPassVisible": function(){
				var _this = this;
				if(this.noPassVisible){
					setTimeout(function(){
						_this.$refs.selectInput.$refs.reference.$refs.input.focus()
					},0)
				}
			},
			"noAllPassVisible": function(){
				var _this = this;
				if(this.noAllPassVisible){
					setTimeout(function(){
						_this.$refs.selectInputAll.$refs.reference.$refs.input.focus()
					},0)
				}
			}
		},
	    destroyed(){
	    	clearInterval(this.selfInterva);
			clearInterval(this.timerNum);
			let para={queue:'eastday_news'};
	    	removeExamData(para).then((res)=>{});
	    }
	}

</script>

<style scoped>
	.jdz{
		width: 50px;
	}
	.hoverTitel:hover{
		cursor: pointer;
		color: #0000ee;
	}
</style>
