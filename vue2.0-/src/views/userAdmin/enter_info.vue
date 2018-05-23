<template>
	<div id="enterInfo">
		<div class="titleWap">
			<span class="h42" @click="viewJump()">用户管理/</span>
			<!--<span style="font-size: 20px;font-weight: bold;">/</span>-->
			<span class="h41" style="cursor: auto;">{{infoName}}</span>
		</div>
		<div class="infoty">
			<div class="h42">基本信息</div>
			<ul class="enter_pei">
				<li>
					<div><span>企业名称：</span><span>{{projectEnter.accountName}}</span></div>
					<div><span>组织机构代码证：</span><span>{{projectEnter.accountNum}}</span></div>
				</li>
				<li class="li_img">
					<div><span>企业简称：</span><span></span></div>
					<div><span class="en_span1">营业执照：</span><span><img :src="projectEnter.bizLicense ? projectEnter.bizLicense : '../../../static/img/train/voice.jpg'" alt="" /></span></div>
				</li>
				<li>
					<div><span>企业网站：</span><span>{{projectEnter.website}}</span></div>
					<div><span>企业地址：</span><span>{{projectEnter.address}}</span></div>
				</li>
				<li>
					<div><span>开户行：</span><span>{{projectEnter.bank}}</span></div>
					<div><span>客服联系人姓名：</span><span>{{projectEnter.name}}</span></div>
				</li>
				<li>
					<div><span>开户主体：</span><span></span></div>
					<div><span>客服电话：</span><span>{{projectEnter.contactNum}}</span></div>
				</li>
				<li>
					<div><span>账号：</span><span></span></div>
					<div><span>财务联系人姓名：</span><span>{{projectEnter.simpleName}}</span></div>
				</li>
				<li>
					<div><span>企业财务电话：</span><span>{{projectEnter.contactNum}}</span></div>
					<div><span>企业备注：</span><span>{{projectEnter.remark}}</span></div>
				</li>
			</ul>
		</div>
		<div class="infoty">
			<div class="h42">实名认证</div>
			<div class="in_name">
				<span class="adopt" v-if="projectEnter.status == 'agree'">
					<img src="../../../static/img/tgimg.png" alt="" />已通过实名认证企业
					<a @click="confirm(1)">实名认证状态解除</a>
				</span>
				<!--<span class="no_adopt" v-if="projectEnter.status == 'reject' || ''">-->
				<span class="no_adopt" v-else>
					<img src="../../../static/img/ntgimg.png" alt="" />未通过实名认证企业
				</span>
			</div>
		</div>
		<div class="infoty">
			<div class="h42">资产一览</div>
			<div class="in_mamey">
				<div>
					<p>总余额</p>
					<p>{{countRmb ? countRmb : 0}}</p><span>元</span>
				</div>
				<div>
					<p>可提现余额</p>
					<p>{{minconRmb ? minconRmb : 0}}</p><span>元</span>
				</div>
			</div>
		</div>
		<!--账户明细-->
		<div class="infoty">
			<div class="h42">账户明细</div>
			<div class="row">
				<span class="span1">所属项目：
					
				<input id="mechan1" v-model="model1id" type="hidden" value="">
				<input class="inputText" type="text" v-model="model1" name="" @click="showDropList" id="input1" value="" placeholder="请输入"/>
			      	<div class="baseNameLeft" v-show="showDrop">
			        	<p class="information-xs">选择所属项目</p>
				        
				        <div class="zTreeDemoBackground left">
				          	<ul id="" class="">
				          		<li v-for="(item,$index) in tableList1">
				          			<div @click="checkall(item.projectId,item.name)">{{item.name}}</div>
				          		</li>
				          	</ul>
				        </div>
						<!--分页插件-->
						<div id="page">
							<Page :total="result1.totalItem" show-elevator show-sizer @on-change="changePage1"
								 @on-page-size-change="changepagesize1"></Page>
						</div>
			      	</div>
				</span>
				<span class="span1" id="Date-picker">
	            	时间范围：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange"
	            		placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
	           </span>
			</div>
			<div class="row row2">
				<span class="span1">资金流向：
					<Select v-model="model2">
	               		<Option v-for="item in templateState2" :value="item.value" :key="item.value">{{ item.label }}</Option>
	           		</Select>
				</span>
				<span class="span1">
					<label for="input1">金额范围：</label><input v-model="starmoney" class="inpt" type="text" name="" id="input1" value="" placeholder="请输入"/>
					<em>-</em><input v-model="endmoney" class="inpt" type="text" name="" id="input2" value="" placeholder="请输入"/>
				</span>

				<span class="buttonList">
				<span class="smallBtn2" @click="searchenterinfo">查询</span>
				<span class="smallBtnDefalt" @click="resetinfo">重置</span>
				</span>
			</div>
			<table border="" cellspacing="0" cellpadding="0" id="tableForm">
				<tr class="trHeader">
					<td class="colmn1">所属项目</td>
					<td class="colmn2">资金流向</td>
					<td class="colmn3">交易号</td>
					<td class="colmn4">金额</td>
					<td class="colmn5">生成时间</td>
					<td class="colmn6">状态</td>
				</tr>
				<tr v-for="(item,$index) in tableList">
					<td>{{item.accountId}}</td>
					<td v-if="item.operateType==0">转入</td>
					<td v-if="item.operateType==1">转出</td>
					<td>{{item.id}}</td>
					<td>{{item.value}}</td>
					<td>{{computationsCallTime(item.createTime)}}</td>
					<td v-if="item.status==0">成功</td>
					<td v-if="item.status==1">交易中</td>
					<td v-if="item.status==2">失败</td>
				</tr>
			</table>
			<!--分页插件-->
			<div id="page">
				<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
			</div>
		</div>
		<!--企业列表-->
		<div class="infoty">
			<div class="h42">用户列表</div>
			<div class="row">
				<span class="span1">
					<label for="input1">用户名称：</label><input v-model="usernamefo" type="text" name="" id="input1" value="" placeholder="请输入"/>
				</span>
				<span id="Date-picker">
	            	注册时间：<Date-picker v-model="dateValues" :value="value3" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>
	           </span>
			</div>
			<div class="row row2">
				<span class="span1">
					<label for="input1">用户账号：</label><input v-model="usernuber" type="text" name="" id="input1" value="" placeholder="请输入"/>
				</span>
				<span class="span1"></span>

				<span class="buttonList">
				<span class="smallBtn2" @click="userList">查询</span>
				<span class="smallBtnDefalt" @click="resetinfooy">重置</span>
				</span>
			</div>
			<table border="" cellspacing="0" cellpadding="0" id="tableForms">
				<tr class="trHeader">
					<td class="colmn1">用户编号</td>
					<td class="colmn2">用户名称</td>
					<td class="colmn3">用户类型</td>
					<td class="colmn4">用户账号</td>
					<td class="colmn5">状态</td>
					<td class="colmn6">注册时间</td>
					<td class="colmn7">操作</td>
				</tr>
				<tr v-for="(item,$index) in tableList2">
					<td>{{item.id}}</td>
					<td>{{item.name}}</td>
					<td v-if="item.type=='person'">个人</td>
					<td v-if="item.type=='company'">企业</td>
					<td>{{item.phoneNum}}</td>
					<td v-if="item.status=='edit'">编辑</td>
					<td v-if="item.status=='apply'">申请审核</td>
					<td v-if="item.status=='agree'">同意</td>
					<td v-if="item.status=='reject'">拒绝</td>
					<td v-if="item.status=='blacklist'">黑名单</td>
					<td v-if="item.status=='lock'">锁定</td>
					<td>{{item.updateTime ? computationsCallTime(item.updateTime) : ""}}</td>
					<td class="check-more">
						<span @click="moreServices(item.id,item.type)">查看</span>
						<span class="checkLink" @click="blackLists(item.id,item.type,item.status)">黑名单</span>
						<span @click="reportLoss(item.id,item.type,item.status)">锁定</span>
					</td>
				</tr>
			</table>
			<!--分页插件-->
			<div id="page">
				<Page :total="totalPagesizeU" show-elevator show-sizer @on-change="changePage2" @on-page-size-change="changepagesize2"></Page>
			</div>
		</div>
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
	import Tool from "../../getData/tool"
	export default {
		data() {
			return {
				loading:true,
				infoId: null,
				infoName: null,
				infopageSize: 10,
				infopage: 1,
				showDrop: false,
				projectEnter: {},
				rmbList: [],
				countRmb: "",
				minconRmb: "",
				value2: ['2016-01-01', '2016-02-15'],
				value3: ['2016-01-01', '2016-02-15'],
				model1id: '',
				model1: '',
				model2: '',
				dateValue: '',
				starmoney: '',
				endmoney: '',
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				//用户列表
				pageU: 1,
				pageSizeU: 10,
				totalPagesizeU: 0,
				result: {},
				tableList: [],
				templateState1: [{
						value: '1',
						label: '企业'
					},
					{
						value: '0',
						label: '服务者'
					}
				],
				templateState2: [{
						value: '1',
						label: '转出'
					},
					{
						value: '0',
						label: '转入'
					}
				],
				result1: {},
				tableList1: [],
				usernamefo: '',
				usernuber: '',
				dateValues: '',
				result2: {},
				tableList2: [],
			}
		},

		mounted() {
			this.infoId = this.$route.query.id;
			this.infoName = this.$route.query.name;
			this.$nextTick(() => {
				this.enterMessinfo();
				this.projectinfo();
			});
			//查询用户列表
			this.userList();
		},
		activated() {
			this.infoId = this.$route.query.id;
		},
		watch: {
			"infoId" () {
				this.enterMessinfo();
				this.projectinfo();
			},
			dateValue(v) {
				console.log(Date.parse(v[0]), "1");
				console.log(Date.parse(v[1]), "2");
			},
			model2(v) {
				console.log(v, "sss");
			},
			dateValues(v) {
				console.log(Date.parse(v[0]), "1");
				console.log(Date.parse(v[1]), "2");
			},
		},
		methods: {
			//id查询企业信息
			enterMessinfo() {
				var that = this;
				//	      		const pages=this.$route.query.page;
				//	      		const pagesizes=this.$route.query.pageSize;
				this.axios.post('/mgr/detailsCompanyInfo.do', {
					//				this.axios.post('http://192.168.15.148:8080/ucsc-manager/mgr/detailsCompanyInfo.do', {
					"companyId": this.infoId,
					"pageNum": this.infopage,
					"pageSize": this.infopageSize,
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
					this.projectEnter = res.data.data.companyInfo;
					this.rmbList = res.data.data.account;
					this.rmbList.forEach((item) => {
						if(item.type == "rmb") {
							this.countRmb = item.assets;
							this.minconRmb = item.surplusAssets;
						}
					});
					this.tableList = res.data.data.blanceRecord.list;
					this.result = res.data.data;
					this.result.totalItems = res.data.data.total;
					//					this.tableList2 = res.data.data.childInfo.list;
					this.result2 = res.data.data;
					this.result2.totalItems = res.data.data.total;
					}else{
						this.$Message.error(res.data.msg)
					}
					
				}).catch(function(err) {
					console.log(err);
				})
			},
			//查询用户列表
			userList() {
				this.axios.post('/mgr/listUser.do', {
					"pageNum": this.pageU, //类型：Number  必有字段  备注：页码
					"pageSize": this.pageSizeU, //类型：Number  必有字段  备注：每页大小
					"startCreateTime": Date.parse(this.dateValues[0]), //类型：Number  可有字段  备注：查询开始时间
					"endCreateTime": Date.parse(this.dateValues[1]), //类型：Number  可有字段  备注：查询结束时间
					"name": this.usernamefo, //类型：String  可有字段  备注：名称
					"phoneNum": this.usernuber, //类型：String  可有字段  备注：注册手机号
					 "companyId":this.infoId             //类型：String  可有字段  备注：公司ID
				}).then((res) => {
					if(res.data.code == '0') {
						this.tableList2 = res.data.data.list;
						this.totalPagesizeU = res.data.data.total;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			changePage2(page) {
				this.pageU = page;
				//查询用户列表
				this.userList();
			},
			changepagesize2(pagesize) {
				this.pageSizeU = pagesize;
				//查询用户列表
				this.userList();
			},
			//账户明细查询
			searchenterinfo() {
				var that = this;
				this.axios.post('/mgr/listCompanyBlance.do', {
					"companyId": this.infoId,
					"pageNum": that.page,
					"pageSize": that.pageSize,
					"projectId": that.model1id,
					"operateType": that.model2,
					"startValue": that.starmoney,
					"endValue": that.endmoney,
					"startCreateTime": Date.parse(that.dateValue[0]),
					"endCreateTime": Date.parse(that.dateValue[1])
				}).then((res) => {
					console.log(res, "账户明细查询成功");
					this.tableList = res.data.data.list;
					this.result = res.data.data;
					this.result.totalItems = res.data.data.total;
				}).catch(function(err) {})
			},
			changePage(page) {
				this.page = page;
				this.enterMessinfo();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.enterMessinfo();
			},
			computationsCallTime(date) {
				return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
			},
			//重置
			resetinfo() {
				var that = this;
				that.model1id = '',
					that.model1 = '';
				that.dateValue = '';
				that.model2 = '';
				that.starmoney = '';
				that.endmoney = '';
			},
			//id查询企业所属项目
			projectinfo() {
				var that = this;
				this.axios.post('/task/searchProject.do', {
					"companyId": this.infoId,
					"pageNum": this.page,
					"pageSize": this.pageSize,
				}).then((res) => {
					console.log(res, "账户明细下的所属项目");
					this.tableList1 = res.data.data.projects;
					this.result1 = res.data.data;
					this.result1.totalItem = res.data.data.totalCount;
				}).catch(function(err) {})
			},
			changePage1(page) {
				this.page = page;
				this.projectinfo();
			},
			changepagesize1(pagesize) {
				this.pageSize = pagesize;
				this.projectinfo();
			},
			//显示所属项目
			showDropList() {
				this.showDrop = !this.showDrop
			},
			checkall(s, v) {
				console.log(v);
				this.showDrop = false;
				this.model1id = s;
				this.model1 = v;
			},
			//企业列表查询
			searchenterlist() {
				var that = this;
				//				this.axios.post('http://192.168.1.125:8080/ucsc-manager/mgr/listUser.do', {
				this.axios.post('/mgr/listUser.do', {
					"companyId": this.infoId,
					"pageNum": that.page,
					"pageSize": that.pageSize,
					"name": that.usernamefo,
					"phoneNum": that.usernuber,
					"startCreateTime": Date.parse(that.dateValues[0]),
					"endCreateTime": Date.parse(that.dateValues[1])
				}).then((res) => {
					console.log(res, "企业列表查询成功111");
					//					this.tableList2 = res.data.data.list;
					//					this.result2 = res.data.data;
					//            		this.result2.totalItems = res.data.data.total;
				}).catch(function(err) {})
			},
			
			//重置
			resetinfooy() {
				var that = this;
				that.usernamefo = '',
					that.usernuber = '';
				that.dateValues = '';
			},
			//查看
			moreServices(id, type) {
				if(type === "person") {
					this.$router.push({
						path: '/' + 'service_info',
						query: {
							id: id,
							//			            pages:this.page,
							//			            pagesizes:this.pageSize
						}
					})
				} else if(type === "company") {
					this.$router.push({
						path: '/' + 'enter_info',
						query: {
							id: id
						}
					})
				}
			},
			//黑名单
			blackLists(id, type, status) {
				if(status !== 'agree') {
					this.$Message.warning("此状态下不可加入黑名单");
					return;
				}
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要加入黑名单吗？</p><p>确认后将加入黑名单</p>',
					onOk: () => {
						this.conList(id, type, status)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//确认操作
			conList(id, type, status) {
				var that = this;
				this.axios.post('/mgr/blacklist.do', {
					"id": id,
					"type": type
				}).then((res) => {
					console.log(res);
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
			//锁定
			reportLoss(id, type, status) {
				if(status !== 'agree') {
					this.$Message.warning("此状态下不可锁定");
					return;
				}
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要锁定吗？</p><p>确认后将锁定</p>',
					onOk: () => {
						this.lockList(id, type, status)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//确认操作
			lockList(id, type, status) {
				var that = this;
				this.axios.post('/mgr/lock.do', {
					"id": id,
					"type": type
				}).then((res) => {
					console.log(res);
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
			viewJump() {
				this.$router.push({
					path: "/userAdmin"
				})
			},
			//实名制解除
			confirm(id) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>是否解除实名认证？</p><p style="color:red;">请注意解开实名认证后该用户可能无法提现或接任务，请谨慎操作。</p>',
					onOk: () => {
						this.delList(1)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//确认操作
			delList(id) {
				var that = this;
				this.axios.post('/mkmanager/delEle/' + id + '.do', {}).then((res) => {
					console.log(res);
					this.enterMessinfo();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#enterInfo {
		input {
			height: 27px;
			width: 230px;
		}
		.titleWap {
			margin-bottom: 15px;
			* {
				vertical-align: middle;
			}
		}
		.infoty {
			margin-top: 50px;
			position: relative;
		}
		.enter_pei {
			li {
				margin-bottom: 20px;
				margin-left: 16px;
				div {
					display: inline-block;
					width: 230px;
					span:first-child {
						margin-right: 10px;
						width: 98px;
						text-align: right;
						display: inline-block;
					}
				}
				div:first-child {
					margin-right: 24%;
				}
			}
			.li_img {
				height: 60px;
				div:first-child {
					position: relative;
					top: -42px;
				}
				.en_span1 {
					position: relative;
					top: -42px;
				}
				img {
					display: inline-block;
					width: 100px;
					height: 60px;
				}
			}
		}
		.in_name {
			height: 100px;
			line-height: 100px;
			padding-left: 130px;
			span.adopt {
				display: inline-block;
				height: 32px;
				line-height: 32px;
				color: #66CC00;
				img {
					display: inline-block;
					position: relative;
					top: 4px;
					width: 18px;
					height: 18px;
					margin-right: 8px;
				}
				a {
					color: #5688DE;
					text-decoration: underline;
					margin-left: 75px;
				}
			}
			span.no_adopt {
				display: inline-block;
				height: 32px;
				line-height: 32px;
				color: #FF3300;
				img {
					display: inline-block;
					position: relative;
					top: 4px;
					width: 18px;
					height: 18px;
					margin-right: 8px;
				}
			}
		}
		.in_mamey {
			border: 1px solid #ddd;
			padding: 30px 20px;
			div {
				width: 170px;
				height: 100%;
				display: inline-block;
				margin-left: 30px;
				p:nth-child(2) {
					font-size: 36px;
					display: inline-block;
				}
				span {
					display: inline-block;
					margin-left: 4px;
				}
			}
		}
		.row {
			margin-top: 25px;
			margin-bottom: 40px;
			.span1,
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 50px;
				.inpt {
					width: 70px;
				}
				em {
					margin: 0 10px;
				}
			}
			.span2 {
				width: 355px;
				margin-left: 40px;
			}
			.buttonList {
				span {
					vertical-align: middle;
					text-align: center;
					display: inline-block;
				}
				.smallBtn1 {
					margin-left: 20px;
				}
				.smallBtn2 {
					margin-right: 10px;
				}
				.smallBtn3 {
					margin-left: 5px;
				}
			}
			.baseNameLeft {
				position: absolute;
				left: 63px;
				width: 54.2%;
				border: 1px solid #ccc;
				height: 300px;
				background: #fff;
				z-index: 1;
				.baseNameSearch {
					width: 100%;
					padding: 10px;
					position: relative;
					input {
						width: 100%;
						color: #9fa9b2;
					}
					span {
						position: absolute;
						cursor: pointer;
						top: 13px;
						z-index: 2;
						right: 13px;
					}
					img {
						width: 22px;
						height: auto;
					}
				}
				.zTreeDemoBackground {
					height: 204px;
					overflow-y: scroll;
					margin-top: 12px;
					li {
						width: 100%;
						height: 20px;
						div {
							width: 100%;
							height: 100%;
							cursor: pointer;
							&:hover {
								background: #ccc;
							}
						}
					}
				}
				p {
					width: 99.9%;
					line-height: 40px;
					text-align: center;
					background: rgb(244, 244, 244);
					border-bottom: 1px solid #ccc;
				}
				.baseNameAdd {
					position: absolute;
					width: 100%;
					bottom: 100px;
					text-align: center;
					span {
						display: inline-block;
						width: 70px;
						line-height: 32px;
						cursor: pointer;
						background: #0a6fc1;
						color: #fff;
						border-radius: 5px;
					}
					span:nth-of-type(2) {
						margin-left: 10px;
						background: #FF9933;
						color: #fff;
					}
				}
				#page {
					width: 100%;
					padding-left: 3%;
					margin-top: 2px;
				}
			}
		}
		/******表格****/
		#tableForm {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #E9E9E9;
			.trHeader {
				td {
					background: #F4F4F4;
				}
			}
			tr,
			td {
				padding: 0 1em;
				height: 40px;
			}
			.colmn1 {
				width: 20%;
			}
			.colmn2 {
				width: 10%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 10%;
			}
			.colmn5 {
				width: 30%;
			}
			.colmn6 {
				width: 10%;
			}
		}
		/******表格****/
		#tableForms {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #E9E9E9;
			.trHeader {
				td {
					background: #F4F4F4;
				}
			}
			tr,
			td {
				border: 1px solid #E9E9E9 !important;
				padding: 0 1em;
				height: 40px;
			}
			.colmn1 {
				width: 15%;
			}
			.colmn2 {
				width: 13%;
			}
			.colmn3 {
				width: 13%;
			}
			.colmn4 {
				width: 15%;
			}
			.colmn5 {
				width: 10%;
			}
			.colmn6 {
				width: 15%;
			}
			.colmn7 {
				width: 19%;
			}
			.check-more {
				text-align: left;
				position: relative;
				* {
					vertical-align: middle;
				}
				span {
					color: #108EE9;
					display: inline-block;
					cursor: pointer;
				}
				.checkLink {
					width: 60px;
					position: relative;
					&:after {
						content: "";
						display: block;
						width: 1px;
						height: 15px;
						right: 0;
						top: 13px;
						position: absolute;
						background: #E9E9E9;
					}
				}
				.rightMore {
					width: 70px;
				}
				.dropDownList {
					border: 1px solid #E4E4E4;
					box-shadow: 0px 0px 2px #E4E4E4;
					width: 60px;
					right: 23px;
					top: 35px;
					border-radius: 3px;
					position: absolute;
					div {
						height: 30px;
						line-height: 30px;
						cursor: pointer;
						&:hover {
							background: #DFE8F6;
						}
					}
				}
			}
		}
	}
</style>