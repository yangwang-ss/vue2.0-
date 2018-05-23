<template>
	<div id="cAuthentiation">
		<div class="h41">企业实名认证</div>
    <Modal v-model="result"  :mask-closable="false" :footerHide="true" class-name="vertical-center-modal"title="企业实名认证未通过原因"  width="300">
        <p >{{remark}}</p>
    </Modal>
    <div class="row">
      <span class="tName" v-show="rejectshow">您未通过企业实名认证，请重新提交审核<span class="result" @click="showResult">查看未通过原因</span></span>
    </div>
		<div class="row">
			<span class="lWidth">企业名称 <span class="red">*</span> ：</span><span><input type="text" placeholder="请输入企业名称" v-model="tname"/></span>
		</div>
		<div class="row">
			<span class="lWidth">统一社会信用代码<span class="red">*</span>：</span><span><input type="text" placeholder="请输入组织机构代码证" v-model="daima"/></span>
		</div>
		<div class="row middleM">
      <span class="lWidth">企业营业执照<span class="red">*</span>：</span>
      <span><img class="imgShow" :src="url" alt=""><span class="spanParent"><Upload class="fileup" :before-upload="handleFrontUpload" action="/file_upload" :show-upload-list="false" :on-success="onFrontSuccess" :on-error="onFrontError">
        <div class="choose-file">
          <i class="iconfont icon-add" />
          <span>上传附件</span>
        </div>
      </Upload></span></span>
		</div>
		<div class="row">
			<span class="lWidth">开户行<span class="red">*</span>：</span><span><input type="text" placeholder="请输入开户行" v-model="bank"/></span>
		</div>
		<div class="row">
			<span class="lWidth">开户主体<span class="red">*</span>：</span><span><input type="text" placeholder="请输入开户主体" v-model="bankmain"/></span>
		</div>
		<div class="row">
			<span class="lWidth">账号<span class="red">*</span>：</span><span><input type="text" placeholder="请输入账号" v-model="comnumber"/></span>
		</div>
		<div class="saveBtn" @click="authent">提交</div>
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
        rejectshow:false,
        tname:'',
        result:false,
        daima:'',
        bank:'',
        bankmain:'',
        comnumber:'',
        url:'',
        remark:''
      }
    },
    mounted(){
      //ready
      this.getCompon();
    },
    components: {
      //组建
    },
    methods: {
      showResult(){
        this.result=true;
      },
//      getCompon(){
//        var that = this;
//        this.axios.post('/company/queryCompany.do', {
//          "Id":sessionStorage.getItem('companyId'),
//        })
//          .then(function (res, req) {
//            let comList = res.data;
//            if(comList.code==0){
//              that.comList = comList.data.result[0];
//
////              if(that.comList.status="agree"||that.comList.status="apply"){
////                //跳转
////              }elseif(that.comList.status="reject"){
////                //上面显示已被拒绝
////              }
//              console.log(that.comList);
//            }
//          }).catch(function (err) {
//
//        })
//      },
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
              if(that.comList.status=="agree"||that.comList.status=="apply"){
                that.$router.push('authened?status='+that.comList.status);
              }else if(that.comList.status=="reject"){
                that.rejectshow=true;
              }
              that.url = that.comList.logo;
                that.tname = that.comList.name;
                that.daima = that.comList.dutyparagraph;
                that.url = that.comList.bizlicense;
                that.bank = that.comList.bank;
                that.bankmain = that.comList.accountname;
                that.comnumber = that.comList.accountnum;
                that.remark = that.comList.remark;

            }
          }).catch(function (err) {

        })
      },
      handleFrontUpload(file) {
        if (!validateImageFile(file)) {
          return;
        }
        var _this = this;
        let formdata = new FormData();
        formdata.append('file', file, file.name);
        var option = {
          method: 'post',
          url: '/fileUpload.do',
          data: formdata
        }

        this.axios(option).then(function (response) {
          if (!response) {
            _this.$Message.error("错误");
            return;
          }
          let result = response.data;
          if (!result || !result.code || result.code != 0) {
            _this.$Message.error(result.msg);
            return;
          }
          if (result.code == 0) {
            _this.url = result.data.value;
            _this.$Message.success('上传成功');
          }
        });
        return false;
      },
      onFrontSuccess(response, file, fileList) {
        localImagePreview("front-preview", fileList);
        this.pictureFront.validateErrorTip = '';
        this.pictureFront.uploadFile = null;
        this.$Message.success('上传成功');
      },
      onFrontError(error, file, fileList) {
        localImagePreview("front-preview", fileList);
        this.pictureFront.validateErrorTip = '';
        this.pictureFront.uploadFile = null;
        this.$Message.error('上传失败');
      },
      authent(){
        var that = this;
        if(that.tname==null||that.tname==undefined||that.tname==""){
              that.$Message.success('请输入企业名称');
        }else if(that.daima==null||that.daima==undefined||that.daima==""){
              that.$Message.success('请输入统一信用代码');
        }else if(that.url==null||that.url==undefined||that.url==""){
              that.$Message.success('上传营业执照');
        }else if(that.bank==null||that.bank==undefined||that.bank==""){
              that.$Message.success('请输入银行账户开户行');
        }else if(that.bankmain==null||that.bankmain==undefined||that.bankmain==""){
              that.$Message.success('请输入银行账户开户主体');
        }else if(that.comnumber==null||that.comnumber==undefined||that.comnumber==""){
              that.$Message.success('请输入企业银行账户');
        }else{
        this.axios.post('/company/authenticationCompany.do', {
          "Id":sessionStorage.getItem('userID'),
          "name":that.tname,                //类型：String  可有字段  备注：企业名称
          "dutyparagraph":that.daima,                //类型：String  可有字段  备注：统一社会信用代码
          "bizlicense":that.url,                //类型：String  可有字段  备注：营业执照照片URL
          "bank":that.bank,                //类型：String  可有字段  备注：企业银行账户的开户行
          "accountname":that.bankmain,                //类型：String  可有字段  备注：银行账户开户主体
          "accountnum":that.comnumber                //类型：String  可有字段  备注：企业银行账户
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
              that.$Message.success('保存成功');
              console.log(that.comList);
              sessionStorage.setItem("companyId",that.comList.data.value);
              that.getCompon();
            }
          }).catch(function (err) {

        })
        }
      },
    }
  }
