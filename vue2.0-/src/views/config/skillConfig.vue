<template>
	<div id="menu">
		<div>
			<span class="h41">技能配置</span>
		</div>
		<div class="leftWap">
			<div class="menuTitle">分类</div>
			<div>
				<!--<div v-if='ztreeDataSource.length>0'>
					<vue-ztree :list.sync='ztreeDataSource' :func='nodeClick' :is-open='false'></vue-ztree>
				</div>-->
				<div class="zTreeDemoBackground left" style="margin-top: 15px;">
					<ul id="treeDemo" class="ztree" ref="ztree"></ul>
				</div>
			</div>
		</div>
		<div class="rightWap">
			<div class="flexRow">
				<input type="text" placeholder="搜索技能名称" style="width: 304px;height: 32px;" v-model="skillName" />
				<span class="buttonList">
			<span class="smallBtn1" @click="showNewSkill">新建</span>
				<span class="smallBtn2" @click="skillList">搜索</span>
				<span class="smallBtnDefalt" @click="resetData">重置</span>
				</span>
			</div>
			<table cellspacing="0" cellpadding="0" id="tableForm">
				<tr class="trHeader">
					<td class="colmn1">技能名称</td>
					<td class="colmn2">描述</td>
					<td class="colmn3">操作</td>
				</tr>
				<tr v-for="item in skillLists">
					<td>{{item.name}}</td>
					<td>{{item.description}}</td>
					<td>
						<div class="operation">
							<span class="checkLink" @click="editSkill(item.id)">编辑</span>
							<span @click="skillConfirm(item.id)">删除</span>
						</div>
					</td>
				</tr>
			</table>
			<!--分页插件-->
			<div id="page">
				<Page :total="totalpageSize" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
			</div>
		</div>
		<!--新建技能-->
		<bounces v-show="bouncesHide1" @emitClickPopup="popupShutDown()">
			<new-skill @cancel="cancel()" v-on:childeMethod="totalpageSizes"></new-skill>
		</bounces>
		<!--修改技能-->
		<bounces v-show="bouncesHide2" @emitClickPopup="popupShutDown()">
			<revise-skill ref="reviseSkillId" @cancel="cancel()" v-on:childeMethod="totalpageSizes"></revise-skill>
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
	import vueZtree from '@/views/config/vue-ztree.vue'
	import newSkill from '@/views/config/newSkill'
	import reviseSkill from '@/views/config/reviseKill'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				loading:true,
				skillLists: [],
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				skillName: '',
				bouncesHide1: false,
				bouncesHide2: false,
				parentNodeModel: [], //当前点击节点父亲对象
				nodeModel: null, // 当前点击节点对象
				form_model1: '',
				form_model2: '',
				zNodes: [],
				setting: {
					view: {
						addHoverDom: this.addHoverDom,
						removeHoverDom: this.removeHoverDom,
						selectedMulti: false,
						showIcon: true
					},
					edit: {
						enable: true,
						editNameSelectAll: true,
						showRemoveBtn: false,
						showRenameBtn: false
					},
					data: {
						key: {
							name: "label"
						},
						simpleData: {
							enable: true,
						}
					},
					callback: {
						beforeDrag: this.beforeDrag,
						beforeEditName: this.beforeEditName,
						beforeRemove: this.beforeRemove,
						beforeRename: this.beforeRename,
						onRemove: this.onRemove,
						beforeClick: this.beforeClick,
						//            onRename: this.onRename
					}
				},
				treeNodeId: null

			}
		},
		mounted() {
			this.menuList();
			//技能分类列表
			this.skillList();
		},
		components: {
			newSkill,
			reviseSkill,
			bounces
		},
		methods: {
			//重置
			resetData() {
				this.skillName = '';
			},
			//技能菜单事件
			beforeClick(treeld, treeNode, clickFlag) {
				console.log(treeNode);
				// 点击节点
				this.renderSkillList(treeNode.id);
				
			},
			beforeEditName(treeId, treeNode) {
				//编辑状态前
				let zTree = $.fn.zTree.getZTreeObj("treeDemo");
				zTree.selectNode(treeNode);
				zTree.editName(treeNode);
				return false;
			},
			beforeRemove(treeId, treeNode) {
				//删除节点之前的回掉函数
				let zTree = $.fn.zTree.getZTreeObj("treeDemo");
				zTree.selectNode(treeNode);
				return confirm("确认删除-- " + treeNode.name + " 吗？");
			},
			onRemove(e, treeId, treeNode) {
				console.log(treeNode, "id")
				this.$Message.success("删除成功,请点保存")
				//        this.getRemoveNode(treeNode.id)
				//        confirm("你已删除" + treeNode.name)
			},
			//编辑树节点名称
			beforeRename(treeId, treeNode, newName, isCancel) {
				// 编辑名称下--失去焦点或者enter的回调
				console.log(treeNode, "hisa")
				treeNode.isModify = true;
				if(newName.length == 0) {
					let zTree = $.fn.zTree.getZTreeObj("treeDemo");
					zTree.cancelEditName();
					this.$Message.info("修改节点不能为空")
					return false;
				} else {
					//this.getPreservationNode();
					//this.$Message.info("修改成功,请点保存")
					return true;
				}

			},
			onRename(e, treeId, treeNode, isCancel) {
				// 捕获节点编辑名称结束之后的事件回调函数
			},
			showRemoveBtn(treeId, treeNode) {
				return !treeNode.isFirstNode;
			},
			showRenameBtn(treeId, treeNode) {
				return !treeNode.isLastNode;
			},
			
			removeHoverDom(treeId, treeNode) {
				$("#addBtn_" + treeNode.tId).unbind().remove();
			},
			//新建技能
			showNewSkill() {
				this.bouncesHide1 = true;
			},
			//编辑技能
			editSkill(id) {
				this.bouncesHide2 = true;
				this.$refs.reviseSkillId.skillMessage(id);
			},
			// 技能删除确认
			skillConfirm(id) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.deleteSkil(id);
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			//技能删除
			deleteSkil(id) {
				this.axios.post('/config/deleteSkill.do', {
					"id": id, //类型：String  必有字段  备注：技能id
				}).then((res) => {
					if(res.data.code == 0) {
						this.$Message.success(res.data.msg);
						this.skillList();
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			popupShutDown() {
//				this.bouncesHide1 = false;
//				this.bouncesHide2 = false;
			},
			cancel() {
				this.bouncesHide1 = false;
				this.bouncesHide2 = false;
			},
			//菜单列表
			menuList() {
				this.axios.post('/enterprise/getUserSkillForSkillList.do', {
					//"id": 1, //类型：String  可有字段  备注：无
					//"name": "mock", //类型：String  可有字段  备注：菜单名称
					//"parentId": "mock" //类型：String  可有字段  备注：父节点Id
				}).then((res) => {
					if(res.data.code == '0') {
						$.fn.zTree.init($("#treeDemo"), this.setting, res.data.data.result);
						this.loading = false;
					}
					//					this.ztreeDataSource = res.data.data.result;
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage(page) {
				this.page = page;
				this.skillList();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.skillList();
			},
			totalpageSizes(totalpageSize) {
				this.totalpageSize = totalpageSize;
				this.skillList();
			},
			//技能分类列表
			skillList() {
				var that = this;
				this.axios.post('/config/getSkillList.do', {
					"name": that.skillName, //类型：String  必有字段  备注：技能名称
					"pageNo": that.page, //类型：String  必有字段  备注：查询开始页
					"pageSize": that.pageSize //类型：String  必有字段  备注：每页数量
				}).then((res) => {
					this.skillLists = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
				}).catch((err) => {
					console.log(err)
				});
			},
			//点击菜单请求技能列表
			renderSkillList(id){
				this.axios.post("/config/getClasslySkill.do",{
					"skillClassifyId":id                //类型：String  必有字段  备注：无
				}).then((res)=>{
					if (res.data.code=='0') {
						this.skillLists = res.data.data.result;
					this.totalpageSize = res.data.data.totalItems;
					} else{
						this.$Message.error(res.data.msg);
					}
				})
			}

		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../../static/css/zTreeStyle/zTreeStyle.css";
	#menu {
		overflow: hidden;
		.leftWap {
			float: left;
			width: 23%;
			border: 1px solid #E9E9E9;
			min-height: 450px;
			border-radius: 5px;
			.menuTitle {
				height: 50px;
				line-height: 50px;
				text-align: center;
				font-size: 16px;
				font-weight: bold;
				border-bottom: 1px solid #ccc;
				background: #F4F4F4;
			}
			.middleBtn1 {
				margin-left: 60px;
			}
		}
		.rightWap {
			color: #666;
			float: left;
			width: 72%;
			margin-left: 3em;
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
			.flexRow {
				display: flex;
				justify-content: space-between;
				margin-bottom: 15px;
			}
			#tableForm {
				.trHeader {
					td {
						background: #F4F4F4;
					}
				}
				width: 100%;
				.colmn1 {
					width: 20%;
				}
				.colmn2 {
					width: 50%;
				}
				.colmn3 {
					width: 30%;
				}
			}
			.operation {
				position: relative;
				span {
					color: #108EE9;
					display: inline-block;
					cursor: pointer;
				}
				.checkLink {
					&:before {
						content: "";
						display: block;
						width: 0;
						height: 15px;
						left: 0px;
						top: 12px;
						position: absolute;
						background: #E9E9E9;
					}
				}
			}
		}
	}
</style>