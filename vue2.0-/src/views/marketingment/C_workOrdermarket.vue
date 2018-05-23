<template>
	<div>
		<div class="DialogShdow"></div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">轮播图内容</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="overflow">
				<div class="inputRow">
					<span>投放渠道：</span>
					<p>{{projectNames.showChannel}}</p>
				</div>
				<div class="inputRow">
					<span>url地址：</span>
					<p>{{projectNames.urlPath}}</p>
				</div>
				<div class="inputRow">
					<span>发送目标：</span>
					<p>{{projectNames.sendTarget}}</p>
				</div>
				<div class="inputRow">
					<span>停留时间：</span>
					<p>{{projectNames.banTime}}s</p>
				</div>
				<div class="inputRow">
					<span>权重：</span>
					<p>{{projectNames.weigth}}</p>
				</div>
				<div class="inputRow">
					<span>生效时间：</span>
					<p>{{projectNames.createTime|moment("YYYY-MM-DD")}} ~ {{projectNames.updateTime|moment("YYYY-MM-DD")}}</p>
				</div>
				<div class="inputRow">
					<span class="see_span">轮播图：</span>
					<img class="see_img" src="../../../static/img/video_cover.png" alt="" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  	import bounces from "@/components/btm-bounces.vue"
	export default {
		data() {
			return {
				projectNames:{}
			}
		},
		methods: {
			//项目信息
			projectMess(id) {
				var that = this;
				this.axios.post('/mkmanager/viewEleInfo/'+id+'.do', {
				}).then((res) => {
					console.log(res);
					this.id = res.data.data.id;
					this.projectNames = res.data.data;
				}).catch(function(err) {})
			},
			cancel() {
				this.$emit("cancel");
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow{
		height: 444px;
		.inputRow{
			width: 400px;
			span{
				width: 60px;
				text-align: right;
				display: inline-block;
			}
			span.see_span{
				position: relative;
				top: -68px;
			}
			p{
				width: 230px;
				display: inline-block;
			}
			.see_img{
				width: 216px;
				height: 138px;
				margin-top: 10px;
				margin-bottom: 20px;
			}
		}
	}
	.Dialog {
		min-width: 560px;
		min-height: 300px;
		.headTitle{
			margin-bottom: 22px;
		}
		.inputRow {
			margin-bottom: 25px;
		}
	}
</style>