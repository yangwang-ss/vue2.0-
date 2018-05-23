<template>
	<div class="main">
		<Row class="main-header h41" style="cursor: auto;">
			<Col>
			<span>技能培训</span>
			</Col>
		</Row>
		<Row class="main-content">
			<Col span="8" offset="0">
			<span class="information-xs">培训名称：</span>
			<input placeholder="请输入名称" class="inputText" v-model="trainingName">
			</Col>
			<Col span="14" class="" offset="1">
			<span class="information-xs">创建时间：</span>
			<Date-picker type="daterange" format="yyyy-MM-dd" placement="bottom-start" v-model="callTime" placeholder="选择日期"></Date-picker>
			</Col>
		</Row>
		<Row class="main-content">
			<Col span="8" offset="0">
			<span class="information-xs">模板状态：</span>
			<Select v-model="formworkModel" clearable>
				<Option v-for="item in formworkStatus" :value="item.key" :key="item.key">{{item.value}}</Option>
			</Select>
			</Col>
			<Col span="" class="searchAddresetting">
			<span class="smallBtn1 span" @click="addEdit(0,null)">新建</span>
			<span class="smallBtn2 span" @click="search()">搜索</span>
			<span class="smallBtnDefalt span" @click="resetting()">重置</span>
			</Col>
		</Row>
		<Row class="table-content">
			<table class="table">
				<tr class="trHeader">
					<td>培训名称</td>
					<td>考试类型</td>
					<td>创建时间</td>
					<td>状态</td>
					<td>操作</td>
				</tr>
				<tr v-for="(item,index) in table.data" :key="item.id">
					<td>{{item.trainName ? item.trainName : "暂无数据"}}</td>
					<td>{{item.checkType ? examinationType(item.checkType,examinationStatus) : "暂无数据"}}</td>
					<td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
					<td>{{item.status ? stateType(item.status) : "暂无数据"}}</td>
					<td class="check-more">
						<span @click="addEdit(1,item.id)">编辑</span>
						<span class="checkLink" @click="deleting(item.id)">删除</span>
						<span @click="enablementAndDisable(item.id,item.status)">{{item.status ? statusType(item.status) : "暂无数据"}}</span>
					</td>
				</tr>
			</table>
		</Row>
		<div id="page">
			<Page :total="table.total" :page-size="table.pageSize" @on-page-size-change="pageSizeToggle($event)" show-sizer show-elevator @on-change="pageToggle($event)"></Page>
		</div>
		<Row>
			<v-bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
				<div class="Dialog">
					<div class="bouncesHeader">
						<span class="information-xs">{{trainingAdminister.title}}</span>
						<span><i  class="icon iconfont icon-Delete" @click="bouncesHide=false"></i></span>
					</div>
					<div>
						<div class="bounces-item item-name">
							<span class="information-xs">培训名称<i style="color: red">*</i>：</span>
							<input placeholder="请输入" type="text" class="inputText" v-model="trainingAdminister.name">
						</div>
						<div class="bounces-area">
							<span class="information-xs" style="font-size: 12px;">培训描述：</span>
							<textarea placeholder="请输入" v-model="trainingAdminister.describe" cols="30" rows="4">
            </textarea>
						</div>
						<div style="display: flex;flex-direction: row;align-items: center;margin-top: 10px;">
							<span style="display: inline-block;width: 90px;text-align: right;margin-left: 120px;">技能<i style="color: red">*</i>：</span>
							<input id="" v-model="showTreeArr" type="hidden" value="">
							<TreeSelect ref="treeselectShow" v-model = "roletreeModelId" transfer @on-select-change="checkselectVal" :multiple="multiple" class="zrees" :data="treeBaseData" placeholder="请选择..." :width="232" :fields="treeFields"></TreeSelect>
						</div>
						<div class="bounces-item item-name bounces-cover">
							<span class="information-xs x">培训封面<i style="color: red">*</i>：</span>
							<span class="uploadWap">
						<Upload :before-upload="handleUploadImg" :action="picture2.action" :show-upload-list="false"
                     class="upload">
									<div class="choose-file">
										<i class="iconfont icon-add"/>
										<span style="text-align: center;">上传</span>
						</div>
						<div class="showImag">
							<img :src="picture2.src" alt="" />
						</div>
						</Upload>
						</span>
						<span class="proTxt">封面图片只允许<i style="color: red;font-style: inherit;">1:1</i>比例尺寸图片</span>
					</div>
					<div class="bounces-item dataUploadFile">
						<span class="information-xs fileSpan">数据上传：</span>
						<div class="logunRt">
							<div class="uploadFile">
								<Upload multiple :before-upload="handleUpload1" :action="picture1.action" :show-upload-list="false" class="uploads">
									<Button type="primary" class="handButton" icon="ios-cloud-upload-outline">选择要上传的文件


                  </Button>
								</Upload>

								<p style="color: #9fa9b2;font-size: 12px;margin-top: 5px">
									<span>支持视频和文本文件上传</span>
								</p>

								<div v-for="(item,index) in fileList" class="fileLists">
									<span class="preNoWap">{{item.name?item.name:item.materialName}}</span>
									<span style="margin-left: 10px;" @click="deleteFile(index,item.materialId)"><img src="../../../static/img/deleteFile.png"/></span>
								</div>
							</div>

						</div>
					</div>
					<div class="bounces-item">
						<span class="information-xs">考试类型<i style="color: red">*</i>：</span>
						<Select placement="top" clearable v-model="examinationModel" id="bouncesSelect">
							<Option v-for="item in examinationStatus" :value="item.key" :key="item.key">{{item.value}}</Option>
						</Select>
					</div>
					<div class="bounces-item">
						<div v-if="examinationPaper.type===0" class="middleV">
							<span class="information-xs">试卷列表：</span>
							<Select placement="top" clearable v-model="examinationPaper.model" style="text-align: left;" :width="100">
								<Option v-for="item in examinationPaper.list" :value="item.metaDataId" :key="item.metaDataId">
									{{item.formTitle}}
								</Option>
							</Select>
							<span class="generation" @click="jumpxform">生成试卷</span>
						</div>
						<div v-if="examinationPaper.type===1">
							<span class="backDialSpan">回拔暂时无法使用,请调整考试类型</span>
						</div>
						<div v-if="examinationPaper.type===2||examinationPaper.type===3">
							<div class="bounces-areas">
								<span class="information-xs">文本内容<i style="color: red">*</i>：</span>
								<div class="logunRt" v-for="(item,index) in logunMdarin">
									<textarea cols="30" rows="4" v-model="item.textContent">
		                  </textarea>
									<div class="dialogue-md">
										<span @click="deletingMdarin(index,item.textId)"><i 
                                                            class="icon iconfont icon-retract"></i></span>
										<span @click="addMdarin()"><i  class="icon iconfont icon-spread"
                                                  v-if="index===(logunMdarin.length-1)"></i></span>
									</div>
								</div>
							</div>
							<div class="bounces-item item-names" v-if="examinationPaper.type===3">
								<span class="information-xs">预览时间<i style="color: red">*</i>：</span>
								<input type="text" class="inputText" v-model="previewTime"><span class="in_left">秒</span>
							</div>
							<div class="bounces-item item-names" v-if="examinationPaper.type===3">
								<span class="information-xs">考核时间<i style="color: red">*</i>：</span>
								<input type="text" class="inputText" v-model="remainingTime"><span class="in_left">秒</span>
							</div>
						</div>
					</div>
				</div>
				<div class="bounces-determine">
					<div class="middlBtnDefalt" @click="bouncesHide=false">取消</div>
					<div class="middleBtn1" @click="submit()" :disabled="examinationPaper.type===1" :class="{'active':examinationPaper.type===1}">提交
            </div>
				</div>
	</div>
	</v-bounces>
	</Row>
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
	import bounces from "@/components/btm-bounces.vue"
	import Tool from "../../getData/tool"
	export default {
		data() {
			return {
				//技能树
				roletreeModelId:[],
				treeBaseData: [],
				showTreeArr:[],
				treeFields: [{
						field: 'label',
						map: 'title'
					},
					{
						field: 'child',
						map: 'children'
					}
				],
				loading: true,
				handIndex: null,
				editeList: false,
				flieName: '支持视频和文本文件上传',
				editId: "",
				projectPhoto: '',
				file: null,
				fileId: [],
				files: [],
				fileList: [],
				examId: '',
				showFileList: [],
				multiple: true,
				loadingStatus: false,
				trainingAdminister: {
					title: "",
					name: "",
					describe: ""
				},
				bouncesHide: false,
				trainingName: "",
				callTime: null,
				table: {
					data: [{
						trainName: "",
						checkType: "",
						createTime: "",
						status: "",
						id: ""
					}],
					total: null,
					pageSize: 10, // 每页显示条数
					currentPage: 1, //当前页码
				},
				formworkModel: "",
				formworkStatus: [{
						value: "禁用",
						key: "0"
					},
					{
						value: "启用",
						key: "1"
					}
				],
				trainingModel: "",
				trainingLevel: [{
					value: "",
					key: ""
				}],
				examinationModel: "",
				examinationStatus: [{
					value: "",
					key: ""
				}],
				examinationPaper: {
					model: "",
					list: [{
						value: "实发",
						key: "0"
					}],
					type: false,
				},
				logun: {
					data: [{
						sentence: "",
						score: "",
						type: "",
						materialNames: []
					}]
				},
				logunTyp: {
					data: [{
						sentence: null,
						score: "",
						type: ""
					}]
				},
				logunMdarin: [{
					textContent: "",
					previewTime: "",
					remainingTime: ""
				}],
				picture1: {
					data: {},
					action: '/train/uploadTrainFile.do',
					src: "",
					validateErrorTip: '',
					uploadFile: null,
					backId: []
				},
				picture2: {
					data: {},
					action: '/fileUpload.do',
					src: "",
					validateErrorTip: '',
					uploadFile: null,
					//					backId:[]
				},
				infoForm: {
					photo: null
				}
			}
		},
		components: {
			"v-bounces": bounces
		},
		mounted() {
			this.getTrainingGrade();
			this.getExaminationPaperType();
			this.getAcquiescenceDrop();
			this.getTrainingDetails();
			//技能树
			this.getSkillTree();
		},
		
		methods: {
			popupShutDown(){},
			//工单页面跳转
			jumpxform() {
				this.$router.push('/formMgt');
			},
			//技能树
			getSkillTree() {
				this.axios.post('/enterprise/getUserSkillForSkillList.do', {

				}).then((res) => {
					this.treeBaseData = res.data.data.result;
				}).catch((err) => {
					console.log(err);
				});
			},
			
			//技能树ID获取
			checkselectVal(data) {
				this.roletreeModelId = [];
				for(var x in data) {
					if(data[x].type==2){
						var skillIdObj = {skillId:data[x].id}
					this.roletreeModelId.push(skillIdObj);
					console.log(this.roletreeModelId);
					this.roletreesid = this.roletreeModelId;
					}
				}
			},
			// 新建个编辑的事件
			addEdit(index, id) {
				switch(index) {
					case 0:
						{
							this.logunMdarin = [{
								textContent: "",
								previewTime: "",
								remainingTime: ""
							}],
							this.roletreeModelId = [];
							this.roletreesid = [];
							this.editeList = false;
							this.trainingAdminister.title = "新建技能培训";
							this.picture2.src = '';
							this.examinationPaper.type = '';
							this.trainingAdminister.name = "";
							this.trainingAdminister.describe = "";
							this.examinationModel = "";
							this.fileList = [];
							this.fileId = [];
							this.files = [];
							this.logun.data = [{
								sentence: "",
								score: "",
								type: "",
								materialNames: []
							}];
							this.logunTyp.data.splice(1, this.logunTyp.data.length);
							
							break
						}
					case 1:
						{
							this.editeList = true;
							this.trainingAdminister.title = "编辑技能培训";
							this.editId = id;
							console.log('aa');
							setTimeout(()=>{
								this.getDefaultLoad(id);
							},0);
							
							setTimeout(()=>{
								this.setDefaultDataTree('treeselectShow');
							},1000);
							
							
						}
				}
				this.bouncesHide = true;
			},
			//技能树回显
			
			setDefaultDataTree(ref){
				var idArr =[];
				for(var i=0;i<this.showTreeArr.length;i++){
					idArr.push(this.showTreeArr[i].id);
				}
				console.log("aa");
				console.log(idArr);
				var ids = idArr.toString();
				this.$refs[ref].setDefaultValue(ids);
			},
			// 编辑-培训信息回显
			getDefaultLoad(id) {
				this.picture1.backId = [];
				this.axios.post("/train/queryTrainDeatil.do", {
					"trainId": id
				}).then((res) => {
					if(res.data.code === "0") {
						this.showTreeArr = res.data.data.skillBeans;
						this.trainingAdminister.name = res.data.data.trainName;
						this.trainingAdminister.describe = res.data.data.trainDescription;
						this.examinationModel = res.data.data.checkType;
						this.picture2.src = res.data.data.trainCoverId;
						if(res.data.data.checkExamination == null ||res.data.data.checkExamination == undefined){
							//console.log("undefined");
						}else{
							this.examId = res.data.data.checkExamination.examinationId;
							this.examinationPaper.model = res.data.data.checkExamination.questionId;
						}
						this.logunMdarin = res.data.data.checkTexts.length > 0 ? res.data.data.checkTexts : this.logunMdarin;
	
						for(var i = 0; i < this.logunMdarin.length; i++) {
							if(this.logunMdarin[i].previewTime!==undefined&&this.logunMdarin[i].remainingTime!==undefined){
							this.previewTime = this.logunMdarin[i].previewTime;
							this.remainingTime = this.logunMdarin[i].remainingTime;
							}
						}
						this.fileList = res.data.data.materials;
						let infoForm = {};
						res.data.data.materials.map((item) => {
							infoForm = {
								materialId: item.materialId,
								srcId: item.srcId
							};
							this.picture1.backId.push(infoForm)
						});
					}
				}).catch((err) => {
					console.log(err, "编辑培训失败")
				})
			},
			// 编辑修改接口
			getModification() {
				var that = this;
				this.axios.post("/train/update.do", {
					"materials": that.picture1.backId,
					"id": that.editId,
					"trainName": that.trainingAdminister.name,
					"trainDescription": that.trainingAdminister.describe, //类型：String  必有字段  备注：培训描述
					"subject": 1,
					"trainCoverId": that.picture2.src,
					"checkType": that.examinationModel,
					"checkExamination": { //类型：Object  可有字段  备注：考核文本的数据节点
						"examinationId": that.examId, //类型：String  必有字段  备注：考核Id
						"questionId": that.examinationPaper.model //类型：String  可有字段  备注：问题工单ID
					},
					"checkTextS": that.logunMdarin, //文本内容
					"skillBeans":that.roletreeModelId//技能id
				}).then((res) => {
					if(res.data.code === "0") {
						this.$Message.success(res.data.msg);
						this.getTrainingDetails();
					} else {
						this.$Message.error(res.data.msg);
						return
					}
				}).catch((err) => {
					console.log(err, "不添加")
				})
			},
			submit() {
				// 新建提交
				if(this.trainingAdminister.title === "新建技能培训") {
					this.logunMdarin.map((item) => {
						item.previewTime = this.previewTime;
						item.remainingTime = this.remainingTime;
					});
					if(this.trainingAdminister.name && this.examinationModel&&this.picture2.src&&this.roletreesid.length>0) {
						let content = {
							trainName: this.trainingAdminister.name, //培训名称
							trainDescription: this.trainingAdminister.describe, // 培训描述
							trainCoverId: this.projectPhoto, // 上传的图片
							files: this.files, // 文件的id
							checkType: this.examinationModel, //考试类型
							questionId: this.examinationPaper.model, // 试卷
							checkTextS: this.logunMdarin, //文本内容
							skill:this.roletreeModelId//技能id
						};
						this.bouncesHide = false;
						this.getCreateTrain(content)
					} else {
						this.$Message.warning({
							content: "请填写必填项",
							duration: 1
						})
					}
				}
				//编辑提交
				else {
					let arr = [];
					let file = {
						id: this.infoForm.photo
					};
					if(this.infoForm.photo) {
						arr.push(file)
					}
					if(this.trainingAdminister.name && this.examinationModel&&this.picture2.src&&this.roletreesid.length>0) {
						this.bouncesHide = false;
						console.log(this.logunMdarin.length);
						this.logunMdarin.map((item) => {
						item.previewTime = this.previewTime;
						item.remainingTime = this.remainingTime;
					});
						//编辑更新
						this.getModification();
					} else {
						this.$Message.warning({
							content: "请填写必填项",
							duration: 1
						})
					}

				}

			},
			getCreateTrain(content) {
				// 技能添加接口
				this.axios.post("/train/createTrain.action.do", {
					"lvl": content.trainingModel,
					"subject": 1,
					"trainName": content.trainName,
					"trainDescription": content.trainDescription,
					"trainCoverId": content.trainCoverId,
					"materials": content.materials,
					"checkType": content.checkType,
					"files": content.files,
					"questionId": content.questionId,
					"checkTextS": content.checkTextS,
					"skill":content.skill
				}).then((res) => {
					if(res.data.code === "0") {
						this.$Message.success(res.data.msg);
						this.getTrainingDetails();
					} else {
						this.$Message.error(res.data.msg);
						return
					}
				}).catch((err) => {
					console.log(err, "不添加")
				})
			},

			getExaminationPaperType() {
				// 试卷的接口
				this.axios.post("/train/getTrainTestPaperList.action.do", {
					"testPaperName": null,
					"pageNo": null,
					"pageSize": null
				}).then((res) => {
					if(res.data.code === "0") {
						this.examinationPaper.list = res.data.data.value;
					} else {
						return
					}
				}).catch((err) => {
					console.log(err, "不添加")
				})
			},
			getAcquiescenceDrop() {
				//考试类型的接口
				this.axios.post("/dictionary/searchParameterByName.action.do", {
					"name": "train_check_type"
				}).then((res) => {
					if(res.data.code === "0") {
						this.examinationStatus = res.data.data.value;
					}
				}).catch((err) => {
					console.log(err, "下拉")
				})
			},
			examinationType(type, list) {
				for(var i = 0; i < list.length; i++) {
					if(type == list[i].key) {
						return list[i].value
					}
				}
			},
			getTrainingGrade() {
				// 培训等级
				this.axios.post("/dictionary/searchParameterByName.action.do", {
					"name": "train_lvl"
				}).then((res) => {
					if(res.data.code === "0") {
						this.trainingLevel = res.data.data.value;
					}
				}).catch((err) => {
					console.log(err)
				})
			},

			getTrainingDetails(id, type) {
				// 默认查询培训列表-运营者
				this.axios.post("/train/getTrainInfoList.action.do", {
					"trainName": this.trainingName ? this.trainingName : "",
					"subject": 1,
					"status": this.formworkModel,
					"startDate": this.callTime ? Date.parse(this.callTime[0]) : null,
					"endDate": this.callTime ? Date.parse(this.callTime[1]) : null,
					"pageNo": this.table.currentPage,
					"pageSize": this.table.pageSize
				}).then((res) => {
					if(res.data.code === "0") {
						this.loading = false;
						this.table.data = res.data.data.result;
						this.table.total = res.data.data.totalItems;
					}
					console.log(res, "yes")
				}).catch((err) => {
					console.log(err, "no")
				})
			},
			getDelete(id) {
				//删除接口
				this.axios.post("/train/delete.action.do", {
					"trainId": id,
				}).then((res) => {
					if(res.data.code === "0") {
						this.getTrainingDetails()
					}
					console.log(res, "yes")
				}).catch((err) => {
					console.log(err, "no")
				})
			},
			getUpdateStatus(id, type) {
				// 更改培训状态-禁用停用
				this.axios.post("/train/updateStatus.action.do", {
					"trainId": id,
					"status": type
				}).then((res) => {
					if(res.data.code === "0") {
						this.getTrainingDetails()
						let ss = res.data.msg;
						this.$Message.success(ss);
					}
				}).catch((err) => {
					let ss = err.data.msg;
					this.error(ss);
					console.log(err, "no")
				})
			},
			handleUpload1(file) {
				// 数据上传

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
					if(!response) {
						_this.$Message.error("错误");
						return;
					}
					let result = response.data;
					if(!result || !result.code || result.code != 0) {
						_this.$Message.error(result.msg);
						return;
					}
					if(result.code == '0') {
						let srcId = {
								srcId: result.data.srcId
							},
							id = {
								id: result.data.id
							}
						let infoForm = {
//							materialId: result.data.id,
							srcId: result.data.srcId
						};
						_this.picture1.backId.push(infoForm)
						let fileMess = {
							name: result.data.name,
							id: result.data.id
						}
						_this.fileList.push(fileMess);
						_this.fileId.push(srcId);
						_this.files.push(id);
						_this.infoForm.photo = result.data.value;
						_this.Filename = result.data.name; //话术地址
						var msg = result.msg;
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
			//文件删除
			deleteFile(index, id) {
				this.axios.post('/train/deleteMaterial.do', {
					"materialId": id
				}).then((res) => {
					if(res.data.code == '0') {
						this.$Message.success(res.data.msg);
						this.picture1.backId.splice(index, 1);
						this.fileId.splice(index, 1);
						this.files.splice(index, 1);
						this.fileList.splice(index, 1);
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			handleUploadImg(file) {
				// 图片上传调用
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
					url: this.picture2.action,
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
					if(result.code == '0') {
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
			enablementAndDisable(id, type) {
				// 禁用-停用
				let status;
				if(type === "1") {
					status = "0";
				} else {
					status = "1"
				}
				this.getUpdateStatus(id, status)
			},
			resetting() {
				// 重置
				this.trainingName = "";
				this.callTime = "";
				this.formworkModel = "";
			},
			computationsCallTime(date) {
				return Tool.dateFormate(new Date(date), "yyyy-MM-dd hh:mm:ss")
			},

			statusType(type) {
				// 状态1
				switch(type) {
					case "0":
						{
							return "启用"
						}
					case "1":
						{
							return "禁用"
						}
				}
			},
			stateType(type) {
				// 状态2
				switch(type) {
					case "0":
						{
							return "已禁用"
						}
					case "1":
						{
							return "已启用"
						}
				}
			},
			//文本内容增删
			addMdarin() {
				let arr = {
					textContent: "",
					previewTime: this.previewTime,
					remainingTime: this.remainingTime
				};
				console.log(arr);
				this.logunMdarin.push(arr);
			},
			//删除文本
			deletingMdarin(index,id) {
				if(this.logunMdarin.length > 1) {
					this.deleteText(id);
					this.logunMdarin.splice(index, 1)
				} else {
					this.$Message.warning("不能再删了")
				}
			},
			//删除文本APi
			deleteText(id){
				this.axios.post('/train/deleteText.do',{
					 "textId":id //类型：String  必有字段  备注：培训文本Id
				}).then((res)=>{
					if (res.data.code=='0') {
						this.$Message.success(res.data.msg);
					} else{
						this.$Message.error(res.data.msg);
					}
				}).catch((err)=>{
					console.log(err);
				})
			},
			search() {
				this.getTrainingDetails();
			},

			deleting(id) {
				this.$Modal.confirm({
					title: '确认对话框标题',
					content: '确认要删除吗删除后将无法恢复',
					onOk: () => {
						this.getDelete(id)
					},
					onCancel: () => {

					}
				});
			},
			disable(id) {
				console.log("警用", id)

			},
			pageSizeToggle(e) {
				// 每页显示多少条
				this.table.pageSize = e;
				this.getTrainingDetails();
			},
			pageToggle(e) {
				//切换页数
				this.table.currentPage = e;
				this.getTrainingDetails();
			}
		},
		watch: {
			examinationModel(v) {
				switch(v) {
					case "0":
						{
							this.examinationPaper.type = 0;
							break
						}
					case "1":
						{
							this.examinationPaper.type = 1;
							break
						}
					case "2":
						{
							this.examinationPaper.type = 2;
							break
						}
					case "3":
						{
							this.examinationPaper.type = 3;
							break
						}
				}
			},
			trainingModel(v) {
				console.log(v)
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../../static/css/trainCommon.scss'
</style>