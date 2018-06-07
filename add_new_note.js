$(function () {
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n1vi9m7S8Faii7oGp93LBTAZgE8tpAZrGcv";
    nebulas = require("nebulas"), neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
    
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
                $(".user_name").html(address);
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
        console.log("addANewNote : " + callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
                listener: function (resp) {
                    try{
                        if(resp.indexOf("Transaction rejected by user") > 0){
                            alert("您拒绝了合约调用，请重试");
                        }
                    }catch(e){
                        var result = confirm("该贴正在发布到区块链，大约15秒左右发布成功，发布成功后自动前往价值社区主页？");
                        if(result){
                            var hash = resp.txhash;
                            regetTransactionReceipt(hash, function (status) {
                                if(status == 1){
                                    var result2 = confirm("该贴已经发布到区块链，现在前往价值社区主页？");
                                    if(result2) {
                                        window.location.href="index.html";
                                    }
                                }else{
                                    alert('该贴在发布过程中遇到了问题，请重新提交。');
                                }
                            })
                        }
                        
                    }
                }
        }); 
    }
    function regetTransactionReceipt(hash, cb) {
        var task = setInterval(function () {
            getTransactionReceipt(hash, function (resp) {
//                console.log(resp)
                var status = resp.result.status;
                console.log('status:' +status)
                if(status == 1 || status == 0){
                    clearInterval(task);
                    cb(status);
                }
            })
        }, 1000);
    }

    function getTransactionReceipt(hash, cb){
        $.post('https://mainnet.nebulas.io/v1/user/getTransactionReceipt', JSON.stringify({
            "hash": hash
        }), function (resp) {
            console.log(resp);
            cb(resp)
        })
    }

    $(".submit_btn").on("click", function(event) {
        var fee = $(".text-fee").val();
        var title = $(".text-title").val();
        var content = $(".text-content").val();
        console.log(fee, title, content);
        addANewNote(title, content, fee);
    });

})