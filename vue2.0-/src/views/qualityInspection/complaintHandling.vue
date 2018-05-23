<template>
	<!--申诉处理-->
	<div class="main">
		<Row class="main-header h42">
			<Col>
			<span style="cursor: auto;color: #5688de;">申诉处理</span>
			</Col>
		</Row>
		<Row class="main-content">
			<Col span="19">
			<Col span="10">
			<span class="information-xs">项目名称：</span>
			<input placeholder="请输入名称" class="inputText" v-model="projectName">
			</Col>
			<Col span="12" offset="2">
			<span>用户账号：</span>
			<input placeholder="请输入账号" class="inputText" v-model="usersAccountNumber">
			</Col>
			<Col span="24" class="callDate">
			<span class="information-xs">拨打时间：</span>
			<Date-picker type="daterange" format="yyyy-MM-dd HH:mm" placement="bottom-start" v-model="callTime" placeholder="选择日期"></Date-picker>
			</Col>

			</Col>
			<Col span="5" class="bottomBTn">
			<span class="smallBtn2" @click="gethandLing">搜索</span>
			<span class="smallBtnDefalt" @click="resetting">重置</span>
			</Col>
		</Row>
		<Row class="table-content">
			<table class="table">
				<tr class="trHeader">
					<td>申诉编号</td>
					<td>拨打时间</td>
					<td>服务者账号</td>
					<td>项目名称</td>
					<td>通话时长</td>
					<td>操作</td>
				</tr>
				<tr v-for="(item,index) in tableArr" :key="item.id">
					<td>{{item.appealNumber ? item.appealNumber : "暂无数据"}}</td>
					<td>{{item.callTIme ? timeFormat(item.callTIme) : "暂无数据"}}</td>
					<td>{{item.serverAccount ? item.serverAccount : "暂无数据"}}</td>
					<td>{{item.projectName ? item.projectName : "暂无数据"}}</td>
					<td>{{item.talkTime ? computationsTalkTime(item.talkTime) : "暂无数据"}}</td>
					<td class="check-more" v-if="item.jobId"><span @click="viewJump(index,item.jobId)">查看</span></td>
					<td v-else>暂不能操作</td>
				</tr>
			</table>
		</Row>
		<div id="page">
			<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
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
	export default {
		data() {
			return {
				loading:true,
				projectName: null,
				usersAccountNumber: null,
				callTime: [],
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				tableArr:[]
			}
		},
		methods: {
			gethandLing() {
				var that = this;
				this.axios.post("appeal/appealList/1.do", {
					"pageNo": that.page,
					"pageSize": that.pageSize,
					"projectName": that.projectName,
					"userAccount": that.usersAccountNumber,
					"startDate": Date.parse(that.callTime[0]),
					"endDate": Date.parse(that.callTime[1])
				}).then((res) => {
					if(res.data.code === "0") {
						this.totalpageSize = res.data.data.totalItems;
						this.tableArr = res.data.data.result;
						this.loading=false;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err, "no是你吗")
				})
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
			computationsTalkTime(time) {
				let s = "";
				let hour = Math.floor(time / 3600);
				let min = Math.floor(time / 60) % 60;
				let sec = time % 60;
				s = hour + "时" + min + "分" + sec + "秒";
				return s;
			},
			changePage(page) {
				this.page = page;
				this.gethandLing();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.gethandLing();
			},
			totalpageSizes(totalpageSize) {
				this.totalpageSize = totalpageSize;
				this.gethandLing();
			},
			viewJump(index, item) {
				// 跳转
				this.$router.push({
					path: "/viewParticulars",
					query: {
						jobId: item,
						name: "complaintHandling"
					}
				})
			},
			resetting() {
				// 重置
				this.projectName = "";
				this.usersAccountNumber = "";
				this.callTime = "";
			}
		},
		mounted() {
			this.gethandLing();
		}
	}
</script>
<style lang="scss">
	.main {
		width: 100%;
	}
	.bottomBTn{
		*{
			vertical-align: top;
		}
	}
	.main-content {
		.callDate {
			margin-top: 25px;
			.ivu-input-wrapper {
				width: 230px !important;
			}
		}
		span {
			display: inline-block;
			text-align: center;
			font-size: 14px;
		}
		.smallBtn2 {
			margin-right: 10px;
		}
	}
	
	.table-content {
		margin-top: 40px;
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
	}
</style>