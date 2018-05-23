<template>
	<div id="voiceTest">
		<h4 class="h41" style="cursor: auto;">消息模板配置</h4>
		<div class="row">
			<span class="span1"><label for="input1">模板说明：</label><input type="text" name="" id="input1" value="" placeholder="请输入" v-model="projectName"/></span>
			<span id="Date-picker">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateTime"></Date-picker>
            </span>
		</div>
		<div class="row">
			<span class="span1">发送渠道：<Select v-model="sendingKind" clearable>
               <Option v-for="item in sendingKindList" :value="item.name" :key="item.name">{{ item.value }}</Option>
           </Select>
          </span>
			<span class="buttonList">
			<span class="smallBtn1" @click="NewSystemMessage">新建</span>
			<span class="smallBtn2" @click="searchMessage">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">模板说明</td>
				<td class="colmn2">模板标题</td>
				<td class="colmn3">创建时间</td>
				<td class="colmn4">状态</td>
				<td class="colmn5">操作</td>
			</tr>
			<tr v-for="item in messageLists">
				<td>{{item.description}}</td>
				<td>{{item.title}}</td>
				<td>{{item.sendTime|moment("YYYY-MM-DD HH:mm:ss")}}</td>
				<td>{{item.status===0?'编辑':'启用'}}</td>
				<td class="check-more">
					<span @click="editMessageList(item.id,item.status)" v-if="item.status==0">编辑</span>
					<span @click="confirm(item.id)" class="checkLink" v-if="item.status==0">删除</span>
					<span @click="start_stop(item.status,item.id)">{{item.status===0?'启用':'取消启用'}}</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<!--分页插件-->
		<div id="page">
			<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建消息-->
		<bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-mesage v-on:childeMethod="searchMessage" @cancel="editCancel"></new-mesage>
		</bounces>
		<!--编辑消息配置-->
		<bounces v-show="editbouncesHide" @emitClickPopup="popupShutDown()">
			<edit-messconfig @cancel="editCancel" ref="editMess" v-on:childeMethod="searchMessage"></edit-messconfig>
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
	import newMesage from '@/views/config/newMessconfig'
	import bounces from "@/components/btm-bounces.vue"
	import editMessconfig from "@/views/config/editMessConfig"
	export default {
		data() {
			return {
				loading:true,
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				messageLists: [],
				bouncesHide: false,
				editbouncesHide: false,
				projectName: '',
				sendingKind: '',
				dateTime: '',
				status: '',
				value2: ['2016-01-01', '2016-02-15'],
				sendingKindList: []
			}

		},
		mounted() {
			//获取发送渠道
			this.messageList();
			//查询消息
			this.searchMessage();
		},
		methods: {
			//重置
			resetData() {
				this.projectName = '';
				this.sendingKind = '';
				this.messageKind = '';
				this.dateTime = '';
			},
			//获取发送渠道
			messageList() {
				this.axios.post('/msg/findSenderList.do', {

				}).then((res) => {
					console.log(res);
					this.sendingKindList = res.data.data.value;
				}).catch(function(err) {})
			},
			//查询消息
			searchMessage() {
				var that = this;
				this.axios.post('/msg/listCustomTemplate.do', {
					"pageNum": that.page, //类型：Number  必有字段  备注：页码
					"pageSize": that.pageSize, //类型：Number  必有字段  备注：一页个数
					"description": that.projectName, //类型：String  可有字段  备注：描述
					//"startCreateTime":1,                //类型：Number  可有字段  备注：开始时间
					//"endCreateTime":1,                //类型：Number  可有字段  备注：结束时间
					"media": that.sendingKind //类型：String  可有字段  备注：渠道
				}).then((res) => {
					if(res.data.code =='0'){
						this.loading = false;
						this.messageLists = res.data.data.list;
					this.totalpageSize = res.data.data.total;
					this.status = res.data.data.status;
					}else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			//删除确认
			confirm(id) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.deleteMessageList(id);
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//删除用户自定义消息模板
			deleteMessageList(id){
				this.axios.post('/msg/deleteCustomTemplate.do',{
					 "id":id //类型：String  必有字段  备注：消息唯一标识
				}).then((res)=>{
					this.searchMessage();
				}).catch(function  (err) {
					console.log(err);
				});
			},
			//编辑消息列表
			editMessageList(id, status) {
				if(status == 1) {
					this.$Message.warning("此状态下不可编辑");
				} else {
					this.editbouncesHide = true;
					this.$refs.editMess.showMess(id);
				}
			},
			//禁用_启用消息列表
			start_stop(status, id) {
				if(status == 0) {
					this.axios.post('/msg/enableCustomTemplate.do', {
						"id": id //类型：String  必有字段  备注：消息模板ID
					}).then((res) => {
						this.$Message.success(res.data.msg);
						this.searchMessage();
					}).catch(function(err) {
						this.$Message.error(res.data.msg)
					});
				} else {
					this.axios.post('/msg/disableCustomTemplate.do', {
						"id": id //类型：String  必有字段  备注：消息模板ID
					}).then((res) => {
						console.log(res);
						this.searchMessage();
						this.$Message.success(res.data.msg);
					}).catch(function(err) {
						this.$Message.error(res.data.msg)
					});
				}
			},
			//消息编辑点击事件
			NewSystemMessage() {
				this.bouncesHide = true;
			},
			editCancel() {
				this.editbouncesHide = false;
				this.bouncesHide = false;
			},
			popupShutDown() {
//				this.editbouncesHide = false;
//				this.bouncesHide = false;
			},
			changePage(page) {
				this.page = page;
				this.searchMessage();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.searchMessage();
			}
		},
		components: {
			newMesage,
			editMessconfig,
			bounces
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#voiceTest {
		input {
			height: 27px;
			width: 230px;
		}
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
			.spanWidth {
				width: 600px;
				display: inline-block;
			}
			.buttonList {
				margin-left: 350px;
				/*	padding-left: 75%;*/
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
				width: 20%;
			}
			.colmn3 {
				width: 25%;
			}
			.colmn4 {
				width: 15%;
			}
			.colmn5 {
				width: 20%;
			}
			.check-more {
				position: relative;
				* {
					vertical-align: middle;
				}
				span {
					color: #108EE9;
					display: inline-block;
					cursor: pointer;
				}
			}
			.checkLink1 {
				padding: 0 5px;
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
		}
	}
</style>