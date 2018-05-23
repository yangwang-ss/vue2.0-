<template>
	<div id="checkBatch">
		<div class="titleWap">
			<span class="h42" @click="goBack">发布项目/</span>
			<span class="h41" style="cursor: auto;">批次列表</span>
		</div>
		<div class="CollapseWap">
			<div class="Collapse" @click="showCollapse">
				<span class="title">项目信息</span><span><img src="../image/arrow.png" :class="Collapse?'roateImg1':''"/></span>
			</div>
			<transition name="fade">
				<batch-message v-show="Collapse"></batch-message>
			</transition>
		</div>
		<!--批次表单-->
		<div class="row">
			<span class="span1"><label for="input1">批次名称：</label><input type="text" name="" id="input1" value="" placeholder="请输入" ref='batchName'/></span>
			<span class="span2" id="Date-picker2">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px;height: 27px;" v-model = "dateTime1"></Date-picker>
            </span>
			<span class="buttonList">
			<span class="smallBtn1" @click="showBatchFrom" v-show="newBuildBtn">新建</span>
			<span class="smallBtn3" @click="showExport">导出</span>
			<span class="smallBtn2" @click="Batch">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">批次编号</td>
				<td class="colmn2">创建时间</td>
				<td class="colmn3">领取进度</td>
				<td class="colmn4">批次状态</td>
				<td class="colmn5">操作</td>
			</tr>
			<tr v-for="(item,$index) in batchList">
				<td>{{item.batchName}}</td>
				<td>{{timeFormat(item.createTime)}}</td>
				<td>{{item.receiceProgess}}%</td>
				<td>{{item.statusDicValue}}</td>
				<td class="check-more">
					<span @click="jumpExportWorkorder(item.batchId,item.receiceProgess)">查看</span>
					<span class="checkLink" @click="reviseBatch(item.batchId,item.status)">编辑</span>
					<span @click="confirm(item.batchId,item.status)">删除</span>
				</td>
			</tr>
		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalCount" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		
		<!--新建批次-->
		<keep-alive>
		<bounces v-if="bouncesHide1" @emitClickPopup="popupShutDown()">
			<new-batch ref="IsshowBatch" v-on:childeMethod="Batch" @cancel="cancel()"></new-batch>
		</bounces>
		</keep-alive>
		<!--修改批次-->
		<keep-alive>
		<bounces v-if="bouncesHide2" @emitClickPopup="popupShutDown()">
			<revise-batch ref = "isShowReviseBatch" v-on:childeMethod="Batch" @cancel="cancel()"></revise-batch>
		</bounces>
		</keep-alive>
		<!--导出-->
		<bounces v-show="bouncesHide3" @emitClickPopup="popupShutDown()">
			<export-file ref="exportf" @cancel="cancel()"></export-file>
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
	import batchMessage from '../components/batchMessage'
	import newBatch from '../components/newBatch'
	import reviseBatch from '../components/reviseBatch'
	import exportFile from '../components/export'
