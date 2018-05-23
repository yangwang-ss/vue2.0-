<template>
	<div id="exportWorder">
		<div class="titleWap">
			<span class="h42" @click="goback1">发布项目/</span>
			<span class="h42" @click="goback">批次列表/</span>
			<span class="h41" style="cursor: auto">批次详情</span>
		</div>
		<div class="row">
			<span class="span1"><label for="input1">会员账号：</label><input type="text" name="" id="input1"  placeholder="请输入" v-model="batchName"/></span>
			<span class="span1"><label for="input2">被叫号码：</label><input type="text" name="" id="input2"  placeholder="请输入" v-model="phoneNum"/></span>
			<span class="span1">任务状态：<Select v-model="taskState" ref = "projectStates" clearable>
               <Option v-for="item in projectState" :value="item.key" :key="item.key">{{ item.value }}</Option>
           </Select>
          </span>
		</div>
		<div class="row">
			<span class="span1" id="Date-picker2">
            	拨打时间：<Date-picker  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px;height: 27px;" v-model = "dateTime1"></Date-picker>
            </span>
			<span class="buttonList">
			<span class="smallBtn1" @click="specialFilters">特殊筛选</span>
			<span class="smallBtn3" @click="exportExcel">导出</span>
			<span class="smallBtn2" @click="checkWorkorder">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<div class="tableWap">
			<div class="scroll">
				<table border="" cellspacing="0" cellpadding="0" id="tableForm" style="margin-bottom: 15px;">
					<tr class="trHeader">
						<!--<td class="colmn1">序号</td>-->
						<td class="colmn2">日期</td>
						<td class="colmn3">被叫号码</td>
						<td class="colmn4">会员账号</td>
						<td class="colmn5">会员姓名</td>
						<td class="colmn6">拨打时间</td>
						<td class="colmn7">通话时长</td>
						<td v-for="item in showFormData">{{item.key}}</td>
						<!--<td class="colmn8">呼叫状态</td>
						<td class="colmn9">未接通原因</td>
						<td class="colmn10">接通后呼叫效果</td>
						<td class="colmn11">呼叫备注</td>-->
						<!--<td class="colmn12">项目编号</td>-->
						<td class="colmn13">项目名称</td>
						<td class="colmn14">类型</td>
						<td>项目状态</td>
					</tr>
					<tr v-for="(item,index) in workOrderList">
						<!--<td>{{index+1}}</td>-->
						<td>{{item.batchCreateTime?timeFormat(item.batchCreateTime):"暂无数据"}}</td>
						<td>{{item.customerPhoneNum?item.customerPhoneNum:'暂无数据'}}</td>
						<td>{{item.userPhoneNum}}</td>
						<td>{{item.userName}}</td>
						<td>{{item.completeDate?timeFormat(item.completeDate):"暂无数据"}}</td>
						<td>{{item.callDuration?timeFormat2(item.callDuration):"暂无数据"}}</td>
						<td v-for="item2 in item.showFormData">{{item2.value}}</td>
						<!--<td></td>
						<td></td>
						<td></td>-->
						<!--<td>{{item.jobId}}</td>-->
						<td>{{item.projectName}}</td>
						<td>{{item.projectType}}</td>
						<td>{{item.jobStatus}}</td>
					</tr>
				</table>
			</div>
			<!--分页插件-->
			<div id="page">
				<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
			</div>
		</div>
		<!--特殊筛选-->
		<bounces v-show="bouncesHide1" @emitClickPopup="popupShutDown()">
			<div class="Dialog" id="Dialog">
				<div class="headTitle">
					<span class="title">特殊筛选</span>
					<span class="cancelWap" @click="cancel"><img src="../../static/img/cancel.png" /></span>
				</div>
				<div>
					<div class="add-nameContent">
						<div class="nameContent-list" v-for="(item,index) in question.similarity">
							<!--<span  ref="changeWord" class="spanW">{{index}}</span>-->
							<Select v-model="beteweenModel[index]" class="select" clearable :class="index==0?'showHidden':''" :disabled="isDisabled">
								<Option v-for="item in beteweenRelation" :value="item.value" :key="item.value">{{item.label}}</Option>
							</Select>
							<Select v-model="form_model1[index]" class="select" clearable :disabled="isDisabled">
								<Option v-for="item in phoneTime" :value="item" :key="item">{{item}}</Option>
							</Select>
							<Select v-model="form_model2[index]" class="select" clearable :disabled="isDisabled">
								<Option v-for="item in between" :value="item.value" :key="item.value">{{item.label}}</Option>
							</Select>
							<Date-picker type="datetime" placeholder="选择日期和时间" v-model="ruleModel[index]" v-if="form_model1[index]=='日期'||form_model1[index]=='拨打时间'" :disabled="isDisabled"></Date-picker>
							<!--<Time-picker v-model="ruleModel[index]" format="HH:mm:ss" placeholder="选择时间"  v-else-if="form_model1[index]=='通话时长'" :disabled="isDisabled"></Time-picker>-->
							<input type="text" placeholder="请输入" v-model="ruleModel[index]" style="height: 27px;width: 155px;" :disabled="isDisabled" v-else>
							<div style="width: 38px;">
								<span @click="deleteQuestionSimilarity(index)">
							<img src="../../static/img/edite.png"/>
						</span>
								<span @click="addQuestionSimilarity(0,index)"><img src="../../static/img/add.png" v-if="index===(question.similarity.length-1)"/></span>
							</div>
						</div>
						<div style="width: 150px;margin: 20px auto;margin-top:40px;position: relative;" class="specialFilter">
							<a class="middleBtn1" @click="entrue" v-if="form_model1.toString()!=''&&form_model2.toString()!=''&&ruleModel.toString()!=''" v-show="Btn1" :disabled="speicalDisable">确定</a>
							<a class="middleBtn1" download="" ref='hrefs' v-else  style="cursor: not-allowed;">确定</a>
							<a class="middleBtn3" @click="specialExportBtn" :href="URl1" download="" ref='hrefs' v-show="Btn2">点击下载</a>
						</div>
					</div>
				</div>
			</div>
		</bounces>
		<!--导出-->
		<bounces v-show="bouncesHide2" @emitClickPopup="popupShutDown()">
			<div class="Dialog">
				<div class="headTitle">
					<span class="title">导出</span>
					<span class="cancelWap"><img src="../../static/img/cancel.png" @click="cancel"/></span>
				</div>
				<div class="inputRow">
					<span id="Date-picker3">
					
            	工单信息筛选：<Select v-model="model12" filterable multiple  ref = "isDisabled" :disabled="isDisabled">
                       <Option v-for="item in cityList" :value="item.toString()" :key="item.vaue">{{item}}</Option>
                   </Select>
            </span>
				</div>
				<div class="export">
					<a class="middleBtn3" @click="exportData" download="" ref='hrefs' v-if="model12.length>0" v-show="Btn1" :disabled="isExportDisabled">导出</a>
					<a class="middleBtn3" download="" ref='hrefs' style="cursor: not-allowed;" v-else>导出</a>
					<a class="middleBtn3" @click="exportBtn" :href="URl1" download="" ref='hrefs' v-show="Btn2" v-if="model12.length>0">点击下载</a>
				</div>
			</div>
			<!--<export-choose @cancel="cancel()"></export-choose>-->
		</bounces>
		<!--数据加载等待效果-->
		<Spin fix v-show="loading">
			<div>
				<svg class="circular" viewBox="25 25 50 50">
					<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
				</svg>
			</div>
		</Spin>
	</div>
