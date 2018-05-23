<template>
  <!--这个是关联问题和关联知识点的组件-->
  <div class="associated-warp">
    <div class="associated-title">
      <span style="font-size: 14px;font-weight: bolder;">问题分类</span>
      <span class="icon-span" @click="$emit('shutDown')"><i class="icon iconfont icon-Delete"></i></span>
    </div>
    <div class="associated-content">
      <div class="content-left">
        <div class="zTreeDemoBackground left">
          <ul id="question" class="ztree" ref="ztree"></ul>
        </div>
      </div>
      <div class="content-preservation">
        <span class="smallBtn2 span" @click="$emit('determine')">确定</span>
      </div>
    </div>
    <!--<Row>-->
      <!--<Col span="24">-->
       <!---->
      <!--</Col>-->
    <!--</Row>-->
  </div>
</template>
<script>
  let newCount = 1;
  export default{
    props:["knowledgeBaseId","nodeClassId"],
    data () {
      return {
        check: {
          all: false,
          single: false,
          stayList: []
        },
        zNodes: [],
        setting: {
          view: {
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
        }
      }
    },
    methods: {
      getCategoryList(){
          // 树状图加载
        let zTree = $.fn.zTree.getZTreeObj("question");
        this.axios.get("/knowledge/category/list/" + this.knowledgeBaseId + ".do", {}).then((res) => {
          if (res.data.code === "0") {
            zTree.addNodes(null, res.data.data.value);
            let selNode = zTree.getNodeByParam("id", this.nodeClassId, null);
            zTree.selectNode(selNode,false,true);
          }
        }).catch((err) => {
        })
      },
      beforeDrag(treeId, treeNodes){
        // 禁止节点拖拽
        return false;
      },
      beforeClick(treeld, treeNode, clickFlag){
        // 点击节点
        this.$emit("beforeClick",{
          treeld:treeld,
          treeNode:treeNode,
          clickFlag:clickFlag
        })
      },
      showRemoveBtn(treeId, treeNode){
        return !treeNode.isFirstNode;
      },
      showRenameBtn(treeId, treeNode){
        return !treeNode.isLastNode;
      },
      add(){
        // 添加
        this.$emit("addKnowledge");
      },
      preservation(){
        // 保存
        this.$emit("preservationKnowledge");
      }
    },
    created(){
    },
    mounted(){
        this.$nextTick(()=>{
          $.fn.zTree.init($("#question"), this.setting, this.zNodes);
          this.getCategoryList();
        });
    }
  }
</script>
<style lang="scss" scoped="scoped">
  @import "../../../static/css/zTreeStyle/zTreeStyle.css";
  .associated-warp {
    width: 500px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }

  .associated-title {
    height: 40px;
    padding: 0 15px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
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

  .content-left {
    float: left;
    position: relative;
    width: 100%;
    height: 400px;
    overflow-y: auto;
  }

  .content-right {
    padding-left: 20px;
    width: 70%;
    float: left;
    height: 400px;
  }
  .content-preservation{
    width: 100%;
    text-align: center;
    .span {
      display: inline-block;
      text-align: center;
    }
  }

</style>
