<template>
	<div id="useradmin">
		<div class="titleWap">
			<span class="h41" style="cursor: auto;">员工列表</span>
		</div>
		<div class="row">
			<span class="span1"><label for="input1">姓名：</label><input class="inputText" type="text" v-model="staffname" name="" id="input1" value="" placeholder="请输入"/>
			</span>
			<span class="span1"><label for="input1">手机号码：</label><input class="inputText" type="text" v-model="staffIphone" name="" id="input1" value="" placeholder="请输入"/>
			</span>
		</div>
		<div class="row row2">
			<span class="span1">角色：<Select clearable v-model="model1">
               		<Option v-for="item in templateState" :value="item.id" :key="item.id">{{ item.name }}</Option></Select>
			</span>
			<span class="span1 authoyne"><label for="input1" class="authoy">组织机构：</label><input id="mechan1" v-model="treesnameid" type="hidden" value="">
                <TreeSelect transfer clearable class="zrees" :data="baseData" @on-select-change="selectVal" 
                		placeholder="请选择..."  :width="230" :fields="treeFields"></TreeSelect>
			</span>
			<span class="buttonList">
			<span class="smallBtn1" @click="showNewUser">新建</span>
			<span class="smallBtn2" @click="search">搜索</span>
			<span class="smallBtnDefalt" @click="reset">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">姓名</td>
				<td class="colmn2">昵称</td>
				<td class="colmn3">组织</td>
				<td class="colmn4">手机号</td>
				<td class="colmn5">角色</td>
				<td class="colmn6">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td>{{item.name}}</td>
				<td>{{item.nickName}}</td>
				<td>{{item.organizationName}}</td>
				<td>{{item.phoneNumber}}</td>
				<td>{{item.roleName}}</td>
				<td class="check-more">
					<span class="" @click="showDropinfo(item.id)">编辑</span></span>
					<span class="checkLinks" @click="confirm(item.phoneNumber)">删除</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建-->
		<v-bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-userform ref="showUseruserforms" @addsumbit="addsumbit($event)" @cancel="cancel()"></new-userform>
		</v-bounces>
		<!--修改-->
		<v-bounces v-show="revisebouncesHide" @emitClickPopup="popupShutDown()">
			<new-userforminfo ref="showUserinfos" @sumbit="sumbit($event)" @cancel="cancel()"></new-userforminfo>
		</v-bounces>
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
	import newUserform from "@/views/authorityment/newauthorityus"
	import newUserforminfo from "@/views/authorityment/newauthorityusinfos"
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading: true,
				transfer: true,
				pageNos: 1,
				pageSizes: 100,
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				showDrop: false,
				bouncesHide: false,
				revisebouncesHide: false,
				model1: '',
				staffname: '',
				staffIphone: '',
				templateState: [],
				treesnameid: '',
				treesname: '',
				baseData: [],

				treeFields: [{
						field: 'name',
						map: 'title'
					},
					{
						field: 'child',
						map: 'children'
					}
				],
			}
		},
		components: {
			newUserform,
			newUserforminfo,
			"v-bounces": bounces
		},
		mounted() {
			this.roleList();
			this.baseDataList();
			this.search();
			let _this = this;
		},
		watch: {
			model1(v) {
				console.log(v, "sss");
			}
		},
		methods: {
			roleList() {
				this.axios.post("/role/queryRole.do", {
					"pageNo": this.pageNos,
					"pageSize": this.pageSizes,
				}).then((res) => {
					this.templateState = res.data.data.result;
					//		          console.log(res, "角色成功role")
				}).catch((err) => {
					console.log(err, "角色失败role")
				})
			},
			baseDataList() {
				this.axios.post("/role/queryOrganizationAllVUEInit.do", {

				}).then((res) => {
					if(res.data.code=='0'){
						this.baseData = res.data.data.value;
					}
					else{
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch((err) => {
					console.log(err, "组织机构树失败")
				})
			},
			
			//修改
			sumbit(e) {
				//				console.log(e.id,e.content,"你");
				this.axios.post('/role/updateUser.do', {
					"id": e.content.id,
					"companyId": e.content.id,
					"phoneNumber": e.content.staffiphone,
					"role": e.content.work_model1,
					"organizationid": e.content.staffinfoid,
				}).then((res) => {
					//					console.log(res,"修改员工成功");
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
					this.revisebouncesHide = false;
				}).catch(function(err) {})
			},
			//项目搜索
			search() {
				var that = this;
				this.axios.post('/role/queryUser.do', {
					"pageNo": that.page,
					"pageSize": that.pageSize,
					"role": that.model1,
					"name": that.staffname,
					"phoneNum": that.staffIphone,
					"organizationId": that.treesnameid,
				}).then((res) => {
					if(res.data.code == '0') {
						this.loading = false;
						this.tableList = res.data.data.result;
						this.result = res.data.data;
						this.result.totalItems = res.data.data.totalItems;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage(page) {
				this.page = page;
				this.search();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.search();
			},
			selectVal(ele) {
				//				alert(1);
				//				console.log(ele);
				//          	this.basedataList = ele;
				//          	console.log(this.basedataList);
				this.treesnameid = ele[0].id;
			},
			//重置
			reset() {
				var that = this;
				that.model1 = '';
				that.staffname = '';
				that.staffIphone = '';
				that.treesnameid = '';
				that.treesname = '';
			},
			//新建员工
			showNewUser() {
				this.bouncesHide = true;
				this.$refs.showUseruserforms.initData();
				//				this.$refs.showUseruserforms.showUseris();
			},
			//修改
			showDropinfo(id) {
				this.revisebouncesHide = true;
				this.$refs.showUserinfos.showUserinfo(id);
			},
			//删除确认
			confirm(phoneNumber) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.delList(phoneNumber)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//删除操作
			delList(phoneNumber) {
				var that = this;
				this.axios.post('/enterprise/deleteUserCompany.do', {
					"phoneNum": phoneNumber
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
			popupShutDown() {
				// 关闭
//				this.bouncesHide = false;
//				this.revisebouncesHide = false;
			},
			
			cancel() {
				this.bouncesHide = false;
				this.revisebouncesHide = false;
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	
	#useradmin {
		/*input {
			height: 27px;
			width: 236px;
		}*/
		.titleWap {
			margin-bottom: 15px;
			* {
				vertical-align: middle;
			}
		}
		.row {
			margin-bottom: 25px;
			position: relative;
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 26px;
				display: inline-block;
			}
			.authoyne {
				overflow: hidden;
			}
			.authoy {
				float: left;
				margin-top: 2px;
			}
			.zrees {
				display: inline-block;
				float: left;
				z-index: 0;
			}
			.spanWidth {
				width: 600px;
				display: inline-block;
			}
			.buttonList {
				span {
					vertical-align: middle;
					text-align: center;
					display: inline-block;
				}
				.smallBtn2 {
					margin: 0 10px;
				}
			}
			.baseNameLeft {
				position: absolute;
				left: 63px;
				width: 22%;
				border: 1px solid #ccc;
				height: 260px;
				background: #fff;
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
			}
		}
		.row2 {
			margin-bottom: 35px;
			/*overflow: hidden;*/
			.span1 {
				float: left;
			}
		}
		/*******表单样式*******/
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
				border: 1px solid #E9E9E9 !important;
				padding: 0 1em;
				height: 40px;
			}
			.colmn1 {
				width: 20%;
			}
			.colmn2 {
				width: 15%;
			}
			.colmn3 {
				width: 15%;
			}
			.colmn4 {
				width: 20%;
			}
			.colmn5 {
				width: 15%;
			}
			.colmn6 {
				width: 15%;
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
				.rightMore {
					width: 45px;
				}
				.checkLinks {
					padding: 0 5px;
					position: relative;
				}
				.checkLinks:before {
					content: "";
					display: block;
					width: 1px;
					height: 15px;
					left: 0px;
					top: 13px;
					position: absolute;
					background: #E9E9E9;
				}
			}
		}
	}
</style>