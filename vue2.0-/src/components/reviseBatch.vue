<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">编辑批次</span>
				<span class="cancelWap"><img src="../image/cancel.png" @click="cancel"/></span>
			</div>
			<div class="projectSeting title">批次设置</div>
			<div class="inputRow">
				<span class="redStar">批次名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" v-model="batchName" />
			</div>
			<div class="inputRow" v-if="Type==2||Type==5">
				<span class="redStar">任务总数：</span>
				<input type="number" value="" class="textInput" v-model="tasktotalNum" />
			</div>
			<div class="inputRow" v-else :class="'selctKind'">
				<span>任务总数：</span>
				<input type="number" value="" class="textInput" v-model="tasktotalNum" />
			</div>
			<div class="inputRow">
				<span class="redStar">接单个数：</span>
				<input type="number" value="" class="textInput" v-model="orderNum" />
			</div>
			<div class="inputRow">
				<span>结算模板：</span>
				<Select v-model="accountName" class="select" filterable>
					<Option v-for="item in account_Id" :value="item.id" :key="item.id">{{ item.description }}</Option>
				</Select>
			</div>
			<!--临时外加显示分配率-->
			<div class="inputRow" v-if="Type==2">
				<span>分配率：</span>
				<Select v-model="screenRates" class="select">
					<Option v-for="item in screenRatesList" :value="item.key" :key="item.key">{{item.value}}</Option>
				</Select>
			</div>
			<div class="inputRow" v-else :class="'selctKind'">
				<span>分配率显示：</span>
				<Select v-model="screenRates" class="select">
					<Option v-for="item in screenRatesList" :value="item.key" :key="item.key">{{item.value}}</Option>
				</Select>
			</div>
			<div class="inputRow">
				<span class="redStar">批次周期：</span>
				<input type="number" value="" class="textInput" v-model="cycle" />
			</div>
			<div class="inputRow">
				<span class="redStar">预警时间：</span>
				<Date-picker type="date" placeholder="选择日期" style="width: 200px" v-model="warningTime"></Date-picker>
				<!--<input type="text" value="" class="textInput" v-model="warningTime" />-->
			</div>
			<div class="inputRow" v-if="Type==1||Type==3||Type==4">
				<span class="redStar">数据上传：</span>
				<span class="uploadWap">
					<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           			</Upload>
				</span>
				<span style="min-width: 60px;margin-left: 15px;" v-if="showHiden" ref="showUploadS">正在上传中...</span>
				<a :href="wordsUrl" download="" style="width: 100px;text-align: right;display: inline-block;" v-if="showHiden2">点击下载查看</a>
			</div>
			<div class="inputRow" v-else :class="'selctKind'">
				<span>数据上传：</span>
				<span class="uploadWap">
					<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           			</Upload>
				</span>
				<a v-if="this.wordsUrl!=''" :href="wordsUrl" download="" style="width: 100px;text-align: right;display: inline-block;">点击下载查看</a>
			</div>
			<div class="tipText" ref="textName">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
			<div class="bootom-button">
				<div class="middleBtn1" @click="release">发布</div>
				<div class="middleBtn2" @click="save">保存</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				Type: '', //项目类型
				status: '',
				tasktotalNum: '', //任务总数
				orderNum: '', //接单个数
				batchName: '', //批次名称
				//batchId:'',//批次id
				cycle: '', //周期
				warningTime: '',
				picture: {
					data: {},
					action: '/upload.do',
					src: "",
					uploadFile: null,
				},
				files: [],
				fileId: '',
				account_Id: [],
				showHiden: false,
				showHiden2: false,
				accountName: '',
				accountId: '',
				screenRates: '', //分配率
				resolution: 'resolution',
				screenRatesList: [], //分配率数组
				wordsUrl: ''
			}
		},
		mounted() {
			//分页查询结算模板
			this.settitleTemplete();
			//分辨率
			this.screenRate();
			this.getAddress();
		},
		methods: {
			//获取地址栏项目类型参数判断不同的批次界面
			getAddress() {
				this.Type = this.$route.query.type;
			},
			cancel() {
				this.$emit("cancel");
			},
			//文件数组
			flieArr() {
				this.files.splice(0, this.files.length);
				var a = this.fileId;
				this.files.push(a);
			},
			//分页查询结算模板
			settitleTemplete() {
				this.axios.post('/settle/searchTempalte.do', {
					"pageNum": 1, //类型：Number  必有字段  备注：页码
					"pageSize": 100 //类型：Number  必有字段  备注：每页大小
					//					"status": 1 //类型：Number  可有字段  备注：状态
				}).then((res) => {
					console.log(res);
					this.account_Id = res.data.data.list;
				}).catch(function(err) {});
			},
			//分配率显示
			screenRate() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.resolution //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					console.log("分辨率");
					this.screenRatesList = res.data.data.value;
				}).catch(function(err) {
					console.log(err);
				});
			},
			handleUpload(file) {
				this.showHiden = true;
				this.showHiden2 = false;
				this.files = [];
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
						_this.$refs.textName.innerText = file.name;
						_this.fileId = result.data.srcId;
						_this.files.push(result.data.srcId);
						console.log(_this.files);
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

			//批次信息接口
			batchMess(batchId) {
				this.showHiden = false;
				//数据初始化
				this.taskTotalNum = ''; //任务总数
				this.orderNum = ''; //接单个数
				this.batchName = ''; //批次名称
				this.accountId = ''; //结算模板
				this.cycle = ''; //批次周期
				this.warningTime = ''; //预警时间
				this.fileId = ''; //数据
				this.files = [];
				this.$refs.textName.innerText = ''; //文件回显
				var that = this;
				this.axios.post('/task/findBatchInfo.do', {
					"batchId": batchId
				}).then((res) => {
					
					if(res.data.code == '0') {
						
						this.orderNum = res.data.data.orderNum; //接单个数
						this.batchName = res.data.data.batchName; //批次名称
						if(res.data.data.account==undefined){
							console.log("undefined1");
						}else{
							this.accountName = res.data.data.account.accountId; //结算模板
						}
						if(res.data.data.exField==undefined){
							console.log("undefined2")
						}else{
							
							this.screenRates = res.data.data.exField; //分配率
						}
						console.log(res.data.data.files.length)
						if(res.data.data.files.length<0||res.data.data.files.length==0){
							console.log("undefined3")
						}else{
							this.showHiden2 = true;
							this.wordsUrl = res.data.data.files[0].url;
							this.fileId =res.data.data.files[0].id ;
							this.files.push(res.data.data.files[0].id);
						}
//						if(res.data.data.account==undefined){
//							console.log("undefined")
//						}else{
//							this.accountId = res.data.data.account.accountId;
//						}
						//console.log(this.wordsUrl);
						this.tasktotalNum = res.data.data.total;
						this.cycle = res.data.data.cycle; //批次周期
						this.warningTime = res.data.data.warningTime; //预警时间
						var d = new Date(res.data.data.warningTime);
						this.warningTime = this.formatDate(d);
						this.batchId = res.data.data.batchId;
					} else {
						this.$Message.error(res.data.msg);
					}

				}).catch(function(err) {});
			},
			formatDate(now) {
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var date = now.getDate();
				var hour = now.getHours();
				var minute = now.getMinutes();
				var second = now.getSeconds();
				return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
			},
			//修改批次信息接口
			updateBatchMess() {
				var that = this;
				//alert(that.batchId);
				var projectId = this.$route.query.projectId;
				this.axios.post('/task/updateBatch.do', {
					"projectId": projectId,
					"orderNum": that.orderNum, //类型：Number  可有字段  备注：批次允许的接单数量
					"status": that.status, //修改状态值
					"cycle": that.cycle, //类型：Number  可有字段  备注：周期
					"accountId": that.accountName, //类型：String  可有字段  备注：结算Id
					"isCompany": 1, //类型：Number  可有字段  备注：是否为企业接包，1：是；0：不是；默认为0
					//"batchId":"201712051441110000000026", //类型：String  必有字段  备注：批次Id
					"batchId": that.batchId,
					"batchName": that.batchName, //类型：String  可有字段  备注：批次名称
					"total": that.tasktotalNum, //类型：String  可有字段  备注：任务总数
					"warningTime": Date.parse(that.warningTime), //类型：String  可有字段  备注：预警时间
					"resolution": that.screenRates, //类型：String  可有字段  备注：分辨率
					"fileIds":that.files               //类型：String  可有字段  备注：文件Id
				}).then((res) => {
					if(res.data.code == 0) {
						this.$Message.success("更新成功");
						this.$emit('childeMethod');
					} else {
						this.$Message.error(res.data.msg);
					}

				}).catch(function(err) {});
			},
			//发布按钮
			release() {

				if(this.Type == 1 || this.Type == 3 || this.Type == 4) {
					if(this.batchName == '' || this.warningTime == '' || this.fileId == ''||this.orderNum==''||this.cycle=='') {
						this.$Message.warning("请填写必填项");
						return false;
					}
				}
				//图片标注
				else if(this.Type == 2|| this.Type == 5) {
					if(this.batchName == '' || this.warningTime == ''||this.tasktotalNum==''||this.orderNum==''||this.cycle=='') {
						this.$Message.warning("请填写必填项");
						return false;
					}
				}
				this.status = 1;
				this.$emit("cancel");
				this.updateBatchMess()
			},
			//保存按钮
			save() {
				
				if(this.Type == 1 || this.Type == 3 || this.Type == 4) {
					console.log(this.fileId);
					if(this.batchName == '' || this.warningTime == ''|| this.fileId == ''||this.orderNum==''||this.cycle=='') {
						this.$Message.warning("请填写必填项");
						return false;
					}
				} else if(this.Type == 2|| this.Type == 5) {
					if(this.batchName == '' || this.warningTime == ''||this.tasktotalNum==''||this.orderNum==''||this.cycle=='') {
						this.$Message.warning("请填写必填项");
						return false;
					}
				}
				this.status = 0;
				this.$emit("cancel");
				this.updateBatchMess();
			},

		}
	}
</script>

<style lang="scss" scoped="scoped">
	.selctKind {
		display: none;
	}
	
	.Dialog {
		height: auto;
		.tipText {
			width: 300px;
			padding-left: 75px;
			margin-left: 130px;
			color: #333;
		}
		.inputRow {
			span {
				display: inline-block;
				width: 80px;
				text-align: right;
			}
			.redStar {
				position: relative;
				&:after {
					content: "*";
					color: red;
					position: absolute;
					right: 7px;
				}
			}
		}
		.bootom-button{
				.middleBtn2{
					margin-left: 20px;
					margin-right: 15px;
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