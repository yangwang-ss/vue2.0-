<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">新建技能</span>
				<span class="cancelWap"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="inputRow">
				<span class="spanW redStar">技能名称：</span>
				<input type="text" value="" placeholder="请输入" class="textInput" v-model="skillName" />
			</div>
			<div class="inputRow">
				<span style="vertical-align: top;" class="spanW">技能描述：</span>
				<textarea type="text" value="" placeholder="请输入" class="textBox" v-model="skillDes" />
			</div>
			<div class="inputRow">
				<span class="spanW">技能分类：</span>
				<span>
					<tree-select
          :treeData="treeData"
          :treeProps="treeProps"
          v-model="treeSelected"
          :multiple="false"
          placeholder="请选择部门"
          @errorCallback="showTreeError"
          @setSelectedId="setSelectedId">
      </tree-select>
				</span>
				<!--<input type="text" value="" placeholder="请输入" class="textInput" v-model="cycle" />-->
			</div>
			<div class="inputRow">
				<span class="spanW">图片：</span>
				<span class="uploadWap">
					<Upload :before-upload="handleUpload" :action="picture.action" :show-upload-list="false" :on-success="onSuccess" :on-error="onError" class = "upload">
								<div class="choose-file">
									<i class="iconfont icon-add" />
									<span style="text-align: center;">上传</span>
			</div>
			<div class="showImag">
				<img :src="picture.src" alt="" />
			</div>
			</Upload>
			</span>
		</div>
		<div class="bootom-button">
			<div class="middlBtnDefalt" @click="save">取消</div>
			<div class="middleBtn1" @click="release">确定</div>
		</div>
	</div>
	</div>
</template>

<script>
	import treeSelect from '@/views/config/tree.vue'
	export default {
		data() {
			return {
				treeSelected: '',
				treeData: [],
				treeProps: {
					label: "label",
					children: "children",
					level: "deptLevel"
				},
				taskTime: '',
				skillName: '', //技能名称
				skillDes: '', //技能描述
//				cycle: '', //批次周期
				picture: {
					data: {},
					action: '/upload.do',
					src: "",
					uploadFile: null,
				},
				files: [],
				fileId: ''
			}
		},
		components: {
			treeSelect
		},
		mounted() {
			this.menuList();
		},
		methods: {
			setSelectedId(val) {
				if(val instanceof Array) {
					this.treeSelectArr = val;
				} else {
					this.treeSelected = val;
				}
			},
			showTreeError(error) {
				this.$Message.success(error.message);
			},
			//技能分类树
			menuList() {
				this.axios.post('/enterprise/getUserSkillForSkillList.do', {
					//"id": 1, //类型：String  可有字段  备注：无
					//"name": "mock", //类型：String  可有字段  备注：菜单名称
					//"parentId": "mock" //类型：String  可有字段  备注：父节点Id
				}).then((res) => {
					console.log(res);
					this.treeData = res.data.data.result;
				}).catch(function(err) {
					console.log(err);
				})
			},
			//新建技能列表
			newSkillList() {
				var that = this;
				this.axios.post('/config/addSkill.do', {
					"name": that.skillName, //类型：String  必有字段  备注：技能名称
					"description":that.skillDes,  //类型：String  可有字段  备注：技能描述（非必有字段）
    				"url":that.picture.src,         //类型：String  必有字段  备注：技能封面图片
					"classifyId": that.treeSelected //类型：String  必有字段  备注：分类Id
				}).then((res) => {
					if(res.data.code == 0) {
						this.$Message.success(res.data.msg);
						//回调搜索项目接口
						this.$emit('childeMethod');
					}
					else{
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(res);
				});
			},
			handleUpload(file) {
				let _this = this;
				//console.log(file.name)
				if(!validateImageFile(file)) {
					return false;
				};
				let formdata = new FormData();

				formdata.append('file', file, file.name);
				formdata.append('type', '1');
				console.log(formdata);
				console.log(formdata.get("file"));

				//formdata.append('type', '1');

				var option = {
					method: 'post',
					url: this.picture.action,
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
						_this.picture.src = result.data.url;
						var msg = result.msg;
						_this.$Message.success(msg);
					}
				});

				function validateImageFile(file) {
					if(!file) {
						_this.$Message.success('文件出错');
						return false;
					}
					//
					//					if(file.size > 500 * 1024) {
					//						_this.$Message.success('图片大小不能超过500k');
					//						return false;
					//					}

					let types = file.type.split('/');

					if(types[0] != 'image') {
						_this.$Message.success('只能是jpg、jpeg、png图片');
						return false;
					}

					//					if(['jpg', 'jpeg', 'png'].indexOf(types[1]) < 0) {
					//						_this.$Message.success('只能是jpg、jpeg、png图片');
					//						return false;
					//					}
					return true;
				}
				return false;
			},
			onSuccess(response, file, fileList) {
				localImagePreview("preview", fileList);
				this.picture.validateErrorTip = '';
				this.picture.uploadFile = null;
				this.$Message.success('上传成功');
			},
			onError(error, file, fileList) {
				localImagePreview("preview", fileList);
				this.picture.validateErrorTip = '';
				this.picture.uploadFile = null;
				this.$Message.error('上传失败');
			},
			cancel() {
				this.$emit("cancel");
			},
			//确定按钮
			release() {
				this.newSkillList();
				this.$emit("cancel");
			},
			//取消按钮
			save() {
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Dialog {
		width: 46em;
		.headTitle {
			margin-bottom: 60px;
		}
		.tipText {
			width: 300px;
			padding-left: 60px;
			margin-left: 130px;
			color: #999;
		}
		.inputRow {
			width: 320px;
			margin-bottom: 15px;
			.spanW {
				display: inline-block;
				width: 80px;
				text-align: right;
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
		}
		.textBox {
			height: 80px;
			width: 228px;
		}
		.bootom-button {
			margin-top: 90px;
			
		}
		.uploadWap {
			display: inline-block;
			position: relative;
			width: 80px;
			height: 27px;
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
		}
	}
</style>