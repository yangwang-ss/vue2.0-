<template>
  <!--抽检任务-->
  <div class="mission">
    <Row class="h42">
      <Col>
      <span style="cursor: auto;color: #5688de;">抽检任务</span>
      </Col>
    </Row>
    <Row class="mission-table">
      <table class="table">
        <tr class="trHeader">
          <td>创建时间</td>
          <td>服务者账号</td>
          <td>项目名称</td>
          <td>通话时长</td>
          <td>完成状态</td>
          <td>类型</td>
          <td>操作</td>
        </tr>
        <tr v-for="(item,index) in table.data" :key="item.id">
          <td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
          <td>{{item.serverAccount ? item.serverAccount : "暂无数据"}}</td>
          <td>{{item.projectName ? item.projectName : "暂无数据"}}</td>
          <td>{{item.talkTime ? computationsTalkTime(item.talkTime) : "暂无数据"}}</td>
          <td>{{item.status ? completeStatus(item.status) : "暂无数据"}}</td>
          <td>{{convetWkind(item.type,proKind)}}</td>
          <td class="check-more" v-if="item.jobId"><span @click="viewJump(item.jobId)">查看</span></td>
          <td v-else>暂不能操作</td>
        </tr>
      </table>
    </Row>
    <div id="page">
      <Page :total="table.total"
            :page-size="table.pageSize"
            @on-page-size-change="pageSizeToggle($event)"
            show-sizer show-elevator @on-change="pageToggle($event)"></Page>
    </div>
    <!--数据加载等待效果-->
		<Spin fix v-show="loading">
			<div>
				<svg class="circular" viewBox="25 25 50 50">
					<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
				</svg>
			</div>
		</Spin>
  </div>
</template>
<script>
  import Tool from "../../getData/tool"
  export default{
    data () {
      return {
      	loading:true,
      	proKind:[],
        table: {
          currentPage: 1,
          pageSize: 10,
          total: null,
          data: [
            {
              name: "FOD32409",
              callTime: "2017-12-01",
              accountNumber: "119",
              projectsName: "长安回访",
              duration: "30s",
              operation: "查看",
              id: "1"
            }
          ]
        }
      }
    },
    methods: {
      gethandLing(e){
        this.axios.post("appeal/appealList/3.do",{
          "pageNo": e ? e : this.table.currentPage,
          "pageSize": this.table.pageSize
        }).then((res) => {
          if (res.data.code === "0") {
            this.table.total = res.data.data.totalItems;
            this.table.data = res.data.data.result;
            this.loading = false;
          }
          console.log(res,"dadadsa")
        }).catch((err) => {
          console.log(err, "no是你吗")
        })
      },
      pageToggle(e){
        this.gethandLing(e);
      },
      completeStatus(type){
        switch (type) {
          case "0": {
            return "待上岗"
          }
          case "1": {
            return "质检中"
          }
          case "2": {
            return "机检完成"
          }
          case "3": {
            return "人检完成"
          }
          case "4": {
            return "申述中"
          }
          case "5": {
            return "放弃"
          }
          case "6": {
            return "强制结束"
          }
          case "7": {
            return "后台补录"
          }
          case "8": {
            return "申诉处理完成"
          }
        }
      },
      projectKinds() {
				var that = this;
				this.axios.post('/dictionary/searchParameterByName.do', {
					"name": 'projectType' //类型：String  必有字段  备注：字典名称
				}).then((res) => {
					this.proKind = res.data.data.value;
				}).catch(function(err) {
					console.log(err)
				});
			},
			convetWkind(a,list){
				for(var i=0;i<list.length;i++){
					if (a==list[i].key) {
						return list[i].value;
					}
				}
			},
      computationsCallTime(date){
        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
      },
      computationsTalkTime(time){
        let s = "";
        let hour = Math.floor(time / 3600);
        let min = Math.floor(time / 60) % 60;
        let sec = time % 60;
        s = hour + "时" + min + "分" + sec + "秒";
        return s;
      },
      pageSizeToggle(e){
        this.table.pageSize = e;
        this.gethandLing();
      },
      viewJump(item){
        this.$router.push({
          path: "/viewMission",
          query: {
            jobId: item
          }
        })
      }
    },
    mounted(){
      this.gethandLing();
      //项目类型
      this.projectKinds();
    }
  }
</script>
<style lang="scss">
	.check-more {
		text-align: left;
		position: relative;
		* {
			vertical-align: middle;
		}

		span {
			color: #108EE9;
			display: inline-block;
			cursor: pointer;
		}
	}
</style>
