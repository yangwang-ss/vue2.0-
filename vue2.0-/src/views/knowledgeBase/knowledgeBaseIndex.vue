<template>
  <div class="base-warp">
    <Row>
      <Col class="h41" span="24">
      知识库</Col>
    </Row>
    <Row>
      <Col span="8">
      <Col span="3"  class="knowledge">
      行业：</Col>
      <Col>
      <Select clearable v-model="industry" class="information-xs">
        <Option v-for="str in cityList" :value="str.value" :key="str.value">{{ str.name}}</Option>
      </Select>
      </Col>
      </Col>
      <Col span="8">
      <span>知识库名称：</span>
      <input type="text" placeholder="请输入名称" class="inputText" v-model="knowledgeName">
      </Col>
      <Col span="7" offset="1">
      <span class="smallBtn1 span" @click="newBuild(0,'')">新建</span>
      <span class="smallBtn2 span" @click="search()">搜索</span>
      <span class="smallBtnDefalt span" @click="resetting()">重置</span>
      </Col>
    </Row>
    <!--<Row>
      <Col span="24" class="base-add">
      <span class="smallBtn1 span" @click="newBuild(0,'')">新建</span>
      <span class="smallBtn2 span" @click="search()">搜索</span>
      <span class="smallBtnDefalt span" @click="resetting()">重置</span>
      </Col>
    </Row>-->
    <Row>
      <Col span="7">
      <Col span="3">
      <span class="smallBtnDefalt span" @click="deletingAll()" style="margin-top: 25px;">删除</span></Col>
      </Col>
    </Row>
    <Row class="table">
      <table>
        <tr class="trHeader">
          <td style="width:5%">
            <Checkbox v-model="check.all" @on-change="allCheckBox($event)">
            </Checkbox>
          </td>
          <td>知识库名称</td>
          <td>行业</td>
          <td>问题/知识点量</td>
          <td>描述</td>
          <td>创建时间</td>
          <td>操作</td>
        </tr>
        <tr v-for="item in table.data">
          <td>
            <Checkbox v-model="item.selected" @on-change="singleCheckBox(item.id,$event)">
            </Checkbox>
          </td>
          <td>{{item.name ? item.name : "暂无数据"}}</td>
          <td>{{item.industryName ? item.industryName : "暂无数据"}}</td>
          <td>{{item.statisticsInfo ? item.statisticsInfo : "暂无数据"}}</td>
          <td :title="item.memo">{{item.memo ? item.memo : "暂无数据"}}</td>
          <td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
          <td v-if="item.id">
            <a @click="viewJump(item.id)" title="查看">查看&nbsp;<i>|</i></a>
            <a @click="newBuild(1,item)" title="修改">修改&nbsp;<i>|</i></a>
            <a @click="deletingSingle(item.id,item.selected)" title="删除">删除</a>
          </td>
          <td v-else>暂不能操作</td>
        </tr>
      </table>
    </Row>
    <Row>
      <div id="page">
        <Page
          :total="table.total"
          show-sizer
          show-elevator
          :page-size="table.pageSize"
          @on-page-size-change="pageSizeToggle($event)"
          @on-change="pageToggle($event)"></Page>
      </div>
    </Row>
    <Row>
      <v-bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
        <div class="bouncesContent">
          <div class="bouncesHeader">
            <span style="font-size: 14px;font-weight: bolder;">{{knowledgeBase}}</span>
            <span><i data-v-0c04591f="" class="icon iconfont icon-Delete" @click="shutDown()"></i></span>
          </div>
          <div class="bounces-item item-name">
            <span class="information-xs">知识库名称：</span>
            <input type="text" class="inputText" v-model="addKnowledge.name">
          </div>
          <div class="bounces-item">
            <span class="information-xs">行业：</span>
            <Select clearable v-model="addKnowledge.industry">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="bounces-area">
            <span class="information-xs">描述：</span>
            <textarea cols="30" rows="10" placeholder="请输入" v-model="addKnowledge.describe"></textarea>
          </div>
          <div class="bounces-determine">
          	<div class="middlBtnDefalt" @click="shutDown()">取消</div>
            <p class="middleBtn1" @click="determine()">确定</p>
          </div>
        </div>
      </v-bounces>
    </Row>
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
  import bounces from "@/components/btm-bounces.vue"
  export default{
    data () {
      return {
      	loading:true,
        bouncesHide: false,
        modificationId: "",
        cityList: [
          {
            name: "",
            value: ""
          }
        ],
        knowledgeBase: "",
        industry: null,
        addKnowledge: {
          name: "",
          industry: "",
          describe: ""
        },
        knowledgeName: null,
        check: {
          all: false,
          single: false,
          stayList: []
        },
        table: {
          total: null,
          data: [
            {
              name: "",
              industryName: "",
              statisticsInfo: "",
              memo: "",
              createTime: "",
              id: "",
              selected: false
            }
          ],
          pageSize: 10,  // 每页显示条数
          currentPage: 1  //当前页码
        },

      }
    },

    methods: {
      getDefaultLoad(e, content){
        // 页面初始化-及搜索
        this.axios.post("/knowledge/base/list.do", {
          "pageNo": e ? e : this.table.currentPage,
          "pageSize": this.table.pageSize,
          "industryCode": content ? content.industryCode : null,
          "name": content ? content.name : null
        }).then((res) => {
          if (res.data.code === "0") {
          	this.loading =false;
            this.table.data = res.data.data.result;
            this.table.total = res.data.data.totalItems;
          }
          else{
          	this.$Message.error(res.data.msg)
          }
        }).catch((err) => {
          console.log(err, "no")
        })
      },
      getDeleting(id){
        // 删除的接口
        let _this = this;
        this.axios.post("/knowledge/base/delete.do", {
          "params": id
        }).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success({
              content: "删除成功",
              duration: 0.5,
              onClose: () => {
                _this.check.all = false;
                _this.getDefaultLoad();
              }
            })
          } else if (res.data.code === "1") {
            this.$Message.info("请先删除知识库数据")
          } else {
            this.$Message.info("删除失败")
          }
        }).catch((err) => {
          console.log(err, "no")
        })
      },
      getComboBoxList(){
        // 行业下拉列表请求
        this.axios.get("/knowledge/industry/list/combobox.do", {}).then((res) => {
          if (res.data.code === "0") {
            this.cityList = res.data.data.value;
          }
        }).catch((err) => {
          console.log(err, "no")
        })
      },
      getAdd(content){
        // 这里是添加接口
        this.axios.post("/knowledge/base/add.do", {
          "name": content.name,
          "industryCode": content.industryCode,
          "memo": content.memo
        }).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success({
              content: "新增成功",
              duration: 0.5,
              onClose: () => {
                this.getDefaultLoad();
              }
            })
          } else {
            this.$Message.success("新增失败")
          }
        }).catch((err) => {
          console.log(err, "no")
        })
      },
      getModification(content, id){
        this.axios.post("/knowledge/base/modify/" + id + ".do", {
          "name": content.name,
          "industryCode": content.industryCode,
          "memo": content.memo
        }).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success({
              content: "修改成功",
              duration: 0.5,
              onClose: () => {
                this.getDefaultLoad();
              }
            })
          } else {
            this.$Message.success("修改失败")
          }
        }).catch((err) => {
          console.log(err, "no")
        })

      },
      computationsCallTime(date){
        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
      },
      pageToggle(e){
        this.check.all = false;
        this.table.currentPage = e;
        this.getDefaultLoad(e, "");
      },
      pageSizeToggle(e){
        this.check.all = false;
        this.table.pageSize = e;
        this.getDefaultLoad();
      },
      singleCheckBox(id, event){
        // 单选情况下
        if (event) {
          this.check.stayList.push(id);
          if (this.check.stayList.length === this.table.data.length) this.check.all = true;
        } else {
          let setId = this.check.stayList.indexOf(id);
          this.check.stayList.splice(setId, 1);
          if (this.check.stayList.length !== this.table.data.length) this.check.all = false;
        }
      },
      allCheckBox(event){
        // 全选情况下
        let _this = this;
        if (event) {
          this.check.stayList = [];
          this.table.data.map(function (item) {
            item.selected = true;
            _this.check.stayList.push(item.id)
          });
        } else {
          this.table.data.map(function (item) {
            item.selected = false;
            _this.check.stayList = [];
          });
        }
      },
      deletingAll(){
        // 全部删除
        if (this.check.stayList.length < 1) {
          this.$Message.info("请勾选")
        } else {
          this.$Modal.confirm({
            title: '确认对话框标题',
            content: '确认要删除吗删除后将无法恢复',
            onOk: () => {
              this.getDeleting(this.check.stayList)
            },
            onCancel: () => {

            }
          });
        }
      },
      deletingSingle(id, event){
        let arr = [];
        // 单个删除
        arr.push(id);
        this.$Modal.confirm({
          title: '确认对话框标题',
          content: '确认要删除吗删除后将无法恢复',
          onOk: () => {
            this.getDeleting(arr);
          },
          onCancel: () => {

          }
        });
      },
      resetting(){
        // 重置
        this.knowledgeName = null;
        this.industry = null;
      },
      newBuild(index, item){
        switch (index) {
          case 0: {
            this.knowledgeBase = "添加知识库";
            break;
          }
          case 1: {
            this.knowledgeBase = "修改知识库";
            this.modificationId = item.id;
            this.axios.get("/knowledge/base/detail/" + this.modificationId + ".do", {}).then((res) => {
              if (res.data.code === "0") {
                this.addKnowledge.name = res.data.data.name;
                this.addKnowledge.industry = res.data.data.industryCode;
                this.addKnowledge.describe = res.data.data.memo;
              }
            }).catch((err) => {
              console.log(err, "no")
            })
            break;
          }
        }
        // 新建
        this.bouncesHide = true
      },
      popupShutDown(){
        // 关闭
//      this.bouncesHide = false;
      },
      shutDown(){
        // 关闭
        this.bouncesHide = false;
      },
      search(){
        // 搜索
        let content = {
          industryCode: this.industry,
          name: this.knowledgeName
        };
        this.getDefaultLoad('', content)
      },
      determine(){
        // 确定
        if (this.addKnowledge.name && this.addKnowledge.industry && this.addKnowledge.describe) {
          let content = {
            name: this.addKnowledge.name,
            industryCode: this.addKnowledge.industry,
            memo: this.addKnowledge.describe
          };
          if (this.modificationId) {
            // 修改确定
            this.getModification(content, this.modificationId)
          } else {
            //新增确定
            this.getAdd(content);
          }
          this.bouncesHide = false;
        } else {
          this.$Message.info("请您填写完全")
        }
      },
      viewJump(id){
        this.$router.push({
          path: "/knowledgeBaseName",
          query: {
            id: id
          }
        })
      }

    },
    components: {
      "v-bounces": bounces
    },
    created(){
//      window.sessionStorage.setItem('token', '3b4cc4c469fa476b8ff27b93f8a9093e');
//      window.sessionStorage.setItem('userID', 'SERVANT201710291422450000000008');

    },
    mounted(){
      this.getDefaultLoad();
      this.getComboBoxList();
    }
  }
</script>
<style lang="scss" scoped="scoped">
  i {
    font-style: normal;
    color: #E9E9E9;
  }

  .knowledge {
    line-height: 27px;
  }

  .base-add {
    text-align: right;
    .smallBtn2{
    	margin: 0 10px;
    }
  }
    .smallBtn2{
    	margin: 0 10px;
    }

  .span {
    text-align: center;
    display: inline-block;
  }

  .table {
    margin-top: 30px;
    a{
    	color: #108EE9;
    }
  }

  .bouncesContent {
  	.information-xs{
  		text-align: right;
  		font-size: 12px;
  	}
    width: 600px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .bouncesHeader {
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
    }
  ;
    .bounces-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 15px;
      &.item-name {
        margin-top: 30px;
      }
      span {
        display: inline-block;
        width: 90px;
      }
    }
    .bounces-area {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      span {
        display: inline-block;
        width: 90px;
      }
      textarea {
        overflow: hidden;
        width: 230px;
      }
    }
    .bounces-determine {
      margin-top: 40px;
      
    }
  }
</style>
