# MSSIframe V2.0

这个版本可以自适应手机

这是个做好的后台管理框架的最外面一层iframe嵌套，喜欢的人可以下载去用，不会的可以联系我

我不是什么大神，封装的能用，但不是最好，介意的别看.不介意的想用的自行下载.

对iframe提供了3种方法


    //这里就是调用顶级父窗口打开页面的方法
    top.MSS_Iframe.openIframe({
            title:"打开一个新窗口",
            url:"...",
            key:"Q123"//需要和外部所有的ID不一致，如果有重复，会帮你加个时间戳
    });

    
    //这里是关闭对应key的
    top.MSS_Iframe.closeIframe("Q123");


    //这里是关闭对应key的
    top.MSS_Iframe.sendMsg({
            text: "我是发送的信息，我延迟关闭",
            location: "bottom,right",//位置有4种 top,bottom 在前 left,right 在后
            secs: 3//秒，延时消失时间
    });
    background: "#ff7e00",//自定义背景
    color: "#ffffff",//自定义颜色
