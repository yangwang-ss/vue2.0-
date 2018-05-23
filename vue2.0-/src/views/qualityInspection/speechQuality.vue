<template>
	<div id="imgLable">
		<h4 class="h41" style="cursor: auto;">语音标注人工质检</h4>
		<div class="row">
			<span class="span1"><label for="input1">项目名称：</label><input type="text" name="" id="input1" value="" placeholder="请输入" class="inputText" v-model="projectName"/></span>
			<span id="Date-picker" class="span1">
            	完成时间：<Date-picker  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
           </span>
		</div>
		<div class="row row2">
			<span class="span1">质检状态：<Select v-model="qualityStatus" clearable>
               <Option v-for="item in qualityList" :value="item.key" :key="item.key">{{ item.value}}</Option></Select>
			</span>
			<span class="span1">工作类型：<Select v-model="workinds"  clearable>
               <Option v-for="item in workKindList" :value="item.key" :key="item.key">{{ item.value }}</Option>
           </Select>
			</span>
			<span class="buttonList">
			<span class="smallBtn2" @click="imgtableList">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">任务编号</td>
				<td class="colmn2">项目名称</td>
				<td class="colmn3">完成时间</td>
				<td class="colmn4">类型</td>
				<td class="colmn5">质检状态</td>
				<td>操作</td>
			</tr>
			<tr v-for="item in imgTableList">
				<td class="colmn1">{{item.id}}</td>
				<td class="colmn2">{{item.projectName}}</td>
				<td class="colmn3">{{item.completeDate?timeFormat(item.completeDate):"暂无数据"}}</td>
				<td class="colmn4">{{convetWkind(item.type,workKindList)}}</td>
				<td class="colmn5">{{convetWkind(item.status,qualityList)}}</td>
				<td class="check-more" @click="jumpRouter(item.id,item.batchId,item.type,item.projectName)">查看</td>
			</tr>
		</table>
		<!--分页插件-->
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
				loading:false,
				projectName: '', //项目名称
				qualityStatus: '', //质检状态
				imgTableList: [], //图片列表
				qualityList: [], //质检状态
				dateValue: [], //完成时间
				workinds: '', //工作类型
				workKindList: [], //工作类型
				pageSize: 10,
				pageNo: 1,
				totalpageSize: 0
			}
		},
		beforeMount() {
			this.loading = true;
		},
		mounted() {
			//图片标注列表搜索
			this.imgtableList();
			//质检状态
			this.qualityState();
			//工作类型
			this.workKind();
			setTimeout(() => {
				this.loading = false;
			}, 1000);
		},
		methods: {
			//重置
			resetData() {
				this.projectName = '';
				this.dateValue = [];
				this.qualityStatus = '';
				this.workinds = '';
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			//质检状态
			qualityState(){
				this.axios.post('/dictionary/searchParameterByName.do',{
					name:'InstStatus'
				}).then((res)=>{
					if(res.data.code==0){
						this.qualityList = res.data.data.value;
					}
				}).catch((err)=>{
					console.log(err);
				});
			},
			convetWkind(a,list){
				for(var i=0;i<list.length;i++){
					if (a==list[i].key) {
						return list[i].value;
					}
				}
			},
			//工作类型
			workKind(){
				this.axios.post('/dictionary/searchParameterByName.do',{
					name:'projectType'
				}).then((res)=>{
					if(res.data.code==0){
						this.workKindList = res.data.data.value;
					}
				}).catch((err)=>{
					console.log(err);
				});
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
			//查看
			jumpRouter(id, batchid,type,name) {
				this.$router.push({
					name: 'speechQualityDetail',
					query: {
						instId: id,
						batchId: batchid,
						proJectType:type,
						projectName:name
					}
				})
			},
			//图片标注列表搜索
			imgtableList() {
				var that = this;
				this.axios.post('appeal/appealList/5.do', {
					"projectName":that.projectName,
					"pageNo": that.pageNo,
					"pageSize": that.pageSize,
					"status": that.qualityStatus,
					"type": that.workinds,
					"startDate": Date.parse(that.dateValue[0]),
					"endDate": Date.parse(that.dateValue[1])
				}).then((res) => {
					if(res.data.code == 0) {
						this.imgTableList = res.data.data.result;
						this.totalpageSize = res.data.data.totalItems;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch((res) => {
					console.log(res);
				});
			},
			changePage(page) {
				this.pageNo = page;
				this.imgtableList();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.imgtableList();
			}

		}
	}
</script>

<style lang="scss" scoped="scoped">
	#imgLable {
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
			.colmn1 {
				width: 25%;
			}
			.colmn2 {
				width: 25%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 10%;
			}
			.colmn5 {
				width: 10%;
			}
			.check-more {
				color: #108EE9;
				cursor: pointer;
			}
		}
	}
</style>