</script>
<style lang="scss" scoped="scoped">
	#cAuthentiation {
		.h41 {
			margin-bottom: 75px;
		}
		.row {
			margin-bottom: 20px;
			margin-left: 120px;
			.lWidth {
				display: inline-block;
				width: 150px;
				text-align: right;
        .red{
          color: red;
        }
			}
			input,img{
				width: 322px;
				height: 30px;
				line-height: 30px;
				border: 1px solid #D9D9D9;
				border-radius: 5px;
				margin-left: 5px;
			}
			.upLoadImg {
				width: 95px;
				height: 65px;
        vertical-align: middle;
			}
      .tName{
        font-size: 1.2rem;
        font-weight: 600;
          .result{
            color: #00ac00;
          }
      }

		}
		.largeM {
			margin-bottom: 60px;
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
        .addImg{
          display: inline-block;
          width: 95px;
          height: 65px;
          margin-left: 5px;
          position: absolute;
          top:0;
          left: 0;
          background: #FFFFFF;
          text-align: center;
          line-height: 65px;
          font-size: 1.2rem;
          border: 1px dashed #D9D9D9;
          border-radius: 5px;
          color: #d9d9d9;
        }
  .fileup{
    vertical-align: middle;
    margin-left: 20px;
    display: inline-block;
  .choose-file{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 77px;
    height: 65px;
    background-color: #f2f2f2;
    color: #888;
    border-radius: 3px;
    border: 1px dotted #dbdbdb;
    font-size: 12px;
    cursor: pointer;

  i {
    font-size: 20px;
    color: #888;
  }
  span{
    margin:0;

  }
  }
  }
      }
		}
		.saveBtn {
			width: 60px;
			height: 25px;
			text-align: center;
			line-height: 25px;
			color: #fff;
			font-size: 14px;
			background: #108DE9;
			border-radius: 5px;
			margin-left: 300px;
			margin-top: 30px;
			cursor: pointer;
		}
	}
</style>
