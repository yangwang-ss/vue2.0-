<template>
	<div class="container">
		<div class="clearboth">
			<div class="left">
			<div class="inputRow">
				<span>项目名称：</span>
				<span>{{projectName}}</span>
			</div>
			<div class="inputRow">
				<span>项目类型：</span>
				<span>{{projectKind}}</span>
			</div>
			<!--<div class="inputRow">
				<span>指定用户：</span>
				<span v-for="item in userModel">{{item?item:'暂无数据'}}、</span>
			</div>-->
			<div class="inputRow">
				<span>工单模板：</span>
				<span>{{workOrder?workOrder:'暂无数据'}}</span>
			</div>
			<div class="inputRow">
				<span>结算模板：</span>
				<span>{{computed?computed:'暂无数据'}}</span>
			</div>
			<div class="inputRow">
				<span>质检模板：</span>
				<span>{{qualityTest?qualityTest:'暂无数据'}}</span>
			</div>
			<div class="inputRow">
				<span>培训模板：</span>
				<span>{{train?train:'暂无数据'}}</span>
			</div>
			<div class="inputRow">
				<span>工作时间：</span>
				<span>{{timeArr[0]?timeArr[0]:'暂无数据'}}</span>
				<span> - </span>
				<span>{{timeArr[1]?timeArr[1]:'暂无数据'}}</span>
			</div>
			<div class="inputRow">
				<span>项目标签：</span>
				<span v-for="item in hotArr">{{item?convert(item):'暂无数据'}}、</span>
			</div>
			<!--<div class="inputRow" id="addTime">
				<Time-picker :value="timeValue2" format="HH:mm:ss" type="timerange" placement="bottom-end"  style="width: 168px" disabled="disabled"></Time-picker>
			</div>-->
		</div>
		<div class="right">
			
			<div class="projectSeting2 title">项目说明</div>
			<div class="textareaRow textErea ">
				<span class="textAligin">项目说明：</span>
				<span style="white-space: pre-line;padding-right: 10px;">{{taskDis?taskDis:'暂无数据'}}</span>
			</div>
			<!--<div class="textareaRow">
				<span class="textAligin">班务说明：</span>
				<span ref="classDis"></span>
			</div>
			<div class="textareaRow">
				<span class="textAligin">资质说明：</span>
				<span ref="aptitude"></span>
			</div>-->
			<div class="projectSeting2 title">接单要求</div>
			<div class="inputRow">
				<span>客服星级：</span>
				<span>{{serviceStar?serviceStar:'暂无数据'}}</span>
			</div>
			<div class="projectSeting2 title">项目可见度</div>
			<div class="inputRow">
				<span>项目可见度：</span>
				<span>{{isShowOrHidden?isShowOrHidden:'暂无数据'}}</span>
			</div>
			<div class="projectSeting2 title">指定用户</div>
			<div class="textareaRow" v-for="(item,index) in userModel" v-if="userModel.length>0">
				<span>用户{{index+1}}:</span><span>{{item}}</span>
			</div>
			<div class="textareaRow" v-else>
				<span>用户{{index+1}}:</span><span>{{item}}</span>
			</div>
			<!--<div v-for="item in userModel">{{item}}</div>-->
		</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				projectName:'',//项目名称
				projectKind:'',//项目类型
				workOrder:'',//工单模板
				computed:'',//结算模板
				qualityTest:'',//质检模板
				train:'',//培训模板
				showForm: false,
				timeArr:[],
				hotArr:[],
				taskDis:'',//项目说明
				serviceStar:'',//客服星级,
				userModel:[],//指定用户，
				isShowOrHidden:''
			}
		},
		mounted(){
			this.projectMess();
		},
		methods:{
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
			//项目信息接口
			projectMess(){
				var that = this;
				const projectId = this.$route.query.projectId;
				this.axios.post('/task/findProjectInfo.do', {
					"projectId": projectId
				}).then((res) => {
					this.projectName = res.data.data.name;//项目名称
					this.projectKind = res.data.data.typeDicValue;//项目类型
					//判断后台是否返回该字段
					if(res.data.data.workOrder == null || res.data.data.workOrder == undefined) {
						console.log("ss");
					} else {
						this.workOrder = res.data.data.workOrder.workOrderName;//工单模板
					}
					if(res.data.data.account== null || res.data.data.account == undefined) {
						console.log("aa");
					} else {
						this.computed = res.data.data.account.accountName;//结算模板
					}
					if(res.data.data.machineQuality == null || res.data.data.machineQuality == undefined) {
						console.log("dd");
					} else {
						this.qualityTest = res.data.data.machineQuality.machineQualityName;//质检模板
					}
					
					this.timeArr =this.timeConvert(res.data.data.projectWorktimes);//工作时间
					var requireObj = res.data.data.requires;
					//指定用户
					var userArr = [];
					for(var i = 0; i < requireObj.length; i++) {
						if(requireObj[i].type == "projectTrain") {
							this.train = requireObj[i].name;//培训模板
						} else if(requireObj[i].type == "lvl") {
							this.serviceStar = requireObj[i].value;
						}else if(requireObj[i].type == "appointUser") {
							var companyId = requireObj[i].requireName;
							userArr.push(companyId);
							this.userModel = userArr;
						}
					}
					this.taskDis = res.data.data.description;//任务描述
//					this.$refs.classDis.innerText = res.data.data.classes;//班务说明
//					this.$refs.aptitude.innerText = res.data.data.qualification;//资质说明
					this.hotArr = res.data.data.tags;//热门项目
					this.isShowOrHidden = res.data.data.projectLevelDicValue;
				}).catch(function(err) {})
			},
			convert(e){
				if (e==1) {
					return '热门'
				}else if(e==2){
					return '着急出手'
				}else if(e==3){
					return '赚钱多'
				}else if(e==4){
					return '轻松搞定'
				}
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
.textErea{
	max-height: 200px;
	overflow: auto;
}
	.container {
		margin-top: 25px;
		.clearboth{
			overflow: hidden;
		}
		.inputRow {
			width: 300px;
			margin-left: 130px;
			margin-bottom: 10px;
			.textInput {
				width: 230px;
				height: 27px;
			}
			* {
				vertical-align: middle;
			}
			.timeSpace{
				margin-right: 10px;
			}
			
		}
		.left {
			float: left;
			#addTime {
				padding-left: 63px;
			}
		}
		.right {
			float: right;
			.projectSeting {
				height: 55px;
				line-height: 55px;
				padding-left: 45px;
				margin-bottom: 5px;
			}
			.projectSeting2 {
				padding-left: 45px;
			}
			.textareaRow {
				width: 300px;
				margin-left: 130px;
				margin-bottom: 20px;
				.textAligin {
					display: inline-block;
				}
			}
		}
		.bottom{
			height: 88px;
			line-height: 88px;
			text-align: center;
		}
	}
</style>