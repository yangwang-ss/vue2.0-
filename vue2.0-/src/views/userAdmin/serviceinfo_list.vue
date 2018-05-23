<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">工单详情</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<table border="" cellspacing="0" cellpadding="0" id="tableForm">
				<tr class="trHeader">
					<td class="colmn1">序号</td>
					<td class="colmn2">电话号码</td>
					<td class="colmn3">客户姓名</td>
					<td class="colmn4">状态</td>
					<td class="colmn5">操作</td>
				</tr>
				<tr v-for="(item,$index) in tableList">
					<td>{{item.jobId}}</td>
					<td>{{item.phoneNum}}</td>
					<td>{{item.customerName}}</td>
					<td>{{item.statusDicValue}}</td>
					<td class="check-more">
					          <audio class="audios" :id="item.jobId" controls="controls" preload controlsList="nodownload" ref="audio">
					            <source :src="item.url" type="audio/ogg">
					          </audio>
          					<span class="audioPlay" @click="audioPlay(item.jobId,$index)">试听</span>
					</td>
				</tr>
			</table>
			<!--分页插件-->
				<div id="page">
					<Page :total="result.totalItem" show-elevator show-sizer @on-change="changePage"
						 @on-page-size-change="changepagesize"></Page>
				</div>
		</div>
		
	</div>
</template>

<script>
	export default {
		props:["infoId"],
		data() {
			return {
				showUser: false,
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
        		audioId: "",
        		audioAttrId:"",
        		isPlaying:false,
        		audioArr:[]
			}
		},
		methods: {
			//项目信息
			showservicelists() {
				var that = this;
				this.axios.post('/mgr/detailsOutboundInfo.do', {
					"id":this.infoId?this.infoId:null,
					"pageNum": this.page,
					"pageSize": this.pageSize,
				}).then((res) => {
					console.log(res,"监控工单详情");
					this.tableList = res.data.data.result;
              		this.result.totalItem = res.data.data.totalItems;
					for(var dataCourse in this.tableList) {
		                this.audioArr.push(this.tableList[dataCourse].jobId)
			      	}
		                console.log(this.audioArr);
				}).catch(function(err) {})
			},
			changePage(page) {
				this.page = page;
				this.showservicelists();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.showservicelists();
			},
			cancel() {
				this.$emit("cancel");
			},
			audioPlay(id,i) {
		        this.audioId = document.getElementById(id);
		        console.log(this.audioId);
		        console.log($('audio')[0]);
		        this.audioAttrId = this.audioId.getAttribute("id");
//		        this.audioName = document.getElementsByClassName("audios");
		        for(var x in this.audioArr){
//		        	console.log(this.audioId.getAttribute("id"));
//					console.log(this.audioArr[x]);
//					console.log(this.audioAttrId);
//		        	alert(this.audioArr[x] == this.audioAttrId);
//			        if (this.audioId.paused) {
			        if (this.audioArr[x] == this.audioAttrId) {
			        	let _this = this;
	            		this.audioId.play();	
	            		this.audioId.parentNode.parentNode.previousSibling.lastElementChild.firstChild.pause();
//	            		this.audioId.parent().parent().siblings().find("audio").pause();
			        }
//			        else{
//			        	this.audioId.pause();
//			        }
		        }
			}
		},
		components:{
//			newEnter,
//			newService
		},
		mounted(){
			this.showservicelists();
			
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		min-width: 860px;
		min-height: 300px;
		overflow-y: scroll;
    	padding-bottom: 20px;
		.headTitle{
			margin-bottom: 22px;
		}
		/*******表单样式*******/
		#tableForm {
			width: 90%;
			border-collapse: collapse;
			border: 1px solid #E9E9E9;
			margin: 0 auto;
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
				width: 20%;
			}
			.colmn2 {
				width: 25%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 20%;
			}
			.colmn5 {
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
				audio{
					display: inline-block;
					width: 100px;
					/*height: 100px;*/
					/*background: red;*/
				}
				.checkLink {
					width: 60px;
					position: relative;
					&:before {
						content: "";
						display: block;
						width: 1px;
						height: 12px;
						left: 0;
						top: 3px;
						position: absolute;
						background: #E9E9E9;
					}
					&:after {
						content: "";
						display: block;
						width: 1px;
						height: 12px;
						right: 0;
						top: 3px;
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
					right: 23px;
					top: 35px;
					border-radius: 3px;
					position: absolute;
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
		#page {
		    width: 100%;
		    padding-left: 46%;
		    margin-top: 35px;
		}
	}
</style>