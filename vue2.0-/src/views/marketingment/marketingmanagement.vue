<template>
	<div id="marketing">
		<h4 class="h41" style="cursor: auto;">轮播图</h4>
		<div class="row">
			<span class="span1">模板状态：
				<Select clearable v-model="model2">
	               <Option v-for="item in projectState" :value="item.value" :key="item.value">{{ item.label }}</Option>
	           </Select>
			</span>
			<span id="Date-picker" class="span1">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange"
            		placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
            </span>
			<span class="buttonList">
			<span class="smallBtn1" @click="showWorkFrom">新建</span>
			<span class="smallBtn2" @click="searchMarket">搜索</span>
			<span class="smallBtnDefalt" @click="resetMarket">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">展示渠道</td>
				<td class="colmn3">权重</td>
				<td class="colmn4">停留时间</td>
				<td class="colmn5">状态</td>
				<td class="colmn6">创建时间</td>
				<td class="colmn7">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td>{{item.showChannel}}</td>
				<td>{{item.weigth}}</td>
				<td>{{item.banTime}}</td>
				<td v-if="item.statue==0">编辑</td>
				<td v-if="item.statue==1">启用</td>
				<td v-if="item.statue==2">禁用</td>
				<td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
				<td class="check-more">
					<span @click="reviseMarket(item.id)">编辑</span>
					<span class="checkLink" @click="confirm(item.id)">删除</span>
					<span v-if="item.statue==1" @click="forbiden(item.id,2)">禁用</span>
					<span v-else @click="forbiden(item.id,1)">启用</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建轮播图-->
		<v-bounces v-if="bouncesHide" @emitClickPopup="popupShutDown()">
			<newwork-market ref="newMark" @addsumbit="addsumbit($event)" @cancel="cancelno()"></newwork-market>
			<!--<work-Market ref="newMark" @addsumbit="addsumbit($event)" @cancel="cancelno()"></work-Market>-->
		</v-bounces>
		<!--修改轮播图-->
		<v-bounces v-show="revisebouncesHide" @emitClickPopup="popupShutDown()">
			<revise-market ref="newMarket" @sumbit="sumbit($event)" @cancel="cancel()"></revise-market>
			<!--<new-Market ref="newMarket" @sumbit="sumbit($event)" @cancel="cancel()"></new-Market>-->
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
	//新建
	import newworkMarket from "@/views/marketingment/workOrdermarket"
	//编辑
	import reviseMarket from "@/views/marketingment/newworkOrdermarket"
	import infoMarket from "@/views/marketingment/C_workOrdermarket"
	import Tool from "../../getData/tool"
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				i: -1,
				loading: true,
				projectName: '',
				pageSize: 10,
				pageNo: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				pmarName: '',
				showDrop: false,
				bouncesHide: false,
				revisebouncesHide: false,
				markInfoHide: false,
				value2: ['2016-01-01', '2016-02-15'],
				projectState: [{
						value: '0',
						label: '编辑'
					},
					{
						value: '1',
						label: '启用'
					},
					{
						value: '2',
						label: '禁用'
					}
				],
				model2: '',
				dateValue: [],
			}
		},
		mounted() {
			this.searchMarket();
		},
		components: {
			newworkMarket,
			reviseMarket,
			infoMarket,
			"v-bounces": bounces
		},
		watch: {
			dateValue(v) {
				console.log(Date.parse(v[0]), "1");
				console.log(Date.parse(v[1]), "2");
			},
			model2(v) {
				console.log(v, "sss");
			}
		},
		methods: {
			//新建
			addsumbit(e) {
				//				console.log(e.id,e.content,"你xxxxxxxxxxx");
				var that = this;
				this.axios.post('/mkmanager/insert.do', {
					"sendTarget": e.content.sendTarget,
					"showChannel": e.content.showChannel,
					'description': e.content.description,
					"urlPath": e.content.urlPath,
					"banTime": e.content.banTime,
					"picPath": e.content.projectPhoto,
					"weigth": e.content.weigth,
					"startTime": e.content.createTime,
					"endTime": e.content.updateTime
					//      			"projectPhoto": e.content.projectPhoto
				}).then((res) => {
					if(res.data.code == '0') {
						this.searchMarket();
						let ss = res.data.msg;
						this.bouncesHide = false;
						this.$Message.success(res.data.msg);
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {})
			},
			//修改
			sumbit(e) {
				//				console.log(e.id,e.content,"你");
				this.axios.post('/mkmanager/updateEle/' + e.id + '.do', {
					"sendTarget": e.content.showChannel,
					"showChannel": e.content.sendTarget,
					'description': e.content.description,
					"urlPath": e.content.urlPath,
					"banTime": e.content.banTime,
					"picPath": e.content.projectPhoto,
					 "statue":e.content.statue,//类型：String  必有字段  备注：状态
					"weigth": e.content.weigth,
					"startTime": e.content.startTime,
					"endTime": e.content.endTime,
					"fileId": e.content.fileId,
				}).then((res) => {
					if(res.data.code == '0') {
						this.searchMarket();
						let ss = res.data.msg;
						this.$Message.success(ss);
						this.revisebouncesHide = false;
					}else{
						this.$Message.error(res.data.msg);
						return;
					}
				}).catch(function(err) {})
			},
			//项目搜索
			searchMarket() {
				var that = this;
				this.axios.post('/mkmanager/selelistInfo.do', {
					"pageNo": that.page,
					"pageSize": that.pageSize,
					"statue": that.model2,
					"startTime": Date.parse(that.dateValue[0]),
					"endTime": Date.parse(that.dateValue[1])

				}).then((res) => {
					if(res.data.code == '0') {
						this.loading = false;
						this.tableList = res.data.data.result;
						this.result = res.data.data;
						this.result.totalItems = res.data.data.totalItems;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {})
			},
			changePage(page) {
				this.page = page;
				this.searchMarket();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.searchMarket();
			},
			computationsCallTime(date) {
				return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
			},
			//重置
			resetMarket() {
				var that = this;
				that.dateValue = '';
				that.model2 = '';
			},
			//新建轮播图
			showWorkFrom() {
				this.bouncesHide = true;

			},
			//修改轮播图
			reviseMarket(id) {
				this.revisebouncesHide = true;
				this.$refs.newMarket.projectMessinfo(id);
			},
			//查看轮播图
			checkWorkDetail(id) {
				this.markInfoHide = true;
				this.$refs.markInfo.projectMess(id);
			},
			//删除确认
			confirm(id) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.delList(id)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//删除操作
			delList(id) {
				var that = this;
				this.axios.post('/mkmanager/delEle/' + id + '.do', {}).then((res) => {
					console.log(res);
					this.searchMarket();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
			//显示更多操作
			showDropList(index) {
				//				alert(index);
				this.i = index
				//				this.showDrop = !this.showDrop
			},
			//禁用
			forbiden(id, statue) {
				var that = this;
				this.axios.post('/mkmanager/updateEleState/' + id + '/' + statue + '.do', {}).then((res) => {
					//					console.log(res.data);
					this.searchMarket();
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
//				this.markInfoHide = false;
			},
			cancel() {
				this.revisebouncesHide = false;
			},
			cancelno() {
				this.bouncesHide = false;
			},
			cancelfo() {
				this.markInfoHide = false;
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#marketing {
		input {
			height: 27px;
			width: 230px;
		}
		.row {
			margin-bottom: 25px;
			position: relative;
			.span1 {
				width: 300px;
				margin-right: 40px;
			}
			.span2 {
				margin-right: 10px;
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
				width: 15%;
			}
			.colmn3 {
				width: 15%;
			}
			.colmn4 {
				width: 10%;
			}
			.colmn5 {
				width: 20%;
			}
			.colmn6 {
				width: 25%;
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
					width: 70px;
				}
				.dropDownList {
					border: 1px solid #E4E4E4;
					box-shadow: 0px 0px 2px #E4E4E4;
					width: 60px;
					right: 28px;
					top: 30px;
					border-radius: 3px;
					position: absolute;
					z-index: 999;
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