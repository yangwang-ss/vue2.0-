<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">编辑系统消息</span>
				<span class="cancelWap"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="floatWap">
				<div class="left">
					<div class="textareaRow">
						<span class="textAligin">模板描述：</span>
						<textarea class="textBox" placeholder="请输入" v-model="description"></textarea>
					</div>
					<div class="inputRow" style="margin-top: 10px;">
						<span>模板标题：</span>
						<input type="text" value="" placeholder="请输入" class="textInput" v-model="title"/>
					</div>
					<div class="textareaRow">
						<span class="textAligin">模板内容：</span>
						<textarea class="textBox" placeholder="请输入" v-model="content"></textarea>
					</div>
					<div class="textareaRow flexA">
						<span class="textAligin">发送渠道：</span>
						<label for="per" v-for="item in sendingKindList"><input type="checkbox" name="per" id="per" :value="item.name" v-model="checkBoxArr"/>{{item.value}}</label>
						<!--<label for="message"><input type="checkbox" name="per" id="message" value=""/>短信</label>-->
					</div>
					<div class="inputRow">
						<span>发送类型：</span>
						<span v-for="item in sendingKind"style="width:auto;margin-right: 8px;">{{item.type}}</span>
						<!--<Select v-model="sendingKind" class="select">
							<Option v-for="item in frominput1" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>-->
					</div>
					<div class="inputRow">
						<span>发送目标：</span>
						<span v-for="item in sendingKind" style="width:auto;margin-right: 8px;">{{item.value}}</span>
						<!--<Select v-model="sendingTarget" class="select">
							<Option v-for="item in frominput2" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>-->
					</div>
					
					<div v-if="checkBoxArr[0]=='getui'||checkBoxArr[1]=='getui'">
						<div class="inputRow">
						<span>图片：</span>
						<input type="text" value="" placeholder="请输入" class="textInput" v-model="imageUrl"/>
					</div>
					<div class="inputRow">
						<span>URL：</span>
						<input type="text" value="" placeholder="请输入" class="textInput" v-model="linkUrl"/>
					</div>
					</div>
					
				</div>
				<div class="right">
					<div class="title">标题</div>
					<div class="row">
						<span class="Width1">参数</span>
						<span>值</span>
					</div>
					<div class="row" v-for="item in systemParam">
						<span class="Width1">{{item.value}}&nbsp;:&nbsp;&nbsp;&nbsp;</span><span >{{item.name}}</span>
					</div>
				</div>
			</div>
			<div class="bootom-button">
						<div class="middlBtnDefalt" @click="cancel">取消</div>
						<div class="middleBtn1" @click="save">保存</div>
					</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//value2: ['2016-01-01', '2016-02-15'],
				description:'',
				title:'',
				content:'',
				showNewMessage: false,
				sendingKindList:[],
				checkBoxArr:[],
				sendingKind:[],
				systemParam:[],
				messageId:'',
				imageUrl:'',
				linkUrl:'',
				form_model3: '',
				frominput1: [{
						value: '1',
						label: '用户名称'
				}
				],
				frominput2:[
					{
						value: '1',
						label: '用户名称'
					},
					{
						value: '2',
						label: '用户手机号'
					}
				]
			}
		},
		mounted(){
			//获取发送渠道
			this.messageList();
			//查询消息目标类型
			//this.checkMessKind();
		},
		methods: {
			//获取发送渠道
			messageList() {
				this.axios.post('/msg/findSenderList.do', {

				}).then((res) => {
					//console.log(res);
					this.sendingKindList = res.data.data.value;
				}).catch(function(err) {})
			},
			//查询消息目标类型
//			checkMessKind(){
//				this.axios.post('/msg/findTargetTypeList.do', {
//
//				}).then((res) => {
//					//console.log(res);
//					this.frominput1 = res.data.data.value;
//				}).catch(function(err) {})
//			},
			//信息回显-获取消息模版信息
			showMess(id){
				this.axios.post('/msg/findTemplate.do',{
					 "messageId":id
				}).then((res)=>{
					console.log(res.data.data);
					this.description = res.data.data.description;
					this.title = res.data.data.title;
					this.content = res.data.data.content;
					this.checkBoxArr = res.data.data.mediaName;
					this.sendingKind= res.data.data.messageTarget;
					this.imageUrl = res.data.data.imageUrl;
					this.linkUrl = res.data.data.linkUrl;
					this.systemParam = res.data.data.systemParam;
					this.messageId = res.data.data.id;
				}).catch(function  (err) {
					console.log(err);
				});
			},
			//更新系统消息模板
			updateSystem(){
				var that = this;
				this.axios.post('/msg/updateSystemTempalte.do',{
					 "id":that.messageId,
					 "description":that.description,
					 "title":that.title,
					"content":that.content,
					"mediaName":that.checkBoxArr,
					"imageUrl":that.imageUrl,
					"linkUrl":that.linkUrl
				}).then((res)=>{
					this.$emit('childeMethod');
				}).catch(function  (err) {
					console.log(err);
				});
			},
			cancel() {
				this.$emit("cancel");
			},
			save() {
				this.updateSystem();
				console.log(this.checkBoxArr)
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		width: 52em;
	}
	.bootom-button{
		margin-top: 0 !important;
	}
	.floatWap {
		display: flex;
		justify-content: space-between;
		.left {
			margin-top: 3em;
			
			.inputRow {
				margin-left: 1em !important;
				margin-bottom: 20px;
				span{
					display: inline-block;
					width: 6em;
					text-align: right;
				}
			}
			.textAligin {
					width: 6em;
					text-align: right;
					vertical-align: top;
					margin-top: 5px;
					display: inline-block;
				}
			.textareaRow {
				width: 33em;
				margin-left: 1em;
				margin-bottom: 2px;
				
				.textBox {
					height: 80px;
					width: 228px;
				}
				
			}
			.flexA{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 15px;
				margin-bottom: 15px;
				label{
					margin-right: 20px;
				}
				*{
					vertical-align: middle;
				}
			}
			
		}
		.right {
			border-bottom-right-radius: 10px;
			width: 20em;
			background: #F9F9F9;
			
			.title{
				border-bottom: 1px solid #EBEBEB;
				padding-left: 15px;
				background: #F3F3F3;
				height: 40px;
				line-height: 40px;
			}
			.row{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-top: 20px;
				padding-left: 15px;
				padding-right: 15px;
				.Width1{
					white-space: nowrap;
					display: inline-block;
					min-width: 50px;
					text-align: left;
				}
				*{
					vertical-align: middle;
				}
			}
		}
	}
</style>