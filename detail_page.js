$(function () {
    var pageId = window.location.search.split("=")[1];
    console.log(pageId);
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
                $(".user_name").html(address);
                getNoteInfoById(pageId);
            }
        }
    }

    function getNoteInfoById(pageId){
        console.log(pageId);
        var from = curWallectAdd;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getNoteInfoById";
        var callArgs = "[\"" + pageId + "\"]";
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
        neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            var result = resp.result;   
            console.log("result : " + result);
            result = JSON.parse(result);
            var id = (parseInt(pageId) + 1) % 4;
            var html = "";
            var otherListHtml = '';
            console.log("id : " + id, "pageId:" + pageId);
            for( var i = 0; i < result.ownedUserId.length; i++) {
                otherListHtml += '<div class="bottom-item">' +
                                    '<span class="user f-right">购买者: '+result.ownedUserId[i]+'</span>' +
                                '</div>' ;
            }            
            if(result.totleFee === undefined){
                result.totleFee = 0;
            }

            html = 	'<div class="artical-content">' + 
            '<span style="font-size: 30px;">' + result.title + '</span>' + 
            '<p>此文章价值单价：' + result.fee + ' WAS 总收益：' + result.totleFee + ' WAS</p>' + 
            '<p>' + result.content + '</p>' + 
            '</div>' + 
            otherListHtml;
            console.log(html);
            $("#page-content").append(html);
        
        }).catch(function (err) {
            console.log("error :" + err.message);
        })
    } 

    getWallectInfo();
    

})