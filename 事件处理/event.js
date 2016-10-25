//将所有的方法添加到一个名叫EventUtil的对象中
var EventUtil = {
	/* 1. 跨浏览器的事件处理程序，只做到事件的添加与移除，没有完全解决ie下
	* 存在的问题（事件处理程序的作用域不是被绑定的元素而是全局、添加多个事件时
	* 触发的顺序与其他浏览器相反、只可以在事件冒泡的阶段添加）
	*/
	addHandler: function (element,type,handler) {
		if (element.addEventListener) {               //DOM2级方法
			element.addEventListener(type, handler, false);  // 默认在冒泡阶段触发
		} else if (element.attachEvent) {             //ie下的方法
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;           //DOM0级方法
		}
	},
	removeHandler: function (element,type,handler) {
		if (element.removeEventListener) {               
			element.removeEventListener(type, handler, false);  
		} else if (element.detachEvent) {             
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;           
		}
	},     // 注意这个逗号，作为对象的方法


	/* 2.跨浏览器的事件对象，ie与DOM的事件不同，可是ie中事件对象包含的信息在DOM中事件对象全都有
	* 只不过是实现方式不同（事件目标、取消默认行为、取消冒泡）
	*/
	getEvent: function (event) {
		return event ? event : window.event;
	},
	getTarget: function (event) {         // 事件目标
		return event.target || event.scrElement;
	},
	preventDefault: function (event) {    //取消默认行为
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	stopPropagation: function (event) {    //取消冒泡
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},


	/* 3.相关元素的兼容（相关元素：在发生mousemove和mouseout事件时会涉及更多的元素，比如mouseover
	* 进入一个元素时事件的主目标就是获得光标的元素，而相关元素就是市区光标的元素）在ie8以前下不支
	* 持event的relatedTarget，但是在ie中mouseover事件触发时ie的formElement保存着相关元素的信息，在
	* mouseout事件触发时toElement保存。
	*/
	getRelatedTarget: function (event) {
		if (event.relatedTarget) {
			return event.relatedTarget;
		} else if (event.formElement) {
			return event.formElement;
		} else if (event.toElement) {
			return event.toElement;
		} else {
			return null;
		}
	},


	/* 4. 滚轮事件中的wheelDalta属性（滚轮转动一下就有一个固定值），火狐下不存在，它对应的属性是detail(与
	* wheelDalta属性中的值不一样)在opera中与其他浏览器中值相反 
	*/
	getWheelDelta: function (event) {
		if (event.wheelDelta) { 
			return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
		} else {
			return -event.detail * 40;
		}
	},


	/* 5.字符编码属性的兼容，这个属性只有在发生keypress时才会包含值（按键值所对应的ascll编码）,ie8以及以前
	* 和opera则是在keyCode中保存字符的ASCLL码。
	*/
	getCharCode: function (event) {
		if (typeof event.charCode == "number") {
			return event.charCode;
		} else {
			return event.keyCode;
		}
	},


	/* 6.比较生僻的对象，在发生复制事件的时候，要访问剪贴板中的数据可访问clipboardData对象，在ie中它存在在windows
	*  中，在ff、safari、chrome中存在于event中,此方法是 clipboardData.getData()、clipboardData.setData() 的兼容办法。
	*/
	getClipboardText = function (event) {
		var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData();
	},
	setClipboardText = function (event,value) {
		if (event.clipboardData) {
			return event.clipboardData.setData("text/plain",value);
		} else if (window.clipboardData) {
			return window.clipboardData.setData("text",value);
		}
	}
 }
