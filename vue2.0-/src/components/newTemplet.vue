<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建模板</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" /></span>
			</div>
			<div class="inputRow">
				<span class="textW">模板名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" ref="inputText" />
			</div>
			
			<div class="textareaRow">
				<span class="textAligin textW">描述：</span>
				<textarea class="textBox" placeholder="请输入" ref="textaeraText"></textarea>
			</div>
			<div class="inputRow" style="margin-top: 0px;margin-bottom: 20px;">
				<span class="textW">规则导入：</span>
				<span class="uploadWap">
					<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload"  ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
           			</Upload>
				</span>
				<span style="width: 100px;text-align: right;display: inline-block;" v-if="showHiden" ref="showUploadS">正在上传中...</span>
				<div ref="dataNameShow" class="bottomMessTip"></div>
			</div>
			<div class="bootom-button">
				<div class="middlBtnDefalt" @click="cancel">取消</div>
				<div class="middleBtn1" @click="entrue">确定</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showHiden:false,
				picture: {
					data: {},
					action: '/upload.do',
					src: "",
					uploadFile: null,
				},
				files: [],
				fileId: '',
				temPlateUrl:''
			}
		},
		methods: {
			//数据初始化
			initData(){
				this.$refs.inputText.value = '';
				this.$refs.textaeraText.value ='';
				this.$refs.dataNameShow.innerText = '';
				this.showHiden = false;
				this.fileId = '';
			},
			//新增模板
			newTemplate() {
				var templateName = this.$refs.inputText.value;
				var description = this.$refs.textaeraText.value;
				var that = this;
				//alert(templateName);
				this.axios.post('/config/voice/inspection/add.do', {
					'templateName': templateName,
					'description': description,
					"excelUrl":that.temPlateUrl
				}).then((res) => {
					//回调语音质检列表接口
					if(res.data.code == 0) {
						this.$emit('childeMethod');
					} else {
						this.$Message.error(res.data.msg);
						return false;
					}
					//console.log(res.data);
				}).catch((err) => {
					console.log(err);
					this.$Message.warning(err.data.msg);
				});
			},
			handleUpload(file) {
				this.showHiden = true;
				let _this = this;
				//console.log(file.name)
				if(!validateImageFile(file)) {
					return false;
				};
				let formdata = new FormData();
				formdata.append('file', file, file.name);
				formdata.append('type', '1');
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
						_this.$refs.dataNameShow.innerText = file.name;
						_this.$refs.showUploadS.innerText = '上传成功'
						_this.fileId = result.data.srcId;
						_this.temPlateUrl = result.data.url;
						//_this.infoForm.photo = result.data.value;
						var msg = result.msg;
						_this.$Message.success(msg);
						_this.$refs.showUploadS.innerText = '上传成功'
					}
				});

				function validateImageFile(file) {
					if(!file) {
						_this.$Message.success('文件出错');
						return false;
					}
					return true;
				}
				return false;
			},
			entrue() {
				this.newTemplate();
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
		.textW {
			width: 6em;
			display: inline-block;
			text-align: right;
		}
		.inputRow {
			margin-top: 45px;
			margin-bottom: 15px;
			.bottomMessTip{
				padding-left: 75px;
				margin-top: 10px;
			}
		}
		.textareaRow {
			width: 33em;
			margin-left: 10em;
			margin-bottom: 10px;
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
</style>