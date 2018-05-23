<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建模板</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" /></span>
			</div>
			<div class="inputRow">
				<span class="textW">模板名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" v-model = "description"/>
			</div>
			<div class="textareaRow">
				<span class="textAligin textW">描述：</span>
				<textarea class="textBox" placeholder="请输入" v-model = "remark"></textarea>
			</div>
			<div class="bootom-button">
				<div class="middlBtnDefalt" @click="cancel">取消</div>
				<div class="middleBtn1" @click="entrue">保存</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				description:'',
				remark:''
			}
		},
		methods:{
			//新增结算模板
			newSettitleTemplte(){
				let that = this;
				this.axios.post('/settle/createTemplate.do',{
					 "description":that.description,    //类型：String  必有字段  备注：模板名称
    				 "remark":that.remark              //类型：String  可有字段  备注：描述
				}).then((res) =>{
					//回调结算模板列表接口
					this.$emit('childeMethod');
					//console.log(res.data);
				}).catch(function  (err) {
					
				});
			},
			entrue() {
				this.newSettitleTemplte();
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
		.Dialog{
			
			.textW{
					width: 6em;
					display: inline-block;
					text-align: right;
				}
			.inputRow{
				margin-top: 45px;
				margin-bottom: 20px;
			}
			.textareaRow {
				width: 33em;
				margin-left: 10em;
				margin-bottom: 2px;
				.textBox {
					height: 150px;
					width: 228px;
				}
				
				.textAligin {
					vertical-align: top;
					margin-top: 5px;
					display: inline-block;
				}
			}
			
		}
</style>