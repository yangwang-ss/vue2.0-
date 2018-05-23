<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">查询批次</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" /></span>
			</div>
			<div>
				<div class="projectSeting title">批次设置</div>
			<div class="inputRow">
				<span>接单次数：</span>
				<span>{{projectioninfo.orderNum}}次</span>
			</div>
			<div class="inputRow">
				<span>结算模板：</span>
				<span>{{projectioninfo.account?projectioninfo.account.accountName:"暂无数据"}}</span>
			</div>
			<div class="inputRow">
				<span>批次周期：</span>
				<span v-if="projectioninfo.publishTime == undefined && projectioninfo.endTime == undefined">暂无数据</span>
				<span v-else>
				<span>{{projectioninfo.publishTime ? computationsCallTime(projectioninfo.publishTime) : "暂无数据"}}</span>
				<span v-show="hides"> - </span>
				<span>{{projectioninfo.endTime ? computationsCallTime(projectioninfo.endTime) : "暂无数据"}}</span>
				</span>
			</div>
			<div class="inputRow">
				<span>预警时间：</span>
				<span>{{projectioninfo.warningTime ? computationsCallTime(projectioninfo.warningTime) : "暂无数据"}}</span>
			</div>
			<div class="inputRow">
				<span>上传数据：</span>
				<span v-if="this.tableList.length == 0">
					<a class="linka" style="color: #666; cursor: auto;">暂无数据</a>
				</span>
				<span v-else v-for="(item,$index) in tableList">
					<a class="linka" :href="item.url ? item.url : ''">{{item.url ? "点击查看" : ""}}</a>
				</span>
			</div>
			<div class="bootom-button">
				<div class="middlBtnDefalt" @click="cancel">取消</div>
				<div v-if="projectioninfo.status == 2" class="middleBtn1" style="cursor: not-allowed;">通过</div>
				<div v-if="projectioninfo.status == 1" class="middleBtn2" @click="release(3)" style="margin-left: 20px;margin-right: 15px;">不通过</div>
				<div v-if="projectioninfo.status == 1" class="middleBtn1" @click="release(2)" style="margin-left: 5px;margin-right: 15px;cursor: pointer;">通过</div>
				
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
				hides:false,
				batchId:"",
				applyId:"",
				projectioninfo:{},
				tableList:[]
			}
		},
		methods: {
			checkWorkDetail(id,status) {
				var that = this;
				this.applyId =status;
				this.axios.post('/batchApply/batchApplyDetial.do', {
					"batchId":id,
				}).then((res) => {
					console.log(res,"批次审核");
					this.batchId = res.data.data.batchId;
					this.tableList = res.data.data.files;
					this.projectioninfo = res.data.data;
					if(res.data.data.publishTime == undefined){
						this.hides = false;
					}else{
						this.hides = true;
					}
				}).catch(function(err) {})
			},
			release(e) {
				let that = this;
				let content={
					batchId:that.batchId,
					applyId:that.applyId,
					status:e,
				}
				this.$emit("sumbit",{
//					batchId:this.batchId,
					content:content
				});
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
		    },
			cancel() {
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
		.overflow{
			/*height: 92%;*/
			height: 444px;
			overflow-y: auto;
		}
		.Dialog {
			/*border-radius: none;
			height: auto;
			border-radius: 0 !important;*/
			min-width: 560px;
			height:auto;
			.projectSeting2 {
				margin-top: 20px;
				padding-left: 45px;
			}
			.inputRow {
				margin-left: 7em !important;
				span:first-child{
					margin-right: 5px;
				}
				.addTime {
					text-align: center;
					display: inline-block;
					width: 40px;
					height: 32px;
					line-height: 32px;
					color: #108EE9;
					cursor: pointer;
				}
				.linka{
					display: inline-block;
					margin-bottom: 4px;
				}
			}
			.textareaRow {
				width: 300px;
				margin-left: 130px;
				margin-bottom: 2px;
				.textBox {
					height: 80px;
					width: 228px;
					display: inline-block;
				}
				.textAligin {
					vertical-align: top;
					display: inline-block;
				}
			}
			#addTime {
				padding-left: 63px;
			}
			
		}
</style>
