<template>
  <div class="xfromMgt-wrap">
  	<v-bounces v-show="newxform">
  	<div class="iframexform">
  		<div class="cancelHeder"><span class="cancelbtn" @click="cancelbtn"><img src="../../image/cancel.png" /></span></div>
    <iframe :src="xformsrc" width="100%" height="95%" scrolling="yes" frameborder="0"></iframe>
  	</div>
  	</v-bounces>
    <div class="xfromMgt-container">
        <div class="xfromMgt-leftDiv">
        <div id="xfromMgt-left" class="xfromMgt-left">
          <div class="xfromMgt-leftHeader">
            <div class="xfromMgt-button">
              <Button class="m10" type="ghost" @click="deleteTreeInfo">删除</Button>
              <Button class="m10" type="ghost" @click="modifyTreeInfo">修改</Button>
              <Button class="m10" type="ghost" @click="addTreeInfo">新增</Button>
            </div>
          </div>
          <div class="xfromMgt-letRow">
            <span>xform分类</span>
          </div>
          <div id="xfromMgt-tree" class="xfromMgt-tree">
            <div style="border-top: 1px solid #ccc;">
              <Tree  @on-select-change="selectedClick" :data="menuDataTree" :fields="treeFields"></Tree>
            </div>
          </div>
        </div>
      </div>
      <div class="xfromMgt-rightDiv">
        <div id="xfromMgt-right" class="xfromMgt-right">
          <div class="xfromMgt-header">
            <div class="xfromMgt-select">
              <Form
                ref="formSearch"
                :model="formSearch"
                :inline="true"
                :label-width="80"
              >
                <!--<Row style="text-align: center;">
                  <Col span="7">-->
                <!--<Form-item label="子站：" prop="siteCode">-->
                  <!--<Select-->
                    <!--v-model="formSearch.siteCode"-->
                    <!--style="text-align: left; width: 160px;">-->
                    <!--<Option value="">&#45;&#45;请选择&#45;&#45;</Option>-->
                    <!--<Option v-for="(item,index) in sitesList" :value="item.id" :key="index">{{ item.name }}</Option>-->
                  <!--</Select>-->
                <!--</Form-item>-->
                <!-- </Col>
                 <Col span="7">-->
                <Form-item label="表单编码：" prop="formCodePrefix">
                  <Input v-model="formSearch.formCodePrefix" class="formAcr"></Input>
                </Form-item>
                <!--</Col>
                <Col span="7">-->
                <Form-item label="表单状态：" prop="states" id="formMgt">
                  <Select
                    v-model="formSearch.states"
                    style="text-align: left; width: 160px;">
                    <Option value="">--请选择--</Option>
                    <Option value="1">未发布</Option>
                    <Option value="3">已发布</Option>
                  </Select>
                </Form-item>
                <!-- </Col>
                 <Col span="3" style="text-align: right;">-->
                <Button type="ghost" @click="goOut" class="quit" style="margin-left: 15px;">退出</Button>

                <Button type="ghost" @click="queryInfo">查询</Button>
                <!--</Col>
            </Row>-->
              </Form>

            </div>
            <div class="xfromMgt-row">
              <div class="xfromMgt-button">
                <Button class="m10" @click="addxFormInfo" type="primary">新增表单</Button>
                <!--<Button type="ghost" v-if="showPublish" class="m10" @click="copyFormUrl" id="formUrl">拷贝form地址</Button>-->
                <Button type="ghost" @click="previewFormInfo" class="m10">预览</Button>
                <Button type="ghost" v-if="show" @click="deletexFormInfo" class="m10">删除</Button>
                <Button type="ghost" v-if="show" class="m10" @click="publishFormInfo">发布</Button>
                <Button type="ghost" v-if="show" class="m10" @click="modifyxFormInfo">表单修改</Button>
                <!--<Button type="ghost" @click="copyxFormInfo" class="m10">表单复制</Button>-->
                <Button type="ghost" v-if="show" class="m10" @click="xFormDesign">表单设计</Button>
              </div>
            </div>
          </div>
          <div id="xfromMgt-info" class="xfromMgt-info">
            <Table  :highlight-row="true" @on-row-click="rowClick" :columns="columnsName" :data="dataInfo"></Table>
          </div>
          <div class="ut-xfromMgtpage">
            <Page :total="totalCount" show-total :current="pageindex" :page-size="pagesize" @on-change="pageChange"
                  show-elevator @on-page-size-change="pageSizeChange" placement="top" style="float: right"></Page>
          </div>
        </div>
      </div>
      <!--tree增删改(begin)-->
      <Modal v-model="addTreeFormVisiable" width="400"
             title="增加类别" class="xfromMgt-model">
        <Form :model="addTreeForm" ref="addTreeForm" :rules="addTreeFormRules" :label-width="100">
          <Form-item label="分类名称：" prop="name">
            <Input placeholder="请输入分类名称" v-model="addTreeForm.name"></Input>
          </Form-item>
          <Form-item label="分类描述：">
            <Input type="textarea" placeholder="分类描述..." v-model="addTreeForm.description"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="addTreeSubmit" size="large">确定</Button>
          <Button @click="addTreeFormVisiable = false" size="large">取消</Button>
        </div>
      </Modal>
      <Modal v-model="delTreeFormVisiable"
             title="确认删除提示" class="tenant-model">
        <Form :model="delTreeForm" ref="delTreeForm" :label-width="0">
          <p>确定要删除【<span style="color: red; font-weight: bold;">{{this.delTreeForm.name}}</span>】吗？</p>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="delTreeSubmit" size="large">确定</Button>
          <Button @click="delTreeFormVisiable = false" size="large">取消</Button>
        </div>
      </Modal>
      <Modal v-model="modifyTreeFormVisiable" width="400"
             title="修改类别" class="xfromMgt-model">
        <Form :model="modifyTreeForm" ref="modifyTreeForm" :rules="modifyTreeFormRules" :label-width="100">
          <Form-item label="分类名称：" prop="name">
            <Input placeholder="请输入分类名称" v-model="modifyTreeForm.name"></Input>
          </Form-item>
          <Form-item label="分类描述：" >
            <Input type="textarea" placeholder="分类描述..." v-model="modifyTreeForm.description"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="modifyTreeSubmit" size="large">确定</Button>
          <Button @click="modifyTreeFormVisiable = false" size="large">取消</Button>
        </div>
      </Modal>
      <!--tree增删改(end)-->
      <!--表单增删改(begin)-->
      <Modal v-model="addxFormVisiable" width="430"
             title="表单信息" class="xfromMgt-model" :styles="{top: '50px'}">
        <Form :model="addxForm" ref="addxForm" :rules="addxFormRules" :label-width="100">
          <Form-item label="表单编码：" prop="formCode">
            <Input placeholder="请输入表单编码" v-model="addxForm.formCode" ></Input>
          </Form-item>
          <Form-item label="表单标题：" prop="formTitle">
            <Input placeholder="请输入表单标题" v-model="addxForm.formTitle" ></Input>
          </Form-item>
          <Form-item label="分类选择：" prop="classifyId">
            <div class="tree-select">
              <TreeSelect
                :data="dataTreebackfill"
                :width="250"
                @on-select-change="getNodeAdd"
                :placeholder="formPlaceholder"
                :fields="treeFields">
              </TreeSelect>
            </div>
          </Form-item>
          <Form-item label="功能描述：" >
            <Input type="textarea" placeholder="功能描述..." v-model="addxForm.remark" ></Input>
          </Form-item>
          <!--<Form-item label="子站选择：" prop="siteCode">
            <Select transfer
                    v-model="addxForm.siteCode"
                    style="width: 250px;">
              <Option v-for="(item,index) in sitesList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="是否建表：" prop="ifCreatDataTable">
            <Select transfer v-model="addxForm.ifCreatDataTable"
                    style="text-align: left; width: 250px; ">
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          </Form-item>-->
        </Form>
        <div slot="footer">
          <Button type="primary" @click="addxFormSubmit" size="large">确定</Button>
          <Button @click="addxFormVisiable = false" size="large">取消</Button>
        </div>
      </Modal>
      <Modal v-model="delxFormVisiable"
             title="确认删除提示" class="tenant-model">
        <Form :model="delxForm" ref="delxForm" :label-width="0">
          <p>确定要删除【<span style="color: red; font-weight: bold;">{{this.delxForm.formTitle}}</span>】吗？</p>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="delxSubmit" size="large">确定</Button>
          <Button @click="delxFormVisiable = false" size="large">取消</Button>
        </div>
      </Modal>
      <!-- 修改表单 -->
      <Modal v-model="modifyxFormVisiable" width="430"
             title="表单修改" class="xfromMgt-model" :styles="{top: '50px'}">
        <Form :model="modifyxForm" ref="modifyxForm" :rules="modifyxFormRules" :label-width="100">
          <Form-item label="表单编码：" prop="formCode">
            <Input placeholder="请输入表单编码" v-model="modifyxForm.formCode" ></Input>
          </Form-item>
          <Form-item label="表单标题：" prop="title">
            <Input placeholder="请输入表单标题" v-model="modifyxForm.formTitle" ></Input>
          </Form-item>
          <Form-item label="分类选择：" prop="classifyId">
            <div class="tree-select">
              <TreeSelect
                :data="dataTreebackfill"
                :width="250"
                @on-select-change="getNodeModify"
                :placeholder="formPlaceholder"
                :fields="treeFields">
              </TreeSelect>
            </div>
          </Form-item>
          <Form-item label="功能描述：" >
            <Input type="textarea" placeholder="功能描述..." v-model="modifyxForm.remark" ></Input>
          </Form-item>
          <!--<Form-item label="子站选择：" prop="siteCode">-->
            <!--<Select transfer-->
                    <!--v-model="modifyxForm.siteCode"-->
                    <!--style="text-align: left; width: 250px; ">-->
              <!--<Option v-for="(item,index) in sitesList" :value="item.id" :key="index">{{ item.name }}</Option>-->
            <!--</Select>-->
          <!--</Form-item>-->
          <!--<Form-item label="是否建表：" prop="ifCreatDataTable">-->
            <!--<Select transfer v-model="modifyxForm.ifCreatDataTable"-->
                    <!--style="text-align: left; width: 250px; ">-->
              <!--<Option value="1">是</Option>-->
              <!--<Option value="0">否</Option>-->
            <!--</Select>-->
          <!--</Form-item>-->
        </Form>
        <div slot="footer">
          <Button type="primary" @click="modifyxFormSubmit" size="large">确定</Button>
          <Button @click="modifyxFormVisiable = false" size="large">取消</Button>
        </div>
      </Modal>
      <!--表单复制-->
      <Modal v-model="copyxFormVisiable" width="430"
             title="表单复制" class="xfromMgt-model" :styles="{top: '50px'}">
        <Form :model="copyxForm" ref="copyxForm" :rules="copyxFormRules" :label-width="100">
          <Form-item label="表单编码：" prop="formCode">
            <Input placeholder="请输入表单编码" v-model="copyxForm.formCode" ></Input>
          </Form-item>
          <Form-item label="表单标题：" prop="title">
            <Input placeholder="请输入表单标题" v-model="copyxForm.formTitle" ></Input>
          </Form-item>
          <Form-item label="分类选择：" prop="classifyId">
            <div class="tree-select">
              <TreeSelect
                :data="dataTreebackfill"
                :width="250"
                @on-select-change="getNodeCopy"
                :placeholder="formPlaceholder"
                :fields="treeFields">
              </TreeSelect>
            </div>
          </Form-item>
          <Form-item label="功能描述：" >
            <Input type="textarea" placeholder="功能描述..." v-model="copyxForm.remark" ></Input>
          </Form-item>
          <Form-item label="子站选择：" prop="siteCode">
            <Select transfer
                    v-model="copyxForm.siteCode"
                    style="text-align: left; width: 250px; ">
              <Option v-for="(item,index) in sitesList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </Form-item>
          <!--<Form-item label="是否建表：" prop="ifCreatDataTable">-->
            <!--<Select transfer v-model="copyxForm.ifCreatDataTable"-->
                    <!--style="text-align: left; width: 250px; ">-->
              <!--<Option value="1">是</Option>-->
              <!--<Option value="0">否</Option>-->
            <!--</Select>-->
          <!--</Form-item>-->
        </Form>
        <div slot="footer">
          <Button type="primary" @click="copyxFormSubmit" size="large">确定</Button>
          <Button @click="copyxFormVisiable = false" size="large">取消</Button>
        </div>
      </Modal>
      <!--表单增删改(end)-->
    </div>
  </div>
