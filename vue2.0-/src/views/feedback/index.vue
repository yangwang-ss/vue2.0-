<template>
	<!--意见反馈-->
	<div class="sampling" @click.self="moreStatus=null;status=false">
		<h4 class="h41" style="cursor: auto;">意见反馈</h4>
		<Row class="content-spacing">
			<Col span="8">
			<span>反馈账号：</span>
			<input type="text" placeholder="请输入账号" class="inputText" v-model="feedback.account"></Col>
			</Col>
			<Col span="8" offset="1">
			
			<span style="width:60px;display: inline-block;text-align: right;">渠道：</span>
			
			<Select v-model="channel.model">
				<Option v-for="item in channel.list" :value="item.key" :key="item.key">{{item.value}}</Option>
			</Select>
			</Col>
		</Row>
		<Row>
			<Col span="8">
			
				<span>处理状态：</span>
			<Select v-model="handling.status">
				<Option v-for="item in handling.list" :key="item.key" :value="item.key">{{item.value}}</Option>
			</Select>
			</Col>
			<Col span="10" offset="1">
			
				<span>反馈时间：</span>
			
			<Date-picker type="daterange" format="yyyy-MM-dd HH:mm" placement="bottom-start" v-model="callTime" placeholder="选择日期"></Date-picker>
			</Col>
			</Col>
			<Col span="5">
			<span class="smallBtn2" @click="search()">搜索</span>
			<span class="smallBtnDefalt" @click="resetting()" style="margin-left: 15px;">重置</span>
			</Col>
		</Row>
		<div style="width: 100%;overflow: scroll;">
			<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">反馈编号</td>
				<td class="colmn2">渠道</td>
				<td class="colmn3">反馈账号</td>
				<td class="colmn4">联系电话</td>
				<td class="colmn5">反馈时间</td>
				<td class="colmn6">处理状态</td>
				<td class="colmn7">操作</td>
			</tr>
			<tr v-for="(item,index) in table.data" :key="item.id">
				<td>{{item.id ? item.id : "暂无数据"}}</td>
				<td>{{item.source ? sourceType(item.source) : "移动端"}}</td>
				<td :title="item.userid">{{item.userid ? item.userid : "暂无数据"}}</td>
				<td>{{item.userPhone ? item.userPhone : "暂无数据"}}</td>
				<td>{{item.createtime ? computationsCallTime(item.createtime) : "暂无数据"}}</td>
				<td>{{item.status ? handlingStatus(item.status) : "未处理"}}</td>
				<td class="check-more">
					<span @click="view(item.id,0)">查看</span>
					<span class="fill" v-if="item.status===1">填充</span>
					<span @click="view(item.id,1)" v-if="item.status===0" class="checkLink">处理</span>
				</td>
			</tr>
		</table>
		</div>
		<div id="page">
			<Page :total="table.total" :page-size="table.pageSize" @on-page-size-change="pageSizeToggle($event)" show-sizer show-elevator @on-change="pageToggle($event)"></Page>
		</div>
		<v-feedbackParticulars v-show="bouncesHide" @emitClickPopup="bouncesHide=false" :partList="partList" @submit="submit($event)" @down="down()" :toggle="toggle" @shutDown="bouncesHide=false"></v-feedbackParticulars>
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
	import feedbackParticulars from "./feedbackParticulars";
	export default {
		data() {
			return {
				loading:true,
				partList: {
					id: null,
					source: null,
					userid: null,
					userPhone: null,
					createtime: null,
					info: null
				},
				toggle: false,
				bouncesHide: false,
				moreStatus: null,
				status: false,
				feedback: {
					account: null
				},
				channel: {
					list: [{
							value: "网页",
							key: "1"
						},
						{
							value: "微信",
							key: "2"
						},
						{
							value: "移动端",
							key: "3"
						}
					],
					model: null
				},
				handling: {
					status: null,
					list: [{
							value: "未处理",
							key: "0"
						},
						{
							value: "已处理",
							key: "1"
						}
					]
				},
				callTime: "",
				table: {
					data: [{
						businessId: "",
						createTime: "",
						serverAccount: "",
						projectName: "",
						talkTime: "",
						type: "",
						id: "1"
					}],
					total: null,
					currentPage: 1,
					pageSize: 10,
				}
			}
		},
		components: {
			"v-feedbackParticulars": feedbackParticulars
		},
		methods: {
			getDefaultLoade() {
				// 默认加载请求
				this.axios.post("/feedBack/list.do", {
					"pageNo": this.table.currentPage,
					"pageSize": this.table.pageSize,
					"userid": this.feedback.account ? this.feedback.account : null, // 反馈账号
					"status": this.handling.status ? this.handling.status : null, // 信息状态
					"beginTime": this.callTime ? Date.parse(this.callTime[0]) : null, // 开始时间
					"endTime": this.callTime ? Date.parse(this.callTime[1]) : null, // 结束时间
					"source": this.channel.model ? this.channel.model : null // 渠道
				}).then((res) => {
					if(res.data.code === "0") {
						this.loading = false;
						this.table.total = res.data.data.totalItems;
						this.table.data = res.data.data.result;
					}
					else{
						this.$Message.error(res.data.msg);
						this.loading = false;
						return false;
					}
					
				}).catch((err) => {
					console.log(err)
				})
			},
			pageToggle(e) {
				this.table.currentPage = e;
				this.getDefaultLoade();
			},
			pageSizeToggle(e) {
				this.table.pageSize = e;
				this.getDefaultLoade();
			},
			computationsCallTime(date) {
				return Tool.dateFormate(new Date(date), "yyyy-MM-dd mm:ss")
			},
			search() {
				// 搜索
				this.getDefaultLoade()
			},
			handlingStatus(type) {
				console.log(type, "q")
				switch(type) {
					case 1:
						{
							return "已处理";
						}
					default:
						{
							return "未处理";
						}
				}
			},
			sourceType(type) {
				switch(type) {
					case "1":
						{
							return "网页"
						}
					case "2":
						{
							return "微信"
						}
					default:
						{
							return "移动端"
						}
				}
			},
			resetting() {
				// 重置
				this.feedback.account = "";
				this.handling.status = "";
				this.callTime = "";
				this.channel.model = "";
			},
			submit(e) {
				this.bouncesHide = false;
				this.axios.post("/feedBack/modifyOpinion/" + e.id + ".do", {
					"handlingOpinion": e.handlingOpinion
				}).then((res) => {
					if(res.data.code === "0") {
						this.getDefaultLoade();
					}
					console.log(res, "asa")
				}).catch((err) => {
					console.log(err, "no是你吗")
				})
			},
			down() {
				this.bouncesHide = false;
			},
			view(id, index) {
				// 查看-处理
				switch(index) {
					case 0:
						{
							this.toggle = false;
							break
						}
					case 1:
						{
							this.toggle = true;
							break;
						}
				}
				this.bouncesHide = true;
				this.axios.post("/feedBack/detail/" + id + ".do").then((res) => {
					if(res.data.code === "0") {
						this.partList = res.data.data;
					}
					console.log(res, "asa")
				}).catch((err) => {
					console.log(err, "no是你吗")
				})

			}
		},
		mounted() {
			this.getDefaultLoade();
		}
	}
</script>
<style lang="scss" scoped>
	.information-xs {
		line-height: 27px;
	}
	
	.content-spacing {
		padding-bottom: 20px;
		white-space: nowrap;
	}
	.ivu-row{
		white-space: nowrap;
	}
	.fill {
		opacity: 0;
		cursor: default;
	}
	
	span {
		display: inline-block;
		text-align: center;
	}
	
	.co {
		color: #ccc;
	}
	
	#tableForm {
		margin-top: 35px;
		border-collapse: collapse;
		border: 1px solid #E9E9E9;
		.trHeader {
			width: 100%;
			td {
				background: #F4F4F4;
				white-space: nowrap;
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
			width: 10%;
		}
		.colmn2 {
			width: 8%;
		}
		.colmn3 {
			width: 22%;
		}
		.colmn4 {
			width: 12%;
		}
		.colmn5 {
			width: 15%;
		}
		.colmn6 {
			width: 10%;
		}
		.colmn7 {
			width: 15%;
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
				.checkLink:after{
					content: '';
					width: 0;
				}
			}
	}
</style>