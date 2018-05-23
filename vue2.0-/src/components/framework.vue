<template>
	<div id="framework">
		<div class="leftmenuWap" :class="isOpen?'leftWidth1':'leftWidth2'">
			<div class="logo">
				<div class="inside" v-if="isOpen">
					<img src="../assets/logo.png" class="logoImg"/>
					
				</div>
				<div v-else style="height: 57px;width: 57px;padding: 10px;display: flex;">
					<img src="../assets/logo2.png" alt="" style="width: 100%;height: 100%;"/>
				</div>
			</div>
			<ul class="menu scroll" :class="isOpen?'leftWidth1':'leftWidth2'">
				<li v-for="(item,index) in oneList" :class="isOpen?'leftWidth1':'leftWidth2'">
					<div class="oneList" @click="isOpen&&showToggle(item,item.id)" :class="{active:item.select===true}">
						<i class="iconfont" :class="item.imageurl" v-if="isOpen"></i>
						<i class="iconfont" :class="item.imageurl" v-else style="font-size: 18px;margin-right: 20px;margin-left: 31px;"></i>
						<span class="text" v-if="isOpen">{{ item.name }}</span>
						<i v-if="isOpen" class="arowS icon ivu-icon ivu-icon-ios-arrow-down ivu-menu-submenu-title-icon" :class="item.isSubShow?'rotateImg-deg2':'rotateImg-deg1'"></i>
					</div>
					 <transition name="slide">
					<div class="subMenuWap">
						<div @click="jumpRouter(subItem.id,subItem.url)" v-show="item.isSubShow&&isOpen" v-for="(subItem,index) in item.children" class="submenu" :class="{active:subItem.id==nowId}">{{subItem.name}}</div>
					</div>
					</transition>
					<div v-if="!isOpen" class="hoverMenu" id="hiddenMenu">
						<div @click="jumpRouter(subItem.id,subItem.url)" v-for="(subItem,index) in item.children" class="submenu" :class="{active:subItem.id==nowId}">{{subItem.name}}</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="rightWap">
			<div class="tophead">
				<div class="LRshow" @click="showMenu">
					<img src="../image/toLeft.png" alt="" v-if="isOpen" />
					<img src="../image/toRight.png" v-else/>
				</div>
				<div class="right-searchBox">
					<!--<div class="imgwap" :class="showLeft?'menu-img':'menu-img-deg'" @click="hideLeftMenu">
                        <img src="../image/u144.png" />
                    </div>-->
					<!--<input type="text" placeholder="搜索公司/项目/服务者" />-->
				</div>
				<div class="right-setting">
					<div class="news">
						<img src="../image/u170.png">
						<span>通知</span>
						<div class="new-list">
							<ul>
								<!--<div class="newsTitle">-->
								<!--<span>消息</span>-->
								<!--<span>全部标为已读</span>-->
								<!--</div>-->
							</ul>
							<ul>
								<li class="newsTitle">消息</li>
								<!--<img src="../../static/iconfont/ring.svg" alt="">-->
								<li class="empty">已读完所有消息</li>
								<!--<li>天堂声谷（内测版）已经上线</li>-->
							</ul>
							<div></div>
						</div>
					</div>
					<div>
						<img src="../image/u121.png">
						<span>帮助</span>
					</div>
					<div class="uName">
						<span class="flexImg"><img :src="nickurl" alt="" class="headImg logoImg" /></span>
						<span class="niName">{{nick}}</span>
						<div class="uName-list">
							<ul>
								<li @click="">个人设置</li>
								<li @click="logout">退出</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="renderContent" :class="showLeft?'':'bindCwid'">
				<div class="scroll1">
					<div>
						<keep-alive>
						<router-view  v-if="$route.meta.keepAlive"></router-view>
						</keep-alive>
						 <router-view v-if="!$route.meta.keepAlive"></router-view>
						
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isOpen: true,
				loading: false,
				nowId: '1',
				display: false,
				showLeft: true,
				oneList: '', //菜单数组
				nick: '哈哈',
				nickurl: 'http://voicegu.su.bcebos.com/png/d77cad9159f64e2b5f69bb358bd816e1.png',
				isshowNews: false,
				isshowList: false
			}
		},
		mounted() {
			//ready
			this.setBasic();
		},
		methods: {
			//获取元素到顶部的距离
			offsetTop() {
				var ss = document.documentElement.clientHeight;
				this.$nextTick(() => {
					var aa = document.getElementById("hiddenMenu").clientHeight;
					console.log(aa);
				})

				console.log(ss);

			},
			enterShow(){
				this.hiddenMenu = true;
			},
			leaveHidden(){
				this.hiddenMenu = false;
			},
			showMenu() {
				this.isOpen = !this.isOpen;
			},
			logout: function() {
				sessionStorage.setItem('token', '');
				sessionStorage.setItem('userID', '');
				location.href = "http://bmtest.voicegu.com";
			},
			//子菜单的显示或隐藏
			showToggle: function(item, id) {
				for(var i = 0; i < this.oneList.length; i++) {
					if(this.oneList[i].id == id) {
						this.oneList[i].select = true;
						this.oneList[i].isSubShow = !this.oneList[i].isSubShow;
					} else {
						this.oneList[i].select = false;
						this.oneList[i].isSubShow = false;
					}
				}
			},
			setBasic() {
				var that = this;
				this.axios.post('/enterprise/findUserInfo.do', {
					"id": sessionStorage.getItem('userID'), //类型：String  必有字段  备注：无
					//"id": "BUSINESS201801091910080000000000"
				}).then(function(res, req) {
					let comList = res.data;
					if(comList.code == 0) {
						//              console.log(comList.data.user.nickName);
						that.oneList = comList.data.menus;
						if(comList.data.user.photo != null && comList.data.user.photo != undefined) {
							that.nickurl = comList.data.user.photo;
						}
						if(comList.data.user.nickName != null && comList.data.user.nickName != undefined && comList.data.user.nickName != "") {
							that.nick = comList.data.user.nickName;
						} else {
							that.nick = comList.data.user.phoneNumber;
						}
						if(comList.data.user.companyId != null && comList.data.user.companyId != undefined) {
							sessionStorage.setItem("companyId", comList.data.user.companyId);
						}
					} else {
						that.$Message.error(res.data.msg);
					}
				}).catch(function(err) {

				})
			},
			//路由跳转
			jumpRouter(id, url) {
				this.$router.push('/' + url);
				this.nowId = id;
			},
			//隐藏左边菜单
			hideLeftMenu() {
				this.showLeft = !this.showLeft;
				if(this.showLeft) {
					this.showLeftMenu = "leftmenuWap"
				} else {
					this.showLeftMenu = "left-deg leftmenuWap"
				}
			}
		}

	}
