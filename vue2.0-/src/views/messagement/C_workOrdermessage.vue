<template>
	<div id="enterInfo">
		<div class="titleWap">
			<span class="h42" @click="viewJump()">消息推送/</span>
			<span class="h41" style="cursor: auto;">消息详情</span>
		</div>
		<!--企业列表-->
		<div class="h42" style="margin-bottom: 0;margin-left: 16px;">消息详情</div>
		<div class="infoty">
			<div class="div_con1" style="margin-left: 16px;">
				<span>信息标题：{{projectEnter.title}}</span>
				<span>发送渠道：{{projectEnter.sender=='lvxintong'?'短信':'个推'}}</span>
				<span>url：{{projectEnter.linkUrl}}</span>
			</div>
			<div class="div_con1">
				<span>发送类型：{{projectEnter.targetType}}</span>
				<span>发送时间：{{computationsCallTime(projectEnter.createTime)}}～{{computationsCallTime(projectEnter.createTime)}}</span>
			</div>
			<div class="div_con1">
				<span class="pic">图片：</span>
				<img :src="projectEnter.imageUrl ? projectEnter.imageUrl : ''" alt="" />
			</div>
			<div class="div_con1">
				<span>信息内容：{{projectEnter.message}}</span>
			</div>
			<table border="" cellspacing="0" cellpadding="0" id="tableForm">
				<tr class="trHeader">
					<td class="colmn1">信息标题</td>
					<td class="colmn2">发送目标</td>
					<td class="colmn3">发送状态</td>
				</tr>
				<tr v-for="(item,$index) in tableList">
					<td>{{item.title}}</td>
					<td>{{item.target}}</td>
					<td v-if="item.status == 'sending'">发送中</td>
					<td v-if="item.status == 'success'">发送成功</td>
					<td v-if="item.status == 'fail'">发送失败</td>
					<td v-if="item.status == 'abandon'">失败过多放弃</td>
				</tr>
			</table>
			<!--分页插件-->
			<div id="page">
				<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePage"
					 @on-page-size-change="changepagesize"></Page>
			</div>
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
	import Tool from "../../getData/tool"
	export default {
		data() {
			return {
				loading:true,
				showDrop:false,
				infoId:null,
				projectEnter:{},
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
			}
		},
		components: {
//			batchMessage,
		},
	    mounted(){
	    	this.infoId=this.$route.query.id;
	    	this.$nextTick(()=>{
	    		this.enterMessinfo();
	    	})
	    },
		methods: {
			//id查询消息详情
			enterMessinfo() {
				var that = this;
//	      		const pages=this.$route.query.page;
//	      		const pagesizes=this.$route.query.pageSize;
				this.axios.post('/msg/detailsMessageRecord.do', {
					"id":this.infoId,
					"self":true,
					"pageNum": this.page,
					"pageSize": this.pageSize,
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
						this.projectEnter = res.data.data.dataInfo;
					this.tableList = res.data.data.childList.list;
					this.result = res.data.data;
              		this.result.totalItems = res.data.data.childList.total;
					}else{
						this.$Message.error(res.data.msg);
					}
					
				}).catch(function(err) {
					console.log(err);
				})

			},
			enterMessinfos() {
				var that = this;
				this.axios.post('/msg/detailsMessageRecord.do', {
					"id":this.infoId,
					"self":false,
					"pageNum": this.page,
					"pageSize": this.pageSize,
				}).then((res) => {
					
					this.tableList = res.data.data.childList.list;
					this.result = res.data.data;
              		this.result.totalItems = res.data.data.childList.total;
				}).catch(function(err) {})
			},
			changePage(page) {
				this.page = page;
				this.enterMessinfos();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.enterMessinfos();
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
		    },
			//更多操作
			hideList() {
//				this.showDrop = false;
			},
		    viewJump(){
		        this.$router.push({
		          	path: "/messagement"
		        })
		    },
		},
	}
</script>

<style lang="scss" scoped="scoped">
	#enterInfo {
		.titleWap {
			margin-bottom: 15px;
			* {
				vertical-align: middle;
			}
		}
		.infoty{
			margin-top: 10px;
			position: relative;
			overflow: hidden;
			.div_con1{
				width: 23%;
				height: 100px;
				display: inline-block;
				float: left;
				margin-bottom: 20px;
				span{
					display: block;
					margin-top: 8px;
				}
				.pic{
					display: inline-block;
					position: relative;
					top: -85px;
				}
				img{
					display: inline-block;
					width: 170px;
					height: 100px;
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
				width: 33.3%;
			}
			.colmn2 {
				width: 33.3%;
			}
			.colmn3 {
				width: 33.3%;
			}
		}
	}
</style>