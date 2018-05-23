<template>
  <!--这个是关联问题和关联知识点的组件-->
  <div class="associated-warp">
    <div class="associated-title">
      <span style="font-size: 14px;font-weight: bolder;">{{title ? title : "所属知识点"}}</span>
      <span class="icon-span" @click="$emit('shutDown')"><i class="icon iconfont icon-Delete"></i></span>
    </div>
    <div class="associated-content">
      <div class="content-left">
        <div class="associatedSearch">
          <input type="text" maxlength="11" placeholder="请输入内容" v-model="nodeSearch">
          <span @click="parentSearch()"><img src="../../../static/img/search.png" alt=""></span>
        </div>
        <div class="zTreeDemoBackground left">
          <ul id="associated" class="ztree" ref="ztree"></ul>
        </div>
      </div>
      <div class="content-right">
        <Row>
          <Col span="20" v-if="questionPoint">
          <input type="text" placeholder="搜索关键字" class="inputHeadingsAssoc" v-model="selected.headings">
          <Select clearable v-model="selected.allProblems" id="answerAssoc">
            <Option v-for="item in selected.problemsList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <Select clearable v-model="selected.allStatus" id="statusAssoc">
            <Option v-for="item in selected.statusList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <span class="span smallBtn2" @click="search(0)">搜索</span>
          <span class="span smallBtnDefalt" @click="resetting(0)">重置</span>
          </Col>
          <Col span="20" v-else>
          <input type="text" placeholder="搜索关键词" class="inputHeadingsAssoc" v-model="selected.keyWords">
          <Select clearable v-model="selected.allAnswer" id="answerBox">
            <Option v-for="item in selected.statusList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <span class="span smallBtn2" @click="search(1)">搜索</span>
          <span class="span smallBtnDefalt" @click="resetting(1)">重置</span>
          </Col>
        </Row>
        <Row class="table" v-if="questionPoint">
          <Col span="10">
          <table>
            <tr class="trHeader">
              <td>问题标题</td>
              <td>归属知识点</td>
              <td>状态</td>
              <td>有效期</td>
            </tr>
            <tr v-for="item in table.data" @click="correlateQuestion(item)">
              <td>{{item.question ? item.question : "暂无数据"}}</td>
              <td>{{item.base}}</td>
              <td>状态</td>
              <td>{{item.date}}</td>
            </tr>
          </table>
          <div id="paging">
            <Page
              :total="table.total"
              show-sizer
              show-elevator
              :page-size="table.pageSize"
              @on-page-size-change="pageSizeToggle($event,0)"
              @on-change="pageToggle($event,0)"></Page>
          </div>
          </Col>
          <Col span="2" class="tableCorrelate">
          <p class="smallBtn2" @click="correlateAll(0)">全部关联</p>
          <p class="smallBtnDefalt" @click="emptyingCorrelate(0)">清空关联</p>
          <p class="smallBtn2" @click="add()">确定</p>
          </Col>
          <Col span="12" class="correlateScrool">
            <table>
            <tr class="trHeader">
              <td>问题标题</td>
              <td>归属知识点</td>
              <td>状态</td>
              <td>有效期</td>
              <td>操作</td>
            </tr>
            <tr v-for="(item,index) in table.correlateQuestionList" ref="correlateQuestionList">
              <td>{{item.question ? item.question : "暂无数据"}}</td>
              <td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
              <td>{{item.state ? judgmentValidity(item.state) : "暂无数据"}}</td>
              <td>{{item.validity === 0 ? validityPeriod(item.validityStart, item.validityEnd) : "永久有效"}}</td>
              <td><a style="color: #108EE9;" @click="deletingCorrelate(index,0)">删除</a></td>
            </tr>
          </table>
          </Col>
        </Row>
        <Row class="table" v-else>
          <!--所属知识点列表-->
          <Col span="10">
          <table>
          	
            <tr class="trHeader">
              <td>知识点标题</td>
              <td>创建时间</td>
              <td>是否有效</td>
              <td>有效期</td>
            </tr>
            <tr v-for="item in table.knowledge.data" @click="correlate(item)">
              <td :title="item.point">{{item.point ? item.point : "暂无数据"}}</td>
              <td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
              <td>{{item.state ? judgmentValidity(item.state) : "暂无数据"}}</td>
              <td>{{item.validity === 0 ? validityPeriod(item.validityStart, item.validityEnd) : "永久有效"}}</td>
            </tr>
          </table>
          <div id="paging">
            <Page
              :total="table.knowledge.total"
              show-sizer
              show-elevator
              :page-size="table.knowledge.pageSize"
              @on-page-size-change="pageSizeToggle($event,1)"
              @on-change="pageToggle($event,1)"></Page>
          </div>
          </Col>
          <Col span="2" class="tableCorrelate">
          <p class="smallBtn2" @click="correlateAll(1)">全部关联</p>
          <p class="smallBtnDefalt" @click="emptyingCorrelate(1)">清空关联</p>
          <p class="smallBtn2" @click="add()">确定</p>
          </Col>
          <Col span="11" class="correlateScrool">
          <table>
          	<tr>
          		<td colspan="5" style="text-align: center;">已关联问题</td>
          		
          	</tr>
            <tr class="trHeader">
              <td>知识点标题</td>
              <td>创建时间</td>
              <td>是否有效</td>
              <td>有效期</td>
              <td>操作</td>
            </tr>
            <tr v-for="(item,index) in table.knowledge.correlateList">
              <td :title="item.point">{{item.point ? item.point : "暂无关联"}}</td>
              <td :title="computationsCallTime(item.createTime)">{{item.createTime ? computationsCallTime(item.createTime) : "暂无关联"}}</td>
              <td>{{item.state ? judgmentValidity(item.state) : "暂无数据"}}</td>
              <td>{{item.validity === 0 ? validityPeriod(item.validityStart, item.validityEnd) : "暂无关联"}}</td>
              <td><a style="color: #108EE9;" @click="deletingCorrelate(index,1)">删除</a></td>
            </tr>
          </table>
          </Col>
        </Row>
        <!--<Row class="addBtn">-->
          <!--<span class="smallBtn2 span" @click="add()">添加</span>-->
        <!--</Row>-->
      </div>

    </div>
  </div>
