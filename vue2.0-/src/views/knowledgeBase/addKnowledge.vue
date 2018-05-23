<template>
  <div class="knowledge-warp">
    <Row class="knowledge-header">
      <Col span="24">
      <span class="h42" @click="viewJump(0)">知识库/</span>
      <span class="h42" @click="viewJump(1)">{{ knowledgeBaseName}}/</span>
      <span class="h41">{{identification.titleText}}</span>
      </Col>
    </Row>
    <div class="knowledge-content">
      <div class="knowledge-name">
        <p class="information-xs">知识点标题<i style="color: red">*</i>：</p>
        <input type="text" placeholder="请输入" v-model="knowledge.headings">
      </div>
      <div class="knowledge-name areaContent">
        <p class="information-xs">知识点内容：</p>
        <div class="knowledge-area">
          <div v-for="(item,index) in knowledge.content" :key="index">
            <textarea cols="30" rows="4" placeholder="请输入" v-model="item.value"></textarea>
            <span @click="delimiters(index)" class="iconSpan"><i data-v-0c04591f="" class="icon iconfont icon-retract"></i></span>
            <span @click="add()" v-if="index===(knowledge.content.length-1)" class="iconSpan"><i data-v-0c04591f="" class="icon iconfont icon-spread"></i></span>
          </div>
        </div>
      </div>
      <div class="knowledge-name">
        <p class="information-xs">所属分类<i style="color: red">*</i>：</p>
        <span @click="relatedKnowledge()" class="knowledgeType">{{parentQuestion.name}}</span>
      </div>
      <div class="knowledge-name">
        <p class="information-xs">相关问题：</p>
        <div class="knowledge-question">
          <span class="span" @click="addQuestion(0)" :class="{spanActive:toggelQuestion}">添加新问题</span>
          <span class="span" @click="addQuestion(1)" :class="{spanActive:!toggelQuestion}">关联已有问题</span>
        </div>
      </div>
      <div class="knowledge-name">
        <p class="information-xs">有效期设置：</p>
        <div class="knowledge-item">
          <span class="spanBtn smallBtnDefalt" @click="enablement(0)" :class="{'enablementActive':enablementStatus}">启用</span>
          <span class="spanBtn smallBtnDefalt" @click="enablement(1)" :class="{'enablementActive':!enablementStatus}">停用</span>
        </div>
        <div class="knowledge-radio">
          <Radio-group v-model="validity.enablement">
            <Radio label="永久有效"> </Radio>
            <Radio label="自定义有效期"> </Radio>
          </Radio-group>
          <Date-picker type="daterange"
                       v-if="question.validity===0"
                       format="yyyy-MM-dd"
                       placement="bottom-start"
                       v-model="validity.callTime"
                       placeholder="选择日期"></Date-picker>
          </Col>
        </div>
      </div>
      <Row>
        <Col span="7" class="sumbitBtn">
          <span class="smallBtn2 spanBtn" @click="submit()">提交</span>
        </Col>
      </Row>
    </div>
    <v-bounces v-if="bouncesHide" @emitClickPopup="bouncesHide=false">
      <v-associated @shutDown="bouncesHide=false"
                    :knowledgeBaseId="knowledgeBaseId"
                    @preservationKnowledge="preservationKnowledge()"
                    questionAndknowledge="knowledge"
                    :points="knowledge.poin"
                    @addquest="addquest($event)"
                    :title="associatedTitle">

      </v-associated>
    </v-bounces>
    <v-bounces v-if="problems.hide"  @emitClickPopup="problems.hide=false">
      <v-addNewProblems
        @succeedBit="succeedBit($event)"
        @shutDown="problems.hide=false"></v-addNewProblems>
    </v-bounces>
    <v-bounces v-if="questionTypeHide" @emitClickPopup="questionTypeHide=false">
      <v-questionType @shutDown="questionTypeHide=false"
                      :knowledgeBaseId="knowledgeBaseId"
                      :nodeClassId="parentQuestion.classId"
                      @determine="determine()"
                      @beforeClick="beforeClick($event)"></v-questionType>
    </v-bounces>
  </div>
