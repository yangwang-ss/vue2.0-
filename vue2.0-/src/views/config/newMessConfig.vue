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
						<span class="textAligin">信息内容：</span>
						<textarea class="textBox" placeholder="请输入" v-model="content"></textarea>
					</div>
					<div class="textareaRow flexA">
						<span>异步发送：</span>
						<input type="checkbox" name="" id="" value="0" v-model="asny"/>
					</div>
					<div class="textareaRow flexA">
						<span>确保消息送达：</span>
						<input type="checkbox" name="" id="" value="0" v-model="arrival"/>
					</div>
					<div class="textareaRow flexA">
						<span>发送渠道：</span>
						<label for="per" v-for="(item,index) in sendKindList"><input type="checkbox"    id="per" :value="item.name" v-model="mediaName"/>{{item.value}}</label>
							<!--<Select v-model="mediaName" filterable multiple>
                       			<Option v-for="item in sendKindList" :value="item.name" :key="item.name">{{ item.value}}</Option>
                   		</Select>-->
					</div>
					<div v-if="mediaName[0]=='getui'||mediaName[1]=='getui'" style="margin-left: -2px;">
						<div class="inputRow">
						<span>图片上传：</span>
						<span class="uploadWap">
							<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload" ref = "upload"  :on-success="onSuccess" :on-error="onError">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           				</Upload>
						</span>
						<!--<input type="text" value="" placeholder="请输入" class="textInput" v-model="imageUrl"/>-->
					</div>
					<div class="inputRow">
						<span>链接地址：</span>
						<input type="text" value="" placeholder="请输入" class="textInput" v-model="linkUrl"/>
					</div>
					</div>
					<div class="bootom-button">
						<div class="middlBtnDefalt" @click="cancel">取消</div>
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
			//创建消息模板
			cMessageTemplate() {
				var that = this;
				this.axios.post('/msg/createCustomTemplate.do', {
					"description": that.description, //类型：String  必有字段  备注：消息说明
					"title": that.title, //类型：String  必有字段  备注：消息标题
					"content": that.content, //类型：String  必有字段  备注：消息内容
					"sendTime": Date.parse(new Date()), //类型：Number  可有字段  备注：发送时间
					"imageUrl": that.imageUrl, //类型：String  可有字段  备注：图片url
					"linkUrl": that.linkUrl, //类型：String  可有字段  备注：链接url
					"mediaName": that.mediaName,//发送渠道
					"isAsyn": that.asny ,//类型：Boolean  必有字段  备注：是否异步发送消息
					 "arrival":that.arrival//类型：Boolean  必有字段  备注：是否确保消息送达
				}).then((res) => {
					console.log(res);
					this.sendingKindList = res.data.data.value;
					//回调消息列表查询
					this.$emit('childeMethod');
					//console.log(this.templateState);
					console.log(this.mediaName[0]);
				}).catch(function(err) {})
			},
			cancel() {
				this.$emit("cancel");
			},
			save() {
				this.cMessageTemplate();
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
			
		}
	}
	
</style>