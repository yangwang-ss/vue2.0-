<template>
	<div id="useradmin">
		<div class="titleWap">
			<span class="h41" style="cursor: auto;">角色列表</span>
		</div>
		<div class="row row2">
			<span class="buttonList">
			<span class="smallBtn1" @click="showNewOrgan">添加角色</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">名称</td>
				<td class="colmn2">描叙</td>
				<td class="colmn3">类型</td>
				<td>操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td :title="item.name">{{item.name}}</td>
				<td :title="item.description">{{item.description}}</td>
				<td :title="item.roleType=='1'?'数据':'菜单'">{{item.roleType=='1'?'数据':'菜单'}}</td>
				<td class="check-more">
					<span class="" @click="confirm(item.id)"title="删除" >删除</span>
					<span class="checkLinks" @click="showDropList(item.id)" title="修改">修改</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalPageSize" show-elevator show-sizer @on-change="changePage"
				 @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建模板-->
	    <v-bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-organiza ref="showOrganiza" v-on:childeMethod="search" @cancelno="cancelno()"></new-organiza>
	    </v-bounces>
		<!--修改-->
	    <v-bounces v-show="revisebouncesHide" @emitClickPopup="popupShutDown()">
			<newOrganizainfo ref="showRoleinfos" v-on:childeMethod="search" @cancelno="cancelno()"></newOrganizainfo>
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
	import newOrganiza from "@/views/authorityment/roleinfous"
	import newOrganizainfo from "@/views/authorityment/roleinfousinfos"
	import bounces from "@/components/btm-bounces.vue"
	export default{
		data(){
			return{
				loading:true,
				name:'',
				pageSize: 10,
				pageNo: 1,
				totalpageSize: 0,
				totalPageSize: 0,
				tableList: [],
        		bouncesHide: false,
        		revisebouncesHide:false
			}
		},
		components:{
			newOrganiza,
			newOrganizainfo,
      		"v-bounces": bounces
		},
	    mounted(){
	    	this.search();
	    },
		methods:{
			
			//角色搜索
			search() {
				var that = this;
				this.axios.post('/role/queryRole.do', {
					"pageNo": that.pageNo,
					"pageSize": that.pageSize
				}).then((res) => {
					if(res.data.code=='0'){
						this.tableList = res.data.data.result;
              			this.totalPageSize = res.data.data.totalItems;
              			this.loading = false;
					}else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage(page) {
				this.pageNo = page;
				this.search();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.search();
			},
			//新建点击事件
			showNewOrgan() {
				this.bouncesHide = true;
				this.$refs.showOrganiza.initData();//初始化数据
			},
			//修改
			showDropList(id) {
				this.revisebouncesHide = true;
				this.$refs.showRoleinfos.showroleinfo(id);
			},
			//删除确认
			 confirm (id) {
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
                    onOk: () => {
                    	this.delList(id) 
            
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
           },
			//删除操作
			delList(id) {
				var that = this;
				this.axios.post('/role/deleteRole/'+id+'.do', {
				}).then((res) => {
					if(res.data.code=='0'){
						this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
					}
					else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
	      	popupShutDown(){
	        	// 关闭
//	        	this.bouncesHide = false;
//	        	this.revisebouncesHide = false;
	      	},
	      	cancelno(){
	        	this.bouncesHide = false;
	        	this.revisebouncesHide = false;
	      	}
	      	
		}
	}
</script>

<style lang="scss" scoped="scoped">
@import "../../../static/css/zTreeStyle/zTreeStyle.css";
	#useradmin{
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
		.row {
			margin-bottom: 25px;
			position: relative;
			
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 328px;
				margin-right: 50px;
				display: inline-block;
			}
			.spanWidth{
				width: 600px;
				display: inline-block;
			}
			.buttonList {
				float: right;
    			margin-bottom: 15px;
				span {
					vertical-align: middle;
					text-align: center;
					display: inline-block;
				}
				.smallBtn1 {
					width: 84px;
				}
			}
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
				width: 20%;
			}
			.colmn2 {
				width: 40%;
			}
			.colmn3 {
				width: 20%;
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
					width: 45px;
				}
				.checkLinks {
				    padding: 0 5px;
				    position: relative;
				}
				.checkLinks:before {
				    content: "";
				    display: block;
				    width: 1px;
				    height: 15px;
				    left: 0px;
				    top: 13px;
				    position: absolute;
				    background: #E9E9E9;
				}
			}
		}
	}
</style>