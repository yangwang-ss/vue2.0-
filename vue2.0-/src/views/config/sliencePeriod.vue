<template>
	<div id="speechRateWap">
		<div class="setMessage">
			<div class="title">配置信息</div>
			<div class="inputWap">
				<span>
					<input type="text" value="" placeholder="请输入" ref="startSlience"/>
					<span>% -</span>
				</span>
				<span>
					<input type="text" value="" placeholder="请输入" ref="endingSlience"/>
					<span>%</span>
				</span>
				<span class="space1">
					<span>得分:</span>
				<input type="text" value="" placeholder="请输入" ref="score" />
				</span>
				<span class="space2">
					<span>默认评分:</span>
				<input type="text" value="" placeholder="请输入" ref='defualtScore' />
				</span>
				<span class="smallBtn1" @click="newsliencedesign_Rule">新建</span>
			</div>
		</div>
		<!--表单-->
		<table class="tableForm">
			<tr class="trHeader">
				<td>静默时长占比</td>
				<td>得分</td>
				<td>默认得分</td>
				<td>操作</td>
			</tr>
			<tr v-for="item in slienceList">
				<td class="colmn1">{{item.startSlience}}-{{item.endingSlience}}</td>
				<td class="colmn2">{{item.score}}</td>
				<td class="colmn3">{{item.defualtScore}}</td>
				<td class="colmn4"><span class="delete" @click="confirm(item.id)">删除</span></td>
			</tr>
		</table>
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
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				slienceList: []

			}
		},
		mounted() {
			this.sliencedesign_Rule();
		},
		methods: {
			//静默时间设计规则接口
			sliencedesign_Rule() {
				var that = this;
				const designRuleId = this.$route.query.design_rule;
				this.axios.post('/config/voice/inspection/rule/silence/list/' + designRuleId + '/.do', {
					"pageNo": that.page,
					"pageSize": that.pageSize
				}).then((res) => {
					console.log(res)
					this.slienceList = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
				}).catch(function(err) {})
			},
			//新建静默时间占比规则
			newsliencedesign_Rule() {
				var that = this;
				if (this.$refs.startSlience.value==''||this.$refs.endingSlience.value==''||this.$refs.score.value==''||this.$refs.defualtScore.value=='') {
					this.$Message.info('新建信息不完整');
					return;
				}
				const designRuleId = this.$route.query.design_rule;
				let startSlience = this.$refs.startSlience.value;
				let endingSlience = this.$refs.endingSlience.value;
				let score = this.$refs.score.value;
				let defualtScore = this.$refs.defualtScore.value;
				this.axios.post('/config/voice/inspection/rule/silence/add.do', {
					"templetId": designRuleId, //类型：String  必有字段  备注：模板id
					"startSlience": startSlience, //类型：Number  必有字段  备注：{ "code": 0, "msg": "", "data": {} }
					"endingSlience": endingSlience, //类型：Number  必有字段  备注：无
					"score": score, //类型：Number  必有字段  备注：无
					"defualtScore":defualtScore //类型：Number  必有字段  备注：无
				}).then((res) => {
					if(res.data.code=='0'){
						this.slienceList = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
					this.sliencedesign_Rule();
					this.$Message.success(res.data.msg);
					}
					else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			//删除确认
			confirm(id) {
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
                    onOk: () => {
                    	this.deleteSlienceItem(id);
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
           },
			//删除静默时间占比列表项
			deleteSlienceItem(id){
				const designRuleId = this.$route.query.design_rule;
				this.axios.post('/config/voice/inspection/rule/silence/delete/'+designRuleId+'/'+id+'.do',{
				}).then((res) =>{
					console.log(res);
					this.sliencedesign_Rule();
				}).catch(function(err){
					console.log(err);
				});
			},
			changePage(page) {
				this.page = page;
				this.sliencedesign_Rule();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.sliencedesign_Rule();
			}
		}
	}
</script>

<style scoped lang="scss">
	#speechRateWap {
		.setMessage {
			height: 120px;
			background: #F7F7F7;
			border-radius: 5px;
			padding: 15px 20px;
			margin-bottom: 20px;
			.inputWap {
				margin-top: 20px;
				width: 70%;
				margin-left: 35px;
				white-space: nowrap;
				input {
					width: 80px;
					height: 30px;
					line-height: 30px;
				}
				.space1 {
					margin-left: 2em;
				}
				.space2 {
					margin-left: 1.5rem;
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
				width: 35%;
			}
			.colmn2 {
				width: 30%;
			}
			.colmn3 {
				width: 20%;
			}
			.delete {
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