</script>

<style scoped lang="scss">
/******旋转动画 *****/

.rotateImg-deg1 {
    animation: rotateImg1 0.3s forwards;
}

.rotateImg-deg2 {
    animation: rotateImg2 0.3s forwards;
}

@-webkit-keyframes rotateImg1 {
    0% {
        transform: rotateZ(180deg);
    }
    100% {
        transform: rotateZ(0deg);
    }
}

@-webkit-keyframes rotateImg2 {
    0% {
        transform: rotateZ(0);
    }
    100% {
        transform: rotateZ(180deg);
    }
}
	/*收缩菜单icon*/
	
	.LRshow {
		width: 6%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		cursor: pointer;
		&:hover {
			background: #F4F6F9;
		}
	}
	
	.checked {
		background: #eff4f7;
	}
	
	#framework {
		display: flex;
		display: -ms-flexbox;
		flex-direction: row;
		width: 100%;
		min-height: 100%;
		.left-deg {
			width: 5% !important;
			overflow: hidden;
			min-width: 60px !important;
			li {
				min-width: 60px;
				width: 100% !important;
				overflow: hidden;
				.text {
					margin-left: 40px !important;
				}
			}
			/*height:200px;*/
			.logo {
				width: 44px !important;
				line-height: 44px;
				overflow: hidden;
				height: 200px;
				img {
					margin-left: 24px !important;
				}
			}
		}
		/*动态绑定*/
		.leftWidth1 {
			/*width: 240px;*/
			width: 190px;
			transition: width 0.3s;
			overflow-y: auto;
			overflow-x: hidden;
		}
		.leftWidth2 {
			position: relative;
			width: 80px;
			z-index: 99;
			transition: width 0.3s;
			/*overflow: hidden;*/
		}
		.font-size2 {
			font-size: 18px;
		}
		.leftmenuWap {
			/*width: 14%;*/
			/*min-width: 196px;*/
			float: left;
			min-height: 100%;
			background: #001529;
			.logo {
				height: 65px;
				line-height: 65px;
				height: 10%;
				display: flex;
				justify-content: space-around;
				align-items: center;
				vertical-align: middle;
				text-aligin: center;
				/*background: #002140;*/
				background:#fff;
				.inside {
					display: flex;
					align-items: center;
					width: 158px;
					height: 35px;
					border-radius: 6px;
					padding: 5px;
					/*background: #333;*/
				}
				.logoImg {
					height: 100%;
					width: 100%;
				}
			}
			/*火狐hack写法*/
			@-moz-document url-prefix() {
				.menu {
					width: 213px !important;
				}
			}
			.menu {
				height: 90%;
				position: fixed;
				left: 0;
				li {
					/*width: 196px;*/
					/*width: 16%;*/
					.oneList{
						border-bottom: 1px dashed #1c2f42;
						
					}
					.oneList,
					.submenu {
						height: 43px;
						line-height: 43px;
						font-size: 14px;
						color: #979797;
						display: flex;
						display: -ms-flexbox;
						align-items: center;
						cursor: pointer;
						span,
						i {
							margin-left: 20px;
							font-size: 14px;
						}
						i {
							font-size: 14px;
						}
						.arowS {
							font-size: 13px;
							font-weight: bolder;
						}
						.text {
							display: inline-block;
							/*min-width: 125px;*/
							min-width: 80px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						&:hover {
							/*background: #108DE9;*/
							background: #1c2f42;
							span,
							i {
								color: #fff;
							}
						}
					}
					
					.submenu {
						padding-left: 52px;
						/*background: #313540;*/
						background-color: #080808;
						&:hover {
							/*background: #108DE9;*/
							background: #1c2f42;
							color: #fff;
						}
					}
					.hoverMenu {
						border-left: 8px solid transparent;
						position: absolute;
						bottom: 0;
						min-width: 120px;
						text-align: center;
						white-space: nowrap;
						overflow: hidden;
						left: 80px;
						display: none;
						animation: skale .5s;
						/*圆角设置属性*/
						/*border-radius: 1px;
						overflow: hidden;
						border-top-left-radius: 4px;
						border-top-right-radius: 4px;
						border-bottom-right-radius: 4px;
						border-bottom-left-radius: 4px;*/
						div {
							padding-left: 20px !important;
							padding-right: 20px !important;
							background: #001529;
						}
					}
					@-webkit-keyframes skale {
						from {
							transform: scale(0.1, 0.1);
						}
						to {
							transform: scale(1, 1);
						}
					}
					&:hover .hoverMenu {
						display: block;
					}
				}
			}
		}
		/*媒体查询*/
		@media screen and (min-width: 1400px) {
			.leftWidth2 {
				position: relative;
				width: 80px;
				z-index: 99999;
				transition: width 0.3s;
				/*overflow: hidden;*/
			}
			.leftWidth1 {
				width: 14%;
				box-sizing: border-box;
				li {
					width: 196px;
					width: 100%;
					box-sizing: border-box;
					.text {
						display: inline-block;
						width: 56%;
					}
					.oneList {
						width: 100%;
					}
				}
			}
		}
		@media only screen and (max-width:1025px) {
			.rightWap {
				min-width: auto !important;
				overflow-x: auto !important;
				overflow-y: hidden;
				.tophead,
				.renderContent {
					width: 1125px;
				}
			}
		}
		.bindCwid {
			width: 95% !important;
		}
		
		.rightWap {
			@-webkit-keyframes skale {
				from {
					transform: scale(0.1, 0.1);
				}
				to {
					transform: scale(1, 1);
				}
			}
			flex: 1;
			min-width: 1125px;
			float: right;
			/*height: 100vh;
			overflow: auto;*/
			.tophead {
				position: relative;
				z-index: 20;
				box-shadow: 4px 3px 5px rgba(0,0,0,.3);
				height: 65px;
				height: 10%;
				display: flex;
				justify-content: space-between;
				display: -ms-flexbox;
				align-items: center;
				font-size: 14px;
				font-weight: bolder;
				color: #333;
				.right-searchBox,
				.right-setting {
					display: flex;
					display: -ms-flexbox;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.news {
						position: relative;
						cursor: pointer;
						/*background: red;*/
						height: 60px;
						line-height: 60px;
						.new-list {
							display: none;
							position: absolute;
							top: 60px;
							left: -50px;
							border: 1px solid #EBEBEB;
							text-align: left;
							width: 240px;
							border-radius: 5px;
							background-color: #ffffff;
							color: #7a7a7a;
							height: 250px;
							z-index: 1;
							text-align: center;
							animation: skale .25s, 100ms;
							ul {
								.newsTitle {
									width: 100%;
									height: 40px;
									text-align: left;
									border-bottom: 1px solid #EBEBEB;
									line-height: 40px;
									font-size: 0.8rem;
									font-weight: bold;
									padding-left: 20px;
									margin-bottom: 20px;
								}
							}
						}
						&:hover .new-list {
							display: block;
						}
					}
					.uName {
						position: relative;
						display: flex;
						flex-direction: row;
						align-items: center;
						cursor: pointer;
						height: 60px;
						line-height: 60px;
						.flexImg {
							width:70px;
							height:70px;
							display:flex;
							align-items: center;
							img {
								width: 100%;
								height: 100%;
							}
						}
						flex-direction: row;
						align-items: center;
						.flexImg {
							img {
								width: 50px;
								height: 50px;
							}
						}
						.niName {
							margin-left: 3px;
							/*display: inline-block;*/
							/*vertical-align: middle;*/
						}
						.uName-list {
							display: none;
							position: absolute;
							top: 60px;
							left: 0;
							border: 1px solid #EBEBEB;
							text-align: left;
							width: 80px;
							border-radius: 5px;
							background-color: #ffffff;
							color: #979797;
							height: 70px;
							z-index: 1;
							animation: skale .25s, 100ms;
							ul,
							li {
								margin: 0;
								padding: 0
							}
							li {
								font-size: 0.8rem;
								height: 35px;
								line-height: 35px;
								cursor: pointer;
								padding-left: 10px;
								&:hover {
									background: #F4F6F9;
									color: #000;
								}
							}
						}
						&:hover .uName-list {
							display: block;
						}
					}
				}
				.right-searchBox {
					margin-left: 10em;
					width: 400px;
					.imgwap {
						cursor: pointer;
						width: 55px;
						height: 55px;
						padding: 5px;
						display: flex;
						display: -ms-flexbox;
						align-items: center;
						justify-content: space-around;
					}
					input {
						width: 304px;
					}
				}
				.right-setting {
					float: right;
					width: 340px;
					padding: 0 40px;
					font-size: 14px;
					div {
						width: 70px;
					}
					div:nth-child(3) {
						width: 120px;
						/*margin-right: 20px;*/
					}
					* {
						vertical-align: middle;
					}
					img {
						width: 20px;
						height: 20px;
					}
					.headImg {
						width: 40px;
						height: 40px;
						border-radius: 50%;
						display: inline-block;
						vertical-align: middle;
					}
				}
			}
			/*********菜单栏隐藏时*********/
			.bindLeftWidh {
				width: 5%;
			}
			.renderContent {
				/*min-height: 90%;*/
				height: 90%;
				box-sizing: border-box;
				/*border: 20px solid #F4F4F4;*/
				padding: 20px 0;
				position: relative;
				display: flex;
				justify-content: space-around;
				overflow: auto;
				background: url(../image/mainBg.jpg) no-repeat;
				/*background-position: center;*/
				background-size: cover;
				background-attachment: fixed;
				.scrollInside {
					height: 100%;
					box-sizing: border-box;
					position: relative;
				}
				.scroll1 {
					width: 85%;
					/*background: aliceblue;*/
					background: #fff;
					border-radius: 8px;
					padding: 20px 25px;
					padding-top: 0;
					position: absolute;
					box-sizing: border-box;
					/*box-shadow: 0 0 15px 6px rgba(44,101,186,0.15);*/
					box-shadow: 0 0 15px 6px rgba(44, 11, 186, 0.20);
					/*height: 100%;*/
					/*overflow-y: auto;
					overflow-x: hidden;*/
				}
			}
			.menu-img-deg {
				transform: rotate(180deg);
			}
		}
	}
</style>