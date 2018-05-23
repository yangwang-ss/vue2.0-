<template>
	<div id="speechRateWap">
		<div class="setMessage">
			<div class="title">配置信息</div>
			<div class="inputWap">
				<span class="firstM">类型:</span>
				<label class="radio1">加分<input type="radio"  v-model="scoreType" value="1" name="scoreType"></label>
				<label class="radio1">减分<input type="radio" v-model="scoreType" value="2" name="scoreType"></label>
				<span class="space1">
					<span class="firstM2">加减单词分数:</span>
				<input type="text" value="" placeholder="请输入" v-model="add_reduce_Score" />
				</span>
				<span class="space1">
					<span class="firstM2">最高次数:</span>
				<input type="text" value="" placeholder="请输入" v-model="bestScore" />
				</span>
			</div>
			<div class="inputWap">
				<span class="firstM">关键字角色:</span>
				<label class="radio1">客服<input type="radio" v-model="roleType" value="1" name="roleType"></label>
				<label class="radio1">客户<input type="radio" v-model="roleType" value="2" name="roleType"></label>
				<span class="space1">
					<span class="firstM2">关键字:</span>
				<input type="text" value="" placeholder="请输入" v-model="keyWord" />
				</span>
				<span class="space1" style="visibility:hidden ;">
					<span class="firstM2">得分:</span>
				<input type="text" value="" placeholder="请输入" v-model="getScore" />
				</span>
				<span class="smallBtn1" @click="newKeywordRule">新建</span>
			</div>
		</div>
		<!--表单-->
		<table class="tableForm">
			<tr class="trHeader">
				<td>关键字</td>
				<td>加减分</td>
				<td>分数</td>
				<td>最高次数</td>
				<td>操作</td>
			</tr>
			<tr v-for="item in keyRuleList">
				<td class="colmn1">{{item.context}}</td>
				<td class="colmn2">{{item.scoreTypeStr}}</td>
				<td class="colmn3">{{item.score}}</td>
				<td class="colmn3">{{item.timeMax}}</td>
				<td class="colmn5"><span class="delete" @click="confirm(item.id)">删除</span></td>
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
				keyRuleList: [],
				scoreType: '', //加分-减分
				add_reduce_Score: '', //加减单词分数
				roleType: 0, //关键字角色,
				bestScore: 0, //最高次数
				keyWord: '', //关键字
				getScore: 0 //得分
			}
		},
		mounted() {
			this.keyWordDesignRule();
		},
		methods: {
			//关键词设置设计规则接口
			keyWordDesignRule() {
				var that = this;
				const designRuleId = this.$route.query.design_rule;
				this.axios.post('/config/voice/inspection/rule/keyword/list/' + designRuleId + '/.do', {
					"pageNo": that.page,
					"pageSize": that.pageSize
				}).then((res) => {
					console.log(res)
					this.keyRuleList = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
				}).catch(function(err) {})
			},
			changePage(page) {
				this.page = page;
				this.keyWordDesignRule();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.keyWordDesignRule();
			},
			//新建关键词设计规则
			newKeywordRule() {
				var that = this;
				if (this.add_reduce_Score==''||this.bestScore==''||this.keyWord==''||this.scoreType==''||this.roleType=='') {
					this.$Message.info('新建信息不完整');
					return;
				}
				const designRuleId = this.$route.query.design_rule;
				this.axios.post('/config/voice/inspection/rule/keyword/add.do', {
					"templetId": designRuleId, //类型：String  必有字段  备注：无
					"context": that.keyWord, //类型：String  必有字段  备注：关键词
					"timeMax": that.bestScore, //类型：Number  必有字段  备注：最高次数
//					"defualtScore": that.getScore, //类型：Number  必有字段  备注：分数
					"score":parseInt(that.add_reduce_Score),//加减分
					"scoreType": parseInt(that.scoreType), //类型：Number  必有字段  备注：分数类型 1、加分 2、减分
					"roleType": parseInt(that.roleType) //类型：Number  必有字段  备注：1、客服2、客户 3.客服和客户全部
				}).then((res) => {
					if(res.data.code=='0'){
						this.slienceList = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
					this.keyWordDesignRule();
					this.$Message.success(res.data.msg);
					}else{
						this.$Message.error(res.data.msg);
						return false;
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
                    	this.deleteKeyWordRule(id);
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
           },
			//删除关键词设计规则项
			deleteKeyWordRule(id) {
				const designRuleId = this.$route.query.design_rule;
				this.axios.post('/config/voice/inspection/rule/keyword/delete/' + designRuleId + '/' + id + '.do', {}).then((res) => {
					console.log(res);
					this.keyWordDesignRule();
				}).catch(function(err) {
					console.log(err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	#speechRateWap {
		.setMessage {
			height: 140px;
			background: #F7F7F7;
			border-radius: 5px;
			padding: 15px 20px;
			margin-bottom: 20px;
			.inputWap {
				white-space: nowrap;
				* {
					vertical-align: middle;
				}
				input[type="text"] {
					width: 80px;
					height: 30px;
					line-height: 30px;
				}
				.firstM {
					margin-right: 4em;
					display: inline-block;
					width: 80px;
					text-align: right;
				}
				.firstM2 {
					display: inline-block;
					width: 80px;
					text-align: right;
				}
				.radio1 {
					margin-right: 2em;
				}
				margin-top: 10px;
				width: 80%;
				margin-left: 35px;
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
				width: 30%;
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