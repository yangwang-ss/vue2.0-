<template>
	<div id="voiceTest">
		<h4 class="h42">工单模板配置</h4>
		<div class="row">
			<span class="span1"><label for="input1">项目名称：</label><input type="text" name="" id="input1" value="" placeholder="请输入" v-model="projectName"/></span>
			<span id="Date-picker">
            	创建时间：<Date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" v-model="dateTime"></Date-picker>
            </span>
		</div>
		<div class="row row2">
			<span class="span1 spanWidth">模板状态：<Select v-model="model1" clearable>
               <Option v-for="item in templateState" :value="item.value" :key="item.value">{{ item.label }}</Option>
           </Select>
		</span>
			<span class="buttonList">
				<span class="smallBtn1"  style="width: 100px;margin-right: 10px;margin-left: 35px;" @click="jumpxform">新建设计规则</span>
			<!--<span class="smallBtn1" @click="showNewTemplet">新建</span>-->
			<span class="smallBtn2" @click="getlist">搜索</span>
			<span class="smallBtnDefalt" @click="resetData">重置</span>
			</span>
		</div>
		<table border="" cellspacing="0" cellpadding="0" id="tableForm">
			<tr class="trHeader">
				<td class="colmn1">模板名称</td>
				<td class="colmn2">表单名称</td>
				<td class="colmn3">更新时间</td>
				<td class="colmn4">模板状态</td>
			</tr>
      <tr v-for="(item,$index) in dataList.data">
        <td>{{item.formTitle}}</td>
        <td>{{item.dataTableName}}</td>
        <td>{{item.formatCreatetime}}</td>
        <td>{{(item.state==1?"未发布":"已发布")}}</td>
      </tr>
		</table>
		<!--分页插件-->
		<!--分页插件-->
		<div id="page">
      <Page :total="dataList.count" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changepagesize"></Page>
		</div>
		<!--新建工单模板-->
		<bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
			<new-workorder ref="showTemplate" @cancel="cancel()"></new-workorder>
		</bounces>
		<!--编辑工单模板-->
		<bounces v-show="revisebouncesHide" @emitClickPopup="popupShutDown()">
			<revise-workorder @cancel="cancel()"></revise-workorder>
		</bounces>
	</div>
</template>

<script>
	import newWorkorder from '@/components/newWorkOrder'
	import reviseWorkorder from '@/components/reviseWorkorder'
	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				bouncesHide: false,
				revisebouncesHide:false,
				projectName:'',
				dateTime: [],
        pageSize:'10',
        page:'1',
        xformToken:'',
				model1: '',
        XformbaseUrl:'http://106.12.21.251:9022',
				value2: [],
        dataList:'',
				templateState: [
          {
            value: '',
            label: '--请选择--'
          },{
						value: '1',
						label: '未发布'
					},
					{
						value: '3',
						label: '已发布'
					}
				]
			}
		},
		methods: {
			//重置
			resetData(){
				this.projectName = '',
				this.dateTime = '',
				this.model = '';
			},
      changePage(page) {
        this.page = page;
        this.getlist();
      },
      changepagesize(pagesize) {
        this.pageSize = pagesize;
        this.getlist();
      },
			//新建点击事件
			showNewTemplet() {
				this.bouncesHide = true;
			},
      jumpxform(){
        this.$router.push('/formMgt');
      },
			//编辑工单
			editWorkOrder(){
				this.revisebouncesHide = true;
			},
			cancel(){
				this.bouncesHide = false;
				this.revisebouncesHide = false;
			},
			//点击空白处
			popupShutDown() {
				this.revisebouncesHide = false;
				this.bouncesHide = false;
			},
//      getDatetime(date){
//        var stringTime = date;
//        var timestamp2 = Date.parse(new Date(stringTime));
//        timestamp2 = timestamp2 / 1000;
//        return timestamp2;
//      },
      authent(){
        var that = this;
        this.axios.post('/xform/login.do', {
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
              that.xformToken=comList.data.value;
              console.log(that.xformToken);
              that.getlist();
            }
          }).catch(function (err) {

        })
      },
      getlist(){
        var that = this;
        this.axios.get(that.XformbaseUrl+'/manage/list?&states='+that.model1+'&siteCode=&classifyId=&formCodePrefix=&pageSize='+that.pageSize+'&currentPage='+that.page+'&formTitle='+that.projectName+'&createTimeStart='+Date.parse(that.dateTime[0])+'&createTimeEnd='+Date.parse(that.dateTime[1]), {
          headers: {
            "xformToken":this.xformToken
          },
        })
          .then(function (res, req) {
            let comList = res.data;
            console.log(comList);
            that.dataList=comList;
          }).catch(function (err) {

        })
      }
			//查看
			//			checkDetail() {
			//				this.$router.push('/' + 'designRule');
			//			},
			//更多操作

		},
    mounted: function () {
      this.authent();
      window.setInterval(function() {
        this.authent();
      }, 600000);
    },
		components: {
			newWorkorder,
			reviseWorkorder,
			bounces
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#voiceTest {
		input {
			height: 27px;
			width: 230px;
		}
		.row {
			margin-bottom: 25px;
			position: relative;
			.span2 {
				display: inline-block;
			}
			.span1 {
				width: 300px;
				margin-right: 50px;
			}
			.spanWidth {
				width: 600px;
				display: inline-block;
			}
			.buttonList {
				span {
					vertical-align: middle;
					text-align: center;
					display: inline-block;
				}
				.smallBtn2 {
					margin: 0 10px;
				}
			}
		}
		/*******表单样式*******/
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
				width: 20%;
			}
			.colmn2 {
				width: 20%;
			}
			.colmn3 {
				width: 20%;
			}
			.colmn4 {
				width: 18%;
			}
			.colmn5 {
				width: 22%;
			}
			.check-more {
				text-align: center;
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
					width: 70px;
				}
			}
		}
	}
</style>
