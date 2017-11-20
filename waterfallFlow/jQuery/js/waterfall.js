$(window).on('load', function () {
    //实现瀑布流
    waterfall('main', 'box');

    //桩数据
    var metaData = {
        'data': [
            {'src': '25.jpg'}, {'src': '26.jpg'}, {'src': '27.jpg'}, {'src': '28.jpg'}
        ]
    };

    //监听滚动条加载更多
    $(window).on('scroll', function () {
        if (checkscrollside()) {
            $.each(metaData.data, function (index, value) {
                var box = $('<div>', {'class': 'box'}).appendTo('#main');
                var pic = $('<div>', {'class': 'pic'}).appendTo(box);
                $('<img>', {'src': './images/' + value.src}).appendTo(pic);
            });
        }

        //重新定位
        waterfall('main', 'box');
    });
});

/**
 * 实现瀑布流
 * @param parent
 * @param box
 */
function waterfall(parent, box) {
    //获取子元素
    var boxes = $('#' + parent + '>div');
    //获取一个块框的宽度
    var width = boxes.eq(0).outerWidth();
    //每行所能容纳的box框个数
    var number = Math.floor($(window).width() / width);
    //设置父级元素集中显示
    $('#' + parent).css({
        'width': number * width,
        'margin': '0 auto'
    });

    //用于存储每列中的所有块框相加的高度
    var boxesHeightArr = [];
    //获取第一行元素的最小高度值
    boxes.each(function (index, value) {
        var boxH = boxes.eq(index).outerHeight();
        if (index < number) {
            boxesHeightArr.push(boxH);
        } else {
            //获取最小高
            var minH = Math.min.apply(null, boxesHeightArr);
            //获取最小高在boxesHeightArr数组的位置
            var minHIndex = $.inArray(minH, boxesHeightArr);
            //定位当前元素到最小高所在列的下面
            $(value).css({
                'position': 'absolute',
                'top': minH,
                'left': boxes.eq(minHIndex).position().left
            });
            //更新boxesHeightArr数组中的高度值
            boxesHeightArr[minHIndex] += boxes.eq(index).outerHeight();
        }
    });
}

/**
 * 检查最后一张图片是否显示一半
 */
function checkscrollside() {
    var boxes = $('#main>div');
    //获取最后一个框的位置
    var lastBoxH = boxes.last().get(0).offsetTop + Math.floor(boxes.last().height() / 2);
    //滚动条滚动的高度
    var scrollTop = $(window).scrollTop();
    //页面的高度
    var documentH = $(window).height();
    return (lastBoxH < scrollTop + documentH) ? true : false;
}