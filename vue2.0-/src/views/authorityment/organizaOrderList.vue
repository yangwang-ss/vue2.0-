<template>
	<div id="useradmin">
		<div class="titleWap">
		
			<span id="orGan" class="h41" v-show="showDrop" @click="viewJumpreturn()">组织管理</span>
			<a class="h41" v-for="(str,i) in arr" @click="viewJump(str.id,false,true,i,str.name)">/{{str.name}}</a>
		</div>
		<div class="row row2">
			<span class="span1">
				<label for="input1">组织名称：</label>
				<input class="inputText" type="text" v-model="organName" name="" id="input1" value="" placeholder="请输入"/>
			</span>
			<span class="span1"></span>

			<span class="buttonList">
			<span class="smallBtn1" @click="showNewOrgan">新建</span>
			<span class="smallBtn2" @click="searchs">搜索</span>
			<span class="smallBtnDefalt" @click="reset">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">组织名称</td>
				<td class="colmn2">创建时间</td>
				<!--<td class="colmn3">创建人</td>-->
				<td class="colmn4">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td>{{item.name}}</td>
				<td>{{item.createtime ? computationsCallTime(item.createtime) : ""}}</td>
				<!--<td>{{item.name}}</td>-->
				<td class="check-more">
					<span @click="moreEnters(item.id,item.name)">查看</span>
					<span class="checkLink" @click="showDropinfo(item.id)">修改</span>
					<span @click="confirm(item.id)">删除</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalItems" show-elevator show-sizer @on-change="changePage"
				 @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建-->
	    <v-bounces v-if="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-organiza ref="showOrganiza" @addsumbit="addsumbit($event)" @returns="returns()" @cancel="cancelno()"></new-organiza>
	    </v-bounces>
		<!--修改-->
	    <v-bounces v-show="revisebouncesHide" @emitClickPopup="popupShutDown()">
			<newOrganforminfo ref="showOrganinfos" @sumbit="sumbit($event)" @returnfo="returnfo()" @cancel="cancelfo()"></newOrganforminfo>
	    </v-bounces>
	</div>
</template>

