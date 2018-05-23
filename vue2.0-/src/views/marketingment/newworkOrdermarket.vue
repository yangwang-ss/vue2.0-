<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">修改轮播图</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png"/></span>
			</div>
			<div class="overflow scroll">
				<div class="inputRow" style="margin-top: 15px;">
					<span>投放渠道：</span>
					<Select clearable v-model="work_model2" class="select">
			          <Option v-for="item in workinput2" :value="item.value" :key="item.value">{{ item.label }}</Option>
			        </Select>
				</div>
				<div class="inputRow">
					<span>跳转地址：</span>
					<input type="text" value="" v-model="urlPath" placeholder="请输入" class="textInput" />
				</div>
				<div class="inputRow">
					<span>发送目标：</span>
					<Select clearable v-model="showChannel" class="select">
						<Option v-for="item in sendingList" :value="item.key" :key="item.key">{{ item.value}}</Option>
					</Select>
					<!--<input type="text" value="" v-model="showChannel" placeholder="请输入" class="textInput" />-->
				</div>
				<div class="inputRow">
					<span>停留时间(秒)：</span>
					<input type="number" value="" placeholder="请输入" class="textInput" v-model="banTime" min="0" />
				</div>
				<div class="inputRow">
					<span>排序位置：</span>
					<input type="number" value="" v-model="weigth" placeholder="请输入" class="textInput" min="0" />
				</div>
				<div class="inputRow">
					<span>生效时间：</span>
					<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange"
						placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
				</div>
				<div class="inputRow">
					<span>说明：</span>
					<textarea name="" rows="" cols="" style="width: 230px;" v-model="descritions"></textarea>
				</div>
				<div class="inputRow">
					<div class="form-style">
						<div class="ivu-form-item">
							<div class="ivu-form-item-content" style="margin-left: 170px;">
								<div class="ivu-input-wrapper ivu-input-type" style="width:88px;height:88px">
									<!-- :headers="picture.headers" :data="picture.data" :show-upload-list="picture.showUploadList" :accept="picture.accept" :format="picture.format" :max-size="picture.size" :on-exceeded-size="onExceededSize" :on-format-error="onFormatError" -->
									<Upload :before-upload="handleUpload" :action="picture.action" :show-upload-list="false">
										<div class="choose-file">
											<i class="iconfont icon-add" />
											<span class="up_img">上传</span>
										</div>
										<div class="showImag">
											<img :src="projectPhoto" alt="" />
										</div>
									</Upload>
								</div>
								<!-- <div class="ivu-form-item-error-tip" :show="picture.validateErrorTip">
		            {{picture.validateErrorTip}}</div> -->
							</div>
						</div>
					</div>
					<!--<img class="work_img" src="../../../static/img/video_cover.png" alt="" />-->
					<p>请上传750*400像素，格式为png或jpg的图片。大小不超过500k。</p>
				</div>
				<div class="bootom-button">
					<div class="middlBtnDefalt" @click="cancel">取消</div>
					<div class="middleBtn1" @click="btn">提交</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Tool from "../../getData/tool"
	export default {
		data() {
			return {
				reviseState:'',
				id:'',
				statue:'',
				banTime:'',
				urlPath:'',
				weigth:'',
				showChannel:'',
				sendingList:[],
				descritions:'',
				value2: ['2016-01-01', '2016-02-15'],
				valueTime:[],
				workinput1: [{
						value: '0',
						label: '已启用'
					},
					{
						value: '1',
						label: '已禁用'
					}
				],
				workinput2: [{
						value: 'PHONE',
						label: '手机'
					},
					{
						value: 'PC',
						label: '电脑'
					},
					{
						value: 'ALL',
						label: '全部'
					}
				],
				dateValue:[],
				work_model2: '',
				wordsUrl: '', //话术地址
				projectPhoto: '', //logo
				picture: {
					data: {},
					action: '/fileUpload.do',
					src: "",
					uploadFile: null,
				}
			}
		},
	    watch: {
	      dateValue(v){
	        console.log(Date.parse(v[0]), "1");
	        console.log(Date.parse(v[1]), "2");
	      },
	      
	      work_model2(v){
	      	console.log(v,"sss");
	      }
	    },
	    mounted(){
	    	this.sendingTarget();
	    },
		methods: {
			//项目信息
			projectMessinfo(id) {
				this.dateValue.splice(0,this.dateValue.length);
				var that = this;
				this.axios.post('/mkmanager/viewEleInfo/'+id+'.do', {
				}).then((res) => {
//					console.log(res,"修改轮播图");
					this.id = res.data.data.id;
					this.reviseState = res.data.data.statue;
					this.work_model2 = res.data.data.showChannel;
					this.descritions= res.data.data.description;
					this.urlPath = res.data.data.urlPath;
					this.showChannel = res.data.data.sendTarget;
					this.banTime = res.data.data.banTime;
					this.weigth = res.data.data.weigth;
					this.dateValue.push(Tool.dateFormate(new Date(res.data.data.startTime), "yyyy-MM-dd"));
					this.dateValue.push(Tool.dateFormate(new Date(res.data.data.endTime),"yyyy-MM-dd"));
					this.projectPhoto = res.data.data.picPath;
				}).catch(function(err) {})
			},
			//目标发送
			sendingTarget(){
				this.axios.post('/mkmanager/selectTarget.do',{}).then((res)=>{
					if(res.data.code=='0'){
						this.sendingList = res.data.data.value;
					}else{
						this.$Message.error(res.data.msg);
					}
				}).catch((err)=>{
					console.log(err);
				})
			},
			cancel() {
				this.$emit("cancel");
			},
			btn() {
				let that = this;
				let content={
					showChannel:that.showChannel,
					sendTarget:that.work_model2,
					description:that.descritions,
					urlPath:that.urlPath,
					banTime:that.banTime,
					weigth:that.weigth,
					startTime:Date.parse(that.dateValue[0]),
					endTime:Date.parse(that.dateValue[1]),
					projectPhoto:that.projectPhoto,
					statue:that.reviseState
				}
				this.$emit("sumbit",{
					id:this.id,
					content:content
				});
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
		    },
			handleUpload(file) {
				let _this = this;

				if(!validateImageFile(file)) {
					return false;
				};

				let formdata = new FormData();
				formdata.append('file', file, file.name);
				formdata.append('type', '1');

				var option = {
					method: 'post',
					url: this.picture.action,
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
						console.log(result)
						_this.picture.src = result.data.value;
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
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow{
		height: 100%;
		overflow-y: auto;
		.inputRow{
			width: 400px;
			span{
				width: 80px;
				text-align: right;
				display: inline-block;
			}
			.work_img{
				width: 88px;
				height: 88px;
				margin-top: 10px;
				margin-bottom: 20px;
			}
			.form-style {
			    margin-left: -86px;
			}
			.ivu-input-wrapper{
			   width: 88px !important;
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
			    span.up_img{
			    	text-align: center;
			    }
			  }
			}
		}
	.Dialog {
			min-width: 560px;
		.headTitle{
			/*margin-bottom: 22px;*/
		}
		.inputRow {
			margin-bottom: 15px;
		}
		
	}
</style>
