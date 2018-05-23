<template>
	<div id="report">
		<div class="h41" style="cursor: auto;">总览</div>
		<div class="box_Wap">
			<div class="title">用户实时分布情况</div>
			<div class="mapContainer">
				<!--<div class="coutryTitle">按省</div>-->
				<div class="floatOverflow">
					<!--省市地图-->
					<div id="countryMap" style="height: 440px;width: 500px;"></div>
					<!--右侧数据表格-->
					<div class="countryList" style="height: 440px;margin-right: 3px;">
						<div class="tableHead tableFlex">
							<div style="width: 30px;text-align: left;"></div>
							<div style="width: 80px;text-align: left;">地域分布</div>
							<div style="width: 60px;text-align: right;">启动次数</div>
							<div style="width: 120px;text-align: right;padding-right: 20px;">启动次数占比</div>
						</div>
						<div class="scroll">
							<div class="tableFlex tableList" v-for="(item,index) in mapData">
								<div style="width: 30px;text-align: center;">{{index+1}}</div>
								<div style="width: 80px;text-align: left;">{{item.name}}</div>
								<div style="width: 60px;text-align: right;">{{item.value}}</div>
								<div style="width: 120px;text-align: right;padding-right: 20px;">{{item.percent}}%</div>
							</div>
						</div>

					</div>
				</div>
			</div>

		</div>
		<!--当前人数类别占比-->
		<div class="box_Wap box_Wap_t">
			<div class="title">当前人数类别占比</div>
			<div class="mapContainer">
				<div id="ringCount" style="height: 340px;"></div>
			</div>
		</div>
		<!--各类目占比-->
		<div class="box_Wap box_Wap_t">
			<div class="title">各类目占比</div>
			<div class="mapContainer">
				<div id="allKindPercent" style="height: 340px;"></div>
			</div>
		</div>
		<div class="box_Wap box_Wap_t">
			<div class="title">注册用户</div>
			<div style="display: flex;flex-direction: row;justify-content: space-between;">
					<div class="left_wrap">
				<div class="left_wrap1">
					<p class="wrap_title1">累计注册人数</p>
					<p class="wrap_title2">{{allpeopleNumbers}}</p>
					
				</div>
				<div class="left_wrap1">
					<p class="wrap_title1">当天注册用户</p>
					<p class="wrap_title2">{{currentNumber}}</p>
				</div>
			</div>
			<div class="right_wrap">
				<div class="row">
					<span class="span1">
						历史注册用户数
					</span>
					<span class="span2">
						<span id="Date_picker">
			            	<Date-picker format="yyyy-MM-dd" type="daterange"
			            		placement="bottom-end" v-model="callTime" placeholder="选择日期"></Date-picker>
			            </span>
					<span class="buttonList">
							<span class="smallBtn3" @click="searchReport1">搜索</span>
					</span>

					</span>
				</div>
				<div id="myChart" style="width:100%;height:342px;"></div>
			</div>
			</div>
		</div>
		<div class="box_Wap box_Wap_t">
			<div class="title">活跃用户</div>
			<div style="display: flex;flex-direction: row;justify-content: space-between;">
					<div class="left_wrap">
				<div class="left_wrap1">
					<!--<p class="wrap_title1">累计活跃用户</p>-->
				</div>
				<div class="left_wrap1">
					<!--<p class="wrap_title1">本周上新活跃用户</p>-->
					
				</div>
			</div>
			<div class="right_wrap">
				<div class="row">
					<span class="span1">
						历史活跃用户数
					</span>
					<span class="span2">
						<span id="Date_picker">
			            	<Date-picker v-model="callTime2" format="yyyy-MM-dd"
			            		type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>
			            </span>
					<span class="buttonList">
							<span class="smallBtn3" @click="newsearchReport2">搜索</span>
					</span>

					</span>
				</div>
				<div id="myChart1" style="width:100%;height:342px;"></div>
			</div>
			</div>
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
	import echarts from 'echarts/lib/echarts';
	import 'echarts/lib/chart/pie';
	import 'echarts/map/js/china.js';
	import Tool from "../../getData/tool"
	export default {
		name: 'chart',
		data() {
			return {
				loading: true,
				value1: ['2016-01-01', '2016-02-15'],
				value2: ['2016-01-01', '2016-02-15'],
				value3: ['2016-01-01', '2016-02-15'],
				callTime: '',
				callTime2: '',
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				username: '',
				usernumber: '',
				dateValue: '',
				mapData: [],
				//用户占比数据
				userData: [],
				userData2: [],
				allProjectKind: [],
				allProjectKind1: [],
				//用户总数
				userTotal:0,
				//注册用户
				reportformlist1: [],
				reportformlist12: [],
				allpeopleNumbers:0,//累计注册人数
				currentNumber:0,
				//活跃用户
				activeUsersX:[],
				activeUsersY:[]
			}
		},
		mounted() {
			//省市分布API
			this.provinceApi();
		},
		watch: {
			callTime(v) {
				console.log(Date.parse(v[0]), "1");
				console.log(Date.parse(v[1]), "2");
			},
			callTime2(v) {
				console.log(Date.parse(v[0]), "1");
				console.log(Date.parse(v[1]), "2");
			},
			dateValue(v) {
				console.log(Date.parse(v[0]), "1");
				console.log(Date.parse(v[1]), "2");
			}
		},
		methods: {
			//省市分布接口
			provinceApi() {
				this.axios.post('/report/activityByRegion.do', {

				}).then((res) => {
					if(res.data.code == '0') {
						this.loading = false;
						this.mapData = res.data.data.value;
						this.provinceDis();
						//当前个用户占比API
						this.nowPeoPercentApi();
					} else {
						this.$Message.error(res.data.msg)
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			
			
			//省市分布
			provinceDis() {
				var provinceChart = echarts.init(document.getElementById('countryMap'));

				var option = {
					tooltip: {
						trigger: 'item',
						formatter: function(params) {
							//console.log(params);
							var result = params.name;
							result += '<br/>';
							result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params.color + '"></span>';
							result += params.seriesName + "&nbsp;&nbsp;" + params.value + "&nbsp;&nbsp;&nbsp;&nbsp;" + params.data.percent + "%";
							return result;
						}
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: ['iphone3', 'iphone4', 'iphone5']
					},
					//左下角虚拟地图指示
					visualMap: {
						orient: 'horizontal',
						min: 0,
						max: 2500,
						left: 'left',
						top: 'bottom',
						min: 800,
						max: 50000,
						inRange: {
							color: ['lightskyblue', 'yellow', 'orangered']
						},
						text: ['高', '低'], // 文本，默认为数值文本
						calculable: false,
						show: true
					},
					//右上角地图导出
					toolbox: {
						show: false,
						orient: 'vertical',
						left: 'right',
						top: 'center',
						feature: {
							dataView: {
								readOnly: false
							},
							restore: {},
							saveAsImage: {}
						}
					},
					series: [{
							name: '启动次数',
							type: 'map',
							left: 'left',
							width: 440,
							mapType: 'china',
							roam: true,
							showLegendSymbol: false, //去除指示点
							label: {
								normal: {
									show: false, //是否显示地图名字
									textStyle: {
										color: "#fff"
									} //省份标签字体颜色
								},
								emphasis: {
									show: true,
									textStyle: {
										color: "#fff"
									}
								}
							},
							itemStyle: {
								normal: {
									borderWidth: .5, //区域边框宽度
									borderColor: '#fff', //区域边框颜色
									areaColor: "#fff", //区域颜色
								},
								emphasis: {
									borderWidth: .5,
									borderColor: '#fff',
									areaColor: "orangered",
								}
							},
							data: this.mapData
						}

					]
				}
				provinceChart.setOption(option);
				provinceChart.on('mouseover', function(params) {

				});
			},
			//当前各用户人类数占比
			nowPeoPercentApi() {
				this.axios.post('/report/activityByClient.do', {

				}).then((res) => {
					if(res.data.code == '0') {
						this.userData = res.data.data.value;
						for(var i=0;i<this.userData.length;i++){
							var obj ={
								value:this.userData[i].value,
								name:''
							}
							this.userTotal+= this.userData[i].value
							this.userData2.push(obj)
						}
						this.ringCounts();
						//各类目占比API
			this.allKindPercentApi();
					} else {
						this.$Message.error(res.data.msg)
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			//人类占比环状统计
			ringCounts() {
				var ringCountChart = echarts.init(document.getElementById('ringCount'));
				// 总和
				var total = {
					value: this.userTotal,
					name: '用户总数'
				}
				var option = {
					backgroundColor: '#fff',
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)",

					},
					title: [{
						text: total.name,
						left: '49%',
						top: '44%',
						textAlign: 'center',
						textBaseline: 'middle',
						textStyle: {
							color: '#999',
							fontWeight: 'normal',
							fontSize: 18
						}
					}, {
						text: total.value,
						left: '49%',
						top: '53%',
						textAlign: 'center',
						textBaseline: 'middle',
						textStyle: {
							color: '#666',
							fontWeight: 'normal',
							fontSize: 30
						}
					}],
					legend: {
						orient: 'vertical',
						x: 'left',
						itemWidth: 40,
						itemHeight: 14,
						align: 'left',

						data: this.userData,
						textStyle: {
							color: '#333'
						}
					},
					series: [{
							name: '当前人数类别占比',
							type: 'pie',
							hoverAnimation: false,
							legendHoverLink: false,
							radius: ['40%', '42%'],
							color: ['#915872', '#3077b7', '#9a8169', '#3f8797', '#5b8144', '#307889', '#9c6a79'],
							label: {
								normal: {
									position: 'inner'
								}
							},
							labelLine: {
								normal: {
									show: false
								},

							},
							tooltip: {
								show: false,

							},

							data: this.userData2
						},
						{
							name: '当前人数类别占比',
							type: 'pie',
							radius: ['42%', '55%'],
							color: ['#d74e67', '#0092ff', '#eba954', '#21b6b9', '#60a900', '#01949b', ' #f17677'],
							label: {
								normal: {
									formatter: '{b}\n{d}%'
								},

							},
							data: this.userData
						}
					]
				};
				ringCountChart.setOption(option);

			},
			//各类目占比API
			allKindPercentApi() {
				this.axios.post('/report/projectClassification.do', {

				}).then((res) => {
					if(res.data.code == '0') {
						this.allProjectKind = res.data.data.value;
						for(var i=0;i<this.allProjectKind.length;i++){
							var obj ={
								value:this.allProjectKind[i].value,
								name:''
							}
							this.allProjectKind1.push(obj)
						}
						this.allKindPercents();
						//注册用户API
			this.searchReport1();
					} else {
						this.$Message.error(res.data.msg)
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			//各类目占比
			allKindPercents() {
				var allKindPercentChart = echarts.init(document.getElementById('allKindPercent'));
				var option = {
					backgroundColor: '#fff',
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)",

					},
					legend: {
						orient: 'vertical',
						x: 'left',
						itemWidth: 40,
						itemHeight: 14,
						align: 'left',

						data: this.allProjectKind,
						textStyle: {
							color: '#333'
						}
					},
					series: [{
							name: '各类目占比',
							type: 'pie',
							hoverAnimation: false,
							legendHoverLink: false,
							radius: ['40%', '42%'],
							color: ['#915872', '#3077b7', '#3f8797', '#5b8144', '#9a8169', '#307889', '#9c6a79'],
							label: {
								normal: {
									position: 'inner'
								}
							},
							labelLine: {
								normal: {
									show: false
								},

							},
							tooltip: {
								show: false,

							},

							data: this.allProjectKind1
						},
						{
							name: '各类目占比',
							type: 'pie',
							radius: ['42%', '55%'],
							color: ['#d74e67', '#eba954', '#21b6b9', '#60a900', '#0092ff', '#01949b', ' #f17677'],
							label: {
								normal: {
									formatter: '{b}\n{d}%'
								},

							},
							data: this.allProjectKind
						}
					]
				};
				allKindPercentChart.setOption(option, true);
			},
			
			//注册用户API
			searchReport1() {
				var that = this;
				this.axios.post('/report/countRegister.do', {
										"startTime": Date.parse(that.callTime[0]), //类型：String  必有字段  备注：
										"endTime": Date.parse(that.callTime[1]), //类型：String  必有字段  备注：
				}).then((res) => {
					if(res.data.code == '0') {
						this.reportformlist1 = [];
						this.reportformlist12 = [];
						let arr = res.data.data.history;
						this.allpeopleNumbers = res.data.data.total;
						this.currentNumber = res.data.data.today;
						for(var i = 0; i < arr.length; i++) {
							this.reportformlist1.push(arr[i].value);
							this.reportformlist12.push(arr[i].name);
						}
						this.reportEchart1();
						//活跃用户API
			this.newsearchReport2();
					} else {
						this.$Message.error(res.data.msg);
					}

				}).catch(function(err) {
					console.log(err);
				})
			},

			//注册用户图表
			reportEchart1() {
				let myChart = echarts.init(document.getElementById('myChart'));
				myChart.setOption({
					backgroundColor: '#fff',
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#ddd'
							}
						},
						backgroundColor: 'rgba(255,255,255,1)',
						padding: [5, 10],
						textStyle: {
							color: '#666689',
						},
						extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: '#EBEBEB'
							}
						},
						axisLabel: {
							margin: 10,
							textStyle: {
								color: '#666689'
							}
						},
						data: this.reportformlist12
					}],
					yAxis: [{
						type: 'value',
						name: '',
						axisTick: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#EBEBEB'
							}
						},
						axisLabel: {
							margin: 10,
							textStyle: {
								color: '#666689'
							}
						},
						splitLine: {
							lineStyle: {
								color: '#fff'
							}
						}
					}],
					series: [{
						name: '注册用户数',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 5,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 2,
								color: '#66CC00'
							}
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: 'rgba(224,245,204,1)'
								}, {
									offset: 1,
									color: 'rgba(224,245,204,1)'
								}], false)
							},
						},
						itemStyle: {
							normal: {
								color: 'rgb(73,169,238)',
								borderColor: 'rgba(73,169,238,0.2)',
								borderWidth: 12
							}
						},
						data: this.reportformlist1
					}, ]
				});

			},

			//活跃用户API
			newsearchReport2() {
				var that = this;
				this.axios.post('/report/activityHistory.do', {
					"startTime": Date.parse(that.callTime2[0]), //类型：String  必有字段  备注：
					"endTime": Date.parse(that.callTime2[1]), //类型：String  必有字段  备注：
				}).then((res) => {
					if(res.data.code=='0'){
						if(res.data.code=='0'){
							this.activeUsersX=[];
							this.activeUsersY=[];
							let arr = res.data.data.value;
						for(var i = 0; i < arr.length; i++) {
							this.activeUsersX.push(arr[i].name);
							this.activeUsersY.push(arr[i].value);
						}
							this.reportEchart2();
						}
					}else{
						this.$Message.error(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err);
				})
			},

			//活跃用户数图表
			reportEchart2() {
					let myChart1 = echarts.init(document.getElementById('myChart1'));
					myChart1.setOption({
						backgroundColor: '#fff',
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								lineStyle: {
									color: '#ddd'
								}
							},
							backgroundColor: 'rgba(255,255,255,1)',
							padding: [5, 10],
							textStyle: {
								color: '#666689',
							},
							extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: [{
							type: 'category',
							boundaryGap: false,
							axisLine: {
								lineStyle: {
									color: '#EBEBEB'
								}
							},
							axisLabel: {
								margin: 10,
								textStyle: {
									color: '#666689'
								}
							},
							data: this.activeUsersX
						}],
						yAxis: [{
							type: 'value',
							name: '',
							axisTick: {
								show: false
							},
							axisLine: {
								lineStyle: {
									color: '#EBEBEB'
								}
							},
							axisLabel: {
								margin: 10,
								textStyle: {
									color: '#666689'
								}
							},
							splitLine: {
								lineStyle: {
									color: '#fff'
								}
							}
						}],
						series: [{
							name: '活跃用户数',
							type: 'line',
							smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: false,
							lineStyle: {
								normal: {
									width: 2,
									color: '#49A9EE'
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(219,238,252,1)'
									}, {
										offset: 1,
										color: 'rgba(219,238,252,1)'
									}], false)
								},
							},
							itemStyle: {
								normal: {
									color: 'rgb(73,169,238)',
									borderColor: 'rgba(73,169,238,0.2)',
									borderWidth: 12
								}
							},
							data: this.activeUsersY
						}, ]
					});
			}
			

		}
	}
