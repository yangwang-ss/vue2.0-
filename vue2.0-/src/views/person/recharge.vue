<template>
	<div>
    <div class="Dialog" v-show="showRecharge">
			<div class="headTitle">
				<span class="title">充值</span>
				<span class="cancelWap"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="paddingL">
				<div class="row">
					<span style="display: inline-block;width: 75px;text-align: right;height: 25px;line-height: 25px;">充值金额:</span>
					<input type="text" class="box-border" placeholder="请输入金额" v-model="rechValue" />
				</div>
				<div class="grayTipText">输入金额保留两位小数</div>
				<div class="entrueText"><span>确认转入金额:</span><span class="blueTx">{{rechValue}}</span>元</div>
				<!--<div class="row">-->
					<!--<span>登入密码:</span>-->
					<!--<input type="password" class="box-border" placeholder="请输入登入密码"/>-->
				<!--</div>-->
				<div class="middleBtn1" @click="recharTo">确认充值</div>
			</div>
		</div>
    <div class="Dialog" v-show="showHtml">
      <div class="headTitle">
        <span class="title">银联页面</span>
        <span class="cancelWap"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
      </div>
      <!--<div class="paddingL" id="bHtml">-->
        <!--<div v-html="backHtml">-->
          <!--{{backHtml}}-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <div class="Dialog" v-show="">
      <div class="headTitle">
        <span class="title">订单</span>
        <span class="cancelWap"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
      </div>
      <div class="paddingL">
        <div class="row">
          <span class="textcenter">请在10分钟内完成支付</span>
          <!--<input type="text" class="box-border" placeholder="请输入金额"/>-->
          <table>
            <tr>
              <th>创建时间</th>
              <th>交易号</th>
              <th>金额</th>
              <th>状态</th>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
        <!--<div class="grayTipText">本次充值上线为20000元</div>-->
        <!--<div class="entrueText"><span>确认转入金额:</span><span class="blueTx">1234.10</span>元</div>-->
        <!--<div class="row">-->
        <!--<span>登入密码:</span>-->
        <!--<input type="password" class="box-border" placeholder="请输入登入密码"/>-->
        <!--</div>-->
        <div class="entBtns">
          <div class="entBtn enfalseBtn" @click="hideRcDialog">取消订单</div>
          <div class="entBtn" @click="hideRcDialog">网上交易</div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showRecharge: false,
        showOrder:false,
        showHtml:false,
        backHtml:'',
        rechValue:0
			}
		},
		
		methods: {
			cancel(){
				this.showRecharge = false;
				this.$emit("cancel");
        this.showOrder=false;
			},
			showRcDialog() {
				this.showRecharge = true;
			},
      showOrderlog(){
			  this.showOrder=true;
      },
			hideRcDialog() {
				this.showRecharge = false;
        this.showOrder=false;
        this.showHtml=false;
			},
      recharTo(){
        var that = this;
//        debugger;
//        window.location.href='/payment/chinapay/pay.do?value='+that.rechValue;
//        console.log('1111111');
        this.axios.post('/payment/chinapay/recharge.do', {
          "value":that.rechValue,
        }).then((res) => {
             that.alldata=res.data;
        if(res.data.code==0){
            that.backHtml=res.data.data;
//            console.log(that.backHtml.actionUrl);
//            console.log("http://bm.voicegu.com/clogin.html?TranType="+that.backHtml.TranType+"&TranDate="+that.backHtml.TranDate+"&RemoteAddr="+that.backHtml.RemoteAddr+"&PayTimeOut="+that.backHtml.PayTimeOut+"&BusiType="+that.backHtml.BusiType+"&OrderAmt="+that.backHtml.OrderAmt+"&Version="+that.backHtml.Version+"&MerOrderNo="+that.backHtml.MerOrderNo+"&Signature="+that.backHtml.Signature+"&MerId="+that.backHtml.MerId+"&MerBgUrl="+that.backHtml.MerBgUrl+"&TranTime="+that.backHtml.TranTime+"&MerPageUrl="+that.backHtml.MerPageUrl+"&action1="+that.backHtml.actionUrl);
            window.open("http://bmtest.voicegu.com/chinaPay.html?TranType="+that.backHtml.TranType+"&TranDate="+that.backHtml.TranDate+"&RemoteAddr="+that.backHtml.RemoteAddr+"&PayTimeOut="+that.backHtml.PayTimeOut+"&BusiType="+that.backHtml.BusiType+"&OrderAmt="+that.backHtml.OrderAmt+"&Version="+that.backHtml.Version+"&MerOrderNo="+that.backHtml.MerOrderNo+"&Signature="+that.backHtml.Signature+"&MerId="+that.backHtml.MerId+"&MerBgUrl="+that.backHtml.MerBgUrl+"&TranTime="+that.backHtml.TranTime+"&MerPageUrl="+that.backHtml.MerPageUrl+"&action1="+that.backHtml.actionUrl);

//            console.log(that.backHtml);
//            var bHtml
//            window.href=that.backHtml;
//            that.showRecharge = false;
//            that.showOrder=false;
//            that.showHtml=true;
          }else {
            this.$Message.success(res.data.msg);
          }
      }).catch(function(err) {})
      }
		}
	}
</script>

<style lang="scss" scoped="scoped">
		.middleBtn1{
			margin: auto;
			margin-bottom: 30px;
		}
		.Dialog {
			width: 500px;
			.headTitle {
				margin-bottom: 50px;
			}
			.paddingL {
        margin: auto;
        width: 80%;
				padding-left: 30px;
				.grayTipText{
					color: #ccc;
					margin-left: 85px;
					margin-bottom: 20px;
				}
				.row {
					margin-bottom: 20px;
        .textcenter{
          margin: auto;
          display: inline-block;
        }
					.box-border {
						/*padding: 0 10px;*/
						display: inline-block;
						width: 240px;
						height: 25px;
						line-height: 25px;
						margin-left: 10px;
					}
          table{
            margin: 30px auto;
            th,td{
              border: 1px solid #D9D9D9 ;
            }
          }

				}
				.entrueText{
					margin-bottom: 30px;
				}
				.blueTx{
					color: #87C97B;
					margin: 0 5px;
				}
				.entrueBtn{
					width: 220px;
					/*height: 60px;*/
					text-align: center;
					line-height: 60px;
					color: #fff;
					background: #108EE9;
					font-size: 16px;
					border-radius: 3px;
					margin:auto;
					margin-top: 100px;
					cursor: pointer;
				}
        .entBtns{
          text-align: center;
          margin: auto;
          .entBtn{
            width: 120px;
            display: inline-block;
            text-align: center;
            line-height: 50px;
            color: #fff;
            background: #108EE9;
            font-size: 16px;
            border-radius: 3px;
            margin:30px 20px;
            cursor: pointer;
          }
          .enfalseBtn{
            background: #FFFFFF;
            color: #999999;
            border: 1px solid #D9D9D9;
          }
        }

			}
		}

</style>
