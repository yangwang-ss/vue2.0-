<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">修改员工</span>
				<span class="cancelWap" @click="cancels"><img src="../../../static/img/cancel.png"/></span>
			</div>
			<div class="overflow scroll">
				<div class="inputRow" style="margin-top: 15px;">
					<span>名称：</span>
					<input type="text" v-model="staffiName" value="" placeholder="请输入" class="textInput" disabled="disabled" />
				</div>
				<div class="inputRow">
					<span>昵称：</span>
					<input type="text" v-model="staffinickName" value="" placeholder="请输入" class="textInput" disabled="disabled" />
				</div>
				<div class="inputRow">
					<span>手机号：</span>
					<input type="text" v-model="staffiphone" value="" placeholder="请输入" class="textInput" disabled="disabled" />
				</div>
				<div class="inputRow input_tb">
					<span>角色<i style="color: red;">*</i>：</span>
					<Select v-model="work_model1" class="select" clearable>
						<Option v-for="item in workinput1" :value="item.id" :key="item.id">{{item.name}}</Option>
					</Select>
				</div>
				<div class="inputRow" style="overflow: hidden;">
					<span style="float: left;margin-right: 4px;">技能：</span>
					<!--<input type="text" v-model="staffinfo" value="" placeholder="请输入" class="textInput" />-->
					<input id="" v-model="skillinfoid" type="hidden" value="">
                	<TreeSelect transfer ref="treeselect1" disabled :multiple="multiple" class="zrees" :data="skillbaseData" placeholder="请选择..." @on-select-change="checkselectVal"
                		 :width="232" :fields="skilltreeFields"></TreeSelect>
				</div>
		      	<div class="inputRow">
					<span>企业管理员：</span>
			        <Radio-group v-model="enablement">
			          	<Radio disabled label="是"></Radio>
			          	<Radio disabled label="否"></Radio>
			        </Radio-group>
		      	</div>
				<div class="inputRow inputOver">
					<span class="authoy">组织机构：</span>
					<input id="" v-model="staffinfoid" type="hidden" value="">
                	<TreeSelect transfer ref="treeselect2" clearable class="zrees" :data="baseData" @on-select-change="selectVal"
                		 placeholder="请选择..."  :width="230" :fields="treeFields"></TreeSelect>
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
  	let newCount = 1;
	export default {
		data() {
			return {
				id:"",
				disabled: false,
				transfer:true,
				pageNos:1,
				pageSizes:100,
				staffiName:'',
				staffinickName:'',
				staffiphone:'',
				work_model1: '',
        		staffinfos:"",
        		arrId:[],
				workinput1: [],
        		treeNodeId: "",
				enablement:"是",
        		staffinfoid:"",
        		staffinfo:"",
        		skillinfoid:'',
        		skillinfo:'',
				validity:'',
				basedataList:[],
                multiple: true,
				skillbaseData:[],
                skilltreeFields:[
                  {field:'name',map:'title'},
                  {field:'child',map:'children'}
                ],
				baseData:[],
                treeFields:[
                  {field:'name',map:'title'},
                  {field:'child',map:'children'}
                ],
			}
		},
	    mounted(){
			let _this=this;
	    	this.roleList();
			_this.baseDataList();
	    	this.baseDataLists();
//			this.$nextTick(function(){
//				$.fn.zTree.init($("#treeDemo2"), _this.setting, _this.zNodes);
//				_this.getCategoryList();
//			});
	    },
	    watch: {
	      work_model1(v){
	      	console.log(v,"sss");
	      }
	    },
		methods: {
	      	baseDataList(){
		        this.axios.post("/role/queryRoleDetailsInit.do", {
		        }).then((res) => {
		        	this.skillbaseData = res.data.data.roleAllList;
//		          console.log(res, "技能树")
		        }).catch((err) => {
		          console.log(err, "技能树")
		        })
	      	},
	      	baseDataLists(){
		        this.axios.post("/role/queryOrganizationAllVUEInit.do", {
		        
		        }).then((res) => {
		        	this.baseData = res.data.data.value;
//		          console.log(res, "组织机构树成功")
		        }).catch((err) => {
		          console.log(err, "组织机构树失败")
		        })
	      	},
			checkselectVal(data){
            	this.arrId.splice(0,this.arrId.length);
				for(var x in data){
					this.arrId.push(data[x].id);
				}
//				console.log(this.arrId);
			},
			selectVal(ele){
              	this.staffinfoid = ele[0].id;
			},
			//项目信息
			showUserinfo(id) {
				var that = this;
				this.axios.post('/role/queryUser.do', {
					"id":id
				}).then((res) => {
					console.log(res,"id编辑员工");
					this.id = res.data.data.result[0].id;
					this.staffiName = res.data.data.result[0].name;
					this.staffinickName = res.data.data.result[0].nickName;
					this.staffiphone = res.data.data.result[0].phoneNumber;
					this.work_model1 = res.data.data.result[0].roleName;
					if(res.data.data.result[0].isAdmin == 1){
						this.enablement = "是";
	            		this.validity = 1;
					}else if(res.data.data.result[0].isAdmin == 0){
						this.enablement = "否";
	            		this.validity = 0;
					}
					this.staffinfoid = res.data.data.result[0].organizationId;
					this.staffinfo = res.data.data.result[0].organizationid;
					this.setDefaultDataTree(res.data.data.result[0].organizationId,'treeselect2');
				}).catch(function(err) {})
			},
           	setDefaultDataTree(ids,ref){
              	this.$refs[ref].setDefaultValue(ids);
           	},
	      	roleList(){
		        this.axios.post("/role/queryRole.do", {
          			"pageNo": this.pageNos,
          			"pageSize": this.pageSizes,
		        }).then((res) => {
		        	this.workinput1 = res.data.data.result;
		          console.log(res, "角色成功role")
		        }).catch((err) => {
		          console.log(err, "角色失败role")
		        })
	      	},
			cancels() {
				this.$emit("cancel");
			},
			save() {
				if(this.work_model1 == ''){
					this.$Message.info('请填写必填信息');
					return false;
				}else{
				var that = this;
				let content={
					id:that.id,
//					staffiphone:that.staffiphone,
					work_model1:that.work_model1,
					staffinfoid:that.staffinfoid,
//					model10:that.model10,
//					validity:that.validity,
//					arrId:that.arrId
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
		height: 92%;
		overflow-y: auto;
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
		.textareaRow {
			width: 300px;
			margin-left: 130px;
			margin-bottom: 2px;
			.textBox {
				height: 80px;
				width: 230px;
			}
			.textAligin {
				vertical-align: top;
				margin-top: 5px;
				display: inline-block;
			}
		}
		.headTitle{
			/*margin-bottom: 22px;*/
		}
		.inputRow {
			margin-bottom: 15px;
			margin-left: 86px;
		  	.baseNameLeft2 {
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
		.input_tb{
			margin: 0px 0 15px 86px;
		}
			.inputOver{
				overflow: hidden;
			}
			.authoy{
				float: left;
				margin-top: 3px;
				margin-right: 4px;
			}
			.zrees{
				display: inline-block;
				float: left;
    			z-index: 0;
			}
			
	}
</style>