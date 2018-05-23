<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新增组织</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png"/></span>
			</div>
			<div class="overflow scroll">
				<div class="inputRow" style="margin-top: 15px;">
					<span>名称<i style="color: red;">*</i>：</span>
					<input v-model="organizaname" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow inputOver">
					<span class="authoy" style="margin-right: 4px;">所属机构：</span>
					<input id="mechan1" v-model="stafftreesid" type="hidden" value="">
                	<TreeSelect transfer clearable v-model="stafftrees" class="zrees" :data="baseData" @on-select-change="selectVal" placeholder="请选择..."
                		  :width="230" :fields="treeFields"></TreeSelect>
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
				organizaname:'',
        		treeNodeId: "",
        		stafftreesid:"",
        		stafftrees:"",
				baseData:[],

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
			selectVal(ele){
//          	console.log(ele);
//            	console.log(ele[0].id);
              	this.stafftreesid = ele[0].id;
			},
			cancel() {
				this.$emit("cancel");
			},
			save() {
				if(this.organizaname == ''){
					this.$Message.info('请填写必填信息');
					return false;
				}else{
				var that = this;
				let content={
					id:that.id,
					organizaname:that.organizaname,
					stafftreesid:that.stafftreesid,
				}
				this.$emit("addsumbit",{
//					id:this.id,
					content:content
				});
				this.organizaname = "";
				this.stafftreesid = "";
				this.stafftrees = "";
				}
			},
			returns() {
				this.$emit("returns");
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
		/*border-radius: none;
		height: auto;
		border-radius: 0 !important;*/
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