<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建模板</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" /></span>
			</div>
			<div class="inputRow">
				<span class="textW">模板名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" ref = "inputText"/>
			</div>
			<div class="textareaRow">
				<span class="textAligin textW">描述：</span>
				<textarea class="textBox" placeholder="请输入" ref = "textaeraText"></textarea>
			</div>
			<div class="inputRow" style="margin-top: 15px;margin-bottom: 20px;">
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
	export default{
		data(){
			return{
				showHiden:false,
				templetId:'',
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
		methods:{
			//查看模板信息
			templteDetail(id){
				var that = this;
				that.templetId=id;
				this.axios.get('/config/voice/inspection/detail/'+id+'.do',{
				}).then((res) =>{
					console.log(res);
					this.$refs.inputText.value = res.data.data.name;
					this.$refs.textaeraText.value = res.data.data.description;
				}).catch(function(err){})
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
			//修改模板
			reviseTemplate(){
				var that = this;
				var templateName =  this.$refs.inputText.value;
				var description = this.$refs.textaeraText.value;
				var id = that.templetId;
				//alert(id);
				this.axios.post('/config/voice/inspection/modify/'+id+'.do',{
					'templateName':templateName,
					'description':description,
					"excelUrl":that.temPlateUrl
				}).then((res) =>{
					if(res.data.code=='0'){
						//回调语音质检列表接口
						this.$emit('childeMethod');
						this.$Message.success(res.data.msg)
					}else {
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch(function  (err) {
					console.log(err)
				});
			},
			entrue() {
				this.reviseTemplate();
				this.$emit("cancel");
			},
			cancel() {
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
				.bottomMessTip{
				padding-left: 75px;
				margin-top: 10px;
			}
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