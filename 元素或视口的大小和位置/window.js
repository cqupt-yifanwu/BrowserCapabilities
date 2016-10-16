//  1.窗口位置，不同浏览器对screenLeft 和 screenX的支持度不同。
var leftPos = (typeof window.screenLeft == "number") ?
			  window.screenLeft : window.screenX;
var topPos = (typeof window.screenTop == "number") ?
			 window.screenTop : window.screenY;


/*2.视口的大小，部分移动设备浏览器对innerWidth的兼容性不好，需要
 *document.documentElement.clientWidth或者document.body.clientWidth
 *来兼容（混杂模式下对document.documentElement.clientWidth不支持）。
 *使用方法 ： getViewPort().width;
 */
function getViewPort () {
	if(document.compatMode == "BackCompat") {   //浏览器嗅探，混杂模式
		return {
			width: document.body.clientWidth,
			height: document.body.clientHeight
		};
	} else {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		};
	}
}



//3.获得文档的大小（区别与视口）,与上面获取视口大小的方法如出一辙
function getDocumentPort () {
	if(document.compatMode == "BackCompat") {
		return {
			width: document.body.scrollWidth,
			height: document.body.scrollHeight
		};
	} else {
		return {
			width: Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth),
			height: Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight)
		}
	}
}




//4.获得某个元素的偏移量（逐层向上）,相对于文档
function getElementLeft (ele) {
	var actuaLeft = ele.offsetLeft;
	var current = ele.offsetParent;
	while (current !== null) {
		actuaLeft += current.offsetLeft;
		current = current.offsetParent;
	}
}

function getElementTop (ele) {
	var actuaTop = ele.offsetTop;
	var current = ele.offsetParent;
	while (current !== null) {
		actuaTop += current.offsetTop;
		current = current.offsetParent;
	}
}




/*5.确定元素的相对与视口的位置,返回四个属性，left.... 相对于视口
* 浏览器的实现有所不同，ie8以及更早版本认为文档的左上角坐标是(2,2)
* 通过创建一个新元素，然后做差消除这个差异
*/
function getBoundingClientRect (ele) {
	var scrollTop = document.documentElement.scrollTop;
	var scrollLeft = document.documentElement.scrollLeft;
	if(ele.getBoundingClientRect){                //若不存在自带方法,就手动定义一个(大多数浏览器自带这个方法)
         if(typeof arguments.callee.offset != "number") {
         	var temp = document.createElement("div");
         	temp.style.cssText = "position: absolute;left: 0;top: 0;";
         	document.body.appendChild(temp);
         	arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
         	document.body.removeChild(temp);
         	temp = null; // 避免垃圾回收时造成内存空间的浪费
         }
      	 var rect = ele.getBoundingClientRect();
      	 var offset = arguments.callee.offset;
      	 return {
      	 	left: rect.left + offset,
      	 	right: rect.right + offset,
      	 	top: rect.top + offset,
      	 	bottom: rect.bottom + offset
      	 };
	} else {        //若浏览器自带getBoundingClientRect这个方法，只做调整即可
		var actuaTop = getElementTop(ele);  // 借用了4中的方法
		var actuaLeft = getElementLeft(ele);
		return {
			left: actuaLeft - scrollLeft,
			right: actuaLeft + ele.offsetWidth - scrollLeft,
			top: actuaTop - scrollTop,
			bottom: actuaTop +ele.offsetHeight - scrollTop
		}
	}	
}