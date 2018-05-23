<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div id="openDomain">
      <div class="h41">域名开户</div>
        <div class="titled">请根据您公司情况选择以下 <span style="color: red">其中一种</span>域名开户方式</div>
      <div v-bind:class="{'checkd':isA,'row':!isA}" @click="onclickedA">
        <p class="maintitle">使用天堂声谷二级域名</p>
        <div class="maincontent">
          <span>企业登录域名：</span>
          <input type="text" class="inp" placeholder="域名前缀至少四位" v-model="website">
          <div class="mainbtn">.voicegu.cn</div>
        </div>
        <p class="mainnamed">登录域名将成为您的客服平台域名，提交后不能修改</p>
      </div>
      <div v-bind:class="{'checkd':isB,'row':!isB}" @click="onclickedB">
        <p class="maintitle">使用自有域名</p>
        <div class="maincontent">
          <span>企业登录域名：</span>
          <input type="text" class="inpu" placeholder="请输入自有域名">
          <input type="text" class="inpip" placeholder="请选择IP" v-model="ip">
        </div>
        <p class="mainna">登录域名将成为您的客服平台域名，提交后不能修改</p>
      </div>
      <div class="overbtn" @click="openDomain">
        提交
      </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                data: [],
              isA:false,
              isB:false,
              website:'',
              ip:''
            }
        },
        mounted(){
            //ready
        },
        components: {
            //组建
        },
        methods: {
            onclickedA(){
              this.isA=true;
              this.isB=!this.isA;
            },
          onclickedB(){
            this.isB=true;
            this.isA=!this.isB;
          },
            openDomain(){
                var that = this;
                this.axios.post('/company/setWebsite.do', {
                  "id":sessionStorage.getItem('userID'),                //类型：String  必有字段  备注：无
                  "website":that.website,                //类型：String  可有字段  备注：企业网站
                  "ip":that.ip                //类型：String  可有字段  备注：ip
                })
                        .then(function (res, req) {
                            let dataList = res.data;
                            that.data = dataList;
                        }).catch(function (err) {

                })
            }
        }
    }
</script>
<style  lang="scss" scoped="scoped">
  #openDomain{
  .titled{
    width: 90%;
    height: 40px;
    /*border: 1px solid red;*/
    margin:20px auto;
    text-align: center;
    color: #999999;
  }
  .row{
    margin: 20px auto;
    width: 60%;
    height: 200px;
    color: #999999;
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    .maintitle{
      font-size: 0.9rem;
      font-weight: 600;
      /*color: rgba(0,0,0,0.7);*/
      margin: 30px;
    }
    .maincontent{
      /*border: 1px solid #d9d9d9;*/
      width: 80%;
      height:40px;
      margin: auto;
      .inp{
        width: 50%;
        margin-left: 10px;
      }
      .inpu{
        width: 60%;
        margin-left: 10px;
      }
      .inpip{
        width: 40%;
        margin:10px 0 0 97px;
      }
      .mainbtn{
        display: inline-block;
        border: 1px solid #d9d9d9;
        padding: 5px 10px;
        border-radius: 5px;
      }
    }
    .mainnamed{
      margin-top: 20px;
      text-align: center;
    }
    .mainna{
      margin-top: 50px;
      text-align: center;
    }
  }
  .checkd{
    margin: 20px auto;
    width: 60%;
    height: 200px;
    color: #000000;
    border: 1px solid #D9D9D9;
    border-radius: 5px;
  .maintitle{
    font-size: 0.9rem;
    font-weight: 600;
    color: #2db7f5;
    margin: 30px;
  }
  .maincontent{
    /*border: 1px solid #d9d9d9;*/
    width: 80%;
    height:40px;
    margin: auto;
  .inp{
    width: 50%;
    margin-left: 10px;
  }
  .inpu{
    width: 60%;
    margin-left: 10px;
  }
  .inpip{
    width: 40%;
    margin:10px 0 0 97px;
  }
  .mainbtn{
    display: inline-block;
    border: 1px solid #d9d9d9;
    padding: 5px 10px;
    border-radius: 5px;
  }
  }
  .mainnamed{
    margin-top: 20px;
    text-align: center;
  }
  .mainna{
    margin-top: 50px;
    text-align: center;
  }
  }
  .uncheck{
    margin: 20px auto;
    width: 60%;
    height: 200px;
    color: #999999;
    border: 1px solid #D9D9D9;
    border-radius: 5px;
  .maintitle{
    font-size: 0.9rem;
    font-weight: 600;
    /*color: rgba(0,0,0,0.7);*/
    margin: 30px;
  }
  .maincontent{
    /*border: 1px solid #d9d9d9;*/
    width: 80%;
    height:40px;
    margin: auto;
  .inp{
    width: 50%;
    margin-left: 10px;
  }
  .inpu{
    width: 60%;
    margin-left: 10px;
  }
  .inpip{
    width: 40%;
    margin:10px 0 0 97px;
  }
  .mainbtn{
    display: inline-block;
    border: 1px solid #d9d9d9;
    padding: 5px 10px;
    border-radius: 5px;
  }
  }
  .mainnamed{
    margin-top: 20px;
    text-align: center;
  }
  .mainna{
    margin-top: 50px;
    text-align: center;
  }
  }
  .overbtn{
    width: 5%;
    text-align: center;
    padding: 5px 10px;
    /*border: 1px solid #d9d9d9;*/
    border-radius: 5px;
    background: #2db7f5;
    color: #FFFFFF;
    margin:40px auto;
  }
  .checkd:hover{
    box-shadow:0px  0px 10px #d9d9d9;
  }
  /*.row:hover{*/
    /*color: #000000;*/
  /*}*/
  }

</style>
