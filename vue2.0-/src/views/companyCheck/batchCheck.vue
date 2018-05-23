<template>
	<div id="marketing">
		<h4 class="h41" style="cursor: auto;">批次审核</h4>
		<div class="row">
			<span class="span1">项目类型：<Select v-model="model2" clearable>
	               <Option v-for="item in projectState" :value="item.key" :key="item.key">{{ item.value }}</Option></Select>
			</span>
			<span id="Date-picker">
            	提交审核时间：<Date-picker :value="value2" v-model="dateValue" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>
           </span>
		</div>
		<div class="row row2">
			<span class="span1"><label for="input1">批次名称：</label><input class="inputText" v-model="batchname" type="text" name="" id="input1" value="" placeholder="请输入"/>
			</span>
			<span class="span1"></span>

			<span class="buttonList">
			<span class="smallBtn2" @click="search">搜索</span>
			<span class="smallBtnDefalt" @click="reset">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">批次编号</td>
				<td class="colmn2">用户名称</td>
				<td class="colmn3">批次名称</td>
				<td class="colmn4">项目类型</td>
				<td class="colmn5">提交审核时间</td>
				<td class="colmn6">批次状态</td>
				<td class="colmn7">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td :title="item.batchId">{{item.batchId}}</td>
				<td>{{item.companyName}}</td>
				<td>{{item.batchName}}</td>
				<td>{{convetWkind(item.projectType,projectState)}}</td>
				<td :title="computationsCallTime(item.createData)">{{computationsCallTime(item.createData)}}</td>
				<td v-if="item.batchStatus == 1">申请发布</td>
				<td v-if="item.batchStatus == 2">发布</td>
				<td v-if="item.batchStatus == 3">退回</td>
				<td class="check-more">
					<span @click="checkWorkDetail(item.batchId,item.applyId)">查看</span>
					<span v-if="item.batchStatus == 1" class="checkLink" @click="forbiden(item.batchId,item.applyId,2)">通过</span>
					<span v-if="item.batchStatus == 1" @click="forbiden(item.batchId,item.applyId,3)">拒绝</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePage"
				 @on-page-size-change="changepagesize"></Page>
		</div>
		<!--查看消息-->
	    <v-bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<info-Batch ref="batchInfo" @sumbit="sumbit($event)" @cancel="cancelno()"></info-Batch>
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
	import infoBatch from "@/views/companyCheck/batchinfo"
	import Tool from "../../getData/tool"
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading:true,
				i: -1,
				pageSize: 10,
				pageNo: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				model2: '',
				batchname: '',
				dateValue: '',
				projectType: 'projectType',
        		bouncesHide: false,
				value2: ['2016-01-01', '2016-02-15'],
				projectState: [],
				model2: '',
			}
		},
		mounted() {
			this.search();
			this.projectStatus();
		},
		components: {
			infoBatch,
      		"v-bounces": bounces
		},
	    watch: {
	      dateValue(v){
	        console.log(Date.parse(v[0]), "1");
	        console.log(Date.parse(v[1]), "2");
	      },
	      model2(v){
	      	console.log(v,"sss");
	      }
	    },
		methods: {
			//项目类型
			projectStatus() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectType //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					console.log(res,"项目类型");
					this.projectState = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			//项目搜索
			search() {
				var that = this;
				this.axios.post('/batchApply/listBatchApply.do', {
					"pageNo": that.page,
					"pageSize": that.pageSize,
					"projectType": that.model2,
					"batchName":that.batchname,
					"startDate": Date.parse(that.dateValue[0]),
            		"endDate": Date.parse(that.dateValue[1])
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
						this.tableList = res.data.data.result;
					this.result = res.data.data;
              		this.result.totalItems = res.data.data.totalItems;
					}else{
						this.$Message.error(res.data.msg)
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage(page) {
				this.page = page;
				this.search();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.search();
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd hh:mm:ss")
		    },
		    convetWkind(a,list){
				for(var i=0;i<list.length;i++){
					if (a==list[i].key) {
						return list[i].value;
					}
				}
			},
			//通过
			sumbit(e){
//				console.log(e.id,e.content,"你");
				this.axios.post('/batchApply/apply.action', {
						"batchId": e.content.batchId,
						"applyId": e.content.applyId,
						"status": e.content.status,
				}).then((res) => {
					console.log(res);
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
	        		this.bouncesHide = false;
				}).catch(function(err) {})
			},
			//重置
			reset() {
				var that = this;
				that.dateValue = '';
				that.model2 = '';
				that.batchname = '';
			},
			//查看消息
			checkWorkDetail(id,status){
				this.bouncesHide = true;
				this.$refs.batchInfo.checkWorkDetail(id,status);
			},
			//通过
			forbiden(id,applyid,statue){
				var that = this;
				this.i = -1;
				this.axios.post('/batchApply/apply.do', {
					"batchId": id,
					"applyId": applyid,
					"status": statue,
				}).then((res) =>{
//					console.log(res.data);
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err){
					let ss = err.data.msg;
					this.error(ss);
				})
			},
	      	popupShutDown(){
	        	// 关闭
	        	this.bouncesHide = false;
	      	},
	      	cancelno(){
	        	this.bouncesHide = false;
	      	}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#marketing {
		.row {
			margin-bottom: 25px;
			position: relative;
			.span1 {
				width: 300px;
				margin-right: 40px;
				display: inline-block;
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
					margin-right: 10px;
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
			}
			.colmn1 {
				width: 10%;
			}
			.colmn2 {
				width: 23%;
			}
			.colmn3 {
				width: 15%;
			}
			.colmn4 {
				width: 12%;
			}
			.colmn5 {
				width: 14%;
			}
			.colmn6 {
				width: 11%;
			}
			.colmn7 {
				width: 15%;
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
					z-index: 1;
					background: #fff;
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
