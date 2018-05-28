'use strict';
var JiazhiUserItem = function(text){
    if(text){
       var obj = JSON.parse(text);
       this.addr = obj.addr; //当前用户的钱包地址
       this.token = obj.token; //当前用户拥有的代币数
       this.lastsign = obj.lastsign; //当前用户上一次签到时间（天）
    //    this.ownedListId = obj.ownedListId; //当前用户购买过的帖子ID列表
    }
};

var JiazhiNoteItem = function(text){
    if(text){
       var obj = JSON.parse(text);
       this.id = obj.id; //一个帖子的ID
       this.title = obj.title; //一个帖子的题目
       this.content = obj.content; //帖子内容
       this.author = obj.author; //帖子作者
       this.fee = obj.fee; //帖子的价格
       this.ownedUserId = obj.ownedUserId; //购买该帖子的用户ID列表
    }
};


JiazhiUserItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

var JiazhiUserItems = function () {   
    LocalContractStorage.defineMapProperty(this, "userdata", {
        parse: function (text) {
            return new JiazhiUserItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineMapProperty(this, "notedata", {
        parse: function (text) {
            return new JiazhiNoteItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

JiazhiUserItems.prototype ={
    init:function(){
        this.size = 0
    },

    //刚进来登录或者注册，让userdata拥有当前用户的数据，并且返回用户的token
    loginOrReg:function(){
        var from = Blockchain.transaction.from;
        var jiazhiUserItem = this.userdata.get(from);
        if(jiazhiUserItem){

        }else{
            var jiazhiUserItem = {};
            jiazhiUserItem.addr = from;
            jiazhiUserItem.token = 100;
        }

        this.userdata.put(from,jiazhiUserItem);
        return jiazhiUserItem.token;
    },

    //转token给其他地址
    transferToken:function(toAddr,value){
        var from = Blockchain.transaction.from;
        var jiazhiUserItem = this.userdata.get(from);
        var otherJiazhiUserItem = this.userdata.get(toAddr);
        if(form === toAddr){
            throw new Error("不能自己转给自己哟~");
        }
        if(!otherJiazhiUserItem){
            throw new Error("对方地址必须是在本DAPP登录过的，请重新确认");
        }
        if(!jiazhiUserItem){
            throw new Error("您还没有登录");
        }
        var vaule = parseInt(value);
        if(jiazhiUserItem.token < value){
            throw new Error("您的余额不足~"); 
        }
        jiazhiUserItem.token -= value;
        otherJiazhiUserItem.token += value;

        this.userdata.put(from,jiazhiUserItem);
        this.userdata.put(toAddr,otherJiazhiUserItem);
    },

    //用户签到，获得免费的token
    signToday:function(date){
        var from = Blockchain.transaction.from;
        var jiazhiUserItem = this.userdata.get(from);
        if(!jiazhiUserItem){
            throw new Error("您还没有登录");
        }
        if(date === jiazhiUserItem.lastsign){
            throw new Error("每天只能签到一次~"); 
        }
        jiazhiUserItem.token += 100;
        this.userdata.put(from,jiazhiUserItem);
    },

    //发表一篇新文章
    addANewNote:function(title,content,fee){
        var from = Blockchain.transaction.from;
        var jiazhiUserItem = this.userdata.get(from);
        if(!jiazhiUserItem){
            throw new Error("您还没有登录");
        }

        if(!title || !content){
            throw new Error("标题或内容不能为空")
        }

        if(parseInt(fee) <= 0){
            throw new Error("价格不能小于等于0")
        }
      
        var jiazhiNoteItem = {};
        jiazhiNoteItem.ownedUserId = [];

        var id = 0;
        if(LocalContractStorage.get("id")){
           id = LocalContractStorage.get("id");
        }

        jiazhiNoteItem.id = id;
        jiazhiNoteItem.title = title;
        jiazhiNoteItem.fee = fee;
        jiazhiNoteItem.author = from;
        jiazhiNoteItem.content = content;
        jiazhiNoteItem.ownedUserId.push(from);

        this.notedata.put(id,jiazhiNoteItem);

        this.size = this.size + 1
        LocalContractStorage.set("id", this.size);
    },

    //购买一个帖子
    buyANote:function(id){
        var from = Blockchain.transaction.from;
        var jiazhiUserItem = this.userdata.get(from);
        if(!jiazhiUserItem){
            throw new Error("您还没有登录");
        }
       
        var jiazhiNoteItem = this.notedata.get(id);

        if(jiazhiNoteItem){
            if(jiazhiUserItem.token < jiazhiNoteItem.fee){
                throw new Error("余额不足，不能购买");
            }else{
                jiazhiUserItem.token -= jiazhiNoteItem.fee;
                jiazhiNoteItem.ownedUserId.push(from);
            }

        }else{
            throw new Error("该帖子不存在")
        }
    },

    //获得所有帖子信息
    getAllNoteInfo:function(){
        this.size = LocalContractStorage.get("id", this.size);
        var info = []
        for(var i = 0; i < this.size; i++){
            info.push(this.notedata.get(i))
        }
        return info;
    },

    //获得当前用户信息
    getCurUserInfo:function(){
        var from = Blockchain.transaction.from;
        var jiazhiUserItem = this.userdata.get(from);
        if(!jiazhiUserItem){
            throw new Error("您还没有登录");
        }
        return jiazhiUserItem;
    }
}

module.exports = JiazhiUserItems;