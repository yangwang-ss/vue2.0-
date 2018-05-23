import Vue from 'vue'
import Router from 'vue-router'
const LeftNav = r => require.ensure([], () => r(require('@/components/framework')), 'LeftNav')
const PbProject = r => require.ensure([], () => r(require('@/views/manageProject/A_pbproject')), 'PbProject')
const welcome = r => require.ensure([], () => r(require('@/views/manageProject/welcome')), 'welcome')
const userAdmin = r => require.ensure([], () => r(require('@/views/userAdmin/userAdmin')), 'userAdmin')
const enter_info = r => require.ensure([], () => r(require('@/views/userAdmin/enter_info')), 'enter_info')
const service_info = r => require.ensure([], () => r(require('@/views/userAdmin/service_info')), 'service_info')
const blackList = r => require.ensure([], () => r(require('@/views/userAdmin/blackList')), 'blackList')
const companyCheck = r => require.ensure([], () => r(require('@/views/companyCheck/companyCheck')), 'companyCheck')
const projectCheck = r => require.ensure([], () => r(require('@/views/companyCheck/projectCheck')), 'projectCheck')
const batchCheck = r => require.ensure([], () => r(require('@/views/companyCheck/batchCheck')), 'batchCheck')
const checkBatch = r => require.ensure([], () => r(require('@/components/checkBatch')), 'checkBatch')
const exportWorder = r => require.ensure([], () => r(require('@/components/exportWorder')), 'exportWorder')
//配置模块
const voiceTest = r => require.ensure([], () => r(require('@/views/config/P-voice-test')), 'voiceTest')
const settitleMent = r => require.ensure([], () => r(require('@/views/config/P-settitleMent')), 'settitleMent')
const workOrder = r => require.ensure([], () => r(require('@/views/config/P-work-order')), 'workOrder')
const Messge = r => require.ensure([], () => r(require('@/views/config/P_message')), 'Messge')
const messageConfig = r => require.ensure([], () => r(require('@/views/config/messageConfig')), 'messageConfig')
const menu = r => require.ensure([], () => r(require('@/views/config/P-menu')), 'menu')
const designRule = r => require.ensure([], () => r(require('@/views/config/designRule')), 'designRule')
const templetDesign = r => require.ensure([], () => r(require('@/views/config/templetDesign')), 'templetDesign')
const feeCondition = r => require.ensure([], () => r(require('@/views/config/feeCondition')), 'feeCondition')
const formMgt = r => require.ensure([], () => r(require('@/views/config/formMgt')), 'formMgt')

