<template>
	<div class="functional-select-wrapper" v-on:click.stop="singleFocus()">
		<label class="display-container clearfix" v-bind:class="show?'single-selected-focus':''">
				<p v-show="selected.id == '' ">
				<span v-if="originOptions.length != 0 " class="input-placeholder">请选择</span>
				<span v-else>没有选项</span>
				</p>
				<p class="single-selected" :id="selected.id">{{ selected.name }}</p>
				<i class="icon ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow" v-bind:class="show?'drop-up':''"></i>
				</label>
		<div class="options-container" v-show="show">
			<div class="search-container">
				<input placeholder="search here" class="search-input" v-model="search" v-on:keyup="singleSearch()" v-on:click.stop />
			</div>
			<ul class="options-ul-list">
				<li v-show="displayOptions.length == 0">没有查询到数据</li>
				<li v-for="item in displayOptions" v-on:click.stop.prevent="singleSelect(item.id)" v-bind:class=" (item.id == selected.id)?'selected':'' ">{{ item.name }}</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	export default {
		data() {
			return {
				originOptions: [{"id":"1","name":"lemon"},{"id":"2","name":"mike"},{"id":"3","name":"lara"},{"id":"4","name":"zoe"},{"id":"5","name":"steve"},{"id":"6","name":"nolan"}],
				displayOptions: [{"id":"1","name":"lemon"},{"id":"2","name":"mike"},{"id":"3","name":"lara"},{"id":"4","name":"zoe"},{"id":"5","name":"steve"},{"id":"6","name":"nolan"}],
				show: false,
				search: '',
				selected: {
					id: "",
					name: ""
				}
			}
		},
		props: ['optionsdata', 'selecteddata'],
		mounted: function() {
			window.addEventListener('click', this.blur)
			//console.log(JSON.stringify(this.data))
		},
		watch: {
			optionsdata: function(val, oldVal) {
				// console.log('option old: ' + JSON.stringify(oldVal))
				// console.log('option new: ' + JSON.stringify(val))
				this.originOptions = val;
				this.show = false;
				// 默认值
				if(this.selected.id == '') {
					this.selected = this.originOptions[0];
				}

			},
			selecteddata: function(val, oldVal) {
				// console.log('selected old: ' + JSON.stringify(oldVal))
				// console.log('selectednew: ' + JSON.stringify(val))
				this.selected = val
			}

		},

		methods: {
			singleFocus: function() {
				if(!this.show) {
					document.body.click();
					console.log('single show')
					this.show = true;
					this.singleSearch();
					this.searchInputFocus();
				} else {
					this.blur();
				}
			},
			searchInputFocus: function() {
				var searchInput = this.$el.getElementsByClassName('search-input')[0];

				this.$nextTick(function() {
					searchInput.focus();
				})

			},
			singleSelect: function(id) {
				var mySelf = this;
				// var originOptions = mySelf.single.originOptions;
				var displayOptions = mySelf.displayOptions;
				for(var i = 0; i < displayOptions.length; i++) {
					var item = displayOptions[i]
					//在展示数组里找 找到后1.添加到selected
					if(item.id == id) {
						var selected = mySelf.selected;
						selected.id = item.id
						selected.name = item.name
					}
				}
				mySelf.show = false;
				this.search = '';
				//传递给父级组件
				// console.log('派发！！')
				//this.$dispatch('selected', this.selected)
				// console.log('选中的是' + JSON.stringify(this.selected))
			},
			singleSearch: function() {
				var mySelf = this;
				var search = mySelf.search;
				var REG_RULE = new RegExp(search, "i") //根据用户输入值做正则
				var originOptions = mySelf.originOptions;
				//将展示列表置空 然后用正则去原始列表中匹配
				mySelf.displayOptions = [];

				//console.log('搜索的内容是' + search)
				for(var i = 0; i < originOptions.length; i++) {
					var item = originOptions[i]
					// console.log('当前校验的是' + item.name)
					// console.log('校验的结果是' + REG_RULE.test(item.name))
					if(REG_RULE.test(item.name)) {
						mySelf.displayOptions.push(item)
					}
				}
			},
			blur: function() {
				console.log('hide single！！')
				this.show = false;
				this.search = '';
			}
		}
	}
</script>