</template>
<script>
  let newCount = 1;
  import Tool from "../../getData/tool";
  export default{
    props: ["title", "knowledgeBaseId", "points", "questionAndknowledge"],
    data () {
      return {
        nodeSearch: "",
        correlateobj:{
            knowledgeBl:0,
            questionBl:0
        },
        check: {
          all: false,
          single: false,
          stayList: []
        },
        zNodes: [],
        treeNodeId:null,
        questionPoint: false,
        selected: {
          headings: null,
          keyWords:null,
          allProblems: "1",
          allAnswer: "1",
          allStatus: "1",
          allDerivation: null,
          elect: [
            {
              name: "导出全部",
              id: "1"
            },
            {
              name: "导出选中项",
              id: "2"
            }
          ],
          statusList: [
            {
              name: "全部状态问题",
              id: "1"
            },
            {
              name: "有效问题",
              id: "2"
            },
            {
              name: "有效问题(带有效期)",
              id: "3"
            },
            {
              name: "失效问题",
              id: "4"
            },
            {
              name: "未失效问题",
              id: "5"
            }
          ],
          answerList: [
            {
              name: "全部视角答案",
              id: "1"
            },
            {
              name: "对内答案",
              id: "2"
            },
            {
              name: "对外答案",
              id: "3"
            },
          ],
          problemsList: [
            {
              id: "1",
              name: "全部视角",
            },
            {
              id: "2",
              name: "全部问题",
            },
            {
              id: "3",
              name: "未归纳知识点的问题",
            },
            {
              id: "4",
              name: "全部答案",
            },
            {
              id: "5",
              name: "对内答案",
            },
            {
              id: "6",
              name: "对外答案",
            }
          ],
        },
        table: {
          total: null,
          data: [
            {
              question: "",
              base: "",
              describe: "",
              createTime: "",
              id: "",
              selected: false
            },
          ],
          correlateQuestionList: [],
          pageSize: 10,  // 每页显示条数
          currentPage: 1,  //当前页码
          knowledge: {
            // 知识点的table表
            total: null,
            data: [
              {
                name: "",
                base: "",
                question: "",
                describe: "",
                date: "",
                id: "",
                selected: false
              }
            ],
            correlateList: [],
            correlateStatus: false,
            pageSize: 10,  // 每页显示条数
            currentPage: 1,  //当前页码
          },
        },
        setting: {
          view: {
//            addHoverDom: this.addHoverDom,
//            removeHoverDom: this.removeHoverDom,
            selectedMulti: true
          },
          edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: false,
            showRenameBtn: false
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            beforeDrag: this.beforeDrag,
            beforeClick: this.beforeClick,
          }
        },
      }
    },
    methods: {
      getCategoryList(){
        // 默认加载树状图
        let zTree = $.fn.zTree.getZTreeObj("associated");
        this.axios.get("/knowledge/category/list/" + this.knowledgeBaseId + ".do", {}).then((res) => {
          if (res.data.code === "0") {
            zTree.addNodes(null, res.data.data.value);
          }
          console.log(res, "成功");
        }).catch((err) => {
          console.log(err, "失败")
        })
      },
      getQuestionList(){
        // 知识库问题列表
        this.axios.post("/knowledge/question/list.do", {
          "pageNo": this.table.currentPage,
          "pageSize": this.table.pageSize,
          "keywordsRelated": this.selected.allProblems,
          "stateRelated": this.selected.allStatus,
          "knowledgeBaseId": this.knowledgeBaseId,
          "category": this.treeNodeId,
          "keywords": this.selected.headings
        }).then((res) => {
          if (res.data.code === "0") {
            this.table.data = res.data.data.result;
            this.table.total = res.data.data.totalItems;
          }
          console.log(res, "知识库问题列表")
        }).catch((err) => {
          console.log(err, "知识库问题列表111")
        })

      },
      getPointList(){
        // 知识点列表请求
        this.axios.post("/knowledPoint/pointList.do", {
          "point":this.selected.keyWords,
          "baseId": this.knowledgeBaseId,
          "state": this.selected.allAnswer?this.selected.allAnswer:"1",
          "category": this.treeNodeId,
          "pageSize": this.table.knowledge.pageSize,
          "pageNo": this.table.knowledge.currentPage,
        }).then((res) => {
          if (res.data.code === "0") {
            this.table.knowledge.data = res.data.data.result;
            console.log("知识点列表请求",this.table.knowledge.data)
            this.table.knowledge.currentPage = res.data.data.pageNo;
            this.table.knowledge.pageSize = res.data.data.pageSize;
            this.table.knowledge.total = res.data.data.totalItems;
          }
          console.log(res, "成功");
        }).catch((err) => {
          console.log(err, "失败")
        })
      },
      pageToggle(e, index){
        // 页码切换
        switch (index) {
          case 0: {
            this.check.all = false;
            this.table.currentPage = e;
            this.getQuestionList();
            break
          }
          case 1: {
            this.check.all = false;
            this.table.knowledge.currentPage = e;
            this.getPointList();
            break
          }
        }

      },
      pageSizeToggle(e, index){
        //数据显示切换
        switch (index) {
          case 0: {
            this.check.all = false;
            this.table.pageSize = e;
            this.getQuestionList();
            break
          }
          case 1: {
            this.check.all = false;
            this.table.knowledge.pageSize = e;
            console.log(this.table.knowledge.pageSize, "优质吗")
            this.getPointList();
            break
          }
        }
      },
      search(index){
        // 搜索
        if (index === 0) {
          this.getQuestionList()
        } else {
          this.getPointList();
        };
      },
      computationsCallTime(date){
          console.log(date,"你是什么")
        return Tool.dateFormate(new Date(date), "yyyy-MM-dd")
      },
      judgmentValidity(type){
        switch (type) {
          case 1: {
            return "启用"
          }
          case 2: {
            return "停用"
          }
        }
      },
      validityPeriod(s, e){
          console.log(s,"nishi shenm")
        console.log(e,"nishi shenm")
        return Tool.dateFormate(new Date(s), "yyyy-MM-dd") + '/' + Tool.dateFormate(new Date(e), "yyyy-MM-dd");
      },
      correlateAll(index){
        //关联全部
        switch (index) {
          case 0: {
            this.table.correlateQuestionList = this.table.data;
            break
          }
          case 1: {
            this.table.knowledge.correlateList = this.table.knowledge.data;
            break
          }
        }
      },
      correlateQuestion(item){
          // 关联已有问题-单个关联
        this.correlateobj.questionBl-=1;
        for (let n = 0; n < this.table.correlateQuestionList.length; n++) {
          if (this.table.correlateQuestionList[n].id === item.id) {
            break
          }
          this.correlateobj.questionBl = n;
        }
        if (this.correlateobj.questionBl=== this.table.correlateQuestionList.length - 1 || this.table.correlateQuestionList.length === 0) {
          this.table.correlateQuestionList.push(item);
        };
      },
      correlate(item){
          // 关联已有问题-单个关联
        this.correlateobj.knowledgeBl-=1;
        for (let n = 0; n < this.table.knowledge.correlateList.length; n++) {
          if (this.table.knowledge.correlateList[n].id === item.id) {
            break
          }
          this.correlateobj.knowledgeBl = n;
        }
        if (this.correlateobj.knowledgeBl=== this.table.knowledge.correlateList.length - 1 || this.table.knowledge.correlateList.length === 0) {
          this.table.knowledge.correlateList.push(item);
        };

      },
      parentSearch(){
        // 搜索树节点
        if (this.nodeSearch) {
          let treeObj = $.fn.zTree.getZTreeObj("associated");
          let nodes = treeObj.getNodesByParamFuzzy("name", this.nodeSearch, null);
          $.fn.zTree.init($("#associated"), this.setting, nodes);
        } else {
          $.fn.zTree.init($("#associated"), this.setting, []);
          this.getCategoryList();
        }
      },
      add(){
        // 添加
        if (this.questionPoint) {
          // 添加问题
          window.sessionStorage.setItem('correlateQuestionList',JSON.stringify(this.table.correlateQuestionList));
          this.$emit("addquest", this.table.correlateQuestionList)
        } else {
          window.sessionStorage.setItem('correlateList',JSON.stringify(this.table.knowledge.correlateList));
          this.$emit("addKnowledge", this.table.knowledge.correlateList);
        }
      },
      preservation(){
        // 保存
        this.$emit("preservationKnowledge");
      },
      emptyingCorrelate(index){
        // 取消关联
        switch (index) {
          case 0: {
            this.table.correlateQuestionList = [];
            break
          }
          case 1: {
            this.table.knowledge.correlateList = [];
            break
          }
        }
      },
      deletingCorrelate(index, i){
        // 删除关联
        switch (i) {
          case 0: {
            this.table.correlateQuestionList.splice(index, 1);
            break;
          }
          case 1: {
            this.table.knowledge.correlateList.splice(index, 1)
          }
        }
      },
      beforeDrag(treeId, treeNodes){
        // 禁止节点拖拽
        return false;
      },
      beforeClick(treeld, treeNode, clickFlag){
        // 点击节点
        this.treeNodeId = treeNode.id;
        if (this.questionPoint) {
          this.getQuestionList();
        } else {
          this.getPointList();
        }
      },
      showRemoveBtn(treeId, treeNode){
        return !treeNode.isFirstNode;
      },
      showRenameBtn(treeId, treeNode){
        return !treeNode.isLastNode;
      },
    },
    mounted(){
      let correlateQuestionList=[],correlateList=[];
      if(window.sessionStorage.getItem('correlateQuestionList')){
        //获取缓存的值
        correlateQuestionList=JSON.parse(window.sessionStorage.getItem('correlateQuestionList'));
      }
      if(window.sessionStorage.getItem('correlateList')){
        correlateList=JSON.parse(window.sessionStorage.getItem('correlateList'))
      }
      this.$nextTick(() => {
        if (this.questionAndknowledge === "question") {
          this.questionPoint = false;
          this.table.knowledge.correlateList=this.points&&this.points.length>0?this.points:correlateList;
          console.log(this.table.knowledge.correlateList,"获取到了吗1")
          this.getPointList();
        } else {
          this.questionPoint = true;
          this.table.correlateQuestionList=this.points&&this.points.length>0?this.points:correlateQuestionList;
          console.log(this.table.correlateQuestionList,"获取到了吗2")
          this.getQuestionList();
        }
        $.fn.zTree.init($("#associated"), this.setting, this.zNodes);
        this.getCategoryList();
      })
    }
  }