const skillConfig = r => require.ensure([], () => r(require('@/views/config/skillConfig')), 'skillConfig')
//用户管理模块
//import userAdmin from "@/views/usermanagement/user_admin"
//营销模块
const marketingment = r => require.ensure([], () => r(require('@/views/marketingment/marketingmanagement')), 'marketingment')
const markactivities = r => require.ensure([], () => r(require('@/views/marketingment/marketingactivities')), 'markactivities')
//用户管理模块
//import userAdmin from "@/views/usermanagement/user_admin"
//报表
const reportform = r => require.ensure([], () => r(require('@/views/reportform/reportFormpy')), 'reportform')
//消息模块
const messagement = r => require.ensure([], () => r(require('@/views/messagement/messagemanagement')), 'messagement')
const messagementsee = r => require.ensure([], () => r(require('@/views/messagement/C_workOrdermessage')), 'messagementsee')
//权限模块
const authorityOrder = r => require.ensure([], () => r(require('@/views/authorityment/authorityOrderList')), 'authorityOrder')
const organizaOrder = r => require.ensure([], () => r(require('@/views/authorityment/organizaOrderList')), 'organizaOrder')
const roleOrder = r => require.ensure([], () => r(require('@/views/authorityment/roleOrderList')), 'roleOrder')
//个人中心模块
const wallet = r => require.ensure([], () => r(require('@/views/person/wallet')), 'wallet')
const cAuthentication = r => require.ensure([], () => r(require('@/views/person/cAuthentication')), 'cAuthentication')//authened
const authened = r => require.ensure([], () => r(require('@/views/person/authened')), 'authened')
const openDomain = r => require.ensure([], () => r(require('@/views/person/openDomain')), 'openDomain')
const compAuthen = r => require.ensure([], () => r(require('@/views/person/compAuthen')), 'compAuthen')
const basicInformation = r => require.ensure([], () => r(require('@/views/person/basicInformation')), 'basicInformation')
const resetPassword = r => require.ensure([], () => r(require('@/views/person/resetPassword')), 'resetPassword')
const moreRecord = r => require.ensure([], () => r(require('@/views/person/moreRecord')), 'moreRecord')
const payRoll = r => require.ensure([], () => r(require('@/views/person/payRoll')), 'payRoll')
// 质检--brook-2017/11/27
const complaintHandling = r => require.ensure([], () => r(require('@/views/qualityInspection/complaintHandling')), 'complaintHandling')
const sampling = r => require.ensure([], () => r(require('@/views/qualityInspection/sampling')), 'sampling')
const viewParticulars = r => require.ensure([], () => r(require('@/views/qualityInspection/viewParticulars')), 'viewParticulars')
const samplingMission = r => require.ensure([], () => r(require('@/views/qualityInspection/samplingMission')), 'samplingMission')
const viewMission = r => require.ensure([], () => r(require('@/views/qualityInspection/viewMission')), 'viewMission')
const imgLable = r => require.ensure([], () => r(require('@/views/qualityInspection/imgLable')), 'imgLable')
const speechPeopleQualityDetail = r => require.ensure([], () => r(require('@/views/qualityInspection/speechPeopleQualityDetail')), 'speechPeopleQualityDetail')
const speechQuality = r => require.ensure([], () => r(require('@/views/qualityInspection/speechQuality')), 'speechQuality')
const imgLableDetail= r => require.ensure([], () => r(require('@/views/qualityInspection/imgLableDetail')), 'imgLableDetail')
const speechQualityDetail= r => require.ensure([], () => r(require('@/views/qualityInspection/speechQualityDetail')), 'speechQualityDetail')
// 知识库--brook-2017/12/1
const knowledgeBaseIndex = r => require.ensure([], () => r(require('@/views/knowledgeBase/knowledgeBaseIndex')), 'knowledgeBaseIndex')
const knowledgeBaseName = r => require.ensure([], () => r(require('@/views/knowledgeBase/knowledgeBaseName')), 'knowledgeBaseName')
const addQuestion = r => require.ensure([], () => r(require('@/views/knowledgeBase/addQuestion')), 'addQuestion')
const addKnowledge = r => require.ensure([], () => r(require('@/views/knowledgeBase/addKnowledge')), 'addKnowledge')
// 培训管理--brook-2017/12/9
const projects = r => require.ensure([], () => r(require('@/views/trainingAdminister/projects')), 'projects')
const basis = r => require.ensure([], () => r(require('@/views/trainingAdminister/basis')), 'basis')
const skill = r => require.ensure([], () => r(require('@/views/trainingAdminister/skill')), 'skill')
// 意见反馈--brook-2017/9-16

const feedbackIndex = r => require.ensure([], () => r(require('@/views/feedback/index')), 'feedbackIndex')

