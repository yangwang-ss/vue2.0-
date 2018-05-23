<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建员工</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png"/></span>
			</div>
			<div class="overflow scroll">
				<div class="inputRow" style="margin-top: 15px;">
					<span>名称：</span>
					<input type="text" v-model="staffiName" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>昵称：</span>
					<input type="text" v-model="staffinickName" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>手机号：</span>
					<input type="text" v-model="staffiphone" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow input_tb">
					<span>角色<i style="color: red;">*</i>：</span>
					<Select clearable v-model="work_model1" class="select">
						<Option v-for="item in workinput1" :value="item.id" :key="item.id">{{ item.name }}</Option>
					</Select>
				</div>
				<div class="inputRow" style="overflow: hidden;">
					<span style="float: left;margin-right: 4px;">技能：</span>
					<!--<input type="text" v-model="staffinfo" value="" placeholder="请输入" class="textInput" />-->
					<input id="" v-model="skilltreesid" type="hidden" value="">
                	<TreeSelect transfer v-model="skilltrees" :multiple="multiple" class="zrees" :data="skillbaseData" placeholder="请选择..." @on-select-change="checkselectVal" 
                		 :width="232" :height="27" :fields="skilltreeFields"></TreeSelect>
				</div>
		      	<div class="inputRow">
					<span>企业管理员：</span>
			        <Radio-group v-model="enablement">
			          	<Radio label="是"></Radio>
			          	<Radio label="否"></Radio>
			        </Radio-group>
		      	</div>
				<div class="inputRow inputOver">
					<span class="authoy">组织机构：</span>
					<input id="mechan1" v-model="stafftreesid" type="hidden" value="">
                	<TreeSelect placement="top" transfer clearable v-model="stafftrees" class="zrees" :data="baseData" 
                		@on-select-change="selectVal" placeholder="请选择..."  :width="230" :fields="treeFields"></TreeSelect>
				</div>
				<div class="bootom-button">
					<div class="middlBtnDefalt" @click="cancel">取消</div>
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
				companyId:'',
				showDrop: false,
				transfer:true,
				pageNos:1,
				pageSizes:100,
				staffiphone:'',
				staffiName:'',
				staffinickName:'',
				staffinfo:'',
				work_model1: '',
				validity:'',
				enablement:"是",
				workinput1: [],
        		treeNodeId: "",
        		stafftreesid:"",
        		stafftrees:"",
        		skilltreesid:"",
        		skilltrees:"",
        		arrId:[],
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
	    	this.roleList();
			let _this=this;
			_this.baseDataList();
			_this.baseDataLists();

	    },
	    watch: {
	      work_model1(v){
	      	console.log(v,"sss");
	      },
	      "enablement"(v){
	        switch (v) {
	          case "是": {
	            this.validity = 1;
	            break
	          }
	          case "否": {
	            this.validity = 0;
	            break
	          }
	        }
	      },
	    },
		methods: {
			//数据初始化
			initData(){
				this.staffiName = "";
				this.staffinickName = "";
				this.staffiphone = "";
				this.work_model1 = "";
				this.skilltreesid = "";
				this.stafftreesid = "";
			},
	      	roleList(){
		        this.axios.post("/role/queryRole.do", {
          			"pageNo": this.pageNos,
          			"pageSize": this.pageSizes,
		        }).then((res) => {
		        	this.workinput1 = res.data.data.result;
//		          console.log(res, "角色成功role")
		        }).catch((err) => {
		          console.log(err, "角色失败role")
		        })
	      	},
	      	baseDataList(){
		        this.axios.post("/role/queryRoleDetailsInit.do", {
		        }).then((res) => {
		        	if(res.data.code=='0'){
		        		this.skillbaseData = res.data.data.roleAllList;
		        	}
		        	else{
		        		this.$Message.error(res.data.msg)
		        	}
		        }).catch((err) => {
		          console.log(err, "技能树")
		        })
	      	},
	      	baseDataLists(){
		        this.axios.post("/role/queryOrganizationAllVUEInit.do", {
		        
		        }).then((res) => {
		        	this.baseData = res.data.data.value;
		        }).catch((err) => {
		          console.log(err, "组织机构树失败")
		        })
	      	},
			checkselectVal(data){
            	this.arrId.splice(0,this.arrId.length);
				for(var x in data){
					this.arrId.push(data[x].id);
				}
			},
			selectVal(ele){
				this.basedataList = ele;
              	this.stafftreesid = this.basedataList[0].id;
			},
			cancel() {
				this.$emit("cancel");
			},
			isPoneAvailable(str) {  
		        var myreg=/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;  
		        if (!myreg.test(str)) {  
					this.$Message.error('手机号不正确');
		            return false;  
		        } else {  
		            return true;  
		        }  
		    },
		    //新建
			addsumbit() {
				var that = this;
				this.axios.post('/role/addUser.do', {
					"companyId": e.content.id,
					"name": e.content.staffiName,
					"nickName": e.content.staffinickName,
					"phoneNumber": e.content.staffiphone,
					"role": e.content.work_model1,
					"organizationid": e.content.stafftreesid,
					"isAdmin": e.content.validity,
					"skillIds": e.content.arrId
				}).then((res) => {
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
					this.bouncesHide = false;
				}).catch(function(err) {
					console.log(err);
				});
			},
			save() {
				if(this.enablement == "是"){
					this.validity=1
				}
		        let myreg=/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;  
		        if (!myreg.test(this.staffiphone)) {  
					this.$Message.error('手机号不正确');
		            return false;  
		        }else if(this.work_model1 == ''){
					this.$Message.info('请填写必填信息');
					return false;
				}else{
				var that = this;
				let content={
					id:that.id,
					staffiName:that.staffiName,
					staffinickName:that.staffinickName,
					staffiphone:that.staffiphone,
					work_model1:that.work_model1,
					model10:that.model10,
					validity:that.validity,
					stafftreesid:that.stafftreesid,
					arrId:that.arrId
				}
				this.$emit("addsumbit",{
//					id:this.id,
					content:content
				});
				}
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
		.input_tb{
			margin: 0px 0 15px 86px;
		}
		.input_ts{
			padding-left: 64px;
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