<script>
	import newOrganiza from "@/views/authorityment/organizationus"
	import newOrganforminfo from "@/views/authorityment/organizationusinfos"
	import Tool from "../../getData/tool"
	import bounces from "@/components/btm-bounces.vue"
	export default{
		data(){
			return{
				arr:[],
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				showDrop: true,
				showArsy:false,
        		bouncesHide: false,
        		revisebouncesHide:false,
        		organName:'',
        		arrid:'',
        		showarrid:false
			}
		},
		components:{
			newOrganiza,
			newOrganforminfo,
      		"v-bounces": bounces
		},
	    mounted(){
	    	this.search();
	    },
		methods:{
			//
			getDefaultLoading(id,status,type,name){
				var that = this;
				this.axios.post('/role/queryOrganization.do', {
					"pageNo": that.page,
					"pageSize": that.pageSize,
					"name": that.organName,
					"parentid":id?id:null
				}).then((res) => {
//					let list=[];
//					if(status){
//						res.data.data.result.map((item)=>{
//							let obj={
//								id:item.id,
////								name:item.name
//							}
//							this.arr.push(obj)
//						})
//					}else if(type){
//						res.data.data.result.map((item)=>{
//							let obj={
//								id:item.id,
////								name:item.name
//							}
//							list.push(obj)
//							this.arr=list;
//						})
//					}
			
					console.log(res,"组织管理列表成功");
					this.tableList = res.data.data.result;
					this.result = res.data.data;
              		this.result.totalItems = res.data.data.totalItems;
				}).catch(function(err) {})
			},
			//跳转
			viewJump(id,status,type,i,name){
				this.organName = '';
				this.arr.splice(i+1);
				this.getDefaultLoading(id,status,type,name)
			},
			viewJumpreturn(){
				this.organName = '';
				this.arr.splice(0, this.arr.length);
	    		this.searchs();
				if(this.arr.length==0){
					$("#orGan").attr("class","h41")
				}
			},
			//新建
			addsumbit(e) {
//				console.log(e.id,e.content,"你");
				var that = this;
				this.axios.post('/role/addOrganization.do', {
					"companyId":1,//xiaodong
					"name": e.content.organizaname,
					"parentId": e.content.stafftreesid,
				}).then((res) => {
//					console.log(res,"新增组织成功");
					this.searchs();
					let ss = res.data.msg;
					this.$Message.success(ss);
					this.bouncesHide = false;
				}).catch(function(err) {})
			},
			//修改
			sumbit(e){
				this.axios.post('/role/updateOrganization.do', {
					"id": e.content.id,
					"companyId": e.content.companyid,
					"name": e.content.resorganname,
					"parentId": e.content.organtreesid,
				}).then((res) => {
//					console.log(res,"修改组织成功");
					this.searchs();
					let ss = res.data.msg;
					this.$Message.success(ss);
	        		this.revisebouncesHide = false;
				}).catch(function(err) {})
			},
			//项目搜索
			search() {
				this.getDefaultLoading();
			},
			searchs() {
				if(this.arr.length == 0){
					this.getDefaultLoading();
				}else{
					for(var i in this.arr){
						console.log(this.arr[i].id);
					}
					this.arrid = this.arr[i].id;
//					alert(this.arrid);
					var that = this;
					this.axios.post('/role/queryOrganization.do', {
						"pageNo": that.page,
						"pageSize": that.pageSize,
						"name": that.organName,
						"parentid":that.arrid?that.arrid:null
					}).then((res) => {
						console.log(res,"组织管理列表成功");
						this.tableList = res.data.data.result;
						this.result = res.data.data;
	              		this.result.totalItems = res.data.data.totalItems;
					}).catch(function(err) {})
	//				this.arr.splice(0, this.arr.length);
					
				}
			},
			changePage(page) {
				this.page = page;
				this.searchs();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.searchs();
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
		    },
			//重置
			reset() {
				var that = this;
				that.organName = '';
			},
			//删除确认
			 confirm (id) {
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
                    onOk: () => {
                    	this.delList(id)
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
           },
			//删除操作
			delList(id) {
				var that = this;
				this.axios.post('/role/deleteOrganization.do', {
					"id":id
				}).then((res) => {
					console.log(res);
					this.searchs();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
			//新建点击事件
			showNewOrgan() {
				this.bouncesHide = true;
			},
			//修改
			showDropinfo(id) {
				this.revisebouncesHide = true;
				this.$refs.showOrganinfos.showUserinfo(id);
			},
	      	popupShutDown(){
	        	// 关闭
	        	this.bouncesHide = false;
	        	this.revisebouncesHide = false;
	      	},
	      	cancelno(){
	        	this.bouncesHide = false;
	      	},
	      	returns(){
	        	this.bouncesHide = false;
	      	},
	      	cancelfo(){
	        	this.revisebouncesHide = false;
	      	},
	      	returnfo(){
	        	this.revisebouncesHide = false;
	      	},
			//查看
			moreEnters(id,name) {
				this.organName = '';
				let status=true;
				let obj={
					id:id,
					name:name
				}
				this.arr.push(obj);
				this.getDefaultLoading(id,status,null,name);
				if(this.arr.length>0){
					$("#orGan").attr("class","h42")
				}
			}
		},
	}
</script>

<style lang="scss" scoped="scoped">
@import "../../../static/css/zTreeStyle/zTreeStyle.css";
	#useradmin{
		.titleWap {
			margin-bottom: 15px;
			* {
				vertical-align: middle;
			}
		}
		.row {
			margin-bottom: 25px;
			position: relative;

			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 50px;
				display: inline-block;
			}
			.spanWidth{
				width: 600px;
				display: inline-block;
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
		/*******表单样式*******/
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
				width: 33%;
			}
			.colmn2 {
				width: 33%;
			}
			.colmn3 {
				width: 34%;
			}
			/*.colmn4 {
				width: 20%;
			}*/
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
					width: 45px;
				}
			}
		}
	}
</style>
