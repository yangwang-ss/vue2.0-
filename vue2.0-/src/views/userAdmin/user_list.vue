<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建用户</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png"/></span>
			</div>
			<div class="overflow">
				<div class="inputRow inputRow1">
					<span>用户类型：</span>
					<Select clearable v-model="work_model1" class="select">
						<Option v-for="item in workinput1" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>账号<i style="color: red;">*</i>：</span>
					<input v-model="accounts" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow" v-if="work_model1=='person'">
					<span>公司名称<i style="color: red;">*</i>：</span>
					<input v-model="companyaccounts" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow" v-if="work_model1=='person'">
					<span>公司税号<i style="color: red;">*</i>：</span>
					<input v-model="companydutys" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="bootom-button">
					<div class="middlBtnDefalt" @click="cancel">取消</div>
					<div class="middleBtn1" @click="btn">确定</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import newEnter from "@/views/userAdmin/enterprise"
	import newService from "@/views/userAdmin/serviceson"
	export default {
		data() {
			return {
				showmodel4: false,
				showmodel5: false,
				work_model1: '',
				accounts: '',
				companyaccounts: '',
				companydutys: '',
				workinput1: [{
						value: 'company',
						label: '企业'
					},
					{
						value: 'person',
						label: '个人'
					}
				]
			}
		},

		watch: {
			work_model1(v) {
				console.log(v, "sas");
				if(v == "company") {
					this.showmodel4 = true;
					this.showmodel5 = true;
				}
				if(v == "person") {
					this.showmodel4 = false;
					this.showmodel5 = false;
				}
			}
		},
		methods: {
			//数据初始化
			init() {
				this.work_model1 = "";
				this.accounts = "";
				this.companyaccounts = "";
				this.companydutys = "";
			},
			btn() {
				if(this.work_model1 == '') {
					return false;
				}
				//必填项验证
				if(this.work_model1 == 'company') {
					if(this.accounts == '' || this.companyaccounts == '' || this.companydutys == '') {
						this.$Message.info('请填写必填信息');
						return false;
					} else {
						var that = this;
						let content = {
							work_model1: that.work_model1,
							accounts: that.accounts,
							companyaccounts: that.companyaccounts,
							companydutys: that.companydutys,
						}
						this.$emit("addsumbit", {
							//					id:this.id,
							content: content
						});
						this.showmodel4 = false;
					}
				}
				if(this.work_model1 == 'person') {
					if(this.accounts == '') {
						this.$Message.info('请填写必填信息');
						return false;
					} else {
						var that = this;
						let content = {
							work_model1: that.work_model1,
							accounts: that.accounts,
							companyaccounts: that.companyaccounts,
							companydutys: that.companydutys,
						}
						this.$emit("addsumbit", {
							//					id:this.id,
							content: content
						});
						this.showmodel4 = false;
						this.work_model1 = "";
						this.accounts = "";
						this.companyaccounts = "";
						this.companydutys = "";
					}
				}
			},
			cancel() {
				this.$emit("cancel");
				this.showmodel4 = false;
				this.work_model1 = "";
				this.accounts = "";
				this.companyaccounts = "";
				this.companydutys = "";
			},
			//			childpson(e){
			//				this.$emit("childs",e);
			//			}
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow {
		height: auto;
		position: relative;
		.inputRow {
			width: 400px;
			span {
				width: 66px;
				text-align: right;
				display: inline-block;
			}
		}
		.inputRow1 {
			margin-top: 8%;
		}
	}
	
	.Dialog {
		min-width: 560px;
		.headTitle {
			/*margin-bottom: 22px;*/
		}
		.inputRow {
			margin-bottom: 25px;
		}
		
	}
</style>