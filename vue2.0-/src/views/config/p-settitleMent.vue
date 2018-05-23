<template>
	<div id="voiceTest">
		<h4 class="h42">结算模板配置</h4>
		<div class="row">
			<span class="span1"><label for="input1">项目名称：</label><input type="text" name="" id="input1" value="" placeholder="请输入" v-model="description"/></span>
			<span id="Date-picker">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateTime"></Date-picker>
            </span>
		</div>
		<div class="row row2">
			<span class="span1 spanWidth">模板状态：<Select v-model="status" clearable>
               <Option v-for="item in templateState" :value="item.value" :key="item.value">{{ item.label }}</Option>
           </Select>
			</span>

			<span class="buttonList">
			<span class="smallBtn1" @click="showNewTemplet">新建</span>
			<span class="smallBtn2" @click="searchSettitle">搜索</span>
			<span class="smallBtnDefalt" @click="reSet">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">模板名称</td>
				<td class="colmn2">创建人</td>
				<td class="colmn3">更新时间</td>
				<td class="colmn4">模板状态</td>
				<td class="colmn5">操作</td>
			</tr>
			<tr v-for="item in settitleList">
				<td>{{item.description}}</td>
				<td>{{item.creator}}</td>
				<td>{{item.createTime?timeFormat(item.createTime):"暂无数据"}}</td>
				<td>{{item.status==0?'编辑':'启用'}}</td>
				<td class="check-more">
					<span @click="enableSettlement(item.id)" v-if="item.status==0">启用</span>
					<span class="checkLink1" @click="editSettitle(item.id)" v-if="item.status==0">编辑</span>
					<span class="checkLink" @click="confirm(item.id,item.status)" v-if="item.status==0">删除</span>
					<span @click="jpRouterTemplateDg(item.id,item.status)">模板设计</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建模板-->
		<bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-settitle ref="showTemplate" @cancel="cancel()" v-on:childeMethod="searchSettitle"></new-settitle>
		</bounces>
		<!--模板修改-->
		<bounces v-show="reviseBouncesHide" @emitClickPopup="popupShutDown()">
			<new-rsettitle @cancel="cancel()" ref="reviseSettitle" v-on:childeMethod="searchSettitle"></new-rsettitle>
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
	import newSettitle from '@/components/new-settitleTeplet'
	import newRsettitle from '@/components/newRevise-settitle'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading:true,
				settitleList: [],
				pageNum: 1,
				pageSize: 10,
				totalpageSize: 0,
				description: '',
				status: -1,
				bouncesHide: false,
				reviseBouncesHide: false,
				dateTime: '',
				value2: ['2016-01-01', '2016-02-15'],
				templateState: [{
						value: '-1',
						label: '请选择'
					},
					{
						value: '0',
						label: '编辑'
					},
					{
						value: '1',
						label: '启用'
					}
				]
			}
		},
		mounted() {
			this.searchSettitle();
		},
		methods: {
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			//时间戳转化成时间格式
			timeFormat(timestamp) {
				//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
				var time = new Date(timestamp);
				var year = time.getFullYear();
				var month = time.getMonth() + 1;
				var date = time.getDate();
				var hours = time.getHours();
				var minutes = time.getMinutes();
				var seconds = time.getSeconds();
				return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
			},
			//重置
			reSet() {
				this.projectName = '';
				this.dateTime = '';
				this.status = '';
			},
			//新建点击事件
			showNewTemplet() {
				this.bouncesHide = true;
			},
			changePage(pageNum) {
				this.pageNum = pageNum;
				this.searchSettitle();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.searchSettitle();
			},
			//结算模板查询
			searchSettitle() {
				var that = this;
				this.axios.post('/settle/searchTempalte.do', {
					"pageNum": that.pageNum, //类型：Number  必有字段  备注：页码
					"pageSize": that.pageSize, //类型：Number  必有字段  备注：每页大小
					"description": that.description, //类型：String  可有字段  备注：模板名称
					//"startCreateTime":1,                //类型：Number  可有字段  备注：开始查询创建时间
					//"endCreateTime":1,                //类型：Number  可有字段  备注：结束查询创建时间
					"status": that.status //类型：Number  可有字段  备注：状态
				}).then((res) => {
					if(res.data.code =='0'){
						this.loading = false;
						this.settitleList = res.data.data.list;
						this.totalpageSize = res.data.data.total;
					}else{
						this.$Message.error(res.data.msg)
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			//启用结算模板
			enableSettlement(id) {
				this.axios.post('/settle/enableSettlement.do', {
					"id": id //类型：String  必有字段  备注：当前记录ID
				}).then((res) => {
					this.searchSettitle();
				}).catch(function(err) {
					console.log(err);
				});
			},
			//删除确认
			confirm(id, status) {
				if(status === 1 || status === -1) {
					this.$Message.warning("此状态下不可删除");
					return;
				}
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.deletedSettitle(id);
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//删除结算模板列表
			deletedSettitle(id) {
				this.axios.post('/settle/deleteTemplate.do', {
					"id": id //类型：String  必有字段  备注：结算模板ID
				}).then((res) => {
					this.searchSettitle();
				}).catch(function(err) {

				});
			},
			//编辑结算模板列表
			editSettitle(id) {
				this.reviseBouncesHide = true;
				this.$refs.reviseSettitle.showMess(id);
			},
			cancel() {
				this.bouncesHide = false;
				this.reviseBouncesHide = false;
			},
			//查看
			jpRouterTemplateDg(id, status) {
				this.$router.push({
					name: 'templetDesign',
					query: {
						settitleId: id,
						status: status
					}
				});
			},
			popupShutDown() {
//				this.revisebouncesHide = false;
//				this.bouncesHide = false;
			},
		},
		components: {
			newSettitle,
			newRsettitle,
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
				margin-left: 35px;
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
				width: 25%;
			}
			.colmn2 {
				width: 15%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 20%;
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
				.rightMore {
					width: 70px;
				}
			}
			.checkLink1 {
				padding: 0 5px;
				position: relative;
				&:before {
					content: "";
					display: block;
					width: 1px;
					height: 15px;
					left: 0;
					top: 13px;
					position: absolute;
					background: #E9E9E9;
				}
			}
		}
	}
</style>