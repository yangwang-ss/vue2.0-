<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">编辑新建模板</span>
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
				<div class="middleBtn1" @click="entrue">确定</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				description:'',
				remark:'',
				reviseid:''
			}
		},
		methods:{
			//信息回显
			showMess(id){
				var that = this;
				this.axios.post('/settle/searchSettlementInfo.do',{
					"id":id                //类型：String  必有字段  备注：无
				}).then((res)=>{
					this.description = res.data.data.description;
					this.remark = res.data.data.remark;
					this.reviseid = res.data.data.id;
				}).catch(function  (err) {
					
				});
			},
			//编辑
			editSettitle() {
				var that = this;
				this.axios.post('/settle/updateTemplate.do',{
					"id": that.reviseid, //类型：String  必有字段  备注：唯一标识
					"description": that.description, //类型：String  可有字段  备注：名称
					"remark": that.remark//类型：String  可有字段  备注：说明
				}).then((res)=>{
					this.$emit('childeMethod');
				}).catch(function  (err) {
					
				});
			},
			entrue() {
				this.editSettitle();
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