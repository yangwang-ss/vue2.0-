<template>
	<div>
		<div class="Dialog" v-drag>
			<div class="headTitle">
				<span class="title">新建批次</span>
				<span class="cancelWap"><img src="../image/cancel.png" @click="cancel"/></span>
			</div>
			<div class="projectSeting title">批次设置</div>
			<div class="inputRow">
				<span class="redStar">批次名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" v-model="batchName" />
			</div>
			<div class="inputRow" v-if="Type==2||Type==5">
				<span class="redStar">任务总数：</span>
				<input type="number" value="" placeholder="请输入" class="textInput" v-model="tasktotalNum" />
			</div>
			<div class="inputRow" v-else :class="'selctKind'">
				<span>任务总数：</span>
				<input type="number" value="" placeholder="请输入" class="textInput" v-model="tasktotalNum" />
			</div>
			<div class="inputRow">
				<span class="redStar">接单个数：</span>
				<input type="number" value="" placeholder="请输入" class="textInput" v-model="orderNum" />
			</div>
			<div class="inputRow">
				<span>结算模板：</span>
				<Select v-model="accountId" class="select" filterable>
					<Option v-for="item in account_Id" :value="item.id" :key="item.id">{{item.description}}</Option>
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
				<input type="number" value="" placeholder="请输入" class="textInput" v-model="cycle" />
			</div>
			<div class="inputRow">
				<span class="redStar">预警时间：</span>
				<Date-picker type="date" placeholder="选择日期" style="width: 200px" v-model="warningTime"></Date-picker>
			</div>
			<div class="inputRow" v-if="Type==1||Type==3||Type==4">
				<span class="redStar">数据上传：</span>
				<span class="uploadWap">
					<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           			</Upload>
				</span>
				<span style="min-width: 60px;margin-left: 15px;" v-if="showHiden" ref="showUploadS">正在上传中...</span>
			</div>
			<div class="inputRow" v-else :class="'selctKind'">
				<span class="redStar">数据上传：</span>
				<span class="uploadWap">
					<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           			</Upload>
				</span>
				<span style="width: 100px;text-align: right;" v-if="showHiden">正在上传...</span>
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
				Type:'',//项目类型
				taskTime: '',
				tasktotalNum: '', //任务总数
				orderNum: '', //接单个数
				batchName: '', //批次名称
				accountId: '', //结算模板
				screenRates: '', //分配率
				resolution:'resolution',
				screenRatesList: [], //分配率数组
				cycle: '', //批次周期
				warningTime: '', //预警时间
				picture: {
					data: {},
					action: '/upload.do',
					src: "",
					uploadFile: null,
				},
				files: [],
				fileId: '',
				showHiden:false,
				account_Id: []
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
			getAddress(){
				this.Type = this.$route.query.type;
			},
			//数据初始化
			initData() {
				this.tasktotalNum = ''; //任务总数
				this.orderNum = ''; //接单个数
				this.batchName = ''; //批次名称
				this.accountId = ''; //结算模板
				this.cycle = ''; //批次周期
				this.warningTime = ''; //预警时间
				this.fileId = ''; //数据
				this.$refs.textName.innerText = ''; //文件回显
				this.screenRates = '';//分配率
				this.showHiden = false;
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
				let _this = this;
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
			
			//时间戳
			gettasktime(ti) {
				var src = new Date(ti);
				var dest = src.getTime();
				return dest;
			},
			cancel() {
				this.$emit("cancel");
			},
			//新建保存批次接口
			newBatch() {
				const that = this;
				const projectId = this.$route.query.projectId;
				this.axios.post('/task/createBatch.do', {
					"projectId": projectId, //类型：String  必有字段  备注：项目Id
					"status": that.status,
					"orderNum": that.orderNum, //类型：Number  必有字段  备注：接单个数
					"cycle": that.cycle, //类型：Number  可有字段  备注：周期
					"accountId": that.accountId, //类型：String  可有字段  备注：结算模板Id
					"isCompany": 1, //类型：Number  可有字段  备注：是否为企业接包，1：是；0：不是；默认为0
					"fileIds": that.files, //类型：String  可有字段  备注：file文件对象
					"batchStartTime": that.gettasktime(that.taskTime[0]), //类型：String  可有字段  备注：批次开始时间（按时任务才会有该值）
					"batchEndTime": that.gettasktime(that.taskTime[1]), //类型：String  可有字段  备注：批次结束时间（按时任务才会有该值）
					"warningTime": Date.parse(that.warningTime), //类型：String  可有字段  备注：预警时间
					"total": that.tasktotalNum, //类型：Number  可有字段  备注：任务总数
					"batchName": that.batchName, //类型：String  必有字段  备注：批次名称
					"resolution":that.screenRates                //类型：String  可有字段  备注：分辨率
				}).then((res) => {
					if(res.data.code === "0") {
						this.$Message.success(res.data.msg);
						this.$emit('childeMethod');
					} else {
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch(function(err) {});
			},
			
			//发布按钮
			release() {
				//其它
				if(this.Type==1||this.Type==3||this.Type==4){
					if(this.batchName==''||this.warningTime==''||this.fileId==''||this.cycle==''||this.orderNum==''){
					this.$Message.warning("请填写必填项");
					return false;
				}
				}
				//图片标注
				else if(this.Type==2|| this.Type == 5){
					if(this.batchName==''||this.warningTime==''||this.tasktotalNum==''||this.orderNum==''||this.cycle==''){
					this.$Message.warning("请填写必填项");
					return false;
				}
				}
				this.status = 1;
				//alert(this.status)
				this.flieArr();
				this.newBatch();
				this.$emit("cancel");
			},
			//保存按钮
			save() {
				if(this.Type==1||this.Type==3||this.Type==4){
					if(this.batchName==''||this.warningTime==''||this.fileId==''||this.cycle==''||this.orderNum==''){
					this.$Message.warning("请填写必填项");
					return false;
				}
				}
				
				else if(this.Type==2||this.Type==5){
					if(this.batchName==''||this.warningTime==''||this.tasktotalNum==''||this.orderNum==''||this.cycle==''){
					this.$Message.warning("请填写必填项");
					return false;
				}
				}
				
				this.status = 0;
				this.flieArr();
				//alert(this.status);
				this.newBatch();
				this.$emit("cancel");
			}
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
			width: 320px;
			span {
				width: 80px;
				display: inline-block;
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