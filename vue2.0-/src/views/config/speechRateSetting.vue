<template>
	<div id="speechRateWap">
		<div class="setMessage">
			<div class="title">配置信息</div>
			<div class="inputWap">
				<span>
					<input type="text" value="" placeholder="请输入" ref="startSpeed"/>
					<span>字/秒-</span>
				</span>
				<span>
					<input type="text" value="" placeholder="请输入" ref="endingSpeed"/>
					<span>字/秒</span>
				</span>
				<span class="space1">
					<span>得分:</span>
					<input type="text" value="" placeholder="请输入" ref="score"/>
				</span>
				<span class="space2">
					<span>默认评分:</span>
					<input type="text" value="" placeholder="请输入" ref="defualtScore"/>
				</span>
				<span class="smallBtn1" @click="newS_Rule">新建</span>
			</div>
		</div>
		<!--表单-->
		<table class="tableForm">
			<tr class="trHeader">
				<td>语速(字/秒)</td>
				<td>得分</td>
				<td>默认得分</td>
				<td>操作</td>
			</tr>
			<tr v-for="item in voiceSpeedList">
				<td class="colmn1">{{item.startSpeed}}-{{item.endingSpeed}}</td>
				<td class="colmn2">{{item.score}}</td>
				<td class="colmn3">{{item.defualtScore}}</td>
				<td class="colmn4"><span class="delete" @click="confirm(item.id)">删除</span></td>
			</tr>
		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="totalpageSize" show-elevator  show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				voiceSpeedList:[]
			}
		},
		mounted(){
			this.design_Rule();
		},
		methods:{
			//语速设置设计规则接口
			design_Rule(){
			var that = this;
			const designRuleId = this.$route.query.design_rule;
				this.axios.post('/config/voice/inspection/rule/speed/list/'+designRuleId+'/.do',{
					 "pageNo":that.page,
					 "pageSize":that.pageSize 
				}).then((res) =>{
					console.log(res)
					this.voiceSpeedList = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
				}).catch(function(err){})
			},
			//新建语速设置设计规则接口
			newS_Rule(){
				if (this.$refs.startSpeed.value==''||this.$refs.endingSpeed.value==''||this.$refs.score.value==''||this.$refs.defualtScore.value=='') {
					this.$Message.info('新建信息不完整');
					return;
				}
				const designRuleId = this.$route.query.design_rule;
				//alert(designRuleId);
				let startSpeed = this.$refs.startSpeed.value;
				let endingSpeed = this.$refs.endingSpeed.value;
				let score = this.$refs.score.value;
				let defualtScore = this.$refs.defualtScore.value;
				this.axios.post('/config/voice/inspection/rule/speed/add.do',{
					"templetId":designRuleId,                //类型：String  必有字段  备注：无
				    "startSpeed":startSpeed,                //类型：Number  必有字段  备注：无
				    "endingSpeed":endingSpeed,                //类型：Number  必有字段  备注：无
				    "score":score,                //类型：Number  必有字段  备注：无
				    "defualtScore":defualtScore               //类型：Number  必有字段  备注：无
				}).then((res)=>{
					if(res.data.code=='0'){
						this.design_Rule();
						this.$Message.success(res.data.msg);
					}else{
						this.$Message.error(res.data.msg);
						return false;
					}
					
				}).catch(function(err){
					console.log(err);
				})
			},
			 confirm (id) {
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
                    onOk: () => {
                    	this.deleteRuleList(id);
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
           },
			//删除语速规则列表
			deleteRuleList(id){
				const designRuleId = this.$route.query.design_rule;
				this.axios.post('/config/voice/inspection/rule/speed/delete/'+designRuleId+'/'+id+'.do',{
				}).then((res) =>{
					console.log(res);
					this.design_Rule();
				}).catch(function(err){
					console.log(err);
				});
			},
			changePage(page) {
				this.page = page;
				this.design_Rule();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.design_Rule();
			}
		}
	}
</script>

<style scoped lang = "scss">
	#speechRateWap{
		.setMessage{
			height: 120px;
			background: #F7F7F7;
			border-radius: 5px;
			padding: 15px 20px;
			margin-bottom: 20px;
			.inputWap{
				margin-top: 20px;
				width: 70%;
				margin-left: 35px;
				white-space: nowrap;
				input{
					width: 80px;
					height: 30px;
					line-height: 30px;
				}
				.space1{
					margin-left: 2em;
				}
				.space2{
					margin-left: 1.5rem;
				}
				.smallBtn1{
					display: inline-block;
					margin-left: 4em;
					text-align: center;
				}
			}
		}
		.tableForm{
			.colmn1{
				width: 35%;
			}
			.colmn2{
				width: 30%;
			}
			.colmn3{
				width: 20%;
			}
			.delete{
				display: inline-block;
				width: 80px;
				height: 40px;
				cursor: pointer;
				line-height: 40px;
				color: #10AAF1;
			}
		}
	}
</style>