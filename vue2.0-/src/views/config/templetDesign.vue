<template>
	<div id="voiceTest">
		<div class="guide">
			<span class="h42" @click="goback">结算模板配置/</span>
			<span class="h41" style="cursor: auto;">模板设计</span>
		</div>
		<div class="row">
			<span class="smallBtn1" @click="showNewTemplet" v-show="newBuild">新建</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">计费项名称</td>
				<td class="colmn2">计算类型</td>
				<td class="colmn3">结算类型</td>
				<td class="colmn4">单价</td>
				<td class="colmn5">单位</td>
				<td class="colmn6">考核指标关系</td>
				<!--				<td class="colmn7">状态</td>-->
				<td class="colmn8">操作</td>
			</tr>
			<tr v-for="item in settitleList">
				<td>{{item.description}}</td>
				<td>{{convert(item.name,computedKind)}}</td>
				<td>{{convert(item.accountType,settitleKind)}}</td>
				<td>{{item.unitPrice}}</td>
				<td>{{item.unit}}</td>
				<td>{{convert(item.conditionRelation,testLink)}}</td>
				<!--<td>{{item.status==0?'编辑':'启用'}}</td>-->
				<td class="check-more">
					<span v-show="newBuild" @click="edit(item.id)">编辑</span>
					<span class="checkLink" v-show="newBuild" @click="confirm(item.id,item.status)">删除</span>
					<span @click="jpRouterTemplateDg(item.id)">计费条件</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建计费项-->
		<bounces v-show="bouncesHide1" @emitClickPopup="popupShutDown()">
			<new-computedfee ref="showTemplate" @cancel="cancel()" v-on:childeMethod="searchSettitle"></new-computedfee>
		</bounces>
		<!--编辑计费项-->
		<bounces v-show="bouncesHide2" @emitClickPopup="popupShutDown()">
			<r-computefee ref="showRevise" @cancel="cancel()" v-on:childeMethod="searchSettitle"></r-computefee>
		</bounces>

	</div>
</template>

<script>
	import newComputedfee from '@/components/newComputedFee'
	import rComputefee from '@/components/reviseComputefee'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				computedKind: [],
				settitleKind: [],
				testLink: [],
				newBuild: false,
				settitleList: [],
				pageNum: 1,
				pageSize: 10,
				totalpageSize: 0,
				status: 0,
				bouncesHide1: false,
				bouncesHide2: false,
				projectName: '',
				dateTime: '',
				model1: '',
				value2: ['2016-01-01', '2016-02-15'],
				templateState: [{
						value: '1',
						label: '启用'
					},
					{
						value: '2',
						label: '禁用'
					}
				]
			}
		},
		mounted() {
			//结算模板查询
			this.searchSettitle();
			this.showHiddien();
			this.selectData();
		},

		methods: {
			goback(){
				this.$router.back();
			},
			//查询创建计费类型时的系统参数
			selectData() {
				this.axios.post('/settle/findCreateSettlementData.do', {

				}).then((res) => {
					console.log(res);
					this.computedKind = res.data.data.name;
					this.settitleKind = res.data.data.accountType;
					this.testLink = res.data.data.conditionRelation;
				})
			},
			//将key值转换成value值
			convert(e, list) {
				for(var i = 0; i < list.length; i++) {
					var l = list[i];
					if(e == l.key) {
						return l.value;
					}
				}
			},
			//重置
			reSet() {
				this.projectName = '';
				this.dateTime = '';
				this.model1 = '';
			},
			//新建点击事件
			showNewTemplet() {
				this.bouncesHide1 = true;
				this.$refs.showTemplate.initData();
			},
			//编辑结算模板
			edit(id) {
				this.bouncesHide2 = true;
				this.$refs.showRevise.showMess(id);
			},
			cancel() {
				this.bouncesHide1 = false;
				this.bouncesHide2 = false;
			},
			//根据状态判断新建的显示与隐藏
			showHiddien() {
				 this.status = this.$route.query.status;
				 console.log(this.status)
				if(this.status == 0) {
					this.newBuild = true;
				} else {
					this.newBuild = false;
				}
			},
			//结算模板查询
			searchSettitle() {
				var that = this;
				var parentId = this.$route.query.settitleId;
				this.axios.post('/settle/searchTempalte.do', {
					"pageNum": that.pageNum, //类型：Number  必有字段  备注：页码
					"pageSize": that.pageSize, //类型：Number  必有字段  备注：每页大小
					"parentId": parentId, //类型：String  可有字段  备注：父级结算模板ID
					//"description":that.description,                //类型：String  可有字段  备注：模板名称
					//"startCreateTime":1,                //类型：Number  可有字段  备注：开始查询创建时间
					//"endCreateTime":1,                //类型：Number  可有字段  备注：结束查询创建时间
					"status": that.status //类型：Number  可有字段  备注：状态
				}).then((res) => {
					console.log(res);
					this.settitleList = res.data.data.list;
					this.totalpageSize = res.data.data.total;
				}).catch(function(err) {

				});
			},
			changePage(pageNum) {
				this.pageNum = pageNum;
				this.searchSettitle();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.searchSettitle();
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
					console.log(res);
					this.searchSettitle();
				}).catch(function(err) {

				});
			},
			//查看
			jpRouterTemplateDg(id, status) {
				var status = this.$route.query.status;
				this.$router.push({
					name: 'feeCondition',
					query: {
						settlementId: id,
						status: status
					}
				});
			},
			popupShutDown() {
				this.revisebouncesHide = false;
				this.bouncesHide = false;
			},
		},
		components: {
			newComputedfee,
			rComputefee,
			bounces
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#voiceTest {
		.guide {
			margin-top: 20px;
			margin-bottom: 20px;
		}
		input {
			height: 27px;
			width: 230px;
		}
		.row {
			margin-bottom: 25px;
			position: relative;
			text-align: right;
			.smallBtn1 {
				margin-right: 30px;
				display: inline-block;
				text-align: center;
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
				width: 10%;
			}
			.colmn4 {
				width: 10%;
			}
			.colmn5 {
				width: 10%;
			}
			.colmn6 {
				width: 15%;
			}
			/*.colmn7{
				width: 10%;
			}*/
			.colmn8 {
				width: 20%;
			}
			.check-more {
				text-align: center;
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
		}
	}
</style>