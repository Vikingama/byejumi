define(['jumi', 'nav', 'tab', 'asyncload', 'vue', 'weixin'], function (jumi, nav, tab, asyncload, vue, weixin) {
    new vue({
        el: 'body',
        components: {
            'my-search': {
                template: '#searchTemplate',
                data: function () {
                    return {
                        itemName: "",
                        isTypeSelected: 0,
                        isStatusSelected: 0
                    };
                },
                methods: {
                    typeChoice: function (typeVal) {
                        this.isTypeSelected = typeVal;
                    },
                    statusChoice: function (statusVal) {
                        this.isStatusSelected = statusVal;
                    },
                    btnJump: function () {
                        var itemName = this.itemName;
                        location.href = "/h5/views/main/list.html?type=" + this.isTypeSelected + "&status=" + this.isStatusSelected + "&itemName=" + itemName;
                    }
                }
            }
        },
        ready: function () {
            nav.setActiveNav("index");
            $('.async').asyncload();
            $('#myloading').remove();
            weixin.setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();
        }
    });
});