</script>

<style lang="scss" scoped="scoped">
	#report {
		.h42 {
			color: #108DE9;
		}
		.box_Wap_t {
			margin-top: 40px;
		}
		input {
			height: 27px;
			width: 230px;
		}
		.warp_table {
			padding: 20px;
			.row {
				margin-bottom: 25px;
				position: relative;
				
				.span1 {
					width: 310px;
					margin-right: 40px;
					display: inline-block;
				}
				.span2 {
					margin-right: 10px;
				}
				.buttonList {
					span {
						vertical-align: middle;
						text-align: center;
						display: inline-block;
					}
					.smallBtn2 {
						margin-right: 0px;
					}
					.smallBtnDefalt {
						margin: 0 10px;
					}
				}
			}
		}
		.box_Wap {
			overflow: hidden;
			color: #666;
			border: 1px solid #e7e9f0;
			border-radius: 3px;
			width: 100%;
			.title {
				height: 50px;
				line-height: 50px;
				padding-left: 25px;
				border-bottom: 1px solid #e7e9f0;
				color: #666;
				font-weight: bold;
			}
			.mapContainer {
				padding: 25px;
				.coutryTitle {
					font-size: 14px;
					font-weight: bold;
					color: #5688DE;
					border-bottom: 1px solid #e7e9f0;
					padding-bottom: 10px;
				}
				.floatOverflow {
					overflow: hidden;
					#countryMap {
						float: left;
					}
					.countryList {
						float: right;
						border: 1px solid #e7e9f0;
					}
					.tableHead {
						font-size: 12px;
						height: 34px;
						line-height: 34px;
						background: #fafafb;
					}
					.tableFlex {
						display: flex;
						flex-direction: row;
					}
					.tableList {
						color: #808492;
						height: 40px;
						line-height: 40px;
						border-bottom: 1px solid #e7e9f0;
						&:hover {
							background: #F4F6F9;
						}
					}
					.scroll {
						height: 404px;
						overflow: auto;
					}
				}
			}
			.left_wrap {
				float: left;
				width: 124px;
				border-right: 1px solid #e7e9f0;
				min-height: 450px;
				.left_wrap1 {
					margin-top: 40px;
					.wrap_title1 {
						font-size: 12px;
						color: #4d4d4d;
						text-align: center;
					}
					.wrap_title2 {
						font-size: 34px;
						color: #4d4d4d;
						text-align: center;
					}
					
				}
			}
			.right_wrap {
				color: #666;
				float: left;
				width: 86%;
				margin-left: 1em;
				.row {
					width: 100%;
					margin: 20px 0;
					position: relative;
					padding-left: 45%;
					/*overflow: hidden;*/
					height: 30px;
					.span1 {
						color: #666;
						font-weight: bold;
						margin-right: 20px;
						margin-top: 6px;
					}
					.span2 {
						margin-right: 10px;
						float: right;
						#Date_picker .ivu-select-dropdown {
							left: 237px !important;
						}
						.buttonList {
							span {
								vertical-align: middle;
								text-align: center;
								display: inline-block;
							}
							.smallBtn3 {
								margin: 0 10px;
								cursor: pointer;
								background: #66CC00;
								width: 60px;
								line-height: 27px;
								height: 27px;
								border-radius: 5px;
								font-size: 14px;
								color: #fff;
							}
						}
					}
				}
			}
		}
	}
</style>