</template>

<script>
	//import specialFilter from '@/views/manageProject/specialFilter'
	//	import exportChoose from '@/views/manageProject/exportChoose'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading: true,
				Btn1: true,
				Btn2: false,
				isDisabled: false,
				isExportDisabled: false,
				speicalDisable: false,
				cityList: [],
				model12: [],
				URl1: '',
				batchName: '',
				phoneNum: '',
				taskState: '',
				dateTime1: '',
				bouncesHide1: false,
				bouncesHide2: false,
				pageNum: 1,
				pageSize: 10,
				totalpageSize: 0,
				workOrderList: [],
				batchId: '',
				projectState: [],
				showFormData: [],
				URl: '',
				//特殊筛选data
				form_model1: [],
				form_model2: [],
				phoneTime: [],
				between: [{
						value: '1',
						label: '等于'
					},
					{
						value: '2',
						label: '不等于'
					},
					{
						value: '3',
						label: '模糊匹配'
					},
					{
						value: '4',
						label: '大于'
					},
					{
						value: '5',
						label: '小于'
					}
				],
				beteweenModel: [],
				beteweenRelation: [{
					value: '1',
					label: 'or'
				}, {
					value: '2',
					label: 'and'
				}],
				ruleModel: [],
				specialConditionArr: [],
				question: {
					similarity: [{
						value: ""
					}]
				}
			}
		},
		components: {
			bounces
		},
		mounted() {
			this.checkWorkorder();
			//任务状态
			this.taskStates();
			this.findFormTableHead();
		},
		methods: {
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			//时间戳转化成时间格式
			timeFormat(timestamp) {
				//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
				var time = new Date(timestamp);
				var year = time.getFullYear();
				var month = time.getMonth() + 1;
				var date = time.getDate();
				var hours = time.getHours();
				var minutes = time.getMinutes();
				var seconds = time.getSeconds();
				return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
			},
			timeFormat2(timestamp) {
				//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
				var time = new Date(timestamp);
				var year = time.getFullYear();
				var month = time.getMonth() + 1;
				var date = time.getDate();
				var hours = time.getHours();
				var minutes = time.getMinutes();
				var seconds = time.getSeconds();
				return this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
			},

			//导出
			exportExcel() {
				this.isDisabled = false;
				this.Btn1 = true;
				this.Btn2 = false;
				this.bouncesHide2 = true;
				this.isExportDisabled = false;
				this.model12 = [];
			},
			//查询工单导出表头
			findFormTableHead() {
				const id = this.$route.query.batchId;
				this.axios.post('/task/findFormTableHead.do', {
					"batchId": id //类型：String  必有字段  备注：项目Id
				}).then((res) => {
					if(res.data.code == '0') {
						this.cityList = res.data.data.result;
						this.phoneTime = res.data.data.result;
					} else {
						this.$Message.error(res.data.msg);
					}

				}).catch((err) => {
					console.log(err);
				});
			},
			//根据批次创建时间导出工单数据
			exportData() {
				const id = this.$route.query.batchId;
				var that = this;
				this.axios.post('/task/exportDataByCondition.do', {
					"batchId": id, //类型：String  可有字段  备注：批次Id
					"tableHeads": that.model12,
					"condition": { //类型：Object  可有字段  备注：基本条件筛选
						"userPhoneNum": that.VIPNum, //类型：String  可有字段  备注：会员账号
						"customerPhoneNum": that.phoneNum, //类型：String  可有字段  备注：被叫号码
						"jobStatus": that.taskState, //类型：String  可有字段  备注：任务状态
						"callStartDate": Date.parse(that.dateTime1[0]), //类型：String  可有字段  备注：拨打开始时间
						"callEndDate": Date.parse(that.dateTime1[1]) //类型：String  可有字段  备注：拨打结束时间
					}
				}).then((res) => {
					if(res.data.code == 0) {
						if(res.data.data.url==undefined){
							this.$Message.info('暂无数据可导');
							this.isExportDisabled = false;
							return false;
						}else{
							this.$Message.success(res.data.msg);
						this.URl1 = res.data.data.url;
						this.Btn1 = false;
						this.Btn2 = true;
						this.isDisabled = true;
						this.isExportDisabled = true;
						}
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			//工单信息表头数据
			exportBtn() {
				this.bouncesHide2 = false;
			},
			goback1() {
				this.$router.push("/PbProject");
			},
			goback() {
				this.$router.back();
			},
			//数据重置
			resetData() {
				this.batchName = '';
				this.phoneNum = '';
				this.taskState = '';
				this.dateTime1 = '';
			},
			//任务状态字典
			taskStates() {
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": 'jobStatus'
				}).then((res) => {
					this.projectState = res.data.data.value;
				}).catch((err) => {
					console.log(err);
				})
			},
			popupShutDown() {
//				this.bouncesHide1 = false;
//				this.bouncesHide2 = false;
			},
			//特殊筛选
			specialFilters() {
				this.question.similarity = [{
					value: ""
				}];
				this.form_model1 = [];
				this.form_model2 = [];
				this.ruleModel = [];
				this.beteweenModel = [];
				this.isDisabled = false;
				this.bouncesHide1 = true;
				this.speicalDisable = false;
				this.Btn1 = true;
				this.Btn2 = false;
			},
			cancel() {
				this.bouncesHide2 = false;
				this.bouncesHide1 = false;
			},

			//查看工单以及业务数据
			checkWorkorder() {
				var that = this;
				//this.batchId = id;
				const id = this.$route.query.batchId;
				this.axios.post('/task/showBusinessFormData.do', {
					"batchId": id, //类型：String  必有字段  备注：批次Id
					"pageNum": that.pageNum, //类型：Number  必有字段  备注：当前页数
					"pageSize": that.pageSize, //类型：Number  必有字段  备注：每页数量
					"condition": { //类型：Object  可有字段  备注：基本条件筛选
						"userPhoneNum": that.batchName, //类型：String  可有字段  备注：会员账号
						"customerPhoneNum": that.phoneNum, //类型：String  可有字段  备注：被叫号码
						"jobStatus": that.taskState, //类型：String  可有字段  备注：任务状态
						"callStartDate": Date.parse(that.dateTime1[0]), //类型：String  可有字段  备注：拨打开始时间
						"callEndDate": Date.parse(that.dateTime1[1]) //类型：String  可有字段  备注：拨打结束时间
					}
				}).then((res) => {
					if(res.data.code == '0') {
						this.loading = false;
						this.$Loading.finish();
						this.totalpageSize = res.data.data.total;
						this.workOrderList = res.data.data.result;
						this.showFormData = res.data.data.result[0].showFormData;
						this.exportWData(id);
					} else {
						this.$Message.error(res.data.msg);
					}

				}).catch(function(err) {

				});
			},
			//导出工单业务数据
			exportWData(id) {
				var that = this;
				const projectId = this.$route.query.projectId;
				this.axios.post('/task/showBusinessFormData.do', {
					"projectId": projectId, //类型：String  必有字段  备注：项目Id
					"batchId": id //类型：String  可有字段  备注：批次Id

				}).then((res) => {
					if(res.data.code == 0) {
						this.URl = res.data.data.url;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {

				});
			},
			changePage(pageNum) {
				this.pageNum = pageNum;
				this.checkWorkorder();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.checkWorkorder();
			},
			//特殊筛选
			addQuestionSimilarity(num, index) {
				let arr = {
					value: ""
				};
				this.question.similarity.push(arr);
			},
			deleteQuestionSimilarity(index) {
				if(this.question.similarity.length > 1) {
					this.question.similarity.splice(index, 1);
				} else {
					this.$Message.warning("抱歉,不能再删了")
				}
			},
			//数组去重
			removeDuplicatedItem(arr) {
				for(var i = 0; i < arr.length - 1; i++) {
					for(var j = i + 1; j < arr.length; j++) {
						if(arr[i] == arr[j]) {
							arr.splice(j, 1);
							j--;
						}
					}
				}
				return arr;
			},

			//特殊筛选
			entrue() {
				this.specialConditionArr = [];
				this.speicalDisable = true;
				for(var i = 0; i < this.question.similarity.length; i++) {
					if(this.form_model1[i] == '日期') {
						this.ruleModel[i] = Date.parse(this.ruleModel[i]);
					} else if(this.form_model1[i] == '拨打时间') {
						this.ruleModel[i] = Date.parse(this.ruleModel[i]);
					}
					//					else if(this.form_model1[i]=='通话时长'){
					//						this.ruleModel[i] = Date.parse(this.ruleModel[i]);
					//					}
					else {
						this.ruleModel[i] = this.ruleModel[i]
					}
					let specialCondition = {
						tableHead: this.form_model1[i],
						rule: this.form_model2[i],
						value: this.ruleModel[i],
						relation: this.beteweenModel[i]
					}
					this.specialConditionArr.push(specialCondition);
				}
				const id = this.$route.query.batchId;
				var that = this;
				this.axios.post('/task/exportDataByCondition.do', {
					"batchId": id, //类型：String  可有字段  备注：批次Id
					"screenConditions": that.specialConditionArr,
					"tableHeads": that.removeDuplicatedItem(that.form_model1),
					"condition": { //类型：Object  可有字段  备注：基本条件筛选
						"userPhoneNum": that.VIPNum, //类型：String  可有字段  备注：会员账号
						"customerPhoneNum": that.phoneNum, //类型：String  可有字段  备注：被叫号码
						"jobStatus": that.taskState, //类型：String  可有字段  备注：任务状态
						"callStartDate": Date.parse(that.dateTime1[0]), //类型：String  可有字段  备注：拨打开始时间
						"callEndDate": Date.parse(that.dateTime1[1]) //类型：String  可有字段  备注：拨打结束时间
					}
				}).then((res) => {
					if(res.data.code == 0) {
						this.$Message.success(res.data.msg);
						this.URl1 = res.data.data.url;
						this.Btn1 = false;
						this.Btn2 = true;
						this.isDisabled = true;
					} else {
						this.$Message.error(res.data.msg);
						return false;
					}
				})
				console.log(this.specialConditionArr)
			},
			specialExportBtn() {
				this.bouncesHide1 = false;
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.showHidden {
		visibility: hidden;
	}
	
	.Dialog {
		height: auto;
		.inputRow {
			position: relative !important;
			margin-top: 45px;
			margin-bottom: 60px;
			margin-left: 105px;
		}
	}
	
	.export {
		text-align: center;
		padding-bottom: 20px;
		padding-top: 15px;
		border-top: 1px solid #E9E9E9;
		a{
			display: block;
			&:hover{
				color: #fff;
			}
		}
	}
	
	
	
	#exportWorder {
		input {
			height: 27px;
			width: 230px;
		}
		.titleWap {
			border-bottom: 1px solid #e9e9e9;
			padding-bottom: 5px;
			margin-bottom: 40px;
			.h41,
			.h42 {
				margin-bottom: 0;
			}
		}
		.row {
			white-space: nowrap;
			margin-top: 25px;
			margin-bottom: 20px;
			* {
				vertical-align: middle;
			}
			.span1,
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
			}
			.span2 {
				width: 355px;
				margin-left: 40px;
			}
			.buttonList {
				margin-left: 23em;
				span {
					vertical-align: middle;
					text-align: center;
					display: inline-block;
				}
				.smallBtn1 {
					width: auto !important;
					padding: 0 15px;
					margin-left: 20px;
				}
				.smallBtn2 {
					margin: 0 5px;
				}
				.smallBtn3 {
					margin-left: 5px;
				}
			}
		}
	}
	
	.tableWap {
		.scroll {
			width: 99%;
			overflow-x: auto;
			margin: 0 auto;
		}
		#tableForm {
			table-layout: auto !important;
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #E9E9E9;
			.trHeader {
				td {
					background: #F4F4F4;
				}
			}
			tr,
			td {
				white-space: nowrap;
				padding: 0 1em;
				height: 40px;
			}
		}
	}
	
	.exportBtnwap {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	
	.middleBtn3 {
		display: inline-block;
		margin: 0 auto;
	}
	/*特殊筛选*/
	
	#Dialog {
		width: 62em !important;
		height: auto !important;
	}
	
	.specialFilter {
		a {
			display: inline-block;
			color: #fff;
			position: static;
		}
	}
	
	.middleBtn1 {
		position: absolute;
		bottom: 3em;
	}
	
	.add-nameContent {
		margin-top: 40px;
		.spanW {
			display: inline-block;
			width: 40px;
			text-align: center;
		}
	}
	
	.nameContent-list {
		display: flex;
		flex-basis: row;
		justify-content: space-around;
		align-items: center;
		width: 56em;
		margin: 0 auto;
		margin-bottom: 15px;
		* {
			vertical-align: middle;
		}
	}
	
	#specialF {
		.ivu-select-selection {
			border: 1px solid #ccc;
			width: 200px !important;
			padding: 0 24px 0 4px;
			height: 27px !important;
			line-height: 27px !important;
			min-height: 27px !important;
			border-radius: 4px !important;
		}
	}
</style>