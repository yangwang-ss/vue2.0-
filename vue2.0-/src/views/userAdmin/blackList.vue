<template>
	<div id="marketing">
		<h4 class="h41" style="cursor: auto;">黑名单</h4>
		<div class="row">
			<span class="span1">
				<label for="input1">用户账号：</label><input class="inputText" v-model="blacknumber" type="text" name="" id="input1" value="" placeholder="请输入"/>
			</span>
			<span id="Date-picker" class="span1">
            	黑名单时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateValue"></Date-picker>
            </span>
			<span class="buttonList">
			<span class="smallBtn2" @click="search">搜索</span>
			<span class="smallBtnDefalt" @click="reset">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">用户编号</td>
				<td class="colmn2">用户名称</td>
				<td class="colmn3">用户类型</td>
				<td class="colmn4">用户账号</td>
				<td class="colmn5">注册时间</td>
				<td class="colmn6">操作</td>
			</tr>
			<tr v-for="(item,$index) in tableList">
				<td>{{item.id}}</td>
				<td>{{item.name}}</td>
				<td v-if="item.type=='person'">个人</td>
				<td v-if="item.type=='company'">企业</td>
				<td>{{item.phoneNum}}</td>
				<td>{{computationsCallTime(item.createTime)}}</td>
				<td class="check-more">
					<span class="rightMore" @click="moreServices(item.id,item.type,item.name)">查看</span>
					<span class="checkLinks" @click="removeBlack(item.id,item.type)">移出黑名单</span>
				</td>
			</tr>

		</table>
		<!--分页插件-->
		<div id="page">
			<Page :total="result.totalCount" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
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
  import Tool from "../../getData/tool"
	export default {
		data() {
			return {
				loading:true,
				showDrop: false,
				blacknumber: '',
				dateValue:'',
				pageSize: 10,
				page: 1,
				totalpageSize: 0,
				result: {},
				tableList: [],
				value2: ['2016-01-01', '2016-02-15'],
				projectState: [{
						value: 'beijing',
						label: '北京市'
					},
					{
						value: 'shanghai',
						label: '上海市'
					},
					{
						value: 'shenzhen',
						label: '深圳市'
					},
					{
						value: 'hangzhou',
						label: '杭州市'
					},
					{
						value: 'nanjing',
						label: '南京市'
					},
					{
						value: 'chongqing',
						label: '重庆市'
					}
				],
			}
		},
		mounted() {
			this.search();
		},

	    watch: {
	      dateValue(v){
	        console.log(Date.parse(v[0]), "1");
	        console.log(Date.parse(v[1]), "2");
	      }
	    },
		methods: {
			//项目搜索
			search() {
				var that = this;
				this.axios.post('/mgr/findBlacklist.do', {
					"pageNum": that.page,
					"pageSize": that.pageSize,
					"phoneNum": that.blacknumber,
					"startBlackDate": Date.parse(that.dateValue[0]),
            		"endBlackDate": Date.parse(that.dateValue[1])
				}).then((res) => {
					if(res.data.code=='0'){
						this.loading = false;
					this.tableList = res.data.data.list;
					this.result = res.data.data;
              		this.result.totalCount = res.data.data.total;
					}else{
						this.$Message.error(res.data.msg)
					}
					
				}).catch(function(err) {
					console.log(err);
				})
			},
			changePage(page) {
				this.page = page;
				this.search();
			},
			changepagesize(pagesize) {
				this.pageSize = pagesize;
				this.search();
			},
		    computationsCallTime(date){
		        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
		    },
			//重置
			reset() {
				var that = this;
				that.dateValue = '';
				that.blacknumber = '';
			},
			//查看
			moreServices(id,type) {
				if(type === "person") {
			        this.$router.push({
			          path: '/' + 'service_info',
			          query: {
			            id: id,
			            name:name
//			            pages:this.page,
//			            pagesizes:this.pageSize
			          }
			        })
				} else if(type === "company") {
			        this.$router.push({
			          path: '/' + 'enter_info',
			          query: {
			            id: id,
			            name:name
			          }
			        })
				}
			},
			//移出黑名单
			removeBlack(id,type) {
                this.$Modal.confirm({
//                  title: '确认对话框标题',
                    content: '<p>您是否要将该账号移出黑名单列表？</p><p><span style="color:red;">随意移出黑名单将受到调查</span>，你还要继续吗？</p>',
                    onOk: () => {
                    	this.conList(id,type)
                        //this.$Message.info('点击了确定');
                    },
                    onCancel: () => {
                        //this.$Message.info('点击了取消');
                    }
                });
			},
			//确认操作
			conList(id,type) {
				var that = this;
				this.axios.post('/mgr/removeBlacklist.do', {
					"id":id,
					"type":type
				}).then((res) => {
					console.log(res);
					this.search();
					let ss = res.data.msg;
					this.$Message.success(ss);
				}).catch(function(err) {
					let ss = err.data.msg;
					this.error(ss);
				})
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#marketing {
		.row {
			margin-bottom: 25px;
			position: relative;
			.span1 {
				width: 300px;
				margin-right: 40px;
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
					margin-right: 10px;
				}
			}
		}
		#tableForm {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #E9E9E9;
			.trHeader {
				td {
					background: #F4F4F4;
				}
			}
			tr,
			td {
				border: 1px solid #E9E9E9 !important;
				padding: 0 1em;
				height: 40px;
			}
			.colmn1 {
				width: 16%;
			}
			.colmn2 {
				width: 20%;
			}
			.colmn3 {
				width: 16%;
			}
			.colmn4 {
				width: 16%;
			}
			.colmn5 {
				width: 16%;
			}
			.colmn6 {
				width: 16%;
			}
			.check-more {
				text-align: left;
				position: relative;
				* {
					vertical-align: middle;
				}

				span {
					color: #108EE9;
					display: inline-block;
					cursor: pointer;
				}
				.rightMore {
					width: 45px;
				}
				.checkLinks {
				    padding: 0 5px;
				    position: relative;
				}
				.checkLinks:before {
				    content: "";
				    display: block;
				    width: 1px;
				    height: 15px;
				    left: -4px;
				    top: 13px;
				    position: absolute;
				    background: #E9E9E9;
				}
			}
		}

	}

</style>
