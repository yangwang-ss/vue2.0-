<template>
  <div id="cAuthentiation">
    <div class="h41">企业实名认证</div>
    <div class="row">
      <span class="tName" v-if="status=='agree'">您已通过企业实名认证</span>
      <span class="tName" v-if="status=='apply'">您的企业实名认证正在审核</span>
    </div>
    <div class="row">
      <span class="lWidth">企业名称：</span><span v-model="tname"/>{{tname}}</span>
    </div>
    <div class="row">
      <span class="lWidth">统一社会信用码：</span><span v-model="daima"/>{{daima}}</span>
    </div>
    <div class="row middleM">
      <span class="lWidth">企业营业执照：</span>
      <span><img class="imgShow" :src="url" alt=""><span class="spanParent"></span></span>
    </div>
    <div class="row">
      <span class="lWidth">开户行：</span><span v-model="bank"/>{{bank}}</span>
    </div>
    <div class="row">
      <span class="lWidth">开户主体：</span><span v-model="bankmain"/>{{bankmain}}</span>
    </div>
    <div class="row">
      <span class="lWidth">账号：</span><span v-model="comnumber"/>{{comnumber}}</span>
    </div>
  </div>
</template>
<script>
  import formengine from '../../../static/js/formengine.js';
  import { localImagePreview } from '../../getData/common';
  import { validateImageFile } from '../../getData/common';
  export default {
    data(){
      return {
        data: [],
        isA:false,
        isB:false,
        tname:'',
        daima:'',
        bank:'',
        bankmain:'',
        comnumber:'',
        url:'',
        status:''
      }
    },
    mounted(){
      //ready
      this.getCompon();
      function GetRequest() {
        var url = window.location.href.split('?')[1]; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url) {
          var strs = url.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      }

      this.status = GetRequest()["status"];
    },
    components: {
      //组建
    },
    methods: {
      getCompon(){
        var that = this;
        this.axios.post('/company/queryCompanyOne.do', {
          "id":sessionStorage.getItem('companyId'),
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0) {
              that.comList = comList.data;
              console.log(comList.data);
              that.url = that.comList.logo;
                that.tname = that.comList.name;
                that.daima = that.comList.dutyparagraph;
                that.url = that.comList.bizlicense;
                that.bank = that.comList.bank;
                that.bankmain = that.comList.accountname;
                that.comnumber = that.comList.accountnum;

            }
          }).catch(function (err) {

        })
      }
    }
  }
</script>
<style lang="scss" scoped="scoped">
  #cAuthentiation {
  .h41 {
    margin-bottom: 75px;
  }
  .row {
    width: 60%;
    text-align: left;
    margin-bottom: 20px;
    margin-left: 120px;

  .tName{
    font-size: 1.2rem;
    font-weight: 600;
  }
  .lWidth {
    display: inline-block;
    width: 100px;
    text-align: left;
  }
  img{
    width: 322px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    margin-left: 5px;
  }
  }
  .middleM {
    margin-top: 40px;
    margin-bottom: 40px;
  .imgShow{
    display: inline-block;
    width: 145px;
    height: 65px;
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    vertical-align: middle;
  }
  .spanParent{
    display: inline-block;
    position: relative;
  }
  }
  }
</style>
