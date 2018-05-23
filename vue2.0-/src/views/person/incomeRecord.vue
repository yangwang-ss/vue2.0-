<template>
	<div id="speechRateWap">
		<!--表单-->
		<table class="tableForm">
			<tr class="trHeader">
				<td>创建时间</td>
				<td>名称</td>
				<td>交易号</td>
				<td>金额</td>
				<td>状态</td>
			</tr>
			<tr v-for="item in list">
        <td class="colmn1">{{(item.createTime)}}</td>
        <td class="colmn2"></td><!--item.memo-->
        <td class="colmn3">{{item.id}}</td>
        <td class="colmn4">{{item.value}}元</td>
        <td class="colmn5" v-if="item.status==0">交易成功</td>
        <td class="colmn5" v-if="item.status==2">交易失败</td>
        <td class="colmn5" v-if="item.status==1">交易中</td>
			</tr>
		</table>
	</div>
</template>
<script>
  export default {
    data(){
      return {
        data: [],
        dataList:'',
        list:'',
        pageSize:10,
        pageNo:1,
      }
    },
    mounted(){
      //ready
      this.getqueryBlanceRecord();
      this.getPayList();
    },
    components: {
      //组建
    },
    methods: {
      formatDateTime(obj) {
        var date = new Date(obj);
        var y = 1900 + date.getYear();
        var m = "0" + (date.getMonth() + 1);
        var d = "0" + date.getDate();
        return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
//            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
//            return y + '-' + m + '-' + d;
      },
      gettasktime(ti){
        var src = new Date(ti);
        var dest=src.getTime();
        return dest;
      },
      getqueryBlanceRecord(){
        var that = this;
        this.axios.post('/company/queryBlanceRecord.do', {
          "userId":sessionStorage.getItem('userID'),
          "accountType":"rmb",
          "operateType":0
        })
          .then(function (res, req) {
            let dataList = res.data;
            if(dataList.code==0){
              that.dataList=dataList.data.result;
              that.dataList.result.status=that.getState(that.dataList.result.status);
//              console.log(dataList.data.result);
            }
          }).catch(function (err) {

        })
      },
      getPayList(){
        var that = this;
        this.axios.post('/payment/transaction/list.do', {
          "type":"0",
          "pageSize":10,
          "pageNo":1,
//          "startTime":"1519881776000",
//          "endTime":"1519893908000",
          "startTime":"",
          "endTime":"",
        })
          .then(function (res, req) {
            let comList = res.data;
            console.log(comList);
            if(comList.code==0){
              that.list = comList.data.list;
              console.log(that.list);
            }
          }).catch(function (err) {
        })
      },
      getStates(sta){
        var that = this;
        this.axios.post('/dictionary/searchParameterByName.do', {
          "name":"recordStatus",
          "key":sta
        })
          .then(function (res, req) {
            let dataList = res.data;
            if(dataList.code==0){
             return dataList;
            }
          }).catch(function (err) {

        })
      }
    }
  }
</script>
<style scoped lang = "scss">
	#speechRateWap{
		.tableForm{
			.colmn1{
				width: 20%;
			}
			.colmn2{
				width: 20%;
			}
			.colmn3{
				width: 30%;
			}
			.colmn4{
				width: 20%;
			}
      .colmn5{
        width: 20%;
      }
		}
	}
</style>
