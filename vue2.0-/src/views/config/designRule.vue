<template>
	<div id="disignRule">
		<div>
			<span class="h42" @click="goBack">语音质检模板/</span>
			<span class="h41">设计规则</span>
		</div>
		<!--tab切换-->
		<div class="tabListWap">
			<div v-for="(item,index) in tabList" @click="tabIndex(index)" :class="{cur:item.iscur}">{{item.name}}</div>
		</div>
		<!--tab组件-->
		<!--语速设置-->
		<div v-if="index == 0">
			<speech-rate></speech-rate>
		</div>
		<!--静默时间占比设置-->
		<div v-else-if="index == 1">
			<slience-period></slience-period>
		</div>
		<!--关键词设置-->
		<div v-else="index == 2">
			<key-word></key-word>
		</div>
	</div>
</template>

<script>
	//配置模块设计规则
	import speechRate from "@/views/config/speechRateSetting"
	import sliencePeriod from "@/views/config/sliencePeriod"
	import keyWord from "@/views/config/keyWord"
	export default {
		data() {
			return {
				pageSize: 10,
				page: 1,
				tabList: [{
						iscur: true,
						name: "语速设置"
					},
					{
						iscur: false,
						name: "静默时间占比设置"
					},
					{
						iscur: false,
						name: "关键词设置"
					}
				],
				index: ''
			}
		},
		mounted(){
			
		},
		methods: {
			//返回上一级
			goBack(){
				this.$router.back(-1);
			},
			tabIndex(index) {
				this.index = index;
				this.tabList.map(function(v, i) {
					i == index ? v.iscur = true : v.iscur = false;
				});
			}
		},
		components: {
			speechRate,
			sliencePeriod,
			keyWord
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#disignRule {
		
		.tabListWap {
			overflow: hidden;
			margin-left: 50px;
			margin-bottom: 35px;
			div {
				padding: 0 15px;
				cursor: pointer;
				text-align: center;
				float: left;
				height: 30px;
				line-height: 30px;
				margin-right: 1em;
				background: #F3F3F3;
				border-radius: 5px;
				color: #999;
			}
		}
		.cur {
			background: #108EE9 !important;
			color: #fff !important;
		}
	}
</style>