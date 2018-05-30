$(function () {
    var pageId = window.location.search.split("=")[1];
    console.log(pageId);
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
                                    '<span class="user f-right">参与者： <a href="#">'+result.ownedUserId[i]+'</a><img src="images/ava-1.jpg"></span>' +
                                '</div>' ;
            }
            // html = '<div class="container">' +
            //             '<center><article>' +
            //                 '<a class="example-image-link" href="images/'+ id +'.jpg" data-lightbox="example-set" data-title=""><img class="example-image" src="images/'+id+'.jpg" alt=""/></a>' +
            //                 '<div class="content-item">' +
            //                     '<h3 class="title-item"><a href="#">'+result.title+'</a></h3>' +
            //                     '<div class="time"> '+result.fee+'</div>' +
            //                     '<p class="info">'+result.content+'</p>' +
            //                 '</div>' +
            //                 '<div class="bottom-item">' +
            //                     '<a class="btn btn-share share" id="join">我要参加</a>' +
            //                     '<span class="user f-right">发起者： <a href="#">'+result.author+'</a><img src="images/ava-1.jpg"></span>' +
            //                 '</div>' +
            //                 otherListHtml +
            //             '</article></center>' +
            //         '</div>';
            
            if(result.totleFee === undefined){
                result.totleFee = 0;
            }

            html = 	'<div class="artical-content">' + 
            '<img src="images/single-post-pic.jpg" title="banner1">' + 
            '<h3>' + result.title + '</h3>' + 
            '<p>此文章价值单价：' + result.fee + ' WAS 总收益：' + result.totleFee + ' WAS</p>' + 
            '<p>' + result.content + '</p>' + 
            '</div>' + 
            '<div class="artical-links">' + 
               '<ul>' + 
                   '<li><img src="images/blog-icon2.png" title="Admin"><span>admin</span></a></li>' + 
                   '<li><img src="images/blog-icon3.png" title="Comments"><span>No comments</span></a></li>' + 
                   '<li><img src="images/blog-icon4.png" title="Lables"><span>View posts</span></a></li>' + 
               '</ul>' + 
          '</div>' + otherListHtml;
            console.log(html);
            $("#page-content").append(html);
        
        }).catch(function (err) {
            console.log("error :" + err.message);
        })
    } 

    getWallectInfo();
    

})