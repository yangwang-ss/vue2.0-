<template>
	<div id="pbproject">
		<h4 class="h41" style="cursor: auto;">发布项目</h4>
		<div class="row">
			<span class="span1"><label for="input1">项目名称：</label><input type="text" name="" id="input1" value="" placeholder="请输入" class="inputText" v-model="projectName"/></span>
			<span id="Date-picker">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
            </span>
		</div>
		<div class="row row2">
			<span class="span1">项目类型：<Select v-model="model1" ref = "projectKinds" clearable transfer>
               <Option v-for="item in proKind" :value="item.key" :key="item.key">{{ item.value}}</Option></Select>
			</span>
			<span class="span1">项目状态：<Select v-model="model2" ref = "projectStates" clearable>
               <Option v-for="item in projectState" :value="item.key" :key="item.value">{{ item.value }}</Option>
           </Select>
			</span>
			<span class="buttonList">
			<span class="smallBtn1" @click="showNewFomm">新建</span>
			<span class="smallBtn2" @click="searchProject">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">项目名称</td>
				<td class="colmn2">项目类型</td>
				<td class="colmn3">创建时间</td>
				<td class="colmn4">项目状态</td>
				<td class="colmn5">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td>{{item.name}}</td>
				<td>{{item.typeDicValue}}</td>
				<td>{{timeFormat(item.createTime)}}</td>
				<td>{{item.statusDicValue}}</td>
				<td class="check-more">
					<span @click="checkDetail(item.projectId,item.type,item.statusDicValue)">查看</span>
					<span class="checkLink" @click="reviseProject(item.projectId,item.status)" v-if="item.status==0">编辑</span>
					<span @click="confirm(item.projectId,item.status)" v-if="item.status==0">删除</span>
				</td>
			</tr>
		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalCount" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建项目-->
		<keep-alive>
		<bounces v-if="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-project ref="newProject" v-on:childeMethod="totalpageSizes" @cancel="cancel()"></new-project>
		</bounces>
		</keep-alive>
		<!--修改项目-->
		<keep-alive>
			<bounces v-if="revisebouncesHide" @emitClickPopup="popupShutDown()">
			<revise-project ref="editeProject" v-on:childeMethod="searchProject" @reviseCancel="reviseCancel()"></revise-project>
		</bounces>
		</keep-alive>
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
	import NewProject from '@/components/newProject'
	import reviseProject from '@/components/reviseProject'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading: true,
				bouncesHide: false,
				revisebouncesHide: false,
				i: -100,
				dd: "hello",
				projectName: '',
				projectType: 'projectType',
				proStatus: 'projectAndBatchStatus',
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				value2: ['2016-01-01', '2016-02-15'],
				projectKind: [],
				projectState: [],
				model1: '',
				model2: '',
				dateValue: [],
				proKind: []
			}
		},
		
		mounted() {
			this.searchProject();
			//项目类型
			this.projectKinds();
			//项目状态
			this.projectStatus();
		},
		components: {
			NewProject,
			reviseProject,
			bounces
		},
		
		methods: {
			
			cancel() {
				this.bouncesHide = false;
			},
			//删除确认
			confirm(projectId, status) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.deleteItem(projectId)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
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
			resetData() {
				var that = this;
				this.projectName = '';
				that.dateValue = '';
				that.model1 = '';
				that.model2 = '';
			},

			projectKinds() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectType //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.proKind = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			//项目状态
			projectStatus() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.proStatus //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.projectState = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			//项目搜索
			searchProject() {
				var that = this;
				this.axios.post('/task/searchProject.do', {
					"pageNum": that.page, //类型：Number  必有字段  备注：当前页数
					"pageSize": that.pageSize, //类型：String  必有字段  备注：批次实例Id
					"status": parseInt(that.model2), //类型：Number  可有字段  备注：项目状态
					"startCreateTime": Date.parse(that.dateValue[0]), //类型：String  可有字段  备注：项目创建开始时间
					"endCreateTime": Date.parse(that.dateValue[1]), //类型：String  可有字段  备注：项目创建结束时间
					"type": parseInt(that.model1), //类型：Number  可有字段  备注：项目类型
					"name": that.projectName //类型：String  可有字段  备注：项目名称
				}).then((res) => {
					if(res.data.code === '0') {
						this.loading = false;
						this.$Loading.finish();
						this.tableList = res.data.data.projects;
						this.result = res.data.data;
						this.totalpageSize = res.data.data.totalCount;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {})
			},
			changePage(page) {
				this.page = page;
				this.searchProject();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.searchProject();
			},
			totalpageSizes(totalpageSize) {
				this.totalpageSize = totalpageSize;
				this.searchProject();
			},
			//新建点击事件
			showNewFomm() {
				this.bouncesHide = true;
				//初始化新建信息
				this.$nextTick(()=>{
					this.$refs.newProject.initNewProjectMess();
				});
				
			},
			//修改项目
			reviseProject(projectId, status) {
					this.revisebouncesHide = true;
					this.$nextTick(()=>{
						this.$refs.editeProject.initData();
						this.$refs.editeProject.projectMess(projectId);
					});
			},
			popupShutDown() {
//				this.revisebouncesHide = false;
//				this.bouncesHide = false;
			},
			//查看
			checkDetail(id, type,status) {
				this.$router.push({
					name: 'checkBatch',
					query: {
						projectId: id,
						type: type,
						status:status
					}
				});
			},
			//删除操作
			deleteItem(projectId) {
				var that = this;
				this.axios.post('/task/deleteProject.do', {
					"projectId": projectId
				}).then((res) => {
					this.searchProject();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
			
			//修改项目撤销
			reviseCancel() {
				this.revisebouncesHide = false;
			}

		}
	}
</script>

<style lang="scss" scoped="scoped">
	#pbproject {
		.row {
			margin-bottom: 25px;
			position: relative;
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 40px;
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
				.smallBtn2 {
					margin: 0 10px;
				}
			}
		}
		.row2 {
			margin-bottom: 35px;
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
				white-space: nowrap;
			}
			.colmn1 {
				width: 20%;
			}
			.colmn2 {
				width: 17.5%;
			}
			.colmn3 {
				width: 25%;
			}
			.colmn4 {
				width: 17.5%;
			}
			.colmn5 {
				width: 20%;
			}
			.check-more {
				text-align: left;
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