</template>
<script>
	import bounces from "@/components/btm-bounces.vue"
  import querystring from 'querystring'
  import uuid from '../../../static/js/uuid.js'
  import * as Clipboard from '../../../static/js/clipboard.js'
  export default {
    data () {
      return {
        /**----------限制删除的多次提交(begin)----------**/
        delFlag: true,
        /**----------限制删除的多次提交(end)----------**/
        /**----------tree默认数据(begin)----------**/
        XformbaseUrl:'http://106.12.21.251:9022',
        xformToken:'xformToken-d465a6e2f44211e78cfafa163ec422c5',
        dataTree: [],
        dataTreebackfill:[],
        menuDataTree: [],
        treeSelectID:'',
        treeSelectName:'',
        xformsrc:'',
        isPaper:'0',
        newxform:false,
        treeFields: [
          {field: "name", map: "title"},
          {field: "child", map: "children"}
        ],
        addTreeFormVisiable:false,
        addTreeForm:{
          name:'',
          description:''
        },
        addTreeFormRules: {
          name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
        },
        modifyTreeFormVisiable:false,
        modifyTreeForm:{
          name:'',
          description:''
        },
        modifyTreeFormRules: {
          name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
        },
        delTreeFormVisiable:false,
        delTreeForm:{
          name:'',
          id:''
        },
        /**----------tree默认数据(end)----------**/
        /**----------表单列表默认数据(begin)----------**/
        formSearch: {
          formCodePrefix: '',
          siteCode: '',
          states:''//是否已发布
        },
        sitesList:[],
        editRow: -3,
        columnsName: [
//          {
//            title: '所属子站',
//            key: 'sitename'
//          },
          {
            title: '表单编码',
            key: 'formCode'
          },
          {
            title: '表单标题',
            key: 'formTitle'
          },
          {
            title: '数据表名',
            key: 'dataTableName'
          },
          {
            title:'创建时间',
            key:'formatCreatetime'
          },
          {
            title:'状态',
            key:'state',
            width:'100'
          }
        ],
        dataInfo: [],
        showPublish:false,
        show:false,
        totalCount: 0,
        pagesize: 10,
        pageindex: 1,
        /**----------表单列表默认数据(end)----------**/
        /**----------表单(增删改)默认数据(begin)----------**/
        formPlaceholder:'选择分类',
        addxFormVisiable:false,
        addxForm:{},
        addxFormRules: {
          formCode: [{required: true, message: '请输入表单编码', trigger: 'blur'}],
          formTitle: [{required: true, message: '请输入表单标题', trigger: 'blur'}],
          classifyId: [{required: true, message: '请输入分类'}],
          siteCode: [{required: true, message: '请输入子站', trigger: 'blur'}],
          ifCreatDataTable: [{required: true, message: '请输入是否建表', trigger: 'blur'}]
        },
        delxFormVisiable:false,
        delxForm:{},
        modifyxFormVisiable:false,
        modifyxForm:{},
        modifyxFormRules: {
          formCode: [{required: true, message: '请输入表单编码', trigger: 'blur'}],
          formTitle: [{required: true, message: '请输入表单标题', trigger: 'blur'}],
          classifyId: [{required: true, message: '请输入分类'}],
          siteCode: [{required: true, message: '请输入子站', trigger: 'blur'}],
          ifCreatDataTable: [{required: true, message: '请输入是否建表', trigger: 'blur'}]
        },
        copyxFormVisiable:false,
        copyxForm:{},
        copyxFormRules: {
          formCode: [{required: true, message: '请输入表单编码', trigger: 'blur'}],
          formTitle: [{required: true, message: '请输入表单标题', trigger: 'blur'}],
          classifyId: [{required: true, message: '请输入分类'}],
          siteCode: [{required: true, message: '请输入子站', trigger: 'blur'}],
          ifCreatDataTable: [{required: true, message: '请输入是否建表', trigger: 'blur'}]
        }
        /**----------表单(增删改)默认数据(end)----------**/
      }
    },
    components: {
			"v-bounces": bounces
		},
    methods: {
      setDelFlag() {
        setTimeout(()=>{
          this.delFlag = true;
      }, 200);
      },
      cancelbtn(){
        this.newxform=false;
      },
      authent(){
        var that = this;
        this.axios.post('/xform/login.do', {
        })
          .then(function (res, req) {
            let comList = res.data;
            if(comList.code==0){
              that.xformToken=comList.data.value;
//              console.log(comList.data.value);
						that.getInitialTree();
      			that.getSitesList();
            }
          }).catch(function (err) {

        })
      },
      //子站信息
      getSitesList:function () {

        this.axios.get(this.XformbaseUrl+'/manage/getSites.do', {
          headers: {
            "xformToken":this.xformToken
          }
        })
          .then((res, req) => {
          this.sitesList = res.data;
      }).catch((err) => {
          console.log(err);
      })
      },
      //查询按钮事件
      queryInfo:function () {
        this.page = 1;
        this.bindDataInfo();
      },
      goOut:function(){
        this.$router.push('/workOrder');
      },
      //表格行点击事件
      rowClick: function (row) {
        if (row != null && row != '') {
          this.editRow = row;
          if(row.state=="已发布"){
            this.showPublish=true;
            this.show=false;
          }else{
            this.showPublish=false;
            this.show=true;
          }
        } else {
          this.show=false;
          this.editRow = -3;
        }
      },
      //分页选择事件
      pageChange: function (val) {
        this.pageindex = val;
        this.bindDataInfo();
      },
      //页码选择事件
      pageSizeChange: function (val) {
        this.pageindex = 1;
        this.pagesize = val;
        this.bindDataInfo();
      },
      //绑定数据信息
      bindDataInfo:function () {
        this.editRow=-3;
        let params = {
          states: this.formSearch.states,//状态
          siteCode: this.formSearch.siteCode,
          classifyId: this.treeSelectID,
          formCodePrefix: this.formSearch.formCodePrefix,
          pageSize: this.pagesize,
          currentPage: this.pageindex
        }
        return this.axios.get(this.XformbaseUrl+'/manage/list', {
            headers: {
              "xformToken":this.xformToken
            },
          params

        }).then((res)=> {
            var vDataInfo = JSON.parse(JSON.stringify(res.data));
        for (var o in vDataInfo.data) {
          let vStates = vDataInfo.data[o].state.toString();
          if (vStates=="1") {
            vDataInfo.data[o].state = "未发布";
          }
          if(vStates=="3") {
            vDataInfo.data[o].state="已发布";
          }
        }
        this.dataInfo = vDataInfo.data;
        this.totalCount = vDataInfo.count;
      })
        .catch((err) => {
          console.log(err);
      });
      },
      /**
       * ----------表单基础信息增删改(begin)----------
       **/
      //默认表单编码
      generateCode: function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      //新增表单按钮事件
      addxFormInfo:function () {
        if (this.treeSelectID || this.dataTree.length > 0) {
          this.getTreeWithSelect(this.treeSelectID || this.dataTree[0].id);
        }
        this.getSitesList();
        this.addxFormVisiable=true;
        this.addxForm={
          formCode:this.generateCode(8),
          formTitle:'',
          classifyId:this.treeSelectID,
          remark:'',
          siteCode:'600100',
          operate:'add',
          metaDataId:'',
          ifCreatDataTable:'1',
          isPaper:this.isPaper
        }
      },
      //新增表单时选择分类事件
      getNodeAdd:function (node) {
        if(node!=undefined&&node.length>0){
          this.addxForm.classifyId=node[0].id;
        }else{
          this.addxForm.classifyId='';
        }
      },
      //确定新增按钮事件/*MG*/
      addxFormSubmit:function () {
        this.$refs.addxForm.validate((valid)=> {
          if (valid) {
            this.axios.post(this.XformbaseUrl+"/manage/save.do",this.addxForm, {headers: {
              "xformToken":this.xformToken
            }})
              .then((res)=> {
              let bAdd = res.data;
            if (bAdd.code == 0) {
              this.addxFormVisiable=false;
              this.$Message.destroy()
              this.$Message.success("新增成功");
              this.bindDataInfo();
            } else {
              this.addxFormVisiable=true;
              this.$Message.destroy()
              this.$Message.error(bAdd.msg);
            }
          }).catch((err) => {
              //this.$Message.error(err);
            });
          }
        })
      },
      //删除按钮事件
      deletexFormInfo:function () {
        if (this.editRow != -3) {
          this.delxFormVisiable = true;
          this.delxForm = {
            formTitle: this.editRow.formTitle,
            metaDataId: this.editRow.metaDataId
          }
        } else {
          this.delxFormVisiable = false;
          this.$Message.destroy()
          this.$Message.warning('请选择需要删除的数据信息');
        }
      },
      //确定删除按钮事件
      delxSubmit:function () {
        let params = {
          metaDataId: this.delxForm.metaDataId
        }
        if (!this.delFlag) {
          this.$Message.destroy()
          this.$Message.error('请稍等');
          return;
        }
        this.delFlag = false;
        this.axios.post(this.XformbaseUrl+"/manage/del.do",querystring.stringify(params), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
              "xformToken":this.xformToken
          }
        })
          .then((res)=> {
          let delInfo = res.data;
        if(delInfo.code==0){
          this.delxFormVisiable = false;
          this.$Message.destroy()
          this.$Message.success("删除成功");
          this.bindDataInfo().then((res) => {
            this.setDelFlag();
        }).catch((err) => {
            this.setDelFlag();
          //this.$Message.error(err);
        });;
        }else{
          this.$Message.destroy()
          this.$Message.error(delInfo.msg);
          this.setDelFlag();
        }
      }).catch((err) => {
          //this.$Message.error(err);
        });
      },
      //修改表单时选择分类事件
      getNodeModify:function (node) {
        if(node!=undefined&&node.length>0){
          this.modifyxForm.classifyId=node[0].id;
        }else{
          this.modifyxForm.classifyId='';
        }
      },
      //表单修改按钮事件
      modifyxFormInfo () {
        this.getTree();
        this.getSitesList();
        let that = this
        if (this.editRow != -3) {
          let params = {
            metaDataId: this.editRow.metaDataId
          }
          this.axios.get(this.XformbaseUrl+"/form/getFormInfo.do", { headers: {
            "xformToken":this.xformToken
          },params})
            .then((res)=> {
            //let detailInfo = res.data.data.formMetadata;
            let detailInfo = res.data.formMetadata;
          that.modifyxFormVisiable = true;
          that.modifyxForm = {
            formCode: detailInfo.formCode,
            siteCode: detailInfo.siteCode,
            formTitle: detailInfo.formTitle,
            classifyId: detailInfo.classifyId,
            remark: detailInfo.remark,
            operate: 'update',
            metaDataId: detailInfo.metaDataId,
            ifCreatDataTable: detailInfo.ifCreatDataTable+""
          }
          this.getTreeWithSelect(that.modifyxForm.classifyId)
        }).catch((err) => {
            that.$Message.error(err);
        });
        } else {
          this.modifyxFormVisiable = false;
          this.$Message.destroy()
          this.$Message.warning('请选择需要删修改的数据信息');
        }
      },
      //确定修改按钮事件
      modifyxFormSubmit:function () {
        this.$refs.modifyxForm.validate((valid)=> {
          if (valid) {
            this.axios.post(this.XformbaseUrl+"/manage/save.do", this.modifyxForm, {headers: {
              "xformToken":this.xformToken
            }})
              .then((res)=> {
              let bModify = res.data;
            if (bModify.code == 0) {
              this.modifyxFormVisiable=false;
              this.$Message.destroy()
              this.$Message.success("修改成功");
              this.bindDataInfo();
            } else {
              this.modifyxFormVisiable=true;
              this.$Message.destroy()
              this.$Message.error(bModify.msg);
            }
          }).catch((err) => {
              //this.$Message.error(err);
            });
          }
        })
      },
      //复制表单时选择分类事件
      getNodeCopy:function (node) {
        if(node!=undefined&&node.length>0){
          this.copyxForm.classifyId=node[0].id;
        }else{
          this.copyxForm.classifyId='';
        }
      },
      //确定复制按钮事件
      copyxFormSubmit () {
        let _this = this
        this.$refs.copyxForm.validate((valid)=> {
          if (valid) {
            this.axios.post(this.XformbaseUrl+"/manage/save.do", _this.copyxForm, {headers: {
              "xformToken":_this.xformToken
            }})
              .then((res)=> {
              let bCopy = res.data;
            if (bCopy.code == 0) {
              this.copyxFormVisiable=false;
              this.$Message.destroy()
              this.$Message.success("复制成功");
              this.bindDataInfo();
            } else {
              this.modifyxFormVisiable=true;
              this.$Message.destroy()
              this.$Message.error(bCopy.msg);
            }
          }).catch((err) => {
              //this.$Message.error(err);
            });
          }
        })
      },
      //表单复制按钮事件
      copyxFormInfo:function () {
        let _this = this
        if (this.editRow != -3) {
          let params = {metaDataId:this.editRow.metaDataId};
          this.axios.get(this.XformbaseUrl+"/form/getFormInfo", { headers: {
            "xformToken":this.xformToken
          },params})
            .then((res)=> {
            let vCopy =JSON.parse(JSON.stringify(res.data)).formMetadata;
          if (vCopy.originalJsonPath!=undefined&&vCopy.originalJsonPath.length>0) {
            this.copyxFormVisiable = true;
            this.copyxForm = {
              metaDataId: vCopy.metaDataId,
              formCode:this.generateCode(8),
              siteCode: vCopy.siteCode || '',
              classifyId: vCopy.classifyId || '',
              operate: 'copy',
              ifCreatDataTable: vCopy.ifCreatDataTable+"" || '1'
            }
            this.getTreeWithSelect(this.copyxForm.classifyId)
          } else {
            this.$Message.destroy()
            this.$Message.error("此表单还未做表单设计，无法复制！");
          }
        }).catch((err) => {
            //this.$Message.error(err);
          });
        } else {
          this.$Message.destroy()
          this.$Message.warning('请选择需要复制的数据信息');
        }
      },
      /**
       * ----------表单基础信息增删改(end)----------
       **/
      //表单设计按钮事件
      xFormDesign:function () {
        let that = this;
        if (this.editRow != -3) {
          let vMetaDataId = this.editRow.metaDataId;
          let item = {};
          item.menuName = this.editRow.formTitle+"_表单设计";
          item.menuId=vMetaDataId;
          item.url = 'formDesign';
          let param = {};
         // param.formDesign = '../../../static/xform/formDesign.html?metaDataId='+vMetaDataId+'&api='+this.XformbaseUrl;
          param.formDesign = './static/xform/formDesign.html?metaDataId='+vMetaDataId+'&api='+this.XformbaseUrl;
//          debugger
//          that.$parent.$parent.$parent.$store.state.iframeUrl.push(param);
//          that.$parent.$parent.$parent.onMenuClick(item);
          that.xformsrc=param.formDesign+'&xformToken='+this.xformToken;
          that.newxform=true;
        } else {
          this.$Message.destroy()
          this.$Message.warning('请选择需要设计的数据信息');
        }
      },
      //发布按钮事
      publishFormInfo:function () {
        if (this.editRow != -3) {
          let param= {metaDataId:this.editRow.metaDataId};

          let item={};
          item.menuName = this.editRow.formTitle+"_表单设计";
          item.url = 'formDesign';
          item.menuId= this.editRow.metaDataId;

          this.axios.post(this.XformbaseUrl+"/manage/publish.do", querystring.stringify(param), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "xformToken":this.xformToken
            }
          }).then((res)=> {
            let vPublish = res.data;
          if (vPublish.code == '0')
          {
            this.$Message.destroy()
            this.$Message.success("发布成功");


            item.tabOperation="removeTabMenu";
            window.parent.postMessage(item,'*');


            this.bindDataInfo();
          } else {
            this.$Message.destroy()
            this.$Message.error(vPublish.msg);
          }
        }).catch((err) => {
            //this.$Message.error(err);
          });
        } else {
          this.$Message.destroy()
          this.$Message.warning('请选择需要发布的数据信息');
        }
      },
      //测试按钮事件
      formTest:function () {
        let that = this
        if (this.editRow != -3) {
          let params = {
            metaDataId:this.editRow.metaDataId,
            time:new Date().getTime().toString()
          };
          this.axios.get(this.XformbaseUrl+"/form/preview.do",{ headers: {
            "xformToken":this.xformToken
          },params})
            .then((res)=> {
            let vPublish = res.data;
          if (vPublish.success) {
            let vMetaDataId = this.editRow.metaDataId;
            let item = {};
            item.menuName = this.editRow.formTitle+"_表单预览";
            item.menuId=uuid(32,16);
            item.url = 'formDesign';
            let param = {};
            param.formDesign = '../../../static/xform/formtest.html?metaDataId='+vMetaDataId+'&api='+this.XformbaseUrl;
            // param.formDesign = '../static/formPreview.html?formMetadata='
            //                    +JSON.stringify(vPublish.formMetadata)+'&originalJson='+
            //                    JSON.stringify(vPublish.formMetadata);
            debugger
            that.$parent.$parent.$parent.$store.state.iframeUrl.push(param);
            that.$parent.$parent.$parent.onMenuClick(item);
          } else {
            this.$Message.destroy()
            this.$Message.error("没有设计的表单，无法测试");
          }
        }).catch((err) => {
            //this.$Message.error(err);
          });
        } else {
          this.$Message.destroy()
          this.$Message.warning('请选择需要测试的数据信息');
        }
      },
      //预览按钮事件
      previewFormInfo:function () {
        let that = this
        if (this.editRow != -3) {
          let params = {
            metaDataId:this.editRow.metaDataId,
            time:new Date().getTime().toString()
          };
          this.axios.get(this.XformbaseUrl+"/form/preview.do",{ headers: {
            "xformToken":this.xformToken
          },params})
            .then((res)=> {
            let vPublish = res.data;
          if (vPublish.success) {
            let vMetaDataId = this.editRow.metaDataId;
            let item = {};
            item.menuName = this.editRow.formTitle+"_表单预览";
            item.menuId=uuid(32,16);
            item.url = 'formDesign';
            let param = {};
//          param.formDesign = '../../../static/xform/formPreview.html?metaDataId='+vMetaDataId+'&api='+this.XformbaseUrl;
						param.formDesign = './static/xform/formPreview.html?metaDataId='+vMetaDataId+'&api='+this.XformbaseUrl;
            
            that.xformsrc=param.formDesign+'&xformToken='+this.xformToken;
            that.newxform=true;
          } else {
            this.$Message.destroy()
            this.$Message.error("没有设计的表单，无法预览");
          }
        }).catch((err) => {
            //this.$Message.error(err);
          });
        } else {
          this.$Message.destroy()
          this.$Message.warning('请选择需要预览的数据信息');
        }
      },
      // 拷贝url地址
