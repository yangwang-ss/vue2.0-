<template>
	<div class="add-main">
		<Row class="add-header">
			<Col span="24">
			<span class="h42" @click="viewJump(0)">知识库/</span>
			<span class="h42" @click="viewJump(1)">{{knowledgeBaseName}}/</span>
			<span class="h41">{{identification.titleText}}</span>
			</Col>
		</Row>
		<div class="add-name">
			<p class="information-xs">标准问题<i style="color:red;">*</i>：</p>
			<div class="add-nameContent">
				<input type="text" class="inputText" placeholder="请输入" v-model="question.labelling">
			</div>
		</div>
		<div class="add-name">
			<p class="information-xs">相似问题：</p>
			<div class="add-nameContent">
				<div class="nameContent-list" v-for="(item,index) in question.similarity">
					<input type="text" class="inputText" placeholder="请输入" v-model="item.value">
					<span @click="deleteQuestionSimilarity(index)"><i data-v-0c04591f=""
                                                            class="icon iconfont icon-retract"></i></span>
					<span @click="addQuestionSimilarity()"><i data-v-0c04591f="" class="icon iconfont icon-spread"
                                                    v-if="index===(question.similarity.length-1)"></i></span>
				</div>
			</div>
		</div>
		<div class="add-name">
			<p class="information-xs">对外答案：</p>
			<div class="add-nameContent">
				<div class="nameContent-list listArea" v-for="(item,index) in foreign.answer">
					<textarea cols="30" rows="5" placeholder="请输入" v-model="item.value"></textarea>
					<span @click="deleteForeignAnswer(index)"><i data-v-0c04591f="" class="icon iconfont icon-retract"></i></span>
					<span @click="addForeignAnswer()"><i  class="icon iconfont icon-spread"
                                               v-if="index===(foreign.answer.length-1)"></i></span>
				</div>
			</div>
		</div>
		<div class="add-name">
			<p class="information-xs">对内答案：</p>
			<div class="add-nameContent">
				<div v-for="(item,index) in internal.answer" class="nameContent-list listArea">
					<textarea rows="5" placeholder="请输入" v-model="item.value"></textarea>
					<span @click="deleteInternalAnswer(index)"><i data-v-0c04591f=""
                                                        class="icon iconfont icon-retract"></i></span>
					<span v-if="index==(internal.answer.length-1)" @click="addInternalAnswer()"><i data-v-0c04591f=""
                                                                                         class="icon iconfont icon-spread"></i></span>
				</div>
			</div>
		</div>
		<div class="classification">
			<p class="information-xs">问题分类<i style="color:red;">*</i>：</p>
			<span @click="relatedKnowledge(0)">{{parentQuestion.name}}</span>
		</div>
		<div class="classification">
			<p class="information-xs">所属知识点：</p>
			<span @click="relatedKnowledge(1)">关联已有知识点</span>
		</div>
		<div class="add-name">
			<p class="information-xs">有效期设置：</p>
			<div>
				<span class="span smallBtnDefalt" @click="enablement(0)" :class="{'enablementActive':enablementStatus}">启用</span>
				<span class="span smallBtnDefalt" @click="enablement(1)" :class="{'enablementActive':!enablementStatus}">停用</span>
			</div>
			<div class="add-radio">
				<Radio-group v-model="validity.enablement">
					<Radio label="永久有效"></Radio>
					<Radio label="自定义有效期"></Radio>
				</Radio-group>
				<Date-picker type="daterange" v-if="question.validity===0" format="yyyy-MM-dd" placement="bottom-start" v-model="validity.callTime" placeholder="选择日期"></Date-picker>
				</Col>
			</div>
		</div>
		<div class="add-submit">
			<span class="span smallBtn2" @click="submit()">提交</span>
		</div>
		<v-bounces v-if="bouncesHide" @emitClickPopup="">
			<v-associated @shutDown="bouncesHide=false" :title="associatedTitle" :knowledgeBaseId="knowledgeBaseId" :points="knowledge.poin" questionAndknowledge="question" @preservationKnowledge="preservationKnowledge()" @addKnowledge="addKnowledge($event)">

			</v-associated>
		</v-bounces>
		<v-bounces v-if="questionTypeHide" @emitClickPopup="">
			<v-questionType @shutDown="questionTypeHide=false" :knowledgeBaseId="knowledgeBaseId" :nodeClassId="parentQuestion.classId" @determine="determine()" @beforeClick="beforeClick($event)"></v-questionType>
		</v-bounces>
	</div>
