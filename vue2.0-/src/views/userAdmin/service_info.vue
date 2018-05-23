<template>
	<div id="enterInfo">
		<div class="titleWap">
			<span class="h42" @click="viewJump()">用户管理/</span>
			<!--<span style="font-size: 20px;font-weight: bold;">/</span>-->
			<span class="h41" style="cursor: auto;">{{infoName}}</span>
		</div>
		<div class="infoty">
			<div class="h42">基本信息</div>
			<ul class="enter_pei">
				<li class="li_img">
					<div><span class="en_span1">头像：</span><span><img :src="projectUser.photo ? projectUser.photo : '../../../static/img/train/voice.jpg'" alt="" /></span></div>
				</li>
				<li>
					<div><span>手机号：</span><span>{{projectUser.phoneNumber}}</span></div>
				</li>
				<li>
					<div><span>昵称：</span><span>{{projectUser.nickName}}</span></div>
				</li>
				<li>
					<div><span>性别：</span>
						<span v-if="projectUser.gender ==0">女</span>
						<span v-if="projectUser.gender ==1">男</span>
						<span v-if="projectUser.gender ==2">保密</span>
					</div>
				</li>
				<li>
					<div><span>生日：</span><span>{{projectUser.birthday ? computationsCallTime(projectUser.birthday) : ""}}</span></div>
				</li>
			</ul>
		</div>
		<div class="infoty">
			<div class="h42">实名认证</div>
			<div class="in_name">
				<span class="adopt" v-if="projectUser.status == 2">
					<img src="../../../static/img/tgimg.png" alt="" />已通过实名认证服务者
					<a @click="confirm(1)">实名认证状态解除</a>
				</span>
				<!--<span class="no_adopt" v-if="projectUser.status == 0 || 1">-->
				<span class="no_adopt" v-else>
					<img src="../../../static/img/ntgimg.png" alt="" />未通过实名认证服务者
				</span>
			</div>
		</div>
		<div class="infoty">
			<div class="h42">技能</div>
			<div class="marks">
				<span class="span1">技能：</span>
				<span class="spanStx">{{serList}}</span>
			</div>
		</div>
		<div class="infoty">
			<div class="h42">培训监控</div>
				<table border="" cellspacing="0" cellpadding="0" id="tableForm">
					<tr class="trHeader">
						<td class="colmn1">培训名称</td>
						<td class="colmn2">状态</td>
						<td class="colmn3">通过时间</td>
						<td class="colmn4">操作</td>
					</tr>
					<tr v-for="(item,$index) in motertableList">
						<td>{{item.trainName}}</td>
						<!--<td v-if="item.status=='2'">不通过</td>-->
						<!--<td v-if="item.status=='1'">通过</td>-->
						<!--<td v-if="item.status=='3'">审核中</td>-->
						<td>{{item.status ? stateType(item.status) : "暂无数据"}}</td>
						<td>{{item.passDate ? computationsCallTime(item.passDate) : ""}}</td>
						<td class="check-more">
							<span class="rightMore">
								<span @click="enablementAndDisable(item.trainId,item.userTrainId,item.status)">{{item.status ? statusType(item.status) : "暂无数据"}}</span>
								<!--<span v-if="item.status=='1'" @click="forbiden(item.trainId,item.userTrainId,item.status)">不通过</span>-->
							</span>
						</td>
					</tr>
				</table>
				<!--分页插件-->
				<div id="page">
					<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePages"
						 @on-page-size-change="changepagesizes"></Page>
				</div>
		</div>
		<!--表单-->
		<div class="infoty">
			<div class="h42">状态监控</div>
				<table border="" cellspacing="0" cellpadding="0" id="tableForm">
					<tr class="trHeader">
						<td class="colmn1">任务名称</td>
						<td class="colmn2">状态</td>
						<td class="colmn3">任务时间</td>
						<td class="colmn4">操作</td>
					</tr>
					<tr v-for="(item,$index) in tableList">
						<td>{{item.batchName}}</td>
						<td v-if="item.status==0">待上岗</td>
						<td v-if="item.status==1">执行中</td>
						<td v-if="item.status==2">验收中</td>
						<td v-if="item.status==3">申诉</td>
						<td v-if="item.status==4">结算完成</td>
						<td v-if="item.status==5">已完结</td>
						<td>{{computationsCallTime(item.createTime)}}～{{computationsCallTime(item.taskEndTime)}}</td>
						<td class="check-more">
							<span @click="moreSerList(item.id,item.type)">查看</span>
						</td>
					</tr>
				</table>
				<!--分页插件-->
				<div id="page">
					<Page :total="result.totalItem" show-elevator show-sizer @on-change="changePage"
						 @on-page-size-change="changepagesize"></Page>
				</div>
		</div>
		<!--查看工单详情-->
	    <v-bounces v-if="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-servicelist 
				:infoId="infoIds"
				ref="showServicelist"  @cancel="cancel()"></new-servicelist>
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
	import newServicelist from "@/views/userAdmin/serviceinfo_list"
	import Tool from "../../getData/tool"
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading:true,
				infoIds:null,
				bouncesHide: false,
				infoId:null,
				infoName:null,
				infopageSize: 10,
				infopage: 1,
				showDrop:false,
				projectSerce:{},
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				projectUser:{},
				tableList: [],
				motertableList: [],
                multiple: true,
                serList:'',
				baseData:[],
                treeFields:[
                  {field:'label',map:'title'},
                  {field:'children',map:'children'}
                ],
			}
		},
		components: {
			newServicelist,
      		"v-bounces": bounces
		},
	    mounted(){
	    	this.skillList();
	    	this.infoId=this.$route.query.id;
	    	this.infoName = this.$route.query.name;
	    	this.$nextTick(()=>{
	    		this.serceMessinfo();
	    		this.monitorInfo();
	    	});
	    },
	    activated(){
	   		this.infoId=this.$route.query.id;
	    },
	    watch:{
	   		"infoId"(){
	   			this.serceMessinfo();
	   			this.monitorInfo();
	   		},
		    model10(v){
		      	console.log(v,"model10");
		    },
	   },
		methods: {
			//查询技能
			skillList() {
				var that = this;
				this.axios.post('/enterprise/getUserSkillForSkillList.do', {
					"userId":this.infoId,
				}).then((res) => {
					this.baseData = res.data.data.result;
					this.serList = res.data.data.userSkill;
					console.log(res,"查询技能成功");
				}).catch(function(err) {})
			},
			//id查询服务者信息
			serceMessinfo() {
				var that = this;
//	      		const pages=this.$route.query.page;
//	      		const pagesizes=this.$route.query.pageSize;
				this.axios.post('/mgr/detailsPersonInfo.do', {
					"personId":this.infoId,
					"pageNum": this.page,
					"pageSize": this.pageSize,
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
					this.projectUser = res.data.data.user;
					this.tableList = res.data.data.inst.result;
              		this.result.totalItem = res.data.data.inst.totalItems;
					}else{
						this.$Message.error(res.data.msg)
					}
					
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage(page) {
				this.page = page;
				this.serceMessinfo();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.serceMessinfo();
			},
			setDefaultDataTree(ids,ref){
                this.$refs[ref].setDefaultValue(ids);
            },
			//id查询培训监控
			monitorInfo(id,type) {
				var that = this;
				this.axios.post('/train/queryPersonalTrainList.do', {
					"userId":this.infoId,
					"pageNo": this.page,
					"pageSize": this.pageSize,
				}).then((res) => {
//					console.log(res,"查询培训监控列表信息成功");
					this.motertableList = res.data.data.result;
              		this.result.totalItems = res.data.data.totalItems;
				}).catch(function(err) {})
			},
			changePages(page) {
				this.page = page;
				this.monitorInfo();
			},
			changepagesizes(pagesize) {
				this.pageSize = pagesize;
				this.monitorInfo();
			},
			//通过
			forbiden(id,userid,type){
				var that = this;
				this.axios.post('/train/updateServantTrainStatus.do', {
					"trainId": id,
					"userTrainId": userid,
					"status": type,
				}).then((res) =>{
//					console.log(res.data);
					this.monitorInfo();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err){
					let ss = err.data.msg;
					this.error(ss);
				})
			},
	      	enablementAndDisable(id,userid,type){
	          	// 通过-不通过
		        let status;
		        if (type === "1") {
		          	status = "2";
		        } else if(type === "2"){
		          	status = "1"
		        }
	        	this.forbiden(id,userid,status)
	      	},
		    statusType(type){
		        // 状态1
		        switch (type) {
		          	case "1": {
		            	return "不通过"
		          	}
		          	case "2": {
		            	return "通过"
		          	}
		        }
		    },
	      	stateType(type){
		        // 状态2
		        switch (type) {
		          	case "2": {
		            	return "不通过"
		          	}
		          	case "1": {
		            	return "通过"
		          	}
		        }
	      	},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
		    },
	      	popupShutDown(){
	        	// 关闭
	        	this.bouncesHide = false;
	      	},
	      	cancel(){
	        	this.bouncesHide = false;
				this.serceMessinfo();
	      	},
		    viewJump(){
		        this.$router.push({
		          	path: "/userAdmin"
		        })
		    },
			//查看
			moreSerList(id,type) {
				if(type == 1) {
					this.bouncesHide = true;
					this.infoIds=id;
				}else{
					return;
				}
			},
			//实名制解除
			 confirm (id) {
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>是否解除实名认证？</p><p style="color:red;">请注意解开实名认证后该用户可能无法提现或接任务，请谨慎操作。</p>',
                    onOk: () => {
                    	this.delList(1)
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
           },
			//确认操作
			delList(id) {
				var that = this;
				this.axios.post('/mkmanager/delEle/'+id+'.do', {
				}).then((res) => {
					console.log(res);
					this.serceMessinfo();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
	#enterInfo {
		input {
			height: 27px;
			width: 230px;
		}
		.titleWap {
			margin-bottom: 15px;
			* {
				vertical-align: middle;
			}
		}
		.enter_pei{
			li{
				margin-bottom: 40px;
				margin-left: 76px;
				div{
					display: inline-block;
					width: 100%;
					span:first-child{
						margin-right: 5px;
						width: 48px;
						text-align: right;
						display: inline-block;
					}
				}
			}
			.li_img{
				height: 60px;
				.en_span1{
					position: relative;
					top: -42px;
				}
				img{
					display: inline-block;
					width: 100px;
					height: 60px;
				}
			}
		}
		.in_name{
			height: 100px;
			line-height: 100px;
			padding-left: 130px;
			span.adopt{
				display: inline-block;
				height: 32px;
				line-height: 32px;
				color: #66CC00;
				img{
					display: inline-block;
					position: relative;
				    top: 4px;
				    width: 18px;
				    height: 18px;
				    margin-right: 8px;
				}
				a{
					color: #5688DE;
					text-decoration: underline;
					margin-left: 75px;
				}
			}
			span.no_adopt{
				display: inline-block;
				height: 32px;
				line-height: 32px;
				color: #FF3300;
				img{
					display: inline-block;
					position: relative;
				    top: 4px;
				    width: 18px;
				    height: 18px;
				    margin-right: 8px;
				}
			}
				/*.zrees{
					display: inline-block;
					position: relative;
	    			top: -18px;
	    			z-index: 0;
				}*/
		}
		.marks{
			padding-left: 130px;
			overflow: hidden;
			span{
				float: left;
				margin-top: 6px;
			}
			.zrees{
				width: 30%;
			    float: left;
			    margin-left: 1%;
			}
			.spanStx{
				display: inline-block;
    			width: 510px;
			}
		}
		.in_mamey{
			border:1px solid #ddd;
			padding: 30px 20px;
			div{
				width: 170px;
				height: 100%;
				display: inline-block;
				margin-left: 30px;
				p:nth-child(2){
					font-size: 36px;
					display: inline-block;
				}
				span{
					display: inline-block;
					margin-left: 4px;
				}
			}
		}
		.row {
			margin-top: 25px;
			margin-bottom: 40px;
			.span1,
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 50px;
				.inpt{
					width: 70px;
				}
				em{
					margin: 0 10px;
				}
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
				.smallBtn1{
					margin-left: 20px;
				}
				.smallBtn2 {
					margin: 0 5px;
				}
				.smallBtn3{
					margin-left: 5px;
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
			.colmn4 {
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