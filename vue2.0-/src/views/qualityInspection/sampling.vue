<template>
	<!--抽检-->
	<div class="sampling">
		<Row class="h42">
			<Col>
			<span style="cursor: auto;color: #5688de;">语音人工质检</span>
			</Col>
		</Row>
		<Row class="content-spacing">
			<Col span="8">
			<span class="information-xs">抽检账号：</span>
			<input type="text" placeholder="请输入账号" class="inputText" v-model="account">
			</Col>
			<Col span="8" offset="1">
			<span class="information-xs">抽检项目：</span>
			<input type="text" placeholder="请输入项目" class="inputText" v-model="samplingProjects">
			</Col>
			<Col span="6" offset="1">
			<span class="information-xs">抽检数量：</span>
			<input type="text" placeholder="请输入数量" class="inputText" v-model="samplingnumber" style="width: 150px;">
			</Col>
		</Row>
		<Row class="callDate">
			<Col span="8">
			<span class="information-xs">拨打时间：</span>
			<Date-picker type="daterange" format="yyyy-MM-dd HH:mm:ss" placement="bottom-start" v-model="callTime" placeholder="选择日期"></Date-picker>
			</Col>
			<Col span="6" offset="1">
			<span class="information-xs">通话时长：</span>
			<input type="text" placeholder="请输入" class="input-xs" v-model="minduration">
			<span class="name-xs">&nbsp;s&nbsp;~</span>
			<input type="text" placeholder="请输入" class="input-xs" v-model="maxduration">
			<span class="name-xs">&nbsp;s</span>
			</Col>
			<Col span="6" offset="1" style="text-align: right">
			<span class="smallBtn2 span" @click="gethandLing">抽检</span>
			<span class="smallBtnDefalt span" @click="resetting">重置</span>
			</Col>
		</Row>
		<Row class="table-content">
			<table class="table">
				<tr class="trHeader">
					<td class="colmn1">通话编号</td>
					<td class="colmn2">创建时间</td>
					<td class="colmn3">服务者账号</td>
					<td class="colmn4">项目名称</td>
					<td class="colmn5">通话时长</td>
					<td class="colmn6">类型</td>
					<td>操作</td>
				</tr>
				<tr v-for="(item,index) in tableArr" :key="item.id">
					<td>{{item.businessId ? item.businessId : ""}}</td>
					<td :title="timeFormat(item.createTime)">{{item.createTime ? timeFormat(item.createTime) : "暂无数据"}}</td>
					<td :title="item.serverAccount">{{item.serverAccount ? item.serverAccount : "暂无数据"}}</td>
					<td>{{item.projectName ? item.projectName : "暂无数据"}}</td>
					<td>{{item.talkTime ? computationsTalkTime(item.talkTime) : "暂无数据"}}</td>
					<td>{{projectKConvert(item.type,proKind)}}</td>
					<td  class="check-more" v-if="item.jobId"><span @click="viewJump(item.jobId)">查看</span></td>
					<td v-else>暂不能操作</td>
				</tr>
			</table>
		</Row>
		<div id="page">
			<Page :total="totalpageSize"  show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
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
				account:'',//抽检账号
				samplingProjects:'',//抽检项目
				samplingnumber:'',//抽检数量
				callTime:'',//拨打时间
				minduration: "",//通话时长
				maxduration: "",//通话时长
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				tableArr:[],
				proKind: [] //项目类型
			}
		},
		methods: {
			//抽检
			gethandLing() {
				let that = this;
				this.axios.post("appeal/appealList/2.do", {
					"pageNo": that.page,
					"pageSize": that.pageSize,
					"projectName": that.samplingProjects,
					"userAccount": that.account,
					"cjnum": that.samplingnumber,
					"minduration":that.minduration,
					"maxduration": that.maxduration,
					"startDate": Date.parse(that.callTime[0]),
					"endDate": Date.parse(that.callTime[1])
				}).then((res) => {
					if(res.data.code === '0') {
						this.totalpageSize = res.data.data.totalItems;
						this.tableArr = res.data.data.result;
						this.loading = false;
					}else{
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err, "no是你吗")
})
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
			//类型
			projectKinds() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": 'projectType' //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.proKind = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			projectKConvert(type, list) {
				for(var i = 0; i < this.proKind.length; i++) {
					if(type == list[i].key) {
						return list[i].value;
					}
				}
			},
			resetting() {
				// 重置
				this.account = "";
				this.samplingProjects = "";
				this.samplingnumber = "";
				this.minduration = "";
				this.maxduration = "";
				this.callTime = "";
			},
			viewJump(item) {
				this.$router.push({
					path: "/speechPeopleQualityDetail",
					query: {
						jobId: item,
						name: "sampling"
					}
				})
			}
		},
		mounted() {
			this.gethandLing();
			//项目类型
			this.projectKinds();
		}
	}
</script>
<style lang="scss">
	.content-spacing {
		padding-bottom: 30px !important;
	}
	.ivu-row{
		white-space: nowrap;
	}
	.input-xs {
		height: 27px;
		width: 58px;
	}
	
	.smallBtn2 {
		margin-right: 10px;
	}
	
	.callDate .ivu-input-wrapper {
		width: 230px !important;
	}
	
	.span {
		display: inline-block;
		text-align: center;
	}
	
	.co {
		color: #ccc;
	}
	
	.table-content {
		margin-top: 40px;
		.colmn1{
			width: 10%;
		}
		.colmn2{
			width: 20%;
		}
		.colmn3{
			width: 15%;
		}
		.colmn4{
			width: 15%;
		}
		.colmn5{
			width: 15%;
		}
		.colmn6{
			width: 7%;
		}
		
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