</template>
<script>
	import bounces from "@/components/btm-bounces.vue"
	import associated from "./associated.vue"
	import questionType from "./questionType.vue"
	export default {
		data() {
			return {
				enablementStatus: true,
				knowledgeBaseId: this.$route.query.id, // 知识库id
				questionId: this.$route.query.questionId, //问题id
				identification: { // 添加和修改的标识
					add: null,
					titleText: "添加问题",
					iable: 0
				},
				knowledgeBaseName: this.$route.query.name, // 知识库名称
				buildKnowledgeId: this.$route.query.buildKnowledgeId, //知识点id
				status: true,
				associatedTitle: "所属知识点",
				bouncesHide: false,
				questionTypeHide: false,
				similarity: {
					answer: [{
						value: ""
					}]
				},
				foreign: {
					answer: [{
						value: ""
					}]
				},
				internal: {
					answer: [{
						value: ""
					}]
				},
				question: {
					labelling: "",
					classification: "",
					state: 1,
					validity: 1,
					points: [],
					category: null,
					list: [{
							name: "问题分类1",
							id: "1"
						},
						{
							name: "问题分类2",
							id: "2"
						}
					],
					similarity: [{
						value: ""
					}]
				},
				knowledge: {
					poin: "",
					ids: [],
					list: [{
							name: "知识点1",
							id: "1"
						},
						{
							name: "知识点2",
							id: "2"
						},
					]
				},
				validity: {
					enablement: "永久有效",
					callTime: null
				},
				parentQuestion: {
					name: "选择所有问题分类",
					classId: null,
					label: ""
				}
			}
		},
		components: {
			"v-bounces": bounces,
			"v-associated": associated,
			"v-questionType": questionType
		},
		methods: {
			getQuestionParticulars() {
				// 修改回填--
				let categoryVos = [],
					arr = [];
				if(this.questionId) {
					this.axios.get("/knowledge/question/detail/" + this.questionId + ".do").then((res) => {
						if(res.data.code === "0") {
							// category  类别
							this.question.labelling = res.data.data.question;
							this.question.similarity = res.data.data.similarQuestion;
							this.foreign.answer = res.data.data.foreignAnswer;
							this.internal.answer = res.data.data.internallyAnswer;
							this.validity.enablement = res.data.data && res.data.data.validity === 1 ? "永久有效" : "自定义有效期";
							this.parentQuestion.classId = res.data.data.category; // 类别id
							this.knowledge.poin = res.data.data.points;
							arr.push(res.data.data.validityStart);
							arr.push(res.data.data.validityEnd);
							this.validity.callTime = arr.length > 0 ? arr : null; // 自定义时间
							res.data.data.categoryVos.map((item) => {
								categoryVos.push(item.name)
							});
							this.parentQuestion.name = categoryVos.join("=>")
							this.knowledge.poin.map((item) => {
								this.knowledge.ids.push(item.pointId)
							});
						} else {
							return
						}
					}).catch((err) => {
						console.log(err, "问题详情shib")
					})
				}

			},
			getModification(content) {
				// 修改问题
				this.identification.iable++;
				this.axios.post("/knowledge/question/modify/" + this.questionId + ".do", {
					"question": content.question,
					"category": content.category ? content.category : this.parentQuestion.classId, //类别
					"knowledgeBaseId": this.knowledgeBaseId,
					"points": content.points ? content.points : this.knowledge.ids,
					"state": content.state,
					"validity": content.validity,
					"validityStart": content.validityStart,
					"validityEnd": content.validityEnd,
					"similarQuestion": content.similarQuestion,
					"foreignAnswer": content.foreignAnswer,
					"internallyAnswer": content.internallyAnswer
				}).then((res) => {
					if(res.data.code === "0") {
						this.$Message.success({
							content: "修改成功",
							duration: 0.5,
							onClose: () => {
								window.sessionStorage.removeItem("correlateList");
								this.$router.push({
									path: "/knowledgeBaseName",
									query: {
										id: this.knowledgeBaseId,
										iableQuestion: this.identification.iable
									}
								})
							}
						})
					} else {
						return;
					}
				}).catch((err) => {
					console.log(err, "知识库修改s列表111")
				})
			},
			getAddQuestion(content) {
				this.identification.iable++;
				// 添加提交
				this.axios.post("/knowledge/question/add.do", {
					"question": content.question,
					"category": content.category, //类别
					"knowledgeBaseId": this.knowledgeBaseId,
					"points": content.points,
					"state": content.state,
					"validity": content.validity,
					"validityStart": content.validityStart,
					"validityEnd": content.validityEnd,
					"similarQuestion": content.similarQuestion,
					"foreignAnswer": content.foreignAnswer,
					"internallyAnswer": content.internallyAnswer
				}).then((res) => {
					if(res.data.code === "0") {
						this.$Message.success({
							content: "提交成功",
							duration: 0.5,
							onClose: () => {
								window.sessionStorage.removeItem("correlateList");
								this.$router.push({
									path: "/knowledgeBaseName",
									query: {
										id: this.knowledgeBaseId,
										iableQuestion: this.identification.iable
									}
								})
							}
						})
					} else {
						return;
					}
				}).catch((err) => {
					console.log(err, "知识库问题列表111")
				})
			},
			deleteForeignAnswer(index) {
				// 删除
				if(this.foreign.answer.length > 1) {
					this.foreign.answer.splice(index, 1);
				} else {
					this.$Message.warning("抱歉,不能再删了")
				}
			},
			viewJump(index) {
				switch(index) {
					case 0:
						{
							this.$router.push({
								path: "/knowledgeBaseIndex"
							});
							break
						}
					case 1:
						{
							this.$router.push({
								path: "/knowledgeBaseName",
								query: {
									id: this.knowledgeBaseId
								}
							});
							break
						}
				}

			},
			addForeignAnswer() {
				//新增
				let arr = {
					value: ""
				};
				this.foreign.answer.push(arr);
			},
			deleteInternalAnswer(index) {
				// 删除
				if(this.internal.answer.length > 1) {
					this.internal.answer.splice(index, 1);
				} else {
					this.$Message.warning("抱歉,不能再删了")
				}
			},
			submit() {
				// 提交
				let content = {
					question: this.question.labelling, //标注问题
					category: this.question.category, //类别
					points: this.question.points, // 关联知识点id
					similarQuestion: this.question.similarity, //相似问题
					foreignAnswer: this.foreign.answer, //对外答案
					internallyAnswer: this.internal.answer, //对内答案
					state: this.question.state, // 启用停用
					validity: this.question.validity, // 永久、自定义
					validityStart: this.validity.callTime ? Date.parse(this.validity.callTime[0]) : null, //开始时间
					validityEnd: this.validity.callTime ? Date.parse(this.validity.callTime[1]) : null //结束时间
				};
				if(this.questionId) {
					this.getModification(content)
				} else {
					this.getAddQuestion(content)
				}
			},
			beforeClick(e) {
				// 问题分类节点点击
				let nodeArr = [];
				let question = [];
				this.question.category = e.treeNode.id;
				this.parentNode(e.treeNode, nodeArr);
				for(let i = nodeArr.length - 1; i >= 0; i--) {
					question.push(nodeArr[i])
				}
				this.parentQuestion.label = question.length > 1 ? question.join("=>") : question.join();
			},
			parentNode(t, arr) {
				arr.push(t.name);
				if(t.level != 0) {
					// 递归
					this.parentNode(t.getParentNode(), arr)
				}
			},
			determine() {
				// 确定按钮
				this.questionTypeHide = false;
				this.parentQuestion.name = this.parentQuestion.label;
			},
			enablement(index) {
				switch(index) {
					case 0:
						{
							this.enablementStatus = true;
							this.question.state = 1;
							break
						}
					case 1:
						{
							this.enablementStatus = false;
							this.question.state = 2;
							break
						}
				}
			},
			addInternalAnswer() {
				// 新增
				let arr = {
					value: ""
				};
				this.internal.answer.push(arr);
			},
			addKnowledge(list) {
				if(list.length > 0) {
					let arr = [];
					list.map(function(item) {
						arr.push(item.id)
					});
					this.question.points = arr;
					this.bouncesHide = false;
				} else {
					this.$Message.info("请选择关联")
				}
			},
			preservationKnowledge() {
				// 组件传过来的事件-保存
				this.bouncesHide = false;
			},
			addQuestionSimilarity() {
				let arr = {
					value: ""
				};
				this.question.similarity.push(arr);
			},
			deleteQuestionSimilarity(index) {
				if(this.question.similarity.length > 1) {
					this.question.similarity.splice(index, 1);
				} else {
					this.$Message.warning("抱歉,不能再删了")
				}
			},
			relatedKnowledge(index) {
				switch(index) {
					case 0:
						{
							this.questionTypeHide = true;
							break;
						}
					case 1:
						{
							this.bouncesHide = true;
							break
						}
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getQuestionParticulars();
			})

		},
		created() {
			if(this.questionId) {
				this.identification.titleText = "修改问题";
			} else {
				this.identification.titleText = "添加问题";
			}
		},
		activated() {
			this.identification.add = this.$route.query.identification;
			this.questionId = this.$route.query.questionId;
		},
		watch: {
			"validity.enablement" (v) {
				switch(v) {
					case "永久有效":
						{
							this.question.validity = 1;
							break
						}
					case "自定义有效期":
						{
							this.question.validity = 0;
							break
						}
				}
			},
			"questionId" () {
				this.getQuestionParticulars();
			},
			"identification.add" () {
				this.question.labelling = "";
				this.question.similarity = [{
					value: ""
				}];
				this.foreign.answer = [{
					value: ""
				}];
				this.internal.answer = [{
					value: ""
				}];
				this.parentQuestion.classId = ""; // 类别id
				this.knowledge.poin = "";
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.add-main {
		width: 100%;
	}
	
	.add-header {
		padding: 20px 0 30px 0;
	}
	
	.span {
		display: inline-block;
		text-align: center;
		&.enablementActive {
			background: #108EE9;
			color: #fff;
		}
	}
	
	.add-name {
		padding-left: 200px;
		width: 100%;
		padding-bottom: 20px;
		overflow: hidden;
		.smallBtnDefalt {
			margin-left: 10px;
		}
		.add-radio {
			padding-top: 20px;
			padding-left: 100px;
		}
		p {
			float: left;
			text-align: right;
			width: 100px;
			padding-right: 10px;
		}
		.add-nameContent {
			float: left;
		}
		.nameContent-list {
			padding-bottom: 20px;
			&:last-child {
				padding-bottom: 0;
			}
			span {
				margin-left: 7px;
				cursor: pointer;
			}
		}
		.listArea {
			overflow: hidden;
			textarea {
				float: left;
				width: 230px;
				overflow: hidden;
			}
			span {
				display: inline-block;
				vertical-align: top;
				margin-top: 5px;
				margin-left: 10px;
			}
		}
	}
	
	.classification {
		padding-left: 200px;
		padding-bottom: 20px;
		p {
			width: 100px;
			padding-right: 5px;
			text-align: right;
			display: inline-block;
		}
		span {
			cursor: pointer;
			color: #0a6fc1;
			font-size: 14px;
		}
	}
	
	.add-submit {
		width: 100%;
		padding-left: 300px;
	}
</style>