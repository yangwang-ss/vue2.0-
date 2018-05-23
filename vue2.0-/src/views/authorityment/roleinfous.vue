<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建角色</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png"/></span>
			</div>
			<div class="overflow scroll">
				<div class="inputRow" style="margin-top: 15px;">
					<span>名称<i style="color: red;">*</i>：</span>
					<input v-model="rolename" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>描叙<i style="color: red;">*</i>：</span>
					<input v-model="roletxt" type="text" value="" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>类型<i style="color: red;">*</i>：</span>
					<Select clearable v-model="dataKind" id="bouncesSelect">
						<Option v-for="item in dataKindList" :value="item.value" :key="item.value">{{item.lable}}</Option>
					</Select>
				</div>
				<div class="inputRow inputOver" v-if="dataKind===0">
					<span class="authoy" style="margin-right: 4px;">菜单：</span>
					<input id="" v-model="roletreesid" type="hidden" value="">
					<TreeSelect transfer v-model="roletrees" :multiple="multiple" class="zrees" :data="baseData" @on-select-change="checkselectVal" placeholder="请选择..." :width="232" :fields="treeFields"></TreeSelect>
				</div>
				<div class="inputRow" v-if="dataKind===1">
					<span>权限等级：</span>
					<Select v-model="dataLevelModel" filterable multiple>
						<Option v-for="item in dataLevelList" :value="item.value" :key="item.key">{{ item.value}}</Option>
					</Select>
				</div>
				<div class="bootom-button">
					<div class="middlBtnDefalt" @click="cancel">取消</div>
					<div class="middleBtn1" @click="addsummit">确认</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				showDrop: false,
				transfer: true,
				pageNos: 1,
				pageSizes: 100,
				rolename: '',
				roletxt: '',
				treeNodeId: "",
				arrId: [],
				dataKind: null, //数据类型
				dataLevelModel: [], //数据等级
				dataLevelList: [],
				dataKindList: [{
						value: 1,
						lable: "数据"
					},
					{
						value: 0,
						lable: "菜单"
					}
				],
				roletreesid: "",
				roletrees: [],
				multiple: true,
				baseData: [],
				treeFields: [{
						field: 'name',
						map: 'title'
					},
					{
						field: 'child',
						map: 'children'
					}
				],
			}
		},
		mounted() {
			this.baseDataLists();
			//权限等级
			this.privilegeLevel();
		},
		methods: {
			//数据清空
			initData(){
				this.rolename = '';
				this.roletxt = '';
				this.dataKind = '';
				this.dataLevelModel = [];
				this.roletrees = [];
			},
			//菜单
			baseDataLists() {
				this.axios.post("/role/queryRoleDetailsInit.do", {

				}).then((res) => {
					if(res.data.code == '0') {
						this.baseData = res.data.data.roleAllList;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err, "组织机构树失败")
				})
			},
			//权限等级
			privilegeLevel() {
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": "roleDataLevel" //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					if(res.data.code == '0') {
						this.dataLevelList = res.data.data.value;
					} else {
						this.$Message.error(res.data.msg);
					}
				})
			},
			checkselectVal(data) {
				this.arrId.splice(0, this.arrId.length);
				for(var x in data) {
					this.arrId.push(data[x].id);
				}
				//console.log(this.arrId);
			},
			cancel() {
				this.$emit("cancelno");
				
			},
			
			//新建
			addsummit() {
				console.log(this.dataKind);
				if(this.rolename == '' || this.roletxt == ''||this.dataKind==null) {
					this.$Message.info('请填写必填信息');
					return false;
				}
				var that = this;
				this.axios.post('/role/addRole.do', {
					"name": that.rolename,
					"description": that.roletxt,
					"roleType": that.dataKind,
					"dataAuthority": that.dataLevelModel,
					"functionMenuList": that.arrId
				}).then((res) => {
					if(res.data.code == '0') {
						this.$Message.success(res.data.msg);
						this.$emit("cancelno");
						this.$emit('childeMethod');
					} else {
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			returns() {
				this.$emit("returns");
				this.rolename = "";
				this.roletxt = "";
				this.stafftreesid = "";
				this.roletrees = "";
				this.baseDataLists();
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow {
		overflow-y: auto;
		.inputRow {
			width: 400px;
			span {
				width: 104px;
				text-align: right;
				display: inline-block;
			}
		}
	}
	
	.Dialog {
		.headTitle {
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
				p {
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
					span:nth-of-type(2) {
						margin-left: 10px;
						background: #FF9933;
						color: #fff;
					}
				}
			}
		}
		.inputOver {
			overflow: hidden;
		}
		.authoy {
			float: left;
			margin-top: 3px;
		}
		.zrees {
			display: inline-block;
			float: left;
			z-index: 0;
		}
		
	}
</style>