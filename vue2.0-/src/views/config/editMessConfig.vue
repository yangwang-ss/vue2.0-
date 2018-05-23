<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建消息</span>
				<span class="cancelWap"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="floatWap">
				<div class="left">
					<div class="textareaRow">
						<span class="textAligin">模板描述：</span>
						<textarea class="textBox" placeholder="请输入" v-model="description"></textarea>
					</div>
					<div class="inputRow">
						<span>模板标题：</span>
						<input type="text" value="" placeholder="请输入" class="textInput" v-model="title"/>
					</div>
					<div class="textareaRow">
						<span>信息内容：</span>
						<textarea class="textBox" placeholder="请输入" v-model="content"></textarea>
					</div>
					<div class="textareaRow flexA">
						<span>是否异步发送：</span>
						<input type="checkbox" name="" id=""  v-model="asny"/>
					</div>
					<div class="textareaRow flexA">
						<span>确保消息送达：</span>
						<input type="checkbox" name="" id=""  v-model="arrival"/>
					</div>
					<div class="textareaRow flexA">
						<span>发送渠道：</span>
						<label for="per" v-for="item in sendKindList"><input type="checkbox" name="per" id="per" :value="item.name" v-model="mediaName"/>{{item.value}}</label>
						<!--<Select v-model="mediaName" filterable multiple>
                       <Option v-for="item in sendKindList" :value="item.name" :key="item.name">{{ item.value}}</Option>
                   </Select>-->
					</div>
					<div v-if="mediaName[0]=='getui'||mediaName[1]=='getui'" style="margin-left: -2px;">
						<div class="inputRow">
						<span>图片：</span>
						<!--<input type="text" value="" placeholder="请输入" class="textInput" v-model="imageUrl"/>-->
						<span class="uploadWap">
							<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload" ref = "upload"  :on-success="onSuccess" :on-error="onError">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           				</Upload>
						</span>
					</div>
					<div class="inputRow">
						<span>链接地址：</span>
						<input type="text" value="" placeholder="请输入" class="textInput" v-model="linkUrl"/>
					</div>
					</div>
					<div class="bootom-button1">
						<div class="middleBtn1" @click="save">提交</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				description:'',
				content:'',
				taskTime: '',
				imageUrl:'',
				linkUrl:'',
				mediaName:[],
				asny:true,
				arrival:false,
				sendKindList:[],
				messTempleteId:'',//消息模板id
				value2: ['2016-01-01', '2016-02-15'],
				showNewMessage: false,
				value1:'1',
				sendingKind: '',
				sendingTarget: '',
				form_model3: '',
				picture: {
					data: {},
					action: '/fileUpload.do',
					src: "",
					/* accept: "png,jpg",
					format: ['png', 'jpg'],
					size: 1,
					showUploadList: false,
					validateErrorTip: '', */
					uploadFile: null,
				},
				frominput1: [{
						value: '1',
						label: '用户名称'
					},
					{
						value: '2',
						label: '用户手机号'
					},
					{
						value: '3',
						label: '用户权限'
					},
					{
						value: '4',
						label: '所有用户'
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
			this.messageList();
		},
		methods: {
									handleUpload(file) {
				let _this = this;
				//console.log(file.name)
				if(!validateImageFile(file)) {
					return false;
				};
				let formdata = new FormData();
				
					 formdata.append('file', file, file.name);
      				 formdata.append('type', '1');
					console.log(formdata);
					console.log(formdata.get("file"));
				
				//formdata.append('type', '1');

				var option = {
					method: 'post',
					url: this.picture.action,
					data: formdata
				}

				this.axios(option).then(function(response) {
					//console.log(response);
					if(!response) {
						_this.$Message.error("错误");
						return;
					}
					let result = response.data;
					if(!result || !result.code || result.code != 0) {
						_this.$Message.error(result.msg);
						return;
					}
					if(result.code == 0) {
						_this.picture.src = result.data.value;
						console.log(result.data.value);
						//_this.infoForm.photo = result.data.value;
						var msg = result.msg;
						_this.imageUrl = result.data.value; 
						_this.$Message.success(msg);
					}
				});

				function validateImageFile(file) {
					if(!file) {
						_this.$Message.success('文件出错');
						return false;
					}
//
//					if(file.size > 500 * 1024) {
//						_this.$Message.success('图片大小不能超过500k');
//						return false;
//					}

					let types = file.type.split('/');
//
					if(types[0] != 'image') {
						_this.$Message.success('只能是jpg、jpeg、png图片');
						return false;
					}

//					if(['jpg', 'jpeg', 'png'].indexOf(types[1]) < 0) {
//						_this.$Message.success('只能是jpg、jpeg、png图片');
//						return false;
//					}
					return true;
				}
				return false;
			},
			onSuccess(response, file, fileList) {
				localImagePreview("preview", fileList);
				this.picture.validateErrorTip = '';
				this.picture.uploadFile = null;
				this.$Message.success('上传成功');
			},
			onError(error, file, fileList) {
				localImagePreview("preview", fileList);
				this.picture.validateErrorTip = '';
				this.picture.uploadFile = null;
				this.$Message.error('上传失败');
			},
			//时间戳
			gettasktime(ti) {
				var src = new Date(ti);
				var dest = src.getTime();
				return dest;
			},
			//获取发送渠道
			messageList() {
				this.axios.post('/msg/findSenderList.do', {

				}).then((res) => {
					console.log(res);
					this.sendKindList = res.data.data.value;
					console.log(this.templateState)
				}).catch(function(err) {})
			},
			//消息回显
					showMess(id) {
				var that = this;
				this.axios.post('/msg/findTemplate.do', {
					"messageId":id               //类型：String  必有字段  备注：无
				}).then((res) => {
					console.log(res);
					this.description = res.data.data.description;
					this.title = res.data.data.title;
					this.content = res.data.data.content;
					this.asny = res.data.data.isAsyn;
					this.arrival = res.data.data.arrival;
					this.mediaName = res.data.data.mediaName;
					this.imageUrl = res.data.data.imageUrl;
					this.linkUrl = res.data.data.linkUrl;
					this.messTempleteId = res.data.data.id;
				}).catch(function(err) {});
			},
			//编辑消息提交
			commitMess(){
				var that = this;
				this.axios.post('/msg/updateCustomTemplate.do',{
					"id":that.messTempleteId,                //类型：String  必有字段  备注：唯一标识
				    "description":that.description,                //类型：String  必有字段  备注：说明
				    "title":that.title,                //类型：String  必有字段  备注：标题
				    "content":that.content,                //类型：String  必有字段  备注：内容
				    "sendTime":Date.parse(new Date()),                //类型：String  可有字段  备注：发送时间
				    "imageUrl":that.imageUrl,                //类型：String  必有字段  备注：图片地址
				    "linkUrl":that.linkUrl,                //类型：String  必有字段  备注：链接地址
				    "mediaName": that.mediaName,
				    "isAsyn":that.asny,               //类型：Boolean  必有字段  备注：是否异步发送
				    "arrival":that.arrival              //类型：Boolean  必有字段  备注：是否确保消息送达
				}).then((res)=>{
					console.log(res);
					//回调消息列表查询
					this.$emit('childeMethod');
				}).catch(function(err){});
			},
			cancel() {
				this.$emit("cancel");
			},
			//提交
			save() {
				this.commitMess();
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		
		.uploadWap {
			display: inline-block;
			position: relative;
			width: 80px;
			height: 27px;
			.upLoad {
				z-index: 300;
				position: absolute;
				left: 0;
				height: 27px;
				width: 80px;
				visibility: hidden;
			}
			img {
				z-index: 100;
				position: absolute;
				left: 0;
				width: 80px;
				height: 27px;
			}
		}
	}
	
	.floatWap {
		
		.left {
			margin-top: 60px;
			.inputRow {
				width: 33em;
				margin-bottom: 20px;
				span{
					display: inline-block;
					width: 8em;
					text-align: right;
				}
			}
			.textareaRow {
				width: 33em;
				margin-left: 10em;
				margin-bottom: 2px;
				span{
					display: inline-block;
					width: 8em;
					text-align: right;
				}
				.textBox {
					height: 80px;
					width: 228px;
				}
				.textAligin {
					vertical-align: top;
					margin-top: 5px;
					display: inline-block;
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
			.bootom-button1 {
				margin-top: 6em;
				margin-bottom: 4em;
				.middleBtn1 {
					margin-left: 175px !important;
					margin: 0 auto !important;
				}
			}
		}
	}
	
</style>