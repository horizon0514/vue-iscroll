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
	var iScroll = require('iscroll/build/iscroll-probe')

	const pulldownDefaultConfig = () => ({
	  content: 'Pull Down To Refresh',
	  height: 60,
	  autoRefresh: false,
	  downContent: 'Pull Down To Refresh',
	  upContent: 'Release To Refresh',
	  loadingContent: 'Loading...',
	  clsPrefix: 'vue-iscroll-pulldown-'
	})
	const pullupDefaultConfig = () => ({
	  content: 'Pull Up To Refresh',
	  pullUpHeight: 60,
	  height: 40,
	  autoRefresh: false,
	  downContent: 'Release To Refresh',
	  upContent: 'Pull Up To Refresh',
	  loadingContent: 'Loading...',
	  clsPrefix: 'vue-iscroll-pullup-'
	})

	
	class pullupRender{
		constructor(cfg){
			if (self.__isRender) return;
			self.__isRender = true;

			this.cfg = cfg;
			this.render(cfg);
	
			return this;
		}
		render(cfg){
			var containerCls = clsPrefix + "container";
			var height = this.cfg.height;
			var pullup = this.pullup = document.createElement("div");
			pullup.className = containerCls;
			pullup.style.position = "absolute";
			pullup.style.width = "100%";
			pullup.style.height = height + "px";
			pullup.style.bottom = -height + "px";
			cfg.container.appendChild(pullup);

		}
		changeStatus(){
			//绑定触发事件
			Util.addClass(this.pullup, clsPrefix + this.status);
			pullup.innerHTML = this.cfg[this.status + "Content"] || this.cfg.content;
		}
		pull(){
			this.status = 'up';
			changeStatus();
		}
		release(){
			this.status = 'down';
			changeStatus();
		}
		
	}
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
				probeType: 2,
				scrollbars:true,
			});
			
			if (this.usePulldown) {
	      // if use slot=pulldown
	      let config = Object.assign(pulldownDefaultConfig(), this.pulldownConfig);
	      config.container = this.$el;
	      //构建pulldown的HTML
	      pulldownRender(config);
	    }

	    let startPos = null;
	    this._scroller.on('scrollStart',function(){
	    	startPos = this.y;
	    })

	    
	    this._scroller.on('scroll',function(){
	    	if(this.usePulldown||this.usePullUp){
	    		/* 
	    			'scroll' called, but scroller is not moving!
						Probably because the content inside wrapper is small and fits the screen, so drag/scroll is disabled by iScroll.
						Fix this by a hack: Setting "myScroll.hasVerticalScroll=true" tricks iScroll to believe
						that there is a vertical scrollbar, and iScroll will enable dragging/scrolling again...
					*/
	    		this.hasVerticalScroll=true;
	    		startPos = -1000;
	    	} else if ( startPos===-1000 && ((!usePullup && (this.y<0)) || ((!usePulldown) && (this.y>0))) ){
	    		/* 
	    			Scroller was not moving at first (and the trick above was applied), but now it's moving in the wrong direction.
						I.e. the user is either scrolling up while having no "pull-up-bar",
						or scrolling down while having no "pull-down-bar" => Disable the trick again and reset values...
					*/
					this.hasVerticalScroll=false;
					scrollStartPos=0;
					this.scrollBy(0,-this.y, 0);//Adjust scrolling position to undo this "invalid" movement
	    	}

	    	if (usePulldown) {
					if (this.y > pullDownOffset+pullThreshold && !pullDownEl.className.match('flip')) {
						showPullDownElNow('flip');
						this.scrollBy(0,-pullDownOffset, 0);	// Adjust scrolling position to match the change in pullDownEl's margin-top
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
					} else if (this.y < 0 && pullDownEl.className.match('flip')) { // User changes his mind...
						hidePullDownEl(0,false);
						this.scrollBy(0,pullDownOffset, 0);	// Adjust scrolling position to match the change in pullDownEl's margin-top
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
					}
				}

	    })

		},

		methods: {
			reset(){
				console.log('reset');
				this._scroller&&setTimeout(()=>{
					this._scroller.refresh();
				},0);
			}
		},
		events:{
			'scroll-reset': function(uuid){
				console.log('reser')
				this.reset();
			}
		},
		beforeDestroy(){
			this._scroller.destroy();
		}

		
	}
</script>
<style scoped>
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
</style>