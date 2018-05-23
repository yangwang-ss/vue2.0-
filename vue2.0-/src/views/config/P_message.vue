<template>
	<div id="voiceTest">
		<h4 class="h41" style="cursor: auto;">系统消息模板配置</h4>
		<div class="row">
			<span class="span1"><label for="input1">信息描述：</label><input type="text" name="" id="input1" value="" placeholder="请输入" v-model="description"/></span>
			<span id="Date-picker">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateTime"></Date-picker>
            </span>
		</div>
		<div class="row">

			<span class="buttonList">
			<span class="smallBtn2" @click="systemMessList">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">模板描述</td>
				<td class="colmn2">模板标题</td>
				<td class="colmn3">模板内容</td>
				<td class="colmn4">操作</td>
			</tr>
			<tr v-for="item in MessList">
				<td>{{item.description}}</td>
				<td>{{item.title}}</td>
				<td :title="item.message">{{item.message}}</td>
				<td class="check-more">
					<span @click="showNewMessage(item.id)">编辑</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<!--分页插件-->
		<div id="page">
			<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--编辑消息-->
		<bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-mesage ref="showEditMessage" @cancel="editCancel" v-on:childeMethod="systemMessList"></new-mesage>
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
	import newMesage from '@/views/config/newMessage'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading: true,
				pageSize: 10,
				pageNum: 1,
				totalpageSize: 0,
				bouncesHide: false,
				description: '',
				sendingKind: '',
				messageKind: '',
				MessList: [],
				dateTime: '',
				value2: ['2016-01-01', '2016-02-15'],
				sendingKindList: [],
				sendKindList: [{
						value: 'beijing',
						label: '北京市'
					},
					{
						value: 'shanghai',
						label: '上海市'
					},
					{
						value: 'shenzhen',
						label: '深圳市'
					},
					{
						value: 'hangzhou',
						label: '杭州市'
					},
					{
						value: 'nanjing',
						label: '南京市'
					},
					{
						value: 'chongqing',
						label: '重庆市'
					}
				]
			}

		},
		mounted() {
			//获取发送渠道
			this.messageList();
			//获取系统消息列表
			this.systemMessList();
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
					console.log(this.templateState)
				}).catch(function(err) {})
			},
			//获取系统消息列表
			systemMessList(id) {
				var that = this;
				this.axios.post('/msg/listSystemTemplate.do', {
					"pageNum": that.pageNum, //类型：Number  必有字段  备注：页码
					"pageSize": that.pageSize, //类型：Number  必有字段  备注：每页大小
					"description": that.description, //类型：String  可有字段  备注：说明
					//"startCreateTime":1,                //类型：Number  可有字段  备注：创建开始时间
					//"endCreateTime":1                //类型：Number  可有字段  备注：创建结束时间
				}).then((res) => {
					if(res.data.code == '0') {
						this.loading = false;
						this.MessList = res.data.data.list;
						this.totalpageSize = res.data.data.total;
					} else {
						this.$Message.error(res.data.msg);
					}

				}).catch(function(err) {
					console.log(err);
				});
			},
			//编辑消息列表
			editMessageList() {

			},
			//消息编辑点击事件
			showNewMessage(id) {
				this.bouncesHide = true;
				this.$refs.showEditMessage.showMess(id);
			},
			editCancel() {
				this.bouncesHide = false;
			},
			popupShutDown() {
//				this.bouncesHide = false;
			},
			changePage(pageNum) {
				this.pageNum = pageNum;
				this.systemMessList();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.systemMessList();
			}
		},
		components: {
			newMesage,
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
				display: inline-block;
				padding-left: 675px;
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
				width: 27%;
			}
			.colmn2 {
				width: 26%;
			}
			.colmn3 {
				width: 27%;
			}
			.colmn4 {
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
		}
	}
</style>