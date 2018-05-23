<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建消息</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="overflow scroll">
				
				<div class="inputRow" style="margin-top: 35px;">
					<span>消息模板：</span>
					<!--<Select clearable v-model="work_model" class="select">
						<Option v-for="item in workinput" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>-->
					<input id="mechan1" v-model="model1id" type="hidden" value="">
					<input id="mechan1" v-model="arrival" type="hidden" value="">
					<input id="mechan1" v-model="isAsyn" type="hidden" value="">
					<input  type="text"  v-model="work_model" name="" @click="showDropList" @blur="onblur()" id="input1" value="" placeholder="请输入"/>
				      	<div class="baseNameLeft" v-if="showDrop">
				        	<p class="information-xs">选择消息模板</p>
					        <div class="zTreeDemoBackground left">
					          	<ul id="" class="">
					          		<li v-for="(item,$index) in tableList1">
					          			<div @click="checkall(item.id,item.arrival,item.isAsyn,item.title,item.message,item.sendTime)">{{item.title}}</div>
					          		</li>
					          	</ul>
					        </div>
							<!--分页插件-->
							<div id="page">
								<Page :total="result1.totalItem" show-elevator  @on-change="changePage1"
									 @on-page-size-change="changepagesize1"></Page>
							</div>
				      	</div>
				</div>
				<div class="inputRow">
					<span>信息标题<i style="color: red;">*</i>：</span>
					<input v-model="messaTitle" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="textareaRow">
					<span class="textAligin">信息内容：</span>
					<textarea v-model="messaText" class="textBox" placeholder="请输入"></textarea>
				</div>
				<div class="inputRow" style="margin-top: 10px;">
					<span>发送渠道：</span>
					<Select clearable v-model="work_model1" class="select">
						<Option v-for="item in workinput1" :value="item.name" :key="item.name">{{ item.value }}</Option>
					</Select>
				</div>
				<div class="inputRow"  v-if="work_model1=='getui'">
					<span>图片：</span>
					<input v-model="messaPic" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow"  v-if="work_model1=='getui'">
					<span>url：</span>
					<input v-model="messaUrl" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>发送类型<i style="color: red;">*</i>：</span>
					<Select clearable v-model="work_model2" class="select" @on-change="chooseSendKind()">
						<Option v-for="item in workinput2" :value="item.name" :key="item.name">{{ item.value }}</Option>
					</Select>
				</div>
				<div class="inputRow" v-if="work_model2=='company'||work_model2=='role'||work_model2=='organization'">
					<span>发送目标<i style="color: red;">*</i>：</span>
					<input v-model="messaTarg" type="text" @click="showDivList"  value="" placeholder="请输入" class="textInput" />
				      	<div class="baseNameLeft" v-show="showWork">
				        	<p class="information-xs">选择目标模板</p>
					        <div class="zTreeDemoBackground left">
					          	<ul id="" class="">
					          		<li v-for="(item,$index) in tableList">
					          			<span>
								            <Checkbox @on-change="singleCheckBox(item.id,item.name,$event)">
								            </Checkbox>
					          			</span>
					          			<div class="chenckName">{{item.name}}</div>
					          		</li>
					          	</ul>
					        </div>
							<!--分页插件-->
							<div id="page">
								<Page :total="sendTotalPagesize" show-elevator  @on-change="changePage2"
									 @on-page-size-change="changepagesize2"></Page>
							</div>
				      	</div>
				</div>
				<div class="inputRow" v-else-if="work_model2=='user'">
					<span>发送目标<i style="color: red;">*</i>：</span>
					<input v-model="check.stayList"  type="text" value="" placeholder="请输入" class="textInput" />
					<p style="color: red;padding-left: 75px;margin-top: 5px;">注意：多个发送目标用逗号隔开</p>
				</div>
				<div class="inputRow">
					<span>发送时间：</span>
					<Date-picker placement="top-start"  v-model="dateValue" :value="value2" type="datetime" placeholder="选择日期和时间" style="width: 200px"></Date-picker>
					<!--<Date-picker v-model="dateValue" :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>-->
				</div>
				<div class="bootom-button">
					<div class="middlBtnDefalt" @click="cancel">取消</div>
					<div class="middleBtn3" @click="release">发布</div>
					<!--<div class="middleBtn2" @click="save">保存</div>-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Tool from "../../getData/tool"
	export default {
		data() {
			return {
				showDrop:false,
				showWork: false,
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				value2: ['2016-01-01 00:00:00'],
				workinput: [],
				workinput1: [],
				workinput2: [],
				messaTitle:'',
				model1id:'',
				arrival:'',
				isAsyn:'',
				work_model:'',
				result1:{},
				tableList1: [],
		        check: {
		          	all: false,
		          	single: false,
		          	stayList: []
		        },
				sendTotalPagesize:0,
				tableList: [],
				SendpageSize: 10,
				Sendpage: 1,
				messaText:'',
				work_model1: '',
				messaPic:'',
				messaUrl:'',
				work_model2: '',
				messaTarg:[],
				work_model3: '',
				work_model4: '',
				dateValue:[]
			}
		},
		mounted() {
			this.searchModel();
			this.searchChannel();
			this.searchType();
			window.addEventListener('click', this.hiddenList);
		},
		methods: {
			//数据初始化
			initData(){
				this.messaTitle = "";
				this.model1id = "";
				this.arrival = "";
				this.isAsyn = "";
				this.work_model = "";
				this.messaText = "";
				this.work_model1 = "";
				this.messaPic = "";
				this.messaUrl = "";
				this.work_model2 = "";
				this.messaTarg = [];
				this.work_model3 = "";
				this.work_model4 = "";
				this.dateValue = "";
			},
			//消息模板获取
			searchModel() {
				var that = this;
				this.axios.post('/msg/listCustomTemplate.do', {
					"status":"1",
					"pageNum": this.page,
					"pageSize": this.pageSize,
				}).then((res) => {
					if(res.data.code=='0'){
						this.tableList1 = res.data.data.list;
					this.result1 = res.data.data;
              		this.result1.totalItem = res.data.data.total;
					}else{
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage1(page) {
				this.page = page;
				this.searchModel();
			},
			changepagesize1(pagesize) {
				this.pageSize = pagesize;
				this.searchModel();
			},
			//选择发送类型获取发送目标
			chooseSendKind(){
				var that = this;
				this.axios.post('/msg/getTargetValue.do',{
					pageSize:that.SendpageSize,
					pageNum:that.Sendpage,
					type:that.work_model2
				}).then((res)=>{
					if(res.data.code=='0'){
						this.tableList = res.data.data.list;
						this.sendTotalPagesize = res.data.data.total;
					}else{
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch((err)=>{
					console.log(err);
				})
			},
			
			changePage2(page) {
				this.Sendpage = page;
				this.chooseSendKind();
			},
			changepagesize2(pagesize) {
				this.SendpageSize = pagesize;
				this.chooseSendKind();
			},
		    singleCheckBox(id,name, event){
		        // 单选情况下
		        if (event) {
		          this.check.stayList.push(id);
		          console.log(this.check.stayList);
		          this.messaTarg.push(name);
		        } else {
		          let setId = this.check.stayList.indexOf(id);
		          this.check.stayList.splice(setId, 1);
		          
		          this.messaTarg.splice(setId, 1);
		          console.log(this.check.stayList);
		        }
		    },
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
		    },
			//发送渠道获取
			searchChannel() {
				var that = this;
				this.axios.post('/msg/findSenderList.do', {
				}).then((res) => {
					if(res.data.code=='0'){
						this.workinput1 = res.data.data.value;
					}else{
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			//发送类型
			searchType() {
				var that = this;
				this.axios.post('/msg/findTargetTypeList.do', {
				}).then((res) => {
					this.workinput2 = res.data.data.value;
				}).catch(function(err) {})
			},
			cancel() {
				this.$emit("cancel");
			},
			
			//消息发布 
			release() {
		        if (this.messaTitle==''||this.work_model2=='') {
		          this.$Message.info("请填写必填信息");
		          return false;
		        }
		        var that = this;
		        this.axios.post('/msg/sendMessage.do',{
		        	"title": that.messaTitle,
					"templateId":that.model1id,
					"arrival":that.arrival,
					"isAsyn":that.isAsyn,
					"message": that.messaText,
					"sender": that.work_model1,
					"imageUrl": that.messaPic,
					"linkUrl": that.messaUrl,
					"targetType": that.work_model2,
					"target": that.check.stayList.toString(),
					"fixedTime": Date.parse(that.dateValue)
		        }).then((res)=>{
		        	if(res.data.code=='0'){
		        		this.$Message.success(res.data.msg);
		        		this.$emit("cancel");
		        		this.$emit("searchMarket");
		        	}
		        	else{
		        		this.$Message.error(res.data.msg);
		        	}
		        }).catch((err)=>{
		        	console.log(err);
		        });
		       
			},
			//显示消息模板
			showDropList() {
				this.showDrop = true;
			},
			onblur(){
				setTimeout(()=>{
					this.showDrop = false;
				},100)
			},
			//显示发送目标模板
			showDivList() {
				setTimeout(()=>{
					this.showWork = true;
				},100)
			},
			hiddenList(){
				this.showWork = false;
			},
			checkall(s,v,g,n,f,d){
				this.showDrop = false;
				this.model1id = s;
				this.arrival = v;
				this.isAsyn = g;
				this.work_model = n;
				this.messaTitle = n;
				this.messaText = f;
				this.value2 = d;
//				this.dateValue.push(Tool.dateFormate(new Date(d),"yyyy-MM-dd HH-mm-ss"));
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow{
		height: 92%;
		overflow-y: auto;
		.inputRow{
			width: 400px;
			span{
				width: 70px;
				text-align: right;
				display: inline-block;
			}
		}
	}
	.Dialog {
		.headTitle{
			/*margin-bottom: 22px;*/
		}
		.inputRow {
			margin-bottom: 15px;
		}
		.middleBtn3 {
			margin: 0 auto;
			background: #108EE9;
		}
		.textareaRow {
			width: 306px;
			margin-left: 120px;
			margin-bottom: 2px;
			.textBox {
				height: 80px;
				width: 230px;
			}
			.textAligin {
				width: 70px;
				vertical-align: top;
				margin-top: 5px;
				text-align: right;
				display: inline-block;
			}
		}
		
		#input1{
			width: 230px;
			height: 27px;
		}
		  	.baseNameLeft {
		    	position: relative;
			    left: -100px;
    			width: 126%;
			    border: 1px solid #ccc;
			    height: 300px;
			    background: #fff;
			    z-index: 5;
		    	.baseNameSearch {
		      		width: 100%;
		      		padding: 10px;
		      		position: relative;
			      	input {
			        	width: 100%;
			        	color: #9fa9b2;
			      	}
			      	span {
			        	position: absolute;
			        	cursor: pointer;
			        	top: 13px;
			        	z-index: 2;
			        	right: 13px;
			      	}
			      	img {
			        	width: 22px;
			        	height: auto;
			      	}
		    	}
		      	.zTreeDemoBackground {
		      		height: 204px;
		      		overflow-y: scroll;
		      		margin-top: 12px;
		      		li{
		      			width: 100%;
		      			height: 20px;
		      			padding-left: 10px;
		      			div{
		      				width: 100%;
		      				height: 100%;
		      				cursor: pointer;
			      			&:hover{
			      				background: #ccc;
			      			}
		      			}
		      			span{
		      				display: inline-block;
		      				width: 30px;
		      				text-align: center;
		      				margin-top: -7px;
		      			}
		      			.chenckName{
		      				display: inline-block;
		      				width: 50%;
		      			}
		      		}
		      	}
			    p{
			      	width: 99.9%;
			      	line-height: 40px;
			      	text-align: center;
			      	background: rgb(244, 244, 244);
			      	border-bottom: 1px solid #ccc;
			    }
			    .baseNameAdd {
			      	position: absolute;
			      	width: 100%;
			      	bottom: 100px;
			      	text-align: center;
			      	span {
				        display: inline-block;
				        width: 70px;
				        line-height: 32px;
				        cursor: pointer;
				        background: #0a6fc1;
				        color: #fff;
				        border-radius: 5px;
				    }
				      span:nth-of-type(2){
				        margin-left: 10px;
				        background: #FF9933;
				        color: #fff;
				    }
			    }
			    #page {
				    width: 100%;
				    padding-left: 3%;
				    margin-top: 2px;
				}
		  	}
	}
</style>