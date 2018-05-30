$(function () {
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n1zSZpTG7mT3Rx3w42HTjXFUUxG6d1Lr1Gr";
    nebulas = require("nebulas"), neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
    
    NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    nebPay = new NebPay();	
    var myneb = new Neb();
    var nasApi = myneb.api;	

    var curWallectAdd;


    function getWallectInfo() {
        console.log("getWallectInfo");
        window.addEventListener('message', getMessage);
    
        window.postMessage({
            "target": "contentscript",
            "data": {},
            "method": "getAccount",
        }, "*");
    }
    
    function getMessage(e){
        if (e.data && e.data.data) {
            console.log("e.data.data:", e.data.data)
            if (e.data.data.account) {
                var address = e.data.data.account;
                curWallectAdd = address;
                console.log("address="+address);
                $(".text-author").val(address);
            }
        }
    }

    getWallectInfo();

    function addANewNote(title,content,fee){
        if(fee > 99999 || fee < 1){
            alert("文章价值请输入1-99999之间");
            return;
        }
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "addANewNote";
        var callArgs = "[\"" + title + "\",\"" + content + "\",\"" + fee + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
                listener: function (resp) {
                    try{
                        if(resp.indexOf("Transaction rejected by user") > 0){
                            alert("您拒绝了合约调用，请重试");
                        }
                    }catch(e){
                        var result = confirm("活动发布到区块链，大约15秒左右发布成功，是否前往价值社区主页？");
                        if(result){
                            window.location.href="index.html";
                        }
                    }
                        //upadte card status into in progress...
                }
        }); 
    }

    $(".submit_btn").on("click", function(event) {
        var fee = $(".text-fee").val();
        var title = $(".text-title").val();
        var content = $(".text-content").val();
        console.log(fee, title, content);
        addANewNote(title, content, fee);
    });

})