Vue.use(Router)
export default new Router({
//	mode:'history',
	base:__dirname,
  routes: [
    {
      path: '/',
//    name: 'Hello',
      component: LeftNav,
      children:[{
        path:'',redirect:'/welcome'
        //path:'',redirect:''
      },
      {
      		name:'welcome',path:'/welcome',component:welcome
      	},
      	//项目管理
      	{
      		name:'pbProject',path:'/PbProject',component:PbProject
      	},
      	{
      		name:'checkBatch',path:'/checkBatch',component:checkBatch
      	},
      	{
      		name:'exportWorder',path:'/exportWorder',component:exportWorder
      	},
		//用户管理
      	{
      		name:'userAdmin',path:'/userAdmin',component:userAdmin,meta: { keepAlive: true }
      	},
      	{
      		name:'blackList',path:'/blackList',component:blackList,meta: { keepAlive: true }
      	},
      	{
      		name:'enter_info',path:'/enter_info',component:enter_info
      	},
      	{
      		name:'service_info',path:'/service_info',component:service_info
      	},
      	//审核
      	{
      		name:'companyCheck',path:'/companyCheck',component:companyCheck
      	},
      	{
      		name:'projectCheck',path:'/projectCheck',component:projectCheck
      	},
      	{
      		name:'batchCheck',path:'/batchCheck',component:batchCheck
      	},
      	
      	//配置模块
      	{
      		name:'voiceTest',path:"/voiceTest",component:voiceTest,meta: { keepAlive: true }
      	},
      	{
      		name:'settitleMent',path:'/settitleMent',component:settitleMent,meta: { keepAlive: true }
      	},
      	{
      		name:'workOrder',path:'/workOrder',component:workOrder
      	},
      	{
      		name:'Messge',path:'/Messge',component:Messge,meta: { keepAlive: true }
      	},
      	{
      		name:'messageConfig',path:'/messageConfig',component:messageConfig,meta: { keepAlive: true }
      	},
      	{
      		name:'menu',path:'/menu',component:menu,meta: { keepAlive: true }
      	},
      	{
      		name:'designRule',path:'/designRule',component:designRule
      	},
      	{
      		name:'templetDesign',path:'/templetDesign',component:templetDesign
      	},
      	{
      		name:'feeCondition',path:'/feeCondition',component:feeCondition
      	},
        {
          name:'formMgt',path:'/formMgt',component:formMgt,meta: { keepAlive: true }
        },
      	{
      		name:'skillConfig',path:'/skillConfig',component:skillConfig,meta: { keepAlive: true }
      	},
        

      	//用户中心
      	{
      		name:'wallet',path:'/wallet',component:wallet
      	},
      	{
          name:'cAuthentication',path:'/cAuthentication',component:cAuthentication
        },
        {
          name:'authened',path:'/authened',component:authened
        },
        {
          name:'compAuthen',path:'/compAuthen',component:compAuthen
        },
        {
          name:'openDomain',path:'/openDomain',component:openDomain
        },
      	{
      		name:'basicInformation',path:'/basicInformation',component:basicInformation
      	},
      	{
      		name:'resetPassword',path:'/resetPassword',component:resetPassword
      	},
      	{
      		name:'payRoll',path:'/payRoll',component:payRoll
      	},
      	//查看更多
      	{
      		name:'moreRecord',path:'/moreRecord',component:moreRecord
      	},
        //营销管理
        {
          name:'marketingment',path:'/marketingment',component:marketingment,meta: { keepAlive: true }
        },
        {
          name:'markactivities',path:'/markactivities',component:markactivities,meta: { keepAlive: true }
         },
        //消息管理
        {
          name:'messagement',path:'/messagement',component:messagement,meta: { keepAlive: true }
        },
        {
          name:'messagementsee',path:'/messagementsee',component:messagementsee
        },
        //权限管理
        {
          name:'authorityOrder',path:'/authorityOrder',component:authorityOrder,meta: { keepAlive: true }
        },
        {
          name:'organizaOrder',path:'/organizaOrder',component:organizaOrder,meta: { keepAlive: true }
        },
        {
          name:'roleOrder',path:'/roleOrder',component:roleOrder,meta: { keepAlive: true }
        },
        // 质检
        {
          name:'complaintHandling',path:'/complaintHandling',component:complaintHandling,meta: { keepAlive: true }
        },
        {
          name:'viewParticulars',path:'/viewParticulars',component:viewParticulars
        },
        {
          name:'sampling',path:'/sampling',component:sampling,meta: { keepAlive: true }
        },
        {
        	name:'speechPeopleQualityDetail',path:'/speechPeopleQualityDetail',component:speechPeopleQualityDetail
        },
        {
          name:'samplingMission',path:'/samplingMission',component:samplingMission
        },
        {
          name:'viewMission',path:'/viewMission',component:viewMission
        },
        {
        	name:'imgLable',path:'/imgLable',component:imgLable
        },
        {
        	name:'speechQuality',path:'/speechQuality',component:speechQuality
        },
         {
        	name:'imgLableDetail',path:'/imgLableDetail',component:imgLableDetail
        },
        {
        	name:'speechQualityDetail',path:'/speechQualityDetail',component:speechQualityDetail
        },
        //报表
        {
              name:'reportform',path:'/reportform',component:reportform,meta: { keepAlive: true }
        },
        // 知识库
        {
          name:'knowledgeBaseIndex',path:'/knowledgeBaseIndex',component:knowledgeBaseIndex,meta: { keepAlive: true }
        },
        {
          name:'knowledgeBaseName',path:'/knowledgeBaseName',component:knowledgeBaseName
        },
        {
          name:'addQuestion',path:'/addQuestion',component:addQuestion
        },
        {
          name:'addKnowledge',path:'/addKnowledge',component:addKnowledge
        },
        // 培训管理
        {
          name:'projects',path:'/projects',component:projects,meta: { keepAlive: true }
        },
        {
          name:'basis',path:'/basis',component:basis,meta: { keepAlive: true }
        },
        {
          name:'skill',path:'/skill',component:skill,meta: { keepAlive: true }
        },
        // 意见反馈
        {
          name:'feedbackIndex',path:'/feedbackIndex',component:feedbackIndex,meta: { keepAlive: true }
        }
      ]
    }
  ]
})
