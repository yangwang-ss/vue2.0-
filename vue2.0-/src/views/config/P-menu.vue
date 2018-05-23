<template>
	<div id="menu">
		<div>
			<span class="h41" style="cursor: auto;">菜单配置</span>
		</div>
		<div class="leftWap">
			<div class="menuTitle">菜单配置</div>
			<div>
				<div>
					<ul class="topBtn">
						<li>
							<a href="javascript:void(0)" @click='deleteConfirm'>删除节点</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click='addRootNode' ref="addroot">新增根节点</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click='newAddNode' ref="add">新增子节点</a>
						</li>
					</ul>
				</div>
				<div v-if='ztreeDataSource.length>0'>
					<vue-ztree :list.sync='ztreeDataSource' :func='nodeClick' :is-open='false'></vue-ztree>
				</div>
			</div>
		</div>
		<div class="rightWap">
			<div class="title">C层级菜单</div>
			<div class="inputRow">
				<span>菜单名称：</span>
				<input type="text" placeholder="请输入" class="inputText" v-model="menuName" />
			</div>
			<div class="inputRow">
				<span>菜单ID：</span>
				<input type="text" placeholder="请输入" class="inputText" v-model="menuId" />
			</div>
			<div class="inputRow">
				<span>菜单类型：</span>
				<Select v-model="form_model1" class="select">
					<Option v-for="item in frominput1" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
			<div class="inputRow">
				<span>菜单显示类型：</span>
				<Select v-model="form_model2" class="select">
					<Option v-for="item in frominput2" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
			<div class="inputRow">
				<span>排序序号：</span>
				<input type="text" value="" placeholder="输入1-99号排序序号，默认为1" class="inputText" v-model="orderId" />
			</div>
			<div class="textareaRow">
				<span class="textAligin">url地址：</span>
				<textarea class="textBox" v-model="routerUrl"></textarea>
			</div>
			<div class="inputRow" style="margin-top: 15px;">
				<span>图标名字：</span>
				<input type="text" value="" placeholder="请输入图标名称" class="inputText" v-model="iconName" />
			</div>
			<div class="middleBtn1 topM" @click="updateMenu" v-show="saveUpdate">更新</div>
			<div class="middleBtn1 topM" @click="addMenus" v-show="saveAdd">保存</div>
		</div>
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
	import vueZtree from '@/components/vue-ztree.vue'
	export default {
		data() {
			return {
				loading:true,
				ztreeDataSource: [{
						id: 220,
						parentId: 0,
						name: "游戏1",
						children: [{
							id: 221,
							parentId: 220,
							name: "游戏2",
							path: ""
						}],
						path: "http://www.baidu.com"
					},
					{
						id: 2,
						parentId: 0,
						name: "视频",
						children: [{
							id: 3,
							parentId: 2,
							name: "电影"
						}, {
							id: 7,
							parentId: 2,
							name: "短片"
						}],
						path: ""
					}
				],
				treeDeepCopy: [],
				parentNodeModel: [], //当前点击节点父亲对象
				nodeModel: null, // 当前点击节点对象
				form_model1: '',
				form_model2: '',
				frominput1: [{
						value: 0,
						label: '内部接口'
					},
					{
						value: 1,
						label: '外部接口'
					}
				],
				frominput2: [{
						value: 0,
						label: '内嵌显示'
					},
					{
						value: 1,
						label: '新页面弹出'
					}
				],
				
				menuName: '',
				menuId: '',
				orderId: '',
				routerUrl: '',
				id: '',
				parentId: 1,
				iconName:'',
				saveUpdate:true,
				saveAdd:false
				
			}
		},
		mounted() {
			this.menuList();
		},
		components: {
			vueZtree
		},
		methods: {
			//菜单列表
			menuList() {
				this.axios.post('/role/queryFunctionMenuAllVUE.do', {
					//"id": 1, //类型：String  可有字段  备注：无
					//"name": "mock", //类型：String  可有字段  备注：菜单名称
					//"parentId": "mock" //类型：String  可有字段  备注：父节点Id
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
						this.ztreeDataSource = res.data.data.value;
					}else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			//删除确认
			deleteConfirm() {
				if(this.nodeModel == null) {
					this.$Message.info('请先选中节点');
					return;
				}
				this.$Modal.confirm({
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.deleteMenu()
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			// 新增子节点
			newAddNode() {
				if(this.nodeModel == null) {
					this.$Message.info('请先选中节点');
				} else if(this.$refs.add.innerText == '新增子节点') {
					this.menuName = ''; //菜单名字
					this.menuId = ''; //菜单uId
					this.form_model1 = ''; //菜单类型
					this.form_model2 = ''; //菜单显示类型
					this.orderId = ''; //排序序号
					this.iconName = ''; //图标名称
					this.routerUrl = ''; //URL地址
					this.saveAdd = true;
					this.saveUpdate = false;
				}
			},
			//新增根节点
			addRootNode(){
				if (this.$refs.addroot.innerText=='新增根节点') {
					this.id = '';//初始id
					this.parentId = '';//初始化parentId
					this.menuName = ''; //菜单名字
					this.menuId = ''; //菜单uId
					this.form_model1 = ''; //菜单类型
					this.form_model2 = ''; //菜单显示类型
					this.orderId = ''; //排序序号
					this.iconName = ''; //图标名称
					this.routerUrl = ''; //URL地址
					this.saveAdd = true;
					this.saveUpdate = false;
				}
				
			},
			// 点击节点
			nodeClick: function(m, parent, trees) {
				this.saveAdd = false;
				this.saveUpdate = true;
				this.treeDeepCopy = trees;
				this.nodeModel = m; // 当前点击节点对象
				this.parentNodeModel = parent; //当前点击节点父亲对象
				//console.log(m);
				console.log(m);
				this.id = m.id;
				this.parentId = m.parentid;
				
				//菜单信息回显
				this.axios.post('/role/queryFunctionMenu.do', {
					"id": m.id, //类型：String  可有字段  备注：无
					"name": m.name, //类型：String  可有字段  备注：菜单名称
					"parentId": m.parentid //类型：String  可有字段  备注：父节点Id
				}).then((res) => {
					console.log(res);
					this.menuName = res.data.data.result[0].name; //菜单名字
					this.menuId = res.data.data.result[0].uId; //菜单uId
					this.form_model1 = res.data.data.result[0].type; //菜单类型
					this.form_model2 = res.data.data.result[0].showType; //菜单显示类型
					this.orderId = res.data.data.result[0].orderid; //排序序号
					this.iconName = res.data.data.result[0].imageurl; //上传图标
					this.routerUrl = res.data.data.result[0].url;//URL地址
				}).catch(function(err) {
					console.log(err);
				})

			},
			//新增字菜单
			addMenus() {
				var that = this;
				if (this.parentId==null||this.parentId=='') {
					this.parentId = that.id;
				} if(this.menuName==''||this.menuId==''||this.iconName==''||this.routerUrl=='') {
					this.$Message.info('所填信息不完整');
					return;
				}
				
				this.axios.post('/role/addFunctionMenu.do', {
					"name": that.menuName, //类型：String  必有字段  备注：菜单名称
					"uId":that.menuId,                //类型：String  必有字段  备注：菜单用id
					"orderId": 1, //类型：Number  可有字段  备注：排序号 1-10 优先级高-低
					"parentId": that.parentId, //类型：String  必有字段  备注：父节点Id
					"url": that.routerUrl, //类型：String  必有字段  备注：路径
					"imageUrl": that.iconName, //类型：String  可有字段  备注：菜单图片链接
					"type": that.form_model1, //类型：Number  可有字段  备注：类型 0内部接口 1外部接口 默认内部接口
					"showType": that.form_model2//类型：Number  可有字段  备注：类型 0内嵌显示 1新页面弹出 默认内嵌显示
				}).then((res) => {
					console.log(res);
					this.menuList();
				}).catch(function(err) {
					console.log(err);
				});
			},
			
			//功能菜单删除
			deleteMenu() {
				var that = this;
				this.axios.post('/role/deleteFunctionMenu.do', {
					"id": that.id //类型：String  必有字段  备注：无
				}).then((res) => {
					console.log(res);
					this.menuList();
				}).catch(function(err) {
					console.log(err);
				});
			},
			//功能菜单修改
			updateMenu() {
				if (this.menuName==''||this.menuId==''||this.iconName==''||this.routerUrl=='') {
					this.$Message.info('所填信息不完整');
					return;
				}
				var that = this;
				this.axios.post('/role/updateFunctionMenu.do', {
					"id": that.id, //类型：String  必有字段  备注：无
					"uId": that.menuId, //类型：String  必有字段  备注：菜单用id
					"name": that.menuName, //类型：String  必有字段  备注：菜单名称
					"orderId": 1, //类型：Number  可有字段  备注：排序号 1-10 优先级高-低
					"parentId": that.parentId, //类型：String  必有字段  备注：父节点Id
					"url": that.routerUrl, //类型：String  必有字段  备注：路径
					"imageUrl": that.iconName, //类型：String  可有字段  备注：菜单图片名称
					"type": that.form_model1, //类型：Number  可有字段  备注：类型 0内部接口 1外部接口 默认内部接口
					"showType": that.form_model2 //类型：Number  可有字段  备注：类型 0内嵌显示 1新页面弹出 默认内嵌显示
				}).then((res) => {
					console.log(res);
					this.menuList();
				}).catch(function(err) {
					console.log(err);
				});
			}
			
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../../static/css/zTreeStyle/zTreeStyle.css";
	#menu {
		overflow: hidden;
		.topBtn {
			overflow: hidden;
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #E9E9E9;
			display: flex;
				display: -ms-flexbox;
				-webkit-flex-direction: row;
				flex-direction: row;
				-webkit-justify-content: space-between;
				justify-content: space-between;
			li {
				text-align: center;
				width: 86px;
				/*width: 133.5px;*/
				background: #108EE9;
				text-align: center;
				&:nth-child(2){
					border-left: 1px solid #ccc;
					border-right: 1px solid #ccc;
				}
				a {
					color: #fff;
					font-size: 14px;
				}
			}
		}
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
				border-bottom: 1px solid #E9E9E9;
				background: #F4F4F4;
			}
			.middleBtn1 {
				margin-left: 60px;
			}
		}
		.rightWap {
			color: #666;
			border: 1px solid #E9E9E9;
			float: left;
			width: 60%;
			margin-left: 7em;
			.title {
				height: 50px;
				line-height: 50px;
				padding-left: 15px;
				border-bottom: 1px solid #E9E9E9;
				margin-bottom: 45px;
			}
			.inputRow {
				width: 33em;
				margin-left: 11em;
				margin-bottom: 20px;
				span {
					display: inline-block;
					width: 10em;
					text-align: right;
				}
			}
			.textareaRow {
				width: 33em;
				margin-left: 11em;
				margin-bottom: 2px;
				.textBox {
					height: 80px;
					width: 228px;
				}
				.textAligin {
					width: 10em;
					text-align: right;
					vertical-align: top;
					margin-top: 5px;
					display: inline-block;
				}
			}
			.topM {
				margin-top: 40px;
				margin-bottom: 30px;
				margin-left: 200px;
			}
		}
	}
</style>