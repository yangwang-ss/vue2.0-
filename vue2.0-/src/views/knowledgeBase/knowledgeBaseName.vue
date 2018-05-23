<template>
  <div class="base-wrap">
    <Row>
      <Col span="24" class="baseNameHeader">
      <span class="h42" @click="viewJump()">知识库/</span>
      <span class="h41">{{knowledgeBaseName ? knowledgeBaseName : "知识库名称"}}</span>
      </Col>
    </Row>
    <div class="baseNameContent">
      <div class="baseNameLeft">
        <p class="information-xs">分类</p>
        <div class="baseNameSearch">
          <input type="text" maxlength="11" placeholder="请输入" v-model="nodeSearch">
          <span @click="parentSearch()"><img src="../../../static/img/search.png" alt=""></span>
        </div>
        <div class="zTreeDemoBackground left">
          <ul id="treeDemo" class="ztree" ref="ztree"></ul>
        </div>
        <div class="baseNameAdd">
          <span @click="addNode()" class="middleBtn1">添加根节点</span>
         <!-- <span @click="getPreservationNode()">保存</span>-->
        </div>
      </div>
      <div class="baseNameRight">
        <Row>
          <Col span="5">
          <span class="span smallBtnDefalt" @click="switchQuestionPoint(0)"
                :class="{smallActive:questionPoint}">问题</span>
          <span class="smallBtn2 span" @click="switchQuestionPoint(1)" :class="{baseActive:questionPoint}">知识点</span>
          </Col>
          <Col span="19" v-if="questionPoint">
          <input type="text" placeholder="搜索关键字" class="inputHeadings" v-model="selected.headings">
          <Select clearable v-model="selected.allProblems" id="problems">
            <Option v-for="item in selected.problemsList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <Select clearable v-model="selected.allStatus" id="status">
            <Option v-for="item in selected.statusList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <span class="span smallBtn2" @click="search(0)">搜索</span>
          <span class="span smallBtnDefalt" @click="resetting(0)">重置</span>
          </Col>
          <Col span="19" v-else>
          <input type="text" placeholder="搜索关键词" class="inputHeadings" v-model="selected.keyWords">
          <Select clearable v-model="selected.allAnswer" id="answer">
            <Option v-for="item in selected.knowledgeStatusList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <span class="span smallBtn2" @click="search(1)">搜索</span>
          <span class="span smallBtnDefalt" @click="resetting(1)">重置</span>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="7">
          <span class="smallBtnDefalt span" @click="deletingAll()">删除</span>
          <span class="span smallBtn2" @click="addJump()">添加</span>
          </Col>

        </Row>
        <Row class="table" v-if="questionPoint">
          <table>
            <tr class="trHeader">
              <td>
                <Checkbox v-model="check.all" @on-change="allCheckBox($event,0)">
                </Checkbox>
              </td>
              <td>问题标题</td>
              <td>归属知识点</td>
              <td>创建时间</td>
              <td>状态</td>
              <td>有效期</td>
              <td>操作</td>
            </tr>
            <tr v-for="item in table.data">
              <td>
                <Checkbox v-model="item.selected" @on-change="singleCheckBox(item.id,$event,0)">
                </Checkbox>
              </td>
              <td>{{item.question ? item.question : "暂无数据"}}</td>
              <td>{{item.points&&item.points.length>0 ? item.points.join() : "暂无数据"}}</td>
              <td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
              <td>{{item.state ? judgmentValidity(item.state) : "暂无数据"}}</td>
              <td>{{item.validity === 0 ? validityPeriod(item.validityStart, item.validityEnd) : "永久有效"}}</td>
              <td>
                <a @click="newBuild(item.id)">修改&nbsp;<i class="Dividing">|</i></a>
                <a @click="deletingSingle(item.id,item.selected,0)">删除</a>
              </td>
            </tr>
          </table>
          <div id="page">
            <Page
              :total="table.total"
              show-sizer
              show-elevator
              :page-size="table.pageSize"
              @on-page-size-change="pageSizeToggle($event,0)"
              @on-change="pageToggle($event,0)"></Page>
          </div>
        </Row>
        <Row class="table" v-else>
          <table>
            <tr class="trHeader">
              <td>
                <Checkbox v-model="check.all" @on-change="allCheckBox($event,1)">
                </Checkbox>
              </td>
              <td>知识点标题</td>
              <td>创建时间</td>
              <td>是否有效</td>
              <td>有效期</td>
              <td>操作</td>
            </tr>
            <tr v-for="item in table.knowledge.data">
              <td>
                <Checkbox v-model="item.selected" @on-change="singleCheckBox(item.id,$event,1)">
                </Checkbox>
              </td>
              <td>{{item.point ? item.point : "暂无数据"}}</td>
              <td>{{item.createTime ? computationsCallTime(item.createTime) : "暂无数据"}}</td>
              <td>{{item.state ? judgmentValidity(item.state) : "暂无数据"}}</td>
              <td>{{item.validity === 0 ? validityPeriod(item.validityStart, item.validityEnd) : "永久有效"}}</td>
              <td>
                <a @click="newBuild(item.id)">修改&nbsp;<i class="Dividing">|</i></a>
                <a @click="deletingSingle(item.id,item.selected,1)">删除</a>
              </td>
            </tr>
          </table>
          <div id="page">
            <Page
              :total="table.knowledge.total"
              show-sizer
              show-elevator
              :page-size="table.knowledge.pageSize"
              @on-page-size-change="pageSizeToggle($event,1)"
              @on-change="pageToggle($event,1)"></Page>
          </div>
        </Row>
        <Row>
          <v-bounces v-show="bouncesHide" @emitClickPopup="popupShutDown()">
            <div class="bouncesContent">
              <div class="bouncesHeader">
                <span class="information-xs">修改知识库</span>
                <span><i data-v-0c04591f="" class="icon iconfont icon-Delete" @click="shutDown()"></i></span>
              </div>
              <div class="bounces-item item-name">
                <span class="information-xs">知识库名称：</span>
                <input type="text" class="inputText" v-model="addKnowledge.name">
              </div>
              <div class="bounces-item">
                <span class="information-xs">行业：</span>
                <Select clearable v-model="addKnowledge.industry">
                  <Option v-for="str in cityList" :value="str.value" :key="str.id">{{ str.label }}</Option>
                </Select>
              </div>
              <div class="bounces-area">
                <span class="information-xs">描述：</span>
                <textarea cols="30" rows="10" placeholder="请输入" v-model="addKnowledge.describe"></textarea>
              </div>
              <div class="bounces-determine">
                <p class="smallBtn2" @click="determine()">确定</p>
              </div>
            </div>
          </v-bounces>
        </Row>
      </div>
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
  let newCount = 1;
  import Tool from "../../getData/tool"
  import bounces from "@/components/btm-bounces.vue"
  export default{
    data () {
      return {
      	loading:true,
        iableQuestion: this.$route.query.iableQuestion, // 辨识变量，用来监听用
        iableKnowledeg: this.$route.query.iableKnowledeg,
        nodeSearch: "",
        nodes: 0,
        questionPoint: true,
        bouncesHide: false,
        knowledgeBaseName: "",
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
          knowledgeStatusList:[
            {
              name: "全部状态知识点",
              id: "1"
            },
            {
              name: "有效知识点",
              id: "2"
            },
            {
              name: "有效知识点(带有效期)",
              id: "3"
            },
            {
              name: "失效知识点",
              id: "4"
            },
            {
              name: "未失效知识点",
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
        zNodes: [],
        setting: {
          view: {
            addHoverDom: this.addHoverDom,
            removeHoverDom: this.removeHoverDom,
            selectedMulti: false,
            showIcon:true
          },
          edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: true,
            showRenameBtn: true
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            beforeDrag: this.beforeDrag,
            beforeEditName: this.beforeEditName,
            beforeRemove: this.beforeRemove,
            beforeRename: this.beforeRename,
            onRemove: this.onRemove,
            beforeClick: this.beforeClick,
//            onRename: this.onRename
          }
        },
        treeNodeId: null,
        zTreeObj: {},
        check: {
          all: false,
          single: false,
          stayList: []
        },
        addKnowledge: {
          name: "",
          industry: "",
          describe: ""
        },
        table: {
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
            pageSize: 5,  // 每页显示条数
            currentPage: 1,  //当前页码
          },

        },
        cityList: [
          {
            value: 'quanbu',
            label: '全部',
            id: 1
          },
          {
            value: 'dianxin',
            label: '电信',
            id: 2
          },
          {
            value: 'jinrong',
            label: '金融',
            id: 3
          },
        ],
        knowledgeBaseId: this.$route.query.id //知识库id
      }
    },
    methods: {
      getDefaultLoad(){
        // 默认加载页面
        console.log(this.knowledgeBaseId,"看看11");
        this.axios.get("/knowledge/base/detail/" + this.knowledgeBaseId + ".do", {}).then((res) => {
          if (res.data.code === "0") {
          	
            this.knowledgeBaseName = res.data.data.name;
            this.getCategoryList(this.knowledgeBaseId)
          }else{
          	this.$Message.error(res.data.msg)
          }
        }).catch((err) => {
        	console.log(err);
        })
      },
      getCategoryList(id){
        // 树状图接口
        this.axios.get("/knowledge/category/list/" + id + ".do", {}).then((res) => {
          if (res.data.code === "0") {
            $.fn.zTree.init($("#treeDemo"), this.setting, res.data.data.value);
          }
        }).catch((err) => {
        })
      },
      getQuestionList(){
        // 知识库问题列表
        this.axios.post("/knowledge/question/list.do", {
          "pageNo": this.table.currentPage,
          "pageSize": this.table.pageSize,
          "keywordsRelated":this.selected.allProblems,
          "stateRelated": this.selected.allStatus,
          "knowledgeBaseId": this.knowledgeBaseId,
          "category": this.treeNodeId,
          "keywords": this.selected.headings
        }).then((res) => {
          if (res.data.code === "0") {
          	this.loading = false;
            this.table.data = res.data.data.result;
            this.table.total = res.data.data.totalItems;
          }
          else{
          	this.$Message.error(res.data.msg)
          }
        }).catch((err) => {
        	console.log(err);
        })

      },
      getKnowledgeList(){
        // 知识库知识点列表
        this.axios.post("/knowledPoint/pointList.do", {
          "pageNo": this.table.knowledge.currentPage,
          "pageSize": this.table.knowledge.pageSize,
          "baseId": this.knowledgeBaseId,
          "state":this.selected.allAnswer?this.selected.allAnswer:"1",
          "point": this.selected.keyWords,
          "category": this.treeNodeId
        }).then((res) => {
          if (res.data.code === "0") {
            this.table.knowledge.data = res.data.data.result;
            this.table.knowledge.total = res.data.data.totalItems;
          }
        }).catch((err) => {
        })

      },
      getDeleting(idArr){
        // 删除问题列表接口
        this.axios.post("/knowledge/question/delete.do", {
          "params": idArr
        }).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success({
              content: "删除成功",
              duration: 0.5,
              onClose: () => {
                this.check.all = false;
                this.check.stayList = [];
                this.getQuestionList()
              }
            })
          } else {
            return
          }
        }).catch((err) => {
        })
      },
      getDeletingKnowledge(idArr){
        // 删除知识列表接口
        this.axios.post("/knowledPoint/deletePoints.do", {
          "params": idArr
        }).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success({
              content: "删除成功",
              duration: 0.5,
              onClose: () => {
                this.check.all = false;
                this.check.stayList = [];
                this.getKnowledgeList()
              }
            })
          } else {
            return
          }
        }).catch((err) => {
        })

      },
      getPreservationNode(){
        let zTree = $.fn.zTree.getZTreeObj("treeDemo");
        let nodes = zTree.getNodes();
        // 新增修改节点
        this.axios.post("/knowledge/category/save/" + this.knowledgeBaseId + ".do",
          nodes
        ).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success("保存成功")
          } else {
           this.$Message.info(res.data.msg);
           return false;
          }
        }).catch((err) => {
        })
      },
      getRemoveNode(id){
        // 删除树状图库问题-知识点
        this.axios.post("/knowledge/category/delete/" + this.knowledgeBaseId + "/" + id + ".do", {}).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success("删除成功")
          }
          console.log(res, "删除成功")
        }).catch((err) => {
          console.log(err, "删除失败")
        })
      },
      computationsCallTime(date){
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
        return Tool.dateFormate(new Date(s), "yyyy-MM-dd") + '/' + Tool.dateFormate(new Date(e), "yyyy-MM-dd");
      },
      parentSearch(){
          // 树状图搜索
        if (this.nodeSearch) {
          let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
          let nodes = treeObj.getNodesByParamFuzzy("name", this.nodeSearch, null);
          $.fn.zTree.init($("#treeDemo"), this.setting, nodes);
        } else {
          $.fn.zTree.init($("#treeDemo"), this.setting, []);
          this.getDefaultLoad();
        }
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
            this.getKnowledgeList();
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
            this.getKnowledgeList();
            break
          }
        }
      },
      search(index){
        // 搜索
        if (index === 0) {
          this.getQuestionList()
        } else {
          this.getKnowledgeList();
        };
      },
      resetting(index){
        // 重置
        switch (index) {
          case 0: {
            this.selected.allProblems = "";
            this.selected.allAnswer = "";
            this.selected.allStatus = "";
            this.selected.headings = "";
            break
          }
          case 1: {
            this.selected.allAnswer = "";
            this.selected.headings = "";
            break
          }
        }
      },
      addNode(){
        let zTree = $.fn.zTree.getZTreeObj("treeDemo");
        let a = {id: null, isModify: true, name: "请输入"};
        let b=zTree.addNodes(null, a);
        zTree.selectNode(b[0]);
        zTree.editName(b[0]);
      },
      deletingAll(){
        // 全部删除
        if(this.questionPoint){
          if (this.check.stayList.length < 1) {
            this.$Message.warning("请选择表格")
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
        }else{
          if (this.check.stayList.length < 1) {
            this.$Message.warning("请勾选")
          } else {
            this.$Modal.confirm({
              title: '确认对话框标题',
              content: '确认要删除吗删除后将无法恢复',
              onOk: () => {
                this.getDeletingKnowledge(this.check.stayList)
              },
              onCancel: () => {

              }
            });
          }
        }

      },
      allCheckBox(event, index){
        // 全选情况下
        let _this = this;
        switch (index) {
          case 0: {
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
            break
          }
          case 1: {
            if (event) {
              this.check.stayList = [];
              this.table.knowledge.data.map(function (item) {
                item.selected = true;
                _this.check.stayList.push(item.id)
              });
            } else {
              this.table.knowledge.data.map(function (item) {
                item.selected = false;
                _this.check.stayList = [];
              });
            }

          }
        }
      },
      singleCheckBox(id, event,index){
        // 单选情况下
        switch (index){
          case 0:{
            if (event) {
              this.check.stayList.push(id);
              if (this.check.stayList.length === this.table.data.length) this.check.all = true;
            } else {
              let setId = this.check.stayList.indexOf(id);
              this.check.stayList.splice(setId, 1);
              if (this.check.stayList.length !== this.table.data.length) this.check.all = false;
            }
              break
          }
          case 1:{
            if (event) {
              this.check.stayList.push(id);
              if (this.check.stayList.length === this.table.knowledge.data.length) this.check.all = true;
            } else {
              let setId = this.check.stayList.indexOf(id);
              this.check.stayList.splice(setId, 1);
              if (this.check.stayList.length !== this.table.knowledge.data.length) this.check.all = false;
            }
              break
          }
        }
      },
      newBuild(id){
        if (this.questionPoint) {
          // 修改问题
          this.$router.push({
            path: "/addQuestion",
            query: {
              id: this.knowledgeBaseId,
              name: this.knowledgeBaseName,
              questionId: id    // 修改问题的id
            }
          })
        } else {
          // 修改知识点
          this.$router.push({
            path: "/addKnowledge",
            query: {
              id: this.knowledgeBaseId,
              name: this.knowledgeBaseName,
              buildKnowledgeId: id    // 修改知识点的id
            }
          })
        }
      },
      shutDown(){
        // 关闭
        this.bouncesHide = false;
      },
      popupShutDown(){
        this.bouncesHide = false;
      },
      determine(){
        this.bouncesHide = false;
      },
      deletingSingle(id, event,index){
        // 单个删除
        let arr = [];
        switch (index){
          case 0:{
              arr.push(id);
              this.$Modal.confirm({
                title: '确认对话框标题',
                content: '确认要删除吗删除后将无法恢复',
                onOk: () => {
                  this.getDeleting(arr)
                },
                onCancel: () => {

                }
              });
            break
          }
          case 1:{
              arr.push(id);
              this.$Modal.confirm({
                title: '确认对话框标题',
                content: '确认要删除吗删除后将无法恢复',
                onOk: () => {
                  this.getDeletingKnowledge(arr)
                },
                onCancel: () => {

                }
              });
              break
          }
        }

      },
      switchQuestionPoint(index){
          // tab切换
        switch (index) {
          case 0: {
            this.questionPoint = true;
            break
          }
          case 1: {
            this.questionPoint = false;
            break
          }

        }
      },
      viewJump(){
        this.$router.push({
          path: "/knowledgeBaseIndex"
        })
      },
      addJump(){
          // 添加跳转
        let add = 0;
        if (this.questionPoint) {
          this.$router.push({
            path: "/addQuestion",
            query: {
              id: this.knowledgeBaseId,
              name: this.knowledgeBaseName,
              identification: add++
            }
          })
        } else {
          this.$router.push({
            path: "/addKnowledge",
            query: {
              id: this.knowledgeBaseId,
              name: this.knowledgeBaseName
            }
          })

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
          this.getKnowledgeList();
        }
      },
      beforeEditName(treeId, treeNode){
        //编辑状态前
        let zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        zTree.editName(treeNode);
        return false;
      },
      //删除确认
			confirm() {
				this.$Modal.confirm({
					//                  title: '确认对话框标题',
					content: '<p>确认要删除吗</p><p>删除后将无法恢复</p>',
					onOk: () => {
						this.deleteItem(projectId)
						//this.$Message.info('点击了确定');
					},
					onCancel: () => {
						//this.$Message.info('点击了取消');
					}
				});
			},
      beforeRemove(treeId, treeNode){
        //删除节点之前的回掉函数
        let zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        return confirm("确认删除-- " + treeNode.name + " 吗？");
      },
      onRemove(e, treeId, treeNode){
        console.log(treeNode, "id")
        this.$Message.success("删除成功,请点保存")
//        this.getRemoveNode(treeNode.id)
//        confirm("你已删除" + treeNode.name)
      },
      //编辑树节点名称
      beforeRename(treeId, treeNode, newName, isCancel){
        // 编辑名称下--失去焦点或者enter的回调
        console.log(treeNode,"hisa")
        treeNode.isModify = true;
        if (newName.length == 0) {
          let zTree = $.fn.zTree.getZTreeObj("treeDemo");
          zTree.cancelEditName();
          this.$Message.info("修改节点不能为空")
          return false;
        } else {
        	this.getPreservationNode();
          //this.$Message.info("修改成功,请点保存")
          return true;
        }

      },
      onRename(e, treeId, treeNode, isCancel){
        // 捕获节点编辑名称结束之后的事件回调函数
      },
      showRemoveBtn(treeId, treeNode){
        return !treeNode.isFirstNode;
      },
      showRenameBtn(treeId, treeNode){
        return !treeNode.isLastNode;
      },
      addHoverDom(treeId, treeNode){
        // 鼠标移动的节点时，添加按钮
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
          + "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
          var zTree = $.fn.zTree.getZTreeObj("treeDemo");
          var temp=zTree.addNodes(treeNode, {id: null, pId: treeNode.id, name: "请输入",isModify:true});
//          var node = zTree.getNodeByParam("id", temp[0].id, null); //根据新的id找到新添加的节点
//          zTree.selectNode(node);
//          zTree.editName(node);
//          console.log(temp,"2dad");
          return false;
        });
      },
      removeHoverDom(treeId, treeNode){
        $("#addBtn_" + treeNode.tId).unbind().remove();
      }
    },
    components: {
      "v-bounces": bounces
    },
    activated(){
      this.iableQuestion = this.$route.query.iableQuestion;
      this.iableKnowledeg = this.$route.query.iableKnowledeg
      this.knowledgeBaseId=this.$route.query.id;
    },
    mounted(){
      let _this = this;
      this.$nextTick(function () {
        _this.getDefaultLoad();
        _this.getQuestionList();
        _this.getKnowledgeList();
        _this.getKnowledgeList();
        $.fn.zTree.init($("#treeDemo"), _this.setting, _this.zNodes);
      })

    },
    watch: {
      "iableQuestion"(){
        this.getQuestionList();
      },
      "iableKnowledeg"(){
        this.getKnowledgeList();
      },
      "knowledgeBaseId"(){
         this.getDefaultLoad();
      }
    },
    created(){
        if(this.$route.query.status){
          this.questionPoint=false;
        }else{
          this.questionPoint=true;
        }

    }
  }
