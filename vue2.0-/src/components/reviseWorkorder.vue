<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建模板</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" /></span>
			</div>
			<div class="inputRow" style="margin-top: 25px;">
				<span class="textW">模板名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" ref="inputText" />
			</div>
			<div class="inputRow">
				<span class="textW">选择规则：</span>
				<span><Select v-model="modelRule" ref = "projectKinds">
               <Option v-for="item in chooseRule" :value="item.value" :key="item.value">{{ item.label }}</Option></Select></span>
			</div>
			<div class="textareaRow">
				<span class="textAligin textW">描述：</span>
				<textarea class="textBox" placeholder="请输入" ref="textaeraText"></textarea>
			</div>
			<div class="bootom-button">
				<div class="middleBtn1" @click="entrue">确定</div>
				<div class="middleBtn4" @click="cancel">取消</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				modelRule: '',
				chooseRule: [{
						value: 'beijing',
						label: '北京市'
					},
					{
						value: 'shanghai',
						label: '上海市'
					},
				]
			}
		},
		methods: {
			//新增模板
			newTemplate() {
				var templateName = this.$refs.inputText.value;
				var description = this.$refs.textaeraText.value;
				//alert(templateName);
				this.axios.post('/config/voice/inspection/add.do', {
					'templateName': templateName,
					'description': description
				}).then((res) => {
					//回调语音质检列表接口
					this.$emit('childeMethod');
					//console.log(res.data);
				}).catch(function(err) {

				});
			},
			entrue() {
				//this.newTemplate();
				this.$emit("cancel");
			},
			cancel() {
				//this.newTemplate();
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		height: 465px;
		.inputRow {
			margin-top: 20px;
			margin-bottom: 20px;
		}
		.textareaRow {
			width: 300px;
			margin-left: 130px;
			margin-bottom: 2px;
			.textBox {
				height: 150px;
				width: 228px;
			}
			.textW {
				width: 60px;
				display: inline-block;
				text-align: right;
			}
			.textAligin {
				vertical-align: top;
				margin-top: 5px;
				display: inline-block;
			}
		}
	}
</style>