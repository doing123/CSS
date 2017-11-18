/**
 * 获取所有box块框元素
 * @param parent
 * @param className
 * @return
 */

function getClassObj(parent, className) {
    //获得父级元素的所有子集
    var obj = parent.getElementsByTagName('*');
    //用于保存符合条件的子元素
    var boxArr = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        if (obj[i].className === className) {
            boxArr.push(obj[i]);
        }
    }
    return boxArr;
}

/**
 * 获取最小高度值得元素在数组中的位置索引
 * @param arr
 * @param minH
 * @returns {string}
 */
function getMinHIndex(arr, minH) {
    for (var j in arr) {
        if (arr[j] === minH) {
            return j;
        }
    }
}

/**
 * 瀑布流定位
 * @param parent  所有图片的父容器元素 '#main'
 * @param box     每一个图片的包裹元素 '.box'
 */
function waterfall(parent, box) {
    //获取父容器元素
    var oParent = document.getElementById(parent);

    //获取存储块box的数组
    // var boxArr = oParent.getElementsByClassName(box);
    //封装方法获取box块框元素数组集合
    var boxArr = getClassObj(oParent, box);

    //一个块框的宽度
    var width = boxArr[0].offsetWidth;
    //每行中能容纳的box个数
    var number = Math.floor(document.documentElement.clientWidth / width);

    //设置父级居中样式
    oParent.style.cssText = 'width:' + number * width + 'px;margin: 0 auto;';

    /**
     * 实现瀑布流：使下一个元素放在高度最小的一列下面
     */
    //用于存储每列中所有块框相加的高度
    var boxHeightArr = [];
    //遍历boxArr中的数组元素
    for (var i = 0; i < boxArr.length; i++) {
        //初始值为第一行每列的高度
        var boxHeight = boxArr[i].offsetHeight;
        if (i < number) {
            //添加第一行中number个块框到boxHeightArr数组
            boxHeightArr.push(boxHeight);
        } else {
            //apply强行调用Math.min()方法获得最小高度， apply第二个参数为数组
            var minH = Math.min.apply(null, boxHeightArr);
            //获得最小高度所在列
            var minHIndex = getMinHIndex(boxHeightArr, minH);

            //设置绝对位移
            boxArr[i].style.position = 'absolute';
            boxArr[i].style.top = minH + 'px';
            boxArr[i].style.left = boxArr[minHIndex].offsetLeft + 'px';
            //更新当前列的高度： 数组最小高度元素值minH + 当前定位的元素boxArr[i]块框高
            boxHeightArr[minHIndex] += boxArr[i].offsetHeight;
        }
    }
}

/**
 *检查滚动事件触发的条件是否成立：滚动高度+窗口高度 > 最后一个元素的top高度+自身的高度
 */
function checkscrollside() {
    //获取父级元素
    var oParent = document.getElementById('main');
    //获取所有子元素box
    var boxes = getClassObj(oParent, 'box');
    //最后一个元素的高度 + 自身高度的一半
    var lastBoxH = boxes[boxes.length - 1].offsetTop +
        Math.floor(boxes[boxes.length - 1].offsetHeight / 2);
    //滚动的高  怪异模式||标准模式
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    //页面的高
    var documentH = document.documentElement.clientHeight;
    return (documentH + scrollTop > lastBoxH) ? true : false;
}

window.onload = function () {
    //元素作瀑布流处理函数
    waterfall('main', 'box');

    //桩数据
    var metaData = {
        'data': [
            {'src': '25.jpg'}, {'src': '26.jpg'}, {'src': '27.jpg'}, {'src': '28.jpg'}
        ]
    };

    //滚动条滚动事件
    window.onscroll = function () {
        //当最后一张图片显示出一半时新增数据
        if (checkscrollside()) {
            //获取父级对象，插入新元素
            var oParent = document.getElementById('main');
            for (var i = 0, len = metaData.data.length; i < len; i++) {
                /*var divBox = document.createElement('div');
                 divBox.className = 'box';
                 oParent.appendChild(divBox);
                 var divPic = document.createElement('div');
                 divPic.className = 'pic';
                 divBox.appendChild(divPic);
                 var img = document.createElement('img');
                 img.src = './images/' + metaData.data[i].src;
                 divPic.appendChild(img);*/
                //使用文档片段
                var frag = document.createDocumentFragment();
                var divBox = document.createElement('div');
                divBox.className = 'box';
                var divPic = document.createElement('div');
                divPic.className = 'pic';
                divBox.appendChild(divPic);
                var img = document.createElement('img');
                img.src = './images/' + metaData.data[i].src;
                divPic.appendChild(img);
                frag.appendChild(divBox);
                oParent.appendChild(frag);
            }
        }
        waterfall('main', 'box');
    };
};
