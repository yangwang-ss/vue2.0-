<template>
	<div>
		<div class="Dialog">
			<div class="headTitle">
				<span class="title">企业审核</span>
				<span class="cancelWap" @click="cancel"><img src="../../../static/img/cancel.png" @click="cancel"/></span>
			</div>
			<div class="overflow scroll">
				<div class="inputRow" style="margin-top: 15px;">
					<span>企业名称：</span>
					<p>{{projectioninfo.name}}</p>
				</div>
				<div class="inputRow">
					<span>统一社会信用代码：</span>
					<p>{{projectioninfo.dutyparagraph}}</p>
				</div>
				<div class="inputRow">
					<span class="see_span">营业执照：</span>
					<span class="see_img">
						<img  :src="projectioninfo.bizlicense ? projectioninfo.bizlicense : ''" alt="" />
					</span>
				</div>
				<div class="inputRow">
					<span>开户行：</span>
					<p>{{projectioninfo.bank}}</p>
				</div>
				<div class="inputRow">
					<span>开户主体：</span>
					<p>{{projectioninfo.accountname}}</p>
				</div>
				<div class="inputRow">
					<span>账号：</span>
					<p>{{projectioninfo.accountnum}}</p>
				</div>
				<div class="inputRow">
					<span class="see_fo">审核说明：</span>
					<textarea class="textBox" v-model="reasontxt" placeholder="请输入该企业审核不通过理由。">{{textBox}}</textarea>
				</div>
				<div class="bootom-button">
					<div class="middlBtnDefalt" @click="cancel">取消</div>
					<div v-if="projectioninfo.status == 'agree'" class="middleBtn1" style="cursor: not-allowed;">通过</div>
					<div v-if="projectioninfo.status == 'apply'" class="middleBtn1"  @click="release(2)" style="cursor: pointer;">通过</div>
					<div v-if="projectioninfo.status == 'apply'" class="middleBtn2" @click="release(3)" style="margin-right: 15px;margin-left: 5px;">不通过</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				seeWork: false,
				companyId:"",
				applyId:"",
				myurl:"",
				reasontxt:"",
				projectioninfo:{},
				textBox:''
			}
		},
		methods: {
			checkWorkDetail(id,status) {
				var that = this;
				this.applyId =status;
				this.axios.post('/companyApply/companyApplyDetail.do', {
					"companyId":id,
				}).then((res) => {
//					console.log(res,"企业审核");
					this.companyId = res.data.data.id;
					this.projectioninfo = res.data.data;
					if(res.data.data.remark == ""){
						this.reasontxt = ""
					}else{
						this.reasontxt = res.data.data.remark
					}
					this.myurl = res.data.data.bizlicense;
				}).catch(function(err) {})
			},
			release(e) {
				let that = this;
				let content={
					companyId:that.companyId,
					applyId:that.applyId,
					status:e,
					reasontxt:that.reasontxt,
				}
				this.$emit("sumbit",{
//					projectId:this.projectId,
					content:content
				});
				this.reasontxt = "";
			},
			cancel() {
				this.$emit("cancel");
				this.reasontxt = "";
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.overflow{
		height: 92%;
		overflow-y: auto;
		.inputRow{
			width: 400px;
			margin-bottom:10px !important;
			span{
				width: 110px;
				text-align: right;
				display: inline-block;
				margin-right: 20px;
			}
			span.see_fo{
				position: relative;
				top: -32px;
			}
			span.see_span{
				position: relative;
				top: -38px;
			}
			p{
				width: 230px;
				display: inline-block;
			}
			.see_img{
				display: inline-block;
				width: 100px;
				height: 100px;
				margin-top: 10px;
				img{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.Dialog {
		
		.inputRow {
			margin-bottom: 25px;
			margin-left: 100px;
			span:first-child{
				margin-right: 5px;
			}
			.textBox {
				height: 80px;
				width: 228px;
			}
		}
		
	}
</style>