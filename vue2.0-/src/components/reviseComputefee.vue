<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建计费项</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" /></span>
			</div>
			<div class="inputRow" style="margin-top: 45px;">
				<span class="textW">名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" v-model="description" />
			</div>
			<div class="inputRow">
				<span class="textAligin textW">计费类型：</span>
				<Select v-model="name">
					<Option v-for="item in computedKind" :value="item.key" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="inputRow">
				<span class="textAligin textW">结算类型：</span>
				<Select v-model="accountType">
					<Option v-for="item in settitleKind" :value="item.key" :key="item.value">{{ item.value}}</Option>
				</Select>
			</div>
			<div class="inputRow">
				<span class="textAligin textW">单位：</span>
				<input type="text" placeholder="请输入" class="textInput" v-model="unit" />
			</div>
			<div class="inputRow">
				<span class="textW">单价：</span>
				<input  value="" placeholder="请输入" class="textInput" v-model="unitPrice" @keyup="numKeyup" ref="unitPrice"/>
			</div>
			<div class="inputRow">
				<span class="textAligin textW">考核指标关系：</span>
				<Select v-model="conditionRelation">
					<Option v-for="item in testLink" :value="item.key" :key="item.value">{{ item.value}}</Option>
				</Select>
			</div>
			<div class="bootom-button">
				<div class="middleBtn2" @click="entrue">保存</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				reviseid: '',
				description: '',
				name: '',
				unit: '',
				unitPrice: '',
				accountType: '',
				conditionRelation: '',
				computedKind: [],
				settitleKind: [],
				testLink: []
			}
		},
		mounted() {
			//查询创建计费类型时的系统参数
			this.selectData();
		},
		methods: {
			//查询创建计费类型时的系统参数
			selectData() {
				this.axios.post('/settle/findCreateSettlementData.do', {

				}).then((res) => {
					console.log(res);
					this.computedKind = res.data.data.name;
					this.settitleKind = res.data.data.accountType;
					this.testLink = res.data.data.conditionRelation;
				})
			},
			numKeyup(){
				this.$refs.unitPrice.value = this.$refs.unitPrice.value.replace(/[^\-?\d.]/g,'');
			},
			//信息回显
			showMess(id) {
				var that = this;
				var settlementId = this.$route.query.settitleId;
				this.axios.post('/settle/searchSettlementInfo.do', {
					"id": id, //类型：String  必有字段  备注：无
					"parentId": settlementId //类型：String  可有字段  备注：上级业务ID
				}).then((res) => {
					console.log(res);
					this.description = res.data.data.description;
					this.name = res.data.data.name;
					this.accountType = res.data.data.accountType;
					console.log(this.accountType);
					this.unit = res.data.data.unit;
					this.unitPrice = res.data.data.unitPrice;
					this.conditionRelation = res.data.data.conditionRelation;
					this.reviseid = res.data.data.id;
				}).catch(function(err) {

				});
			},
			//编辑
			editSettitle() {
				var that = this;
				this.axios.post('/settle/updateTemplate.do', {
					"id": that.reviseid, //类型：String  必有字段  备注：唯一标识
					"description": that.description, //类型：String  可有字段  备注：名称
					//"remark": that.remark //类型：String  可有字段  备注：说明
					"name": that.name, //类型：String  可有字段  备注：计费类型
					"accountType": that.accountType, //类型：String  可有字段  备注：结算账户
					"unit": that.unit, //类型：String  可有字段  备注：单位
					"unitPrice": that.unitPrice, //类型：String  可有字段  备注：单价
					"conditionRelation": that.conditionRelation //类型：String  可有字段  备注：考核指标关系
				}).then((res) => {
					this.$emit('childeMethod');
				}).catch(function(err) {

				});
			},
			entrue() {
				this.editSettitle();
				this.$emit("cancel");
			},
			cancel() {
				//this.newTemplate();
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		height: 510px;
		.inputRow {
			width: 400px;
			margin-bottom: 20px;
			margin-left: 80px;
			span {
				width: 120px;
				display: inline-block;
				text-align: right;
			}
		}
		.bootom-button {
			display: flex;
			justify-content: space-around;
		}
	}
</style>