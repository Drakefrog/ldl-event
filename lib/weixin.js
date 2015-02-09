$(function () {
    $("#slide-5-share-btn").click(function(){
         $('.cover').fadeIn(100);
    });

    $('.cover').click(function(event) { 
            $('.cover').fadeOut(100);
    });
});

d3.select("#slide-5-share-btn")
.on('click',  function(event) {
    d3.select(".cover").fadeIn(100);;
    /* Act on the event */
});;


function loadWeixin(imageName) {
    //显示一个引导图片  
    // document.body.innerHTML = '<div style="position:absolute;width:100%;height:100%;background-image:url(img/' + imageName + ');background-repeat:no-repeat;background-size:cover;"></div>';


    //              需要分享的内容，请放到ready里
    WeixinApi.ready(function(Api) {
        var shareContent = "乐动力钜献，天天酷跑豪华礼包任性送，更有滴滴打车券！"
        // // 微信分享的数据
        var wxData = {
            "appId": "", // 服务号可以填写appId
            "imgUrl": "http://pp.myapp.com/ma_icon/0/icon_10099632_19884097_1418872977/96",
            "link": "http://lightapp.ledongli.cn/timi_ldl/",
            "desc": shareContent,
            "title": "天天酷跑年度豪华礼包来袭"
        };

        // 分享的回调
        var wxCallbacks = {
            // 分享操作开始之前
            ready: function() {
                // 你可以在这里对分享的数据进行重组
                // alert("准备分享");
            },
            // 分享被用户自动取消
            cancel: function(resp) {
                // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
                // alert("分享被取消");
            },
            // 分享失败了
            fail: function(resp) {
                // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
                // alert("分享失败");
            },
            // 分享成功
            confirm: function(resp) {
                // 分享成功了，我们是不是可以做一些分享统计呢？
                // alert("分享成功");
                window.location.href="http://diditaxi.com.cn/activity/hongbao/op_redpacket/home?channel=cac8eaa40cdccf0348c7e0cbf5243a01";
            },
            // 整个分享过程结束
            all: function(resp) {
                // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
                // alert("分享结束");
            }
        };



        // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
        Api.shareToFriend(wxData, wxCallbacks);

        // 点击分享到朋友圈，会执行下面这个代码
        Api.shareToTimeline(wxData, wxCallbacks);

        // 点击分享到腾讯微博，会执行下面这个代码
        Api.shareToWeibo(wxData, wxCallbacks);

        // 有可能用户是直接用微信“扫一扫”打开的，这个情况下，optionMenu、toolbar都是off状态
        // 为了方便用户测试，我先来trigger show一下
        // optionMenu
        var elOptionMenu = document.getElementById('optionMenu');
        elOptionMenu.click(); // 先隐藏
        elOptionMenu.click(); // 再显示
        // toolbar
        var elToolbar = document.getElementById('toolbar');
        elToolbar.click(); // 先隐藏
        elToolbar.click(); // 再显示
    });

}
