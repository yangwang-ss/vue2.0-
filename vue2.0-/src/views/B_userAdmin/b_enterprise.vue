<template>
	<div>
		<div class="DialogShdow" v-show="showEnter"></div>
		<div class="Dialog" v-show="showEnter">
			<div class="headTitle">
				<span class="title">新建用户</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="overflow">
				<div class="inputRow">
					<span>用户类型：</span>
					<Select v-model="work_model1" class="select">
						<Option v-for="item in workinput1" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>企业名称*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>企业简称*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>企业网站：</span>
					<input type="text" value="" placeholder="请设置1~100权重" class="textInput" />
				</div>
				<div class="inputRow">
					<span>企业地址：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>客服联系人姓名*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>客服电话*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>财务联系人姓名*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>企业财务电话*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="textareaRow">
					<span class="textAligin">企业备注：</span>
					<textarea class="textBox" placeholder="请输入"></textarea>
				</div>
				<div class="inputRow">
					<span>组织机构代码证*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>营业执照：</span>
					<span class="file">上传文件
						<img src="@/static/img/upimg.png" alt="" />
						<input type="file" placeholder="上传文件" class="upLoadImg"/>
					</span>
					<p class="p_all">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
				</div>
				<div class="inputRow">
					<span>开户行*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>开户主体*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>账号*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>密码*：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" />
				</div>

			</div>
			<div class="exportBtnwap">
				<div class="middleBtn3" @click="btn">提交</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showEnter: false,
				workinput1: [{
						value: '1',
						label: '企业'
					},
					{
						value: '0',
						label: '服务者'
					}
				],
				work_model1: ''
			}
		},
		methods: {
			showEnterPir() {
				this.showEnter = true;
			},
			cancel() {
				this.showEnter = false;
			},
			btn() {
				this.showEnter = false;
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow{
		height: 444px;
		overflow-y: auto;
		.inputRow{
			width: 400px;
			span{
				width: 104px;
				text-align: right;
				display: inline-block;
			}
		}
	}
	.Dialog {
		min-width: 560px;
		min-height: 300px;
		.textareaRow {
			width: 300px;
			margin-left: 130px;
			margin-bottom: 2px;
			.textBox {
				height: 80px;
				width: 230px;
			}
			.textAligin {
				vertical-align: top;
				margin-top: 5px;
				display: inline-block;
			}
		}
		.headTitle{
			margin-bottom: 22px;
		}
		.inputRow {
			margin-bottom: 15px;
			margin-left: 86px;
			.file{
				position: relative;
			    display: inline-block;
			    border: 1px solid #ddd;
			    border-radius: 22px;
			    padding: 4px 16px;
			    overflow: hidden;
			    color: #666;
			    text-decoration: none;
			    text-indent: 0;
			    line-height: 14px;
			    img{
			    	float: left;
			    }
			    .upLoadImg{
			    	position: absolute;
				    font-size: 100px;
				    right: 0;
				    top: 0;
				    opacity: 0;
			    }
			}
			.p_all{
				margin-left: 108px;
    			margin-top: 6px;
			}
		}
		.exportBtnwap{
			.middleBtn3 {
				margin: 0 auto;
				background: #108EE9;
			}
		}
	}
</style>
