<template>
	<div id="moreRecord">
		<div><span class="h42">企业名称/</span><span class="h41">最近的交易记录</span></div>
		<div class="row">
			<span class="span1"><label for="input1">项目名称：</label><input type="text" name="" id="input1" value="" placeholder="请输入"/></span>
			<span id="Date-picker">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>
            </span>
			<span class="buttonList">
			<span class="smallBtn2">搜索</span>
			<span class="smallBtnDefalt">重置</span>
			</span>
		</div>
		<div class="trade">
			<div class="tabListWap">
				<div v-for="(item,index) in tabList" @click="tabIndex(index)" :class="{cur:item.iscur}">{{item.name}}</div>
			</div>
			<!--tab组件-->
			<!--收入记录-->
			<div v-if="index == 0">
				<income></income>
				<!--分页插件-->
				<div id="page">
					<Page :total="10" show-elevator show-sizer></Page>
				</div>
			</div>
			<!--消费记录-->
			<div v-else-if="index == 1">
				<consume></consume>
				<!--分页插件-->
				<div id="page">
					<Page :total="10" show-elevator show-sizer></Page>
				</div>
			</div>
			<!--消费记录-->
			<!--<div v-else="index == 2">
				<consume></consume>
				分页插件
				<div id="page">
					<Page :total="100" show-elevator show-sizer></Page>
				</div>
			</div>-->
		</div>
	</div>
</template>

<script>
	import income from "@/views/person/incomeRecord"
	import consume from "@/views/person/consumeRecord"
	export default {
		data() {
			return {
				value2: ['2016-01-01', '2016-02-15'],
				tabList: [{
						iscur: true,
						name: "收入记录"
				},
					{
						iscur: false,
						name: "消费记录"
					}
				],
				index: ''
			}
		},
		methods: {
			tabIndex(index) {
				this.index = index;
				this.tabList.map(function(v, i) {
					i == index ? v.iscur = true : v.iscur = false;
				});
			},
			getqueryBlanceRecord(){
		        var that = this;
		        this.axios.post('/company/queryBlanceRecord.do', {
		          "userId":sessionStorage.getItem('userID'),
		          "accountType":"rmb",
		          "operateType":0
		        })
		          .then(function (res, req) {
		            let dataList = res.data;
		            if(dataList.code==0){
		              that.dataList=dataList.data.result;
		              that.dataList.result.status=that.getState(that.dataList.result.status);
		//              console.log(dataList.data.result);
		            }
		          }).catch(function (err) {
		
		        })
		      },
		      getStates(sta){
		        var that = this;
		        this.axios.post('/dictionary/searchParameterByName.do', {
		          "name":"recordStatus",
		          "key":sta
		        })
		          .then(function (res, req) {
		            let dataList = res.data;
		            if(dataList.code==0){
		             return dataList;
		            }
		          }).catch(function (err) {
		
		        })
      		}
		},
		components: {
			income,
			consume
		}
	}
</script>
<style lang="scss" scoped="scoped">
	#moreRecord {
		.row {
			margin-top: 20px;
			margin-bottom: 5px;
			position: relative;
			.span1 {
				width: 300px;
				margin-right: 50px;
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
		/*****交易记录******/
		.trade {
			padding: 20px;
			.tabListWap {
				overflow: hidden;
				margin-left: 50px;
				margin-bottom: 15px;
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
			.cur {
				background: #108EE9 !important;
				color: #fff !important;
			}
		}
	}
</style>