</script>
<style lang="scss">
  @import "../../../static/css/zTreeStyle/zTreeStyle.css";
  i{
    font-style: normal;
  }
  .ivu-row{
  	white-space: nowrap;
  }
  .Dividing {
    color: #E9E9E9;
  }
  .span {
    display: inline-block;
    text-align: center;
    vertical-align: bottom;
    &.smallActive {
      background: #108EE9;
      color: #fff;
    }
    &.baseActive {
      color: #000;
      background: #fff;
      border: 1px solid #ccc;
    }
  }

  .base-wrap {
    width: 100%;
  }

  .baseNameHeader {
    padding: 20px 0 30px;
  }

  .baseKeyPoints {
    text-align: right;
  }

  .baseNameContent {
    width: 100%;
    overflow: hidden;
    padding-top: 20px;
  }

  .baseNameLeft {
    float: left;
    position: relative;
    width: 20%;
    border: 1px solid #ccc;
    height: 600px;
    .baseNameSearch {
      width: 100%;
      padding: 10px;
      position: relative;
      input {
        width: 100%;
        color: #9fa9b2;
        height: 35px;
      }
      span {
        position: absolute;
        cursor: pointer;
        top: 16px;
        z-index: 2;
        right: 13px;
      }
      img {
        width: 22px;
        height: auto;
      }
    }
    .zTreeDemoBackground {
      width: 100%;
      height: 350px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    p {
      width: 99.9%;
      line-height: 40px;
      text-align: center;
      background: rgb(244, 244, 244);
      border-bottom: 1px solid #ccc;
    }
    .baseNameAdd {
      position: absolute;
      width: 100%;
      bottom: 100px;
      text-align: center;
      span {
        display: inline-block;
        
      }
    }
  }

  .baseNameRight {
    padding-left: 20px;
    width: 77%;
    float: left;
    height: 600px;
    .inputHeadings {
      display: inline-block;
      vertical-align: bottom;
      width: 100px;
      height: 31px;
    }
    #problems {
      &.ivu-select-single .ivu-select-selection {
        width: 180px;
        height: 32px;
      }
    }
    #status {
      &.ivu-select-single .ivu-select-selection {
        width: 160px;
        height: 32px;
      }
    }
    #answer {
      &.ivu-select-single .ivu-select-selection {
        width: 140px;
        height: 32px;
      }
    }
    #derivation {
      &.ivu-select-single .ivu-select-selection {
        width: 100px;
        height: 32px;
      }
    }
  }

  .table {
    margin-top: 30px;
    a{
    	color: #108EE9;
    }
  }

  .bouncesContent {
    width: 600px;
    height: 550px;
    background: #fff;
    border-radius: 10px;
    .bouncesHeader {
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      border-bottom: 1px #f0f0f0 solid;
      line-height: 60px;
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
      padding-bottom: 30px;
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
      margin-top: 30px;
      width: 100%;
      display: flex;
      justify-content: center;
      p {
        text-align: center;
      }
    }
  }
</style>
