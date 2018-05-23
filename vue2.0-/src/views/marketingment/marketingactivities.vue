<template>
	<div id="marketact">
		<h4 class="h41">营销活动</h4>
		<div class="row">
			<span class="span1">活动标题：
				<input type="text" name="" id="input1" value="" placeholder="请输入" class="inputText" v-model="activeName"/>
			</span>
			<span id="Date-picker" class="span2">
            	创建时间：<Date-picker :value="createdate" format="yyyy/MM/dd" type="daterange"
                                placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
            </span>
			
		</div>
		<div class="row">
			<span class="span1">模板状态：
				<Select v-model="modelstatic" clearable>
	               <Option v-for="item in projectState" :value="item.key" :key="item.key">{{ item.value }}</Option>
	           </Select>
			</span>
			<span class="buttonList">
			<span class="smallBtn1" @click="createActive">新建</span>
			<span class="smallBtn2" @click="getActivelist">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">活动标题</td>
				<td class="colmn3">活动内容描述</td>
				<td class="colmn4">状态</td>
				<td class="colmn5">创建时间</td>
				<td class="colmn6">操作</td>
			</tr>
			<tr v-if="tableList" v-for="item in tableList">
				<td :title="item.title">{{item.title}}</td>
				<td :title="item.description">{{item.description}}</td>
				<td>{{item.status}}</td>
				<td>{{formatDateTime(item.createTime)}}</td>
				<td class="check-more">
					<span @click="reActive(item.id)">编辑</span>
					<!--reviseMarket(item.id)-->
					<span class="checkLink" @click="delActive(item.id,item.status)">删除</span>
					<!--confirm(item.id)-->
					<span v-if="item.status!='启用'" @click="openActive(item.id)">启用</span>
					<span v-if="item.status=='启用'" @click="colseActive(item.id)">禁用</span>
				</td>
			</tr>

		</table>
		<bounces v-show="showNew" @emitClickPopup="popupShutDown()">
			<div class="Dialog">
				<div class="headTitle">
					<span class="title">新建营销活动</span>
					<span class="cancelWap" @click="cancel"><img src="../../image/cancel.png" /></span>
				</div>
				<div class="overflow">
					<div class="inputRow">
						<span>活动标题：</span>
						<input type="text" value="" v-model="activeTitle" placeholder="请输入" class="textInput" />
					</div>
					<div class="inputRow">
						<span>活动内容描述：</span>
						<textarea type="text" value="" v-model="activeCenter" placeholder="请输入" style="width: 230px;"/>
					</div>
					<div class="inputRow">
						<span>上传活动图片：</span>
						<Upload class="fileup" :before-upload="handleFrontUpload" action="/file_upload" :show-upload-list="false">
							<div class="choose-file">
								<i class="iconfont icon-add" />
								<span>上传图片</span>
							</div>
							<div class="showImag">
								<img :src="url" alt="" />
							</div>
						</Upload>
					</div>
					<div class="inputRow">
						<span>生效时间：</span>
						<!--{{activeDate}}-->
						<Date-picker :value="createdate" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="activeDate"></Date-picker>
					</div>
					<div class="inputRow">
						<span>活动跳转方式：</span>
						<Select v-model="activeLink" class="select" clearable>
							<Option v-for="item in links" :value="item.key" :key="item.key">{{ item.value }}</Option>
						</Select>
					</div>
					<div v-if="(this.activeLink=='share')" class="inputRow">
						<span>活动跳转地址：</span>
						<input type="text" value="" v-model="uri" placeholder="请输入" class="textInput" />
					</div>
					<div v-if="(this.activeLink=='job')" class="inputRow">
						<span>跳转菜单：</span>
						<!--<input type="text" value="" v-model="vgh5" placeholder="请输入" class="textInput" />-->
						<Select v-model="vgh5" class="select" clearable>
							<Option v-for="item in h5s" :value="item.key" :key="item.key">{{ item.value }}</Option>
						</Select>
					</div>
					<div v-if="(this.activeLink=='job')" class="inputRow">
						<span>任务选择：</span>
						<Select transfer v-model="taskname" filterable clearable>
							<Option v-for="(item,index) in taskList" :value="item.batchId" :key="index">{{item.batchName}}</Option>
						</Select>
					</div>
					<div class="inputRow">
						<span>按钮标题：</span>
						<input type="text" value="" v-model="btnTitle" placeholder="请输入" class="textInput" />
					</div>
					<div class="inputRow">
						<span>弹出周期(天)：</span>
						<input type="number" value="" v-model="poptime" placeholder="请输入" class="textInput" min="0" />
					</div>
					<div class="inputRow">
						<span>弹出次数(次)：</span>
						<input type="number" value="" v-model="popnum" placeholder="请输入" class="textInput" min="0" />
					</div>
					<div class="bootom-button">
						<div class="middlBtnDefalt" @click="cancel">取消</div>
						<div class="middleBtn1" @click="newActive">提交</div>
					</div>
				</div>
			</div>
			<!--</Modal>-->
		</bounces>
		<bounces v-show="showReset" @emitClickPopup="popupShutDown()">
			<div class="Dialog">
				<div class="headTitle">
					<span class="title">修改营销活动</span>
					<span class="cancelWap" @click="cancel"><img src="../../image/cancel.png" /></span>
				</div>
				<div class="overflow">
					<div class="inputRow">
						<span>活动标题：</span>
						<input type="text" value="" v-model="activeTitle" placeholder="请输入" class="textInput" />
					</div>
					<div class="inputRow">
						<span>活动内容描述：</span>
						<textarea type="text" value="" v-model="activeCenter" placeholder="请输入" style="width: 230px;"/>
					</div>
					<div class="inputRow">
						<span>上传活动图片：</span>
						<Upload class="fileup" :before-upload="handleFrontUpload" action="/file_upload" :show-upload-list="false">
							<div class="choose-file">
								<i class="iconfont icon-add" />
								<span>上传图片</span>
							</div>
							<div class="showImag">
								<img :src="url" alt="" />
							</div>
						</Upload>
					</div>
					<div class="inputRow">
						<span>生效时间：</span>
						<!--{{activeDate}}-->
						<Date-picker :value="createdate" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="activeDate"></Date-picker>
					</div>
					<div class="inputRow">
						<span>活动跳转方式：</span>
						<Select v-model="activeLink" class="select" clearable>
							<Option v-for="item in links" :value="item.key" :key="item.key">{{ item.value }}</Option>
						</Select>
					</div>
					<div v-if="(this.activeLink=='share')" class="inputRow">
						<span>活动跳转地址：</span>
						<input type="text" value="" v-model="uri" placeholder="请输入" class="textInput" />
					</div>
					<div v-if="(this.activeLink=='job')" class="inputRow">
						<span>跳转菜单：</span>
						<Select v-model="vgh5" class="select" clearable>
							<Option v-for="item in h5s" :value="item.key" :key="item.key">{{ item.value }}</Option>
						</Select>
					</div>
					<div v-if="(this.activeLink=='job')" class="inputRow">
						<span>任务选择：</span>
						<Select transfer v-model="taskname" filterable clearable>
							<Option v-for="(item,index) in taskList" :value="item.batchId" :key="index">{{item.batchName}}</Option>
						</Select>
					</div>
					<div class="inputRow">
						<span>按钮标题：</span>
						<input type="text" value="" v-model="btnTitle" placeholder="请输入" class="textInput" />
					</div>
					<div class="inputRow">
						<span>弹出周期(天)：</span>
						<input type="number" value="" v-model="poptime" placeholder="请输入" class="textInput" min="0" />
					</div>
					<div class="inputRow">
						<span>弹出次数(次)：</span>
						<input type="number" value="" v-model="popnum" placeholder="请输入" class="textInput" min="0" />
					</div>
					<div class="bootom-button">
						<div class="middlBtnDefalt" @click="cancel">取消</div>
						<div class="middleBtn1" @click="resetActive">提交</div>
					</div>
				</div>
				<!--</Modal>-->
			</div>>
		</bounces>
		<!--分页插件-->
		<div id="page">
			<Page :total="total" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
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
	import Tool from "../../getData/tool";
	import formengine from '../../../static/js/formengine.js';
	import { localImagePreview } from '../../getData/common';
	import { validateImageFile } from '../../getData/common';
	import bounces from "../../components/btm-bounces.vue";

	export default {
		data() {
			return {
				loading: true,
				data: [],
				thisID: '',
				dataList: '',
				tableList: '',
				url: '',
				uri: '',
				activeDate: [],//生效时间
				modelstatic: '',
				projectState: [], //模板状态
				links: '',
				h5s: [{
					value: '任务大厅',
					key: 'taskhall'
				}],
				createdate: '',
				dateValue: '',
				total: 10,
				vgh5: '',
				taskname: '',
				pageNo: 1,
				pageSize: 10,
				activeName: '',
				showNew: false,
				showReset: false,
				activeTitle: '',
				activeCenter: '',
				activeLink: '',
				btnTitle: '',
				poptime: '',
				popnum: '',
				taskList: '',
			}
		},
		mounted() {
			//ready
			this.getActivelist();
			this.getBasics();
			this.getWork();//任务选择
		},
		components: {
			//组建
			bounces
		},
		methods: {
			resetData() {
				this.activeName = '';
				this.dateValue = [];
				this.modelstatic = '';
			},
			formatDateTime(obj) {
				var date = new Date(obj);
				var y = 1900 + date.getYear();
				var m = "0" + (date.getMonth() + 1);
				var d = "0" + date.getDate();
				return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
				//            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
				//            return y + '-' + m + '-' + d;
			},
			popupShutDown() {
//				this.showNew = false;
//				this.showReset = false;
			},
			cancel() {
				this.showNew = false;
				this.showReset = false;
			},
			//任务选择
			getWork() {
				var that = this;
				this.axios.post('/activity/findEnableBatch.do', {
						"pageSize": 1000, //类型：Number  可有字段  备注：每页条数
						"pageNum": 1, //类型：Number  可有字段  备注：当前页数
						"status": 2 //类型：Number  可有字段  备注：状态
					}).then((res)=>{
						if(res.data.code=='0'){
							this.taskList = res.data.data.batchs;
						}else{
							this.$Message.error(res.data.msg);
						}
					}).catch(function(err) {
							console.log(err);
					})
			},
			getActivelist() {
				var that = this;
				this.axios.post('/activity/listMarketingActivity.do', {
					"pageNum": that.pageNo, //类型：Number  可有字段  备注：页码
					"pageSize": that.pageSize, //类型：Number  可有字段  备注：每页大小
					"title": that.activeName, //类型：String  可有字段  备注：标题
					"sdCreateTime": (Date.parse(that.dateValue[0])), //类型：Number  可有字段  备注：创建开始时间
					"edCreateTime": (Date.parse(that.dateValue[1])), //类型·：Number  可有字段  备注：创建结束时间
					"status": that.modelstatic //类型：String  可有字段  备注：状态
				}).then((res) => {
					if(res.data.code == '0') {
						this.loading = false;
						this.tableList = res.data.data.list;
						this.total = res.data.data.total;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			getBasics() {
				var that = this;
				this.axios.post('/activity/findBaseData.do', {})
					.then(function(res, req) {
						let dataList = res.data;
						if(dataList.code == 0) {
							that.projectState = dataList.data.status;
							that.links = dataList.data.type;
							//                  console.log(that.dataList);
						}
					}).catch(function(err) {

					})
			},
			openActive(id) {
				var that = this;
				this.axios.post('/activity/enable.do', {
						"id": id
					})
					.then(function(res, req) {
						let dataList = res.data;
						if(dataList.code == 0) {
							that.$Message.success(res.data.msg);
							that.getActivelist();
						} else {
							that.$Message.error(res.data.msg);
						}
					}).catch(function(err) {
						console.log(err);
					})
			},
			colseActive(id) {
				var that = this;
				this.axios.post('/activity/disable.do', {
						"id": id
					})
					.then(function(res, req) {
						let dataList = res.data;
						if(dataList.code == 0) {
							that.$Message.success(res.data.msg)
							that.getActivelist();
						} else {
							that.$Message.error(res.data.msg)
						}
					}).catch(function(err) {

					})
			},
			delActive(id, status) {
				if(status == '启用') {
					this.$Message.warning("启用状态下不可删除");
					return false;
				} else if(status == '禁用') {
					this.$Message.warning("禁用状态下不可删除");
					return false;
				}
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						var that = this;
						this.axios.post('/activity/deleteMarketingActivity.do', {
								"id": id
							})
							.then(function(res, req) {
								if(res.data.code == 0) {
									that.getActivelist();
									that.$Message.success(res.data.msg);
								} else {
									that.$Message.error(res.data.msg);
								}
							}).catch(function(err) {
								console.log(err);
							})
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});

			},

			handleFrontUpload(file) {
				if(!validateImageFile(file)) {
					return;
				}
				var _this = this;
				let formdata = new FormData();
				formdata.append('file', file, file.name);
				var option = {
					method: 'post',
					url: '/fileUpload.do',
					data: formdata
				}

				this.axios(option).then(function(response) {
					if(!response) {
						_this.$Message.error("错误");
						return;
					}
					let result = response.data;
					if(!result || !result.code || result.code != 0) {
						_this.$Message.error(result.msg);
						return;
					}
					if(result.code == 0) {
						_this.url = result.data.value;
						_this.$Message.success('上传成功');
						//                console.log(_this.url);
					}
				});
				return false;
			},
			changePage(page) {
				this.pageNo = page;
				this.getActivelist();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.getActivelist();
			},
			createActive() {
				this.showNew = true;
				this.activeTitle = ''; //类型：String  必有字段  备注：活动标题
				this.url = ''; //类型：String  必有字段  备注：活动图片
				this.activeCenter = ''; //类型：String  必有字段  备注：活动说明
				this.activeLink = ''; //类型：String  必有字段  备注：活动类型
				this.uri = ''; //类型：String  可有字段  备注：活动跳转地址
				this.btnTitle = ''; //类型：String  必有字段  备注：按钮上的显示值
				this.poptime = ''; //类型：String  必有字段  备注：弹屏周期
				this.popnum = ''; //类型：String  必有字段  备注：弹屏周期内的次数
				this.startTime = ''; //类型：Number  必有字段  备注：活动开始时间
				this.endTime = ''; //类型：Number  必有字段  备注：活动结束时间
				this.vgh5 = ''; //类型：String  可有字段  备注：第一级值
				this.taskname = ''; //类型：String  可有字段  备注：第二级值
				this.thisID = ''
			},
			//营销活动信息回显
			reActive(id) {
				this.activeDate = [];
				this.btnTitle = '';
				this.activeTitle = '';
				this.url = '';
				this.activeCenter = '';
				this.uri = '';
				this.poptime = '';
				this.popnum = '';
				this.showReset = true;
				this.thisID = id;
				var that = this;
				this.axios.post('/activity/findMarketingActivity.do', {
						"id": id
					})
					.then(function(res, req) {
						let dataList = res.data;
						if(dataList.code == 0) {
							dataList = dataList.data;
							that.activeTitle = dataList.title; //类型：String  必有字段  备注：活动标题
							that.url = dataList.photo; //类型：String  必有字段  备注：活动图片
							that.activeCenter = dataList.description; //类型：String  必有字段  备注：活动说明
							that.activeLink = dataList.type; //类型：String  必有字段  备注：活动类型
							that.uri = dataList.uri; //类型：String  可有字段  备注：活动跳转地址
							that.btnTitle = dataList.btnLabel; //类型：String  必有字段  备注：按钮上的显示值
							that.poptime = dataList.cycle; //类型：String  必有字段  备注：弹屏周期
							that.popnum = dataList.count; //类型：String  必有字段  备注：弹屏周期内的次数
							that.activeDate.push(that.formatDateTime(new Date(dataList.startTime)));
							that.activeDate.push(that.formatDateTime(new Date(dataList.endTime)));
							that.vgh5 = dataList.topValue; //类型：String  可有字段  备注：第一级值
							that.taskname = dataList.secondValue //类型：String  可有字段  备注：第二级值

						}
					}).catch(function(err) {

					})
			},
			newActive() {
				var that = this;
				this.axios.post('/activity/addMarketingActivity.do', {
						"title": that.activeTitle, //类型：String  必有字段  备注：活动标题
						"photo": that.url, //类型：String  必有字段  备注：活动图片
						"description": that.activeCenter, //类型：String  必有字段  备注：活动说明
						"type": that.activeLink, //类型：String  必有字段  备注：活动类型
						"uri": that.uri, //类型：String  可有字段  备注：活动跳转地址
						"btnLabel": that.btnTitle, //类型：String  必有字段  备注：按钮上的显示值
						"cycle": that.poptime, //类型：String  必有字段  备注：弹屏周期
						"count": that.popnum, //类型：String  必有字段  备注：弹屏周期内的次数
						"startTime": (Date.parse(that.activeDate[0])), //类型：Number  必有字段  备注：活动开始时间
						"endTime": (Date.parse(that.activeDate[1])), //类型：Number  必有字段  备注：活动结束时间
						"topValue": that.vgh5, //类型：String  可有字段  备注：第一级值
						"secondValue": that.taskname //类型：String  可有字段  备注：第二级值
					})
					.then(function(res, req) {
						let dataList = res.data;
						if(dataList.code == 0) {
							that.tableList = dataList.data.list;
							//                  console.log(that.tableList);
							that.$Message.success('新增成功');
						}
						that.showNew = false;
						that.getActivelist();
					}).catch(function(err) {

					})
			},
			//修改提交
			resetActive() {
				var that = this;
				this.axios.post('/activity/updateMarketingActivity.do', {
						"id": that.thisID,
						"title": that.activeTitle, //类型：String  必有字段  备注：活动标题
						"photo": that.url, //类型：String  必有字段  备注：活动图片
						"description": that.activeCenter, //类型：String  必有字段  备注：活动说明
						"type": that.activeLink, //类型：String  必有字段  备注：活动类型
						"uri": that.uri, //类型：String  可有字段  备注：活动跳转地址
						"btnLabel": that.btnTitle, //类型：String  必有字段  备注：按钮上的显示值
						"cycle": that.poptime, //类型：String  必有字段  备注：弹屏周期
						"count": that.popnum, //类型：String  必有字段  备注：弹屏周期内的次数
						"startTime": (Date.parse(that.activeDate[0])), //类型：Number  必有字段  备注：活动开始时间
						"endTime": (Date.parse(that.activeDate[1])), //类型：Number  必有字段  备注：活动结束时间
						"topValue": that.vgh5, //类型：String  可有字段  备注：第一级值
						"secondValue": that.taskname //类型：String  可有字段  备注：第二级值
					})
					.then(function(res, req) {
						let dataList = res.data;
						if(dataList.code == 0) {
							that.tableList = dataList.data.list;
							//                  console.log(that.tableList);
							that.$Message.success('修改成功');
						}
						that.showReset = false;
						that.getActivelist();
					}).catch(function(err) {

					})
			},
		}
	}
</script>
<style lang="scss" scoped="scoped">
	#marketact {
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
				margin-left: 26em;
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
				width: 17.5%;
			}
			.colmn3 {
				width: 15%;
			}
			.colmn4 {
				width: 17.5%;
			}
			.colmn5 {
				width: 17.5%;
			}
			.colmn6 {
				width: 17.5%;
			}
			.colmn7 {
				width: 15%;
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
				.checkLink {
					width: 50px;
					text-align: center;
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
		.overflow {
			
			.titleWap {
				margin: 0 30px;
			}
			.inputRow {
				margin: 20px 0;
				width: 400px;
				span {
					width: 150px;
					text-align: right;
					display: inline-block;
					vertical-align: middle;
				}
				textarea {
					vertical-align: middle;
				}
				.fileup {
					vertical-align: middle;
					position: relative;
					/*overflow: hidden;*/
					display: inline-block;
					.choose-file {
						display: flex;
						justify-content: center;
						flex-direction: column;
						align-items: center;
						width: 77px;
						height: 65px;
						background-color: #f2f2f2;
						color: #888;
						border-radius: 3px;
						border: 1px dotted #dbdbdb;
						font-size: 12px;
						cursor: pointer;
						i {
							font-size: 20px;
							color: #888;
						}
						span {
							text-align: center;
						}
					}
					.showImag {
						width: 80px;
						height: 80px;
						position: absolute;
						left: 0px;
						top: 0px;
						border-radius: 5px;
						img {
							border-radius: 5px;
							width: 100%;
							height: 80%;
						}
					}
				}
			}
			
		}
	}
</style>