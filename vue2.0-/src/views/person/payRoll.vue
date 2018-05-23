<template>
	<div id="payRoll">
		<div class="topHead">
			<h4 class="h41" style="cursor: auto;">工资派发</h4>
			<div class="buttonList">
				<div class="buttons">
					<span>
						<Upload :action="picture.action" :show-upload-list="false" :before-upload="handleUpload" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">导入数据</Button>
           			</Upload>
					</span>
					<span class="smallBtn3" @click="checkDetailApi" style="width: 110px;height: 32px;line-height: 32px;">工资派发</span>
					<!--<span class="smallBtnDefalt">重置</span>-->
				</div>
				<div>
					<a href="http://bmtest.voicegu.com/template/payroll.xls" class="dowload">工资派发模板下载</a>
				</div>
			</div>
		</div>
		<div v-if="tableList.length>0">
			<div class="errorTip">
				<span></span>
				<span>共有</span>
				<span>{{totalpageSize2}}</span>
				<span>条号码,将无法发放到账,</span>
				<span class="redText" @click="checkQuestions">点击查看</span>
			</div>
			<table border="" cellspacing="0" cellpadding="0" id="tableForm">
				<tr class="trHeader">
					<td class="colmn1">手机号</td>
					<td class="colmn2">姓名</td>
					<td class="colmn3">金额</td>
					<td class="colmn4">摘要</td>
				</tr>
				<tr v-for="(item,$index) in tableList">
					<td>{{item.phoneNum}}</td>
					<td>{{item.name}}</td>
					<td>{{item.value}}</td>
					<td :title="item.memo">{{item.memo}}</td>
				</tr>
			</table>
			<!--分页插件-->
			<div id="page">
				<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
			</div>
		</div>
		<div v-else>
			请先导入数据
		</div>
		<!--点击查看问题详情-->
		<bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<div class="Dialog">
				<div class="questionTitle"><i class="ivu-icon ivu-icon-help-circled ivu-modal-confirm-body-icon-confirm"></i>问题列表</div>
				<div class="tableWap scroll">
					<table border="" cellspacing="0" cellpadding="0" id="tableForm">
						<tr class="trHeader">
							<td class="colmn1">手机号</td>
							<td class="colmn2">姓名</td>
							<td class="colmn3">金额</td>
							<td class="colmn4">摘要</td>
						</tr>
						<tr v-for="(item,$index) in tableList2">
							<td>{{item.phoneNum}}</td>
							<td>{{item.name}}</td>
							<td>{{item.value}}</td>
							<td :title="item.memo">{{item.memo}}</td>
						</tr>
					</table>
					<div class="middleBtn1" @click="entrue">确定</div>
				</div>
			</div>
		</bounces>
		<bounces v-show="bouncesHide2">
			<div class="smailDialog">
				<div style="font-size: 14px;font-weight:bolder;" class="title">
					<i class="ivu-icon ivu-icon-help-circled ivu-modal-confirm-body-icon-confirm" style="font-size: 22px;"></i>
					<span style="margin-left: 3px;">工资派发提示</span>
				</div>
				<div class="text">
					<span>共发放</span><span class="red">金额：</span>
					<span class="red">{{totalMoney}}元</span>
					<p>请认真核对</p>
				</div>
				<div class="btnList">
					<span class="borderBtn1" @click="cancelBtn">取消</span><span class="borderBtn" @click="payApi">确认发放</span>
				</div>
			</div>
		</bounces>
		<bounces v-show="bouncesHide3" @emitClickPopup="yesBtn()">
			<div class="smailDialog">
				<div style="font-size: 14px;font-weight:bolder;" class="title">
					<i class="ivu-icon ivu-icon-help-circled ivu-modal-confirm-body-icon-confirm" style="font-size: 22px;"></i>
					<span style="margin-left: 3px;">工资派发提示</span>
				</div>
				<div class="text">
					<span>请先导入数据</span>
				</div>
				<div class="btnList">
					<span class="borderBtn1" @click="cancelBtn"></span><span class="borderBtn" @click="yesBtn">确认</span>
				</div>
			</div>
		</bounces>
		<!--数据加载等待效果-->
		<Spin fix v-show="loading">
			<div>
				<svg class="circular" viewBox="25 25 50 50">
					<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
				</svg>
			</div>
		</Spin>
	</div>
</template>

