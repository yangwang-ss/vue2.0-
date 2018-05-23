<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">导出</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" @click="cancel"/></span>
			</div>
			<div class="inputRow">
				<span id="Date-picker3">
					
            	创建时间：<Date-picker format="yyyy-MM-dd HH:mm:ss" type="daterange" placement="bottom-end" placeholder="选择日期" :value="value2" v-model ='dateTime' :disabled="isDisabled"></Date-picker>
            </span>
			</div>
			<div class="export">
				<a class="middleBtn3"  ref='hrefs' v-if="dateTime[0]!=null||dateTime[1]!=null" v-show="Btn1" @click="exportData" :disabled="isExportDisabled">导出</a>
				<a class="middleBtn3"  ref='hrefs' v-else  style="cursor: not-allowed">导出</a>
				<a class="middleBtn3" @click="exportBtn" :href="URl" download="" ref='hrefs' v-show="Btn2" v-if="dateTime[0]!=null||dateTime[1]!=null">点击下载</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				Btn1: true,
				Btn2: false,
				isDisabled: false,
				isExportDisabled:false,
				value2: ['2016-01-01', '2016-02-15'],
				dateTime:[],
				URl:''
			}
		},
		methods: {
			initData(){
				this.dateTime = [];
				this.Btn1 = true;
				this.Btn2 = false;
				this.isDisabled = false;
				this.isExportDisabled = false;
			},
			cancel() {
				this.$emit('cancel');
			},
			//导出工单业务数据
			exportData() {
				const projectId = this.$route.query.projectId;
				var that = this;
				this.axios.post('/task/exportDataByCondition.do', {
					"startCreateTime":Date.parse(new Date(that.dateTime[0])), //类型：String  可有字段  备注：创建开始时间
					"endCreateTime":Date.parse(new Date(that.dateTime[1])), //类型：String  可有字段  备注：创建结束时间
					"projectId": projectId, //类型：String  必有字段  备注：项目Id
					//"batchId": "mock" //类型：String  可有字段  备注：批次Id
				}).then((res)=>{
					if(res.data.code==0){
						if(res.data.data.url==undefined){
							this.$Message.info('暂无数据可导');
							this.isExportDisabled = false;
							return false;
						}
						else{
							this.URl = res.data.data.url;
						this.$Message.success(res.data.msg);
						this.Btn2 = true;
						this.Btn1 = false;
						this.isDisabled = true;
						this.isExportDisabled = true;
						}
					}
					else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function  (err) {
					console.log(err);
				});
			},
			exportBtn(){
				this.dateTime='',
				this.$emit('cancel');
			}
			
		}
	}
</script>

<style lang="scss" scoped="scoped">
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
		border-top: 1px solid #E9E9E9;
		a{
			display: block;
			&:hover{
				color: #fff;
			}
		}
	}
	
	.middleBtn3 {
		margin: auto;
		margin-bottom: 20px;
		margin-top: 15px;
	}
</style>