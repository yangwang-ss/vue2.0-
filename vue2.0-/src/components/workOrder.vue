<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">工单</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" @click="cancel"/></span>
			</div>
			<div class="tableWap">
			<div class="scroll">
					<table border="" cellspacing="0" cellpadding="0" id="tableForm">
					<tr class="trHeader">
						<td class="colmn1">序号</td>
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
						<td class="colmn12">项目编号</td>
						<td class="colmn13">项目名称</td>
						<td class="colmn14">类型</td>
					</tr>
					<tr v-for="(item,index) in workOrderList">
						<td>{{index+1}}</td>
						<td>{{item.batchCreateTime|moment("YYYY-MM-DD HH:mm:ss")}}</td>
						<td>{{item.customerPhoneNum}}</td>
						<td>{{item.userPhoneNum}}</td>
						<td>{{item.userName}}</td>
						<td>{{item.callEndDate-item.callStartDate}}</td>
						<td>{{item.callDuration}}</td>
						<td v-for="item2 in childList">{{item2.value}}</td>
						<!--<td></td>
						<td></td>
						<td></td>-->
						<td>{{item.jobId}}</td>
						<td>{{item.projectName}}</td>
						<td>{{item.projectType}}</td>
					</tr>
				</table>
			</div>
				<!--分页插件-->
				<div id="page">
					<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
				</div>
			</div>
			<div class="exportBtnwap">
				<a class="middleBtn3" :href="URl" download="">导出</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageNum:1,
				pageSize:10,
				totalpageSize: 0,
				workOrderList:[],
				batchId:'',
				showFormData:[],
				childList:[],
				URl:''
			}
		},
		methods: {
			cancel() {
				this.$emit("cancel");
			},
			//查看工单以及业务数据
			checkWorkorder(id){
				var that = this;
				//this.batchId = id;
				this.axios.post('/task/showBusinessFormData.do',{
					 "batchId":id,            //类型：String  必有字段  备注：批次Id
				    "pageNum":that.pageNum,  //类型：Number  必有字段  备注：当前页数
				    "pageSize":that.pageSize //类型：Number  必有字段  备注：每页数量
				}).then((res)=>{
					console.log(res);
					this.totalpageSize = res.data.data.total;
					this.workOrderList = res.data.data.result;
					this.showFormData = res.data.data.result[0].showFormData;
					for(var i=0;i<this.workOrderList.length;i++){
						this.childList = this.workOrderList[i].showFormData;
						console.log(l);
					}
					this.exportWData(id);
				}).catch(function  (err) {
					
				});
			},
			//导出工单业务数据
			exportWData(id){
				var that = this;
				const projectId = this.$route.query.projectId;
				this.axios.post('/task/showBusinessFormData.do',{
					//"startCreateTime":"mock",                //类型：String  可有字段  备注：创建开始时间
				    //"endCreateTime":"mock",                //类型：String  可有字段  备注：创建结束时间
				    "projectId":projectId,                //类型：String  必有字段  备注：项目Id
				    "batchId":id                //类型：String  可有字段  备注：批次Id
				}).then((res)=>{
					console.log(res);
					this.URl = res.data.data.url;
				}).catch(function  (err) {
					
				});
			},
			changePage(pageNum) {
				this.pageNum = pageNum;
				this.checkWorkorder(this.batchId);
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.checkWorkorder(this.batchId);
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		width: 100%;
		height: 100%;
		border-radius: 0;
		.tableWap {
			padding: 10px 10px;
			.scroll{
				width: 99%;
				overflow-x:auto;
				margin: 0 auto;
			}
			#tableForm {
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
		.exportBtnwap{
			display: flex;
			flex-direction: row;
			justify-content: space-around;
		}
		.middleBtn3 {
			display: inline-block;
			margin: 0 auto;
		}
	}
</style>