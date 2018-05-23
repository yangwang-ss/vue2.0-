<template>
	<div>
		<div class="DialogShdow" v-show="showSerce"></div>
		<div class="Dialog" v-show="showSerce">
			<div class="headTitle">
				<span class="title">新建用户</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="overflow">
				<!--<div class="inputRow">
					<span>用户类型：</span>
					<Select v-model="work_model1" class="select">
						<Option v-for="item in workinput1" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>账号*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>密码*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>-->
				<div class="inputRow">
					<span>手机号：</span>
					<input v-model="seriphnoe" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
			</div>
			<div class="exportBtnwap">
				<div class="middleBtn3" @click="btn">确定</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showSerce: false,
				seriphnoe:"",
				workinput1: [{
						value: '1',
						label: '企业'
					},
					{
						value: '0',
						label: '服务者'
					}
				],
				work_model1: '',
			}
		},
		methods: {
			showService() {
				this.showSerce = true;
			},
			cancel() {
				this.showSerce = false;
				this.$emit("cancels");
			},
			btn() {
				this.showSerce = false;
				var that = this;
				let content={
					seriphnoe:that.seriphnoe,
				}
				this.$emit("childpson",{
//					id:this.id,
					content:content
				});
				this.seriphnoe = "";
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow{
		height: 222px;
		overflow-y: auto;
		.inputRow{
			width: 400px;
			span{
				width: 60px;
				text-align: right;
				display: inline-block;
			}
		}
	}
	.Dialog {
		min-width: 560px;
		min-height: 300px;
		.headTitle{
			margin-bottom: 22px;
		}
		.inputRow {
			margin-bottom: 25px;
		}
		.middleBtn3 {
			margin: 0 auto;
			background: #108EE9;
		}
	}
</style>