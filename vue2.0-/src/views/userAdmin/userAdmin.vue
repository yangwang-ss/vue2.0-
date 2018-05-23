<template>
	<div id="useradmin">
		<h4 class="h41" style="cursor: auto;">用户管理</h4>
		<div class="row">
			<span class="span1">用户类型：<Select v-model="model1" clearable >
               		<Option v-for="item in templateState" :value="item.value" :key="item.value">{{ item.label }}</Option></Select>
			</span>
			<span id="Date-picker">
            	注册时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange"
            		placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
            </span>
		</div>
		<div class="row row2">
			<span class="span1"><label for="input1">用户名称：</label><input class="inputText" v-model="username" type="text" name="" id="input1" value="" placeholder="请输入"/></span>
			<span class="span1"><label for="input1">用户账号：</label><input class="inputText" v-model="usernumber" type="text" name="" id="input1" value="" placeholder="请输入"/></span>

			<span class="buttonList">
			<span class="smallBtn1" @click="showNewUser">开户</span>
			<span class="smallBtn2" @click="search">搜索</span>
			<span class="smallBtnDefalt" @click="reset">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">用户编号</td>
				<td class="colmn2">用户名称</td>
				<td class="colmn3">用户类型</td>
				<td class="colmn4">用户账号</td>
				<td class="colmn5">状态</td>
				<td class="colmn6">注册时间</td>
				<td class="colmn7">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td :title="item.id">{{item.id}}</td>
				<td :title="item.name">{{item.name}}</td>
				<td v-if="item.type=='person'">个人</td>
				<td v-if="item.type=='company'">企业</td>
				<td>{{item.phoneNum}}</td>
				<td v-if="item.status=='edit'">编辑</td>
				<td v-if="item.status=='apply'">申请审核</td>
				<td v-if="item.status=='agree'">同意</td>
				<td v-if="item.status=='reject'">拒绝</td>
				<td v-if="item.status=='blacklist'">黑名单</td>
				<td v-if="item.status=='lock'">锁定</td>
				<td :title="computationsCallTime(item.createTime)">{{item.createTime ? computationsCallTime(item.createTime) : ""}}</td>
				<td class="check-more">
					<span @click="moreServices(item.id,item.type,item.name)">查看</span>
					<span v-if="item.status=='agree'" class="checkLink" @click="blackLists(item.id,item.type,item.status)">黑名单</span>
					<span v-if="item.status=='agree'" @click="reportLoss(item.id,item.type,item.status)">锁定</span>
					
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalCount" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--开户模板-->
	    <v-bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-users ref="showUsers"  @cancel="cancel()" @addsumbit="addsumbit($event)"></new-users>
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
	import newUsers from "@/views/userAdmin/user_list"
	import Tool from "../../getData/tool"
	import bounces from "@/components/btm-bounces.vue"
	export default{
		data(){
			return{
				loading:true,
				bouncesHide: false,
				model1: '',
				username:'',
				usernumber:'',
				dateValue: '',
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				value2: ['2016-01-01', '2016-02-15'],
				templateState:[{
						value: 'company',
						label: '企业'
					},
					{
						value: 'person',
						label: '个人'
					}
				]
			}
		},
		mounted() {
			this.search();
		},
		components:{
			newUsers,
      		"v-bounces": bounces
		},
	    watch: {
	      dateValue(v){
	        console.log(Date.parse(v[0]), "1");
	        console.log(Date.parse(v[1]), "2");
	      },
	      model1(v){
	      	console.log(v,"sss");
	      }
	    },
		methods:{
			//项目搜索
			search() {
				var that = this;
				this.axios.post('/mgr/listUser.do', {
					"pageNum": that.page,
					"pageSize": that.pageSize,
					"type": that.model1,
					"name": that.username,
					"phoneNum": that.usernumber,
					"startCreateTime": Date.parse(that.dateValue[0]),
            		"endCreateTime": Date.parse(that.dateValue[1])
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
						this.tableList = res.data.data.list;
              			this.result.totalCount = res.data.data.total;
					}
				}).catch(function(err) {})
			},
			changePage(page) {
				this.page = page;
				this.search();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.search();
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd hh:mm:ss")
		    },
			//重置
			reset() {
				var that = this;
				that.dateValue = '';
				that.model1 = '';
				that.username = '';
				that.usernumber = '';
			},
			//新建点击事件
			showNewUser() {
				this.bouncesHide = true;
				this.$refs.showUsers.init();
			},
			//查看
			moreServices(id,type,name) {
				if(type === "person") {
			        this.$router.push({
			          path: '/' + 'service_info',
			          query: {
			            id: id,
			            name:name
			          }
			        })
				} else if(type === "company") {
			        this.$router.push({
			          path: '/' + 'enter_info',
			          query: {
			            id: id,
			            name:name
			          }
			        })
				}
			},
	      	popupShutDown(){
	      	},
	      	cancel(){
	        	this.bouncesHide = false;
	      	},
			//开户
			addsumbit(e) {
				console.log(e.id,e.content,"你");
				var that = this;
				this.axios.post('/mgr/createAccount.do', {
					"type": e.content.work_model1,
					"phoneNum": e.content.accounts,
					"companyName": e.content.companyaccounts,
					"dutyParagraph": e.content.companydutys,
				}).then((res) => {
					console.log(res,"开户成功");
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
					this.bouncesHide = false;
				}).catch(function(err) {})
			},
			//黑名单
			blackLists(id,type,status) {
				if(status !== 'agree') {
					this.$Message.warning("此状态下不可加入黑名单");
					return;
				}
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>确认要加入黑名单吗？</p><p>确认后将加入黑名单</p>',
                    onOk: () => {
                    	this.conList(id,type,status) 
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
			},
			//确认操作
			conList(id,type,status) {
				var that = this;
				this.axios.post('/mgr/blacklist.do', {
					"id":id,
					"type":type
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
			reportLoss(id,type,status) {
				if(status !== 'agree') {
					this.$Message.warning("此状态下不可锁定");
					return;
				}
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>确认要锁定吗？</p><p>确认后将锁定</p>',
                    onOk: () => {
                    	this.lockList(id,type,status) 
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
			},
			//确认操作
			lockList(id,type,status) {
				var that = this;
				this.axios.post('/mgr/lock.do', {
					"id":id,
					"type":type
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
		},
	}
</script>

<style lang="scss" scoped="scoped">
	#useradmin{
		.row {
			margin-bottom: 25px;
			position: relative;

			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 50px;
			}
			.spanWidth{
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
		}
		.row2{
			margin-bottom: 35px;
			#Date_picker .ivu-select-dropdown {
			    left: 237px !important;
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
				width: 15%;
			}
			.colmn2 {
				width: 14%;
			}
			.colmn3 {
				width: 10%;
			}
			.colmn4 {
				width: 15%;
			}
			.colmn5 {
				width: 10%;
			}
			.colmn6 {
				width: 18%;
			}
			.colmn7 {
				width: 18%;
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
