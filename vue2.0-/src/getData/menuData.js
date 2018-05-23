export var oneList = [
  {
  isSubShow: true,
  id: 1,
  router: '',
  select: true,
  name: '项目管理',
  icon: 'icon-xiangmuguanli',
  subList: [{
    id: 11,
    name: "发布项目",
    router: 'PbProject',
    isSubShow: false,
    select: true
  }
  ]
},
  {
    id: 2,
    isSubShow: false,
    router: '',
    select: false,
    name: '用户管理',
    icon: 'icon-user1',
    subList: [{
      id: 21,
      name: "用户管理",
      router: "userAdmin",
      select: false
    },
      {
        id: 22,
        name: '黑名单',
        router: "blackList",
        select: false
      }
    ]
  },
  {
    id: 3,
    isSubShow: false,
    router: '',
    select: false,
    name: '审核',
    icon: 'icon-shenhe',
    subList: [{
      id: 31,
      name: "企业审核",
      router: "companyCheck",
      select: false
    },
      {
        id: 32,
        name: '项目审核',
        router: "projectCheck",
        select: false
      },
      {
        id: 33,
        name: '批次审核',
        router: "batchCheck",
        select: false
      }
    ]
  },
  {
    id: 4,
    isSubShow: false,
    router: '',
    select: false,
    name: '质检',
    icon: 'icon-zhijian',
    subList: [{
      id: 41,
      name: "申诉处理",
      select: false,
      router: "complaintHandling",
    },
      {
        id: 42,
        name: '抽检',
        select: false,
        router: "sampling"
      },
      {
        id: 43,
        name: '抽检任务',
        select: false,
        router: 'samplingMission'
      }
    ]
  },
  {
    id: 5,
    isSubShow: false,
    router: '',
    select: false,
    name: '培训管理',
    icon: 'icon-icon_peixunguanli_normal',
    subList: [{
      id: 51,
      name: "项目培训",
      select: false,
      router:"projects"
      },
      {
        id: 52,
        name: '基础培训',
        select: false,
        router:"basis"
      },
      {
        id: 53,
        name: '技能培训',
        select: false,
        router:"skill"
      }
    ]
  },
  {
    id: 6,
    isSubShow: false,
    router: '',
    select: false,
    name: '营销管理',
    icon: 'icon-yingxiaoguanli',
    subList: [
    {
      id: 61,
      name: "营销管理",
      select: false,
      router: "marketingment"
    }
    ]
  },
  {
    id: 7,
    isSubShow: false,
    router: '',
    select: false,
    name: '消息管理',
    icon: 'icon-xiaoxiguanli',
    subList: [{
      id: 71,
      name: "消息管理",
      select: false,
      router: "messagement"
    }]
  },
  {
    id: 8,
    isSubShow: false,
    router: '',
    select: false,
    name: '配置',
    icon: 'icon-peizhi',
    subList: [{
      id: 81,
      name: "语音质检模板",
      select: false,
      router: "voiceTest"
    },
      {
        id: 82,
        name: '结算模板配置',
        select: false,
        router: "settitleMent"
      },
      {
        id: 83,
        name: '工单模板配置',
        select: false,
        router: 'workOrder'
      },
      {
        id: 84,
        name: '系统消息模板配置',
        select: false,
        router: 'Messge'
      },
      {
      	id:85,
      	name:'消息配置',
        select: false,
      	router:'messageConfig'
      },
      {
        id: 86,
        name: '菜单配置',
        select: false,
        router: 'menu'
      }
    ]
  },
  {
    id: 9,
    isSubShow: false,
    router: '',
    select: false,
    name: '知识库',
    icon: 'icon-renwu1',
    subList: [
      {
        id: 91,
        name: "知识库",
        select: false,
        router: "knowledgeBaseIndex"
      }
    ]
  },
  {
    id: 10,
    isSubShow: false,
    router: '',
    select: false,
    name: '报表',
    icon: 'icon-baobiao',
    subList: [{
      id: 101,
      name: "报表",
      select: false,
      router: "reportform"
    }]
  },
  {
    id: 11,
    isSubShow: false,
    router: '',
    select: false,
    name: '意见反馈',
    icon: 'icon-yijianfankui',
    subList: [{
      id: 111,
      name: "意见反馈",
      select: false,
      router: "feedbackIndex"
    }]
  },
  {
    id: 12,
    isSubShow: false,
    router: '',
    select: false,
    name: '权限管理',
    icon: 'icon-quanxianguanli',
    subList: [{
      id: 121,
      name: "员工列表",
      select: false,
      router: "authorityOrder"
    },
      {
        id: 122,
        name: "组织管理",
        select: false,
      	router: "organizaOrder"
      },
      {
        id: 123,
        name: "角色列表",
        select: false,
        router:"roleOrder"
      }
    ]
  },
  {
    id: 13,
    isSubShow: false,
    router: '',
    select: false,
    name: '用户中心',
    icon: 'icon-yonghuzhongxin',
    subList: [{
      id: 131,
      name: "钱包",
      select: false,
      router: 'wallet'
    },
      {
        id: 132,
        name: "企业实名认证",
        select: false,
        router: 'cAuthentication'
      },
      {
        id: 133,
        name: "企业基本资料",
        select: false,
        router: 'compAuthen'
      },
      {
        id: 134,
        name: "域名开户",
        select: false,
        router: 'openDomain'
      },
      {
        id: 135,
        name: "基本资料",
        select: false,
        router: 'basicInformation'
      },
      {
        id: 136,
        name: "重置密码",
        select: false,
        router: 'resetPassword'
      }
    ]
  }
];
export function timeFormat(timestamp){
	//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
				var time = new Date(timestamp);
				var year = time.getFullYear();
				var month = time.getMonth() + 1;
				var date = time.getDate();
				var hours = time.getHours();
				var minutes = time.getMinutes();
				var seconds = time.getSeconds();
				return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
};
export function add0(m){
	return m < 10 ? '0' + m : m
}
