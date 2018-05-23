<template>
	<div id="imgLableDetail">
		<div class="titleWap">
			<h4 class="h42" @click="goback">语音标注人工质检/</h4>
			<h4 class="h41" style="cursor: auto;">{{projecName}}</h4>
		</div>
		<div class="messageDetail">
			<div class="smallTitle">任务详情</div>
			<span class="row" v-for="item in profitList" style="display: inline-block;">
				<span class="lT">{{item.description}}&nbsp;:&nbsp;</span>
				<span>{{item.value}}元/件</span>
				<!--<span class="rT">1元/件</span>
				<span class="lT">谷豆收入单价：</span>
				<span class="rT">0元/件</span>
				<span class="lT">灵力值：</span>-->
				
			</span>
			<div class="row">
				<span class="lT">最晚完成时间：</span>
				<span>{{latestCompleteTimeL?timeFormat(latestCompleteTimeL):"暂无数据"}}</span>
			</div>
			<div>
				<span class="lT">任务描述：</span>
				<span>{{taskDes}}</span>
			</div>
		</div>
		<!--语音质检-->
		<div class="testimgWap" v-for="(item,index) in voiceList">
			<audio :src="item.voiceUrl" controls="controls" preload="auto" style="width: 600px;margin-bottom: 40px;"></audio>
			<!--滚动语音内容-->
			<div class="scrollText">
				<div v-for="itemchild in item.textVOList">
					<div class="timeDate">
					<span>{{itemchild.beginTime}}</span>
					<span>——</span>
					<span>{{itemchild.beginTime}}</span>
				</div>
				<div class="text">
					<span>{{itemchild.text}}</span>
					<span class="sex">{{itemchild.sex}}</span>
					<span class="info">{{itemchild.info}}</span>
				</div>
				</div>
			</div>
				<div class="rts">
					<div class="radios">
						<span class="Lw">质检：</span>
						<Radio-group v-model="radioModel[index]">
							<Radio label="100">合格</Radio>
							<Radio label="0">不合格</Radio>
						</Radio-group>
					</div>
					<div class="textareaRow">
						<span class="Lw top">不合格说明：</span>
						<textarea name="" rows="" cols="" class="textBox" placeholder="请输入" v-model="textModel[index]"></textarea>
					</div>
				</div>
		</div>
		<!--按钮组-->
		<div class="buttonList">
			<span class="smallBtn2" @click="entrueSubmit" :class="buttonsb">确定</span>
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
	export default {
		data() {
			return {
				loading:true,
				buttonsb:"noshowBlock",
				projecName:'项目名称',//项目名称
				profitList: [], //任务项
				latestCompleteTimeL: '', //最晚完成时间
				taskDes: '', //任务描述,
				textModel:[],//文本值
				radioModel:[],//单选
				voiceList:[]
			}
		},
		mounted() {
			this.taskDetail();
		},
		methods: {
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
				return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
			},
			goback() {
				this.$router.back(-1);
			},
			//任务详情
			taskDetail() {
				const instid = this.$route.query.instId;
				const batchid = this.$route.query.batchId;
				const projecttype = this.$route.query.proJectType;
				this.projecName = this.$route.query.projectName;//项目名称
				this.axios.post('appeal/appealVoiceAndTextList.do', {
					"batchId": batchid,
					"instId": instid,
					"proJectType":projecttype
				}).then((res) => {
					if(res.data.code == 0) {
						this.loading = false;
						this.latestCompleteTimeL = res.data.data.taskInfo.latestCompleteTime; //最晚完成时间
						this.taskDes = res.data.data.taskInfo.description; //任务描述
						this.imgList = res.data.data.pictureMarks;
						this.profitList = res.data.data.taskInfo.profit;
						this.voiceList = res.data.data.voiceTextVos;
						for(var i=0;i<res.data.data.voiceTextVos.length;i++){
							if (res.data.data.voiceTextVos[i].score!=undefined) {
								this.textModel.push(res.data.data.voiceTextVos[i].causeInfo);
								this.radioModel.push(res.data.data.voiceTextVos[i].score);
								this.buttonsb = "noshowBlock";
							}
							else{
								this.buttonsb = "";
							}
						}
					} else {
						this.$Message.error(res.data.msg);
					}

				})
			},
			//语音质检打分
			entrueSubmit(){
				//图片质检参数回传
				var tParam = [];
				const id = this.$route.query.instId;
				for(var i=0;i<this.voiceList.length;i++){
					if (this.radioModel[i]!=undefined) {
						tParam.push({
						jobId:this.voiceList[i].jobId,
						score:this.radioModel[i],
						pictureMarkId:this.voiceList[i].voiceId,
						causeinfo:this.textModel[i]
					})
					}
				}
				if (tParam.length!=this.voiceList.length){
					this.$Message.success('请全部打分');
					return;
				}
				this.axios.post('/appeal/addQuality.do',{
					"instId":id,
					"tParam":tParam
				}).then((res)=>{
					if(res.data.code==0){
						this.$Message.success('提交成功');
						this.buttonsb = "noshowBlock";
					}
					else{
						this.buttonsb = "";
						this.$Message.error(res.data.msg);
					}
					
				}).catch((err)=>{
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
.noshowBlock{
	visibility: hidden !important;
}
	#imgLableDetail {
		.messageDetail {
			padding: 20px 0;
			border-bottom: 1px solid #E9E9E9;
			border-top: 1px solid #E9E9E9;
			.smallTitle {
				font-size: 14px;
				font-weight: bolder;
				margin-bottom: 10px;
			}
			.row {
				margin-bottom: 20px;
			}
			.lT {
				color: #999;
				display: inline-block;
				min-width: 100px;
				text-align: right;
				margin-right: 1em;
			}
			.rT {
				margin-right: 5em;
			}
		}
		/*图片区域*/
		.testimgWap {
			padding: 20px 0;
			border-bottom: 1px solid #E9E9E9;
			.scrollText{
				min-height: 300px;
				overflow-y:auto;
				.timeDate{
					margin-bottom: 10px;
					span{
						color: #999;
					}
				}
				.text{
					margin-bottom: 10px;
					span{
						display: inline-block;
					}
					.sex{
						padding: 0 15px;
						text-align: center;
						height: 30px;
						line-height: 30px;
						border:1px solid #ccc;
						border-radius: 5px;
						margin-right: 10px;
					}
					.info{
						padding: 0 15px;
						border-radius: 5px;
						text-align: center;
						height: 30px;
						line-height: 30px;
						border:1px solid #ccc;
					}
					*{
						vertical-align: middle;
					}
				}
			}
			
			.lts {
				float: left;
				width: 280px;
				height: 280px;
				padding: 15px;
				border: 1px dashed #E9E9E9;
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: space-around;
				&:hover{
					box-shadow: 4px 4px 8px  rgba(0,0,0,0.5);
					transition: all 0.3s liner;
				}
			}
			.dashLineBox {
				width: 235px;
				height: 235px;
				cursor: pointer;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.rts {
				.radios {
					margin-top: 30px;
					margin-bottom: 10px;
				}
				.Lw {
					display: inline-block;
					min-width: 100px;
					/*text-align: right;*/
				}
				.textareaRow {
					margin-bottom: 2px;
					.textBox {
						height: 80px;
						width: 240px;
					}
					.top {
						vertical-align: top;
					}
				}
			}
		}
		.buttonList {
			margin-top: 20px;
			* {
				vertical-align: middle;
			}
			span {
				display: inline-block;
				text-align: center;
			}
			.smallBtn2 {
				margin-right: 20px;
			}
		}
	}
</style>