//      copyFormUrl() {
//        let _this = this
//        let clipboard = new Clipboard('#formUrl');
//        if (!this.editRow) {
//          this.$Message.destroy()
//          this.$Message.error('请选择一条数据');
//          return;
//        }
//        let formCode = this.editRow.formCode;
//        let siteCode = this.editRow.siteCode;
//        //拼接路径
//        /*let strFullPath = window.document.location.href;
//         let strPath = window.document.location.pathname;
//         let pos = strFullPath.indexOf(strPath);
//         let prePath = strFullPath.substring(0, pos);
//         let postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);*/
//        let basePath =  "http://" + window.location.host + "/static/redirect.html?siteCode=" + siteCode
//          + "&formCode=" + formCode + "&api=" + this.XformbaseUrl;
//        document.querySelector('#formUrl').setAttribute("data-clipboard-text", basePath);
//        clipboard.on('success', function (e) {
//          _this.$Message.destroy()
//          _this.$Message.success('复制成功');
//        });
//      },

      /**
       * ----------以下为树相关操作----------
       **/
      //获取树数据
      getInitialTree: function () {
        return this.axios.get(this.XformbaseUrl+'/classify/getAllClassifyTrees.do', {
          headers: {
            "xformToken":this.xformToken
          }
        })
          .then((res)=> {
          this.dataTree = JSON.parse(JSON.stringify(res.data)).data;
        this.menuDataTree = JSON.parse(JSON.stringify(res.data)).data;
      })
        .catch((err) => {
          console.log(err);
      });
      },
      //获取树数据
      getTree: function () {
        this.axios.get(this.XformbaseUrl+'/classify/getAllClassifyTrees.do', {
          headers: {
            "xformToken":this.xformToken
          }
        })
          .then((res)=> {
          this.dataTree = JSON.parse(JSON.stringify(res.data)).data;
        // this.menuDataTree = JSON.parse(JSON.stringify(res.data)).data;
      })
        .catch((err) => {
          console.log(err);
      });
      },
      //获取树数据
      getTreeWithSelect: function (id) {
        this.getTree()
        this.dataTreebackfill = this.selectTree(id,this.dataTree)
      },
      // selectTree默认选中
      selectTree:function(value,treeList) {
        for (let i = 0;i<treeList.length;i++) {
          if (value === treeList[i].id){
            treeList[i].selected = true
            break
          }else if (treeList[i].child) {
            this.selectTree(value,treeList[i].child)
          }
        }
        return treeList;
      },
      //树节点选中事件
      selectedClick(val){
        if(val!=undefined&&val.length>0){
          this.treeSelectID = val[0].id;
          this.treeSelectName=val[0].title;
          this.page = 1;
          this.bindDataInfo();
        }else{
          this.treeSelectID='';
          this.treeSelectName='';
        }
      },
      //树新增按钮事件
      addTreeInfo:function () {
        this.addTreeFormVisiable=true;
        this.addTreeForm= {
          id:this.treeSelectID,
          type:'add',
          name: '',
          description: ''
        }
      },
      //确定新增按钮事件
      addTreeSubmit:function () {
        this.$refs.addTreeForm.validate((valid)=> {
          if (valid) {
            this.axios.post(this.XformbaseUrl+"/classify/addOrUpdateClassify.do",querystring.stringify(this.addTreeForm), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                  "xformToken":this.xformToken
              }
            })
              .then((res)=> {
              let bAdd = res.data;
            if (bAdd.utryflag) {
              this.addTreeFormVisiable=false;
              this.$Message.destroy()
              this.$Message.success("新增成功");
              this.treeSelectID='';
              this.treeSelectName='';
              this.getInitialTree();
            } else {
              this.addTreeFormVisiable=true;
              this.$Message.destroy()
              this.$Message.error(bAdd.utrymsg);
            }
          }).catch((err) => {
              //this.$Message.error(err);
            });
          }
        })
      },
      //树修改按钮事件
      modifyTreeInfo:function () {
        if (this.treeSelectID != '') {
          let params = {
            id: this.treeSelectID,
            type: 'edit'
          };
          this.axios.get(this.XformbaseUrl+"/classify/addOrUpdateClassifyInit", { headers: {
            "xformToken":this.xformToken
          },params})
            .then((res)=> {
            let treeDetail = res.data;
          this.modifyTreeFormVisiable=true;
          this.modifyTreeForm= {
            id:treeDetail.id,
            type:treeDetail.type,
            name: treeDetail.name,
            description: treeDetail.description
          }
        }).catch((err) => {
            //this.$Message.error(err);
          });
        } else {
          this.modifyTreeFormVisiable = false;
          this.$Message.destroy()
          this.$Message.warning('请选择需要修改的数据信息');
        }
      },
      //确定修改按钮事件
      modifyTreeSubmit:function () {
        this.$refs.modifyTreeForm.validate((valid)=> {
          if (valid) {
            this.axios.post(this.XformbaseUrl+"/classify/addOrUpdateClassify.do", querystring.stringify(this.modifyTreeForm), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                  "xformToken":this.xformToken
              }
            })
              .then((res)=> {
              let bModify = res.data;
            if (bModify.utryflag) {
              this.modifyTreeFormVisiable = false;
              this.$Message.destroy()
              this.$Message.success("修改成功");
              this.treeSelectID = '';
              this.treeSelectName='';
              this.getInitialTree();
            } else {
              this.$Message.destroy()
              this.$Message.error(bModify.utrymsg);
            }
          }).catch((err) => {
              //this.$Message.error(err);
            });
          }
        })
      },
      //树删除按钮事件
      deleteTreeInfo:function () {
        if (this.treeSelectID != '') {
          this.delTreeFormVisiable = true;
          this.delTreeForm = {
            name: this.treeSelectName,
            id: this.treeSelectID
          }
        } else {
          this.modifyTreeFormVisiable = false;
          this.$Message.destroy()
          this.$Message.warning('请选择需要删除的数据信息');
        }
      },
      //确定删除按钮事件
      delTreeSubmit:function () {
        if (!this.delFlag) {
          this.$Message.destroy()
          this.$Message.error('请稍等');
          return;
        }
        this.delFlag = false;
        this.axios.post(this.XformbaseUrl+"/classify/delClassify/"+this.delTreeForm.id+'?xformToken='+this.xformToken)
          .then((res)=> {
          let delInfo = res.data;
        if(delInfo.code==0){
          this.delTreeFormVisiable = false;
          this.$Message.destroy()
          this.$Message.success("删除成功");
          this.treeSelectID = '';
          this.treeSelectName='';
          this.getInitialTree().then((res) => {
            this.setDelFlag();
        }).catch((err) => {
            this.setDelFlag();
          //this.$Message.error(err);
        });
        }else{
          this.$Message.destroy()
          this.$Message.error(delInfo.msg);
          this.setDelFlag();
        }
      }).catch((err) => {
          this.setDelFlag();
        //this.$Message.error(err);
      });
      }
    },
    mounted: function () {
      
      this.authent();
      var that=this;
      window.setInterval(function() {
        that.authent();
      }, 60000);
//      this.bindDataInfo();
      function GetRequest() {
        var url = window.location.href.split('?')[1]; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url) {
          var strs = url.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      }
      if((GetRequest()["isPaper"])!=(null||undefined)){
        this.isPaper = GetRequest()["isPaper"];
      }

      window.addEventListener('message',e => {
        if (typeof e.data === "object") {
        return null
      }
      let msg = JSON.parse(e.data)
      if (!msg || !msg.message || !msg.args){
        return
      }
      if (msg.message==='__loading' && msg.args[0]=="info"){
        this.$Message.destroy()
        this.$Message.success(msg.args[1].msg);
      } else if(msg.message==='__loading' && msg.args[0]=="error") {
        this.$Message.destroy()
        this.$Message.error(msg.args[1].msg);
      }
    },false);
    }
  }
