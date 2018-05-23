<template>
	<div id="speechRateWap">
		<div class="titleWap">
			<span class="h42">结算模板配置</span>
			<span style="font-size: 16px;font-weight: bold;">/</span>
			<span class="h41" @click="goback">模板设计</span>
			<span style="font-size: 16px;font-weight: bold;">/</span>
			<span class="h41" style="cursor: auto;">计费条件设置</span>
		</div>
		<!--tab切换-->
		<div class="tabListWap">
			<div v-for="(item,index) in tabList" @click="tabIndex(index)" :class="indexs==index?'cur':''" :value="item.key" class="tabs">{{item.value}}</div>
		</div>
		<div v-if="indexs== 0">
			<div class="setMessage">
				<div class="title">配置信息</div>
				<div class="inputWap">
					<span>
					<span>条件名称：</span>
					<span>
						<Select v-model="conditionName" clearable>
               <Option v-for="item in conditonName" :value="item.key" :key="item.value">{{item.value}}</Option>
          			 </Select>
					</span>
					</span>
					<span>
					<input type="text" value="" placeholder="对比值" v-model="contrastValue"/>
				</span>
					<span class="space1">
					<span>匹配成功后的变化：</span>
					<span>
						<Select v-model="changeType" clearable>
               <Option v-for="item in changelist" :value="item.key" :key="item.key">{{ item.value}}</Option>
           </Select>
					</span>
					</span>
					<span>
				<input type="text" value="" placeholder="匹配成功后的值" v-model='value' class="longInput"/>
				</span>
					<span class="smallBtn1" @click="createSettitleRule" v-show="newBuild">新建</span>
				</div>
			</div>
			<!--表单-->
			<table class="tableForm">
				<tr class="trHeader">
					<td>条件名称</td>
					<td>对比值</td>
					<td>数据变化</td>
					<td>匹配成功值</td>
					<td v-show="newBuild">操作</td>
				</tr>
				<tr v-for="item in settitleList">
					<td class="colmn1">{{convert(item.name,conditonName)}}</td>
					<td class="colmn2">{{item.contrastValue}}</td>
					<td class="colmn3">{{convert(item.changeType,changelist)}}</td>
					<td class="colmn4">{{item.value}}</td>
					<td class="colmn5 check-more" v-show="newBuild">
						<span @click="confirm(item.id)">删除</span>
					</td>
				</tr>
			</table>
		</div>
		<div v-if="indexs == 1">
			<div class="setMessage">
				<div class="title">配置信息</div>
				<div class="inputWap">
					<span>
					<span>条件名称：</span>
					<span>
						<Select v-model="conditionName">
               <Option v-for="item in conditonName" :value="item.key" :key="item.value">{{item.value}}</Option>
          			 </Select>
					</span>
					</span>
					<span>
					<input type="text" value="" placeholder="对比值" v-model="contrastValue"/>
				</span>
					<span class="space1">
					<span>匹配成功后的变化：</span>
					<span>
						<Select v-model="changeType">
               <Option v-for="item in changelist" :value="item.key" :key="item.value">{{ item.value}}</Option>
           </Select>
					</span>
					</span>
					<span>
				<input type="text" value="" placeholder="匹配成功后的值" v-model='value' class="longInput"/>
				</span>
					<span class="smallBtn1" @click="createSettitleRule" v-show="newBuild">新建</span>
				</div>
			</div>
			<!--表单-->
			<table class="tableForm">
				<tr class="trHeader">
					<td>条件名称</td>
					<td>对比值</td>
					<td>数据变化</td>
					<td>匹配成功值</td>
					<td v-show="newBuild">操作</td>
				</tr>
				<tr v-for="item in settitleList">
					<td class="colmn1">{{convert(item.name,conditonName)}}</td>
					<td class="colmn2">{{item.contrastValue}}</td>
					<td class="colmn3">{{convert(item.changeType,changelist)}}</td>
					<td class="colmn4">{{item.value}}</td>
					<td class="colmn5 check-more" v-show="newBuild">
						<span @click="confirm(item.id)">删除</span>
					</td>
				</tr>
			</table>
		</div>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tabListValue: 'condition-quality',
				conditionName: '',
				contrastValue: '',
				changeType: '',
				value: '',
				conditonName: [],
				changelist: [],
				pageSize: 10,
				pageNum: 1,
				totalpageSize: 0,
				settitleList: [],
				tabList: [],
				indexs: 0,
				status: 0,
				newBuild: true
			}
		},
		mounted() {
			//查询创建规则时的系统参数
			this.checkRule();
			//分布查询计费规则
			this.settitleRuleList();
			//根据状态判断新建的显示与隐藏
			this.showHiddien();
		},
		methods: {
			goback(){
				this.$router.back();
			},
			//key值转换为value值
			convert: function(e,list) {
				for(var i =0;i<list.length;i++) {
					var l= list[i];
					if(l.key == e) {
						return l.value;
					}
				}
			},
			//验证
			validate(){
				if(this.contrastValue==""||this.contrastValue==null){
					this.$Message.error('提交信息不全！');
					return;
				}
			},
			//根据状态判断新建的显示与隐藏
			showHiddien() {
				var status = this.$route.query.status;
				if(status == 0) {
					this.newBuild = true;
				} else {
					this.newBuild = false;
				}
			},
			tabIndex(index) {
				this.indexs = index;
				var that = this;
				that.tabListValue = this.tabList[index].key;
				console.log(this.tabList[index].key);
				//分布查询计费规则
				this.settitleRuleList();
			},
			//查询创建规则时的系统参数
			checkRule() {
				this.axios.post('/settle/findCreateRuleData.do', {

				}).then((res) => {
					this.tabList = res.data.data.condition;
					this.conditonName = res.data.data.ruleName;
					this.changelist = res.data.data.changeType;
				}).catch(function(err) {

				});
			},
			//分布查询计费规则
			settitleRuleList() {
				var that = this;
				var settlementId = this.$route.query.settlementId;
				this.axios.post('/settle/searchRule.do', {
					"pageNum": that.pageNum, //类型：Number  必有字段  备注：页码
					"pageSize": that.pageSize, //类型：Number  必有字段  备注：每页大小
					"settlementId": settlementId, //类型：String  必有字段  备注：上级的ID
					"conditionName": that.tabListValue //类型：String  必有字段  备注：条件名称
				}).then((res) => {
					this.settitleList = res.data.data.list;
					this.totalpageSize = res.data.data.total;
				}).catch(function(err) {

				});
			},
			changePage(pageNum) {
				this.pageNum = pageNum;
				this.settitleRuleList();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.settitleRuleList();
			},
			//创建结算规则
			createSettitleRule() {
				if(this.contrastValue==""||this.contrastValue==null){
					this.$Message.error(' 新建信息不全！');
					return;
				}else if(this.conditionName==''||this.conditionName==null){
					this.$Message.error('新建信息不全！');
					return;
				}else if(this.changeType==''||this.changeType==null){
					this.$Message.error('新建信息不全！');
					return;
				}else if(this.value==''||this.value==null){
					this.$Message.error('新建信息不全！');
					return;
				}
				var that = this;
				var settlementId = this.$route.query.settlementId;
				this.axios.post('/settle/createRule.do', {
					"settlementId": settlementId, //类型：String  必有字段  备注：上一级的结算ID
					"conditionName": that.tabListValue, //类型：String  必有字段  备注：条件名称
					"ruleName": that.conditionName, //类型：String  必有字段  备注：规则名称
					"contrastValue": that.contrastValue, //类型：String  必有字段  备注：对比值
					"changeType": that.changeType, //类型：String  必有字段  备注：匹配成功后的值变化类型
					"value": that.value //类型：String  必有字段  备注：匹配成功的返回值
				}).then((res) => {
					if(res.data.code==0){
						this.settitleRuleList();
						this.$Message.success("新建成功");
					}
					else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			//删除确认
			confirm(id) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.deleteRule(id);
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//删除规则
			deleteRule(id) {
				this.axios.post('/settle/deleteRule.do', {
					"id": id //类型：String  必有字段  备注：当前ID
				}).then((res) => {
					this.settitleRuleList();
				}).catch(function(err) {
					console.log(err);
				});
			}

		}
	}
</script>

<style scoped="scoped" lang="scss">
	#speechRateWap {
		.titleWap {
			margin-top: 20px;
			margin-bottom: 15px;
			
		}
		.tabListWap {
			overflow: hidden;
			margin-left: 50px;
			margin-bottom: 35px;
			div {
				padding: 0 15px;
				cursor: pointer;
				text-align: center;
				float: left;
				height: 30px;
				line-height: 30px;
				margin-right: 1em;
				background: #F3F3F3;
				border-radius: 5px;
				color: #999;
			}
		}
		.setMessage {
			height: 120px;
			background: #F7F7F7;
			border-radius: 5px;
			padding: 15px 20px;
			margin-bottom: 20px;
			.inputWap {
				margin-top: 20px;
				margin-left: 35px;
				input {
					width: 80px;
					height: 27px;
				}
				.longInput {
					width: 110px;
				}
				.ivu-select-single .ivu-select-selection {
					height: 27px;
					width: 100px !important;
					border: 1px solid #D9D9D9;
					border-radius: 5px;
				}
				.space1 {
					margin-left: 2em;
				}
				.smallBtn1 {
					display: inline-block;
					margin-left: 4em;
					text-align: center;
				}
			}
		}
		.tableForm {
			.colmn1 {
				/*width: 15%;*/
			}
			.colmn2 {
				width: 20%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 20%;
			}
			.colmn5 {
				width: 25%;
			}
			.check-more {
				text-align: center;
				position: relative;
				* {
					vertical-align: middle;
				}
				span {
					color: #108EE9;
					display: inline-block;
					cursor: pointer;
				}
			}
		}
		.cur {
			background: #108EE9 !important;
			color: #fff !important;
		}
	}
</style>