<script>
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading: false,
				bouncesHide: false,
				bouncesHide2: false,
				bouncesHide3: false,
				page: 1,
				pageSize: 10,
				totalpageSize: 0,
				totalpageSize2: 0,
				result: {},
				tableList: [],
				tableList2: [],
				picture: {
					data: {},
					action: '/upload.do',
					src: "",
					uploadFile: null,
				},
				files: [],
				fileUrl: '',
				groupId: '',
				totalMoney: 0
			}
		},
		components: {
			bounces
		},
		mounted() {
			
		},
		methods: {
			entrue() {
				this.bouncesHide = false;
			},
			cancelBtn() {
				this.bouncesHide2 = false;
			},
			yesBtn(){
				this.bouncesHide3 = false;
			},
			//导入数据
			handleUpload(file) {
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
						_this.loading = true;
						_this.fileUrl = result.data.url;
						//						_this.$Message.success(result.msg);
						_this.dataAdd(result.data.url);

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
			//导入数据回调API
			dataAdd(url) {
				this.axios.post('/payroll/add.do', {
					url: url
				}).then((res) => {
					if(res.data.code == '0') {
						this.groupId = res.data.data.groupId;
						this.payRollList(res.data.data.groupId);
						this.errPayRollList(res.data.data.groupId);
					} else {
						this.$Message.error(res.data.msg);
						this.loading = false;
					}
				}).catch((err)=>{
					console.log(err);
				});
			},
			//工资派发列表
			payRollList(groupId) {
				var that = this;
				this.axios.post('/payroll/list.do', {
					"valid": true,
					"groupId": groupId,
					"pageNum": that.page, //类型：Number  必有字段  备注：当前页数
					"pageSize": that.pageSize, //类型：String  必有字段  备注：批次实例Id
				}).then((res) => {
					if(res.data.code === '0') {
						this.loading = false;
						//						this.loading = false;
						this.tableList = res.data.data.list;
						this.result = res.data.data;
						this.totalpageSize = res.data.data.total;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {})
			},
			//查看错误工资列表
			errPayRollList() {
				var that = this;
				this.axios.post('/payroll/list.do', {
					"valid": false,
					"groupId": that.groupId,
					"pageNum": that.page, //类型：Number  必有字段  备注：当前页数
					"pageSize": that.pageSize, //类型：String  必有字段  备注：批次实例Id
				}).then((res) => {
					if(res.data.code === '0') {
						//						this.loading = false;
						this.tableList2 = res.data.data.list;
						this.result = res.data.data;
						this.totalpageSize2 = res.data.data.total;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {})
			},
			checkQuestions() {
				this.bouncesHide = true;
				this.errPayRollList();
			},
			popupShutDown() {
				this.bouncesHide = false;
			},
			//点击查看工资总金额
			checkDetailApi() {
				if(this.tableList.length == 0 || this.tableList.length < 0) {
					this.bouncesHide3 = true;
					return false;
				}
				var that = this;
				this.axios.post('/payroll/totalPayoff.do', {
					"groupId": that.groupId,
				}).then((res) => {
					if(res.data.code == '0') {
						this.bouncesHide2 = true;
						this.totalMoney = res.data.data.value;
						//						this.payConfirm();
					} else {
						this.$Message.error(res.data.msg)
					}
				}).catch((err) => {
					console.log(err);
				});
			},

			//工资派发接口
			payApi() {
				var that = this;
				this.axios.post('/payroll/payoff.do', {
					groupId: that.groupId
				}).then((res) => {
					if(res.data.code == '0') {
						this.$Message.success(res.data.msg);
						this.bouncesHide2 = false;
					} else {
						this.$Message.error(res.data.msg)
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			//工资模板派发下载
			payTemApi() {
				this.axios.post('', {

				}).then((res) => {
					if(res.data.code == '0') {

					} else {
						this.$Message.error(res.data.msg)
					}
				}).catch((err) => {
					console.log(err);
				});
			},

			changePage(page) {
				this.page = page;
				this.payRollList(this.groupId);
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.payRollList(this.groupId);
			},
			totalpageSizes(totalpageSize) {
				this.totalpageSize = totalpageSize;
				this.payRollList(this.groupId);
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.smailDialog {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		margin-top: 120px;
		font-size: 12px;
		border-radius: 2px;
		background-clip: padding-box;
		border: 1px solid #ced7dd;
		overflow: hidden;
		background-color: #fff;
		padding: 20px;
		width: 394px;
		height: 199px;
		.title {
			* {
				vertical-align: middle;
			}
		}
		.text {
			font-size: 14px;
			margin-top: 20px;
			color: #999;
			line-height: 18px;
			margin-left: 30px;
		}
		.red {
			color: red;
		}
		.btnList {
			margin-top: 35px;
			width: 180px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-left: 160px;
			span {
				cursor: pointer;
				display: inline-block;
				width: 80px;
				height: 35px;
				line-height: 35px;
				text-align: center;
				border-radius: 3px;
			}
			.borderBtn1 {
				&:hover {
					color: #0087CE;
				}
			}
			.borderBtn {
				background: #108ee9;
				color: #fff;
				transition: all .5s;
				&:hover {
					background: #0087CE;
				}
			}
		}
	}
	
	.ivu-btn-primary {
		color: #fff;
		background-color: #108EE9;
		border-color: #108EE9;
		&:hover {
			background: #5584cc;
		}
	}
	
	#payRoll {
		.buttonList {
			padding-bottom: 20px;
			margin-bottom: 20px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #E9E9E9;
			flex-dir * {
				vertical-align: middle;
			}
			span {
				display: inline-block;
				text-align: center;
				margin-right: 10px;
			}
			.dowload {
				color: #108EE9;
				text-decoration: underline;
			}
			.buttons {
				* {
					vertical-align: middle;
				}
			}
		}
		.errorTip {
			width: 450px;
			margin-bottom: 15px;
			border: 1px solid #FFA39E;
			background: #FFF2F1;
			border-radius: 3px;
			padding: 5px 20px;
			font-size: 14px;
			.redText {
				display: inline-block;
				width: 70px;
				cursor: pointer;
				text-align: center;
				color: #FF5A5A;
				font-weight: bolder;
			}
		}
		#tableForm {
			.colmn1,
			.colmn2 {
				width: 27.5%;
			}
			.colmn3 {
				width: 15%;
			}
		}
		.Dialog {
			padding: 35px;
			padding-bottom: 15px;
			width: 900px !important;
			.tableWap {
				.middleBtn1 {
					width: 150px;
					margin: 30px auto;
					margin-top: 50px;
				}
			}
			.ivu-modal-confirm-body-icon-confirm {
				font-size: 20px;
				margin-right: 5px;
			}
			.questionTitle {
				font-size: 16px;
				margin-bottom: 20px;
				font-weight: bolder;
				* {
					vertical-align: middle;
				}
			}
		}
	}
</style>