</script>
<style lang="scss" scoped>
.ivu-btn{
	min-width: 75px;
}
.formAcr{
	width: 160px !important;
}

  .xfromMgt-wrap {
    position: relative;
    overflow-y: scroll;
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: relative;
    box-sizing: border-box;
  .ivu-form-item{
    margin-bottom: 25px;
  }
  button.m10 {
    margin-right: 0px;
    margin-left: 1px; /*mg*/
  }
  
  .iframexform{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 80%;
    background: #fff;
    z-index: 2000;
    border-radius: 4px;
    /*margin-top: 20px;*/
    .cancelHeder{
    	height: 35px;
    	line-height: 35px;
    	position: relative;
    }
    .cancelbtn{
    position: absolute;
    right: 0;
        position: absolute;
    right: 0;
    height: 35px;
    width: 35px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  }
  }

  .xfromMgt-wrap .xfromMgt-container {
    overflow: hidden;
    height: 98%;
    position: relative;
    padding-right:2px; /*mg*/
    margin-top:5px; /*mg*/
  }

  .xfromMgt-wrap .xfromMgt-leftDiv{
    width: 25%;
    display: inline;
    float: left;
    padding-right:1px;/*mg*/
    /*height: 100%;*/
   	height: 562px;
    position: relative;
  }

  .xfromMgt-wrap .xfromMgt-left{
    width:100%;
    height:100%;
    overflow: hidden;
    position: relative;
  }
  .xfromMgt-wrap .xfromMgt-rightDiv{
    width: 75%;
    display: inline;
    float: right;
    height: 98%;
    position: relative;
  }
  .xfromMgt-wrap .xfromMgt-right{
    width:100%;
    /*height:100%;
    overflow: hidden;*/
   height: 596px;
    position: relative;
  .xfromMgt-header .xfromMgt-select .ivu-form-item{
    margin-bottom: 0px;
  }
  .xfromMgt-header .xfromMgt-select .ivu-form-item:first-child{
  .ivu-form-item-label{
    width:45px!important;
  }
  .ivu-form-item-content{
    margin-left:45px!important;
  }
  }
  .xfromMgt-header .xfromMgt-select .ivu-form-item-content{
    line-height:1;
  }
  }

  .xfromMgt-wrap .xfromMgt-leftHeader {
    border-right: 1px solid #ccc;
    width: 100%;
    height: 48px;
  
  }

  .xfromMgt-wrap .xfromMgt-letRow {
    width: 100%;
    border: 1px solid #ccc;
    border-bottom: none;
    border-left:none;
    background-color: #f4f6f9;
    height: 48px;
  }

  .xfromMgt-letRow span {
    padding: 0 20px; /*mg*/
    line-height: 48px;
    font-weight: bold;
  }

  .xfromMgt-wrap .xfromMgt-tree {
    width: 100%;
    border: 1px solid #ccc;
    border-left:none;
    border-top:none;
    position: absolute;
    top: 96px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f4f6f9;
    padding: 0 20px; /*mg*/
  .ivu-tree{
  .ivu-tree-empty{
    padding-top:20px;
  }
  }
  }

  .xfromMgt-wrap .xfromMgt-header {
    width: 100%;
    height: 96px;
  }

  .xfromMgt-wrap .xfromMgt-select {
    margin: 20px 0px; /*mg*/
    height: 32px;
  button{
    float:right;
  }
  }

  .xfromMgt-wrap .t-input {
    float: left;
    padding-left: 20px;
  }

  .xfromMgt-wrap .t-select {
    float: right;
    padding-right: 7px;
  }

  .xfromMgt-wrap .xfromMgt-row {
    border-top: 1px solid #d7d7d7;
    position: relative;
    height: 49px;
    width:100%;
    overflow: hidden;
  .xfromMgt-button {
    /*float: $ut-btn-float;*//*mg*/
    /*float: left;*/
    padding:8px 0px; /*mg*/
  button:first-child{
    margin-left:10px;
  }
  }

  }

  .xfromMgt-wrap .xfromMgt-button {
    /*float: left;*/
    min-width: 265px;
    padding:5px 0px;/*mg*/
    font-size:0;
  }

  .xfromMgt-wrap .xfromMgt-info {
    font-size:0.5rem;
    width: 100%;
    position: absolute;
    top:122px;
    bottom: 54px;
    left:0;

  Table{
      padding: 0;
    td{
    	white-space: nowrap;
      padding: 0;
    }
    }
  /*.ivu-table th:last-child,*/
  /*.ivu-table td:last-child{*/
    /*border-right:none;*/
  /*}*/
  /*.ivu-table:after{*/
    /*width:0px;*/
  /*}*/
  }

  .xfromMgt-wrap .xfromMgt-info .ivu-table-wrapper{
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    border:none;
  }

  .xfromMgt-wrap .ut-xfromMgtpage {
    text-align: right;
    height: 64px;
    padding: 20px 0px;/*mg*/
    position: absolute;
    bottom:0px;
    width:100%;
  .ivu-page-options-sizer{
    margin-right:0px;
  }
  }
  .xfromMgt-model .ivu-input-wrapper {
    width: 248px !important;
  }
  .xfromMgt-wrap .xfromMgt-model .ivu-modal .ivu-modal-body{
    padding:25px 10px 0px;
  }
  div#xfromMgt-tree {
    overflow-y: auto;
  }
</style>
