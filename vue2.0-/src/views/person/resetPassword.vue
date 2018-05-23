<template>
	<div id="resetPassword">
		<div class="h41">重置密码</div>
		<div class="row">
			<span class="lWidth">原始密码：</span>
			<input type="password"   value="" placeholder="请输入账户原密码" class="boxborder" v-model="passwordNow"/>
		</div>
		<div class="row">
			<span class="lWidth">新密码：</span>
			<input type="password"   value="" placeholder="请输入新密码" class="boxborder" v-model="password"/>
		</div>
		<div class="row">
			<span class="lWidth">确认密码：</span>
			<input type="password"  value="" placeholder="请重新输入密码" class="boxborder" v-model="passwordCopy"/>
		</div>
		<div class="saveBtn" @click="updatePW">保存</div>
	</div>
</template>

<script>
  import md5 from 'js-md5';
  export default {
    data(){
      return {
        data: [],
        passwordNow:'',
        password:'',
        passwordCopy:''
      }
    },
    mounted(){
      //ready
    },
    components: {
      //组建
    },
    methods: {
      updatePW(){
        var that = this;
        this.axios.post('/role/updateUserPassword.do', {
          "id":sessionStorage.getItem('userID'),                //类型：String  必有字段  备注：无
          "passwordNow":md5(that.passwordNow),                //类型：String  必有字段  备注：原始密码
          "password":md5(that.password),                //类型：String  必有字段  备注：新密码
          "passwordCopy":md5(that.passwordCopy)                //类型：String  必有字段  备注：确认密码
//          "passwordNow":that.passwordNow,                //类型：String  必有字段  备注：原始密码
//          "password":that.password,                //类型：String  必有字段  备注：新密码
//          "passwordCopy":that.passwordCopy
        }).then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
              console.log(that.comList);
              that.$Message.success('修改成功');
            }
          }).catch(function (err) {

        })
      },
    }
  }
</script>

<style lang="scss" scoped="scoped">
	#resetPassword{
		.h41{
			margin-bottom: 95px;
		}
		.row{
			margin-left: 160px;
			margin-bottom: 20px;
			color: #999;
			.lWidth{
				display: inline-block;
				width: 100px;
				text-align: right;
				margin-right: 25px;
			}
			.boxborder{
						width: 240px;
						height: 25px;
						line-height: 24px;
						border: 1px solid #D9D9D9;
						border-radius: 5px;
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
			margin-left: 350px;
			margin-top: 50px;
			cursor: pointer;
		}

	}
</style>