//	import workOrder from '../components/workOrder'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading:true,
				bouncesHide1:false,
				bouncesHide2:false,
				bouncesHide3:false,
				taskTime: '',
				totalCount: 0,
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				batchList: [],
				showDrop: false,
				value2: ['2016-01-01', '2016-02-15'],
				Collapse: false,
				dateTime1: [],
				i: -1,
				newBuildBtn:true,
			}
		},
		mounted() {
			this.Batch();
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
			popupShutDown() {
//				this.bouncesHide1 = false;
//				this.bouncesHide2 = false;
//				this.bouncesHide3 = false;
//				this.bouncesHide4 = false;
			},
			goBack(){
				this.$router.back(-1)
			},
			//重置
			resetData() {
				var that = this;
				this.$refs.batchName.value = '';
				that.dateTime1 = [];
			},
			changePage(page) {
				this.page = page;
				this.Batch();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.Batch();
			},
			
			//批次列表
			Batch() {
				var that = this;
				const projectId = this.$route.query.projectId;
				const batchName = this.$refs.batchName.value;
				if(this.$route.query.status=='退回'){
					this.newBuildBtn = false;
				}else{
					this.newBuildBtn = true;
				}
				this.axios.post('/task/searchBatch.do', {
					"pageSize": that.pageSize, //类型：Number  必有字段  备注：每页条数
					"pageNum": that.page, //类型：Number  必有字段  备注：当前页数
					"batchName": batchName, //类型：String  必有字段  备注：名称
					"startCreateTime": Date.parse(that.dateTime1[0]), //类型：String  必有字段  备注：批次创建开始时间
					"endCreateTime": Date.parse(that.dateTime1[1]), //类型：String  必有字段  备注：批次创建结束时间
					"projectId": projectId //类型：String  必有字段  备注：项目Id
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
					this.batchList = res.data.data.batchs;
					this.totalCount = res.data.data.totalCount
					}else{
						this.$Message.error(res.data.msg)
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			//面板折叠
			showCollapse() {
				this.Collapse = !this.Collapse;
			},
			//新建批次
			showBatchFrom() {
				this.bouncesHide1 = true;
				this.$nextTick(()=>{
					this.$refs.IsshowBatch.initData();//数据初始化
				});
			},
			cancel() {
				this.bouncesHide1 = false;
				this.bouncesHide2 = false;
				this.bouncesHide3 = false;
				this.bouncesHide4 = false;
			},
			//修改批次
			reviseBatch(batchId,status){
				if (status ===1||status===2) {
					this.$Message.warning("此状态下不可编辑");
				}
				else{
					this.bouncesHide2 = true;
					this.$nextTick(()=>{
						this.$refs.isShowReviseBatch.batchMess(batchId);
					});
				}
			},
			//删除确认
			confirm (batchId,status) {
			 	if (status ===1||status===2) {
			 		this.$Message.warning("此状态下不可删除");
			 		return;
			 	}
                this.$Modal.confirm({
                    content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
                    onOk: () => {
                    	this.deleteBatch(batchId) 
                    },
                    onCancel: () => {
                    }
                });
           },
			//删除批次
			deleteBatch(batchId){
					this.axios.post('/task/deleteBatch.do',{
					"batchId":batchId
				}).then((res) =>{
					console.log(res);
					this.Batch();
					let ss = res.data.msg;
					 //this.success (ss);
				}).catch(function(err){});
			},
			
			//导出
			showExport() {
				this.bouncesHide3 = true;
				this.$refs.exportf.initData();
			},
			//显示更多操作
			showDropList(index) {
				this.i = index
				//this.showDrop = !this.showDrop
			},
			//查看导出工单
			checkWworkOrder(id) {
				this.bouncesHide4 = true;
				this.$refs.workorder.checkWorkorder(id);
			},
			//查看工单路由跳转
			jumpExportWorkorder(id,progress){
				if (progress<0||progress==0) {
					this.$Message.warning("批次还未开始领取任务,暂不能查看");
					return;
				}
				this.$router.push({
					name: 'exportWorder',
					query: {
						batchId: id,
						progress:progress
					}
				});
			},
			//更多操作
			hideList() {
				this.showDrop = false;
			}
		},
		components: {
			batchMessage,
			newBatch,
			exportFile,
			reviseBatch,
			bounces
		}
	}
</script>

<style lang="scss" scoped="scoped">
	
	#checkBatch {
		input {
			height: 27px;
			width: 230px;
		}
		.CollapseWap {
			border-top: 1px solid #E9E9E9;
			border-bottom: 1px solid #E9E9E9;
			.Collapse {
				cursor: pointer;
				padding-left: 20px;
				padding-right: 10px;
				display: flex;
				display: -ms-flexbox;
				justify-content: space-between;
				height: 50px;
				align-items: center;
				img {
					vertical-align: middle;
				}
				&:hover {
					background: #F4F6F9;
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
				width: 30em;
			}
			.span2 {
				width: 30em;
				margin-left: 40px;
			}
			.buttonList {
				span {
					vertical-align: middle;
					text-align: center;
					display: inline-block;
				}
				
				.smallBtn2 {
					margin: 0 5px;
				}
				.smallBtn3 {
					margin-left: 5px;
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
				width: 22.5%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 17.5%;
			}
			.colmn5 {
				width: 20%;
			}
			.check-more {

				position: relative;
				* {
					vertical-align: middle;
				}
				.rotateImg-deg1 {
					animation: rotateImg1 0.3s forwards;
				}
				.rotateImg-deg2 {
					animation: rotateImg2 0.3s forwards;
				}
				span {
					color: #108EE9;
					display: inline-block;
					cursor: pointer;
				}
				.checkLink {
					width: 40px;
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
	}
</style>