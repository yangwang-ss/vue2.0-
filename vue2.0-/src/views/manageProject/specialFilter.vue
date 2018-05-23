<template>
	<div id="specialF">
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">特殊筛选</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" /></span>
			</div>
			<div>
				<div class="add-nameContent">
				<div class="nameContent-list" v-for="(item,index) in question.similarity">
					<span  ref="changeWord" class="spanW">or</span>
					<Select v-model="form_model1[index]" class="select" clearable>
						<Option v-for="item in phoneTime" :value="item" :key="item">{{item}}</Option>
					</Select>
					<Select v-model="form_model2[index]" class="select" clearable>
						<Option v-for="item in between" :value="item.value" :key="item.value">{{item.label}}</Option>
					</Select>
					<input type="text" placeholder="请输入" v-model="item.value" style="height: 27px;width: 100px;">
					<div style="width: 38px;">
						<span @click="deleteQuestionSimilarity(index)">
							<i class="icon iconfont icon-retract"></i>
						</span>
						<span class="drowDownWap">
							<i  class="icon iconfont icon-spread"v-if="index===(question.similarity.length-1)"></i>
							<div class="dropDown">
								<div @click="addQuestionSimilarity(0,index)">OR</div>
								<div @click="addQuestionSimilarity(1,index)">AND</div>
							</div>
						</span>
					</div>
				</div>
			</div>
			</div>
			
			<div style="width: 150px;margin: 20px auto;margin-top:40px;position: relative;">
				<div class="middleBtn1" @click="entrue" style="position: static;">确定</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form_model1: [],
				form_model2: [],
				phoneTime: [],
				between: [{
						value: '1',
						label: '大于'
					},
					{
						value: '2',
						label: '等于'
					},
					{
						value: '3',
						label: '小于'
					}
				],
				bouncesHide1: false,
				question: {
					similarity: [{
						value: ""
					}]
				}
			}
		},
		mounted(){
			this.findFormTableHead();
		},
		methods: {
			entrue(){
				console.log(this.question.similarity);
			},
			cancel() {
				this.$emit("cancel")
			},
			addQuestionSimilarity(num,index) {
				let arr = {
					value: ""
				};
				if (num==0) {
						this.$refs.changeWord[index].innerText="or"
				}else if(num==1){
						this.$refs.changeWord[index].innerText="and"
					}
				this.question.similarity.push(arr);
			},
			//查询工单导出表头
			findFormTableHead() {
				const id = this.$route.query.batchId;
				this.axios.post('/task/findFormTableHead.do', {
					"batchId": id //类型：String  必有字段  备注：项目Id
				}).then((res) => {
					//console.log(res);
					this.phoneTime = res.data.data.result;
				}).catch((err) => {
					console.log(err);
				});
			},
			deleteQuestionSimilarity(index) {
				if(this.question.similarity.length > 1) {
					this.question.similarity.splice(index, 1);
				} else {
					this.$Message.warning("抱歉,不能再删了")
				}
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		width: 58em !important;
		height: auto !important;
	}
	
	.drowDownWap {
		position: relative;
	}
	.drowDownWap:hover .dropDown{
		display: block;
	}
	.dropDown {
		display: none;
		border: 1px solid #ccc;
		border-radius: 3px;
		width: 40px;
		height: 60px;
		right: 0;
		top: 17px;
		position: absolute;
		div{
			text-align: center;
			height: 30px;
			line-height: 30px;
			cursor: pointer;
		}
	}
	
	.middleBtn1 {
		position: absolute;
		bottom: 3em;
	}
	.add-nameContent {
		margin-top: 40px;
		.spanW{
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