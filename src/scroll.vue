<template>
	<div class="wrapper" :style="{bottom: bottomHeight}">
		<div class="scroller">
			<slot></slot>
			<slot name="pulldown"></slot>
      <slot name="pullup"></slot>
		</div>
	</div>
</template>
<script>
	var iScroll = require('iscroll/build/iscroll-probe');
	import { Pulldown,Pullup, addClass,removeClass,containClass } from './pull.js'
	var pullThreshold = 5;
	const pulldownDefaultConfig = () => ({
	  content: 'Pull Down To Refresh',
	  height: 60,
	  autoRefresh: false,
	  upContent: 'Pull Down To Refresh',
	  downContent: 'Release To Refresh',
	  loadingContent: 'Loading...',
	  clsPrefix: 'vue-iscroll-pulldown-'
	})
	const pullupDefaultConfig = () => ({
	  content: 'Pull Up To Refresh',
	  pullUpHeight: 60,
	  height: 60,
	  autoRefresh: false,
	  upContent: 'Release To Refresh',
	  downContent: 'Pull Up To Refresh',
	  loadingContent: 'Loading...',
	  clsPrefix: 'vue-iscroll-pullup-'
	})


	export default{
		name: "vue-iscroller",
		props:{
			bottomHeight: {
				type: String,
				default: '0'
			},
			usePulldown: {
				type: Boolean,
				default: false
			},
			usePullup: {
				type: Boolean,
				default: false
			},
			pulldownConfig: {
				type: Object,
				default: ()=>{}
			},
			pullupConfig: {
				type: Object,
				default: ()=>{}
			}
		},
		compiled(){
			this.uuid = Math.random().toString(36).substring(3, 8);
		},
		ready(){
			this.$el.setAttribute('id', `scroller-${this.uuid}`);
			let content = null;
			const slotChildren = this.$el.querySelector('.scroller').childNodes;
			for (let i = 0; i < slotChildren.length; i++) {
	      if (slotChildren[i].nodeType === 1) {
	        content = slotChildren[i];
	        break;
	      }
	    }
	    if (!content) {
	      throw new Error('no content is found');
	    }

			this._scroller = new iScroll('.wrapper',{
				probeType:2,
				bounceTime: 250,
				bounceEasing: 'quadratic',
				mouseWheel:false,
				scrollbars:true,
				fadeScrollbars:true,
				interactiveScrollbars:false
			});
			if (this.usePulldown) {
	      // if use slot=pulldown
	      let config = Object.assign(pulldownDefaultConfig(), this.pulldownConfig);
	      config.container = this.$el.querySelector('.scroller');

	      if(!config.container){
	      	throw new Error('pulldown has no container')
	      }
	      //构建pulldown的HTML
	      var pulldown = this.pulldown = new Pulldown(config);
	      pulldown.on('loading',()=>{
	      	this.$dispatch('pulldown:loading', this.uuid)
	      })
	      var pulldownOffset = pulldown.element.offsetHeight;

	    }

	    if(this.usePullup){
	    	let config = Object.assign(pullupDefaultConfig(), this.pullupConfig);
	    	config.container = this.$el.querySelector('.scroller');
	    	
	    	if(!config.container){
	    		throw new Error('pullup has no container')
	    	}
	    	//构建pullup的HTML
	    	var pullup = this.pullup = new Pullup(config);

	    	var pullupOffset = pullup.element.offsetHeight;
	    }

	    let startPos = null;
	    this._scroller.on('scrollStart',function(){
	    	startPos = this.y;
	    })

	    var that = this;//保存this
	    
	    that._scroller.on('scroll',function(){
	    	if(that.usePulldown||that.usePullup){
	    		/* 
	    			'scroll' called, but scroller is not moving!
						Probably because the content inside wrapper is small and fits the screen, so drag/scroll is disabled by iScroll.
						Fix this by a hack: Setting "myScroll.hasVerticalScroll=true" tricks iScroll to believe
						that there is a vertical scrollbar, and iScroll will enable dragging/scrolling again...
					*/
	    		this.hasVerticalScroll=true;
	    		startPos = -1000;
	    	} else if ( startPos===-1000 && ((!that.usePullup && (this.y<0)) || ((!that.usePulldown) && (this.y>0))) ){
	    		/* 
	    			Scroller was not moving at first (and the trick above was applied), but now it's moving in the wrong direction.
						I.e. the user is either scrolling up while having no "pull-up-bar",
						or scrolling down while having no "pull-down-bar" => Disable the trick again and reset values...
					*/
					this.hasVerticalScroll=false;
					startPos=0;
					this.scrollBy(0,-this.y, 0);//Adjust scrolling position to undo this "invalid" movement
	    	}

	    	if (that.usePulldown) {
					if (this.y > pulldownOffset+pullThreshold && !containClass(pulldown.element,'vue-iscroll-pulldown-down')) {
						pulldown.release();
						console.log('call release')
						this.scrollBy(0,-pulldownOffset, 0);// Adjust scrolling position to match the change in pullDownEl's margin-top
					} else if (this.y < 0 && containClass(pulldown.element,'vue-iscroll-pulldown-down')) { // User changes his mind...
						pulldown.pull();
						this.scrollBy(0,pulldownOffset, 0);	// Adjust scrolling position to match the change in pullDownEl's margin-top
					}

				}

				if (that.usePullup) {
				
					if (this.y < (this.maxScrollY - pullupOffset + pullThreshold) && !containClass(pullup.element,'vue-iscroll-pullup-up')) {
						pullup.release();
						console.log('call release');

					} else if (this.y > (this.maxScrollY -pullupOffset + pullThreshold) && containClass(pullup.element,'vue-iscroll-pullup-up')){
						this.scrollBy(0,pullupOffset, 0);
						pullup.push();
					}
				}


	    })

	    that._scroller.on('scrollEnd',function() {
				if ( pulldown && containClass(pulldown.element,'vue-iscroll-pulldown-down')) {
					console.log('scroll end')
					pulldown.loading();
				}

				if ( pullup && containClass(pullup.element,'vue-iscroll-pullup-up')) {
					console.log('scroll end');console.log(this)
					this.scrollBy(0,-pullupOffset, 0);
					pullup.loading();
					
				}
				
				if (startPos===-1000) {
					// If scrollStartPos=-1000: Recalculate the true value of "hasVerticalScroll" as it may have been
					// altered in 'scroll' to enable pull-to-refresh/load when the content fits the screen...
					this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
				}
			});

		},

		methods: {
			reset(timeout=0){
				console.log('reset');console.log(this._scroller);
				this._scroller&&setTimeout(()=>{
					console.log('refresh')
					this._scroller.refresh();
				},timeout);
			}
		},
		events:{
			'scroll-reset': function(uuid){
				console.log('reset event')
				this.reset();
			},
			//下拉刷新，重置iscroll
			'pulldown:reset': function (uuid) {
	      if (uuid === this.uuid) {
	        this.pulldown.reset(() => {
	        	//repaint,timeout需要设置长一点
	          this.reset(1000);
	        })
	      }
	    },
	    //上拉加载，重置iscroll
	    'pullup:reset': function (uuid) {
	      if (uuid === this.uuid) {
	        this.pullup.complete()
	        this.reset()
	      }
	    },
	    //上拉加载，数据加载完毕
	    'pullup:done': function (uuid) {
	      if (uuid === this.uuid) {
	        this._iscroll.unplug(this.pullup)
	      }
	    }
		},
		beforeDestroy(){
			this._scroller.destroy();
		}

		
	}
</script>
<style>
	.wrapper{
		position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    //bottom: 48px;
    width: 100%;
    overflow: hidden;
	}
	.scroller{
		position: absolute;
		width: 100%;
	}
	.vue-iscroll-pulldown-container,.vue-iscroll-pullup-container{
		margin-top: 0;
		background: #fff;
		transition: all linear 250ms;
	}
	.vue-iscroll-pulldown-up{
		margin-top: -60px;
	}
	.vue-iscroll-pulldown-down{
			transition: none;
	}
	.vue-iscroll-pulldown-loading{
		transition: none;
	}

	/* pullup */
	.vue-iscroll-pullup-loading{
		bottom: -60px;
	}
	.vue-iscroll-pullup-down{
		bottom: -60px;
	}
	.vue-iscroll-pullup-up{
		bottom: -60px;
	}


</style>