	function addClass(element,className){
		element.classList.add(className);
	}
	function removeClass(element,className){
		element.classList.remove(className);
	}
	function containClass(element,className){
		return element.classList.contains(className);
	}
	
	/**
	 * A pulldown to refresh plugin for xscroll.
	 * @constructor
	 * @param {object} cfg
	 * @param {number} cfg.height
	 * @param {string} cfg.content default html for pulldown
	 * @param {string} cfg.downContent html for pulldown when scrollTop is smaller than cfg.height
	 * @param {string} cfg.upContent html for pulldown when scrollTop is larger than cfg.height
	 * @param {string} cfg.loadingContent html for pulldown when released
	 * @param {string} cfg.clsPrefix  class prefix which default value is "vue-iscroll-pulldown-"
	 */
	class Pulldown{
		constructor(cfg){
			if (self.__isRender) return;
			self.__isRender = true;

			this.cfg = cfg;
			this.render(cfg);
	
			return this;
		}
		render(cfg){
			let containerCls = cfg.clsPrefix + "container";
			let height = cfg.height || 60;
			let pulldown = this.pulldown = this.element = document.createElement("div");
			pulldown.className = containerCls;
			pulldown.style.width = "100%";
			pulldown.style.height = height + "px";
			pulldown.style.lineHeight = height + "px";
			pulldown.style.textAlign = "center";

			addClass(pulldown,cfg.clsPrefix+'up');
			this.status = 'up';
			cfg.container.insertBefore(pulldown,cfg.container.firstChild);

			pulldown.innerHTML = cfg["content"];
		}
		_changeStatus(status){
			let prevVal = this.status;
			this.status = status;
			console.log("pre:"+ prevVal+";after:"+status)
			removeClass(this.pulldown, this.cfg.clsPrefix + prevVal)
			addClass(this.pulldown, this.cfg.clsPrefix + status);
			
			//状态变更，更改HTML
			this.pulldown.innerHTML = this.cfg[this.status + "Content"] || this.cfg.content;console.log(this.pulldown.innerHTML)
		}
		pull(){
			let status = 'up';
			this._changeStatus(status);
		}
		release(){
			let status = 'down';
			this._changeStatus(status);
		}
		loading(){
			let status = 'loading';
			this.pulldown.style.marginTop = '';
			this.pulldown.style.transitionDuration = '';
			this._changeStatus(status);

			//ajax to fetch data
			setTimeout(()=>{
				this._changeStatus('up')
			},3000)
		}
		
	}

	class Pullup {
		constructor(cfg){
			if (self.__isRender) return;
			self.__isRender = true;

			this.cfg = cfg;
			this.render(cfg);
	
			return this;
		}
		render(cfg){
			let containerCls = cfg.clsPrefix + "container";
			let height = cfg.height || 60;
			let pullup = this.pullup = this.element = document.createElement("div");
			pullup.className = containerCls;
			pullup.style.width = "100%";
			pullup.style.height = height + "px";
			pullup.style.lineHeight = height + "px";
			pullup.style.textAlign = "center";

			addClass(pullup,cfg.clsPrefix+'down');
			this.status = 'down';
			cfg.container.appendChild(pullup);

			pullup.innerHTML = cfg["content"];
		}
	}
	export {
		Pulldown,
		Pullup,
		addClass,
		removeClass,
		containClass
	}