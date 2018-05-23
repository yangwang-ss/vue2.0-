<template>
	<div id="basicM">
		<div class="h41">基础资料</div>
		<div class="uploadImg">
			<span class="lWidth top">上传头像：</span>
			<span class="exampleImg"><span class="bottomText"><img class="imgShow" :src="url" alt=""></span></span>
			<span class="exampleImg"><Upload class="fileup" :before-upload="handleFrontUpload" action="/file_upload" :show-upload-list="false" :on-success="onFrontSuccess" :on-error="onFrontError">
        <div class="choose-file">
          <i class="iconfont icon-add" />
          <span>上传附件</span>
        </div>
      </Upload></span>
		</div>
		<div class="row">
			<span class="lWidth">手机号：</span>
      <span v-model="number">{{number}}</span>
		</div>
		<div class="row">
			<span class="lWidth">昵称：</span>
			<input type="text" placeholder="请输入X位数昵称" class="boxborder" v-model="nickName"/>
		</div>
		<div class="row">
			<span class="lWidth">性别：</span>
			<span class="inputM inputM2"><input type="radio" name="sex" id="man" value="0" checked="checked" v-model="sex"/><label for="man">男</label></span>
			<span class="inputM"><input type="radio" name="sex" id="woman" value="1" v-model="sex"/><label for="woman">女</label></span>
		</div>
		<div class="saveBtn" @click="updatebasic">保存</div>
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
        url:'',
        sex:'',
        nickName:'',
        number:'15068170064'
      }
    },
    mounted(){
      //ready
      this.setBasic();
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
      setBasic(){
        var that = this;
        this.axios.post('/enterprise/findUserInfo.do', {
          "id":sessionStorage.getItem('userID'),
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
//              console.log(comList.data.user.nickName);phoneNumber
              if(comList.data.user.phoneNumber!=null||comList.data.user.phoneNumber!=undefined){
                that.number=comList.data.user.phoneNumber;
              }
              if(comList.data.user.photo!=null||comList.data.user.photo!=undefined){
                that.url=comList.data.user.photo;
              }
              if(comList.data.user.nickName!=null||comList.data.user.nickName!=undefined){
                that.nickName=comList.data.user.nickName;
              }

              if(comList.data.user.gender!=null||comList.data.user.gender!=undefined){
                that.sex=comList.data.user.gender;
              }
            }
          }).catch(function (err) {

        })
      },
      updatebasic(){
        var that = this;
        this.axios.post('/role/updateUser.do', {
          "id":sessionStorage.getItem('userID'),                //类型：String  必有字段  备注：无
          "nickName":that.nickName,                //类型：String  可有字段  备注：昵称
          "gender":that.sex,                //类型：Number  可有字段  备注：性别，0表示女，1表示男
          "photo":that.url,                //类型：String  可有字段  备注：证件正面照保存ID
        }).then(function (res, req) {
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
	#basicM{
		.uploadImg{
			margin-bottom:65px;
      margin-left:100px;
			.top{
				vertical-align: top;
			}
			.exampleImg{
				margin-right: 25px;
				width: 90px;
				height: 65px;
				display: inline-block;
      vertical-align:middle;
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
				.bottomText{
          width: 90px;
          height: 65px;
          display: inline-block;
					text-align: center;
          border: 1px solid #D9D9D9;
          border-radius: 5px;
          .imgShow{
            width: 100%;
            height: 100%;
          }
				}
			}

		}
		.lWidth{
				display: inline-block;
				width: 100px;
				margin-right: 50px;
				text-align: right;
				margin-bottom: 30px;
			}
		.row{
			margin-left:100px;
			.boxborder{
						width: 240px;
						height: 25px;
						line-height: 24px;
						border: 1px solid #D9D9D9;
						border-radius: 5px;
			}
			.inputM{
				*{
					vertical-align: middle;
				}
			}
			.inputM2{
				margin-right: 40px;
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
			margin-left: 400px;
			margin-top: 130px;
			cursor: pointer;
		}
	}
</style>
