<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">编辑新建项目</span>
				<span class="cancelWap" @click="reviseCancel"><img src="../image/cancel.png" /></span>
			</div>
			<div class="overflow scroll">
				<div class="projectSeting title">项目设置</div>
				<div class="inputRow">
					<span class="redStar">项目名称：</span>
					<input type="text" value="" placeholder="请输入" class="textInput" ref="inputValue1" v-model="projectName" />
				</div>
				<div class="inputRow">
					<span class="redStar">项目类型：</span>
					<Select v-model="proKinds" class="select" clearable @on-change="workKind">
						<Option v-for="item in proKind" :value="item.value" :key="item.key">{{item.value}}</Option>
					</Select>
				</div>
				<!--临时外加外显号码-->
				<div class="inputRow" v-if="proKinds=='外呼'">
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
				<div class="inputRow">
					<span class="redStar">工作台：</span>
					<Select v-model="form_model4" class="select" clearable>
						<Option v-for="item in workbenchList" :value="item.description" :key="item.description">{{ item.description}}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>工单模板：</span>
					<Select v-model="workorderId" filterable clearable>
						<Option v-for="item in workorderList" :value="item.metaDataId" :key="item.metaDataId">{{ item.formTitle }}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>结算模板：</span>
					<Select v-model="form_model3" class="select" clearable>
						<Option v-for="item in settitle" :value="item.description" :key="item.description">{{item.description}}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>质检模板：</span>
					<Select v-model="form_model7" class="select" clearable>
						<Option v-for="item in qualityTempletes" :value="item.name" :key="item.name">{{item.name}}</Option>
					</Select>
				</div>
				<div class="inputRow">
					<span>培训模板：</span>
					<Select v-model="form_model5" class="select" clearable>
						<Option v-for="item in trainList" :value="item.trainName" :key="item.trainName">{{item.trainName}}</Option>
					</Select>
				</div>

				<div class="inputRow">
					<span>第三方链接：</span>
					<input type="text" value="" placeholder="如需第三方工作台，请输入第三方链接" class="textInput" v-model="thirdPartyUrl" />
				</div>
				<div class="inputRow" v-if="proKinds=='外呼'">
					<span>话术上传：</span>
					<span class="uploadWap">
					<Upload :action="picture1.action" :show-upload-list="false" :before-upload="handleUpload1" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           			</Upload>
				</span>
				<span style="width: 100px;text-align: right;" v-if="showHiden" ref="showUploadS">正在上传中...</span>
					<a class="tipText" :href="wordsUrl" style="width: 100px;text-align: right;display: inline-block;" download="" v-if="showHiden2">点击下载查看</a>
					<div ref="dataNameShow" class="bottomMessTip"></div>
				</div>
				<div class="inputRow" v-else :class="'selctKind'">
					<span>话术上传：</span>
					<span class="uploadWap">
					<Upload :action="picture1.action" :show-upload-list="false" :before-upload="handleUpload1" ref = "upload">
             			<Button type="primary" icon="ios-cloud-upload-outline">上传数据</Button>
           			</Upload>
				</span>
				<span style="width: 100px;text-align: right;" v-if="showHiden">正在上传中...</span>
					<a class="tipText" :href="wordsUrl" style="width: 100px;text-align: right;display: inline-block;" download="">点击下载查看</a>
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
					<img :src="projectPhoto" alt="" />
				</div>
				</Upload>
				</span>
			</div>
			<div class="inputRow">
				<span>工作时间：</span>
				<Time-picker :value="workTime" format="" type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px" v-model="workTime"></Time-picker>
				<!--<span class="addTime">添加</span>-->
			</div>
			<!--改进-->
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
					<Option v-for="item in hotLabelList" :value="item.key" :key="item.key">{{convertHot(item.key,hotLabelList)}}</Option>
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
			<div class="inputRow" v-if="proKinds=='音频标注'">
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
				<Select v-model="form_model8" class="select" clearable>
					<Option v-for="item in serviceSList" :value="item.value" :key="item.value">{{item.value}}</Option>
				</Select>
			</div>
			<div class="projectSeting2 title">指定发布</div>
			<div class="inputRow">
				<span>用户：</span>
				<Select v-model="userModel" filterable multiple>
					<Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name}} - {{item.phoneNumber}}</Option>
				</Select>
			</div>
			<div class="projectSeting2 title">项目说明</div>
			<div class="textareaRow">
				<span class="textAligin">项目说明：</span>
				<textarea class="textBox" placeholder="请输入" v-model="taskDis"></textarea>
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
				multiple: true,
				projectTag: 'projectTag',
				projectId: '',
				projectName: '', //项目名称
				taskDis: '', //任务描述
				baseTrain: false, //基础培训
				realName: false, //实名认证
				timeValue2: [],
				workTime: [],
				projectType: 'projectType',
				picture1: {
					data: {},
					action: '/fileUpload.do',
					src: "",
					uploadFile: null,
				},
				showHiden:false,
				showHiden2:false,
				picture2: {
					data: {},
					action: '/fileUpload.do',
					src: "",
					uploadFile: null,
				},
				proKind: [{
						value: 1,
						label: '外呼'
					},
					{
						value: 2,
						label: '呼入'
					},
					{
						value: 3,
						label: '在线'
					},
					{
						value: 4,
						label: '受理'
					},
					{
						value: 5,
						label: '标注'
					}
				],
				workOrderTempate: [],
				settitle: [],
				workbenchList: [],
				trainList: [],
				hotLabelList: [],
				hotArr: [],
				qualityTempletes: [],

				serviceSList: [{
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
				proKinds: '', //项目类型
				outShowPhone: '', //外显号码
				outShowPhoneList: [], //外显号码数组
				explicitNumber: 'explicitNumber',
				form_model3: '',
				form_model4: '', //工作台类型
				form_model5: '',
				form_model7: '',
				form_model8: '',
				baseTrain: '',
				realName: '',
				status: '',
				type: '', //返回项目类型id
				workorderId: '', //返回的工单模板id
				workorderList: [],
				accountId: '', //结算模板id
				qualityId: '', //质检id
				trainId: '', //返回的培训id
				workbenchid: '', //工作台类型id
				wordsUrl: '', //话术地址
				thirdPartyUrl: '', //第三方地址
				projectPhoto: '', //项目logo
				//excelUrl:'',//回显数据URL
				requires: [],
				//指定用户
				userModel: [],
				userList: []

			}
		},

		mounted() {
			window.addEventListener('click', this.blur);
			//外显号码
				this.outPhone();
				//项目可见度
				this.iSshowProject();
				//语音采集
				this.collection();
				//项目类型
				this.projectKind();
				//热门标签
				this.hotLable();
				//工单模板
				this.workOrderTemplte();
				//质检模板
				this.qualityTemplete();
				//分页查询结算模板
				this.settitleTemplete()
				//培训模板
				this.trainTemplete();
				//查询用户
				this.queryUsers();
				//技能树
				this.checkSkillList();
		},
		methods: {
			//新建项目信息初始化
			initData() {
				this.projectName = ''; //项目名字
				this.proKinds = ''; //项目类型
				this.form_model4 = ''; //工作台
				this.workOrderId = ''; //工单模板
				this.form_model3 = ''; //结算模板
				this.form_model7 = ''; //质检模板
				this.form_model5 = ''; //培训模板
				this.thirdPartyUrl = ''; //第三方链接
				this.projectPhoto = ''; //项目logo
				this.workTime = []; //工作时间
				this.taskDis = ''; //任务描述
				this.treeData = []; //技能要求
				this.hotArr = []; //热门项目
				this.form_model8 = ''; //客服星级
				this.userModel = []; //指定用户
				this.showHiden = false;
				this.showHiden2 = true;

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
					if(data[x].type == 2) {
						var skillIdObj = {
							skillId: data[x].id
						}
						this.roletreeModelId.push(skillIdObj);
						this.roletreesid = this.roletreeModelId;
					}
				}
			},
			//技能菜单关闭事件
			close() {
				this.requires.splice(0, this.requires.length);
				var mapArr = this.roletreeModelId;
				var that = this;
				//培训模板
				var a = {
					type: 'projectTrain',
					value: this.trainId,
					name: this.form_model5
				};
				//客服星级
				var d = {
					type: 'lvl',
					value: this.form_model8,
					name: '客服星级'
				};
				if(mapArr.length>0||this.userModel.length>0){
					for(var i = 0; i < mapArr.length; i++) {
					this.requires.push({
						type: 'projectskill',
						value: mapArr[i],
						name: '项目技能'
					})
				}
				//指定用户
				for(var i = 0; i < this.userModel.length; i++) {
					this.requires.push({
						type: 'appointUser',
						value: this.userModel[i],
						name: '指定用户'
					})
				}
				
				}
				this.requires.push(a, d);
				
			},
			handleUpload1(file) {
				this.showHiden = true;
				this.showHiden2 = false;
				let _this = this;
				this.$refs.dataNameShow.innerText = file.name;
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
						_this.fileId = result.data.srcId;
						console.log(result)
						//_this.infoForm.photo = result.data.value;
						_this.wordsUrl = result.data.value; //话术地址
						var msg = result.msg;
						_this.$Message.success(msg);
						_this.$refs.showUploadS.innerText = '上传成功'
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
				return this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
			},
			//工作时间类型转换
			timeConvert(arr) {
				var timeValues = [];
				for(var i = 0; i < arr.length; i++) {
					timeValues.push(this.timeFormat(arr[i].startTime), this.timeFormat(arr[i].endtime))
				}
				return timeValues;
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
			//项目信息回显
			projectMess(projectId) {
				var that = this;
				this.axios.post('/task/findProjectInfo.do', {
					"projectId": projectId
				}).then((res) => {
					if(res.data.code=='0'){
											this.projectId = res.data.data.projectId;
					this.projectName = res.data.data.name; //项目名称
					this.proKinds = res.data.data.typeDicValue; //项目类型
					this.form_model4 = res.data.data.workbenchDescription; //工作台
					this.outShowPhone = res.data.data.exField; //外显号码
					//判断后台是否返回该字段
					if(res.data.data.workOrder == null || res.data.data.workOrder == undefined) {
						console.log("ss");
					} else {
						this.workorderId = res.data.data.workOrder.workOrderId; //工单模板id
					}
					if(res.data.data.account == null || res.data.data.account == undefined) {
						console.log("aa");
					} else {
						this.form_model3 = res.data.data.account.accountName; //结算模板
					}
					if(res.data.data.machineQuality == null || res.data.data.machineQuality == undefined) {
						console.log("dd");
					} else {
						this.form_model7 = res.data.data.machineQuality.machineQualityName; //质检模板
					}

					var requireObj = res.data.data.requires;
					this.workTime = this.timeConvert(res.data.data.projectWorktimes);
					this.thirdPartyUrl = res.data.data.thirdPartyUrl;
					this.wordsUrl = res.data.data.wordsUrl;
					//this.picture2.src = res.data.data.projectPhoto;
					this.projectPhoto = res.data.data.projectPhoto;
					this.hotArr = res.data.data.tags;
					var skillArr = [];
					for(var i = 0; i < requireObj.length - 2; i++) {
						var dd = requireObj[i].value;
						skillArr.push(dd);
						this.treeSelectArr = skillArr;
					}
					//指定用户
					var userArr = [];
					for(var i = 0; i < requireObj.length; i++) {
						if(requireObj[i].type == "lvl") {
							this.form_model8 = requireObj[i].value;
						} else if(requireObj[i].type == "projectTrain") {
							this.form_model5 = requireObj[i].name;
							this.trainId = requireObj[i].value; //返回的培训id
						} else if(requireObj[i].type == "appointUser") {
							var companyId = requireObj[i].value;
							userArr.push(companyId);
							this.userModel = userArr;
							console.log("aa");
							console.log(this.userModel);
						}
					}
					//项目可见度
					if(res.data.data.projectLevel == null || res.data.data.projectLevel == undefined) {
						console.log("dd");
					} else {
						this.iShiddenProject = res.data.data.projectLevel; //质检模板
					}
					this.taskDis = res.data.data.description;
					//采集标签
					this.collectionArrmodel = res.data.data.voiceExBusinessField;
					}else{
						this.$Message.error(res.data.msg);
						return false;
					}
				}).catch(function(err) {})
			},
			//项目类型
			projectKind() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectType //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					console.log(res);
					this.proKind = res.data.data.value;
				}).catch(function(err) {
					console.log(err);
				});
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
			//热门标签
			hotLable() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": that.projectTag //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					console.log('123');
					this.hotLabelList = res.data.data.value;
					console.log(this.hotLabelList);
				}).catch(function(err) {
					console.log(err)
				});
			},
			convertHot(e, list) {
				for(var i = 0; i < list.length; i++) {
					var l = list[i];
					if(e == l.key) {
						return l.value;
					}
				}
			},
			//工单模板
			workOrderTemplte() {
				this.axios.post('/task/searchXFormList.do', {
					"pageNum": 1, //类型：Number  必有字段  备注：页数
					"pageSize": 100 //类型：Number  必有字段  备注：每页条数
				}).then((res) => {
					console.log(res);
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
					console.log(res);
					this.trainList = res.data.data.result;
				}).catch(function(err) {
					console.log(err);
				});
			},
			//查询工作台类型
			workbenchF() {
				var that = this;
				this.axios.post('/task/searchWorkbench.do', {
					"projectType":that.convert(that.proKinds)
				}).then((res) => {
					if(res.data.code=='0'){
						this.workbenchList = res.data.data.value;
					}else{
						this.$Meesage.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			reviseCancel() {
				this.$emit("reviseCancel");
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
				if(this.projectName == '' || this.proKinds == '' || this.computefeeKind == '' || this.dataKind == '' || this.projectPhoto == ''||this.form_model4==''||this.iShiddenProject=='') {
					this.$Message.info('请填写必填信息');
					return false;
				}
				this.status = 1;
				//调用修改项目接口
				this.revisePublish();
				this.close();
				this.$emit("reviseCancel");
			},
			//保存按钮
			save() {
				
				//表达验证
				if(this.projectName == '' || this.proKinds == '' || this.computefeeKind == '' || this.dataKind == '' || this.projectPhoto == ''||this.form_model4==''||this.iShiddenProject=='') {
					this.$Message.info('请填写必填信息');
					return false;
				}
				this.status = 0;
				this.close();
				this.revisePublish();
				this.$emit("reviseCancel");
			},

			//项目类型id转换
			convert(e) {
				for(var i = 0; i < this.proKind.length; i++) {
					var l = this.proKind[i]
					if(e == l.value) {
						return l.key;
					}
				}
			},
			//工单模板类型id转换
			convert1(e) {
				for(var i = 0; i < this.workOrderTempate.length; i++) {
					var l = this.workOrderTempate[i];
					if(e == l.formTitle) {
						return l.metaDataId;
					}
				}
			},
			//结算模板id转换
			convert2(e) {
				for(var i = 0; i < this.settitle.length; i++) {
					var l = this.settitle[i];
					if(e == l.description) {
						return l.id;
					}
				}
			},
			//质检模板id转换
			convert4(e) {
				for(var i = 0; i < this.qualityTempletes.length; i++) {
					var l = this.qualityTempletes[i];
					if(e == l.name) {
						return l.id;
					}
				}
			},
			//工作台类型id转换
			convert5(e) {
				for(var i = 0; i < this.workbenchList.length; i++) {
					var l = this.workbenchList[i];
					if(e == l.description) {
						return l.name;
					}
				}
			},
			//修改
			revisePublish() {
				
				var that = this;
				//alert(that.projectId)
				this.axios.post('/task/updateProject.do', {
					"projectId": that.projectId,
					//"startTime": "mock", //类型：String  可有字段  备注：项目开始时间
					//"endTime": "mock", //类型：String  可有字段  备注：项目结束时间
					//"trainId": "mock", //类型：String  可有字段  备注：关联的培训ID
					"machineQualityId": this.convert4(this.form_model7)?this.convert4(this.form_model7):" ", //类型：String  可有字段  备注：关联的质检ID
					"accountId": this.convert2(this.form_model3)?this.convert2(this.form_model3):" ", //类型：String  可有字段  备注：关联的结算模版ID，如果是企业代码，该值必须要填
					//					"workorderId": this.convert1(this.form_model2), //类型：String  可有字段  备注：关联的工单模版ID
					"workorderId": that.workorderId?that.workorderId:" ", //类型：String  可有字段  备注：关联的工单模版ID
					"self": 1, //类型：Number  可有字段  备注：是否为自主发包
					"status": that.status, //类型：Number  可有字段  备注：只能将“编写”或“退回”改为“放弃”。“退回”时提交，后台要将状态改为“编写”
					"name": that.projectName, //类型：String  可有字段  备注：名称
					//"companyId": "mock", //类型：String  可有字段  备注：项目所属公司
					"type": this.convert(this.proKinds), //项目类型id
					"tags": that.hotArr, //热门标签
					"requires": that.requires,
					//					"classes": that.classTaskDis, //类型：String  可有字段  备注：班务说明
					"description": that.taskDis, //类型：String  可有字段  备注：项目描述
					"projectWorktimes": [{
						"startTime": Date.parse(that.workTime[0]),
						"endtime": Date.parse(that.workTime[1])
					}],
					"workbench": this.convert5(this.form_model4), //类型：String  必有字段  备注：工作台	
					"formType": "xform", //类型：String  必有字段  备注：工单类型，xform;工单，form：表单
					//					"qualification": that.qualityDis, //类型：String  可有字段  备注：资质说明
					"projectPhoto": that.projectPhoto, //类型：String  必有字段  备注：项目logo
					"thirdPartyUrl": that.thirdPartyUrl, //类型：String  可有字段  备注：第三方地址
					"wordsUrl": that.wordsUrl, //类型：String  可有字段  备注：话术地址
					"projectLevel": that.iShiddenProject, //类型：String  必有字段  备注：项目权限级别
					"voiceExBusinessField": that.collectionArrmodel //备注：语音标注额外业务字段
				}).then((res) => {
					if(res.data.code == 0) {
						//回调搜索项目接口
						this.$emit('childeMethod');
						this.$Message.success(res.data.msg);
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.selctKind {
		display: none;
	}
	
	.in_name {
		display: flex;
		flex-direction: row;
		align-items: center;
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
	
	.overflow {
		height: 75%;
		overflow-y: auto;
	}
	
	.Dialog {
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
			span {
				display: inline-block;
				width: 6em;
				text-align: right;
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
				width: 6em;
				text-align: right;
				vertical-align: top;
				margin-top: 5px;
				display: inline-block;
			}
		}
		#addTime {
			padding-left: 63px;
		}
		.bootom-button{
				.middleBtn2{
					margin-left: 20px;
					margin-right: 15px;
				}
			}
	}
</style>