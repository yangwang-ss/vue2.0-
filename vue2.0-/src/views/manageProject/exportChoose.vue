<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">导出</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="inputRow">
				<span id="Date-picker3">
					
            	工单信息筛选：<Select v-model="model12" filterable multiple @on-change="exportData">
                       <Option v-for="item in cityList" :value="item.toString()" :key="item.vaue">{{item}}</Option>
                   </Select>
            </span>
			</div>
			<div class="export">
				<a class="middleBtn3" @click="exportBtn" :href="URl1" download="" ref='hrefs' v-if="model12.length>0">导出</a>
				<a class="middleBtn3" @click="exportBtn" :href="URl1" download="" ref='hrefs' v-else disabled>导出</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				 cityList: [
                    {
                        value: 'beijing',
                        label: '北京市'
                    },
                    {
                        value: 'shanghai',
                        label: '上海市'
                    },
                    {
                        value: 'shenzhen',
                        label: '深圳市'
                    },
                    {
                        value: 'hangzhou',
                        label: '杭州市'
                    },
                    {
                        value: 'nanjing',
                        label: '南京市'
                    },
                    {
                        value: 'chongqing',
                        label: '重庆市'
                    }
                  ],
				 model12: [],
				URl1:''
			}
		},
		mounted(){
			this.findFormTableHead();
		},
		methods: {
			cancel() {
				this.$emit('cancel');
			},
			
			//查询工单导出表头
			findFormTableHead(){
				const id = this.$route.query.batchId;
				this.axios.post('/task/findFormTableHead.do',{
					 "batchId":id                //类型：String  必有字段  备注：项目Id
				}).then((res)=>{
					console.log(res);
					this.cityList = res.data.data.result;
				}).catch((err)=>{
					console.log(err);
				});
			},
			//根据批次创建时间导出工单数据
			exportData() {
				const id = this.$route.query.batchId;
				var that = this;
				this.axios.post('/task/exportDataByCondition.do', {
					
					"batchId": id, //类型：String  可有字段  备注：批次Id
					"tableHeads":that.model12
				}).then((res)=>{
					this.URl1 = res.data.data.url;
					console.log(this.URl1);
				}).catch(function  (err) {
					console.log(err);
				});
			},
			//工单信息表头数据
			exportBtn(){
				 this.$nextTick(function  () {
				 	this.$emit('cancel');
				 })
				
			}
			
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		height: 310px;
		.inputRow {
			position: relative !important;
			margin-top: 45px;
			margin-bottom: 60px;
			margin-left: 105px;
		}
		
	}
	
	.export {
		text-align: center;
		a{
			display: block;
			&:hover{
				color: #fff;
			}
		}
	}
	
	.middleBtn3 {
		margin: 60px auto;
	}
</style>