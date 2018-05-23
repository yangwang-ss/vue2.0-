<template>
	<div id="Wallet">
		<div class="top">
			<div class="h41">企业名称</div>
			<div class="personMess">
				<div class="fL logo"><img :src="comList.logo" alt=""></div>
				<div class="fL">
					<!--<div class="name">{{comList.name}}</div>-->
					<div class="grayText"><span>账户名:</span><span class="name">{{comList.name}}</span></div>
				</div>
			</div>
		</div>
		<div class="bottom">
			<div class="Mtitle">账户余额</div>
			<div class="bottomRow"><span class="moneyText">{{money.assets}}<span class="smallText">元</span></span><span class="smallBtn1" @click="rechageMoney">充值</span><span class="smallBtn2" @click="cash">提现</span></div>
		</div>
		<div class="trade">
			<div class="h42">最近的交易记录</div>
			<div class="tabListWap">
				<div v-for="(item,index) in tabList" @click="tabIndex(index)" :class="{cur:item.iscur}">{{item.name}}</div>
				<div class="fR" @click="moreRecords">查看更多</div>
			</div>
			<!--tab组件-->
			<!--收入记录-->
			<div v-if="index == 0">
				<income></income>
			</div>
			<!--消费记录-->
			<div v-else="index == 1">
				<consume></consume>
			</div>
		</div>
		<!--充值-->
		<bounces v-show="bouncesHide1">
		<recharge ref = "recharge" @cancel="cancel"></recharge>
		</bounces>
		<!--提现-->
		<bounces v-show="bouncesHide2">
		<withdraw ref = "withdraw" @cancel="cancel"></withdraw>
		</bounces>
	</div>
</template>
<script>
	import bounces from "@/components/btm-bounces.vue"
	import income from "@/views/person/incomeRecord"
	import present from "@/views/person/presentRecord"
	import consume from "@/views/person/consumeRecord"
	import recharge from "@/views/person/recharge"
	import withdraw from "@/views/person/withdraw"
	export default {
		data() {
			return {
				bouncesHide1:false,
				bouncesHide2:false,
				tabList: [{
						iscur: true,
						name: "收入记录"
				},
					{
						iscur: false,
						name: "消费记录"
					}
				],
				index: '',
        dataList:'',
        comList:{
			name:'哈哈',
            logo:'http://voicegu.su.bcebos.com/png/d77cad9159f64e2b5f69bb358bd816e1.png'
        },
        complist:'',
        money:'',
        list:'',
        pageSize:10,
        pageNo:1
			}
		},
    mounted(){
      //ready
      this.getComp();
      this.getCompon();
    },
		methods: {
			cancel(){
				this.bouncesHide1 = false;
				this.bouncesHide2 = false;
			},
			rechageMoney(){
				this.bouncesHide1 = true;
				this.$refs.recharge.showRcDialog();
			},
			cash(){
				this.bouncesHide2 = true;
				this.$refs.withdraw.showcash();
			},
			tabIndex(index) {
				this.index = index;
				this.tabList.map(function(v, i) {
					i == index ? v.iscur = true : v.iscur = false;
				});
        this.getqueryBlanceRecord();
			},
			moreRecords() {
				this.$router.push('/' + 'moreRecord');
			},
      getComp(){
        var that = this;
        this.axios.post('/company/queryAssets.do', {
          "userId":sessionStorage.getItem('userID'),
          "type":"rmb"
        })
          .then(function (res, req) {
            let complist = res.data;
            if(complist.code==0){
              that.money = complist.data;
            }
          }).catch(function (err) {

        })
      },
      getCompon(){
        var that = this;
        this.axios.post('/company/queryCompany.do', {
          "Id":sessionStorage.getItem('companyId'),
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
//            comList=comList.data.result[0];
              if(comList!=null&&comList!=""&&comList!=undefined){
                that.comList = comList.data.result[0];
                console.log(that.comList);
              }
            }
          }).catch(function (err) {

        })
      },
      getqueryBlanceRecord(){
        var that = this;
        this.axios.post('/company/queryBlanceRecord.do', {
          "userId":sessionStorage.getItem('userID'),
          "accountType":"rmb",
          "operateType":that.index
        })
          .then(function (res, req) {
            let dataList = res.data;
            if(dataList.code==0){
//              console.log(dataList.data.result);
            }
          }).catch(function (err) {

        })
      }
		},
		components: {
			income,
			present,
			consume,
			recharge,
			withdraw,
			bounces
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#Wallet {
		.top {
			.personMess {
				overflow: hidden;
				padding-bottom: 30px;
				.fL {
					float: left;
					margin-left: 40px;
				}
				.logo {
					width: 85px;
					height: 60px;
					border: 1px solid #ccc;
					border-radius: 3px;
          vertical-align: middle;
          img{
            width: 100%;
            height: 100%;
          }
				}
				.name {
					font-size: 16px;
					font-weight: bold;
					color: #333;
					margin-bottom: 20px;
          			line-height: 60px;
				}
				.grayText {
					color: #333;
				}
			}
		}
		.bottom {
			border-top: 1px solid #E9E9E9;
			border-bottom: 10px solid #F4F4F4;
			.Mtitle {
				font-size: 16px;
				padding: 0 20px;
				height: 50px;
				line-height: 50px;
			}
			.bottomRow {
				height: 125px;
				line-height: 125px;
				.moneyText {
					padding-left: 50px;
					font-size: 24px;
					font-weight: bold;
					color: #333;
				}
				.smallText {
					font-size: 12px;
					margin-left: 5px;
				}
				.smallBtn1,
				.smallBtn2 {
					display: inline-block;
					text-align: center;
				}
				.smallBtn1 {
					margin-left: 70px;
					margin-right: 40px;
				}
			}
		}
		/*****交易记录******/
		.trade {
			padding: 20px;
			.h42 {
				color: #333;
			}
			.tabListWap {
				overflow: hidden;
				margin-left: 50px;
				margin-bottom: 15px;
				div {
					padding: 0 15px;
					cursor: pointer;
					text-align: center;
					float: left;
					height: 30px;
					line-height: 30px;
					margin-right: 1em;
					background: #F3F3F3;
					border-radius: 5px;
					color: #999;
				}
				.fR {
					float: right;
					background: #fff;
					color: #108EE9;
				}
			}
			.cur {
				background: #108EE9 !important;
				color: #fff !important;
			}
		}
	}
</style>