</template>
<script>
  import bounces from "@/components/btm-bounces.vue"
  import associated from "./associated.vue"
  import addNewProblems from "./addNewProblems.vue"
  import questionType from "./questionType.vue"
  export default{
    data () {
      return {
        status: true,
        enablementStatus:true,
        parentQuestion: {
          name: "选择所有问题分类",
          classId: null,
          label: ""
        },
        identification: {  // 添加和修改的标识
          add: null,
          titleText: "添加知识点",
          iable: 0
        },
        buildKnowledgeId:this.$route.query.buildKnowledgeId,//知识点id
        knowledgeBaseName: this.$route.query.name,     // 知识库名称
        knowledgeBaseId: this.$route.query.id,      // 知识库id
        associatedTitle:"关联已有问题",
        questionTypeHide: false,
        bouncesHide:false,
        problems:{
            hide:false
        },
        toggelQuestion: true,
        question: {
          id:null,
          labelling: "",
          classification: "",
          state: 1,
          validity: 1,
          points: [],
          category: null,
          list: [
            {
              name: "问题分类1",
              id: "1"
            },
            {
              name: "问题分类2",
              id: "2"
            }
          ],
          similarity: [""]
        },
        knowledge: {
          headings:"",
          ids:[],
          classification: "",
          content:[
            {
                value:""
            }
          ],
          list: [
            {
              name: "全部",
              id: "1"
            },
            {
              name: "一半",
              id: "2"
            },
          ]
        },
        validity:{
          enablement:"永久有效",
          callTime:null
        }
      }
    },
    components:{
      "v-bounces":bounces,
      "v-associated":associated,
      "v-addNewProblems":addNewProblems,
      "v-questionType": questionType
    },
    methods: {
      getQuestionParticulars(){
        // 修改回填--
        let arr=[],categoryVos=[];
        if(this.buildKnowledgeId){
          this.axios.post("/knowledPoint/pointDetail.do",{
            "pointId":this.buildKnowledgeId
          }).then((res) => {
            if (res.data.code === "0") {
              this.knowledge.headings=res.data.data.knowledgePoint?res.data.data.knowledgePoint.point:"";
              this.knowledge.content=res.data.data.contents.length>0?res.data.data.contents:[{value:""}];
              this.validity.enablement=res.data.data.knowledgePoint&&res.data.data.knowledgePoint.validity===1?"永久有效":"自定义有效期";
              this.question.state=res.data.data.knowledgePoint&&res.data.data.knowledgePoint.state?res.data.data.knowledgePoint.state:null;//启用停用
              arr.push(res.data.data.knowledgePoint.validityStart);
              arr.push(res.data.data.knowledgePoint.validityEnd);
              this.validity.callTime=arr.length>0?arr:null;// 自定义时间
              this.parentQuestion.classId = res.data.data.knowledgePoint.category?res.data.data.knowledgePoint.category:null; // 类别id
              this.knowledge.poin = res.data.data.questionIds;
              res.data.data.knowledgePoint.categoryVos.map((item)=>{
                categoryVos.push(item.name)
              });
              this.parentQuestion.name=categoryVos.join("=>")
            } else {
             return
            }
            console.log(res, "问题详情成功121212")
          }).catch((err) => {
            console.log(err, "问题详情shib")
          })
        }else{
            return
        }

      },
      getModification(content){
        // 修改知识点
        this.identification.iable++;
        this.axios.post("/knowledPoint/updatePoint.do", {
          "id":this.buildKnowledgeId,
          "point": content.point,//知识点表一
          "category": content.category?content.category:this.parentQuestion.classId,//类别
          "contents":content.contents,
          "questionPointRelevances":content.questionPointRelevances,
          "knowledgeBaseId": this.knowledgeBaseId,
          "state": content.state,
          "validity": content.validity,
          "validityStart": content.validityStart,
          "validityEnd": content.validityEnd
//          "similarQuestion": content.similarQuestion,
//          "foreignAnswer": content.foreignAnswer,
//          "internallyAnswer": content.internallyAnswer
        }).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success({
              content: "修改成功",
              duration: 0.5,
              onClose: () => {
                window.sessionStorage.removeItem("correlateQuestionList");
                this.$router.push({
                  path: "/knowledgeBaseName",
                  query: {
                    id: this.knowledgeBaseId,
                    iableKnowledeg: this.identification.iable,
                    status:true
                  }
                })
              }
            })
          } else {
            return;
          }
          console.log(res, "知识库修改列表")
        }).catch((err) => {
          console.log(err, "知识库修改s列表111")
        })
      },
      getAddKnowledge(content){
        this.identification.iable++;
        // 添加提交
        this.axios.post("/knowledPoint/addPoint.do", {
          "point": content.point,//知识点表一
          "category": content.category,//类别
          "contents":content.contents,
          "questionPointRelevances":content.questionPointRelevances,
          "knowledgeBaseId": this.knowledgeBaseId,
          "state": content.state,
          "validity": content.validity,
          "validityStart": content.validityStart,
          "validityEnd": content.validityEnd
        }).then((res) => {
          if (res.data.code === "0") {
            this.$Message.success({
              content: "提交成功",
              duration: 0.5,
              onClose: () => {
                window.sessionStorage.removeItem("correlateQuestionList");
                this.$router.push({
                  path: "/knowledgeBaseName",
                  query: {
                    id: this.knowledgeBaseId,
                    iableKnowledeg: this.identification.iable,
                    status:true
                  }
                })
              }
            })
          } else {
            return;
          }
          console.log(res, "知识库问题列表")
        }).catch((err) => {
          console.log(err, "知识库问题列表111")
        })
      },
      relatedKnowledge(){
          // 所属分类启动弹框
          this.questionTypeHide=true;
      },
      beforeClick(e){
        // 问题分类节点点击
        let nodeArr = [];
        let question = [];
        this.question.category = e.treeNode.id;
        this.parentNode(e.treeNode, nodeArr);
        for (let i = nodeArr.length - 1; i >= 0; i--) {
          question.push(nodeArr[i])
        }
        this.parentQuestion.label = question.length > 1 ? question.join("=>") : question.join();
      },
      parentNode(t, arr){
        arr.push(t.name);
        if (t.level != 0) {
          // 递归
          this.parentNode(t.getParentNode(), arr)
        }
      },
      preservationKnowledge(){
        // 组件传过来的事件-保存
        this.bouncesHide = false;
      },
      succeedBit(e){
        this.question.points.push(e);
        this.problems.hide=false;
      },
      determine(){
        // 确定按钮
        this.questionTypeHide = false;
        this.parentQuestion.name = this.parentQuestion.label;
      },
      submit(){
          let arr=[];
          if(this.validity.callTime){
            if(typeof this.validity.callTime[0]==="number"){
              arr.push(new Date(this.validity.callTime[0]));
              arr.push(new Date(this.validity.callTime[1]));
              this.validity.callTime=arr;
            }
          }

        let content = {
          point: this.knowledge.headings,//知识点问题
          category: this.question.category,//类别
          questionPointRelevances: this.question.points,// 关联知识点id
          contents:this.knowledge.content,   // 知识点内容
//          similarQuestion: this.question.similarity,//相似问题
//          foreignAnswer: this.foreign.answer,//对外答案
//          internallyAnswer: this.internal.answer,//对内答案
          state: this.question.state?this.question.state:1,// 启用停用
          validity: this.question.validity, // 永久、自定义
          validityStart: this.validity.callTime ? Date.parse(this.validity.callTime[0]) : null,//开始时间
          validityEnd: this.validity.callTime ? Date.parse(this.validity.callTime[1]) : null //结束时间
        };
        console.log(content.validityStart,"有没有值2")
        console.log(content.validityEnd,"有没有值3")
        if(this.buildKnowledgeId){
          this.getModification(content)
        }else{
          window.sessionStorage.removeItem("correlateList")
          this.getAddKnowledge(content)
        }

      },
      addquest(list){
        if (list.length > 0) {
          let arr = [];
          list.map(function (item) {
            arr.push(item.id)
          });
          this.question.points = arr;
          this.bouncesHide = false;
        } else {
          this.$Message.info("请选择关联")
        }
      },
      addQuestion(index){
        switch (index) {
          case 0: {
              this.problems.hide=true;
              this.toggelQuestion=true;
            break
          }
          case 1: {
            this.bouncesHide=true;
            this.toggelQuestion=false;
            break
          }
        }
      },
      enablement(index){
        switch (index) {
          case 0: {
            this.enablementStatus = true;
            this.question.state = 1;
            break
          }
          case 1: {
            this.enablementStatus = false;
            this.question.state = 2;
            break
          }
        }
      },
      add(){
          let arr={value:""};
          this.knowledge.content.push(arr)
      },
      viewJump(index){
        switch (index) {
          case 0: {
            this.$router.push({
              path: "/knowledgeBaseIndex"
            });
            break
          }
          case 1: {
            this.$router.push({
              path: "/knowledgeBaseName",
              query: {
                id: this.knowledgeBaseId,
                status:true
              }
            });
            break
          }
        }

      },
      delimiters(index){
          if( this.knowledge.content.length>1){
            this.knowledge.content.splice(index,1)
          }else{
              this.$Message.info("不能再删了")
          }

      }
    },
    mounted(){
        this.$nextTick(()=>{
          this.getQuestionParticulars();
        });
    },
    created(){
      if(this.buildKnowledgeId){
        this.identification.titleText="修改知识点";
      }else{
        this.identification.titleText="添加知识点";
      }
    },
    activated(){
      this.buildKnowledgeId=this.$route.query.buildKnowledgeId;
    },
    watch:{
      buildKnowledgeId(v){
        if(v){
          this.getQuestionParticulars();
        }else {
          this.knowledge.headings="";
          this.knowledge.content=[{name:""}];
          this.parentQuestion.classId=null;
          this.knowledge.poin="";
        }
      },
      "validity.enablement"(v){
        switch (v) {
          case "永久有效": {
            this.question.validity = 1;
            break
          }
          case "自定义有效期": {
            this.question.validity = 0;
            break
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped="scoped">
  .knowledge-warp {
    width: 100%;
  }

  .knowledge-header {
    padding: 20px 0 30px 0;
  }
  .spanBtn{
    display: inline-block;
    text-align: center;
    margin-left: 10px;
    &.enablementActive{
      background: #108EE9;
      color: #fff;
    }
  }
  .sumbitBtn{
    padding-left: 93px;
  }
  .span {
    display: inline-block;
    text-align: center;
    color: #0a6fc1;
    cursor: pointer;
    margin-left: 10px;
    &.spanActive {
      background: #0a6fc1;
      color: #fff;
      border-radius: 5px;
      padding: 5px 10px;
    }
  }

  .knowledge-content {
    width: 100%;
    padding-left: 200px;
    padding-top: 20px;
    .knowledge-name {
      padding-bottom: 30px;
      .knowledgeType{
        color: #0a6fc1;
        font-size: 14px;
        cursor: pointer;
      }
      p {
        display: inline-block;
        text-align: right;
        width: 100px;
        line-height: 30px;
        vertical-align: top;
      }
      input {
        width: 230px;
      }
      .knowledge-area {
        display: inline-block;
        span {
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
        }
        .iconSpan{
          margin-left: 5px;
        }
      }
      .knowledge-question {
        display: inline-block;
        .enablement{
          display: inline-block;
          text-align: center;
        }
      }
      .knowledge-item{
        display: inline-block;
      }
      .knowledge-radio{
        margin-top: 10px;
        padding-left: 103px;
      }
    }
  }
</style>
