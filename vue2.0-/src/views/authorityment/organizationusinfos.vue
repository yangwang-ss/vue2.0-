<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">修改组织</span>
				<span class="cancelWap" @click="cancels"><img src="../../../static/img/cancel.png"/></span>
			</div>
			<div class="overflow scroll">
				<div class="inputRow" style="margin-top: 15px;">
					<span>名称<i style="color: red;">*</i>：</span>
					<input v-model="resorganname" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow inputOver">
					<span class="authoy" style="margin-right: 4px;">所属机构：</span>
					<input id="mechan1" v-model="organtreesid" type="hidden" value="">
                	<TreeSelect transfer ref="treeselect" clearable class="zrees" :data="baseData" 
                		@on-select-change="selectVal" placeholder="请选择..."  :width="230" :fields="treeFields"></TreeSelect>
				
				</div>
				<div class="bootom-button">
					<div class="middlBtnDefalt" @click="returns">取消</div>
					<div class="middleBtn1" @click="save">确认</div>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				showDrop: false,
				transfer:true,
				pageNos:1,
				pageSizes:100,
				resorganname:'',
				companyid:'',
        		treeNodeId: "",
        		organtreesid:"",
        		organtrees:"",
				baseData:[],
//                  baseData: [
//                    {
//                      name: 'parent 1',
//                      id:'1-1',
//                      child: [
//                        {
//                          name: 'parent 1-1',
//                          id:'1-1-1',
//                          child: [
//                            {
//                              name: 'children 1-1-1',
//                              id:'1-1-1-1'
//                            },
//                            {
//                              name: 'children 1-1-2',
//                              id:'1-1-1-2',
//                            }]
//                        },
//                        {
//                          name: 'parent 1-2',
//                          id:'1-1-2',
//                          child: [{
//                            name: 'children 1-2-1',
//                            id:'1-1-2-1'
//                          }]
//                        }]
//                    },
//                    {
//                      name: 'parent 2',
//                      id:'1-2'
//                    }
//                  ],
                    treeFields:[
                      {field:'name',map:'title'},
                      {field:'child',map:'children'}
                    ],
			}
		},
	    mounted(){
			let _this=this;
			_this.baseDataLists();
	    },
		methods: {
	      	baseDataLists(){
		        this.axios.post("/role/queryOrganizationAllVUEInit.do", {
		        
		        }).then((res) => {
		        	this.baseData = res.data.data.value;
//		          console.log(res, "组织机构树成功")
		        }).catch((err) => {
		          console.log(err, "组织机构树失败")
		        })
	      	},
			//项目信息
			showUserinfo(id) {
				var that = this;
				this.axios.post('/role/queryOrganization.do', {
					"id":id
				}).then((res) => {
					console.log(res,"qqqqqqqqqqq");
					this.id = res.data.data.result[0].id;
					this.companyid = res.data.data.result[0].companyid;
					this.resorganname = res.data.data.result[0].name;
					this.organtreesid = res.data.data.result[0].pId;
					this.organtrees = res.data.data.result[0].parentid;
					this.setDefaultDataTree(res.data.data.result[0].pId,'treeselect');
				}).catch(function(err) {})
			},
           	setDefaultDataTree(ids,ref){
              	this.$refs[ref].setDefaultValue(ids);
           	},
			selectVal(ele){
//          	console.log(ele);
//            	console.log(ele[0].id);
              	this.organtreesid = ele[0].id;
			},
			cancels() {
				this.$emit("cancel");
			},
			save() {
				if(this.resorganname == ''){
					this.$Message.info('请填写必填信息');
					return false;
				}else{
				var that = this;
				let content={
					id:that.id,
					companyid:that.companyid,
					resorganname:that.resorganname,
					organtreesid:that.organtreesid,
				}
				this.$emit("sumbit",{
//					id:this.id,
					content:content
				});
				}
			},
			returns() {
				this.$emit("returnfo");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow{
		
		.inputRow{
			width: 400px;
			span{
				width: 104px;
				text-align: right;
				display: inline-block;
			}
		}
	}
	.Dialog {
		
			min-width: 560px;
			
		.headTitle{
			/*margin-bottom: 22px;*/
		}
		.inputRow {
			margin-bottom: 15px;
			margin-left: 86px;
		  	.baseNameLeft1 {
		    	position: absolute;
			    left: 193px;
			    width: 41%;
			    border: 1px solid #ccc;
			    height: 260px;
			    background: #fff;
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
			        	top: 14px;
			        	z-index: 2;
			        	right: 13px;
			      	}
			      	img {
			        	width: 22px;
			        	height: auto;
			      	}
		    	}
		      	.zTreeDemoBackground {
		      		height: 167px;
		      		overflow-y: scroll;
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
		  	}
		}
			.inputOver{
				overflow: hidden;
			}
			.authoy{
				float: left;
				margin-top: 3px;
			}
			.zrees{
				display: inline-block;
				float: left;
    			z-index: 0;
			}
			
	}
</style>