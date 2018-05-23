<template>
	<div id="areaNumberConfig">
		<h4 class="h41" style="cursor: auto;">区号配置</h4>
		<div class="row" style="margin-bottom: 40px;">
			<span class="span1"><label for="input1">区号名称：</label><input type="text" name="" id="input1" value="" placeholder="请输入" class="inputText" v-model="areaNumberName"/></span>
			<span class="buttonList">
			<span class="smallBtn1" @click="NewBuild">新建</span>
			<span class="smallBtn2" >搜索</span>
			<span class="smallBtnDefalt">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">区号名称</td>
				<td class="colmn2">区号值</td>
				<td class="colmn3">操作</td>
			</tr>
			
		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalItems" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建-->
		<bounces v-show="boxShow">
			<div class="Dialog">
				<div class="headTitle">
				<span class="title">新建</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" /></span>
			</div>
			<div class="inputRow" style="margin-top: 40px;">
					<span class="redStar">区号名称：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" v-model="areaName" />
				</div>
				<div class="inputRow">
					<span class="redStar">区号值：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" v-model="areaValue" />
				</div>
				<div class="bootom-button">
			<div class="middlBtnDefalt" @click="cancel">取消</div>
			<div class="middleBtn2" style="margin-left: 20px;margin-right: 15px;">提交</div>
		</div>
			</div>
		</bounces>
	</div>
</template>

<script>
	import bounces from "@/components/btm-bounces.vue"
	export default{
		data(){
			return{
				boxShow:false,
				areaNumberName:'',//搜索区号名称
				areaName:'',//区号名称
				areaValue:'',//区号值
				totalItems:'',//总条数
				pageSize: 10,
				page: 1
			}
		},
		mounted(){},
			methods:{
				NewBuild(){
					this.boxShow = true;
				},
				
				cancel(){
					this.boxShow = false;
				},
				//新建
				newBuildAPI(){
					this.axios.post('',{
						
					}).then((res)=>{
						if(res.data.code==='0'){
							
						}
					}).catch((err)=>{
						console.log(err);
					});
				},
				changePage(page) {
				this.page = page;
				this.newBuildAPI();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.newBuildAPI();
			},
			totalpageSizes(totalpageSize) {
				this.totalpageSize = totalpageSize;
				this.newBuildAPI();
			},
			},
			components:{
				bounces
			}
	}
</script>

<style lang="scss" scoped="scoped">
.inputRow {
			width: 33em;
			span {
				display: inline-block;
				width: 6em;
				text-align: right;
			}
			
			.redStar {
				position: relative;
				&:after {
					content: "*";
					color: red;
					position: absolute;
					right: 7px;
				}
			}
			
		}
	.buttonList {
		margin-left: 22em;
				span {
					vertical-align: middle;
					text-align: center;
					display: inline-block;
				}
				.smallBtn2 {
					margin: 0 10px;
				}
			}
</style>