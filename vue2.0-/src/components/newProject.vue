<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建项目</span>
				<span class="cancelWap" @click="cancel"><img src="../image/cancel.png" /></span>
			</div>
			<div>
				<div class="projectSeting title">项目设置</div>
				<div class="inputRow">
					<span class="redStar">项目名称：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" v-model="projectName" />
				</div>
				<div class="inputRow">
					<span class="redStar">项目类型：</span>
					<Select v-model="projectModel" class="select" clearable @on-change="workKind">
						<Option v-for="item in proKind" :value="item.key" :key="item.key">{{item.value}}</Option>
					</Select>
				</div>
				<!--临时外加外显号码-->
				<div class="inputRow" v-if="projectModel==1">
					<span>外显号码：</span>
					<Select v-model="outShowPhone" class="select" clearable>
						<Option v-for="item in outShowPhoneList" :value="item.key" :key="item.key">{{item.value}}</Option>
					</Select>
				</div>
				<div class="inputRow" v-else :class="'selctKind'">
					<span class="redStar">外显号码：</span>
					<Select v-model="outShowPhone" class="select" clearable>
						<Option v-for="item in outShowPhoneList" :value="item.key" :key="item.key">{{item.value}}</Option>
					</Select>
				</div>
				<div class="inputRow" v-if="projectModel!=''">
					<span class="redStar">工作台：</span>
					<Select v-model="workbench" class="select" ref="trainNames" clearable>
						<Option v-for="item in workbenchList" :value="item.name" :key="item.value">{{item.description}}</Option>
					</Select>
					
				</div>
				<div class="inputRow">
					<span>工单模板：</span>
					<Select v-model="workOrderId" filterable clearable>
						<Option v-for="item in workorderList" :value="item.metaDataId" :key="item.metaDataId">{{ item.formTitle }}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>结算模板：</span>
					<Select v-model="accountId" class="select" clearable>
						<Option v-for="item in settitle" :value="item.id" :key="item.value">{{item.description}}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>质检模板：</span>
					<Select v-model="machineQualityId" class="select" clearable>
						<Option v-for="item in qualityTempletes" :value="item.id" :key="item.value">{{ item.name}}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>培训模板：</span>
					<Select v-model="trainArr" class="select" ref="trainTemple" clearable>
						<Option v-for="item in trainList" :value="item.id" :key="item.value">{{item.trainName}}</Option>
					</Select>
				</div>

				<div class="inputRow">
					<span>第三方链接：</span>
					<input type="text" value="" placeholder="如需第三方工作台，请输入第三方链接" class="textInput" v-model="thirdPartyUrl" />
				</div>

				<div class="inputRow" v-if="projectModel==1">
					<span>话术上传：</span>
					<span class="uploadWap">
					<Upload   :action="picture1.action" :show-upload-list="true"   :before-upload="handleUpload1" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">话术上传</Button>
           			</Upload>
				</span>
					<span style="width: 100px;text-align: right;" v-if="showHiden" ref="showUploadS">正在上传中...</span>
					<div ref="dataNameShow" class="bottomMessTip"></div>
				</div>

				<div class="inputRow" v-else :class="'selctKind'">
					<span>话术上传：</span>
					<span class="uploadWap">
					<Upload :action="picture1.action" :show-upload-list="true" :before-upload="handleUpload1" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">话术上传</Button>
           			</Upload>
				</span>
					<span style="width: 100px;text-align: right;" v-if="showHiden">正在上传...</span>
					<div ref="dataNameShow" class="bottomMessTip"></div>
				</div>
				<div class="inputRow">
					<span class="redStar">项目logo：</span>
					<span class="uploadWap">
					<Upload :before-upload="handleUpload2" :action="picture2.action" :show-upload-list="false"  class = "upload">
								<div class="choose-file">
									<i class="iconfont icon-add" />
									<span style="text-align: center;">上传</span>
				</div>
				<div class="showImag">
					<img :src="picture2.src" alt="" />
				</div>
				</Upload>
				</span>
			</div>
			<div class="inputRow">
				<span>工作时间：</span>
				<Time-picker :value="timeValue2" format="HH:mm:ss" type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px" v-model="workTime"></Time-picker>
				<!--<span class="addTime">添加</span>-->
			</div>
			<!--<div class="in_name">
				<span class="span1" style="margin-right: 4px;">技能要求：</span>
				<span>
				<TreeSelect ref="treeselectShow" v-model = "roletreeModelId" transfer @on-select-change="checkselectVal" :multiple="multiple" class="zrees" :data="treeBaseData" placeholder="请选择..." :width="232" :fields="treeFields"></TreeSelect>
			</span>
			</div>-->
			<!--热门项目改进版-->
			<div class="inputRow">
				<span>项目标签：</span>
				<Select v-model="hotArr" filterable multiple>
					<Option v-for="item in hotLabelList" :value="item.key" :key="item.value">{{ item.value}}</Option>
				</Select>
			</div>
			<!--项目可见度-->
			<div class="inputRow">
				<span class="redStar">项目可见度：</span>
				<Select v-model="iShiddenProject" class="select" clearable>
					<Option v-for="item in iSshowProjectList" :value="item.key" :key="item.key">{{item.value}}</Option>
				</Select>
			</div>
			<!--采集标注-->
			<div class="inputRow" v-if="projectModel==3">
				<span>采集标签：</span>
				<label class="labelMiddle" v-for="item in collectionList"><input type="checkbox"  :value="item.key" v-model="collectionArrmodel"/>{{item.value}}</label>
			</div>
			<div class="inputRow" v-else :class="'selctKind'">
				<span>采集标签：</span>
				<label class="labelMiddle" v-for="item in collectionList"><input type="checkbox"  :value="item.key" v-model="collectionArrmodel"/>{{item.value}}</label>
			</div>
			<div class="projectSeting2 title">接单要求</div>
			<div class="inputRow">
				<span>客服星级：</span>
				<Select v-model="serviceStar" class="select" clearable>
					<Option v-for="item in frominput7" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
			<div class="projectSeting2 title">指定发布</div>
			<div class="inputRow special">
				<span>用户：</span>
				<Select v-model="userModel" filterable multiple>
					<Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name}} - {{item.phoneNumber}}</Option>
				</Select>
			</div>

			<div class="projectSeting2 title">项目说明</div>
			<div class="textareaRow">
				<span class="textAligin">项目说明：</span>
				<textarea class="textBox" placeholder="请输入" v-model="taskDescrition"></textarea>
			</div>
		</div>
		<div class="bootom-button">
			<div class="middleBtn1" @click="release">发布</div>
			<div class="middleBtn2" @click="save">保存</div>
		</div>
	</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				//技能树
				multiple: true,
				roletreeModelId: [],
				treeBaseData: [],
				showTreeArr: [],
				treeFields: [{
						field: 'label',
						map: 'title'
					},
					{
						field: 'child',
						map: 'children'
					}
				],
				iShiddenProject: '', //项目可见度
				iSshowProjectList: [],
				collectionList: [], //语音采集
				collectionArrmodel: [],
				showHiden: false,
				treeSelectArr: [],
				status: '',
				outShowPhone: '', //外显号码
				outShowPhoneList: [], //外显号码数组
				explicitNumber: 'explicitNumber',
				projectName: '',
				projectType: 'projectType',
				projectTag: 'projectTag',
				showForm: false,
				timeValue2: ['09:41:00', '12:00:00'],
				workTime: [],
				mediaName: [],
				proKind: [],
				workOrderTempate: [],
				settitle: [],
				qualityTempletes: [],
				trainList: [],
				hotLabelList: [],
				hotArr: [],
				picture1: {
					data: {},
					action: '/fileUpload.do',
					src: "",
					uploadFile: null,
				},
				picture2: {
					data: {},
					action: '/fileUpload.do',
					src: "",
					uploadFile: null,
				},

				frominput7: [{
						value: '1',
						label: '1'
					},
					{
						value: '2',
						label: '2'
					},
					{
						value: '3',
						label: '3'
					},
					{
						value: '4',
						label: '4'
					},
					{
						value: '5',
						label: '5'
					}
				],
				hotSetting: '',
				mediaName: [],
				workorderList: [], //工单模板
				projectModel: '', //项目类型
				workOrderId: '', //工单模板id
				accountId: '', //结算模板id
				machineQualityId: '', //质检模板id
				wordsUrl: '', //话术地址
				thirdPartyUrl: '', //第三方地址
				projectPhoto: '', //项目logo
				trainArr: '',
				requires: [],
				workbenchList: [],
				workbench: '',
				serviceStar: '',
				taskTime: [Date.parse(new Date()), Date.parse(new Date())],
				taskDescrition: '',
				//指定用户
				userModel: [],
				userList: [],
				drag:'123'

			}
		},
		mounted() {
			window.addEventListener('click', this.blur);
			//外显号码
				this.outPhone();
				//项目类型
				this.projectKind();
				//技能 查询
				this.checkSkillList();
				//项目可见度
				this.iSshowProject();
				//语音采集
				this.collection();
				//热门标签
				this.hotLable();
				//工单模板
				this.workOrderTemplte();
				//分页查询结算模板
				this.settitleTemplete();
				//质检模板
				this.qualityTemplete();
				//培训模板
				this.trainTemplete();
				
				//查询用户
				this.queryUsers();
		},

		methods: {
			
			//新建项目信息初始化
			initNewProjectMess() {
				
				this.projectName = ''; //项目名字
				this.projectModel = ''; //项目类型
				this.iShiddenProject = ''; //项目可见度
				this.workbench = ''; //工作台
				this.workOrderId = ''; //工单模板
				this.accountId = ''; //结算模板
				this.machineQualityId = ''; //质检模板
				this.trainArr = ''; //培训模板
				this.thirdPartyUrl = ''; //第三方链接
				this.picture2.src = ''; //项目logo
				this.workTime = ''; //工作时间
				this.taskDescrition = ''; //任务描述
				this.treeBaseData = []; //技能要求
				this.hotArr = []; //热门项目
				this.serviceStar = ''; //客服星级
				this.userModel = []; //指定用户
			},
			//工作台事件
			workKind(){
				//工作台类型
				this.workbenchF();
			},
			//员工-查询员工的技能列表
			checkSkillList() {
				var that = this;
				this.axios.post('/enterprise/getUserSkillForSkillList.do', {

				}).then((res) => {
					//this.source = res.data.data.value;
					this.treeBaseData = res.data.data.result;
				}).catch(function(err) {
					console.log(err);
				});
			},
			//技能树ID获取
			checkselectVal(data) {
				console.log(data);
				this.roletreeModelId = [];
				for(var x in data) {
					//					if(data[x].type == 2) {
					var skillIdObj = {
						skillId: data[x].id
					}
					this.roletreeModelId.push(skillIdObj);
					//					}
				}
			},
			//技能菜单关闭事件
			close() {
				this.requires.splice(0, this.requires.length);
				var mapArr = this.roletreeModelId;
				//公司数组
				//var companyArr = this.companyModel;
				//用户数组
				var userArr = this.userModel;
				var that = this;
				//客服星级
				var d = {
					type: 'lvl',
					value: this.serviceStar,
					name: '客服星级'
				};
				var a = {
					type: 'projectTrain',
					value: this.trainArr,
					name: this.convert(this.$refs.trainTemple.value)
				};
				//技能要求
				for(var i = 0; i < mapArr.length; i++) {
					this.requires.push({
						type: 'projectskill',
						value: mapArr[i],
						name: '项目技能'
					})
				}

				//指定用户
				for(var i = 0; i < userArr.length; i++) {
					this.requires.push({
						type: 'appointUser',
						value: userArr[i],
						name: '指定用户'
					})
				}
				this.requires.push(a, d);
			},
			handleUpload1(file) {
				this.showHiden = true;
				let _this = this;
				if(!validateImageFile(file)) {
					return false;
				};
				let formdata = new FormData();
				formdata.append('file', file, file.name);
				formdata.append('type', '1');

				var option = {
					method: 'post',
					url: this.picture1.action,
					data: formdata
				}

				this.axios(option).then(function(response) {
					//console.log(response);
					if(!response) {
						_this.$Message.error("错误");
						return;
					}
					let result = response.data;
					if(!result || !result.code || result.code != 0) {
						_this.$Message.error(result.msg);
						return;
					}
					if(result.code == 0) {
						_this.$refs.dataNameShow.innerText = file.name;
						_this.fileId = result.data.srcId;
						//_this.infoForm.photo = result.data.value;
						_this.wordsUrl = result.data.value; //话术地址
						var msg = result.msg;
						_this.$refs.showUploadS.innerText = '上传成功'
						_this.$Message.success(msg);
					}
				});

				function validateImageFile(file) {
					if(!file) {
						_this.$Message.success('文件出错');
						return false;
					}
					return true;
				}
				return false;
			},
			handleUpload2(file) {
				let _this = this;
				//console.log(file.name)
				if(!validateImageFile(file)) {
					return false;
				};
				let formdata = new FormData();

				formdata.append('file', file, file.name);
				formdata.append('type', '1');
				var option = {
					method: 'post',
					url: this.picture1.action,
					data: formdata
				}
				this.axios(option).then(function(response) {
					if(!response) {
						_this.$Message.error("错误");
						return;
					}
					let result = response.data;
					if(!result || !result.code || result.code != 0) {
						_this.$Message.error(result.msg);
						return;
					}
					if(result.code == 0) {
						_this.fileId = result.data.srcId;
						_this.picture2.src = result.data.value;
						_this.projectPhoto = result.data.value; //话术地址
						var msg = result.msg;
						_this.$Message.success(msg);
					}
				});

				function validateImageFile(file) {
					if(!file) {
						_this.$Message.success('文件出错');
						return false;
					}

					if(file.size > 500 * 1024) {
						_this.$Message.success('图片大小不能超过500k');
						return false;
					}

					let types = file.type.split('/');

					if(types[0] != 'image') {
						_this.$Message.success('只能是jpg、jpeg、png图片');
						return false;
					}

					if(['jpg', 'jpeg', 'png'].indexOf(types[1]) < 0) {
						_this.$Message.success('只能是jpg、jpeg、png图片');
						return false;
					}
					return true;
				}
				return false;
			},

			convert(e) {
				for(var i = 0; i < this.trainList.length; i++) {
					if(e == this.trainList[i].id) {
						var l = this.trainList[i];
						return l.trainName;
					}
				}
			},
			cancel() {
				this.$emit("cancel")
			},
			//外显号码
			outPhone() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.explicitNumber //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.outShowPhoneList = res.data.data.value;
				}).catch(function(err) {
					console.log(err);
				});
			},
			//项目可见度
			iSshowProject() {
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": 'projectLevel'
				}).then((res) => {
					if(res.data.code == '0') {
						this.iSshowProjectList = res.data.data.value;
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			//语音采集
			collection() {
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": 'voiceBusinessParameter' //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.collectionList = res.data.data.value;
				}).catch(function(err) {
					console.log(err);
				});
			},
			//项目类型
			projectKind() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectType //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.proKind = res.data.data.value;
				}).catch(function(err) {
					console.log(err);
				});
			},
			//热门标签
			hotLable() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectTag //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.hotLabelList = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			//工单模板
			workOrderTemplte() {
				this.axios.post('/task/searchXFormList.do', {
					"pageNum": 1, //类型：Number  必有字段  备注：页数
					"pageSize": 100 //类型：Number  必有字段  备注：每页条数
				}).then((res) => {
					this.workOrderTempate = res.data.data.result;
					this.displayOptions = res.data.data.result;
					this.originOptions = res.data.data.result;
					this.workorderList = res.data.data.result;
				}).catch(function(err) {
					console.log(err);
				});
			},

			//分页查询结算模板
			settitleTemplete() {
				this.axios.post('/settle/searchTempalte.do', {
					"pageNum": 1, //类型：Number  必有字段  备注：页码
					"pageSize": 100 //类型：Number  必有字段  备注：每页大小
					//					"status": 1 //类型：Number  可有字段  备注：状态
				}).then((res) => {
					this.settitle = res.data.data.list;
				}).catch(function(err) {
					console.log(err);
				});
			},
			//质检模板
			qualityTemplete() {
				this.axios.post('/task/searchSpeechTemplet.do', {
					"pageNum": 1, //类型：Number  必有字段  备注：页数
					"pageSize": 100 //类型：String  必有字段  备注：每页条数
				}).then((res) => {
					this.qualityTempletes = res.data.data.result;
				}).catch(function(err) {
					console.log(err);
				});
			},
			//培训模板
			trainTemplete() {
				this.axios.post('/train/getProjectTrainList.do', {
					//trainName:'',
					//pageNo:'',
					//pageSize:''
				}).then((res) => {
					this.trainList = res.data.data.result;

				}).catch(function(err) {
					console.log(err);
				});
			},
			//查询工作台类型
			workbenchF() {
				var that = this;
				this.axios.post('/task/searchWorkbench.do', {
					"projectType":that.projectModel
				}).then((res) => {
					if(res.data.code=='0'){
						this.workbenchList = res.data.data.value;
					}else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				});
			},

			//查询用户
			queryUsers() {
				this.axios.post('/role/queryUserALL.do', {
					"pageNo": 1, //类型：Number  可有字段  备注：页码
					"pageSize": 3000 //类型：Number  可有字段  备注：每页大小
				}).then((res) => {
					if(res.data.code == 0) {
						this.userList = res.data.data.result;
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			//发布按钮
			release() {
				//表达验证
				if(this.projectName == '' || this.form_model1 == '' || this.picture2.src == ''||this.workbench==''||this.iShiddenProject=='') {
					this.$Message.info('请填写必填信息');
					return false;
				}
				this.status = 1;
				//调用新建项目接口
				this.newProject();
				this.$emit("cancel");
				this.close();
			},
			//保存按钮
			save() {
				//表达验证
				if(this.projectName == '' || this.form_model1 == '' || this.picture2.src == ''||this.workbench==''||this.iShiddenProject=='') {
					this.$Message.info('请填写必填信息');
					return false;
				}
				this.status = 0;
				this.newProject();
				this.$emit("cancel");
				this.close();
			},

			newProject() {
				var that = this;
				this.axios.post('/task/createProject.do', {
					"name": that.projectName, //类型：String  必有字段  备注：项目名称
					"companyId": 1, //类型：String  必有字段  备注：项目所属公司
					"startTime": new Date(that.taskTime[0]).getTime(), //类型：String  必有字段  备注：项目开始时间，时间戳
					"endTime": new Date(that.taskTime[1]).getTime(), //类型：String  必有字段  备注：项目结束时间，时间戳
					"workOrderId": that.workOrderId, //类型：String  必有字段  备注：关联的工单模版
					"self": 1,
					"requires": that.requires,
					"tags": that.hotArr, //热门标签
					"type": that.projectModel, //项目类型
					"description": that.taskDescrition, //类型：String  可有字段  备注：任务描述
					"projectWorktimes": [{
						"startTime": Date.parse(that.workTime[0]),
						"endtime": Date.parse(that.workTime[1])
					}],
					"startWorkTime": Date.parse(new Date()), //类型：String  必有字段  备注：开始工作时间
					"accountId": that.accountId, //类型：String  必有字段  备注：结算模板Id
					"machineQualityId": that.machineQualityId, //类型：String  可有字段  备注：机检模版ID，一般呼叫任务才会机检
					"formType": "xform", //类型：String  必有字段  备注：工单类型，xform;工单，form：表单
					"workbench": that.workbench, //类型：String  必有字段  备注：工作台
					"status": that.status,
					"projectPhoto": that.projectPhoto, //类型：String  必有字段  备注：项目logo
					"thirdPartyUrl": that.thirdPartyUrl, //类型：String  可有字段  备注：第三方地址
					"wordsUrl": that.wordsUrl, //类型：String  可有字段  备注：话术地址
					"explicitAttribute": that.outShowPhone, //类型：String  可有字段  备注：外显属性
					"projectLevel": that.iShiddenProject, //类型：String  必有字段  备注：项目权限级别
					"voiceExBusinessField": that.collectionArrmodel //备注：语音标注额外业务字段
				}).then((res) => {
					if(res.data.code == 0) {
						this.$Message.success(res.data.msg);
						//回调搜索项目接口
						this.$emit('childeMethod');
					} else {
						this.$Message.error(res.data.msg);
					}

				}).catch(function(err) {})
			}
		},
		//监听数据变化
		watch: {}
	}
</script>
<style src="@riophae/vue-treeselect/dist/vue-treeselect.min.css"></style>
<style lang="scss" scoped="scoped">
	.selctKind {
		display: none;
	}
	
	.in_name {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 33em;
		margin-top: 15px;
		margin-bottom: 15px;
		margin-left: 10em;
		position: relative;
		.span1 {
			width: 6em;
			display: inline-block;
			text-align: right;
		}
	}
	
	.ivu-treeSelect {
		width: 230px !important;
	}
	
	.overflow {
		height: 75%;
		overflow-y: auto;
	}
	
	.Dialog {
		border-radius: none;
		height: auto;
		.upload {
			position: relative;
			width: 88px;
			height: 88px;
		}
		.showImag {
			width: 88px;
			height: 88px;
			position: absolute;
			left: 0;
			top: 0;
			border-radius: 5px;
			img {
				border-radius: 5px;
				width: 100%;
				height: 100%;
			}
		}
		.choose-file {
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			width: 88px;
			height: 88px;
			background-color: #f2f2f2;
			color: #888;
			border-radius: 3px;
			border: 1px dotted #dbdbdb;
			cursor: pointer;
			i {
				font-size: 30px;
				color: #888;
			}
		}
		margin: auto;
		.projectSeting2 {
			margin-top: 20px;
			padding-left: 45px;
		}
		.inputRow {
			width: 33em;
			span {
				display: inline-block;
				width: 6em;
				text-align: right;
			}
			.labelMiddle {
				display: inline-block;
				width: 50px;
				text-align: left;
				* {
					vertical-align: middle;
				}
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
			.bottomMessTip {
				height: 20px;
				padding-left: 75px;
			}
		}
		.textareaRow {
			width: 33em;
			margin-left: 10em;
			margin-bottom: 2px;
			.textBox {
				height: 140px;
				overflow-y: auto;
				width: 228px;
			}
			.textAligin {
				text-align: right;
				width: 6em;
				vertical-align: top;
				margin-top: 5px;
				display: inline-block;
			}
			
		}
		.bootom-button{
				.middleBtn2{
					margin-left: 20px;
					margin-right: 15px;
				}
			}
	}
</style>