</script>
<style lang="scss">
  @import "../../../static/css/zTreeStyle/zTreeStyle.css";

  .associated-warp {
    width: 100%;
    background: #fff;
    border-radius: 3px;
    
    &.active {
      width: 500px;
    }
  }
  
  #paging{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 35px;
    .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
    .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
      height: 32px;
      line-height: 32px;
    }
    .ivu-select-single .ivu-select-selection {
      height: 32px;
      width: auto;
      border-radius: inherit;
      &:hover {
        background: azure;
      }
    }
  }

  .associated-title {
    height: 40px;
    line-height: 35px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 15px;
    border-bottom: 1px solid #f0f0f0;
    .icon-span {
      cursor: pointer;
      font-size: 14px;
      color: #000;

    }
  }

  .associated-content {
    width: 100%;
    overflow: hidden;
    padding: 20px;
  }
	.ivu-row{
		*{
			vertical-align: middle;
		}
	}
  .content-left {
    float: left;
    position: relative;
    width: 15%;
    overflow-y: auto;
    &.leftActive {
      width: 100%;
    }
    .associatedSearch {
      width: 100%;
      position: relative;
      input {
        width: 100%;
        height: 32px;
        color: #9fa9b2;
      }
      span {
        position: absolute;
        cursor: pointer;
        top: 6px;
        z-index: 2;
        right: 13px;
      }
      img {
        width: 22px;
        height: auto;
      }
    }
  }

  .content-right {
    padding-left: 20px;
    width: 85%;
    float: left;
    .table {
      margin-top: 20px;
    }
    .tableCorrelate {
      z-index: 2;
      text-align: center;
      padding: 0 20px;
      width: 120px;
      p {
        margin: 20px auto 0 auto;
        vertical-align: middle;
      }
    }
    .inputHeadingsAssoc {
      width: 80px;
      height: 32px;
    }
    #statusAssoc {
      &.ivu-select-single .ivu-select-selection {
        width: 140px;
        margin-left: 5px;
        height: 32px;
        overflow: hidden;
      }
    }
    #answerAssoc, #answerBox {
      &.ivu-select-single .ivu-select-selection {
        width: 140px;
        height: 32px;
        margin-left: 5px;
        overflow: hidden;
      }
    }
  }
  .correlateScrool{
    height: 250px;
    overflow-y: auto;
  }

  .addBtn {
    margin-top: 30px;
    text-align: center;
  }

  .span {
    display: inline-block;
    margin-left: 5px;
    text-align: center;
  }
</style>
