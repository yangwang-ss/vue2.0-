<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">项目审核</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" /></span>
			</div>
			<div class="overflow scroll">
				<div class="projectSeting title">项目设置</div>
			<div class="inputRow">
				<span>项目名称：</span>
				<span>{{projectioninfo.name}}</span>
			</div>
			<div class="inputRow">
				<span>项目类型：</span>
				<span>{{convetWkind(projectioninfo.type,projectState)}}</span>
			</div>
			<div class="inputRow">
				<span>工单模板：</span>
				<!--<span>{{projectioninfo.workOrder.workOrderName}}</span>-->
				<span>{{workOrder}}</span>
			</div>
			<div class="inputRow">
				<span>结算模板：</span>
				<!--<span>{{projectioninfo.account.accountName}}</span>-->
				<span>{{account}}</span>
			</div>
			<div class="inputRow">
				<span>质检模板：</span>
				<!--<span>{{projectioninfo.machineQuality.machineQualityName}}</span>-->
				<span>{{machineQuality}}</span>
			</div>
			<div class="inputRow">
				<span>培训模板：</span>
				<!--<span>{{projectioninfo.train.trainName}}</span>-->
				<span>{{train}}</span>
			</div>
			<div class="inputRow" style="overflow: hidden;">
				<span style="float: left;">工作时间：</span>
				<ul class="addTime">
					<li v-for="(str,i) in allTimes">
						<Time-picker v-model="allTimes[i]" :value="timeValue1" format="HH:mm:ss" type="timerange" 
						placement="bottom-end" placeholder="选择时间" style="width: 168px"></Time-picker>
					</li>
				</ul>
			</div>
			<!--<div class="inputRow" id="addTime">
				<Time-picker :value="timeValue2" format="HH:mm:ss" type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px"></Time-picker>
			</div>-->
			<div class="inputRow">
				<span>项目标签：</span>
				<span class="lableTst" v-for="(str,i) in arr">{{str}}</span>
			</div>
			<div class="projectSeting2 title">项目说明</div>
			<div class="textareaRow">
				<span class="textAligin">项目说明：</span>
				<p class="textBox">{{projectioninfo.description?projectioninfo.description:'暂无数据'}}</p>
			</div>
			
			<div class="projectSeting2 title">接单规则</div>
			<div class="inputRow">
				<span>客服星级：</span>
				<span class="allowImg"><Rate allow-half disabled v-model="valueDisabled"></Rate></span>
			</div>
			<div class="bootom-button">
				<div class="middlBtnDefalt" @click="cancel">取消</div>
				<div v-if="projectioninfo.status == 2" class="middleBtn1">通过</div>
				<div v-if="projectioninfo.status == 1" class="middleBtn2" @click="release(3)" style="margin-left: 20px;margin-right: 15px;">拒绝</div>
				<div v-if="projectioninfo.status == 3" class="middleBtn2" style="margin-left: 20px;margin-right: 15px;cursor: not-allowed;">拒绝</div>
				<div v-if="projectioninfo.status == 1" class="middleBtn1"  style="margin-left: 5px;margin-right: 15px;cursor: pointer;" @click="release(2)">通过</div>
			</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Tool from "../../getData/tool"
	export default {
		data() {
			return {
				projectId:"",
				applyId:"",
				projectioninfo:{},
				workOrder:'',
				account:'',
				machineQuality:'',
				train:'',
				quires:"",
				timeValue1: ['09:41:00', '12:00:00'],
				timeValue2: ['09:41:00', '12:00:00'],
				arr:[],
				valueDisabled:null,
				requireArr:[],
				timeArr:[],
				allTimes:[],
				projectType: 'projectType',
				projectState: [],
				projectTag: 'projectTag',
				hotLabelList:[]
			}
		},
		mounted() {
			this.projectStatus();
			this.hotLable();
		},
		methods: {
			//项目类型
			projectStatus() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectType //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					console.log(res,"项目类型");
					this.projectState = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			//热门标签
			hotLable() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectTag //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.hotLabelList = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			checkWorkDetail(id,status) {
				this.allTimes.splice(0, this.allTimes.length);
				var that = this;
				this.applyId =status;
				this.axios.post('/projectApply/projectApplyDetial.do', {
					"projectId":id
				}).then((res) => {
//					console.log(res,"项目审核详情");
					this.projectId = res.data.data.projectId;
					this.projectioninfo = res.data.data;
					this.timeArr = res.data.data.projectWorktimes;
					for(var i in this.timeArr){
						let obj=[
							Tool.dateFormate(new Date(this.timeArr[i].startTime), "hh:mm:ss"),
							Tool.dateFormate(new Date(this.timeArr[i].endtime), "hh:mm:ss")
						]
						this.allTimes.push(obj);
					};
					if(res.data.data.workOrder == undefined){
						this.workOrder = "暂无数据"
					}else{
						this.workOrder = res.data.data.workOrder.workOrderName
					};
					if(res.data.data.account == undefined){
						this.account = "暂无数据"
					}else{
						this.account = res.data.data.account.accountName
					};
					if(res.data.data.machineQuality == undefined){
						this.machineQuality = "暂无数据"
					}else{
						this.machineQuality = res.data.data.machineQuality.machineQualityName
					};
					this.arr.splice(0,this.arr.length);
					for(var s in res.data.data.tags){
						for(var n in this.hotLabelList){
							if(res.data.data.tags[s] == this.hotLabelList[n].key){
								this.arr.push(this.hotLabelList[n].value)
							}
						}
					}
					this.requireArr = res.data.data.requires;
					if(this.requireArr.length == 0){
						this.train = "暂无数据";
						this.valueDisabled = 0;
					}else{
						for(var x in this.requireArr){
							if(this.requireArr[x].type == "lvl"){
								this.valueDisabled = Number(this.requireArr[x].value)
							}else{
								this.valueDisabled = 0
							}
							if(this.requireArr[x].type == "projectTrain"){
								this.train = this.requireArr[x].name
								return
							}else{
								this.train = "暂无数据"
							}
						}
					}
				}).catch(function(err) {})
			},
			release(e) {
				let that = this;
				let content={
					projectId:that.projectId,
					applyId:that.applyId,
					status:e,
				}
				this.$emit("sumbit",{
//					projectId:this.projectId,
					content:content
				});
			},
			cancel() {
				this.$emit("cancel");
			},
		    convetWkind(a,list){
				for(var i=0;i<list.length;i++){
					if (a==list[i].key) {
						return list[i].value;
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
		
		.Dialog {
			
			.projectSeting2 {
				margin-top: 20px;
				padding-left: 45px;
			}
			.inputRow {
				span:first-child{
					margin-right: 5px;
				}
				.addTime {
					float: left;
					li{
						margin-bottom: 10px;
					}
				}
				.allowImg{
					position: relative;
					top: -3px;
				}
				.lableTst{
					display: inline-block;
					padding: 1px 12px;
					margin-right: 10px;
					border: 1px solid #CCCCCC;
					border-radius: 3px;
				}
			}
			.textareaRow {
				width: 300px;
				margin-left: 10em;
				margin-bottom: 2px;
				.textBox {
					max-height: 150px;
					overflow: auto;
					width: 228px;
					display: inline-block;
				}
				.textAligin {
					vertical-align: top;
					display: inline-block;
				}
				span:first-child{
					margin-right: 5px;
				}
			}
			#addTime {
				padding-left: 63px;
			}
			
		}
</style>