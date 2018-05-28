$(function () {
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n1tS7itsoTZZLVyWy5xtpHBitUxDuFDFyvc";
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
            }
        }
       
    }


    function getAllNoteInfo(){
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getAllNoteInfo";
        var callArgs = "";
        // console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;   
        console.log("getAllNoteInfo result : " + result);
        result = JSON.parse(result);
        setItemsProperties(result);
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
   }

   function loginOrReg(){
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "loginOrReg";
        var callArgs = "";
        // console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;   
        console.log("loginOrReg result : " + result);
        result = JSON.parse(result);
        
        getAllNoteInfo();
        getWallectInfo()
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
    }

   function setItemsProperties(itemList) {
        console.log(itemList);
        var html = "";
        for(var i = 0, iLen = itemList.length; i < iLen; i++) {
            randomIndex = (i + 1) % 4;
            // var i = Math.random();
            // var randomIndex = Math.ceil(i*30);
            console.log("randomIndex:" + randomIndex);
            // randomIndex = 1;
            html += 
            '<li onclick="location.href=\'single-page.html\';">' + 
            '<img src="images/img' + randomIndex + '.jpg" width="200" height="200">' + 
            '<div class="post-info">' + 
                '<div class="post-basic-info">' + 
                    '<h3><a href="#">' + itemList[i].title + '</a></h3>' +
                    '<span><a href="#"><label> </label>Movies</a></span>' + 
                    '<p>' + itemList[i].content + '</p>' + 
                '</div>' + 
                '<div class="post-info-rate-share">' + 
                    '<div class="rateit">' + 
                        '<span> </span>' + 
                    '</div>' + 
                    '<div class="post-share">' + 
                        '<span> </span>' + 
                    '</div>' + 
                    '<div class="clear"> </div>' + 
                '</div>' + 
            '</div>' + 
        '</li>';

            console.log(html);
        }
        $('#tiles').append(html);
   }

    $(".market_page .button.small.yellow").on("click", function(event) {
        var currentIndex = event.currentTarget.id;
        console.log("currentIndex:" + currentIndex + " text:" + $(".market_page .button.small.yellow span")[currentIndex].innerHTML);
        if($(".market_page .button.small.yellow span")[currentIndex].innerHTML === "求赠送"){
            bootbox.prompt("请给对方填写1个赠送给你的理由~", function(result){
                console.log(result); 
                if(result !== null && result !== ""){
                   var currentIndex = event.currentTarget.id;
                   console.log("currentIndex:" + currentIndex);
                   requestAHuluwa(currentIndex, result);
                }
           });
        }else{
            ownAHuluwa(currentIndex);
        }
    });

    loginOrReg();
})