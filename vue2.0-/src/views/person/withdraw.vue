<template>
	<div>
		<div class="DialogShdow" v-show="showCash"></div>
		<div class="Dialog" v-show="showCash">
			<div class="headTitle">
				<span class="title">提现</span>
				<span class="cancelWap"><img src="../../../static/img/cancel.png" @click="hideCash"/></span>
			</div>
			<div class="row">
				<span class="lWidth">现金账户余额：</span>
				<span>2300</span>
			</div>
			<div class="row">
				<span class="lWidth">可用余额：</span>
				<span>2300</span>
			</div>
			<div class="row">
				<span class="lWidth">提现公司：</span>
				<span>*****公司</span>
			</div>
			<div class="row">
				<span class="lWidth">提现申请人：</span>
				<span>张三</span>
			</div>
			<div class="row">
				<span class="lWidth">收款银行：</span>
				<span>中国建设银行</span>
			</div>
			<div class="row">
				<span class="lWidth">银行账号：</span>
				<span>4123448594859485</span>
			</div>
			<div class="row">
				<span class="lWidth">提现金额：</span>
				<input type="text" class="boxborder" placeholder="请输入提现金额"/>
				<span>元</span>
			</div>
			<div class="row">
				<span class="lWidth">确认转出金额：</span>
				<span>2300</span>
				<span>元</span>
			</div>
			<div class="row">
				<span class="lWidth">登入密码：</span>
				<input type="password" placeholder="请输入登入密码" class="boxborder"/>
			</div>
			<div class="middleBtn1" @click="entrue">确认提现申请</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				showCash:false
			}
		},
		methods:{
			showcash(){
				
				this.showCash = true;
			},
			hideCash(){
				this.showCash = false;
				this.$emit("cancel");
			},
			entrue(){
				this.showCash = false;
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
.middleBtn1{
			margin: auto;
			margin-bottom: 30px;
		}
		.Dialog{
			.headTitle{
				margin-bottom: 60px;
			}
			.row{
				margin-left: 60px;
				margin-bottom: 30px;
				color: #999;
				.lWidth{
					display: inline-block;
					width: 100px;
					text-align: right;
					margin-right: 5px;
				}
				.boxborder{
					padding: 0 10px;
						display: inline-block;
						width: 240px;
						height: 25px;
						line-height: 24px;
						border: 1px solid #D9D9D9;
						border-radius: 5px;
				}
			}
			.entrueBtn{
					width: 220px;
					height: 60px;
					text-align: center;
					line-height: 60px;
					color: #fff;
					background: #108EE9;
					font-size: 16px;
					border-radius: 3px;
					margin-left: 100px;
					margin-top: 40px;
					cursor: pointer;
				}
		}

</style>