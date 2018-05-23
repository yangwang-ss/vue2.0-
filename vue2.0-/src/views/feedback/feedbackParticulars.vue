<template>
  <!--查看详情-->
  <v-bounces @emitClickPopup="$emit('emitClickPopup')">
    <div class="Dialog">
      <div class="bounHeader">
        <span class="information-xs">意见反馈</span>
        <span><i data-v-0c04591f="" class="icon iconfont icon-Delete" @click="$emit('shutDown')"></i></span>
      </div>
      <div class="boun-item item-name">
        <span class="information-xs">反馈编号：</span>
        <span>{{partList.id}}</span>
      </div>
      <div class="boun-item">
        <span class="information-xs">渠道：</span>
        <span>{{sourceType(partList.source)}}</span>
      </div>
      <div class="boun-item">
        <span class="information-xs">反馈账号：</span>
        <span>{{partList.userid}}</span>
      </div>
      <div class="boun-item">
        <span class="information-xs">联系电话：</span>
        <span>{{partList.userPhone}}</span>
      </div>
      <div class="boun-item">
        <span class="information-xs">反馈时间：</span>
        <span>{{computationsCallTime(partList.createtime)}}</span>
      </div>
      <div class="boun-item">
        <span class="information-xs">反馈内容：</span>
        <!--<input type="text" v-model="partList.info" >-->
        <span v-if="toggle">{{partList.info}}</span>
        <span v-else>{{partList.info}}</span>
      </div>
      <div class="boun-item shutDown">
        <span @click="submitDown" :class="{bctive:toggle}">{{toggle?"提交":"关闭"}}</span>
      </div>
    </div>

  </v-bounces>
</template>
<script>
  import Tool from "../../getData/tool";
  import bounces from "@/components/btm-bounces.vue"
  export default{
        props:["partList","toggle"],
        data () {
            return {}
        },
        components:{
            "v-bounces":bounces
        },
    methods:{
      sourceType(type){
        switch (type) {
          case "1": {
            return "网页"
          }
          case "2": {
            return "微信"
          }
          default: {
            return "移动端"
          }
        }
      },
      computationsCallTime(date){
        return Tool.dateFormate(new Date(date), "yyyy-MM-dd mm:ss")
      },
      submitDown(){
          if(this.toggle){
            this.$emit("submit",{
                id:this.partList.id,
               handlingOpinion:this.partList.info
            })
          }else{
            this.$emit("down")
          }

      }
    }
    }
</script>
<style lang="scss" scoped>
  .Dialog {
    width: 600px;
    background: #fff;
    .bounHeader {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      border-bottom: 1px #f0f0f0 solid;
      line-height: 40px;
      overflow: hidden;
      padding: 0 20px;
      span {
        float: left;
        display: inline-block;
        width: 50%;
      }
      span:nth-of-type(2) {
        text-align: right;
        i {
          cursor: pointer;
        }
      }
    } ;
    .boun-item {
      width: 60%;
      margin: 0 auto;
      padding-bottom: 15px;
      &.item-name{
        margin-top: 50px;
      }
      .information-xs{
        display: inline-block;
        width: 70px;
        text-align: right;
      }
      &.shutDown{
        width: 100%;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 30px;
        span{
          display: inline-block;
          border: 1px solid #ccc;
          width: 150px;
          line-height: 30px;
          cursor: pointer;
          border-radius: 3px;
          text-align: center;
          background: #fff;
          color:#4d4d4d;
          &.bctive{
              background: #0a6fc1;
            color: #fff;
            }

        }
      }
    }
  }
</style>
