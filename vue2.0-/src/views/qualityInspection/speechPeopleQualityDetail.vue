<template>
	<div class="view">
		<div :class="objDataNull==null?'fixed':''">
			<div class="view-title">
				<span class="h42" @click="viewJump()">{{title}}／</span>
				<span class="h41">通话详情</span>
			</div>
			<div class="view-content">
				<div class="content">
					<p>基本描述</p>
					<div class="headPortrait">
						<img :src="imgUrl" alt="头像">
					</div>
					<div class="invoice">
						<span class="information-sm">{{projectsName?projectsName:"暂无数据"}}</span>
						<span class="name-xs">拨打时间：</span><span style="font-size: 14px;">{{callTime?computationsCallTime(callTime):"暂无数据"}}</span>
					</div>
				</div>
				<div class="content">
					<p>客户资料</p>
					<Row>
						<Col span="10">
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">月均消费：</span>
						</Col>
						<span class="information-xs"> {{custterMess.月均消费}}
						</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">电话：</span>
						</Col>
						<span class="information-xs">{{custterMess.电话}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">COUNTY_CODE：</span>
						</Col>
						<span class="information-xs">{{custterMess.COUNTY_CODE}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">流量资费：</span>
						</Col>
						<span class="information-xs">{{custterMess.流量资费}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">当前状态：</span>
						</Col>
						<span class="information-xs">{{custterMess.当前状态}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">实名：</span>
						</Col>
						<span class="information-xs">{{custterMess.实名}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">推荐路径：</span>
						</Col>
						<span class="information-xs">{{custterMess.推荐路径}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">ORDER_NAME：</span>
						</Col>
						<span class="information-xs">{{custterMess.ORDER_NAME}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">CUST_NAME：</span>
						</Col>
						<span class="information-xs">{{custterMess.CUST_NAME}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">语音模组名称：</span>
						</Col>
						<span class="information-xs">{{custterMess.语音模组名称}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">月均通话：</span>
						</Col>
						<span class="information-xs">{{custterMess.月均通话}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">CREATE_DATE：</span>
						</Col>
						<span class="information-xs">{{custterMess.CREATE_DATE}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"><span class="textLt">手机上网模组名称：</span>
						</Col>
						<span class="information-xs">{{custterMess.手机上网模组名称}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">TRADEMARK：</span>
						</Col>
						<span class="information-xs">{{custterMess.TRADEMARK}}</span>
						</Col>
						<Col span="24">
						<Col span="5" class="name-xs"> <span class="textLt">月均省际流量：</span>
						</Col>
						<span class="information-xs">{{custterMess.月均省际流量}}</span>
						</Col>
						</Col>
						<Col span="14">
						<Col span="4" class="name-xs speechTechnique"> 开场话术：
						</Col>
						<Col class="information-xs speechTechnique scroll"> {{appeaCusmentVo.wordTxt}}
						</Col>
						</Col>
					</Row>
				</div>
				<div class="content">
					<p>工作单记录</p>
					<div class="ut-container" ref="box">

					</div>
					<Row>
						<Col span="10" class="content-spacing">
						<Col span="5" class="name-xs"> <span class="textLt">工作标题：</span>
						</Col>
						<Col class="information-xs"> 我是一个工作单
						</Col>
						</Col>
					</Row>
					<Row>
						<Col span="8" class="content-spacing">
						<Col span="6" class="name-xs"> <span class="textLt">状态类型：</span>
						</Col>
						<Col class="information-xs"> 无应答
						</Col>
						</Col>
						<Col span="8" class="content-spacing">
						<Col span="6" class="name-xs"> <span class="textLt">是否有效：</span>
						</Col>
						<Col class="information-xs"> 无效
						</Col>
						</Col>
						<Col span="8" class="content-spacing">
						<Col span="6" class="name-xs"> <span class="textLt">客户分类：</span>
						</Col>
						<Col class="information-xs"> 优质
						</Col>
						</Col>
					</Row>
					<Row>
						<Col span="10" class="content-spacing">
						<Col span="5" class="name-xs"> <span class="textLt">客户意愿：</span>
						</Col>
						<Col class="information-xs"> 很强烈
						</Col>
						</Col>
					</Row>
					<Row>
						<Col span="10">
						<Col span="5" class="name-xs"> <span class="textLt">备注：</span>
						</Col>
						<Col class="information-xs"> 我是备注
						</Col>
						</Col>
					</Row>
				</div>
				<div class="content">
					<p>质检</p>
					<Row>
						<Col span="6">
						<input type="text" v-model="playDateText" class="inputText" disabled="true" v-if="audioInputShow">
						<input type="text" v-model="subdivision" class="inputText" disabled="true" v-else>
						</Col>
						<Col span="15" class="paramsAudio">
						<audio :src="audioUrl" controls="controls" preload="auto" style="width: 600px;margin-bottom: 40px;" id="audio"></audio>
						</Col>
					</Row>
				</div>
				<div class="content">
					<p style="border-bottom: 1px solid #E9E9E9;">对话</p>
					<div style="font-size: 14px;display: flex;flex-direction: row;justify-content: space-between;margin: 10px 0;">
						<span>客服</span>
						<span>客户</span>
					</div>
					<div class="communicationContent" id="communicationContent" ref="communicationContent">
						<div class="communication" v-for="(item,index) in currentLyrics" :key="item.id" :id="item.id">
							<div class="information-xs" :class="{'pink': showPink(item,index)}" v-if="item.Talkrole=='1'">{{item.texts}}</div>
							<div class="information-xs users" :class="{'pink': showPink(item,index)}" v-if="item.Talkrole=='2'">
								{{item.texts}}
							</div>
						</div>
					</div>

				</div>
				<!--波形图-->
				<!--<div class="content">
					<div id="waveform">
					</div>
				</div>-->
				<div class="content">
					<div class="content-bt">
						<p class="content-pLeft">问题对话</p>
						<p class="content-pMidden">扣分类型</p>
						<p class="content-pRight">
							扣分情况
						</p>
					</div>
					<div class="dialogue" v-for="(item,index) in dialogue.data" :key="index">
						<div class="dialogue-lg information-xs">
							<input type="text" v-model="item.sentence" class="dialogueInput" placeholder="请输入">
						</div>
						<div class="dialogue-select information-xs">
							<select v-model="item.markstype" class="information-xs">
								<option v-for="str in dialogue.words" :value="str.value" :key="str.value">{{ str.name }}</option>
							</select>
						</div>
						<div class="dialogue-sm name-xs"><input type="number" v-model="item.score" class="dialogue-smInput" placeholder="请输入"></div>
						<div class="dialogue-md information-xs">
							<span @click="stipulateDatePlay(index,item.starttime)" :class="playShow==index?'imgActive':''"></span>
							<span @click="deletConfirm(index,item.id)"><i class="icon iconfont icon-retract"></i></span>
							<span @click="add()"><i class="icon iconfont icon-spread"
                                    v-if="index===(dialogue.data.length-1)"></i></span>
						</div>
						<div class="dialogue-ts">
						</div>
					</div>
				</div>
				<!--<div class="content">
					<p>申诉回执</p>
					<Row>
						<Col span="24" class="name-xs content-spacing"> 申诉描述
						</Col>
						<Col span="24">
						<textarea cols="50" rows="6" v-model="complaintDescribe" disabled></textarea>
						</Col>
					</Row>
					<Row>
						<Col span="24" class="name-xs content-spacing"> 请对申诉问题进行回执：
						</Col>
						<Col span="24">
						<textarea cols="50" rows="6" v-model="complanintReturnReceipt" v-if="complaintDescribe==null" disabled></textarea>
						<textarea cols="50" rows="6" v-model="complanintReturnReceipt" v-else></textarea>
						</Col>
					</Row>
				</div>-->

			</div>
			<div class="view-receipt">
				<span class="smallBtn2" @click="getCommit()" :class="isShow">确定</span>
			</div>
		</div>
		<!--数据加载等待效果-->
		<Spin fix v-show="loading" v-if="objDataNull==null">
			<div>
				<svg class="circular" viewBox="25 25 50 50">
					<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
				</svg>
			</div>
		</Spin>
	</div>
</template>
<script>
	import Toll from "../../getData/tool";
	import WaveSurfer from '../../../static/js/wavesurfer.js';
	import formengine from "../../../static/js/formengine"
	export default {
		data() {
			return {
				loading: true,
				isShow:'',
				currentRowIndex: 0,
				audioUrl:'',
				currentLyrics: [{
					time: 0,
					text: '此歌曲暂无歌词~'
				}],
				objDataNull: null,
				appeaCusmentVo: {},
				playShow:null,
				projectsName: '',
				callTime: '',
				imgUrl: "",
				playDate: "",
				playDateText:'已播放0s',
				audioInputShow: true,
				audioId: "",
				custterMess:'',
				pointKey: "",
				chatContent: false,
				wavesurfer: {},
				information: [],
				dialogue: {
					data: [{
						sentence: ""
					}],
					words: [{
							name: "语速",
							value: "1"
						},
						{
							name: "静默",
							value: "2"
						},
						{
							name: "关键词",
							value: "3"
						},
						{
							name: "图片",
							value: "4"
						}
					],
				},
				feedbacks: "",
				complaintDescribe: "",
				complanintReturnReceipt: ""
			}
		},
		computed: {
			title() {
				let url = this.$route.query;
				if(url.name == "complaintHandling") {
					return "申诉处理"
				} else {
					return "抽检"
				}
			}
		},
		watch: {
			currentRowIndex() {
				//console.log(this.$refs.communicationContent.scrollHeight);
				this.$refs.communicationContent.scrollTop = this.currentRowIndex * (this.$refs.communicationContent.scrollHeight / this.currentLyrics.length);
			}
		},
		methods: {
			//语音文本索引变换
			showPink(item, index) {
				let last = item.time,
					next = this.currentLyrics[index + 1] ? this.currentLyrics[index + 1].time : 999999;
				if(this.playDate >= last && this.playDate < next) {
					this.currentRowIndex = index;
					return true;
				}
			},
			getDefaultLoad() {
				let ele = this.$refs.box;
				// 页面初始化-
				var jobId = this.$route.query.jobId
				this.axios.post("appeal/findAppeaDetail.do", {
					"jobId": jobId
				}).then((res) => {
					if(res.data.code === "0") {
						this.custterMess = res.data.data.yxdqMap;
						this.objDataNull = res.data.data;
						this.projectsName = res.data.data.appeaCusmentVo.proJectName;
						this.callTime = res.data.data.appeaCusmentVo.startDate;
						this.imgUrl = res.data.data.appeaCusmentVo.projectPhoto;
						this.audioUrl = res.data.data.appeaCusmentVo.url;
						this.appeaCusmentVo.nickName = res.data.data.appeaCusmentVo.nickName;
						this.appeaCusmentVo.phoneNumber = res.data.data.appeaCusmentVo.phoneNumber;
						this.appeaCusmentVo.intentionArea = res.data.data.yxdq;
						this.appeaCusmentVo.wordTxt = res.data.data.wordTxt;
						this.dialogue.data = res.data.data.listCheck;
						this.feedbacks = res.data.data.feedbacks[0];
						this.complaintDescribe = res.data.data.feedbacks.length > 0 ? res.data.data.feedbacks[0].info : null;
						this.complanintReturnReceipt = res.data.data.feedbacks.length > 0 ? res.data.data.feedbacks[1].info : null;
						this.information = res.data.data.problemdialogue;
						this.loading = false; //数据加载优化
						console.log(res.data.data.problemdialogue);
						var voiceArr = [];
						for(var i = 0; i < this.information.length; i++) {
							let time = 0;
							let str = '';
							var role = this.information[i].customer;
							var time_Str = this.information[i].customerContent.split('[')[1];
							var time_T = this.information[i].customerContent.split('[')[1].split(']')[0];
							str = this.information[i].customerContent.split('[')[1].split(']')[1];
							if(time_T.trim() != '') {
								time = time_T.slice(1, 5).split(':');
								time = parseInt(time[0]) * 60 + parseInt(time[1]);
							}
							let objText = {
								time: time,
								texts: str,
								Talkrole:role
							}
							voiceArr.push(objText)
						}
						this.currentLyrics = voiceArr;
						console.log(voiceArr);
					} else {
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err, "no是你吗")
				})
			},
			getCommit() {
				// 确定提交
				let id = this.$route.query.jobId;
				this.axios.post("appeal/updatedQuality.do", {
					"tParam": this.dialogue.data,
					"questionId": this.feedbacks ? this.feedbacks.id : null,
					"businessId": this.feedbacks ? this.feedbacks.businessid : null,
					"answer": this.complanintReturnReceipt,
					"jobId": id
				}).then((res) => {
					if(res.data.code === "0") {
						this.$Message.info("提交成功");
						this.isShow = 'ButtonShow';
					}else{
						this.isShow = '';
						this.$Message.error(res.data.msg);
					}
				}).catch((err) => {
					console.log(err);
				})

			},
			viewJump() {
				if(this.title === "抽检") {
					this.$router.push({
						path: "/sampling"
					})
				} else {
					this.$router.push({
						path: "/complaintHandling"
					})
				}
			},
			computationsCallTime(date) {
				return Toll.dateFormate(new Date(date), "yyyy-MM-dd")
			},
			//删除确认
			deletConfirm(index,id) {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.axios.post('/appeal/deleteQuality.do',{
					qualityId:id
				}).then((res)=>{
					this.$Message.info("删除成功");
					if(this.dialogue.data.length > 1) {
					this.dialogue.data.splice(index, 1)
				} else {
					this.$Message.warning("不能再删了")
				}
				}).catch((err)=>{
					console.log(err)
				});
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
			add() {
				let arr = {
					sentence: ""
				};
				this.dialogue.data.push(arr)
				console.log()
				//        this.$Message.warning('抱歉暂时还不能添加')
			},
			audioinit(){
				this.audioId = document.getElementById("audio");
				let _this = this;
				//this.audioId.currentTime = date ? date : this.audioId.currentTime;
				this.audioId.addEventListener('timeupdate', function() {
							// 播放中
							let s = Math.floor(_this.audioId.currentTime);
							_this.playDate = s;
							_this.playDateText = "已播放"+s+"s"
							
						}, false);
						this.audioId.addEventListener('ended', function() {
							// 播放完之后
							let playDate = Math.floor(_this.audioId.currentTime);
							_this.playDateText = "共播放-" + Math.floor(playDate / 60) + "分" + playDate % 60 + "秒";
						}, false);
			},
			stipulateDatePlay(index, date) {
				this.playShow = index;
			}
		},
		mounted() {
			this.getDefaultLoad();
			this.audioinit();
//			this.wavesurfer = WaveSurfer.create({
//				container: '#waveform',
//				waveColor: '#4cf3a7', // 未播放部分波形颜色
//				progressColor: 'green', // 已播放部分波形颜色
//				height: 50
//			});
		}

	}
</script>
<style lang="scss" scoped="scoped">
	.fixed {
		height: 200px;
		overflow: hidden;
	}
	.ButtonShow{
		visibility: hidden !important;
	}
	.pink {
		color: #eb7470;
	}
	
	.view {
		width: 100%;
	}
	
	
	.name-xs{
		width: 130px !important;
		text-align: right;
		margin-right: 5px;
	}
	.view-title {
		width: 100%;
		border-bottom: 1px solid #e9e9e9;
		span {
			display: inline-block;
		}
	}
	
	.view-content {
		width: 100%;
	}
	
	.content {
		margin: 0 auto;
		padding-bottom: 10px;
		border-bottom: 1px solid #e9e9e9;
		overflow: hidden;
		p {
			color: #4d4d4d;
			padding: 20px 0;
			font-size: 16px;
		}
		.content-bt {
			width: 100%;
			overflow: hidden;
		}
		.content-pLeft {
			width: 60%;
			float: left;
		}
		.content-pRight {
			float: left;
			width: 80px;
			text-align: center;
			
		}
		.content-pMidden {
			float: left;
			width: 80px;
			text-align: center;
			
		}
		.dialogue {
			width: 100%;
			overflow: hidden;
			padding-bottom: 20px;
			display: flex;
			align-items: center;
			
			div {
				float: left;
			}
			.dialogue-lg {
				width: 60%;
				height: 60px;
				padding: 10px;
				/*border: 2px solid #ccc;*/
				border-radius: 5px;
				.dialogueInput {
					
					width: 100%;
				}
			}
			.dialogue-sm {
				width: 80px;
				height: 60px;
				/*border: 2px solid #ccc;*/
				margin-left: 10px;
				border-radius: 5px;
				padding: 10px;
				text-align: center;
				.dialogue-smInput {
					width: 100%;
					/*border: none;*/
				}
			}
			.dialogue-select {
				width: 58px;
				height: 45px;
				border: 1px solid #ccc;
				margin-left: 10px;
				border-radius: 5px;
				margin-top: 8px;
				select {
					padding-left: 5px;
					text-align: center;
					cursor: pointer;
					outline: none;
					border: none;
					appearance: none;
					-moz-appearance: none;
					-webkit-appearance: none;
					height: 42px;
					width: 100%;
					font-size: 14px;
				}
			}
			.dialogue-md {
				width: 100px;
				height: 47px;
				color: red;
				margin-left: 10px;
				cursor: pointer;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				margin-top: 8px;
				span:nth-of-type(1) {
					display: inline-block;
					height: 20px;
					background: url("../../../static/img/play_fill.png") no-repeat;
					background-size: 20px;
					&.imgActive {
						background: url("../../../static/img/suspend.png") no-repeat;
						background-size: 20px;
					}
				}
				span {
					flex: 1;
					&.changeActive {
						color: #108EE9;
					}
				}
			}
		}
		.headPortrait {
			float: left;
			img {
				display: block;
				width: 80px;
				text-align: center;
				height: 80px;
			}
		}
		.invoice {
			float: left;
			margin-left: 20px;
			.information-sm {
				display: block;
				line-height: 40px;
				color: #333;
				font-size: 14px;
			}
			.dialingDate {
				margin-left: 20px;
			}
			.invoice-text {
				font-size: 16px;
			}
			.invoice-date {
				font-size: 14px;
				color: #666;
			}
		}
		.speechTechnique {
			max-height: 380px;
			overflow-y: auto;
			white-space: pre-line;
		}
	}
	
	.communicationContent {
		width: 100%;
		max-height: 300px;
		overflow-y: auto;
	}
	.communicationContent::-webkit-scrollbar {
            display: none;
        }
	.communication {
		width: 100%;
		padding: 0 10px;
		div {
			width: 100%;
			&.changeActive {
				color: #108EE9;
			}
			span {
				&.delayActive {
					color: red;
					transition: color 2s;
				}
			}
		}
		.users {
			text-align: right;
		}
	}
	
	.view-receipt {
		margin-top: 20px;
		span {
			display: inline-block;
			text-align: center;
		}
	}
</style>