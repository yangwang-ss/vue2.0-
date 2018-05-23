<template>
	<div id="marketing">
		<h4 class="h41" style="cursor: auto;">消息推送</h4>
		<div class="row">
			<span class="span1"><label for="input1">信息标题：</label><input class="inputText" v-model="messText" type="text" name="" id="input1" value="" placeholder="请输入"/>
			</span>
			<span id="Date-picker">
            	发送时间：<Date-picker v-model="dateValue" :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>
           </span>
		</div>
		<div class="row row2">
			<span class="span1">发送渠道：<Select clearable v-model="model2">
	               <Option v-for="item in projectState" :value="item.name" :key="item.name">{{ item.value }}</Option></Select>
			</span>
			<span class="span1"></span>
			
			<span class="buttonList">
			<span class="smallBtn1" @click="showWorkFrom">新建</span>
			<span class="smallBtn2" @click="searchMarket">搜索</span>
			<span class="smallBtnDefalt" @click="resetMarket">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">信息标题</td>
				<td class="colmn2">发送渠道</td>
				<td class="colmn3">发送时间</td>
				<!--<td class="colmn4">状态</td>-->
				<td class="colmn5">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td :title="item.title">{{item.title}}</td>
				<td>{{senders[$index]}}</td>
				<td>{{item.createTime ? computationsCallTime(item.createTime) : ""}}</td>
				<!--<td>已启用</td>-->
				<td class="check-more">
					<span @click="checkWorkDetail(item.id)">查看</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePage"
				 @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建消息-->
	    <v-bounces v-show="bouncesHide">
			<work-Message ref="newMessage" @searchMarket="searchMarket($event)" @cancel="cancel()"></work-Message>
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
	import workMessage from "@/views/messagement/workOrdermessage"
	import Tool from "../../getData/tool"
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
        		bouncesHide: false,
        		loading:true,
				showDrop: false,
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				value2: ['2016-01-01', '2016-02-15'],
				projectState: [],
				model2: '',
				dateValue: '',
				messText:'',
				senders:[]
			}
		},
		mounted() {
			this.searchChannel();
//			this.searchMarket();
			let _this=this;
			this.$nextTick(()=>{
				_this.searchMarket();
			});
		},
		components: {
			workMessage,
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
			
			//发送渠道获取
			searchChannel() {
				var that = this;
				this.axios.post('/msg/findSenderList.do', {
				}).then((res) => {
					console.log(res,"发送渠道");
					this.projectState = res.data.data.value;
				}).catch(function(err) {})
			},
			//项目搜索
			searchMarket() {
				var that = this;
				this.senders.splice(0, this.senders.length);
				this.axios.post('/msg/listMessageRecord.do', {
					"pageNum": that.page,
					"pageSize": that.pageSize,
					"title": that.messText,
					"sender": that.model2,
					"sdCreateTime": Date.parse(that.dateValue[0]),
            		"edCreateTime": Date.parse(that.dateValue[1])
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
						this.tableList = res.data.data.list;
					for(var dataCourse in this.tableList) {
			            for (var course in this.projectState) {
			                if (this.tableList[dataCourse].sender == this.projectState[course].name) {
			                	this.senders.push(this.projectState[course].value)
//			                    console.log(this.senders);
			                }
			            }
			       }
					this.result = res.data.data;
              		this.result.totalItems = res.data.data.total;
					}else{
						this.$Message.error(res.data.msg);
						this.loading = false;
						return false;
					}
					
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage(page) {
				this.page = page;
				this.searchMarket();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.searchMarket();
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd hh:mm:ss")
		    },
			//重置
			resetMarket() {
				var that = this;
				that.messText = '';
				that.dateValue = '';
				that.model2 = '';
			},
			//新建消息
			showWorkFrom(){
				this.bouncesHide = true;
				this.$refs.newMessage.initData();
			},
			//查看消息
			checkWorkDetail(id){
		        this.$router.push({
		          path: '/' + 'messagementsee',
		          query: {
		            id: id
		          }
		        })
			},
	      	popupShutDown(){
	        	// 关闭
	        	this.bouncesHide = false;
	      	},
	      	cancel(){
	        	this.bouncesHide = false;
	      	},
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
				margin-right: 50px;
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
					margin: 0 10px;
				}
			}
		}
		.row2{
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
				width: 30%;
			}
			.colmn2 {
				width: 30%;
			}
			.colmn3 {
				width: 30%;
			}
			/*.colmn4 {
				width: 10%;
			}*/
			.colmn5 {
				width: 10%;
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
				.checkLink {
					width: 50px;
					position: relative;
					&:after {
						content: "";
						display: block;
						width: 1px;
						height: 15px;
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
					right: 28px;
					top: 30px;
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
		
	}
	
</style>