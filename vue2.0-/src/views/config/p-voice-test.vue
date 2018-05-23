<template>
	<div id="voiceTest">
		<span class="h41" style="cursor: auto;">语音质检模板</span>
		<div class="row">
			<span class="span1"><label for="input1">项目名称：</label><input type="text" v-model="templateName" id="input1" value="" placeholder="请输入"/></span>
			<span id="Date-picker">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
            </span>
		</div>
		<div class="row row2">
			<span class="span1 spanWidth">模板状态：<Select v-model="model1" clearable>
               <Option v-for="item in templateState" :value="item.value" :key="item.value">{{ item.label }}</Option>
           </Select>
			</span>

			<span class="buttonList">
			<span style="margin-right: 15px;text-decoration: underline;"><a :href="URL">语音质检模板下载</a></span>
			<span class="smallBtn1" @click="showNewTemplet">新建</span>
			<span class="smallBtn2" @click="voiceList">搜索</span>
			<span class="smallBtnDefalt" @click="reSet">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">模板名称</td>
				<td class="colmn2">更新时间</td>
				<td class="colmn3">模板状态</td>
				<td class="colmn4">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td>{{item.name}}</td>
				<td>{{timeFormat(item.updateTime)}}</td>
				<td>{{item.state}}</td>
				<td class="check-more">
					<span @click="revise(item.id)">编辑</span>
					<span class="checkLink" @click="checkDetail(item.id)">设计规则</span>
					<span @click="forbiden(item.id)">禁用</span>
						<span @click="start(item.id)" class="checkLink">启用</span>
						<span @click="confirm(item.id,item.status)">删除</span>
					<!--<span class="rightMore" @click="showDropList($index)">
						<span>更多</span>
					<img src="../../../static/img/arrow.png"/>
					</span>-->
					<div class="dropDownList" v-show="$index == i">
						<div @click="forbiden(item.id)">禁用</div>
						<div @click="start(item.id)">启用</div>
						<div @click="confirm(item.id,item.status)">删除</div>
					</div>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建模板-->
		<bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-templet ref="showTemplate" v-on:childeMethod="voiceList" @cancel="cancel()"></new-templet>
		</bounces>
		<!--修改模板-->
		<bounces v-show="revisebouncesHide" @emitClickPopup="popupShutDown()">
			<revise-templet ref = "showReviseTemplate" v-on:childeMethod="voiceList" @cancel="cancel()"></revise-templet>
		</bounces>
		<!--数据加载等待效果-->
		<Spin fix v-show="loading">
			<div>
				<svg class="circular" viewBox="25 25 50 50">
					<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
				</svg>
			</div>
		</Spin>
	</div>
</template>

<script>
	import newTemplet from '@/components/newTemplet'
	import reviseTemplet from '@/components/reviseTemplate'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading: true,
				URL:'',
				bouncesHide: false,
				revisebouncesHide: false,
				i:-1,
				page: 1,
				pagesize: 0,
				templateName:'',
				totalpageSize: 0,
				tableList:[],
				model1: '',
				dateValue:'',
				value2: ['2016-01-01', '2016-02-15'],
				templateState: [{
						value: '1',
						label: '未启用'
					},
					{
						value: '2',
						label: '启用'
					}
				]
			}
		},
		mounted() {
			this.voiceList();
			//语音质检模板下载
			this.voiceDownLoadAPI();
		},
		methods: {
			//语音质检模板下载
			voiceDownLoadAPI(){
				this.axios.post('/config/voice/inspection/downLoadExcel.do',{
					
				}).then((res)=>{
					if(res.data.code=='0'){
						this.URL = res.data.data.url;
					}
					else{
						
					}
				}).catch((err)=>{
					console.log(err);
				});
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			//时间戳转化成时间格式
			timeFormat(timestamp) {
				//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
				var time = new Date(timestamp);
				var year = time.getFullYear();
				var month = time.getMonth() + 1;
				var date = time.getDate();
				var hours = time.getHours();
				var minutes = time.getMinutes();
				var seconds = time.getSeconds();
				return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
			},
			reSet(){
				this.templateName = '',
				this.dateValue = '',
				this.model1 = ''
				
			},
			//删除确认
			confirm(id, status) {
				if(status === 1 || status === 2) {
					this.$Message.warning("此状态下不可删除");
					return;
				}
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.Delete(id)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//新建点击事件
			showNewTemplet() {
				this.bouncesHide = true;
				this.$refs.showTemplate.initData();
			},
			popupShutDown() {
//				this.revisebouncesHide = false;
//				this.bouncesHide = false;
			},
			cancel(){
				this.bouncesHide = false;
				this.revisebouncesHide = false;
			},
			changePage(page) {
				this.page = page;
				this.voiceList();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.voiceList();
			},
			
			//查看设计规则
			checkDetail(id) {
				this.$router.push({
					name:'designRule',
					query:{
						design_rule: id
					}
				});
			},
			
			//模板列表
			voiceList() {
				var that = this;
				this.axios.post('/config/voice/inspection/list.do', {
					"templateName":that.templateName,
				 	"state":parseInt(that.model1),                //类型：Number  可有字段  备注： 模板状态( 1:未启用 2：启用)
				    "startDate":Date.parse(that.dateValue[0]),                //类型：String  可有字段  备注：创建时间(开始时间)
				    "endDate":Date.parse(that.dateValue[1]),                //类型：String  可有字段  备注：创建时间(结束时间)
					"pageNo": that.page,
					"pageSize": that.pageSize
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
					this.tableList = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
					}else{
						this.$Message.error(res.data.msg)
					}

				}).catch(function(err) {
					console.log(err);
				})
			},
			//查看-修改
			revise(id){
				this.revisebouncesHide = true;
				this.$refs.showReviseTemplate.templteDetail(id);
			},
			//禁用
			forbiden(id){
				//alert(id);
				this.axios.post('/config/voice/inspection/switch/'+id+'/not_enabled.do',{
				}).then((res) =>{
					console.log(res.data.data);
					this.$Message.success(res.data.msg);
					this.voiceList();
				}).catch(function(err){this.$Message.error(res.data.msg);})
			},
			//启用
			start(id){
				this.axios.post('/config/voice/inspection/switch/'+id+'/enabled.do',{
				}).then((res) =>{
					console.log(res.data);
					//alert(res.data.msg);
					this.$Message.success(res.data.msg);
					this.voiceList();
				}).catch(function(err){this.$Message.error(res.data.msg);})
			},
			//删除
			Delete(id){
				this.axios.post('/config/voice/inspection/delete/'+id+'.do',{
				}).then((res) =>{
					console.log(res);
					//alert(res.data.msg);
					this.voiceList();
				}).catch(function(err){})
			}
		},
		components: {
			newTemplet,
			bounces,
			reviseTemplet
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#voiceTest {
		input {
			height: 27px;
			width: 230px;
		}
		.row {
			margin-bottom: 25px;
			position: relative;
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 55px;
			}
			.spanWidth {
				width: 635px;
				display: inline-block;
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
		/*******表单样式*******/
		#tableForm {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #E9E9E9;
			.trHeader {
				td {
					background: #F4F4F4;
				}
			}
			tr,
			td {
				border: 1px solid #E9E9E9 !important;
				padding: 0 1em;
				height: 40px;
			}
			.colmn1 {
				width: 25%;
			}
			.colmn2 {
				width: 27.5%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 32.5%;
			}
			.check-more {
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
	}
</style>