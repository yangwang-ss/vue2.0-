<template>
  <div id="conpAuthen">
    <div class="h41">企业基本资料</div>
    <div class="row middleM">
      <span class="lWidth">企业logo：</span><span><img class="imgShow" :src="url" alt=""><span class="spanParent"><Upload class="fileup" :before-upload="handleFrontUpload" action="/file_upload" :show-upload-list="false" :on-success="onFrontSuccess" :on-error="onFrontError">
        <div class="choose-file">
          <i class="iconfont icon-add" />
          <span>上传附件</span>
        </div>
      </Upload></span></span>
    </div>
    <div class="row">
      <span class="lWidth">企业名称：</span><span><input type="text" placeholder="请输入企业名称" v-model="name"/></span>
    </div>
    <div class="row">
      <span class="lWidth">企业简称：</span><span><input type="text" placeholder="请输入企业简称" v-model="simplename"/></span>
    </div>
    <div class="row">
      <span class="lWidth">企业网站：</span><span><input type="text" placeholder="请输入企业网站" v-model="website"/></span>
    </div>
    <div class="row">
      <span class="lWidth">企业地址：</span><span><input type="text" placeholder="请输入企业地址" v-model="address"/></span>
    </div>
    <div class="row">
      <span class="lWidth">客服联系人姓名：</span><span><input type="text" placeholder="请输入客服联系人姓名" v-model="contacts"/></span>
    </div>
    <div class="row">
      <span class="lWidth">客服电话：</span><span><input type="text" placeholder="请输入客服电话" v-model="contactnum"/></span>
    </div>
    <div class="row">
      <span class="lWidth">财务联系人姓名：</span><span><input type="text" placeholder="请输入财务联系人姓名" v-model="financialofficer"/></span>
    </div>
    <div class="row">
      <span class="lWidth">企业财务电话：</span><span><input type="text" placeholder="请输入企业财务电话" v-model="financialphonenum"/></span>
    </div>
    <div class="row largeM">
      <span class="lWidth">企业备注：</span><span><input type="text" placeholder="请输入企业备注" v-model="remark"/></span>
    </div>
    <div class="saveBtn" @click="setBasic">保存</div>
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
        url:"",                //类型：String  可有字段  备注：企业LogoUrl
        name:"",                //类型：String  可有字段  备注：企业名称
        simplename:"",                //类型：String  可有字段  备注：企业简称
        website:"",                //类型：String  可有字段  备注：企业网站
        address:"",                //类型：String  可有字段  备注：企业地址
        contacts:"",                //类型：String  可有字段  备注：客服联系人姓名
        contactnum:"",                //类型：String  可有字段  备注：客服电话
        financialofficer:"",                //类型：String  可有字段  备注：财务联系人姓名
        financialphonenum:"",                //类型：String  可有字段  备注：企业财务电话
        remark:""                //类型：String  可有字段  备注：企业备注
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
      getCompon(){
        var that = this;
        this.axios.post('/company/queryCompanyOne.do', {
          "id":sessionStorage.getItem('companyId'),
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
              that.comList=comList.data;
              console.log(comList);
                that.url=that.comList.logo;                //类型：String  可有字段  备注：企业LogoUrl
                that.name=that.comList.name;                //类型：String  可有字段  备注：企业名称
                that.simplename=that.comList.simplename;                //类型：String  可有字段  备注：企业简称
                that.website=that.comList.website;                //类型：String  可有字段  备注：企业网站
                that.address=that.comList.address;                //类型：String  可有字段  备注：企业地址
                that.contacts=that.comList.contacts;                //类型：String  可有字段  备注：客服联系人姓名
                that.contactnum=that.comList.contactnum;                //类型：String  可有字段  备注：客服电话
                that.financialofficer=that.comList.financialofficer;                //类型：String  可有字段  备注：财务联系人姓名
                that.financialphonenum=that.comList.financialphonenum;                //类型：String  可有字段  备注：企业财务电话
                that.remark=that.comList.remark                //类型：String  可有字段  备注：企业备注
            }
          }).catch(function (err) {

        })
      },
      setBasic(){
        var that = this;
        this.axios.post('/company/setBasic.do', {
          "id":sessionStorage.getItem('companyId'),                //类型：String  必有字段  备注：无
          "logo":that.url,                //类型：String  可有字段  备注：企业LogoUrl
          "name":that.name,                //类型：String  可有字段  备注：企业名称
          "simplename":that.simplename,                //类型：String  可有字段  备注：企业简称
          "website":that.website,                //类型：String  可有字段  备注：企业网站
          "address":that.address,                //类型：String  可有字段  备注：企业地址
          "contacts":that.contacts,                //类型：String  可有字段  备注：客服联系人姓名
          "contactnum":that.contactnum,                //类型：String  可有字段  备注：客服电话
          "financialofficer":that.financialofficer,                //类型：String  可有字段  备注：财务联系人姓名
          "financialphonenum":that.financialphonenum,                //类型：String  可有字段  备注：企业财务电话
          "remark":that.remark                //类型：String  可有字段  备注：企业备注
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
              console.log(that.comList);
              that.$Message.success('保存成功');
            }
          }).catch(function (err) {

        })
      },
    }
  }
</script>

<style lang="scss" scoped="scoped">
  #conpAuthen {
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
  }
  input {
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
  }
  .largeM {
    margin-bottom: 60px;
  }
  .middleM {
    margin-top: 40px;
    margin-bottom: 40px;
  .imgShow{
    display: inline-block;
    width: 120px;
    height: 65px;
    border: 1px solid #D9D9D9;
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
