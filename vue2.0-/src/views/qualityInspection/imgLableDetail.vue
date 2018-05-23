<template>
	<div id="imgLableDetail">
		<div class="titleWap">
			<h4 class="h42" @click="goback">图片标注人工质检/</h4>
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
				<span>{{latestCompleteTimeL?timeFormat(latestCompleteTimeL):'暂无数据'}}</span>
			</div>
			<div>
				<span class="lT">任务描述：</span>
				<span>{{taskDes}}</span>
			</div>
		</div>
		<!--图片质检-->
		<div class="testimgWap">
			<div class="clearFix" v-for="(item,index) in imgList">
				<div class="lts">
					<div class="dashLineBox">
						<img :src="[item.src+'@w_235']" class="preview-img" height="100" @click="$preview.open(index, imgList)" title="点击放大查看" alt="暂无图片显示"/>
					</div>
				</div>
				<div class="rts">
					<div class="radios">
						<span class="Lw">质检：</span>
						<Radio-group v-model="radioArr[index]">
							<Radio label="100">合格</Radio>
							<Radio label="0">不合格</Radio>
						</Radio-group>
					</div>
					<div class="textareaRow">
						<span class="Lw top">不合格说明：</span>
						<textarea name="" rows="" cols="" class="textBox" placeholder="请输入" v-model="textArr[index]"></textarea>
					</div>
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
				projecName: '',
				profitList: [], //任务项
				latestCompleteTimeL: '', //最晚完成时间
				taskDes: '', //任务描述,
				imgList: [], //图片数组
				textArr: [], //文本输入
				radioArr: [], //单选数组
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
				 this.projecName= this.$route.query.projectName;
				this.axios.post('appeal/findPhotoAppeaDetail.do', {
					"batchId": batchid,
					"instId": instid
				}).then((res) => {
					if(res.data.code == 0) {
						this.loading = false;
						this.projecName = res.data.data.taskInfo.batchName; //项目名称
						this.latestCompleteTimeL = res.data.data.taskInfo.latestCompleteTime; //最晚完成时间
						this.taskDes = res.data.data.taskInfo.description; //任务描述
						this.imgList = res.data.data.pictureMarks; //图片数组
						for(var i=0;i<res.data.data.pictureMarks.length;i++){
							if (res.data.data.pictureMarks[i].score!=undefined) {
								this.radioArr.push(res.data.data.pictureMarks[i].score);
								this.textArr.push(res.data.data.pictureMarks[i].causeInfo);
								this.buttonsb = "noshowBlock";
							}
							else{
								this.buttonsb = "";
							}
						}
						this.profitList = res.data.data.taskInfo.profit;

					} else {
						this.$Message.error(res.data.msg);
					}

				})
			},
			//图片质检打分
			entrueSubmit(){
				
				//图片质检参数回传
				var tParam = [];
				const id = this.$route.query.instId;
				for(var i=0;i<this.imgList.length;i++){
					if (this.radioArr[i]!=undefined) {
						tParam.push({
						jobId:this.imgList[i].jobId,
						score:this.radioArr[i],
						pictureMarkId:this.imgList[i].id,
						causeinfo:this.textArr[i]
					});
					}
				}
				if (tParam.length!=this.imgList.length){
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
			.clearFix {
				overflow: hidden;
				margin-bottom: 10px;
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
				&:hover {
					box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
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
					position: relative;
				}
				img:after {
					content:"";
					display: block;
					position: absolute;
					z-index: 2;
					top: 0;
					left: 0;
					width: 235px;
					height: 235px;
					background: url(../../../static/img/avatar.png);
					background-size: 100% 100%;
				}
			}
			.rts {
				float: left;
				margin-left: 4em;
				.radios {
					margin-top: 30px;
					margin-bottom: 10px;
				}
				.Lw {
					display: inline-block;
					min-width: 100px;
					text-align: right;
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