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
	}
}